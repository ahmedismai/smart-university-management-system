// Local stand-in for app/api/realtime (`next dev` cannot upgrade WebSockets).
// Runs the same hub on ws://localhost:3001/api/realtime. Started by `npm run dev`.
import http from "node:http";
import { WebSocketServer } from "ws";
import { attachSocket } from "../lib/realtime/hub";

const PORT = Number(process.env.REALTIME_PORT) || 3001;

const server = http.createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("SUMS realtime dev server is running\n");
});
const wss = new WebSocketServer({ server, maxPayload: 512 * 1024 });

wss.on("connection", (ws, req) => {
  const peerId = new URL(req.url || "/", "http://localhost").searchParams.get("id");
  attachSocket(ws, peerId, req.headers.cookie);
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\nPort ${PORT} is already in use — close the other terminal running the realtime server and try again.\n`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log(`Realtime dev server on ws://localhost:${PORT}/api/realtime`);
});
