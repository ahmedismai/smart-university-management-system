import Redis from "ioredis";

export interface Participant {
  peerId: string;
  userId: string;
  name: string;
  isHost: boolean;
  audio: boolean;
  video: boolean;
  screen: boolean;
  hand: boolean;
  /** Last time this peer joined, pinged or changed state (ms). */
  seen: number;
}

/** One event routed to connections on every instance: a peer, all sockets of a user, or a meeting room. */
export interface BusMessage {
  t: "peer" | "user" | "room";
  k: string;
  ev: string;
  data?: unknown;
  /** peerId to skip (the sender). */
  ex?: string;
  /** For the internal "__leave-room" event: the room code to leave. */
  k2?: string;
}

export interface Store {
  publish(m: BusMessage): Promise<void>;
  subscribe(handler: (m: BusMessage) => void): Promise<void>;
  roomGetAll(code: string): Promise<Record<string, Participant>>;
  roomSet(code: string, peerId: string, p: Participant): Promise<void>;
  roomDel(code: string, peerId: string): Promise<void>;
  roomDrop(code: string): Promise<void>;
}

// Separate namespaces so local dev, preview and production never see each other's events
const NS = `sums:rt:${process.env.VERCEL_ENV || "dev"}`;
const CHANNEL = `${NS}:bus`;
const roomKey = (code: string) => `${NS}:room:${code}`;
const ROOM_TTL_S = 24 * 60 * 60;

class RedisStore implements Store {
  private cmd: Redis;
  private sub: Redis;
  private handler: ((m: BusMessage) => void) | null = null;
  private subscribed: Promise<void> | null = null;

  constructor(url: string) {
    const opts = { maxRetriesPerRequest: 3, enableReadyCheck: true };
    this.cmd = new Redis(url, opts);
    this.sub = new Redis(url, opts);
    for (const r of [this.cmd, this.sub]) r.on("error", (e) => console.error("redis error", e.message));
    this.sub.on("message", (_ch, raw) => {
      try {
        this.handler?.(JSON.parse(raw));
      } catch {}
    });
  }

  async publish(m: BusMessage) {
    await this.cmd.publish(CHANNEL, JSON.stringify(m));
  }

  subscribe(handler: (m: BusMessage) => void) {
    this.handler = handler;
    if (!this.subscribed) {
      this.subscribed = this.sub.subscribe(CHANNEL).then(() => undefined);
      this.subscribed.catch(() => (this.subscribed = null));
    }
    return this.subscribed;
  }

  async roomGetAll(code: string) {
    const raw = await this.cmd.hgetall(roomKey(code));
    const out: Record<string, Participant> = {};
    for (const [k, v] of Object.entries(raw)) {
      try {
        out[k] = JSON.parse(v);
      } catch {}
    }
    return out;
  }

  async roomSet(code: string, peerId: string, p: Participant) {
    await this.cmd.multi().hset(roomKey(code), peerId, JSON.stringify(p)).expire(roomKey(code), ROOM_TTL_S).exec();
  }

  async roomDel(code: string, peerId: string) {
    await this.cmd.hdel(roomKey(code), peerId);
  }

  async roomDrop(code: string) {
    await this.cmd.del(roomKey(code));
  }
}

/** Single-process fallback when REDIS_URL is not set (local development). */
class MemoryStore implements Store {
  private rooms = new Map<string, Record<string, Participant>>();
  private handler: ((m: BusMessage) => void) | null = null;

  async publish(m: BusMessage) {
    this.handler?.(m);
  }
  async subscribe(handler: (m: BusMessage) => void) {
    this.handler = handler;
  }
  async roomGetAll(code: string) {
    return structuredClone(this.rooms.get(code) || {});
  }
  async roomSet(code: string, peerId: string, p: Participant) {
    const r = this.rooms.get(code) || {};
    r[peerId] = { ...p };
    this.rooms.set(code, r);
  }
  async roomDel(code: string, peerId: string) {
    const r = this.rooms.get(code);
    if (r) delete r[peerId];
  }
  async roomDrop(code: string) {
    this.rooms.delete(code);
  }
}

declare global {
  var __sumsRealtimeStore: Store | undefined;
}

export function getStore(): Store {
  if (!globalThis.__sumsRealtimeStore) {
    const url = process.env.REDIS_URL || process.env.KV_URL;
    if (!url && process.env.VERCEL) {
      console.warn("REDIS_URL is not set: realtime events will not reach users connected to other function instances.");
    }
    globalThis.__sumsRealtimeStore = url ? new RedisStore(url) : new MemoryStore();
  }
  return globalThis.__sumsRealtimeStore;
}
