/**
 * Realtime hub for chat messages and online-class (WebRTC) signaling.
 *
 * Runs inside a Vercel Function (app/api/realtime/route.ts) and, locally, inside
 * scripts/realtime-dev.ts. Vercel may run several function instances and every
 * WebSocket is pinned to one of them, so all shared state (meeting rooms) lives in
 * Redis and every event goes through a Redis pub/sub channel that all instances read.
 * Without REDIS_URL it falls back to in-memory state (fine for a single local process).
 *
 * Wire format (JSON both ways): { ev: string, data?: any, ack?: number }
 * Server replies to an ack with { ev: "__ack", ack, data }.
 */
import type { WebSocket } from "ws";
import mongoose from "mongoose";
import dbConnect from "../db";
import Message from "../../models/Message";
import Meeting from "../../models/Meeting";
import Student from "../../models/Student";
import Teacher from "../../models/Teacher";
import { getStore, type Participant, type BusMessage } from "./store";

/** Peers that have not pinged for this long are treated as gone. */
const STALE_MS = 60_000;
/** After a socket closes without "meeting:leave", wait this long for a reconnect before announcing the peer left. */
const GRACE_MS = 15_000;

interface Identity {
  id: string;
  name: string;
  kind: "student" | "teacher";
  sectionId?: string;
}

interface Conn {
  ws: WebSocket;
  peerId: string;
  /** Users this socket is signed in as, resolved from the session cookies on connect. */
  identities: Map<string, Identity>;
  userId: string | null;
  meetingCode: string | null;
}

function parseCookies(header: string | null | undefined) {
  const out: Record<string, string> = {};
  for (const part of (header || "").split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    try {
      out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
    } catch {}
  }
  return out;
}

/** Same lookups as lib/studentAuth.ts and lib/teacherAuth.ts, but from a raw Cookie header. */
async function resolveIdentities(cookieHeader: string | null | undefined) {
  const jar = parseCookies(cookieHeader);
  const ids = new Map<string, Identity>();
  if (!jar.student_session && !jar.teacher_session) return ids;
  await dbConnect();
  if (jar.student_session) {
    const s: any = await Student.findOne({ studentId: jar.student_session }).lean();
    if (s) ids.set(s.studentId, { id: s.studentId, name: s.name, kind: "student", sectionId: s.sectionId ? String(s.sectionId) : undefined });
  }
  if (jar.teacher_session) {
    const t: any = await Teacher.findOne({ teacherId: jar.teacher_session }).lean();
    if (t) ids.set(t.teacherId, { id: t.teacherId, name: t.name, kind: "teacher" });
  }
  return ids;
}

// Connections held by THIS instance, by peerId
const conns = new Map<string, Conn>();
let busReady: Promise<void> | null = null;

function send(c: Conn, ev: string, data?: unknown) {
  if (c.ws.readyState === 1) c.ws.send(JSON.stringify({ ev, data }));
}

/** Deliver a bus message to the matching connections on this instance. */
function deliver(m: BusMessage) {
  for (const c of conns.values()) {
    if (m.ex && c.peerId === m.ex) continue;
    const match =
      (m.t === "peer" && c.peerId === m.k) ||
      (m.t === "user" && c.userId === m.k) ||
      (m.t === "room" && c.meetingCode === m.k);
    if (!match) continue;
    if (m.ev === "__leave-room") {
      if (c.meetingCode === m.k2) c.meetingCode = null;
      continue;
    }
    send(c, m.ev, m.data);
  }
}

function ensureBus() {
  if (!busReady) busReady = getStore().subscribe(deliver);
  return busReady;
}

const emit = (m: BusMessage) => getStore().publish(m);
const toPeer = (peerId: string, ev: string, data?: unknown) => emit({ t: "peer", k: peerId, ev, data });
const toRoom = (code: string, ev: string, data?: unknown, ex?: string) => emit({ t: "room", k: code, ev, data, ex });

async function removeFromRoom(code: string, peerId: string, announce = true) {
  await getStore().roomDel(code, peerId);
  await emit({ t: "peer", k: peerId, ev: "__leave-room", k2: code });
  if (announce) await toRoom(code, "meeting:peer-left", { peerId });
}

/** Room members, dropping (and announcing) any whose instance died without cleanup. */
async function livePeers(code: string): Promise<Record<string, Participant>> {
  const all = await getStore().roomGetAll(code);
  const now = Date.now();
  for (const [pid, p] of Object.entries(all)) {
    if (now - (p.seen || 0) > STALE_MS) {
      delete all[pid];
      await removeFromRoom(code, pid);
    }
  }
  return all;
}

const publicInfo = ({ seen: _seen, ...p }: Participant) => p;

async function meetingHistory(code: string) {
  try {
    const rows = await mongoose.connection
      .db!.collection("meetingmessages")
      .find({ code })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    return rows.reverse().map((r) => ({
      id: String(r._id),
      peerId: r.userId,
      name: r.name,
      isHost: !!r.isHost,
      text: r.text,
      at: new Date(r.createdAt).toISOString(),
    }));
  } catch (e) {
    console.error("meeting chat history error", (e as Error).message);
    return [];
  }
}

