"use client";

import { actions } from "@/lib/siteActions";
import { EntityModal, ConfirmDelete, type EntityField } from "@/components/admin/EntityModal";
import React, { useEffect, useState } from "react";
import { Search, Filter, Plus, Download, Trash2, Edit3, Eye, MoreHorizontal, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [modal, setModal] = useState<{ mode: "add" | "edit" | "view"; item?: any } | null>(null);
  const [del, setDel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRole, setActiveRole] = useState("All");

  const fetchUsers = async (search = "", role = "All") => {
    setLoading(true);
    try {
      let url = `/api/admin/users?`;
      if (search) url += `search=${search}&`;
      if (role !== "All") url += `role=${role}&`;
      
      const res = await fetch(url);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const firstLoad = React.useRef(true);
  useEffect(() => {
    // the global search opens this page as /admin/users?search=<email>
    const initial = firstLoad.current ? new URLSearchParams(window.location.search).get("search") || "" : searchTerm;
    if (firstLoad.current && initial) setSearchTerm(initial);
    firstLoad.current = false;
    fetchUsers(initial, activeRole);
  }, [activeRole]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(searchTerm, activeRole);
  };

  const fields: EntityField[] = [
    { name: "name", label: "Full name", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "password", label: "Password", type: "password", help: "At least 6 characters. When editing, leave empty to keep the current password." },
    { name: "role", label: "Role", type: "select", options: ["Admin", "Student", "Teacher", "Staff", "Parent"], required: true },
    { name: "department", label: "Department" },
    { name: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Suspended"] },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500">Manage all system users, roles and permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => actions.exportCsv("Export")} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer">
            <Download size={16} />
            Export
          </button>
          <button onClick={() => setModal({ mode: "add" })} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer">
            <Plus size={16} />
            Add New User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Filter size={18} />
            Quick Filters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Search User</label>
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Name or Email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </form>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Role Type</label>
              <div className="flex flex-wrap gap-2">
                {["All", "Admin", "Teacher", "Student", "Staff", "Parent"].map((role) => (
                  <button 
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeRole === role 
                      ? 'bg-primary text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Account Status</label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((user, i) => (
                    <motion.tr 
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm overflow-hidden">
                            {user.image ? (
                              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              user.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'Teacher' ? 'bg-blue-100 text-blue-700' :
                          user.role === 'Student' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">{user.department || "-"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'
                          }`} />
                          <span className="text-xs font-medium text-slate-700">{user.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setModal({ mode: "view", item: user })} className="p-1.5 text-slate-400 hover:text-primary transition-all cursor-pointer"><Eye size={16} /></button>
                          <button onClick={() => setModal({ mode: "edit", item: user })} className="p-1.5 text-slate-400 hover:text-amber-600 transition-all cursor-pointer"><Edit3 size={16} /></button>
                          <button onClick={() => setDel(user)} className="p-1.5 text-slate-400 hover:text-red-600 transition-all cursor-pointer"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm font-medium">No users found matching your criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {modal && (
        <EntityModal
          title={`${modal.mode === "add" ? "Add" : modal.mode === "edit" ? "Edit" : "View"} User`}
          mode={modal.mode}
          endpoint="/api/admin/users"
          fields={fields}
          initial={modal.item || { role: "Student", status: "Active" }}
          onClose={() => setModal(null)}
          onSaved={() => fetchUsers(searchTerm, activeRole)}
        />
      )}
      {del && <ConfirmDelete what="user" endpoint="/api/admin/users" id={del._id} onClose={() => setDel(null)} onDone={() => fetchUsers(searchTerm, activeRole)} />}
    </div>
  );
}
