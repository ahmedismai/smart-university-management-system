const fs = require("fs");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

// Manually parse .env.local if present in current workspace
try {
  const envPath = path.join(__dirname, ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach((line) => {
      const parts = line.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts
          .slice(1)
          .join("=")
          .trim()
          .replace(/^["']|["']$/g, "");
        if (key && !process.env[key]) {
          process.env[key] = value;
        }
      }
    });
    console.log("Loaded environment variables from .env.local");
  }
} catch (err) {
  console.error("Error loading .env.local:", err.message);
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is missing!");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB for Socket server"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Message Schema
const MessageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    receiverId: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true },
);

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);

// Meeting Schema (mirrors models/Meeting.ts; only the fields the socket server needs)
const MeetingSchema = new mongoose.Schema(
  {
    title: String,
    code: { type: String, unique: true },
    hostId: String,
    hostName: String,
    sectionIds: [mongoose.Schema.Types.ObjectId],
    status: { type: String, default: "live" },
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true },
);
const Meeting =
  mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);

// In-memory meeting rooms: code -> Map<socketId, participant>
const meetingRooms = new Map();

// Create HTTP Server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Socket.io server is running\n");
});

// Configure Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGIN
      ? process.env.ALLOWED_ORIGIN.split(",").map((o) => o.trim())
      : "*", // set ALLOWED_ORIGIN (comma separated) in production
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join user room based on studentId / teacherId
  socket.on("join", (userId) => {
    if (userId) {
      const room = userId.trim();
      socket.join(room);
      console.log(`User ${userId} (socket ${socket.id}) joined room: ${room}`);
    }
  });

  // Handle incoming messages
  socket.on("sendMessage", async (data) => {
    const { senderId, senderName, receiverId, text } = data;
    console.log(`Message from ${senderId} to ${receiverId}: ${text}`);

    try {
      // Save message to MongoDB
      const newMessage = await Message.create({
        senderId,
        senderName,
        receiverId,
        text,
      });

      const messageObj = {
        _id: newMessage._id.toString(),
        senderId,
        senderName,
        receiverId,
        text,
        createdAt: newMessage.createdAt,
      };

      // Emit to recipient's room
      io.to(receiverId.trim()).emit("receiveMessage", messageObj);

      // Acknowledge to sender
      socket.emit("messageSent", messageObj);
    } catch (err) {
      console.error("Error saving message:", err);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // ---------------- Video meetings (WebRTC signaling) ----------------
  socket.on("meeting:join", async (payload, ack) => {
    try {
      const { code, userId, name, role, audio, video } = payload || {};
      const meeting = await Meeting.findOne({ code }).lean();
      if (!meeting || meeting.status !== "live") {
        return ack && ack({ ok: false, error: "This meeting is not live." });
      }
      const isHost = role === "host" && meeting.hostId === userId;

      // Leave any previous meeting this socket was in
      leaveMeeting(socket);

      const participant = {
        peerId: socket.id,
        userId,
        name: name || "Guest",
        isHost,
        audio: !!audio,
        video: !!video,
        screen: false,
        hand: false,
      };
      if (!meetingRooms.has(code)) meetingRooms.set(code, new Map());
      const room = meetingRooms.get(code);

      // Same user opened the meeting twice: kick the old tab
      for (const [pid, p] of room) {
        if (p.userId === userId) {
          io.to(pid).emit("meeting:kicked", {
            reason: "You joined from another tab.",
          });
          room.delete(pid);
          io.to(`meeting:${code}`).emit("meeting:peer-left", { peerId: pid });
          const old = io.sockets.sockets.get(pid);
          if (old) {
            old.leave(`meeting:${code}`);
            old.data.meetingCode = null;
          }
        }
      }

      const existing = [...room.values()];
      room.set(socket.id, participant);
      socket.data.meetingCode = code;
      socket.join(`meeting:${code}`);
      socket.to(`meeting:${code}`).emit("meeting:peer-joined", participant);
      let history = [];
      try {
        const rows = await mongoose.connection.db
          .collection("meetingmessages")
          .find({ code })
          .sort({ createdAt: -1 })
          .limit(100)
          .toArray();
        history = rows.reverse().map((r) => ({
          id: String(r._id),
          peerId: r.userId,
          name: r.name,
          isHost: !!r.isHost,
          text: r.text,
          at: r.createdAt.toISOString(),
        }));
      } catch (e) {
        console.error("meeting chat history error", e.message);
      }
      ack && ack({ ok: true, self: participant, peers: existing, history });
    } catch (err) {
      console.error("meeting:join error", err);
      ack && ack({ ok: false, error: "Could not join meeting." });
    }
  });

  // Relay SDP offers/answers and ICE candidates between two peers of the same meeting
  socket.on("meeting:signal", ({ to, data }) => {
    const code = socket.data.meetingCode;
    const room = code && meetingRooms.get(code);
    if (!room || !room.has(to)) return;
    io.to(to).emit("meeting:signal", { from: socket.id, data });
  });

  // Mic / camera / screen share / raise hand state
  socket.on("meeting:state", (patch) => {
    const code = socket.data.meetingCode;
    const p = code && meetingRooms.get(code)?.get(socket.id);
    if (!p) return;
    for (const key of ["audio", "video", "screen", "hand"]) {
      if (patch && key in patch) p[key] = patch[key];
    }
    socket
      .to(`meeting:${code}`)
      .emit("meeting:state", { peerId: socket.id, ...p });
  });

  socket.on("meeting:chat", ({ text }) => {
    const code = socket.data.meetingCode;
    const p = code && meetingRooms.get(code)?.get(socket.id);
    if (!p || !text || !String(text).trim()) return;
    mongoose.connection.db
      .collection("meetingmessages")
      .insertOne({
        code,
        userId: p.userId,
        name: p.name,
        isHost: p.isHost,
        text: String(text).slice(0, 2000),
        createdAt: new Date(),
      })
      .catch((e) => console.error("meeting chat save error", e.message));
    io.to(`meeting:${code}`).emit("meeting:chat", {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      peerId: socket.id,
      name: p.name,
      isHost: p.isHost,
      text: String(text).slice(0, 2000),
      at: new Date().toISOString(),
    });
  });

  socket.on("meeting:reaction", ({ emoji }) => {
    const code = socket.data.meetingCode;
    const p = code && meetingRooms.get(code)?.get(socket.id);
    if (!p || !emoji) return;
    io.to(`meeting:${code}`).emit("meeting:reaction", {
      peerId: socket.id,
      name: p.name,
      emoji: String(emoji).slice(0, 8),
    });
  });

  // Host-only controls: mute someone, stop their camera, remove them, lower hand, mute all
  socket.on("meeting:host-action", ({ action, to }) => {
    const code = socket.data.meetingCode;
    const room = code && meetingRooms.get(code);
    const me = room && room.get(socket.id);
    if (!me || !me.isHost) return;
    if (action === "mute-all") {
      socket
        .to(`meeting:${code}`)
        .emit("meeting:host-action", { action: "mute" });
      return;
    }
    if (!room.has(to)) return;
    io.to(to).emit("meeting:host-action", { action });
    if (action === "remove") {
      room.delete(to);
      io.to(`meeting:${code}`).emit("meeting:peer-left", { peerId: to });
      const target = io.sockets.sockets.get(to);
      if (target) {
        target.leave(`meeting:${code}`);
        target.data.meetingCode = null;
      }
    }
  });

  // Host ends the meeting for everyone
  socket.on("meeting:end", async () => {
    const code = socket.data.meetingCode;
    const me = code && meetingRooms.get(code)?.get(socket.id);
    if (!me || !me.isHost) return;
    await Meeting.updateOne(
      { code, status: "live" },
      { status: "ended", endedAt: new Date() },
    ).catch(() => {});
    io.to(`meeting:${code}`).emit("meeting:ended");
    io.in(`meeting:${code}`).socketsLeave(`meeting:${code}`);
    meetingRooms.delete(code);
  });

  socket.on("meeting:leave", () => leaveMeeting(socket));

  socket.on("disconnect", () => {
    leaveMeeting(socket);
    console.log(`User disconnected: ${socket.id}`);
  });
});

function leaveMeeting(socket) {
  const code = socket.data.meetingCode;
  if (!code) return;
  socket.data.meetingCode = null;
  socket.leave(`meeting:${code}`);
  const room = meetingRooms.get(code);
  if (!room) return;
  room.delete(socket.id);
  io.to(`meeting:${code}`).emit("meeting:peer-left", { peerId: socket.id });
  if (room.size === 0) meetingRooms.delete(code);
}

const PORT = Number(process.env.PORT) || 3001;
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `\nPort ${PORT} is already in use — the socket server is probably already running in another terminal.`,
    );
    console.error(
      `Close that terminal (or stop the process using port ${PORT}) and run "npm run chat" again.\n`,
    );
    process.exit(1);
  }
  throw err;
});
server.listen(PORT, () => {
  console.log(`Socket.io server is listening on port ${PORT}`);
});
