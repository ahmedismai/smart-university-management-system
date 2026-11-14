"use client";

/**
 * Small Socket.IO-like client for the realtime hub (lib/realtime/hub.ts).
 * - Production: same-origin WebSocket at /api/realtime (a Vercel Function).
 * - `next dev` cannot upgrade WebSockets, so in development it connects to
 *   scripts/realtime-dev.ts on port 3001 (started by `npm run dev`).
 * Reconnects automatically (Vercel closes a socket when the function hits its max duration)
 * and keeps the same peer id, so the server treats it as the same participant.
 */

type Listener = (data: any) => void;

export function realtimeUrl() {
  const configured = process.env.NEXT_PUBLIC_REALTIME_URL;
  if (configured) return configured;
  const { protocol, hostname, host } = window.location;
  const wsProto = protocol === "https:" ? "wss:" : "ws:";
  if (process.env.NODE_ENV === "development") return `${wsProto}//${hostname}:3001/api/realtime`;
  return `${wsProto}//${host}/api/realtime`;
}

export class RealtimeSocket {
  readonly id: string;
  readonly url: string;
  connected = false;
  private ws: WebSocket | null = null;
  private listeners = new Map<string, Set<Listener>>();
  private acks = new Map<number, (data: any) => void>();
  private nextAck = 1;
  private outbox: string[] = [];
  private closedByUser = false;
  private retry = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(url = realtimeUrl()) {
    this.url = url;
    this.id = crypto.randomUUID();
    this.open();
  }

  private open() {
    const sep = this.url.includes("?") ? "&" : "?";
    let ws: WebSocket;
    try {
      ws = new WebSocket(`${this.url}${sep}id=${encodeURIComponent(this.id)}`);
    } catch (e) {
      this.fire("connect_error", e);
      this.scheduleReconnect();
      return;
    }
    this.ws = ws;
    let opened = false;

    ws.onmessage = (e) => {
      let msg: { ev: string; data?: any; ack?: number };
      try {
        msg = JSON.parse(String(e.data));
      } catch {
        return;
      }
      if (msg.ev === "__hello") {
        opened = true;
        this.connected = true;
        this.retry = 0;
        for (const raw of this.outbox.splice(0)) ws.send(raw);
        this.fire("connect");
        return;
      }
      if (msg.ev === "__ack") {
        const cb = msg.ack != null ? this.acks.get(msg.ack) : undefined;
        if (cb) {
          this.acks.delete(msg.ack!);
          cb(msg.data);
        }
        return;
      }
      this.fire(msg.ev, msg.data);
    };

    ws.onclose = (e) => {
      if (this.ws !== ws) return;
      const wasConnected = this.connected;
      this.connected = false;
      this.ws = null;
      if (e.code === 4401) {
        // Server rejected the session cookie: retrying will not help
        this.closedByUser = true;
        this.fire("unauthorized");
        return;
      }
      if (wasConnected) this.fire("disconnect");
      else if (!opened) this.fire("connect_error", new Error(`Cannot reach ${this.url}`));
      if (!this.closedByUser) this.scheduleReconnect();
    };
    ws.onerror = () => {
      /* onclose follows */
    };
  }

  private scheduleReconnect() {
    if (this.timer || this.closedByUser) return;
    const delay = Math.min(500 * 2 ** this.retry++, 10_000);
    this.timer = setTimeout(() => {
      this.timer = null;
      this.open();
    }, delay);
  }

  private fire(ev: string, data?: any) {
    this.listeners.get(ev)?.forEach((fn) => {
      try {
        fn(data);
      } catch (err) {
        console.error(`realtime listener ${ev} failed`, err);
      }
    });
  }

  on(ev: string, fn: Listener) {
    if (!this.listeners.has(ev)) this.listeners.set(ev, new Set());
    this.listeners.get(ev)!.add(fn);
    return this;
  }

  off(ev: string, fn?: Listener) {
    if (fn) this.listeners.get(ev)?.delete(fn);
    else this.listeners.delete(ev);
    return this;
  }

  /** Send an event. Buffered while (re)connecting. Optional ack receives the server's reply. */
  emit(ev: string, data?: unknown, ack?: (res: any) => void) {
    const msg: { ev: string; data?: unknown; ack?: number } = { ev, data };
    if (ack) {
      msg.ack = this.nextAck++;
      this.acks.set(msg.ack, ack);
    }
    const raw = JSON.stringify(msg);
    if (this.connected && this.ws?.readyState === WebSocket.OPEN) this.ws.send(raw);
    else this.outbox.push(raw);
    return this;
  }

  disconnect() {
    this.closedByUser = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.connected = false;
    const ws = this.ws;
    this.ws = null;
    if (ws) {
      // Let a final queued message (e.g. "meeting:leave") go out first
      if (ws.readyState === WebSocket.OPEN) setTimeout(() => ws.close(1000), 50);
      else ws.close();
    }
  }
}

export const connectRealtime = () => new RealtimeSocket();
