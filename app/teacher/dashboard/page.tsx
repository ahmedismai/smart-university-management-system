"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, CalendarDays, Layers, Users } from "lucide-react";
import { WithTeacherData } from "@/components/dashboard/useTeacherData";

export default function TeacherDashboardPage() {
  return (
    <WithTeacherData>
      {(data) => {
        const stats = [
          { label: "Courses", value: data.stats.courses, icon: BookOpen, href: "/teacher/courses" },
          { label: "Sections", value: data.stats.sections, icon: Layers, href: "/teacher/students" },
          { label: "Students", value: data.stats.students, icon: Users, href: "/teacher/students" },
          { label: "Classes / Week", value: data.stats.classesPerWeek, icon: CalendarDays, href: "/teacher/routine" },
        ];
        const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
        const todays = data.schedule.filter((r) => r.day === today);

        return (
          <div className="space-y-8">
            <h1 className="text-2xl font-black text-primary">Dashboard</h1>

            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <Link key={s.label} href={s.href} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:border-secondary transition-colors">
                  <s.icon className="text-secondary" size={28} />
                  <div>
                    <p className="text-2xl font-black text-primary">{s.value}</p>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-primary/40">{s.label}</p>
                  </div>
                </Link>
              ))}
            </section>

            <section className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-black text-primary mb-4">Today&apos;s Classes ({today})</h2>
                <ul className="space-y-3">
                  {todays.map((r, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span><b>{r.startTime} - {r.endTime}</b> · {r.course}</span>
                      <span className="text-primary/40">{r.section} · {r.room}</span>
                    </li>
                  ))}
                  {todays.length === 0 && <li className="text-primary/40 text-sm">No classes today.</li>}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-black text-primary mb-4">Latest Announcements</h2>
                <ul className="space-y-3">
                  {data.announcements.slice(0, 3).map((a, i) => (
                    <li key={i} className="text-sm">
                      <b>{a.title}</b>
                      <p className="text-primary/60">{a.content}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        );
      }}
    </WithTeacherData>
  );
}
