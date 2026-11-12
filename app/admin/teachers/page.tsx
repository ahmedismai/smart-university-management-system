"use client";

import { actions } from "@/lib/siteActions";
import React, { useEffect, useState } from "react";
import { Search, Filter, Plus, Mail, Phone, Eye, Edit3, Trash2, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    teacherId: "",
    department: "",
    status: "Active"
  });
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view" | "delete">("add");
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  const fetchTeachers = async (search = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/teachers${search ? `?search=${search}` : ""}`);
      const data = await res.json();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTeachers(searchTerm);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      teacherId: "",
      department: "",
      status: "Active"
    });
    setSelectedTeacher(null);
  };

  const openModal = (mode: "add" | "edit" | "view" | "delete", teacher: any = null) => {
    setModalMode(mode);
    setSelectedTeacher(teacher);
    if (teacher && mode !== "add") {
      setFormData({
        name: teacher.name,
        email: teacher.email,
        teacherId: teacher.teacherId,
        department: teacher.department,
        status: teacher.status
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = modalMode === "edit" ? `/api/admin/teachers/${selectedTeacher._id}` : "/api/admin/teachers";
      const method = modalMode === "edit" ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchTeachers();
      } else {
        const data = await res.json();
        alert(data.error || `Failed to ${modalMode} teacher`);
      }
    } catch (error) {
      console.error(`Error ${modalMode}ing teacher:`, error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTeacher) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/teachers/${selectedTeacher._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchTeachers();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete teacher");
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Teacher Management</h1>
          <p className="text-slate-500">Manage faculty members, departments and contact info.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => openModal("add")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={16} />
            Add Teacher
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <form onSubmit={handleSearch} className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search teachers..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button onClick={() => actions.filter("Filter rows")} type="button" className="p-2 border border-slate-200 rounded-lg bg-white text-slate-500 hover:text-primary cursor-pointer">
              <Filter size={18} />
            </button>
          </form>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {teachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-primary">{teacher.teacherId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                          {teacher.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-800">{teacher.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{teacher.department}</td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <Mail size={12} /> {teacher.email}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <Phone size={12} /> 01700000000 {/* Placeholder */}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        teacher.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openModal("view", teacher)}
                          className="p-1.5 text-slate-400 hover:text-primary transition-all cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => openModal("edit", teacher)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 transition-all cursor-pointer"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => openModal("delete", teacher)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {teachers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm">No teachers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {modalMode === "add" && "Add New Teacher"}
                    {modalMode === "edit" && "Edit Teacher Details"}
                    {modalMode === "view" && "Teacher Information"}
                    {modalMode === "delete" && "Delete Teacher"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {modalMode === "add" && "Fill in the details to register a new teacher."}
                    {modalMode === "edit" && "Modify the teacher's information below."}
                    {modalMode === "view" && "Detailed view of the teacher's profile."}
                    {modalMode === "delete" && "Are you sure you want to remove this teacher?"}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {modalMode === "delete" ? (
                <div className="p-6 space-y-6">
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4">
                    <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
                      <Trash2 size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-red-900">Confirm Deletion</p>
                      <p className="text-xs text-red-700 mt-1 leading-relaxed">
                        You are about to delete <span className="font-bold underline">{selectedTeacher?.name}</span>. 
                        This will permanently remove their record from the database. This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDelete}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Delete Teacher"}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Full Name</label>
                      <input 
                        type="text" 
                        required
                        disabled={modalMode === "view"}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Dr. John Doe"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-70 disabled:bg-slate-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Teacher ID</label>
                      <input 
                        type="text" 
                        required
                        disabled={modalMode === "view"}
                        value={formData.teacherId}
                        onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                        placeholder="e.g. TCH-001"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-70 disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Email Address</label>
                    <input 
                      type="email" 
                      required
                      disabled={modalMode === "view"}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="teacher@university.edu"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-70 disabled:bg-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Department</label>
                      <select 
                        required
                        disabled={modalMode === "view"}
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-70 disabled:bg-slate-100"
                      >
                        <option value="">Select Department</option>
                        <option value="CSE">CSE</option>
                        <option value="EEE">EEE</option>
                        <option value="BBA">BBA</option>
                        <option value="Architecture">Architecture</option>
                        <option value="English">English</option>
                        <option value="LLB">LLB</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Status</label>
                      <select 
                        disabled={modalMode === "view"}
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-70 disabled:bg-slate-100"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {modalMode === "view" ? "Close" : "Cancel"}
                    </button>
                    {modalMode !== "view" && (
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            {modalMode === "edit" ? "Updating..." : "Adding..."}
                          </>
                        ) : (
                          modalMode === "edit" ? "Update Teacher" : "Add Teacher"
                        )}
                      </button>
                    )}
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
