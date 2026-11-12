"use client";

import { actions } from "@/lib/siteActions";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
  Award, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MoreVertical, 
  Users, 
  Banknote as DollarSign, 
  GraduationCap, 
  Info, 
  ArrowUpRight, 
  ShieldCheck, 
  History,
  Tag,
  Star,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WaiverManagement() {
  const [waivers, setWaivers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalAmount: 0,
    activeRecipients: 0,
    meritScholars: 0,
    pendingApps: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // Modal states
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isTypesModalOpen, setIsTypesModalOpen] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [newWaiver, setNewWaiver] = useState({
    studentId: "",
    type: "Merit-based",
    value: "",
    amount: 0,
    status: "Active"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/admin/students");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
    } catch (error: any) {
      toast.error("Failed to load students");
    }
  };

  const fetchWaivers = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("search", searchQuery);
      if (filterType !== "All") queryParams.append("type", filterType);
      if (filterStatus !== "All") queryParams.append("status", filterStatus);

      const res = await fetch(`/api/admin/financial/waivers?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch waivers");
      const data = await res.json();
      setWaivers(data.waivers);
      setStats(data.stats);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterType, filterStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWaivers();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchWaivers]);

  const handleCreateWaiver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWaiver.studentId || !newWaiver.value || !newWaiver.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const waiverId = `WAV-${Math.floor(100 + Math.random() * 900)}`;
      const res = await fetch("/api/admin/financial/waivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newWaiver, waiverId }),
      });

      if (!res.ok) throw new Error("Failed to create waiver");
      
      toast.success("Waiver application created successfully");
      setIsNewModalOpen(false);
      setNewWaiver({
        studentId: "",
        type: "Merit-based",
        value: "",
        amount: 0,
        status: "Active"
      });
      fetchWaivers();
    } catch (error: any) {
      toast.error(error.message || "Failed to create waiver");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statsDisplay = [
    { label: "Total Waivers", value: `EGP ${(stats.totalAmount / 1000000).toFixed(1)}M`, icon: DollarSign, color: "bg-emerald-500" },
    { label: "Active Recipients", value: stats.activeRecipients.toString(), icon: Users, color: "bg-blue-500" },
    { label: "Merit Scholars", value: stats.meritScholars.toString(), icon: Award, color: "bg-amber-500" },
    { label: "Pending Apps", value: stats.pendingApps.toString(), icon: Clock, color: "bg-purple-500" },
  ];
  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Waivers & Scholarships</h1>
          <p className="text-slate-500">Manage institutional scholarships, fee waivers and merit-based grants.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsTypesModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <Tag size={18} />
            Waiver Types
          </button>
          <button 
            onClick={() => { setIsNewModalOpen(true); fetchStudents(); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={18} />
            New Application
          </button>
        </div>
      </div>

      {/* New Application Modal */}
      <AnimatePresence>
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">New Waiver Application</h3>
                <button 
                  onClick={() => setIsNewModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleCreateWaiver} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Select Student</label>
                  <select 
                    required
                    value={newWaiver.studentId}
                    onChange={(e) => setNewWaiver({ ...newWaiver, studentId: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="">Select a student</option>
                    {students.map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Waiver Type</label>
                    <select 
                      value={newWaiver.type}
                      onChange={(e) => setNewWaiver({ ...newWaiver, type: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="Merit-based">Merit-based</option>
                      <option value="Need-based">Need-based</option>
                      <option value="Martyrs Families">Martyrs Families</option>
                      <option value="Sibling">Sibling</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Value (%)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 50%" 
                      required
                      value={newWaiver.value}
                      onChange={(e) => setNewWaiver({ ...newWaiver, value: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Benefit (EGP)</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      required
                      value={newWaiver.amount || ""}
                      onChange={(e) => setNewWaiver({ ...newWaiver, amount: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Initial Status</label>
                    <select 
                      value={newWaiver.status}
                      onChange={(e) => setNewWaiver({ ...newWaiver, status: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTypesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTypesModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Tag size={20} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-800">Waiver Categories</h3>
                </div>
                <button 
                  onClick={() => setIsTypesModalOpen(false)}
                  className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { name: "Merit-based", desc: "For high achieving students (CGPA > 3.5)", icon: Star, color: "text-amber-500" },
                  { name: "Need-based", desc: "Financial assistance for underprivileged students", icon: DollarSign, color: "text-emerald-500" },
                  { name: "Martyrs Families", desc: "Special support for the families of martyrs", icon: ShieldCheck, color: "text-blue-500" },
                  { name: "Sibling", desc: "For siblings currently enrolled in the university", icon: Users, color: "text-purple-500" },
                ].map((type, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all group">
                    <div className={`${type.color} p-2 bg-white rounded-xl shadow-sm border border-slate-100`}>
                      <type.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{type.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{type.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Waiver policies are managed by the registrar office</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-current/10`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Recipients Table */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by student name or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
               <button 
                onClick={() => {setFilterType("All"); setFilterStatus("All"); setSearchQuery("");}}
                className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:text-primary transition-colors cursor-pointer"
               >
                <Filter size={20} />
              </button>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold text-slate-600"
              >
                <option value="All">All Types</option>
                <option value="Merit-based">Merit-based</option>
                <option value="Need-based">Need-based</option>
                <option value="Martyrs Families">Martyrs Families</option>
                <option value="Sibling">Sibling</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="px-6 py-4">Recipient Details</th>
                    <th className="px-6 py-4">Waiver Category</th>
                    <th className="px-6 py-4">Value (%)</th>
                    <th className="px-6 py-4 text-right">Benefit (EGP)</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                          <p className="text-sm font-bold text-slate-400">Loading waivers...</p>
                        </div>
                      </td>
                    </tr>
                  ) : waivers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Info className="text-slate-300" size={40} />
                          <p className="text-sm font-bold text-slate-400">No waivers found matching your criteria.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    waivers.map((rec, i) => (
                      <motion.tr 
                        key={rec._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{rec.studentId?.name || "N/A"}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{rec.studentId?.studentId || rec.studentId || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <Star size={14} className={rec.type === 'Merit-based' ? 'text-amber-400' : 'text-slate-300'} />
                             <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{rec.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-md">{rec.value}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="text-sm font-extrabold text-slate-800">EGP {rec.amount.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            rec.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                            rec.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {rec.status === 'Active' ? <CheckCircle2 size={12} /> : 
                             rec.status === 'Pending' ? <Clock size={12} /> : <XCircle size={12} />}
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={(e) => actions.details(e)} className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer"><MoreVertical size={18} /></button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 flex items-center justify-center">
              <button onClick={(e) => actions.details(e)} className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-1">
                View Allocation History
                <History size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
             <div className="relative z-10">
                <GraduationCap size={32} className="text-secondary mb-6" />
                <h3 className="text-xl font-bold mb-4">Merit Scholarship</h3>
                <p className="text-sm text-slate-400 mb-8 leading-relaxed">Automatic waiver application for top 3% of students in the Dean's List for the Summer Semester 2026.</p>
                <div className="flex items-center gap-3 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                   <ShieldCheck size={18} className="text-emerald-400" />
                   <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">GPA Verification Active</span>
                </div>
                <button 
                  onClick={() => toast.success("Merit verification process initiated.")}
                  className="w-full py-4 bg-secondary text-primary font-extrabold rounded-2xl hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                   Apply Merit Tiers
                   <ArrowUpRight size={14} />
                </button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                <Info size={18} className="text-primary" />
                Eligibility Rules
             </h3>
             <ul className="space-y-3">
                {[
                  "Maintain minimum CGPA of 3.50 for merit continuity.",
                  "Zero disciplinary records for the current academic year.",
                  "Minimum 85% attendance required for scholarship claims.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-[11px] text-slate-500 font-medium">
                     <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1 shrink-0" />
                     {item}
                  </li>
                ))}
             </ul>
             <button 
               onClick={() => setIsTypesModalOpen(true)}
               className="w-full mt-4 py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer"
             >
               View Full Policy
             </button>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
             <Star size={18} className="text-blue-500 mt-0.5" />
             <p className="text-[11px] text-blue-700 font-medium leading-relaxed">Martyrs Families (quota) waivers are lifetime grants and require one-time verification by the registrar's office.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
