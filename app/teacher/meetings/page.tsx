"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Video, Plus, Copy, Radio, Clock, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Section = { id: string; name: string };
type MeetingRow = { id: string; title: string; code: string; status: "live" | "ended"; startedAt: string; endedAt?: string; sections: string[] };

const fmtDate = (d: string) => new Date(d).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
const duration = (a: string, b?: string) => {
  if (!b) return "";
  const mins = Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 60000));
  return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins} min`;
};

export default function TeacherMeetingsPage() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [meetings, setMeetings] = useState<MeetingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  const load = () =>
    fetch("/api/teacher/meetings")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setSections(json.sections);
          setMeetings(json.meetings);
        } else toast.error(json.error || "Failed to load meetings");
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const toggleSection = (id: string) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const start = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/teacher/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, sectionIds: selected }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not start meeting");
      router.push(`/teacher/meetings/${json.code}`);
    } catch (err: any) {
      toast.error(err.message);
      setCreating(false);
    }
  };

  const copy = (code: string) => navigator.clipboard?.writeText(code).then(() => toast.success("Code copied"));

  const live = meetings.filter((m) => m.status === "live");
  const past = meetings.filter((m) => m.status === "ended");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-primary">Online Meetings</h1>
        <p className="text-sm text-gray-500">Start a live class with video, audio and screen sharing. Students of the invited sections can join instantly.</p>
      </div>

      {/* New meeting */}
      <form onSubmit={start} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary text-secondary flex items-center justify-center">
            <Video size={22} />
          </div>
          <div>
            <h2 className="font-bold text-primary">New Meeting</h2>
            <p className="text-xs text-gray-500">Leave sections empty to invite all your sections</p>
          </div>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Meeting title, e.g. Data Structures - Lecture 5"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />

        {sections.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sections.map((s) => {
              const on = selected.includes(s.id);
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => toggleSection(s.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition flex items-center gap-1 cursor-pointer",
                    on ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-primary/40"
                  )}
                >
                  {on && <Check size={12} />} {s.name}
                </button>
              );
            })}
          </div>
        )}

        <button
          type="submit"
          disabled={creating || (!loading && sections.length === 0)}
          className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer"
        >
          {creating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          Start Meeting
        </button>
        {!loading && sections.length === 0 && <p className="text-xs text-red-500">You are not assigned to any section yet.</p>}
      </form>

      {/* Live */}
      {live.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-primary flex items-center gap-2">
            <Radio size={18} className="text-red-500" /> Live now
          </h2>
          {live.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-red-100 shadow-sm p-5 flex flex-wrap items-center gap-4 justify-between">
              <div>
                <p className="font-bold text-primary">{m.title}</p>
                <p className="text-xs text-gray-500">
                  Started {fmtDate(m.startedAt)} · {m.sections.join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => copy(m.code)} className="font-mono text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
                  {m.code} <Copy size={14} />
                </button>
                <button
                  onClick={() => router.push(`/teacher/meetings/${m.code}`)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2 rounded-lg cursor-pointer"
                >
                  Rejoin
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 font-bold text-primary flex items-center gap-2">
          <Clock size={18} /> Past meetings
        </div>
        {loading ? (
          <p className="p-6 text-sm text-gray-400">Loading...</p>
        ) : past.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No past meetings yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {past.map((m) => (
              <li key={m.id} className="px-6 py-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{m.title}</p>
                  <p className="text-xs text-gray-500">{m.sections.join(", ")}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {fmtDate(m.startedAt)} {m.endedAt && `· ${duration(m.startedAt, m.endedAt)}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
