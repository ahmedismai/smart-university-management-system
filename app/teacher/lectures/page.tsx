"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FileText, Download, Trash2, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { formatSize } from "@/lib/lectureFiles";

type Course = { id: string; code: string; title: string };
type Lecture = { id: string; title: string; description: string; courseId: string; fileName: string; size: number; createdAt: string };

export default function TeacherLecturesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/teacher/lectures");
    const json = await res.json();
    if (res.ok) {
      setCourses(json.courses);
      setLectures(json.lectures);
      setCourseId((prev) => prev || json.courses[0]?.id || "");
    } else toast.error(json.error || "Failed to load");
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return toast.error("Choose a PDF or Word file");
    setUploading(true);
    const body = new FormData();
    body.append("courseId", courseId);
    body.append("title", title);
    body.append("description", description);
    body.append("file", file);
    const res = await fetch("/api/teacher/lectures", { method: "POST", body });
    const json = await res.json();
    setUploading(false);
    if (!res.ok) return toast.error(json.error || "Upload failed");
    toast.success("Lecture uploaded");
    setTitle("");
    setDescription("");
    setFile(null);
    (e.target as HTMLFormElement).reset();
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this lecture?")) return;
    const res = await fetch(`/api/teacher/lectures/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      setLectures((l) => l.filter((x) => x.id !== id));
    } else toast.error("Delete failed");
  };

  const input = "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary";

  if (loading) return <div className="text-primary/60 font-bold">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-primary">Lectures</h1>

      <form onSubmit={upload} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid md:grid-cols-2 gap-4">
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required className={input}>
          {courses.length === 0 && <option value="">No courses assigned</option>}
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} - {c.title}
            </option>
          ))}
        </select>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Lecture title" className={input} />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className={input} />
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          className={input}
        />
        <button
          disabled={uploading || !courseId}
          className="md:col-span-2 flex items-center justify-center gap-2 bg-primary text-white font-bold rounded-xl py-2.5 disabled:opacity-50"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          Upload (PDF / DOC / DOCX, max 4MB)
        </button>
      </form>

      <div className="space-y-3">
        {lectures.map((l) => {
          const course = courses.find((c) => c.id === l.courseId);
          return (
            <div key={l.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <FileText className="text-secondary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-black text-primary truncate">{l.title}</p>
                <p className="text-xs text-primary/50 truncate">
                  {course?.code} · {l.fileName} · {formatSize(l.size)} · {new Date(l.createdAt).toLocaleDateString()}
                </p>
                {l.description && <p className="text-sm text-primary/70 mt-1">{l.description}</p>}
              </div>
              <a href={`/api/lectures/${l.id}/file`} className="p-2 rounded-lg hover:bg-gray-50 text-primary" title="Download">
                <Download size={18} />
              </a>
              <button onClick={() => remove(l.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500" title="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
        {lectures.length === 0 && <p className="text-primary/40">No lectures uploaded yet.</p>}
      </div>
    </div>
  );
}
