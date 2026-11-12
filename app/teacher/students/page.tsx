"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { WithTeacherData } from "@/components/dashboard/useTeacherData";

export default function TeacherStudentsPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  return (
    <WithTeacherData>
      {(data) => (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-2xl font-black text-primary">My Students</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, ID or email"
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm w-72"
              />
            </div>
          </div>
          {data.sections.map((sec) => {
            const list = sec.students.filter(
              (s) => !q || s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
            );
            return (
              <section key={sec.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <h2 className="px-6 py-4 font-black text-primary border-b border-gray-100">
                  {sec.id}{" "}
                  <span className="text-primary/40 font-medium text-sm">
                    · {sec.program} · {sec.room} · {list.length}/{sec.students.length} students
                  </span>
                </h2>
                <table className="w-full text-sm">
                  <tbody>
                    {list.map((s) => (
                      <tr key={s.studentId} className="border-t border-gray-100 first:border-0">
                        <td className="px-6 py-2 font-bold w-40">{s.studentId}</td>
                        <td className="px-6 py-2">{s.name}</td>
                        <td className="px-6 py-2 text-primary/50">{s.email}</td>
                      </tr>
                    ))}
                    {list.length === 0 && <tr><td className="px-6 py-4 text-primary/40">No matches.</td></tr>}
                  </tbody>
                </table>
              </section>
            );
          })}
          {data.sections.length === 0 && <p className="text-primary/40">No sections assigned.</p>}
        </div>
      )}
    </WithTeacherData>
  );
}
