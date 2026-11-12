"use client";

import { actions } from "@/lib/siteActions";
import { EntityModal, ConfirmDelete, type EntityField } from "@/components/admin/EntityModal";
import React, { useEffect, useState } from "react";
import { 
  Users2, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Edit3, 
  Trash2, 
  Briefcase, 
  Building,
  Filter,
  CheckCircle2,
  XCircle,
  Download,
  Contact,
  IdCard,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

export default function StaffManagement() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [modal, setModal] = useState<{ mode: "add" | "edit" | "view"; item?: any } | null>(null);
  const [del, setDel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStaff = async (search = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/staff${search ? `?search=${search}` : ""}`);
      const data = await res.json();
      setStaffList(data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStaff(searchTerm);
  };

  const stats = [
    { label: "Total Staff", value: staffList.length, icon: Users2, color: "bg-blue-500" },
    { label: "Departments", value: new Set(staffList.map(s => s.department)).size, icon: Building, color: "bg-purple-500" },
    { label: "On Duty", value: staffList.filter(s => s.status === 'Active').length, icon: CheckCircle2, color: "bg-emerald-500" },
    { label: "On Leave", value: staffList.filter(s => s.status === 'Inactive').length, icon: XCircle, color: "bg-amber-500" },
  ];

  const fields: EntityField[] = [
    { name: "name", label: "Full name", required: true },
    { name: "staffId", label: "Staff ID", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "designation", label: "Designation", required: true },
    { name: "department", label: "Department", required: true },
    { name: "phone", label: "Phone", type: "tel" },
    { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
  ];
  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Staff Management</h1>
          <p className="text-slate-500">Manage non-academic personnel, departments, and payroll roles.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => actions.exportCsv("Export List")} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
            <Download size={18} />
            Export List
          </button>
          <button onClick={() => setModal({ mode: "add" })} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer">
            <Plus size={18} />
            Add Staff
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-current/10`}>
              <stat.icon size={24} />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {/* Table Filters */}
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search staff by name, ID or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </form>
          <div className="flex items-center gap-3">
            <button onClick={() => actions.filter("Filter by Dept")} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-primary transition-all cursor-pointer">
              <Filter size={18} />
              Filter by Dept
            </button>
          </div>
        </div>

        {/* Staff Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="px-6 py-4">Staff Details</th>
                  <th className="px-6 py-4">Department & Role</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {staffList.map((staff, i) => (
                  <motion.tr 
                    key={staff._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{staff.name}</p>
                          <p className="text-[10px] text-primary font-medium">{staff.staffId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Briefcase size={12} className="text-slate-400" />
                          {staff.designation}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5">
                          <Building size={12} className="text-slate-400" />
                          {staff.department}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Mail size={12} className="text-slate-400" />
                        {staff.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone size={12} className="text-slate-400" />
                        {staff.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        staff.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${staff.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setModal({ mode: "view", item: staff })} className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer" title="View Profile"><IdCard size={18} /></button>
                        <button onClick={() => setModal({ mode: "edit", item: staff })} className="p-2 text-slate-400 hover:text-amber-600 transition-all cursor-pointer" title="Edit Staff"><Edit3 size={18} /></button>
                        <button onClick={() => setDel(staff)} className="p-2 text-slate-400 hover:text-red-600 transition-all cursor-pointer" title="Remove Staff"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {staffList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">No staff members found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Utilities Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-2xl p-6 text-white flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all">
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Generate ID Cards</h3>
            <p className="text-xs text-slate-400 max-w-[200px]">Bulk generate and print digital ID cards for all new staff members.</p>
          </div>
          <div className="bg-primary/20 p-4 rounded-2xl group-hover:bg-primary group-hover:scale-110 transition-all">
            <Contact size={32} className="text-secondary" />
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all shadow-sm">
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-slate-800">Payroll Roles</h3>
            <p className="text-xs text-slate-500 max-w-[200px]">Configure salary structures and payroll designations for departments.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
            <Briefcase size={32} className="text-primary group-hover:text-white" />
          </div>
        </div>
      </div>
      {modal && (
        <EntityModal
          title={`${modal.mode === "add" ? "Add" : modal.mode === "edit" ? "Edit" : "View"} Staff member`}
          mode={modal.mode}
          endpoint="/api/admin/staff"
          fields={fields}
          initial={modal.item || { status: "Active" }}
          onClose={() => setModal(null)}
          onSaved={() => fetchStaff(searchTerm)}
        />
      )}
      {del && <ConfirmDelete what="staff member" endpoint="/api/admin/staff" id={del._id} onClose={() => setDel(null)} onDone={() => fetchStaff(searchTerm)} />}
    </div>
  );
}
