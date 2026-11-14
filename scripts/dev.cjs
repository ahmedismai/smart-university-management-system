// Runs the Next.js dev server and the local realtime (chat/meeting WebSocket) server together.
const { spawn } = require("node:child_process");
const run = (name, args) => {
  const p = spawn(process.execPath, args, { stdio: "inherit", env: process.env });
  p.on("exit", (code) => {
    if (code) console.error(`[${name}] exited with code ${code}`);
    kill();
    process.exit(code || 0);
  });
  return p;
};
const children = [
  run("realtime", ["--env-file-if-exists=.env.local", "--import", "tsx", "scripts/realtime-dev.ts"]),
  run("web", [require.resolve("next/dist/bin/next"), "dev"]),
];
function kill() { children.forEach((c) => { try { c.kill(); } catch {} }); }
process.on("SIGINT", () => { kill(); process.exit(0); });
process.on("SIGTERM", () => { kill(); process.exit(0); });
