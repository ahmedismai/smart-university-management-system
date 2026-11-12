"use client";

import { actions } from "@/lib/siteActions";
import toast from "react-hot-toast";
import React from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MoreVertical, 
  Eye, 
  Printer, 
  Mail, 
  CreditCard, 
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  Users,
  X
} from "lucide-react";
import { motion } from "framer-motion";

// Removed static invoices data

// Removed static stats data

export default function InvoiceManagement() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>({
    invoices: [],
    stats: [],
    summary: { totalExpected: "0M", currentCollection: "0M" },
    departmentalStatus: []
  });

  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All Statuses");
  const [showModal, setShowModal] = React.useState(false);
  const [students, setStudents] = React.useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [newInvoice, setNewInvoice] = React.useState({
    studentId: "",
    amount: "",
    dueDate: new Date().toISOString().split('T')[0]
  });

  const [sendingReminders, setSendingReminders] = React.useState(false);
  const overdueCount = Number(String((data.stats || []).find((st: any) => st.label === "Overdue")?.value || "0").replace(/,/g, "")) || 0;

  const sendReminders = async () => {
    setSendingReminders(true);
    try {
      const res = await fetch("/api/admin/financial/reminders", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not send reminders");
      toast.success(json.message);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSendingReminders(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/financial/invoices");
      const result = await res.json();
      if (result.invoices) {
        setData(result);
      }
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/admin/students");
      const result = await res.json();
      setStudents(result);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  React.useEffect(() => {
    fetchInvoices();
    fetchStudents();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.studentId || !newInvoice.amount || !newInvoice.dueDate) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/admin/financial/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoice)
      });

      if (res.ok) {
        setShowModal(false);
        setNewInvoice({ studentId: "", amount: "", dueDate: new Date().toISOString().split('T')[0] });
        fetchInvoices();
      }
    } catch (error) {
      console.error("Failed to create invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "FileText": return FileText;
      case "CheckCircle2": return CheckCircle2;
      case "Clock": return Clock;
      case "AlertCircle": return AlertCircle;
      default: return FileText;
    }
  };

  const filteredInvoices = data.invoices.filter((inv: any) => {
    const matchesSearch = inv.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         inv.stuId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All Statuses" || 
                         (statusFilter === "Paid Only" && inv.status === "Paid") ||
                         (statusFilter === "Pending Only" && inv.status === "Pending") ||
                         (statusFilter === "Overdue Only" && inv.status === "Overdue");

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Invoices Management</h1>
          <p className="text-slate-500">Oversee student billing, payment statuses and institutional accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => actions.print()} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
            <Printer size={18} />
            Bulk Print
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={18} />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.stats.map((stat: any, i: number) => {
          const Icon = getIcon(stat.icon);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-current/10`}>
                <Icon size={20} />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Invoices Table */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by student name or ID..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => actions.filter("Filter rows")} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:text-primary transition-colors cursor-pointer">
                <Filter size={20} />
              </button>
              <select 
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold text-slate-600"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Statuses</option>
                <option>Paid Only</option>
                <option>Pending Only</option>
                <option>Overdue Only</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="px-6 py-4">Invoice ID</th>
                    <th className="px-6 py-4">Student Details</th>
                    <th className="px-6 py-4 text-right">Amount (EGP)</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredInvoices.map((inv: any, i: number) => (
                    <motion.tr 
                      key={inv.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-primary group-hover:underline cursor-pointer">{inv.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{inv.student}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{inv.stuId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <span className="text-sm font-extrabold text-slate-800">EGP {inv.amount}</span>
                         <p className="text-[9px] text-slate-400 mt-0.5">{inv.method !== 'N/A' ? `via ${inv.method}` : 'No Payment'}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-600">{inv.dueDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                          inv.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {inv.status === 'Paid' ? <CheckCircle2 size={12} /> : 
                           inv.status === 'Overdue' ? <AlertCircle size={12} /> : <Clock size={12} />}
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={(e) => actions.details(e)} className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer"><MoreVertical size={18} /></button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 flex items-center justify-center">
              <button onClick={() => actions.exportCsv("Export Account Statement (CSV)")} className="text-xs text-primary font-bold hover:underline cursor-pointer">Export Account Statement (CSV)</button>
            </div>
          </div>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
             <div className="relative z-10">
                <TrendingUp size={32} className="text-secondary mb-6" />
                <h3 className="text-xl font-bold mb-4">Financial Summary</h3>
                <div className="space-y-4 mb-8">
                   <div className="flex justify-between items-end border-b border-white/10 pb-4">
                      <span className="text-xs text-slate-400">Total Expected</span>
                      <span className="text-lg font-bold text-white">EGP {data.summary.totalExpected}</span>
                   </div>
                   <div className="flex justify-between items-end border-b border-white/10 pb-4">
                      <span className="text-xs text-slate-400">Current Collection</span>
                      <span className="text-lg font-bold text-emerald-400">EGP {data.summary.currentCollection}</span>
                   </div>
                </div>
                <button onClick={() => actions.exportCsv("Detailed Ledger")} className="w-full py-4 bg-secondary text-primary font-extrabold rounded-2xl hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2">
                   Detailed Ledger
                   <ArrowUpRight size={14} />
                </button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
             <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <ShieldCheck size={18} className="text-primary" />
                Quick Actions
             </h3>
             <div className="grid grid-cols-1 gap-3">
                <button onClick={sendReminders} disabled={sendingReminders} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4 group hover:bg-primary transition-all cursor-pointer">
                   <div className="p-3 bg-white rounded-xl text-primary group-hover:bg-primary/20 group-hover:text-white">
                      <Mail size={18} />
                   </div>
                   <div className="text-left">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-white">Send Reminders</p>
                      <p className="text-[10px] text-slate-400 group-hover:text-white/60">{overdueCount ? `For ${overdueCount} overdue invoice${overdueCount > 1 ? "s" : ""}` : "No overdue invoices"}</p>
                   </div>
                </button>
                <button onClick={() => actions.go("/admin/financial/payments")} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4 group hover:bg-primary transition-all cursor-pointer">
                   <div className="p-3 bg-white rounded-xl text-primary group-hover:bg-primary/20 group-hover:text-white">
                      <CreditCard size={18} />
                   </div>
                   <div className="text-left">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-white">Verify Payments</p>
                      <p className="text-[10px] text-slate-400 group-hover:text-white/60">Process bank settlements</p>
                   </div>
                </button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-sm">
                <Building2 size={18} className="text-primary" />
                Departmental Status
             </h3>
             <div className="space-y-4">
                {data.departmentalStatus.map((dept: any, i: number) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{dept.name}</span>
                        <span className="text-primary">{dept.paid}% Paid</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${dept.paid}%` }}
                           className="h-full bg-primary" 
                        />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Create New Invoice</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Student</label>
                <select 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  value={newInvoice.studentId}
                  onChange={(e) => setNewInvoice({ ...newInvoice, studentId: e.target.value })}
                >
                  <option value="">Choose a student...</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.name} ({student.studentId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Invoice Amount (EGP)</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 65000"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Due Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                />
              </div>
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-white font-extrabold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? "Generating..." : "Generate Invoice"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
