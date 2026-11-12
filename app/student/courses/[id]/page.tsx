"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, Download, FileText, MapPin, User } from "lucide-react";
import { formatSize } from "@/lib/lectureFiles";

type Detail = {
  course: { id: string; code: string; title: string; department: string; credits: number; type: string; description: string };
  instructors: string[];
  schedule: { day: string; startTime: string; endTime: string; room: string; type: string; teacher: string }[];
  lectures: { id: string; title: string; description: string; teacher: string; fileName: string; size: number; createdAt: string }[];
};

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Detail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/student/courses/${id}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(res.status === 404 ? "This course is not available for your section yet." : json.error || "Failed to load course");
        setData(json);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  const back = (
    <Link href="/student/courses" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
      <ArrowLeft size={16} /> Back to My Courses
    </Link>
  );

  if (error)
    return (
      <div className="space-y-4">
        {back}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 font-bold">{error}</div>
      </div>
    );
  if (!data) return <div className="text-gray-500 font-bold">Loading...</div>;

  const { course, instructors, schedule, lectures } = data;

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      {back}

      <div className="bg-gradient-to-br from-[#0F2E5D] to-[#2E5E9F] rounded-[2rem] p-8 text-white">
        <p className="text-xs font-black tracking-widest text-secondary">{course.code}</p>
        <h1 className="text-3xl font-bold mt-1">{course.title}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-white/80">
          <span className="flex items-center gap-2"><BookOpen size={16} /> {course.credits} credits · {course.type}</span>
          {instructors.length > 0 && <span className="flex items-center gap-2"><User size={16} /> {instructors.join(", ")}</span>}
          <span>{course.department}</span>
        </div>
        {course.description && <p className="mt-4 text-white/80 text-sm max-w-2xl">{course.description}</p>}
      </div>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Lectures & Materials</h2>
        <div className="space-y-3">
          {lectures.map((l) => (
            <div key={l.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <FileText className="text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{l.title}</p>
                <p className="text-xs text-gray-500 truncate">
                  {l.teacher} · {l.fileName} · {formatSize(l.size)} · {new Date(l.createdAt).toLocaleDateString()}
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
          ))}
          {lectures.length === 0 && (
            <p className="bg-white rounded-2xl border border-gray-100 p-6 text-gray-400">No lectures have been uploaded for this course yet.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Class Schedule</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {schedule.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="font-bold text-gray-900">{s.day} · {s.type}</p>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2"><Clock size={14} /> {s.startTime} - {s.endTime}</p>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2"><MapPin size={14} /> {s.room}{s.teacher ? ` · ${s.teacher}` : ""}</p>
            </div>
          ))}
          {schedule.length === 0 && <p className="text-gray-400">No scheduled classes.</p>}
        </div>
      </section>
    </div>
  );
}
