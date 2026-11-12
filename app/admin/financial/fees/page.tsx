"use client";

import { actions } from "@/lib/siteActions";
import { EntityModal, ConfirmDelete, type EntityField } from "@/components/admin/EntityModal";
import React, { useState, useEffect } from "react";
import { 
  Banknote as DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  FileText, 
  MoreVertical,
  Layers,
  Building2,
  Edit3,
  Trash2,
  PieChart,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const iconMap: Record<string, any> = {
  DollarSign,
  TrendingUp,
  AlertCircle,
  PieChart,
};

export default function FeeStructureManagement() {
  const [feeHeads, setFeeHeads] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFee, setEditFee] = useState<any>(null);
  const [deleteFee, setDeleteFee] = useState<any>(null);
  const feeFields: EntityField[] = [
    { name: "name", label: "Fee name", required: true },
    { name: "dept", label: "Department", required: true, help: "All or a department code, e.g. CSE" },
    { name: "amount", label: "Amount (EGP)", required: true },
    { name: "frequency", label: "Frequency", type: "select", options: ["One-time", "Semester", "Annual", "Monthly"], required: true },
    { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
  ];
  const [newFee, setNewFee] = useState({
    name: "",
    dept: "All",
    amount: "",
    frequency: "Semester",
    status: "Active"
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/financial/fees");
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      setFeeHeads(data.feeHeads || []);
      setStats(data.stats || []);
    } catch (error: any) {
      toast.error("Failed to fetch fee data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddFeeHead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/admin/financial/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFee)
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      toast.success("Fee Head added successfully!");
      setIsModalOpen(false);
      setNewFee({ name: "", dept: "All", amount: "", frequency: "Semester", status: "Active" });
      fetchData(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || "Failed to add fee head");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFeeHeads = feeHeads.filter(fee => 
    fee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fee.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fees & Structure</h1>
          <p className="text-slate-500">Configure university fee categories, payment schedules and departmental structures.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => actions.inquiry("Request: Fee Policy", { type: "contact", title: "Fee Policy", description: "Tell us how to reach you and we will send you this information." })} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
            <FileText size={18} />
            Fee Policy
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={18} />
            Add Fee Head
          </button>
        </div>
      </div>

      {/* Add Fee Head Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 md:p-7 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-5">Create New Fee Head</h2>
            <form onSubmit={handleAddFeeHead} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Fee Name</label>
                <input 
                  required
                  type="text" 
                  value={newFee.name}
                  onChange={(e) => setNewFee({...newFee, name: e.target.value})}
                  placeholder="e.g. Laboratory Fee"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Department</label>
                  <select 
                    value={newFee.dept}
                    onChange={(e) => setNewFee({...newFee, dept: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-medium"
                  >
                    <option value="All">All Departments</option>
                    <option value="CSE">CSE</option>
                    <option value="EEE">EEE</option>
                    <option value="BBA">BBA</option>
                    <option value="Science/Eng">Science/Eng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Frequency</label>
                  <select 
                    value={newFee.frequency}
                    onChange={(e) => setNewFee({...newFee, frequency: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-medium"
                  >
                    <option value="Semester">Semester</option>
                    <option value="Annual">Annual</option>
                    <option value="One-time">One-time</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Amount (EGP)</label>
                <input 
                  required
                  type="number" 
                  value={newFee.amount}
                  onChange={(e) => setNewFee({...newFee, amount: e.target.value})}
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Save Fee Head"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = iconMap[stat.icon] || DollarSign;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-current/10`}>
                  <Icon size={20} />
                </div>
                <ArrowUpRight size={14} className="text-slate-300" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Fee Table */}
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search fee categories..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
               <button onClick={() => actions.filter("Filter rows")} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:text-primary transition-colors cursor-pointer">
                <Filter size={20} />
              </button>
              <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold text-slate-600">
                <option>Active Semester</option>
                <option>2026-27 Plan</option>
                <option>Archives</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="px-6 py-4">Fee Head & ID</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4 text-right">Amount (EGP)</th>
                    <th className="px-6 py-4">Frequency</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredFeeHeads.length > 0 ? (
                    filteredFeeHeads.map((fee, i) => (
                      <motion.tr 
                        key={fee._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{fee.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{fee._id.substring(0, 8)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <Building2 size={14} className="text-slate-300" />
                            {fee.dept}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="text-sm font-extrabold text-slate-800">EGP {fee.amount.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-500 uppercase">{fee.frequency}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            fee.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${fee.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                            {fee.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => setEditFee(fee)} title="Edit" className="p-2 text-slate-400 hover:text-amber-600 transition-all cursor-pointer"><Edit3 size={18} /></button>
                            <button onClick={() => setDeleteFee(fee)} title="Delete" className="p-2 text-slate-400 hover:text-red-600 transition-all cursor-pointer"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm italic">
                        No fee categories found. Add your first fee head to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
             <div className="relative z-10">
                <CreditCard size={32} className="text-secondary mb-6" />
                <h3 className="text-xl font-bold mb-4">Bulk Billing</h3>
                <p className="text-sm text-slate-400 mb-8 leading-relaxed">Automatically generate invoices for all active students based on the current semester's fee structure.</p>
                <div className="flex items-center gap-3 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                   <Layers size={18} className="text-slate-500" />
                   <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">3,100 Students Pending</span>
                </div>
                <button onClick={() => actions.go("/admin/financial/invoices")} className="w-full py-4 bg-secondary text-primary font-extrabold rounded-2xl hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2">
                   Generate Invoices
                   <Download size={14} />
                </button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-primary" />
                Payment Gateways
             </h3>
             <div className="space-y-4">
                {[
                  { name: "Vodafone Cash / Fawry", status: "Active" },
                  { name: "Bank Deposit", status: "Active" },
                  { name: "Visa / Mastercard", status: "Active" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                     <span className="text-xs font-bold text-slate-700">{item.name}</span>
                     <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                ))}
             </div>
             <button onClick={() => actions.go("/admin/settings")} className="w-full mt-6 py-3 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all cursor-pointer">
                Gateway Settings
             </button>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
             <AlertCircle size={18} className="text-amber-500 mt-0.5" />
             <p className="text-[11px] text-amber-700 font-medium">Changes to core tuition fees require a board-level digital authorization token for this academic year.</p>
          </div>
        </div>
      </div>
      {editFee && <EntityModal title="Edit fee" mode="edit" endpoint="/api/admin/financial/fees" fields={feeFields} initial={editFee} onClose={() => setEditFee(null)} onSaved={fetchData} />}
      {deleteFee && <ConfirmDelete what="fee" endpoint="/api/admin/financial/fees" id={deleteFee._id} onClose={() => setDeleteFee(null)} onDone={fetchData} />}
    </div>
  );
}
