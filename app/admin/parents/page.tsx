"use client";

import { actions } from "@/lib/siteActions";
import { EntityModal, ConfirmDelete, type EntityField } from "@/components/admin/EntityModal";
import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  Eye, 
  Edit3, 
  Trash2, 
  MoreHorizontal,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

export default function ParentManagement() {
  const [parents, setParents] = useState<any[]>([]);
  const [modal, setModal] = useState<{ mode: "add" | "edit" | "view"; item?: any } | null>(null);
  const [del, setDel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchParents = async (search = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/parents${search ? `?search=${search}` : ""}`);
      const data = await res.json();
      setParents(data);
    } catch (error) {
      console.error("Error fetching parents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchParents(searchTerm);
  };

  const fields: EntityField[] = [
    { name: "name", label: "Full name", required: true },
    { name: "parentId", label: "Parent ID", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "tel" },
    { name: "studentRef", label: "Linked student ID", help: "e.g. CSE2024001" },
    { name: "status", label: "Status", type: "select", options: ["Active", "Pending", "Inactive"] },
  ];
  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Parent Management</h1>
          <p className="text-slate-500">Oversee parent-student links and communication portals.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => actions.exportCsv("Export")} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
            <Download size={18} />
            Export
          </button>
          <button onClick={() => setModal({ mode: "add" })} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer">
            <Plus size={18} />
            Add Parent
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Parents", value: parents.length, icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Active Portal Users", value: parents.filter(p => p.status === 'Active').length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Pending Verification", value: parents.filter(p => p.status === 'Pending').length, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleSearch} className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, ID or student..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </form>
        <button onClick={() => actions.filter("More Filters")} className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer">
          <Filter size={18} />
          More Filters
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest">Parent Details</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest">Linked Student</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest">Contact Info</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {parents.map((parent, i) => (
                  <motion.tr 
                    key={parent._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                          {parent.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{parent.name}</p>
                          <p className="text-[10px] font-bold text-primary tracking-wider uppercase">{parent.parentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div>
                          <p className="text-xs font-bold text-slate-700">{parent.studentId?.name || "N/A"}</p>
                          <p className="text-[10px] text-slate-400">{parent.studentId?.studentId || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                          <Mail size={12} className="text-slate-300" /> {parent.email}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                          <Phone size={12} className="text-slate-300" /> {parent.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-bold ${
                        parent.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {parent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setModal({ mode: "view", item: parent })} className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer hover:bg-primary/5 rounded-lg"><Eye size={16} /></button>
                        <button onClick={() => setModal({ mode: "edit", item: parent })} className="p-2 text-slate-400 hover:text-amber-600 transition-all cursor-pointer hover:bg-amber-50 rounded-lg"><Edit3 size={16} /></button>
                        <button onClick={() => setDel(parent)} className="p-2 text-slate-400 hover:text-red-600 transition-all cursor-pointer hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {parents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">No parents found matching your criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal && (
        <EntityModal
          title={`${modal.mode === "add" ? "Add" : modal.mode === "edit" ? "Edit" : "View"} Parent`}
          mode={modal.mode}
          endpoint="/api/admin/parents"
          fields={fields}
          initial={modal.item ? { ...modal.item, studentRef: modal.item.studentId?.studentId || "" } : { status: "Active" }}
          onClose={() => setModal(null)}
          onSaved={() => fetchParents(searchTerm)}
        />
      )}
      {del && <ConfirmDelete what="parent" endpoint="/api/admin/parents" id={del._id} onClose={() => setDel(null)} onDone={() => fetchParents(searchTerm)} />}
    </div>
  );
}
