"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MonitorX,
  Users,
  MessageSquare,
  PhoneOff,
  Hand,
  Smile,
  Copy,
  X,
  Send,
  Crown,
  UserX,
  Pin,
  PinOff,
  Maximize,
  Minimize,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types & config                                                      */
/* ------------------------------------------------------------------ */

type Role = "host" | "participant";
type Me = { id: string; name: string; role: Role };
type MeetingInfo = { title: string; code: string; hostName: string; startedAt: string };

type PeerInfo = {
  peerId: string;
  userId: string;
  name: string;
  isHost: boolean;
  audio: boolean;
  video: boolean;
  screen: boolean;
  hand: boolean;
};
type RemotePeer = PeerInfo & { cam?: MediaStream; screenStream?: MediaStream };
type ChatMsg = { id: string; peerId: string; name: string; isHost: boolean; text: string; at: string };
type Reaction = { id: string; name: string; emoji: string };

type PcRecord = { pc: RTCPeerConnection; queue: RTCIceCandidateInit[]; initiator: boolean };

// Transceiver slots — every connection is negotiated once with these 3 slots,
// afterwards tracks are swapped with replaceTrack() so no renegotiation is needed.
const SLOT_AUDIO = 0;
const SLOT_CAMERA = 1;
const SLOT_SCREEN = 2;

const ICE_SERVERS: RTCIceServer[] = [
  { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
  ...(process.env.NEXT_PUBLIC_TURN_URL
    ? [
        {
          // One or more TURN URLs separated by commas
          urls: process.env.NEXT_PUBLIC_TURN_URL.split(",").map((u) => u.trim()).filter(Boolean),
          username: process.env.NEXT_PUBLIC_TURN_USERNAME,
          credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
        },
      ]
    : []),
];

const socketUrl = () => {
  const fallback = `${window.location.protocol}//${window.location.hostname}:3001`;
  const configured = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (!configured) return fallback;
  try {
    // The Next.js site itself can never be the socket server — ignore a misconfigured value
    if (new URL(configured).origin === window.location.origin) return fallback;
  } catch {
    return fallback;
  }
  return configured;
};

const REACTIONS = ["👍", "👏", "❤️", "😂", "😮", "🎉"];

const initials = (name: string) =>
  name
    .replace(/^(Dr|Prof)\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const avatarColor = (seed: string) => {
  const colors = ["bg-blue-600", "bg-emerald-600", "bg-violet-600", "bg-amber-600", "bg-rose-600", "bg-cyan-600", "bg-indigo-600"];
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return colors[h % colors.length];
};

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function VideoEl({ stream, muted, mirror, contain, className }: { stream?: MediaStream | null; muted?: boolean; mirror?: boolean; contain?: boolean; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.srcObject !== (stream ?? null)) el.srcObject = stream ?? null;
    if (stream) el.play().catch(() => {});
  }, [stream]);
  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted={muted}
      className={cn("w-full h-full", contain ? "object-contain" : "object-cover", mirror && "-scale-x-100", className)}
    />
  );
}

/** True while the given audio stream is above a speaking threshold. */
function useSpeaking(stream: MediaStream | null | undefined, enabled: boolean) {
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => {
    if (!stream || !enabled || !stream.getAudioTracks().length) {
      setSpeaking(false);
      return;
    }
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx: AudioContext = new Ctx();
    let source: MediaStreamAudioSourceNode;
    try {
      source = ctx.createMediaStreamSource(new MediaStream(stream.getAudioTracks()));
    } catch {
      ctx.close();
      return;
    }
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    const timer = setInterval(() => {
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (const v of data) sum += v;
      setSpeaking(sum / data.length > 18);
    }, 200);
    return () => {
      clearInterval(timer);
      source.disconnect();
      ctx.close().catch(() => {});
    };
  }, [stream, enabled]);
  return speaking;
}

