"use client";

import { actions } from "@/lib/siteActions";
import React, { useState, useEffect, useCallback } from "react";
import { 
  AlertCircle, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MoreVertical, 
  ArrowUpRight, 
  Library, 
  Users, 
  Banknote as DollarSign,
  Info,
  Calendar,
  CreditCard,
  History,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function FinesManagement() {
  const [fines, setFines] = useState<any[]>([]);
  const [stats, setStats] = useState({
    unpaidAmount: 0,
    collectedAmount: 0,
    activeDefaulters: 0,
    processingFines: 0
  });
  const [collectionSummary, setCollectionSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  
  // Modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [newFine, setNewFine] = useState({
    studentId: "",
    type: "Library",
    amount: 0,
    status: "Unpaid",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFines = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("search", searchQuery);
      if (filterType !== "All") queryParams.append("type", filterType);

      const res = await fetch(`/api/admin/financial/fines?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch fines");
      const data = await res.json();
      setFines(data.fines);
      setStats(data.stats);
      setCollectionSummary(data.collectionSummary);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterType]);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFines();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchFines]);

  const handleAssignFine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFine.studentId || !newFine.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const fineId = `FN-${Math.floor(8000 + Math.random() * 1000)}`;
      const res = await fetch("/api/admin/financial/fines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newFine, fineId }),
      });

      if (!res.ok) throw new Error("Failed to assign fine");
      
      toast.success("Fine assigned successfully");
      setIsAssignModalOpen(false);
      setNewFine({
        studentId: "",
        type: "Library",
        amount: 0,
        status: "Unpaid",
        description: ""
      });
      fetchFines();
    } catch (error: any) {
      toast.error(error.message || "Failed to assign fine");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statsDisplay = [
    { label: "Unpaid Fines", value: `EGP ${stats.unpaidAmount.toLocaleString()}`, icon: AlertCircle, color: "text-red-600 bg-red-100" },
    { label: "Collected (Total)", value: `EGP ${stats.collectedAmount.toLocaleString()}`, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-100" },
    { label: "Active Defaulters", value: stats.activeDefaulters.toString(), icon: Users, color: "text-blue-600 bg-blue-100" },
    { label: "Pending Reviews", value: stats.processingFines.toString(), icon: Clock, color: "text-amber-600 bg-amber-100" },
  ];
  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fines & Penalties</h1>
          <p className="text-slate-500">Track disciplinary charges, library fines and late payment penalties.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => toast.success("Fine history log is being prepared...")}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <History size={18} />
            Fine History
          </button>
          <button 
            onClick={() => { setIsAssignModalOpen(true); fetchStudents(); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={18} />
            Assign Fine
          </button>
        </div>
      </div>

      {/* Assign Fine Modal */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAssignModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">Assign New Fine</h3>
                <button onClick={() => setIsAssignModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAssignFine} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Select Student</label>
                  <select 
                    required
                    value={newFine.studentId}
                    onChange={(e) => setNewFine({ ...newFine, studentId: e.target.value })}
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
                    <label className="text-xs font-bold text-slate-500 uppercase">Fine Type</label>
                    <select 
                      value={newFine.type}
                      onChange={(e) => setNewFine({ ...newFine, type: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="Library">Library Fine</option>
                      <option value="Late Fee">Late Fee</option>
                      <option value="Conduct">Disciplinary</option>
                      <option value="Attendance">Attendance</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Amount (EGP)</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      required
                      value={newFine.amount || ""}
                      onChange={(e) => setNewFine({ ...newFine, amount: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Description / Reason</label>
                  <textarea 
                    rows={3}
                    value={newFine.description}
                    onChange={(e) => setNewFine({ ...newFine, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    placeholder="Provide details about the fine..."
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsAssignModalOpen(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                    {isSubmitting ? "Processing..." : "Assign Fine"}
                  </button>
                </div>
              </form>
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
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
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
                placeholder="Search by student name or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
               <button 
                onClick={() => {setFilterType("All"); setSearchQuery("");}}
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
                <option value="Library">Library Fines</option>
                <option value="Late Fee">Late Fees</option>
                <option value="Conduct">Disciplinary</option>
                <option value="Attendance">Attendance</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="px-6 py-4">Fine ID</th>
                    <th className="px-6 py-4">Student Details</th>
                    <th className="px-6 py-4">Fine Category</th>
                    <th className="px-6 py-4 text-right">Amount (EGP)</th>
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
                           <p className="text-sm font-bold text-slate-400">Loading fine records...</p>
                         </div>
                      </td>
                    </tr>
                  ) : fines.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                         <div className="flex flex-col items-center gap-2">
                           <Info className="text-slate-300" size={40} />
                           <p className="text-sm font-bold text-slate-400">No fine records found.</p>
                         </div>
                      </td>
                    </tr>
                  ) : (
                    fines.map((record, i) => (
                      <motion.tr 
                        key={record._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-primary">{record.fineId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{record.studentId?.name || "N/A"}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{record.studentId?.studentId || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-widest">
                             {record.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="text-sm font-extrabold text-slate-800">EGP {record.amount.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            record.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                            record.status === 'Unpaid' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {record.status === 'Paid' ? <CheckCircle2 size={12} /> : 
                             record.status === 'Unpaid' ? <XCircle size={12} /> : <Clock size={12} />}
                            {record.status}
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
              <button 
                onClick={() => toast.success("Generating defaulter list...")}
                className="text-xs text-primary font-bold hover:underline cursor-pointer"
              >
                Generate Defaulter Reports
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Utilities */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
             <div className="relative z-10">
                <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-2xl flex items-center justify-center mb-6">
                   <DollarSign size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Bulk Fine System</h3>
                <p className="text-sm text-slate-400 mb-8 leading-relaxed">Automatically assign fines based on system triggers like library delays (EGP 10/day) or late semester payments.</p>
                <div className="flex items-center gap-3 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                   <Clock size={18} className="text-slate-500" />
                   <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Next Trigger: 12 AM</span>
                </div>
                <button 
                  onClick={() => toast.success("Bulk fine system settings opened.")}
                  className="w-full py-4 bg-secondary text-primary font-extrabold rounded-2xl hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  System Settings
                  <ArrowUpRight size={14} />
                </button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-sm">
                <CreditCard size={18} className="text-primary" />
                Collection Summary
             </h3>
             <div className="space-y-4">
                {collectionSummary.map((item, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{item.name}</span>
                        <span>EGP {item.collected.toLocaleString()}</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                        <div className={`h-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-emerald-500' : 'bg-purple-500'}`} style={{ width: `${stats.collectedAmount > 0 ? (item.collected/stats.collectedAmount)*100 : 0}%` }} />
                     </div>
                  </div>
                ))}
             </div>
              <button 
                onClick={() => toast.success("Downloading fine collection report...")}
                className="w-full mt-6 py-3 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <Download size={14} />
                Download Report
              </button>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
             <Info size={18} className="text-blue-500 mt-0.5" />
             <p className="text-[11px] text-blue-700 font-medium">Fines older than 6 months without waiver requests are automatically sent to the Board for disciplinary review.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
