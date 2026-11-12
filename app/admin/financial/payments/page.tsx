"use client";

import { actions } from "@/lib/siteActions";
import { PaymentReviewModal } from "@/components/admin/PaymentReviewModal";
import React from "react";
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowUpRight, 
  Smartphone, 
  Building, 
  MoreVertical, 
  ShieldCheck, 
  Banknote as DollarSign, 
  TrendingUp, 
  ExternalLink,
  Calendar,
  Eye,
  RefreshCcw,
  Zap,
  PieChart
} from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentTracking() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>({
    payments: [],
    stats: [],
    methodBreakdown: []
  });
  const [searchTerm, setSearchTerm] = React.useState("");
  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [onlyToday, setOnlyToday] = React.useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/financial/payments");
      const result = await res.json();
      if (result.payments) {
        setData(result);
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPayments();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "DollarSign": return DollarSign;
      case "Zap": return Zap;
      case "Clock": return Clock;
      case "RefreshCcw": return RefreshCcw;
      default: return DollarSign;
    }
  };

  const todayLabel = new Date().toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
  const pendingRows = data.payments.filter((txn: any) => txn.status === "Pending");
  const filteredPayments = data.payments.filter(
    (txn: any) =>
      (txn.student.toLowerCase().includes(searchTerm.toLowerCase()) || txn.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!onlyToday || String(txn.date).startsWith(todayLabel))
  );

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
          <h1 className="text-2xl font-bold text-slate-800">Payment Tracking</h1>
          <p className="text-slate-500">Monitor real-time transactions, verify settlements and manage refunds.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => actions.exportCsv("Reconciliation")} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
            <Download size={18} />
            Reconciliation
          </button>
          <button onClick={() => setReviewOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer">
            <ShieldCheck size={18} />
            Settle Pending{pendingRows.length ? ` (${pendingRows.length})` : ""}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-current/10`}>
                  <Icon size={20} />
                </div>
                <TrendingUp size={16} className="text-emerald-500" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Transaction Table */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search transaction ID or student..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
               <button onClick={() => setOnlyToday((v) => !v)} aria-pressed={onlyToday} className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold ${onlyToday ? "bg-primary text-white border-primary" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                  <Calendar size={14} />
                  Today
               </button>
               <button onClick={() => actions.filter("Filter rows")} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:text-primary transition-colors cursor-pointer">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Student & Type</th>
                    <th className="px-6 py-4 text-right">Amount (EGP)</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredPayments.map((txn: any, i: number) => (
                    <motion.tr 
                      key={txn.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-primary cursor-pointer hover:underline">{txn.id}</span>
                        <p className="text-[9px] text-slate-400 mt-0.5">{txn.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{txn.student}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{txn.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <span className="text-sm font-extrabold text-slate-800">EGP {txn.amount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                           {txn.method.toLowerCase().includes('vodafone') || txn.method.toLowerCase().includes('fawry') ? <Smartphone size={14} className="text-slate-400" /> : <Building size={14} className="text-slate-400" />}
                           {txn.method}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          txn.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 
                          txn.status === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {txn.status === 'Success' ? <CheckCircle2 size={12} /> : 
                           txn.status === 'Failed' ? <XCircle size={12} /> : <Clock size={12} />}
                          {txn.status}
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
            <div className="p-4 bg-slate-50 flex items-center justify-center gap-4">
              <button onClick={() => actions.exportCsv("Download Reconciliation Report")} className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-1">
                Download Reconciliation Report
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
             <div className="relative z-10">
                <Smartphone size={32} className="text-secondary mb-6" />
                <h3 className="text-xl font-bold mb-4">MFS Settlement</h3>
                <p className="text-sm text-slate-400 mb-8 leading-relaxed">Daily settlement of Vodafone Cash and Fawry payments is scheduled for 4:00 PM. All verified transactions will be moved to the Main Ledger.</p>
                <div className="flex items-center gap-3 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                   <RefreshCcw size={18} className="text-emerald-400 animate-spin-slow" />
                   <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Next Sync in 2h 45m</span>
                </div>
                <button onClick={() => actions.print()} className="w-full py-4 bg-secondary text-primary font-extrabold rounded-2xl hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2">
                   Manual Sync Now
                </button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
             <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <PieChart size={18} className="text-primary" />
                Method Breakdown
             </h3>
             <div className="space-y-4">
                {data.methodBreakdown.map((item: any, i: number) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <span>{item.name}</span>
                        <span>{item.value}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${item.value}%` }}
                           className={`h-full ${item.color}`} 
                        />
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                <ShieldCheck size={18} className="text-primary" />
                Verification Queue
             </h3>
             <div className={`p-3 border rounded-xl ${pendingRows.length ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"}`}>
                <p className={`text-[10px] font-medium leading-relaxed ${pendingRows.length ? "text-amber-700" : "text-emerald-700"}`}>
                  {pendingRows.length
                    ? `${pendingRows.length} payment${pendingRows.length > 1 ? "s" : ""} submitted by students ${pendingRows.length > 1 ? "are" : "is"} waiting to be verified.`
                    : "All submitted payments are verified."}
                </p>
                {pendingRows.length > 0 && (
                  <button onClick={() => setReviewOpen(true)} className="mt-2 text-[10px] font-bold text-amber-700 hover:underline cursor-pointer uppercase">Review Now</button>
                )}
             </div>
          </div>
        </div>
      </div>
      {reviewOpen && <PaymentReviewModal rows={pendingRows} onClose={() => setReviewOpen(false)} onDone={fetchPayments} />}
    </div>
  );
}
