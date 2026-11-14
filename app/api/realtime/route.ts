import { connection } from "next/server";
import { upgradeWebSocket } from "@vercel/functions";
import { attachSocket } from "@/lib/realtime/hub";

// WebSocket endpoint for chat + online classes (replaces the old standalone socket-server.js).
// A connection closes when the function reaches maxDuration; the client reconnects automatically.
export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(req: Request) {
  await connection();
  if (req.headers.get("upgrade")?.toLowerCase() !== "websocket") {
    return new Response("Expected a WebSocket connection", { status: 426 });
  }
  const peerId = new URL(req.url).searchParams.get("id");
  // Identity comes from the session cookies (student_session / teacher_session), never from the client's messages
  const cookie = req.headers.get("cookie");
  return upgradeWebSocket((ws) => attachSocket(ws, peerId, cookie), { maxPayload: 512 * 1024 });
}
