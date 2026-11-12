"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import { Banknote as DollarSign, Receipt, CreditCard, Gift, AlertTriangle, FileBarChart } from "lucide-react";

export default function FinancialManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Financial Management</h1>
        <p className="text-slate-500">Manage fees, invoices, payments and scholarships.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", val: "EGP 12M", icon: DollarSign, color: "bg-blue-600" },
          { label: "Fees Collected", val: "EGP 4.55M", icon: Receipt, color: "bg-emerald-600" },
          { label: "Pending Dues", val: "EGP 1.24M", icon: AlertTriangle, color: "bg-amber-600" },
          { label: "Waivers Given", val: "EGP 280K", icon: Gift, color: "bg-purple-600" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4`}>
              <item.icon size={20} />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{item.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Recent Invoices</h3>
            <button onClick={() => actions.go("/admin/financial/invoices")} className="text-xs text-primary font-bold cursor-pointer">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <Receipt size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">INV-2026-00{i}</p>
                    <p className="text-[10px] text-slate-500">Student: Md. Amin • CSE-A</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">EGP 25,000</p>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Paid</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => actions.go("/admin/financial/payments")} className="flex flex-col items-center gap-2 p-6 bg-slate-50 rounded-2xl hover:bg-primary hover:text-white transition-all group cursor-pointer">
              <CreditCard size={24} className="text-primary group-hover:text-white" />
              <span className="text-sm font-bold">Collect Fee</span>
            </button>
            <button onClick={() => actions.go("/admin/financial/waivers")} className="flex flex-col items-center gap-2 p-6 bg-slate-50 rounded-2xl hover:bg-primary hover:text-white transition-all group cursor-pointer">
              <Gift size={24} className="text-primary group-hover:text-white" />
              <span className="text-sm font-bold">Add Waiver</span>
            </button>
            <button onClick={() => actions.exportCsv("Financial Report")} className="flex flex-col items-center gap-2 p-6 bg-slate-50 rounded-2xl hover:bg-primary hover:text-white transition-all group cursor-pointer">
              <FileBarChart size={24} className="text-primary group-hover:text-white" />
              <span className="text-sm font-bold">Financial Report</span>
            </button>
            <button onClick={() => actions.go("/admin/financial/fines")} className="flex flex-col items-center gap-2 p-6 bg-slate-50 rounded-2xl hover:bg-primary hover:text-white transition-all group cursor-pointer">
              <DollarSign size={24} className="text-primary group-hover:text-white" />
              <span className="text-sm font-bold">Manage Fines</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