function Tile({
  name,
  stream,
  videoOn,
  audioOn,
  isHost,
  hand,
  isLocal,
  pinned,
  onPin,
  small,
}: {
  name: string;
  stream?: MediaStream | null;
  videoOn: boolean;
  audioOn: boolean;
  isHost: boolean;
  hand: boolean;
  isLocal?: boolean;
  pinned?: boolean;
  onPin?: () => void;
  small?: boolean;
}) {
  const speaking = useSpeaking(stream, audioOn);
  return (
    <div
      className={cn(
        "group relative w-full h-full bg-[#2b2b2b] rounded-xl overflow-hidden ring-2 transition-all",
        speaking ? "ring-emerald-400" : "ring-transparent"
      )}
    >
      {/* The video element stays mounted so remote audio keeps playing when the camera is off */}
      <VideoEl stream={stream} muted={isLocal} mirror={isLocal} className={cn(!videoOn && "invisible")} />
      {!videoOn && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "rounded-full flex items-center justify-center text-white font-black shadow-lg",
              avatarColor(name),
              small ? "w-12 h-12 text-base" : "w-20 h-20 md:w-24 md:h-24 text-2xl md:text-3xl"
            )}
          >
            {initials(name) || "?"}
          </div>
        </div>
      )}

      {hand && (
        <div className="absolute top-2 left-2 bg-amber-400 text-black rounded-lg px-2 py-1 text-xs font-bold flex items-center gap-1 shadow">
          <Hand size={14} /> {small ? "" : "Hand raised"}
        </div>
      )}

      {onPin && (
        <button
          onClick={onPin}
          title={pinned ? "Unpin" : "Pin"}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-black/60 hover:bg-black/80 text-white rounded-lg p-1.5 cursor-pointer"
        >
          {pinned ? <PinOff size={14} /> : <Pin size={14} />}
        </button>
      )}

      <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5">
        <div className="max-w-full bg-black/60 text-white text-xs rounded-md px-2 py-1 flex items-center gap-1.5 truncate">
          {audioOn ? <Mic size={12} className={cn(speaking && "text-emerald-400")} /> : <MicOff size={12} className="text-red-400" />}
          {isHost && <Crown size={12} className="text-amber-400 shrink-0" />}
          <span className="truncate">
            {name}
            {isLocal ? " (You)" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  onClick,
  active = true,
  danger,
  label,
  icon: Icon,
  badge,
  highlight,
}: {
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  label: string;
  icon: React.ElementType;
  badge?: number;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-medium transition cursor-pointer min-w-[64px]",
        highlight ? "text-emerald-400 hover:bg-white/10" : "text-gray-200 hover:bg-white/10"
      )}
    >
      <span
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          danger || !active ? "bg-red-500/90 text-white" : "bg-white/10"
        )}
      >
        <Icon size={20} />
      </span>
      <span className="whitespace-nowrap">{label}</span>
      {!!badge && (
        <span className="absolute top-0 right-2 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function MeetingRoom({ code, apiBase, backHref }: { code: string; apiBase: string; backHref: string }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<"loading" | "prejoin" | "joining" | "room" | "ended" | "error">("loading");
  const [errorText, setErrorText] = useState("");
  const [meeting, setMeeting] = useState<MeetingInfo | null>(null);
  const [me, setMe] = useState<Me | null>(null);

  // Local media
  const localStreamRef = useRef<MediaStream>(null as unknown as MediaStream);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [handUp, setHandUp] = useState(false);
  const [mediaError, setMediaError] = useState("");

  // Network
  const socketRef = useRef<Socket | null>(null);
  const pcsRef = useRef(new Map<string, PcRecord>());
  const [peers, setPeers] = useState<Record<string, RemotePeer>>({});
  const [selfPeerId, setSelfPeerId] = useState("");

  // UI
  const [panel, setPanel] = useState<"none" | "people" | "chat">("none");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [unread, setUnread] = useState(0);
  const [chatText, setChatText] = useState("");
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [showReactions, setShowReactions] = useState(false);
  const [pinned, setPinned] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState("00:00");
  const [fullscreen, setFullscreen] = useState(false);
  const panelRef = useRef(panel);
  panelRef.current = panel;
  const micOnRef = useRef(micOn);
  micOnRef.current = micOn;
  const camOnRef = useRef(camOn);
  camOnRef.current = camOn;
  const joinedRef = useRef(false);
  const endingRef = useRef(false);
  const pendingCandidatesRef = useRef(new Map<string, RTCIceCandidateInit[]>());
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isHost = me?.role === "host";

  /* ---------- helpers ---------- */

  const patchPeer = useCallback((peerId: string, patch: Partial<RemotePeer>) => {
    setPeers((prev) => (prev[peerId] ? { ...prev, [peerId]: { ...prev[peerId], ...patch } } : prev));
  }, []);

  const sendState = useCallback((patch: Partial<PeerInfo>) => {
    socketRef.current?.emit("meeting:state", patch);
  }, []);

  /** Swap the track in one slot for every peer connection. */
  const setSlotTrack = useCallback((slot: number, track: MediaStreamTrack | null) => {
    pcsRef.current.forEach(({ pc }) => {
      const t = pc.getTransceivers()[slot];
      if (t) t.sender.replaceTrack(track).catch(() => {});
    });
  }, []);

  const stopAllMedia = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenTrackRef.current?.stop();
    screenTrackRef.current = null;
  }, []);

  const closeAllConnections = useCallback(() => {
    pcsRef.current.forEach(({ pc }) => pc.close());
    pcsRef.current.clear();
    setPeers({});
  }, []);

  /* ---------- 1. load meeting info ---------- */

  useEffect(() => {
    setMounted(true);
    fetch(`${apiBase}/${encodeURIComponent(code)}`)
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error || "Unable to open meeting");
        setMeeting(json.meeting);
        setMe(json.me);
        setStage("prejoin");
      })
      .catch((e) => {
        setErrorText(e.message);
        setStage("error");
      });
  }, [apiBase, code]);

  /* ---------- 2. get camera + mic for the preview ---------- */

  useEffect(() => {
    if (stage !== "prejoin" || localStreamRef.current) return;
    let cancelled = false;
    (async () => {
      const md = navigator.mediaDevices;
      if (!md?.getUserMedia) {
        setMediaError("Camera/microphone need a secure connection (https or localhost).");
        localStreamRef.current = new MediaStream();
        setLocalStream(localStreamRef.current);
        setMicOn(false);
        setCamOn(false);
        return;
      }
      let stream: MediaStream | null = null;
      const attempts: MediaStreamConstraints[] = [
        { audio: { echoCancellation: true, noiseSuppression: true }, video: { width: { ideal: 1280 }, height: { ideal: 720 } } },
        { audio: { echoCancellation: true, noiseSuppression: true } },
        { video: true },
      ];
      for (const c of attempts) {
        try {
          stream = await md.getUserMedia(c);
          break;
        } catch {
          /* try next */
        }
      }
      if (cancelled) {
        stream?.getTracks().forEach((t) => t.stop());
        return;
      }
      stream = stream || new MediaStream();
      if (!stream.getAudioTracks().length) setMicOn(false);
      if (!stream.getVideoTracks().length) setCamOn(false);
      if (!stream.getTracks().length) setMediaError("No camera or microphone access. You can still join and watch.");
      localStreamRef.current = stream;
      setLocalStream(stream);
    })();
    return () => {
      cancelled = true;
    };
  }, [stage]);

  // Stop everything when leaving the page
  useEffect(() => {
    const pcs = pcsRef.current;
    return () => {
      socketRef.current?.emit("meeting:leave");
      socketRef.current?.disconnect();
      pcs.forEach(({ pc }) => pc.close());
      pcs.clear();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenTrackRef.current?.stop();
    };
  }, []);

  /* ---------- 3. peer connections ---------- */

  const currentTrack = (slot: number): MediaStreamTrack | null => {
    const ls = localStreamRef.current;
    if (slot === SLOT_AUDIO) return ls?.getAudioTracks()[0] ?? null;
    if (slot === SLOT_CAMERA) return ls?.getVideoTracks()[0] ?? null;
    return screenTrackRef.current;
  };

  const attachRemoteStreams = (peerId: string, pc: RTCPeerConnection) => {
    const tx = pc.getTransceivers();
    if (tx.length < 3) return;
    const cam = new MediaStream([tx[SLOT_AUDIO].receiver.track, tx[SLOT_CAMERA].receiver.track]);
    const screenStream = new MediaStream([tx[SLOT_SCREEN].receiver.track]);
    patchPeer(peerId, { cam, screenStream });
  };

  const createPc = (peerId: string, initiator: boolean): PcRecord => {
    const socket = socketRef.current!;
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    const rec: PcRecord = { pc, queue: [], initiator };
    pcsRef.current.set(peerId, rec);

    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit("meeting:signal", { to: peerId, data: { candidate: e.candidate.toJSON() } });
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" && rec.initiator) pc.restartIce();
    };

    // Candidates that arrived before this connection existed
    const early = pendingCandidatesRef.current.get(peerId);
    if (early) {
      rec.queue.push(...early);
      pendingCandidatesRef.current.delete(peerId);
    }

    if (initiator) {
      pc.onnegotiationneeded = async () => {
        try {
          await pc.setLocalDescription(await pc.createOffer());
          socket.emit("meeting:signal", { to: peerId, data: { description: pc.localDescription } });
        } catch (err) {
          console.error("offer failed", err);
        }
      };
      // Offerer defines the 3 slots: mic, camera, screen
      pc.addTransceiver(currentTrack(SLOT_AUDIO) ?? "audio", { direction: "sendrecv" });
      pc.addTransceiver(currentTrack(SLOT_CAMERA) ?? "video", { direction: "sendrecv" });
      pc.addTransceiver(currentTrack(SLOT_SCREEN) ?? "video", { direction: "sendrecv" });
      attachRemoteStreams(peerId, pc);
    }
    return rec;
  };

  const flushQueue = async (rec: PcRecord) => {
    for (const c of rec.queue.splice(0)) await rec.pc.addIceCandidate(c).catch(() => {});
  };

  const handleSignal = async ({ from, data }: { from: string; data: any }) => {
    try {
      let rec = pcsRef.current.get(from);
      if (data.description) {
        const desc: RTCSessionDescriptionInit = data.description;
        if (desc.type === "offer") {
          const isNew = !rec;
          if (!rec) rec = createPc(from, false);
          await rec.pc.setRemoteDescription(desc);
          if (isNew) {
            const tx = rec.pc.getTransceivers();
            for (let i = 0; i < tx.length && i < 3; i++) {
              tx[i].direction = "sendrecv";
              await tx[i].sender.replaceTrack(currentTrack(i));
            }
            attachRemoteStreams(from, rec.pc);
          }
          await rec.pc.setLocalDescription(await rec.pc.createAnswer());
          socketRef.current?.emit("meeting:signal", { to: from, data: { description: rec.pc.localDescription } });
          await flushQueue(rec);
        } else if (rec) {
          await rec.pc.setRemoteDescription(desc);
          await flushQueue(rec);
        }
      } else if (data.candidate) {
        if (!rec) {
          const list = pendingCandidatesRef.current.get(from) || [];
          list.push(data.candidate);
          pendingCandidatesRef.current.set(from, list);
        } else if (!rec.pc.remoteDescription) {
          rec.queue.push(data.candidate);
        } else {
          await rec.pc.addIceCandidate(data.candidate).catch(() => {});
        }
      }
    } catch (err) {
      console.error("signal error", err);
    }
  };

  const removePeer = (peerId: string) => {
    pcsRef.current.get(peerId)?.pc.close();
    pcsRef.current.delete(peerId);
    pendingCandidatesRef.current.delete(peerId);
    setPeers((prev) => {
      const copy = { ...prev };
      delete copy[peerId];
      return copy;
    });
    setPinned((p) => (p === peerId ? null : p));
  };

  /* ---------- 4. join ---------- */

  const leave = useCallback(
    (reason?: string) => {
      socketRef.current?.emit("meeting:leave");
      socketRef.current?.disconnect();
      socketRef.current = null;
      closeAllConnections();
      stopAllMedia();
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      if (reason) {
        setErrorText(reason);
        setStage("ended");
      } else {
        router.push(backHref);
      }
    },
    [backHref, closeAllConnections, router, stopAllMedia]
  );

  const join = () => {
    if (!me || !meeting) return;
    setStage("joining");
    const url = socketUrl();
    const socket = io(url, { transports: ["websocket", "polling"], reconnection: true });
    socketRef.current = socket;

    const doJoin = () => {
      socket.emit(
        "meeting:join",
        { code: meeting.code, userId: me.id, name: me.name, role: me.role, audio: micOnRef.current, video: camOnRef.current },
        (res: { ok: boolean; error?: string; self?: PeerInfo; peers?: PeerInfo[]; history?: ChatMsg[] }) => {
          if (!res?.ok) {
            socket.disconnect();
            setErrorText(res?.error || "Could not join the meeting.");
            setStage("error");
            return;
          }
          // (Re)connect: drop stale connections and offer to everyone already in the room
          pcsRef.current.forEach(({ pc }) => pc.close());
          pcsRef.current.clear();
          setSelfPeerId(res.self!.peerId);
          // chat messages saved earlier in this meeting (e.g. after a refresh or rejoin)
          if (res.history?.length) setMessages(res.history);
          const map: Record<string, RemotePeer> = {};
          for (const p of res.peers || []) map[p.peerId] = { ...p };
          setPeers(map);
          for (const p of res.peers || []) createPc(p.peerId, true);
          // Re-send current state (a reconnect resets it on the server)
          socket.emit("meeting:state", { audio: micOnRef.current, video: camOnRef.current, screen: !!screenTrackRef.current, hand: false });
          setHandUp(false);
          joinedRef.current = true;
          setStage("room");
        }
      );
    };

    socket.on("connect", doJoin);
    socket.on("connect_error", () => {
      if (!joinedRef.current) {
        toast.error(`Cannot reach the meeting server at ${url}. Is "npm run chat" running?`, { id: "sock" });
      }
    });

    socket.on("meeting:peer-joined", (p: PeerInfo) => {
      setPeers((prev) => ({ ...prev, [p.peerId]: { ...prev[p.peerId], ...p } }));
      toast(`${p.name} joined`, { icon: "👋", id: `join-${p.peerId}` });
      // The newcomer sends us an offer; we answer in handleSignal
    });
    socket.on("meeting:peer-left", ({ peerId }: { peerId: string }) => removePeer(peerId));
    socket.on("meeting:signal", handleSignal);
    socket.on("meeting:state", (p: PeerInfo) => {
      setPeers((prev) => {
        const old = prev[p.peerId];
        if (!old) return prev;
        if (!old.hand && p.hand) toast(`${p.name} raised their hand`, { icon: "✋" });
        return { ...prev, [p.peerId]: { ...old, ...p } };
      });
    });
    socket.on("meeting:chat", (m: ChatMsg) => {
      setMessages((prev) => [...prev, m]);
      if (panelRef.current !== "chat") {
        setUnread((u) => u + 1);
        if (m.peerId !== socket.id) toast(`${m.name}: ${m.text.slice(0, 60)}`, { icon: "💬" });
      }
    });
    socket.on("meeting:reaction", (r: { peerId: string; name: string; emoji: string }) => {
      const id = `${Date.now()}-${Math.random()}`;
      setReactions((prev) => [...prev, { id, name: r.name, emoji: r.emoji }]);
      setTimeout(() => setReactions((prev) => prev.filter((x) => x.id !== id)), 3500);
    });
    socket.on("meeting:host-action", ({ action }: { action: string }) => {
      if (action === "mute") {
        const t = localStreamRef.current?.getAudioTracks()[0];
        if (t) t.enabled = false;
        setMicOn(false);
        socket.emit("meeting:state", { audio: false });
        toast("The host muted you", { icon: "🔇" });
      } else if (action === "stop-video") {
        turnCameraOff();
        toast("The host turned off your camera", { icon: "📷" });
      } else if (action === "lower-hand") {
        setHandUp(false);
        socket.emit("meeting:state", { hand: false });
      } else if (action === "remove") {
        leave("You were removed from the meeting by the host.");
      }
    });
    socket.on("meeting:ended", () => {
      if (!endingRef.current) leave("The host has ended this meeting.");
    });
    socket.on("meeting:kicked", ({ reason }: { reason: string }) => leave(reason));
  };

  /* ---------- 5. controls ---------- */

  const toggleMic = async () => {
    let track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
        track = s.getAudioTracks()[0];
        localStreamRef.current.addTrack(track);
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
        setSlotTrack(SLOT_AUDIO, track);
        setMicOn(true);
        sendState({ audio: true });
        return;
      } catch {
        toast.error("Microphone permission denied");
        return;
      }
    }
    track.enabled = !micOn;
    setMicOn(!micOn);
    sendState({ audio: !micOn });
  };

  function turnCameraOff() {
    const ls = localStreamRef.current;
    ls?.getVideoTracks().forEach((t) => {
      t.stop();
      ls.removeTrack(t);
    });
    setSlotTrack(SLOT_CAMERA, null);
    setLocalStream(ls ? new MediaStream(ls.getTracks()) : null);
    setCamOn(false);
    socketRef.current?.emit("meeting:state", { video: false });
  }

  const toggleCam = async () => {
    if (camOn) return turnCameraOff();
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } } });
      const track = s.getVideoTracks()[0];
      localStreamRef.current.addTrack(track);
      setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
      setSlotTrack(SLOT_CAMERA, track);
      setCamOn(true);
      sendState({ video: true });
    } catch {
      toast.error("Camera permission denied or camera in use");
    }
  };

  const stopShare = useCallback(() => {
    screenTrackRef.current?.stop();
    screenTrackRef.current = null;
    setScreenStream(null);
    setSlotTrack(SLOT_SCREEN, null);
    sendState({ screen: false });
  }, [sendState, setSlotTrack]);

  const toggleShare = async () => {
    if (screenTrackRef.current) return stopShare();
    const sharer = Object.values(peers).find((p) => p.screen);
    if (sharer) {
      toast.error(`${sharer.name} is already sharing their screen`);
      return;
    }
    if (!navigator.mediaDevices?.getDisplayMedia) {
      toast.error("Screen sharing is not supported in this browser");
      return;
    }
    try {
      const s = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: { ideal: 15 } }, audio: false });
      const track = s.getVideoTracks()[0];
      track.contentHint = "detail";
      track.onended = () => stopShare(); // user clicked the browser's "Stop sharing"
      screenTrackRef.current = track;
      setScreenStream(s);
      setSlotTrack(SLOT_SCREEN, track);
      sendState({ screen: true });
      setPinned(null);
    } catch {
      /* user cancelled */
    }
  };

  const toggleHand = () => {
    setHandUp(!handUp);
    sendState({ hand: !handUp });
  };

  const sendReaction = (emoji: string) => {
    socketRef.current?.emit("meeting:reaction", { emoji });
    setShowReactions(false);
  };

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatText.trim();
    if (!text) return;
    socketRef.current?.emit("meeting:chat", { text });
    setChatText("");
  };

  const hostAction = (action: string, to?: string) => socketRef.current?.emit("meeting:host-action", { action, to });

  const endForAll = async () => {
    if (!window.confirm("End this meeting for everyone?")) return;
    endingRef.current = true;
    socketRef.current?.emit("meeting:end");
    await fetch(`${apiBase}/${encodeURIComponent(code)}`, { method: "PATCH" }).catch(() => {});
    leave();
  };

  const copyInvite = () => {
    const text = `Join "${meeting?.title}" — meeting code: ${meeting?.code}`;
    navigator.clipboard?.writeText(meeting?.code || "").then(
      () => toast.success("Meeting code copied"),
      () => toast(text)
    );
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  /* ---------- effects for UI ---------- */

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    if (stage !== "room") return;
    const start = Date.now();
    const t = setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      const h = Math.floor(s / 3600);
      const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      setElapsed(h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`);
    }, 1000);
    return () => clearInterval(t);
  }, [stage]);

  useEffect(() => {
    if (panel === "chat") {
      setUnread(0);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [panel, messages]);

  /* ---------- derived layout ---------- */

  const remoteList = useMemo(() => Object.values(peers).sort((a, b) => Number(b.isHost) - Number(a.isHost) || a.name.localeCompare(b.name)), [peers]);
  const remoteSharer = remoteList.find((p) => p.screen);
  const iAmSharing = !!screenStream;
  const pinnedPeer = pinned ? peers[pinned] : undefined;
  const raisedHands = remoteList.filter((p) => p.hand).length + (handUp ? 1 : 0);
  const total = remoteList.length + 1;

  /* ---------- render ---------- */

  if (!mounted) return null;

  const portal = (children: React.ReactNode) =>
    createPortal(<div className="fixed inset-0 z-[100] bg-[#1a1a1a] text-white font-sans">{children}</div>, document.body);

  if (stage === "loading") {
    return portal(
      <>
        <div className="h-full flex items-center justify-center gap-3 text-gray-300">
          <Loader2 className="animate-spin" /> Loading meeting...
        </div>
      </>
    );
  }

  if (stage === "error" || stage === "ended") {
    return portal(
      <>
        <div className="h-full flex flex-col items-center justify-center gap-5 px-6 text-center">
          <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", stage === "ended" ? "bg-blue-600" : "bg-red-600")}>
            {stage === "ended" ? <PhoneOff size={28} /> : <ShieldAlert size={28} />}
          </div>
          <h1 className="text-2xl font-bold">{stage === "ended" ? "Meeting ended" : "Unable to join"}</h1>
          <p className="text-gray-400 max-w-md">{errorText}</p>
          <button onClick={() => router.push(backHref)} className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl font-bold cursor-pointer">
            Back to meetings
          </button>
        </div>
      </>
    );
  }

  if (stage === "prejoin" || stage === "joining") {
    return portal(
      <>
        <div className="h-full overflow-y-auto flex items-center justify-center p-6">
          <div className="w-full max-w-5xl grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#2b2b2b] shadow-2xl">
                <VideoEl stream={localStream} muted mirror className={cn(!camOn && "invisible")} />
                {!camOn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400">
                    <div className={cn("w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white", avatarColor(me?.name || ""))}>
                      {initials(me?.name || "")}
                    </div>
                    Camera is off
                  </div>
                )}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                  <button
                    onClick={toggleMic}
                    className={cn("w-12 h-12 rounded-full flex items-center justify-center cursor-pointer", micOn ? "bg-white/20 hover:bg-white/30" : "bg-red-500")}
                    title={micOn ? "Mute" : "Unmute"}
                  >
                    {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                  <button
                    onClick={toggleCam}
                    className={cn("w-12 h-12 rounded-full flex items-center justify-center cursor-pointer", camOn ? "bg-white/20 hover:bg-white/30" : "bg-red-500")}
                    title={camOn ? "Stop video" : "Start video"}
                  >
                    {camOn ? <Video size={20} /> : <VideoOff size={20} />}
                  </button>
                </div>
              </div>
              {mediaError && <p className="text-amber-400 text-sm mt-3">{mediaError}</p>}
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">{isHost ? "You are the host" : `Hosted by ${meeting?.hostName}`}</p>
                <h1 className="text-3xl font-bold">{meeting?.title}</h1>
                <button onClick={copyInvite} className="mt-2 text-sm text-gray-400 hover:text-white flex items-center gap-2 cursor-pointer">
                  Code: <span className="font-mono text-white">{meeting?.code}</span> <Copy size={14} />
                </button>
              </div>
              <p className="text-gray-400 text-sm">
                Joining as <span className="text-white font-semibold">{me?.name}</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={join}
                  disabled={stage === "joining" || !localStream}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  {stage === "joining" && <Loader2 size={18} className="animate-spin" />}
                  {isHost ? "Start meeting" : "Join now"}
                </button>
                <button onClick={() => leave()} className="px-5 py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ---------- in-room ---------- */

  const localTile = (small?: boolean) => (
    <Tile name={me?.name || "You"} stream={localStream} videoOn={camOn} audioOn={micOn} isHost={!!isHost} hand={handUp} isLocal small={small} />
  );

  const remoteTile = (p: RemotePeer, small?: boolean) => (
    <Tile
      name={p.name}
      stream={p.cam}
      videoOn={p.video}
      audioOn={p.audio}
      isHost={p.isHost}
      hand={p.hand}
      small={small}
      pinned={pinned === p.peerId}
      onPin={() => setPinned(pinned === p.peerId ? null : p.peerId)}
    />
  );

  // What goes on the big stage (if anything)
  let stageEl: React.ReactNode = null;
  if (remoteSharer) {
    stageEl = (
      <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
        <VideoEl stream={remoteSharer.screenStream} muted contain />
        <div className="absolute top-3 left-3 bg-black/70 text-xs rounded-md px-2.5 py-1 flex items-center gap-1.5">
          <MonitorUp size={14} className="text-emerald-400" /> {remoteSharer.name} is sharing their screen
        </div>
      </div>
    );
  } else if (iAmSharing) {
    stageEl = (
      <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
        <VideoEl stream={screenStream} muted contain className="opacity-40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="bg-emerald-600 rounded-full p-4">
            <MonitorUp size={28} />
          </div>
          <p className="text-lg font-semibold">You are sharing your screen</p>
          <button onClick={stopShare} className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-xl font-bold cursor-pointer">
            Stop sharing
          </button>
        </div>
      </div>
    );
  } else if (pinnedPeer) {
    stageEl = remoteTile(pinnedPeer);
  }

  // Gallery grid columns
  const cols = total <= 1 ? 1 : total <= 4 ? 2 : total <= 9 ? 3 : total <= 16 ? 4 : 5;

  return portal(
    <>
      <div className="h-full flex flex-col">
        {/* Top bar */}
        <div className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-white/5 bg-[#111]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
            <h1 className="font-semibold truncate">{meeting?.title}</h1>
            <span className="text-gray-400 text-sm font-mono shrink-0">{elapsed}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <button onClick={copyInvite} className="hidden sm:flex items-center gap-1.5 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg px-3 py-1.5 cursor-pointer">
              <span className="font-mono">{meeting?.code}</span> <Copy size={14} />
            </button>
            <button onClick={toggleFullscreen} className="text-gray-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 cursor-pointer" title="Full screen">
              {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* Video area */}
          <div className="relative flex-1 min-w-0 p-3">
            {stageEl ? (
              <div className="h-full flex flex-col lg:flex-row gap-3">
                <div className="flex-1 min-h-0 min-w-0">{stageEl}</div>
                <div className="lg:w-56 shrink-0 flex lg:flex-col gap-3 overflow-auto no-scrollbar">
                  <div className="w-44 lg:w-full aspect-video shrink-0">{localTile(true)}</div>
                  {remoteList
                    .filter((p) => !(pinnedPeer && p.peerId === pinnedPeer.peerId && !remoteSharer && !iAmSharing))
                    .map((p) => (
                      <div key={p.peerId} className="w-44 lg:w-full aspect-video shrink-0">
                        {remoteTile(p, true)}
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div
                className="h-full grid gap-3 auto-rows-fr"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
              >
                {total === 1 ? (
                  <div className="relative">
                    {localTile()}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 rounded-lg px-4 py-2 text-sm text-gray-200">
                      {isHost ? "Waiting for students to join..." : "Waiting for others to join..."}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="min-h-0">{localTile()}</div>
                    {remoteList.map((p) => (
                      <div key={p.peerId} className="min-h-0">
                        {remoteTile(p)}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Floating reactions */}
            <div className="pointer-events-none absolute bottom-4 left-4 flex flex-col-reverse gap-2">
              {reactions.map((r) => (
                <div key={r.id} className="bg-black/70 rounded-full px-3 py-1.5 flex items-center gap-2 animate-bounce">
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-xs text-gray-200">{r.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Side panel */}
          {panel !== "none" && (
            <aside className="w-80 shrink-0 bg-[#222] border-l border-white/5 flex flex-col">
              <div className="h-12 flex items-center justify-between px-4 border-b border-white/5">
                <h2 className="font-semibold">{panel === "chat" ? "Chat" : `Participants (${total})`}</h2>
                <button onClick={() => setPanel("none")} className="text-gray-400 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {panel === "people" ? (
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {isHost && remoteList.length > 0 && (
                    <button
                      onClick={() => {
                        hostAction("mute-all");
                        toast.success("Muted everyone");
                      }}
                      className="w-full mb-2 bg-white/10 hover:bg-white/20 rounded-lg py-2 text-sm font-semibold cursor-pointer"
                    >
                      Mute all
                    </button>
                  )}
                  {[
                    { peerId: selfPeerId, name: me?.name || "You", isHost: !!isHost, audio: micOn, video: camOn, hand: handUp, self: true },
                    ...remoteList.map((p) => ({ ...p, self: false })),
                  ].map((p) => (
                    <div key={p.peerId || "self"} className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0", avatarColor(p.name))}>
                        {initials(p.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">
                          {p.name}
                          {p.self ? " (You)" : ""}
                        </p>
                        {p.isHost && <p className="text-[11px] text-amber-400">Host</p>}
                      </div>
                      {p.hand && <Hand size={16} className="text-amber-400" />}
                      {p.audio ? <Mic size={16} className="text-gray-400" /> : <MicOff size={16} className="text-red-400" />}
                      {p.video ? <Video size={16} className="text-gray-400" /> : <VideoOff size={16} className="text-red-400" />}
                      {isHost && !p.self && (
                        <div className="hidden group-hover:flex items-center gap-1">
                          {p.hand && (
                            <button onClick={() => hostAction("lower-hand", p.peerId)} title="Lower hand" className="p-1 rounded hover:bg-white/10 cursor-pointer">
                              <Hand size={14} />
                            </button>
                          )}
                          {p.audio && (
                            <button onClick={() => hostAction("mute", p.peerId)} title="Mute" className="p-1 rounded hover:bg-white/10 cursor-pointer">
                              <MicOff size={14} />
                            </button>
                          )}
                          {p.video && (
                            <button onClick={() => hostAction("stop-video", p.peerId)} title="Stop video" className="p-1 rounded hover:bg-white/10 cursor-pointer">
                              <VideoOff size={14} />
                            </button>
                          )}
                          <button onClick={() => hostAction("remove", p.peerId)} title="Remove" className="p-1 rounded hover:bg-red-500/30 text-red-400 cursor-pointer">
                            <UserX size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {messages.length === 0 && <p className="text-center text-sm text-gray-500 mt-10">No messages yet</p>}
                    {messages.map((m) => {
                      const mine = m.peerId === selfPeerId;
                      return (
                        <div key={m.id} className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
                          <p className="text-[11px] text-gray-400 mb-0.5">
                            {mine ? "You" : m.name}
                            {m.isHost && !mine ? " · Host" : ""} ·{" "}
                            {new Date(m.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                          <div className={cn("max-w-[85%] rounded-2xl px-3 py-2 text-sm break-words", mine ? "bg-blue-600" : "bg-white/10")}>{m.text}</div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>
                  <form onSubmit={sendChat} className="p-3 border-t border-white/5 flex gap-2">
                    <input
                      value={chatText}
                      onChange={(e) => setChatText(e.target.value)}
                      placeholder="Message everyone..."
                      className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 rounded-lg px-3 cursor-pointer">
                      <Send size={16} />
                    </button>
                  </form>
                </>
              )}
            </aside>
          )}
        </div>

        {/* Toolbar */}
        <div className="shrink-0 bg-[#111] border-t border-white/5 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center">
            <ControlButton onClick={toggleMic} active={micOn} label={micOn ? "Mute" : "Unmute"} icon={micOn ? Mic : MicOff} />
            <ControlButton onClick={toggleCam} active={camOn} label={camOn ? "Stop Video" : "Start Video"} icon={camOn ? Video : VideoOff} />
          </div>

          <div className="flex items-center">
            <ControlButton onClick={() => setPanel(panel === "people" ? "none" : "people")} label="Participants" icon={Users} badge={raisedHands || undefined} />
            <ControlButton onClick={() => setPanel(panel === "chat" ? "none" : "chat")} label="Chat" icon={MessageSquare} badge={unread || undefined} />
            <ControlButton onClick={toggleShare} label={iAmSharing ? "Stop Share" : "Share Screen"} icon={iAmSharing ? MonitorX : MonitorUp} highlight />
            <ControlButton onClick={toggleHand} label={handUp ? "Lower Hand" : "Raise Hand"} icon={Hand} highlight={handUp} />
            <div className="relative">
              <ControlButton onClick={() => setShowReactions(!showReactions)} label="Reactions" icon={Smile} />
              {showReactions && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#2b2b2b] rounded-xl p-2 flex gap-1 shadow-xl">
                  {REACTIONS.map((e) => (
                    <button key={e} onClick={() => sendReaction(e)} className="text-2xl hover:scale-125 transition p-1 cursor-pointer">
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isHost && (
              <button onClick={endForAll} className="bg-red-600 hover:bg-red-500 rounded-xl px-4 py-2 text-sm font-bold whitespace-nowrap cursor-pointer">
                End for All
              </button>
            )}
            <button onClick={() => leave()} className="bg-white/10 hover:bg-red-600 rounded-xl px-4 py-2 text-sm font-bold whitespace-nowrap cursor-pointer flex items-center gap-2">
              <PhoneOff size={16} /> Leave
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