type Handler = (c: Conn, data: any) => Promise<unknown> | unknown;

const handlers: Record<string, Handler> = {
  // ---------------- Direct messages ----------------
  join(c, userId) {
    if (typeof userId === "string" && c.identities.has(userId.trim())) c.userId = userId.trim();
  },

  async sendMessage(c, data) {
    const { senderId, receiverId, text } = data || {};
    const sender = typeof senderId === "string" ? c.identities.get(senderId) : undefined;
    if (!sender) return send(c, "error", { message: "Not signed in" });
    if (!receiverId || typeof text !== "string" || !text.trim()) return;
    const senderName = sender.name;
    try {
      await dbConnect();
      const doc = await Message.create({ senderId, senderName, receiverId, text });
      const msg = {
        _id: doc._id.toString(),
        senderId,
        senderName,
        receiverId,
        text,
        createdAt: doc.createdAt,
      };
      await emit({ t: "user", k: String(receiverId).trim(), ev: "receiveMessage", data: msg });
      send(c, "messageSent", msg);
    } catch (err) {
      console.error("Error saving message:", err);
      send(c, "error", { message: "Failed to send message" });
    }
  },

  // ---------------- Video meetings (WebRTC signaling) ----------------
  async "meeting:join"(c, payload) {
    const { code, userId, audio, video, resume } = payload || {};
    const who = typeof userId === "string" ? c.identities.get(userId) : undefined;
    if (!who) return { ok: false, error: "Please sign in again." };
    try {
      await dbConnect();
      const meeting: any = await Meeting.findOne({ code }).lean();
      if (!meeting || meeting.status !== "live") return { ok: false, error: "This meeting is not live." };
      // Same rules as /api/teacher/meetings/[code] and /api/student/meetings/[code]
      const isHost = who.kind === "teacher" && meeting.hostId === who.id;
      const invited =
        who.kind === "student" && (meeting.sectionIds || []).some((id: unknown) => String(id) === who.sectionId);
      if (!isHost && !invited) return { ok: false, error: "You are not invited to this meeting" };
      const name = who.name;
      const store = getStore();

      if (c.meetingCode && c.meetingCode !== code) await removeFromRoom(c.meetingCode, c.peerId);

      const room = await livePeers(code);
      const already = room[c.peerId];

      // Same user opened the meeting in another tab: kick the old one
      for (const [pid, p] of Object.entries(room)) {
        if (pid !== c.peerId && p.userId === userId) {
          await toPeer(pid, "meeting:kicked", { reason: "You joined from another tab." });
          await removeFromRoom(code, pid);
          delete room[pid];
        }
      }

      const participant: Participant = {
        peerId: c.peerId,
        userId,
        name: name || "Guest",
        isHost,
        audio: !!audio,
        video: !!video,
        screen: already?.screen ?? false,
        hand: already?.hand ?? false,
        seen: Date.now(),
      };
      await store.roomSet(code, c.peerId, participant);
      c.meetingCode = code;
      delete room[c.peerId];

      // A reconnect of someone already in the room is silent; everyone else announces themselves
      if (!(resume && already)) await toRoom(code, "meeting:peer-joined", publicInfo(participant), c.peerId);

      return {
        ok: true,
        self: publicInfo(participant),
        peers: Object.values(room).map(publicInfo),
        history: resume ? [] : await meetingHistory(code),
      };
    } catch (err) {
      console.error("meeting:join error", err);
      return { ok: false, error: "Could not join meeting." };
    }
  },

  /** Heartbeat: keeps this peer alive and tells the client who is still in the room. */
  async "meeting:ping"(c) {
    const code = c.meetingCode;
    if (!code) return { ok: false };
    const store = getStore();
    const room = await livePeers(code);
    const me = room[c.peerId];
    if (!me) return { ok: false };
    me.seen = Date.now();
    await store.roomSet(code, c.peerId, me);
    return { ok: true, peers: Object.keys(room).filter((p) => p !== c.peerId) };
  },

  async "meeting:signal"(c, { to, data } = {}) {
    if (!c.meetingCode || !to) return;
    await toPeer(to, "meeting:signal", { from: c.peerId, data });
  },

  async "meeting:state"(c, patch) {
    const code = c.meetingCode;
    if (!code) return;
    const store = getStore();
    const p = (await store.roomGetAll(code))[c.peerId];
    if (!p) return;
    for (const key of ["audio", "video", "screen", "hand"] as const) {
      if (patch && key in patch) p[key] = !!patch[key];
    }
    p.seen = Date.now();
    await store.roomSet(code, c.peerId, p);
    await toRoom(code, "meeting:state", publicInfo(p), c.peerId);
  },

  async "meeting:chat"(c, { text } = {}) {
    const code = c.meetingCode;
    if (!code || !text || !String(text).trim()) return;
    const p = (await getStore().roomGetAll(code))[c.peerId];
    if (!p) return;
    const clean = String(text).slice(0, 2000);
    await dbConnect();
    mongoose.connection
      .db!.collection("meetingmessages")
      .insertOne({ code, userId: p.userId, name: p.name, isHost: p.isHost, text: clean, createdAt: new Date() })
      .catch((e) => console.error("meeting chat save error", e.message));
    await toRoom(code, "meeting:chat", {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      peerId: c.peerId,
      name: p.name,
      isHost: p.isHost,
      text: clean,
      at: new Date().toISOString(),
    });
  },

  async "meeting:reaction"(c, { emoji } = {}) {
    const code = c.meetingCode;
    if (!code || !emoji) return;
    const p = (await getStore().roomGetAll(code))[c.peerId];
    if (!p) return;
    await toRoom(code, "meeting:reaction", { peerId: c.peerId, name: p.name, emoji: String(emoji).slice(0, 8) });
  },

  // Host-only controls: mute someone, stop their camera, remove them, lower hand, mute all
  async "meeting:host-action"(c, { action, to } = {}) {
    const code = c.meetingCode;
    if (!code) return;
    const room = await getStore().roomGetAll(code);
    if (!room[c.peerId]?.isHost) return;
    if (action === "mute-all") return toRoom(code, "meeting:host-action", { action: "mute" }, c.peerId);
    if (!to || !room[to]) return;
    await toPeer(to, "meeting:host-action", { action });
    if (action === "remove") await removeFromRoom(code, to);
  },

  async "meeting:end"(c) {
    const code = c.meetingCode;
    if (!code) return;
    const store = getStore();
    if (!(await store.roomGetAll(code))[c.peerId]?.isHost) return;
    await dbConnect();
    await Meeting.updateOne({ code, status: "live" }, { status: "ended", endedAt: new Date() }).catch(() => {});
    await toRoom(code, "meeting:ended");
    await emit({ t: "room", k: code, ev: "__leave-room", k2: code });
    await store.roomDrop(code);
  },

  async "meeting:leave"(c) {
    const code = c.meetingCode;
    if (!code) return;
    c.meetingCode = null;
    await removeFromRoom(code, c.peerId);
  },
};

