"use client";

import { actions } from "@/lib/siteActions";

import React from "react";
import { CheckCircle2, XCircle, Clock, Calendar, BarChart3, Filter, Search, Printer, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AttendancePage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
  const [reportSearchQuery, setReportSearchQuery] = React.useState("");
  const [reportStatusFilter, setReportStatusFilter] = React.useState("All");

  const handlePrint = () => {
    if (!data || !data.recent) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const filteredRecent = data.recent.filter((log: any) => {
      const matchesSearch = log.subject.toLowerCase().includes(reportSearchQuery.toLowerCase());
      const matchesStatus = reportStatusFilter === "All" || log.status === reportStatusFilter;
      return matchesSearch && matchesStatus;
    });

    const rows = filteredRecent.map((log: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${log.subject}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${log.date}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${log.time}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">
          <span style="
            display: inline-block;
            padding: 2px 8px;
            font-size: 11px;
            font-weight: bold;
            border-radius: 4px;
            background-color: ${
              log.status === 'Present' ? '#e6f4ea' : log.status === 'Absent' ? '#fce8e6' : '#fef7e0'
            };
            color: ${
              log.status === 'Present' ? '#137333' : log.status === 'Absent' ? '#c5221f' : '#b06000'
            };
          ">${log.status}</span>
        </td>
      </tr>
    `).join("");

    const totalCount = filteredRecent.length;
    const presentCount = filteredRecent.filter((r: any) => r.status === 'Present').length;
    const absentCount = filteredRecent.filter((r: any) => r.status === 'Absent').length;
    const lateCount = filteredRecent.filter((r: any) => r.status === 'Late').length;

    printWindow.document.write(`
      <html>
        <head>
          <title>Attendance Tracking Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 40px; }
            .header { border-bottom: 2px solid #0F2E5D; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #0F2E5D; text-transform: uppercase; margin: 0; }
            .subtitle { font-size: 14px; color: #666; margin-top: 5px; }
            .stats-container { display: flex; gap: 20px; margin-bottom: 30px; }
            .stat-card { flex: 1; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; text-align: center; }
            .stat-label { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #888; }
            .stat-value { font-size: 20px; font-weight: bold; color: #111; margin-top: 5px; }
            .stat-value.primary { color: #0F2E5D; }
            .stat-value.present { color: #137333; }
            .stat-value.absent { color: #c5221f; }
            .stat-value.late { color: #b06000; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; padding: 10px; background-color: #f8fafc; border-bottom: 2px solid #eee; font-size: 12px; font-weight: bold; text-transform: uppercase; color: #555; }
            .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 11px; color: #999; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">NextGen University</h1>
            <div class="subtitle">Attendance Tracking Report &bull; Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          </div>

          <div class="stats-container">
            <div class="stat-card">
              <div class="stat-label">Total Sessions</div>
              <div class="stat-value primary">${totalCount}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Present</div>
              <div class="stat-value present">${presentCount}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Absent</div>
              <div class="stat-value absent">${absentCount}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Late</div>
              <div class="stat-value late">${lateCount}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length > 0 ? rows : '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #999;">No attendance records found matching filters.</td></tr>'}
            </tbody>
          </table>

          <div class="footer">
            This is an official digital summary generated from NextGen University Student Portal.
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportCSV = () => {
    if (!data || !data.recent) return;
    const filteredRecent = data.recent.filter((log: any) => {
      const matchesSearch = log.subject.toLowerCase().includes(reportSearchQuery.toLowerCase());
      const matchesStatus = reportStatusFilter === "All" || log.status === reportStatusFilter;
      return matchesSearch && matchesStatus;
    });

    const headers = ["Subject", "Date", "Time", "Status"];
    const rows = filteredRecent.map((log: any) => [
      `"${log.subject.replace(/"/g, '""')}"`,
      `"${log.date}"`,
      `"${log.time}"`,
      `"${log.status}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((e: string[]) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchAttendance = async () => {
    try {
      const res = await fetch("/api/student/attendance");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login/student";
          return;
        }
        throw new Error("Failed to fetch attendance data");
      }
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        throw new Error(json.error || "An unexpected error occurred");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong while loading attendance records.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 pb-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded w-64 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-3 animate-pulse">
            <div className="h-11 bg-gray-200 rounded-xl w-36"></div>
            <div className="h-11 bg-gray-200 rounded-xl w-32"></div>
          </div>
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4 animate-pulse"
            >
              <div className="h-4 bg-gray-100 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subject-wise Attendance Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-6 bg-gray-150 rounded w-8"></div>
              </div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-36"></div>
                      <div className="h-3 bg-gray-100 rounded w-48"></div>
                    </div>
                    <div className="h-6 bg-gray-100 rounded-full w-12"></div>
                  </div>
                  <div className="h-2 w-full bg-gray-50 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent History Skeleton */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-gray-100"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                    <div className="h-3 bg-gray-100 rounded w-36"></div>
                  </div>
                  <div className="h-5 bg-gray-150 rounded w-14"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 bg-white rounded-3xl border border-red-100 shadow-sm space-y-4 max-w-xl mx-auto">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <XCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Failed to Load Attendance</h3>
        <p className="text-gray-500 max-w-md">{error}</p>
        <button 
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchAttendance();
          }} 
          className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { summary, subjectWise, recent } = data;

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Attendance Tracking</h1>
          <p className="text-gray-500 mt-1">Keep track of your presence in all academic sessions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/academics/academic-calendar" className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
            <Calendar size={18} />
            Academic Calendar
          </Link>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            <BarChart3 size={18} />
            Full Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.map((item: any, index: number) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
          >
            <span className="text-sm font-semibold text-gray-500 mb-1">{item.label}</span>
            <span className={cn("text-3xl font-black mb-2", item.color)}>{item.value}</span>
            <div className={cn("w-full h-1.5 rounded-full overflow-hidden", item.bg)}>
              <div 
                className={cn("h-full rounded-full", item.color.replace('text', 'bg'))} 
                style={{ width: '100%' }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subject-wise list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">Subject-wise Attendance</h2>
              <div className="flex gap-2">
                <button onClick={() => actions.filter("Filter subjects")} className="p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer">
                  <Filter size={18} />
                </button>
              </div>
            </div>
            
            {subjectWise.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm font-medium">No subjects found for your program.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {subjectWise.map((subject: any) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900">{subject.subject}</h4>
                        <p className="text-xs text-gray-500">
                          {subject.present} {subject.present === 1 ? "session" : "sessions"} attended out of {subject.total} total
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={cn(
                          "text-sm font-black px-3 py-1 rounded-full",
                          subject.percentage >= 90 ? "bg-emerald-50 text-emerald-600" : 
                          subject.percentage >= 80 ? "bg-blue-50 text-blue-600" : 
                          subject.total === 0 ? "bg-gray-50 text-gray-400" : "bg-amber-50 text-amber-600"
                        )}>
                          {subject.total === 0 ? "N/A" : `${subject.percentage}%`}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: subject.total === 0 ? "0%" : `${subject.percentage}%` }}
                        transition={{ duration: 1.5 }}
                        className={cn(
                          "h-full rounded-full",
                          subject.percentage >= 90 ? "bg-emerald-500" : 
                          subject.percentage >= 80 ? "bg-blue-500" : "bg-amber-500"
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent logs */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent History</h2>
            
            {recent.length === 0 ? (
              <div className="text-center py-12 text-gray-400 flex flex-col items-center gap-2">
                <CheckCircle2 size={32} className="text-gray-200" />
                <p className="text-sm font-medium">No recent attendance records found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recent.map((log: any, index: number) => (
                  <div key={index} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                    <div className={cn(
                      "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                      log.status === "Present" ? "bg-emerald-50 text-emerald-600" : 
                      log.status === "Absent" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {log.status === "Present" ? <CheckCircle2 size={20} /> : 
                       log.status === "Absent" ? <XCircle size={20} /> : <Clock size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{log.subject}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{log.date}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">•</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{log.time}</span>
                      </div>
                    </div>
                    <div className={cn(
                      "text-[10px] font-black uppercase px-2 py-1 rounded-lg h-fit",
                      log.status === "Present" ? "bg-emerald-50 text-emerald-600" : 
                      log.status === "Absent" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {log.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button 
              onClick={() => setIsReportModalOpen(true)}
              className="w-full mt-6 py-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-2xl transition-all cursor-pointer"
            >
              View Full History
            </button>
          </div>

          <div className="bg-secondary/10 p-8 rounded-3xl border border-secondary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Leave Request</h3>
              <p className="text-sm text-gray-600 mb-6">Need to skip a class? Submit a leave request before the session.</p>
              <button onClick={() => actions.inquiry("Leave request", { type: "leave", title: "Apply for Leave", description: "Submit your leave request. The administration will review it.", fields: ["fromDate", "toDate", "message"], submitLabel: "Submit request" })} className="w-full py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity cursor-pointer">
                Apply for Leave
              </button>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-5 text-primary rotate-12 -mr-4 -mt-4">
              <Calendar size={120} />
            </div>
          </div>
        </div>
      </div>

      {/* Full Attendance Report Modal */}
      <AnimatePresence>
        {isReportModalOpen && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 size={24} className="text-primary" />
                    Full Attendance Report
                  </h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                    Detailed record of your academic presence
                  </p>
                </div>
                <button 
                  onClick={() => setIsReportModalOpen(false)} 
                  className="text-gray-400 hover:text-gray-900 text-3xl font-light hover:rotate-90 transition-all duration-300 leading-none cursor-pointer p-1"
                >
                  &times;
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="p-8 overflow-y-auto flex-1 space-y-6">
                {/* Stats Grid inside Modal */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/30 text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Total Classes</span>
                    <span className="text-2xl font-black text-blue-600">{recent.length}</span>
                  </div>
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/30 text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Present</span>
                    <span className="text-2xl font-black text-emerald-600">
                      {recent.filter((r: any) => r.status === "Present").length}
                    </span>
                  </div>
                  <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100/30 text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Absent</span>
                    <span className="text-2xl font-black text-red-600">
                      {recent.filter((r: any) => r.status === "Absent").length}
                    </span>
                  </div>
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/30 text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Late</span>
                    <span className="text-2xl font-black text-amber-600">
                      {recent.filter((r: any) => r.status === "Late").length}
                    </span>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text"
                      placeholder="Search by subject..."
                      value={reportSearchQuery}
                      onChange={(e) => setReportSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold"
                    />
                  </div>

                  {/* Status Filters */}
                  <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                    {["All", "Present", "Absent", "Late"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setReportStatusFilter(status)}
                        className={cn(
                          "px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer",
                          reportStatusFilter === status 
                            ? "bg-white text-primary shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detailed Table */}
                <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
                  <div className="overflow-x-auto max-h-[300px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/70 sticky top-0 border-b border-gray-100">
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Subject</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Time</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {recent
                          .filter((log: any) => {
                            const matchesSearch = log.subject.toLowerCase().includes(reportSearchQuery.toLowerCase());
                            const matchesStatus = reportStatusFilter === "All" || log.status === reportStatusFilter;
                            return matchesSearch && matchesStatus;
                          })
                          .map((log: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 font-bold text-gray-900 text-sm">{log.subject}</td>
                              <td className="px-6 py-4 text-xs font-semibold text-gray-500">{log.date}</td>
                              <td className="px-6 py-4 text-xs font-semibold text-gray-500">{log.time}</td>
                              <td className="px-6 py-4 text-right">
                                <span className={cn(
                                  "text-[10px] font-black uppercase px-2.5 py-1 rounded-lg inline-block",
                                  log.status === "Present" ? "bg-emerald-50 text-emerald-600" : 
                                  log.status === "Absent" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                                )}>
                                  {log.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        {recent.filter((log: any) => {
                          const matchesSearch = log.subject.toLowerCase().includes(reportSearchQuery.toLowerCase());
                          const matchesStatus = reportStatusFilter === "All" || log.status === reportStatusFilter;
                          return matchesSearch && matchesStatus;
                        }).length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-6 py-10 text-center text-sm font-semibold text-gray-400">
                              No records found matching the filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer / Actions */}
              <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors cursor-pointer text-sm"
                >
                  <Printer size={16} />
                  Print Report
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors cursor-pointer text-sm"
                >
                  <FileText size={16} />
                  Export CSV
                </button>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/10 hover:opacity-90 transition-opacity cursor-pointer text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
