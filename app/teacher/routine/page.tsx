"use client";

import React from "react";
import { WithTeacherData } from "@/components/dashboard/useTeacherData";

export default function TeacherRoutinePage() {
  return (
    <WithTeacherData>
      {(data) => (
        <div className="space-y-6">
          <h1 className="text-2xl font-black text-primary">Class Routine</h1>
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-primary/40">
                <tr>
                  {["Day", "Time", "Course", "Section", "Room", "Type"].map((h) => (
                    <th key={h} className="text-left px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.schedule.map((r, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-6 py-3 font-bold">{r.day}</td>
                    <td className="px-6 py-3">{r.startTime} - {r.endTime}</td>
                    <td className="px-6 py-3">{r.course}</td>
                    <td className="px-6 py-3">{r.section}</td>
                    <td className="px-6 py-3">{r.room}</td>
                    <td className="px-6 py-3">{r.type}</td>
                  </tr>
                ))}
                {data.schedule.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-6 text-primary/40">No classes assigned.</td></tr>
                )}
              </tbody>
            </table>
          </section>
        </div>
      )}
    </WithTeacherData>
  );
}
