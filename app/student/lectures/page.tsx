"use client";

import React, { useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";
import { formatSize } from "@/lib/lectureFiles";

type Course = { id: string; code: string; title: string };
type Lecture = { id: string; title: string; description: string; courseId: string; teacher: string; fileName: string; size: number; createdAt: string };

export default function StudentLecturesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/student/lectures")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load lectures");
        setCourses(json.courses);
        setLectures(json.lectures);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500 font-bold">Loading...</div>;
  if (error) return <div className="text-red-600 font-bold">{error}</div>;

  const shown = filter === "all" ? lectures : lectures.filter((l) => l.courseId === filter);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Lectures</h1>
          <p className="text-gray-500 mt-1">Lecture files shared by your teachers.</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none"
        >
          <option value="all">All courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} - {c.title}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {shown.map((l) => {
          const course = courses.find((c) => c.id === l.courseId);
          return (
            <div key={l.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <FileText className="text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{l.title}</p>
                <p className="text-xs text-gray-500 truncate">
                  {course?.code} · {l.teacher} · {l.fileName} · {formatSize(l.size)} · {new Date(l.createdAt).toLocaleDateString()}
                </p>
                {l.description && <p className="text-sm text-gray-600 mt-1">{l.description}</p>}
              </div>
              <a
                href={`/api/lectures/${l.id}/file`}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90"
              >
                <Download size={16} /> Download
              </a>
            </div>
          );
        })}
        {shown.length === 0 && <p className="text-gray-400">No lectures available yet.</p>}
      </div>
    </div>
  );
}
