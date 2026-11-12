"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar, 
  Search, 
  ArrowUpRight, 
  FileText, 
  Table, 
  PieChart, 
  Users, 
  AlertTriangle,
  ChevronRight,
  Printer,
  History,
  TrendingUp,
  Mail,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const lowAttendanceList = [
  { id: "STU-2041", name: "Rakib Hasan", class: "CSE-101", attendance: "62%", trend: "down" },
  { id: "STU-2055", name: "Nabila Akter", class: "BBA-201", attendance: "58%", trend: "down" },
  { id: "STU-1092", name: "Jasim Uddin", class: "EEE-102", attendance: "71%", trend: "up" },
];

const reportTypes = [
  { title: "Monthly Summary", desc: "Consolidated attendance for all departments.", icon: Table },
  { title: "Defaulter List", desc: "Students with less than 75% presence.", icon: AlertTriangle },
  { title: "Faculty Load", desc: "Attendance records for teaching staff.", icon: Users },
  { title: "Hostel Presence", desc: "Nightly attendance for residential halls.", icon: History },
];

interface ReportData {
  success: boolean;
  stats: {
    avgAttendance: string;
    defaulterCount: number;
    attendanceTrend: string;
  };
  departments: string[];
  defaulters: Array<{
    id: string;
    name: string;
    class: string;
    attendance: string;
    trend: string;
  }>;
}

export default function AttendanceReports() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState("All Departments");
  const [dateRange, setDateRange] = useState("30");

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/attendance/reports?department=${encodeURIComponent(department)}&dateRange=${dateRange}`);
      const result = await res.json();
      if (result.success) {
        setData(result);
      } else {
        toast.error("Failed to fetch report data");
      }
    } catch (error) {
      toast.error("An error occurred while fetching report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [department, dateRange]);

  if (loading && !data) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="font-bold text-sm animate-pulse uppercase tracking-widest">Loading Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance Reports & Analytics</h1>
          <p className="text-slate-500">Generate detailed insights and identify attendance patterns.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <Printer size={18} />
            Print All
          </button>
          <button onClick={() => actions.exportCsv("Export Data")} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer">
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Generator Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Filter size={18} className="text-primary" />
              Report Builder
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Date Range</label>
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 3 Months</option>
                  <option value="365">Last Year</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Department</label>
                <select 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option>All Departments</option>
                  {data?.departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Report Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => actions.exportCsv("PDF Document")} className="py-2.5 rounded-xl text-[10px] font-bold bg-primary text-white shadow-lg shadow-primary/10">PDF Document</button>
                  <button onClick={() => actions.exportCsv("Excel Sheet")} className="py-2.5 rounded-xl text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100 transition-all">Excel Sheet</button>
                </div>
              </div>
            </div>
            <button 
              onClick={fetchReportData}
              className="w-full mt-8 py-4 bg-primary text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-primary/10 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Generate Report"}
            </button>
          </div>

          <div className="bg-slate-800 rounded-3xl p-6 text-white overflow-hidden relative group">
             <div className="relative z-10">
                <TrendingUp size={32} className="text-secondary mb-4" />
                <h4 className="font-bold text-lg mb-2">Predictive Analytics</h4>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">Our AI analyzes current trends to predict students at risk of falling below the 75% attendance threshold.</p>
                <button onClick={(e) => actions.details(e)} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-white/10">
                  View Predictions
                </button>
             </div>
             <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform">
                <BarChart3 size={120} />
             </div>
          </div>
        </div>

        {/* Main Analytics Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Attendance</p>
                  <h4 className="text-2xl font-extrabold text-slate-800">{data?.stats.avgAttendance || "0%"}</h4>
                  <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-1">
                    <ArrowUpRight size={12} />
                    {data?.stats.attendanceTrend} from last month
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-slate-50 border-t-primary flex items-center justify-center relative">
                   <span className="text-xs font-bold text-primary">{data?.stats.avgAttendance.replace('%', '')}</span>
                   <svg className="absolute inset-0 w-full h-full -rotate-90">
                     <circle
                       cx="32" cy="32" r="28"
                       fill="transparent"
                       stroke="currentColor"
                       strokeWidth="4"
                       className="text-slate-50"
                     />
                     <circle
                       cx="32" cy="32" r="28"
                       fill="transparent"
                       stroke="currentColor"
                       strokeWidth="4"
                       strokeDasharray={175.9}
                       strokeDashoffset={175.9 - (175.9 * parseFloat(data?.stats.avgAttendance || "0")) / 100}
                       className="text-primary transition-all duration-1000"
                     />
                   </svg>
                </div>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Defaulter Count</p>
                  <h4 className="text-2xl font-extrabold text-slate-800">{data?.stats.defaulterCount || 0}</h4>
                  <p className={`text-[10px] font-bold flex items-center gap-1 mt-1 ${(data?.stats.defaulterCount || 0) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    { (data?.stats.defaulterCount || 0) > 0 ? <AlertTriangle size={12} /> : <Users size={12} /> }
                    { (data?.stats.defaulterCount || 0) > 0 ? 'Needs Attention' : 'Healthy Status' }
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${(data?.stats.defaulterCount || 0) > 0 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                   <Users size={24} />
                </div>
             </div>
          </div>

          {/* Report Templates */}
          <div className="space-y-4">
             <h3 className="font-bold text-slate-800 px-1">Common Report Templates</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reportTypes.map((type, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                       <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                          <type.icon size={20} />
                       </div>
                       <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-800 mb-1">{type.title}</h4>
                          <p className="text-[10px] text-slate-500 leading-relaxed">{type.desc}</p>
                       </div>
                       <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>

          {/* Critical Low Attendance List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[300px]">
             <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-red-50/30">
                <h3 className="font-bold text-red-900 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-500" />
                  Critical Low Attendance ({"<"} 75%)
                </h3>
                <button 
                  onClick={() => toast.success("Notification requests sent to admin")}
                  className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest hover:underline cursor-pointer disabled:opacity-50"
                  disabled={(data?.defaulters.length || 0) === 0}
                >
                  Notify All Parents
                </button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    <tr>
                      <th className="px-6 py-4">Student Name</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Presence</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data?.defaulters.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                          <div className="flex flex-col items-center gap-2">
                            <Users size={32} className="opacity-20" />
                            <p className="text-sm font-medium">No students with low attendance found.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      data?.defaulters.map((stu) => (
                        <tr key={stu.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800">{stu.name}</span>
                              <span className="text-[10px] text-slate-400">{stu.id}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-600">{stu.class}</td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-red-600">{stu.attendance}</span>
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-red-500" style={{ width: stu.attendance }} />
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <button 
                               onClick={() => toast.success(`Email sent to ${stu.name}'s parents`)}
                               className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer"
                             >
                               <Mail size={16} />
                             </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
             </div>
             {data?.defaulters && data.defaulters.length > 0 && (
               <div className="p-4 bg-slate-50 text-center">
                  <button onClick={() => actions.exportCsv("View Full Defaulter List")} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto hover:text-primary transition-all cursor-pointer">
                    View Full Defaulter List
                    <ChevronRight size={12} />
                  </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
