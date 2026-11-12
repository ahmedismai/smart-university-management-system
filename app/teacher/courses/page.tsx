"use client";

import React from "react";
import { Clock, Users } from "lucide-react";
import { WithTeacherData } from "@/components/dashboard/useTeacherData";

export default function TeacherCoursesPage() {
  return (
    <WithTeacherData>
      {(data) => (
        <div className="space-y-6">
          <h1 className="text-2xl font-black text-primary">My Courses</h1>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.courses.map((c) => {
              const classes = data.schedule.filter((r) => r.course.startsWith(c.code));
              const sectionIds = [...new Set(classes.map((r) => r.section))];
              const studentCount = data.sections.filter((s) => sectionIds.includes(s.id)).reduce((n, s) => n + s.students.length, 0);
              return (
                <div key={c.code} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <p className="text-xs font-black text-secondary tracking-widest">{c.code}</p>
                  <h2 className="font-black text-primary text-lg mt-1">{c.title}</h2>
                  <p className="text-sm text-primary/50 mt-1">{c.credits} credits · {c.type}</p>
                  <p className="text-sm text-primary/70 mt-3 flex items-center gap-2"><Users size={14} /> {studentCount} students · {sectionIds.join(", ")}</p>
                  <ul className="mt-3 space-y-1">
                    {classes.map((r, i) => (
                      <li key={i} className="text-xs text-primary/60 flex items-center gap-2">
                        <Clock size={12} /> {r.day} {r.startTime}-{r.endTime} · {r.section} · {r.room}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {data.courses.length === 0 && <p className="text-primary/40">No courses assigned.</p>}
          </div>
        </div>
      )}
    </WithTeacherData>
  );
}
