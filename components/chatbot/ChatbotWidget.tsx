"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Bot, RotateCcw } from "lucide-react";
import { SUGGESTIONS_AR, SUGGESTIONS_EN } from "@/lib/chatbot/knowledge";

type Msg = { role: "user" | "assistant"; content: string };
const KEY = "sums_chat";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<{ ai: boolean; loggedIn: boolean; name: string } | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(messages.slice(-30)));
    } catch {}
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, busy]);

  useEffect(() => {
    if (!open || info) return;
    fetch("/api/chatbot")
      .then((r) => r.json())
      .then(setInfo)
      .catch(() => {});
  }, [open, info]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const json = await res.json();
      setMessages([...next, { role: "assistant", content: res.ok ? json.reply : json.error || "Something went wrong. Please try again." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "I could not reach the server. Please check your connection and try again." }]);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setMessages([]);
    try {
      sessionStorage.removeItem(KEY);
    } catch {}
  };

  return (
    <div className="no-print fixed bottom-5 right-5 z-50" data-keep-colors>
      {open && (
        <div
          role="dialog"
          aria-label="SUMS assistant"
          className="mb-3 w-[min(92vw,380px)] h-[min(75vh,540px)] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
        >
          <div className="bg-gradient-to-br from-[#0F2E5D] to-[#2E5E9F] text-white px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black leading-tight">SUMS Assistant</p>
              <p className="text-[11px] text-white/70 truncate">
                {info?.loggedIn ? `Signed in as ${info.name}` : "Ask about student affairs"}
              </p>
            </div>
            <button onClick={reset} aria-label="New conversation" title="New conversation" className="p-2 rounded-lg hover:bg-white/10">
              <RotateCcw size={16} />
            </button>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="p-2 rounded-lg hover:bg-white/10">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/60">
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-3 text-sm text-gray-700 shadow-sm">
                  {info?.loggedIn
                    ? `Hi ${info.name}! Ask me about your attendance, fees, schedule, courses or anything about the university. / اسألني عن أي حاجة تخص دراستك.`
                    : "Hi! Ask me about admission, library, halls, transport, the academic calendar and more. Sign in as a student to ask about your own records. / اسألني بالعربي أو بالإنجليزي."}
                </div>
                <div className="flex flex-wrap gap-2">
                  {[...SUGGESTIONS_EN.slice(0, 3), ...SUGGESTIONS_AR.slice(0, 2)].map((s) => (
                    <button key={s} onClick={() => send(s)} className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[#0F2E5D] hover:bg-[#0F2E5D] hover:text-white transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  dir="auto"
                  className={
                    m.role === "user"
                      ? "max-w-[85%] bg-[#0F2E5D] text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm whitespace-pre-wrap break-words"
                      : "max-w-[85%] bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm whitespace-pre-wrap break-words shadow-sm"
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm text-gray-400 flex items-center gap-2 text-sm">
                  <Loader2 size={14} className="animate-spin" /> ...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-3 border-t border-gray-100 bg-white flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
              dir="auto"
              placeholder="Type your question..."
              className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#0F2E5D] focus:ring-2 focus:ring-[#0F2E5D]/10"
            />
            <button disabled={busy || !input.trim()} aria-label="Send" className="p-2.5 rounded-xl bg-[#0F2E5D] text-white disabled:opacity-40 hover:opacity-90">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="ml-auto flex w-14 h-14 rounded-full bg-[#0F2E5D] text-white shadow-xl items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <X size={24} /> : <MessageCircle size={26} />}
      </button>
    </div>
  );
}
