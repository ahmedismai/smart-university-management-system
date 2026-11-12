"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, Send } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { cn } from "@/lib/utils";

type Contact = { id: string; name: string; lastMsg: string; time: string | null; unread: number };
type Msg = { id: string; senderId: string; text: string; createdAt: string };

const fmt = (d: string | null) => (d ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "");

export default function TeacherMessagesPage() {
  const [me, setMe] = useState<{ id: string; name: string } | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [active, setActive] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const activeRef = useRef<Contact | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Load contacts
  useEffect(() => {
    fetch("/api/teacher/messages/contacts")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setMe(json.me);
          setContacts(json.contacts);
        }
      });
  }, []);

  // Load history when switching chats
  useEffect(() => {
    if (!active) return;
    fetch(`/api/teacher/messages/history?receiverId=${encodeURIComponent(active.id)}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setMessages(json.messages.map((m: any) => ({ id: m._id, senderId: m.senderId, text: m.text, createdAt: m.createdAt })));
        }
      });
    setContacts((prev) => prev.map((c) => (c.id === active.id ? { ...c, unread: 0 } : c)));
  }, [active]);

  // Socket (uses the same socket server as the student side: node socket-server.js on port 3001)
  useEffect(() => {
    if (!me) return;
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || `${window.location.protocol}//${window.location.hostname}:3001`);
    socketRef.current = socket;
    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join", me.id);
    });
    socket.on("disconnect", () => setConnected(false));

    socket.on("receiveMessage", (m: any) => {
      if (activeRef.current?.id === m.senderId) {
        setMessages((prev) =>
          prev.some((x) => x.id === m._id) ? prev : [...prev, { id: m._id, senderId: m.senderId, text: m.text, createdAt: m.createdAt }]
        );
      }
      setContacts((prev) => {
        const exists = prev.some((c) => c.id === m.senderId);
        const updated = exists
          ? prev.map((c) =>
              c.id === m.senderId
                ? { ...c, lastMsg: m.text, time: m.createdAt, unread: activeRef.current?.id === c.id ? 0 : c.unread + 1 }
                : c
            )
          : [{ id: m.senderId, name: m.senderName, lastMsg: m.text, time: m.createdAt, unread: 1 }, ...prev];
        return [...updated].sort((a, b) => (b.time ? new Date(b.time).getTime() : 0) - (a.time ? new Date(a.time).getTime() : 0));
      });
    });

    socket.on("messageSent", (m: any) => {
      setMessages((prev) => {
        const i = prev.findIndex((x) => x.id.startsWith("temp-") && x.text === m.text);
        if (i !== -1) {
          const copy = [...prev];
          copy[i] = { id: m._id, senderId: m.senderId, text: m.text, createdAt: m.createdAt };
          return copy;
        }
        return prev.some((x) => x.id === m._id) ? prev : [...prev, { id: m._id, senderId: m.senderId, text: m.text, createdAt: m.createdAt }];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [me]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value || !active || !me || !socketRef.current) return;
    socketRef.current.emit("sendMessage", { senderId: me.id, senderName: me.name, receiverId: active.id, text: value });
    const now = new Date().toISOString();
    setMessages((prev) => [...prev, { id: "temp-" + Date.now(), senderId: me.id, text: value, createdAt: now }]);
    setContacts((prev) => prev.map((c) => (c.id === active.id ? { ...c, lastMsg: value, time: now } : c)));
    setText("");
  };

  const q = search.trim().toLowerCase();
  const visible = contacts.filter((c) => !q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-black text-primary">Messages</h1>
        <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full", connected ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500")}>
          {connected ? "Live" : "Chat server offline"}
        </span>
      </div>
      {!connected && (
        <p className="text-xs text-primary/50">
          لإرسال واستقبال الرسائل لحظيًا شغّل سيرفر الشات في ترمينال تاني: <code className="bg-gray-100 px-1.5 py-0.5 rounded">node socket-server.js</code>
        </p>
      )}

      <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-[calc(100vh-220px)] min-h-[420px]">
        <div className="w-80 border-r border-gray-100 flex flex-col">
          <div className="p-3 border-b border-gray-100 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students" className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
          </div>
          <ul className="flex-1 overflow-y-auto">
            {visible.map((c) => (
              <li key={c.id}>
                <button onClick={() => setActive(c)} className={cn("w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer", active?.id === c.id && "bg-primary/5")}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-primary truncate">{c.name}</span>
                    <span className="text-[10px] text-gray-400">{fmt(c.time)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="text-xs text-gray-500 truncate">{c.lastMsg}</span>
                    {c.unread > 0 && <span className="ml-2 bg-secondary text-primary text-[10px] font-black rounded-full px-1.5">{c.unread}</span>}
                  </div>
                </button>
              </li>
            ))}
            {visible.length === 0 && <li className="p-4 text-sm text-primary/40">No students found.</li>}
          </ul>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          {active ? (
            <>
              <div className="px-6 py-3 border-b border-gray-100">
                <p className="font-black text-primary">{active.name}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{active.id}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50/50">
                {messages.map((m) => {
                  const mine = m.senderId === me?.id;
                  return (
                    <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[70%] px-4 py-2 rounded-2xl text-sm", mine ? "bg-primary text-white rounded-br-sm" : "bg-white border border-gray-100 text-primary rounded-bl-sm")}>
                        <p>{m.text}</p>
                        <p className={cn("text-[10px] mt-1", mine ? "text-white/50" : "text-gray-400")}>{fmt(m.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
                {messages.length === 0 && <p className="text-sm text-primary/40 text-center mt-10">No messages yet. Say hello!</p>}
                <div ref={endRef} />
              </div>
              <form onSubmit={send} className="p-3 border-t border-gray-100 flex gap-2">
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm" />
                <button disabled={!text.trim() || !connected} className="bg-primary text-secondary px-4 rounded-xl disabled:opacity-40 cursor-pointer">
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-primary/40 text-sm">Select a student to start chatting</div>
          )}
        </div>
      </div>
    </div>
  );
}
