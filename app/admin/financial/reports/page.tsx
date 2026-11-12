"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Filter, 
  Calendar, 
  PieChart, 
  FileText, 
  ArrowUpRight, 
  Building2, 
  Banknote as DollarSign, 
  History, 
  Printer, 
  ChevronRight,
  ShieldCheck,
  Briefcase
} from "lucide-react";
import { motion } from "framer-motion";

const reportTypes = [
  { title: "Income Statement", desc: "Detailed revenue vs expenditure for current semester.", icon: FileText, color: "bg-blue-500" },
  { title: "Departmental Revenue", desc: "Breakdown of collections by academic faculties.", icon: Building2, color: "bg-emerald-500" },
  { title: "Defaulter Analysis", desc: "Aged receivable report for outstanding student fees.", icon: History, color: "bg-amber-500" },
  { title: "Expense Ledger", desc: "Operational costs, maintenance and staff payroll.", icon: Briefcase, color: "bg-purple-500" },
];

export default function FinancialReports() {
  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financial Reports & Analytics</h1>
          <p className="text-slate-500">Comprehensive insights into university revenue, expenses and fiscal health.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => actions.print()} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
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
        {/* Main Analytics Dashboard */}
        <div className="lg:col-span-2 space-y-8">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
             >
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                      <TrendingUp size={24} />
                   </div>
                   <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+12.5%</span>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue (MTD)</p>
                <h3 className="text-3xl font-extrabold text-slate-800 mt-1">EGP 12.4M</h3>
                <p className="text-[10px] text-slate-400 mt-2">vs EGP 11.02M last month</p>
             </motion.div>
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
             >
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <PieChart size={24} />
                   </div>
                   <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Budgeted</span>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operational Expense</p>
                <h3 className="text-3xl font-extrabold text-slate-800 mt-1">EGP 4.85M</h3>
                <p className="text-[10px] text-slate-400 mt-2">68% of monthly budget utilized</p>
             </motion.div>
          </div>

          {/* Report Templates */}
          <div className="space-y-4">
             <h3 className="font-bold text-slate-800 px-1">Institutional Financial Statements</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reportTypes.map((type, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group cursor-pointer border-l-4 hover:border-l-primary"
                  >
                     <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl text-white shadow-lg shadow-current/10 ${type.color}`}>
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

          {/* Departmental collection chart stub */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="font-bold text-slate-800">Revenue by Department</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Summer Semester 2026</p>
                </div>
             </div>
             
             {/* Simple CSS-based chart visualization */}
             <div className="h-64 flex items-end justify-between gap-4 px-4">
                {[
                  { label: "CSE", value: 85, color: "bg-primary" },
                  { label: "EEE", value: 65, color: "bg-blue-500" },
                  { label: "BBA", value: 92, color: "bg-emerald-500" },
                  { label: "Law", value: 45, color: "bg-amber-500" },
                  { label: "Arts", value: 30, color: "bg-purple-500" },
                  { label: "Med", value: 75, color: "bg-rose-500" },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                     <div className="w-full relative">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${bar.value}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className={`${bar.color} w-full rounded-t-xl group-hover:opacity-80 transition-opacity cursor-pointer relative`}
                        >
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[8px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              EGP {bar.value * 1.2}M
                           </div>
                        </motion.div>
                     </div>
                     <span className="text-[10px] font-bold text-slate-400">{bar.label}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar Controls & Audit */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
             <div className="relative z-10">
                <ShieldCheck size={32} className="text-secondary mb-6" />
                <h3 className="text-xl font-bold mb-4">Fiscal Audit</h3>
                <p className="text-sm text-slate-400 mb-8 leading-relaxed">External audit reports and compliance certificates are ready for the previous fiscal year ending December 2025.</p>
                <button onClick={() => actions.go("/admin/audit-logs")} className="w-full py-4 bg-secondary text-primary font-extrabold rounded-2xl hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2">
                   View Audit Logs
                   <ArrowUpRight size={14} />
                </button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
             <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <Calendar size={18} className="text-primary" />
                Report Scheduler
             </h3>
             <div className="space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-700">Monthly Ledger</span>
                      <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active</span>
                   </div>
                   <p className="text-[10px] text-slate-400">Auto-generated on the 1st of every month at 12:00 AM.</p>
                </div>
                <button onClick={() => actions.go("/admin/settings")} className="w-full py-3 bg-primary/5 text-primary rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all cursor-pointer">
                  Configure Schedule
                </button>
             </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
             <DollarSign size={18} className="text-amber-500 mt-0.5" />
             <p className="text-[11px] text-amber-700 font-medium">All financial reports follow International Financial Reporting Standards (IFRS) and university compliance guidelines.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
