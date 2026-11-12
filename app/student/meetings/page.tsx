"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Video, Radio, Clock, LogIn } from "lucide-react";

type MeetingRow = { id: string; title: string; code: string; hostName: string; status: "live" | "ended"; startedAt: string; endedAt?: string };

const fmtDate = (d: string) => new Date(d).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

export default function StudentMeetingsPage() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<MeetingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");

  useEffect(() => {
    const load = () =>
      fetch("/api/student/meetings")
        .then((r) => r.json())
        .then((json) => json.success && setMeetings(json.meetings))
        .finally(() => setLoading(false));
    load();
    const t = setInterval(load, 15000); // pick up newly started classes
    return () => clearInterval(t);
  }, []);

  const joinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    const c = code.trim().toLowerCase();
    if (c) router.push(`/student/meetings/${encodeURIComponent(c)}`);
  };

  const live = meetings.filter((m) => m.status === "live");
  const past = meetings.filter((m) => m.status === "ended");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-primary">Online Classes</h1>
        <p className="text-sm text-gray-500">Join live classes started by your teachers.</p>
      </div>

      <form onSubmit={joinByCode} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-wrap gap-3 items-center">
        <div className="w-11 h-11 rounded-xl bg-primary text-secondary flex items-center justify-center">
          <Video size={22} />
        </div>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter meeting code (e.g. abc-defg-hij)"
          className="flex-1 min-w-[220px] border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer">
          <LogIn size={18} /> Join
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="font-bold text-primary flex items-center gap-2">
          <Radio size={18} className="text-red-500" /> Live now
        </h2>
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : live.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
            No live classes right now.
          </div>
        ) : (
          live.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-red-100 shadow-sm p-5 flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <div>
                  <p className="font-bold text-primary">{m.title}</p>
                  <p className="text-xs text-gray-500">
                    {m.hostName} · started {fmtDate(m.startedAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/student/meetings/${m.code}`)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-lg cursor-pointer"
              >
                Join now
              </button>
            </div>
          ))
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 font-bold text-primary flex items-center gap-2">
          <Clock size={18} /> Recent classes
        </div>
        {past.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No past classes.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {past.map((m) => (
              <li key={m.id} className="px-6 py-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{m.title}</p>
                  <p className="text-xs text-gray-500">{m.hostName}</p>
                </div>
                <p className="text-xs text-gray-500">{fmtDate(m.startedAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
