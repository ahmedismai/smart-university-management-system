"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { WithTeacherData, useTeacherData } from "@/components/dashboard/useTeacherData";

function Composer() {
  const { refresh } = useTeacherData();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Academic");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/teacher/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, category }),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success("Announcement published to students");
      setTitle("");
      setContent("");
      refresh();
    } else toast.error(json.error || "Failed to publish");
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
      <h2 className="font-black text-primary">New Announcement (for students)</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Message" required rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm" />
      <div className="flex items-center gap-3">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2 text-sm">
          {["Academic", "Event", "Urgent"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <button disabled={busy} className="bg-primary text-secondary font-black text-sm px-6 py-2 rounded-xl disabled:opacity-50 cursor-pointer">
          {busy ? "Publishing..." : "Publish"}
        </button>
      </div>
    </form>
  );
}

export default function TeacherAnnouncementsPage() {
  return (
    <WithTeacherData>
      {(data) => (
        <div className="space-y-6">
          <h1 className="text-2xl font-black text-primary">Announcements</h1>
          <Composer />
          <div className="space-y-4">
            {data.announcements.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-black text-primary">{a.title}</h2>
                <p className="text-sm text-primary/60 mt-1">{a.content}</p>
                <p className="text-[10px] uppercase tracking-widest text-primary/30 mt-3">
                  {new Date(a.createdAt).toISOString().slice(0, 10)}
                </p>
              </div>
            ))}
            {data.announcements.length === 0 && <p className="text-primary/40">No announcements.</p>}
          </div>
        </div>
      )}
    </WithTeacherData>
  );
}
