"use client";

import { actions } from "@/lib/siteActions";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Plus, 
  MoreVertical, 
  User, 
  BookOpen, 
  ArrowUpRight,
  ClipboardCheck,
  AlertCircle,
  X
} from "lucide-react";

// Static config for stats icons and colors
const statsConfig = [
  { label: "Today's Presence", key: "present", totalKey: "totalStudents", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-100" },
  { label: "Late Arrivals", key: "late", totalKey: "present", icon: Clock, color: "text-amber-600 bg-amber-100" },
  { label: "Total Absentees", key: "absent", totalKey: "totalStudents", icon: XCircle, color: "text-red-600 bg-red-100" },
  { label: "Leave Requests", key: "leave", totalKey: "leaveTotal", icon: AlertCircle, color: "text-blue-600 bg-blue-100" },
];

export default function AttendanceRecords() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    present: 0,
    late: 0,
    absent: 0,
    totalStudents: 0,
    leave: 0,
    leaveTotal: 25
  });

  // Manual marking states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [classesList, setClassesList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    studentId: "",
    classId: "",
    status: "Present",
    remark: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/attendance");
      const result = await res.json();
      if (result.success) {
        setRecords(result.data);
        setStats({
          ...result.stats,
          leave: 0, // Placeholder
          leaveTotal: 25
        });
      }
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsAndClasses = async () => {
    try {
      const [studentsRes, classesRes] = await Promise.all([
        fetch("/api/admin/students"),
        fetch("/api/admin/classes")
      ]);
      const students = await studentsRes.json();
      const classes = await classesRes.json();
      setStudentsList(students);
      setClassesList(classes);
    } catch (error) {
      console.error("Failed to fetch students/classes:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      fetchStudentsAndClasses();
    }
  }, [isModalOpen]);

  const handleManualMark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.classId) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (result.success) {
        setIsModalOpen(false);
        fetchAttendance();
        setFormData({ studentId: "", classId: "", status: "Present", remark: "" });
      }
    } catch (error) {
      console.error("Failed to mark attendance:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const uiStats = statsConfig.map(config => ({
    ...config,
    value: stats[config.key]?.toLocaleString() || "0",
    total: stats[config.totalKey]?.toLocaleString() || "0",
    percent: stats[config.totalKey] > 0 ? (stats[config.key] / stats[config.totalKey]) * 100 : 0
  }));

  return (
    <>
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance Records</h1>
          <p className="text-slate-500">Track and manage daily student and staff presence.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => actions.exportCsv("Daily Report")} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
            <Download size={18} />
            Daily Report
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={18} />
            Mark Manual
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {uiStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-[10px] text-slate-400 font-bold mb-1">/ {stat.total}</p>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stat.percent}%` }}
                className={`h-full ${stat.color.split(' ')[0].replace('text', 'bg')}`} 
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Records Table */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by student ID or name..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
               </div>
               <button onClick={() => actions.filter("Filter rows")} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:text-primary transition-colors cursor-pointer">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px] relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-500">Loading records...</p>
                </div>
              </div>
            ) : null}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="px-6 py-4">Student Details</th>
                    <th className="px-6 py-4">Class & Section</th>
                    <th className="px-6 py-4">Check-in Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {records.length > 0 ? records.map((record, i) => (
                    <motion.tr 
                      key={record._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                            {record.studentId?.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{record.studentId?.name || "Unknown Student"}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{record.studentId?.studentId || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">{record.classId?.name || "N/A"}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{record.classId?.code || ""}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                          <Clock size={14} className="text-slate-400" />
                          {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          record.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 
                          record.status === 'Late' ? 'bg-amber-100 text-amber-700' : 
                          record.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {record.status === 'Present' ? <CheckCircle2 size={12} /> : 
                           record.status === 'Late' ? <Clock size={12} /> : <XCircle size={12} />}
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={(e) => actions.details(e)} className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer"><MoreVertical size={18} /></button>
                      </td>
                    </motion.tr>
                  )) : !loading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <ClipboardCheck size={40} className="text-slate-200" />
                          <p className="text-sm font-medium">No attendance records found for today.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
              <button onClick={() => actions.exportCsv("Presence history")} className="text-xs text-primary font-bold hover:underline cursor-pointer">View Complete Presence History</button>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
             <div className="relative z-10">
                <div className="w-12 h-12 bg-secondary text-primary rounded-2xl flex items-center justify-center mb-6">
                   <ClipboardCheck size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">RFID Terminal</h3>
                <p className="text-sm text-slate-400 mb-6">Configure and monitor live RFID/Biometric gate entry terminals for all university campuses.</p>
                <div className="flex items-center gap-3 mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">3 Terminals Active</span>
                </div>
                <button onClick={() => actions.go("/admin/settings")} className="w-full py-4 bg-secondary text-primary font-extrabold rounded-2xl hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2">
                   System Settings
                   <ArrowUpRight size={18} />
                </button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BookOpen size={18} className="text-primary" />
                Departmental Summary
             </h3>
             <div className="space-y-4">
                {[
                  { name: "CSE Department", percent: records.filter(r => r.classId?.code === 'CSE').length > 0 ? (records.filter(r => r.classId?.code === 'CSE' && r.status === 'Present').length / records.filter(r => r.classId?.code === 'CSE').length) * 100 : 0 },
                  { name: "EEE Department", percent: records.filter(r => r.classId?.code === 'EEE').length > 0 ? (records.filter(r => r.classId?.code === 'EEE' && r.status === 'Present').length / records.filter(r => r.classId?.code === 'EEE').length) * 100 : 0 },
                  { name: "BBA Department", percent: records.filter(r => r.classId?.code === 'BBA').length > 0 ? (records.filter(r => r.classId?.code === 'BBA' && r.status === 'Present').length / records.filter(r => r.classId?.code === 'BBA').length) * 100 : 0 },
                  { name: "English Dept", percent: 82 },
                ].map((dept, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">{dept.name}</span>
                        <span className="text-primary">{Math.round(dept.percent)}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${dept.percent}%` }}
                          transition={{ delay: 0.5 + (i * 0.1) }}
                          className="h-full bg-primary" 
                        />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>

    {/* Manual Marking Modal */}
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Mark Manual Attendance</h2>
                  <p className="text-sm text-slate-500">Select a student and status for manual record.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleManualMark} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Student</label>
                  <select 
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="">Select a student...</option>
                    {studentsList.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.studentId})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Class</label>
                  <select 
                    required
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="">Select a class...</option>
                    {classesList.map(cls => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name} ({cls.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {["Present", "Late", "Absent"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, status })}
                      className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                        formData.status === status 
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Remark (Optional)</label>
                  <textarea 
                    value={formData.remark}
                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                    placeholder="E.g., Medical leave, Traffic, etc."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none"
                  />
                </div>

                <button 
                  disabled={submitting}
                  type="submit"
                  className="w-full py-4 bg-primary text-white font-extrabold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Processing..." : "Save Record"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
