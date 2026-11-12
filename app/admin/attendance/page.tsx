"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, FileText, ChevronLeft, ChevronRight } from "lucide-react";

export default function AttendanceManagement() {
  const [day, setDay] = React.useState(() => new Date());
  const shiftDay = (n: number) => setDay((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Attendance Management</h1>
        <p className="text-slate-500">Track and manage student and staff attendance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><CheckCircle2 size={20} /></div>
            <h3 className="font-bold text-slate-800">Today's Presence</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">92%</p>
          <p className="text-xs text-emerald-600 mt-1">+2.4% from yesterday</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-2 rounded-lg text-red-600"><XCircle size={20} /></div>
            <h3 className="font-bold text-slate-800">Total Absentees</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">142</p>
          <p className="text-xs text-red-600 mt-1">20 students marked absent today</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><Clock size={20} /></div>
            <h3 className="font-bold text-slate-800">Late Arrivals</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">45</p>
          <p className="text-xs text-amber-600 mt-1">Needs attention</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => shiftDay(-1)} aria-label="Previous day" className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer"><ChevronLeft size={20} /></button>
            <h3 className="font-bold text-slate-800 min-w-[9rem] text-center">{day.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</h3>
            <button onClick={() => shiftDay(1)} aria-label="Next day" className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer"><ChevronRight size={20} /></button>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
              <option>CSE-A</option>
              <option>EEE-B</option>
              <option>BBA-A</option>
            </select>
            <button onClick={() => actions.exportCsv("Generate Report")} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium cursor-pointer">
              <FileText size={16} />
              Generate Report
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Present</th>
                <th className="px-6 py-4">Absent</th>
                <th className="px-6 py-4">Late</th>
                <th className="px-6 py-4 text-center">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-medium">2026-04-{25-i}</td>
                  <td className="px-6 py-4 text-xs font-bold">CSE-A</td>
                  <td className="px-6 py-4 text-xs text-emerald-600 font-bold">35</td>
                  <td className="px-6 py-4 text-xs text-red-600 font-bold">5</td>
                  <td className="px-6 py-4 text-xs text-amber-600 font-bold">2</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => actions.go("/admin/attendance/records")} className="text-xs text-primary font-bold hover:underline cursor-pointer">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
