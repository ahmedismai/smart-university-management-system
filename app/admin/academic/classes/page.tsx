"use client";

import { actions } from "@/lib/siteActions";
import React, { useEffect, useState } from "react";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Building2, 
  Users, 
  Layers, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye,
  GraduationCap,
  ArrowUpRight,
  ClipboardList,
  Loader2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClassManagement() {
  const [classesList, setClassesList] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    teacherId: ""
  });
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view" | "delete">("add");
  const [selectedClass, setSelectedClass] = useState<any>(null);

  const fetchData = async (search = "") => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        fetch(`/api/admin/classes${search ? `?search=${search}` : ""}`),
        fetch("/api/admin/teachers")
      ]);
      
      if (results[0].status === 'fulfilled' && results[0].value.ok) {
        const classData = await results[0].value.json();
        setClassesList(Array.isArray(classData) ? classData : []);
      }

      if (results[1].status === 'fulfilled' && results[1].value.ok) {
        const teacherData = await results[1].value.json();
        setTeachers(Array.isArray(teacherData) ? teacherData : []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(searchTerm);
  };

  const resetForm = () => {
    setFormData({ name: "", code: "", teacherId: "" });
    setSelectedClass(null);
  };

  const openModal = (mode: "add" | "edit" | "view" | "delete", classItem: any = null) => {
    setModalMode(mode);
    setSelectedClass(classItem);
    if (classItem && mode !== "add") {
      setFormData({
        name: classItem.name,
        code: classItem.code,
        teacherId: classItem.teacherId?._id || classItem.teacherId || ""
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
      const url = modalMode === "edit" ? `/api/admin/classes/${selectedClass._id}` : "/api/admin/classes";
      const method = modalMode === "edit" ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || `Failed to ${modalMode} class`);
      }
    } catch (error) {
      console.error(`Error ${modalMode}ing class:`, error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClass) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/classes/${selectedClass._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete class");
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { label: "Total Departments", value: new Set(classesList.map(c => c.code)).size, icon: Building2, color: "bg-blue-500" },
    { label: "Active Classes", value: classesList.length, icon: BookOpen, color: "bg-emerald-500" },
    { label: "Total Sections", value: classesList.reduce((acc, c) => acc + (c.sectionCount || 0), 0), icon: Layers, color: "bg-purple-500" },
    { label: "Total Enrollment", value: classesList.reduce((acc, c) => acc + (c.studentCount || 0), 0), icon: Users, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Academic Classes</h1>
          <p className="text-slate-500">Manage university departments, class structures and enrollments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => actions.go("/admin/academic/routines")} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
            <ClipboardList size={18} />
            Class Schedule
          </button>
          <button 
            onClick={() => openModal("add")}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={18} />
            Add New Class
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-current/10`}>
                <stat.icon size={20} />
              </div>
              <ArrowUpRight size={16} className="text-slate-300" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table Filters */}
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search classes by name, code or head..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </form>
          <div className="flex items-center gap-3">
             <button onClick={() => actions.filter("Filter by Faculty")} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-primary transition-all cursor-pointer">
              <Filter size={18} />
              Filter by Faculty
            </button>
          </div>
        </div>

        {/* Classes Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="px-6 py-4">Department / Class</th>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Sections</th>
                  <th className="px-6 py-4">Total Students</th>
                  <th className="px-6 py-4">Head of Dept</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {classesList.map((cls, i) => (
                  <motion.tr 
                    key={cls._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold text-xs border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all uppercase">
                          {cls.code.substring(0, 3)}
                        </div>
                        <span className="text-sm font-bold text-slate-800">{cls.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{cls.code}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <Layers size={14} className="text-slate-400" />
                        {cls.sectionCount} Sections
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <Users size={14} className="text-slate-400" />
                        {cls.studentCount} Students
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <GraduationCap size={14} className="text-slate-400" />
                        {cls.teacherId?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {cls.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openModal("view", cls)}
                          className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer" 
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => openModal("edit", cls)}
                          className="p-2 text-slate-400 hover:text-amber-600 transition-all cursor-pointer" 
                          title="Edit Class"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => openModal("delete", cls)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-all cursor-pointer" 
                          title="Delete Class"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {classesList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">No classes found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Info */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium tracking-wide">Showing {classesList.length} active university departments</p>
          <button onClick={() => actions.go("/admin/academic/classes")} className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer">
            View All Classes
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Add Class Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                      {modalMode === "add" && <>Add New <span className="text-primary">Class</span></>}
                      {modalMode === "edit" && <>Edit <span className="text-primary">Class</span></>}
                      {modalMode === "view" && <><span className="text-primary">Class</span> Details</>}
                      {modalMode === "delete" && <>Delete <span className="text-primary">Class</span></>}
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                      {modalMode === "delete" ? "This action cannot be undone" : "Institutional Academic Structure"}
                    </p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                {modalMode === "delete" ? (
                  <div className="space-y-6">
                    <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-start gap-4">
                      <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                        <Trash2 size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-red-900">Delete Confirmation</p>
                        <p className="text-xs text-red-700 mt-1 leading-relaxed font-medium">
                          You are about to delete <span className="font-bold underline">{selectedClass?.name}</span>. 
                          This will remove the department record from the system.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Delete Now"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Class Name</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === "view"}
                          placeholder="e.g. Computer Science & Engineering"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Class Code</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === "view"}
                          placeholder="e.g. CSE-101"
                          value={formData.code}
                          onChange={(e) => setFormData({...formData, code: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Head of Department</label>
                        <select 
                          required
                          disabled={modalMode === "view"}
                          value={formData.teacherId}
                          onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all cursor-pointer disabled:opacity-60"
                        >
                          <option value="">Select a Teacher</option>
                          {teachers.length > 0 ? (
                            teachers.map(t => (
                              <option key={t._id} value={t._id}>{t.name} ({t.department})</option>
                            ))
                          ) : (
                            <option disabled>{loading ? "Loading teachers..." : "No teachers available"}</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="pt-4">
                      {modalMode === "view" ? (
                        <button 
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="w-full py-4 border border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          Close Details
                        </button>
                      ) : (
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <>
                              <Plus size={18} /> 
                              {modalMode === "edit" ? "Update Class" : "Create Class"}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
