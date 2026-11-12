"use client";

import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { WithTeacherData, TeacherData } from "@/components/dashboard/useTeacherData";

type Row = { _id: string; studentId: string; name: string; obtainedMarks: number | null; totalMarks: number | null; grade: string };
const EXAM_TYPES = [
  { type: "Quiz", total: 20 },
  { type: "Assignment", total: 20 },
  { type: "Midterm", total: 30 },
  { type: "Final", total: 50 },
];

function MarksBoard({ data }: { data: TeacherData }) {
  const [sectionId, setSectionId] = useState(data.sections[0]?.id || "");
  const [examType, setExamType] = useState("Midterm");
  // courses this teacher teaches to the selected section (from the weekly schedule)
  const sectionCourses = Array.from(new Set(data.schedule.filter((c) => c.section === sectionId).map((c) => c.course.split(" - ")[0])));
  const [courseCode, setCourseCode] = useState("");
  useEffect(() => {
    setCourseCode((cur) => (sectionCourses.includes(cur) ? cur : sectionCourses[0] || ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId, sectionCourses.join(",")]);
  const [total, setTotal] = useState(30);
  const [rows, setRows] = useState<Row[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!sectionId || !courseCode) return;
    const res = await fetch(`/api/teacher/marks?sectionId=${encodeURIComponent(sectionId)}&examType=${examType}&courseCode=${encodeURIComponent(courseCode)}`);
    const json = await res.json();
    if (!res.ok) return toast.error(json.error || "Failed to load");
    setRows(json.students);
    setValues(Object.fromEntries(json.students.map((s: Row) => [s._id, s.obtainedMarks === null ? "" : String(s.obtainedMarks)])));
    const existing = json.students.find((s: Row) => s.totalMarks);
    if (existing) setTotal(existing.totalMarks as number);
  }, [sectionId, examType, courseCode]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/teacher/marks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionId,
        courseCode,
        examType,
        totalMarks: total,
        records: rows.map((r) => ({ _id: r._id, obtainedMarks: values[r._id] ?? "" })),
      }),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success(`Marks saved for ${json.saved} students`);
      load();
    } else toast.error(json.error || "Failed to save");
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-primary">Marks Entry</h1>
      <div className="flex flex-wrap items-center gap-3">
        <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm">
          {data.sections.map((s) => (
            <option key={s.id} value={s.id}>{s.id} - {s.program}</option>
          ))}
        </select>
        <select
          value={examType}
          onChange={(e) => {
            setExamType(e.target.value);
            setTotal(EXAM_TYPES.find((x) => x.type === e.target.value)?.total || 100);
          }}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm"
        >
          {EXAM_TYPES.map((x) => <option key={x.type} value={x.type}>{x.type}</option>)}
        </select>
        <select
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm"
          aria-label="Course"
        >
          {sectionCourses.length === 0 && <option value="">No course</option>}
          {sectionCourses.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <label className="text-sm text-primary/60 flex items-center gap-2">
          Total
          <input type="number" min={1} value={total} onChange={(e) => setTotal(Number(e.target.value))} className="w-20 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm" />
        </label>
      </div>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-primary/40">
            <tr>
              <th className="text-left px-6 py-3">ID</th>
              <th className="text-left px-6 py-3">Name</th>
              <th className="text-left px-6 py-3">Marks (out of {total})</th>
              <th className="text-left px-6 py-3">Grade</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-t border-gray-100">
                <td className="px-6 py-2 font-bold">{r.studentId}</td>
                <td className="px-6 py-2">{r.name}</td>
                <td className="px-6 py-2">
                  <input
                    type="number"
                    min={0}
                    max={total}
                    value={values[r._id] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [r._id]: e.target.value }))}
                    className="w-24 border border-gray-200 rounded-lg px-3 py-1.5"
                  />
                </td>
                <td className="px-6 py-2 font-bold text-primary">{r.grade || "-"}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4} className="px-6 py-6 text-primary/40">No students.</td></tr>}
          </tbody>
        </table>
      </section>

      <button onClick={save} disabled={saving || rows.length === 0} className="bg-primary text-secondary font-black text-sm px-8 py-3 rounded-xl disabled:opacity-50 cursor-pointer">
        {saving ? "Saving..." : "Save Marks"}
      </button>
    </div>
  );
}

export default function TeacherMarksPage() {
  return <WithTeacherData>{(data) => <MarksBoard data={data} />}</WithTeacherData>;
}
