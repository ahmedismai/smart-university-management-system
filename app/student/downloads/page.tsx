"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Download, FileText, Search, FolderOpen } from "lucide-react";
import { formatSize } from "@/lib/lectureFiles";

type Course = { id: string; code: string; title: string };
type Lecture = { id: string; title: string; courseId: string; teacher: string; fileName: string; size: number; createdAt: string };

const typeOf = (name: string) => (name.split(".").pop() || "").toUpperCase();

export default function DownloadsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/student/lectures")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load files");
        setCourses(json.courses);
        setLectures(json.lectures);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lectures;
    return lectures.filter((l) => {
      const course = courses.find((c) => c.id === l.courseId);
      return [l.title, l.fileName, l.teacher, course?.code, course?.title].some((v) => v?.toLowerCase().includes(q));
    });
  }, [lectures, courses, query]);

  if (loading) return <div className="text-gray-500 font-bold">Loading...</div>;
  if (error) return <div className="text-red-600 font-bold">{error}</div>;

  const totalSize = lectures.reduce((n, l) => n + l.size, 0);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Downloads</h1>
          <p className="text-gray-500 mt-1">All course files shared with you: {lectures.length} {lectures.length === 1 ? "file" : "files"} · {formatSize(totalSize)}</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        {shown.map((l) => {
          const course = courses.find((c) => c.id === l.courseId);
          return (
            <div key={l.id} className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
              <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{l.title}</p>
                <p className="text-xs text-gray-500 truncate">
                  {course?.code} · {l.fileName} · {typeOf(l.fileName)} · {formatSize(l.size)} · {new Date(l.createdAt).toLocaleDateString()}
                </p>
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
        {shown.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <FolderOpen size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-bold text-gray-700">{lectures.length === 0 ? "No files yet" : "No files match your search"}</p>
            <p className="text-sm mt-1">Files your teachers upload will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
