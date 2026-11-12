"use client";

import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { WithTeacherData, TeacherData } from "@/components/dashboard/useTeacherData";
import { cn } from "@/lib/utils";

type Row = { _id: string; studentId: string; name: string; status: string; saved: boolean };
const STATUSES = ["Present", "Absent", "Late", "Excused"];
const COLORS: Record<string, string> = {
  Present: "bg-emerald-500 text-white",
  Absent: "bg-red-500 text-white",
  Late: "bg-amber-500 text-white",
  Excused: "bg-blue-500 text-white",
};

function AttendanceBoard({ data }: { data: TeacherData }) {
  const [sectionId, setSectionId] = useState(data.sections[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!sectionId) return;
    setLoading(true);
    const res = await fetch(`/api/teacher/attendance?sectionId=${encodeURIComponent(sectionId)}&date=${date}`);
    const json = await res.json();
    if (res.ok) setRows(json.students);
    else toast.error(json.error || "Failed to load");
    setLoading(false);
  }, [sectionId, date]);

  useEffect(() => {
    load();
  }, [load]);

  const setAll = (status: string) => setRows((r) => r.map((x) => ({ ...x, status })));

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/teacher/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionId, date, records: rows.map((r) => ({ _id: r._id, status: r.status })) }),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success(`Attendance saved for ${json.saved} students`);
      load();
    } else toast.error(json.error || "Failed to save");
    setSaving(false);
  };

  const counts = STATUSES.map((s) => ({ s, n: rows.filter((r) => r.status === s).length }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-primary">Attendance</h1>
      <div className="flex flex-wrap items-center gap-3">
        <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm">
          {data.sections.map((s) => (
            <option key={s.id} value={s.id}>{s.id} - {s.program}</option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm" />
        <button onClick={() => setAll("Present")} className="text-xs font-bold px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 cursor-pointer">All Present</button>
        <button onClick={() => setAll("Absent")} className="text-xs font-bold px-3 py-2 rounded-xl bg-red-50 text-red-700 cursor-pointer">All Absent</button>
        <div className="ml-auto flex gap-3 text-xs text-primary/60">
          {counts.map((c) => <span key={c.s}>{c.s}: <b>{c.n}</b></span>)}
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-t border-gray-100 first:border-0">
                <td className="px-6 py-3 font-bold w-40">{r.studentId}</td>
                <td className="px-6 py-3">{r.name}</td>
                <td className="px-6 py-3">
                  <div className="flex gap-2 justify-end">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setRows((all) => all.map((x) => (x._id === r._id ? { ...x, status: s } : x)))}
                        className={cn("text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors", r.status === s ? COLORS[s] : "bg-gray-100 text-gray-500 hover:bg-gray-200")}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && <tr><td className="px-6 py-6 text-primary/40">No students.</td></tr>}
          </tbody>
        </table>
      </section>

      <button onClick={save} disabled={saving || rows.length === 0} className="bg-primary text-secondary font-black text-sm px-8 py-3 rounded-xl disabled:opacity-50 cursor-pointer">
        {saving ? "Saving..." : "Save Attendance"}
      </button>
    </div>
  );
}

export default function TeacherAttendancePage() {
  return <WithTeacherData>{(data) => <AttendanceBoard data={data} />}</WithTeacherData>;
}