/** Wire one accepted WebSocket into the hub. */
export async function attachSocket(ws: WebSocket, rawPeerId: string | null, cookieHeader: string | null | undefined) {
  const peerId = rawPeerId && /^[\w-]{6,64}$/.test(rawPeerId) ? rawPeerId : crypto.randomUUID();
  const c: Conn = { ws, peerId, identities: new Map(), userId: null, meetingCode: null };

  // A reconnect of the same peer on this instance replaces the old socket
  const old = conns.get(peerId);
  if (old && old.ws !== ws) {
    c.userId = old.userId;
    c.meetingCode = old.meetingCode;
    try {
      old.ws.close(4000, "replaced");
    } catch {}
  }
  conns.set(peerId, c);

  // Queue messages that arrive while the Redis subscription is being set up
  const backlog: string[] = [];
  let ready = false;

  const handle = async (raw: string) => {
    let msg: { ev?: string; data?: unknown; ack?: number };
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }
    const fn = msg.ev && handlers[msg.ev];
    if (!fn) return;
    try {
      const result = await fn(c, msg.data);
      if (msg.ack != null && ws.readyState === 1) ws.send(JSON.stringify({ ev: "__ack", ack: msg.ack, data: result ?? null }));
    } catch (err) {
      console.error(`realtime handler ${msg.ev} failed`, err);
    }
  };

  ws.on("message", (data) => {
    const raw = data.toString();
    if (ready) handle(raw);
    else backlog.push(raw);
  });

  ws.on("close", () => {
    if (conns.get(peerId) === c) conns.delete(peerId);
    const code = c.meetingCode;
    if (!code) return;
    // Give the client a moment to reconnect (e.g. the function hit its max duration) before announcing it left
    const closedAt = Date.now();
    setTimeout(async () => {
      try {
        if (conns.has(peerId)) return; // reconnected to this instance
        const p = (await getStore().roomGetAll(code))[peerId];
        if (p && (p.seen || 0) < closedAt) await removeFromRoom(code, peerId);
      } catch {}
    }, GRACE_MS);
  });

  ws.on("error", (err) => console.error("realtime socket error", err.message));

  try {
    c.identities = await resolveIdentities(cookieHeader);
  } catch (err) {
    console.error("realtime auth failed", err);
  }
  if (!c.identities.size) {
    if (conns.get(peerId) === c) conns.delete(peerId);
    ws.close(4401, "not signed in");
    return;
  }

  try {
    await ensureBus();
  } catch (err) {
    busReady = null;
    console.error("realtime bus failed", err);
    ws.close(1011, "realtime backend unavailable");
    return;
  }
  ready = true;
  send(c, "__hello", { peerId });
  for (const raw of backlog.splice(0)) await handle(raw);
}
