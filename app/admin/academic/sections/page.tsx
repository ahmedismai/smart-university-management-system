"use client";

import { actions } from "@/lib/siteActions";
import React, { useEffect, useState } from "react";
import { 
  Layers, 
  Plus, 
  Search, 
  Users, 
  User, 
  MapPin, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SectionManagement() {
  const [sectionsList, setSectionsList] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    sectionId: "",
    classId: "",
    teacherId: "",
    room: "",
    capacity: 50
  });
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view" | "delete">("add");
  const [selectedSection, setSelectedSection] = useState<any>(null);

  const fetchData = async (search = "") => {
    setLoading(true);
    try {
      const [secRes, classRes, teacherRes] = await Promise.all([
        fetch(`/api/admin/sections${search ? `?search=${search}` : ""}`),
        fetch("/api/admin/classes"),
        fetch("/api/admin/teachers")
      ]);
      const secData = await secRes.json();
      const classData = await classRes.json();
      const teacherData = await teacherRes.json();
      setSectionsList(secData);
      setClasses(classData);
      setTeachers(teacherData);
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
    setFormData({ name: "", sectionId: "", classId: "", teacherId: "", room: "", capacity: 50 });
    setSelectedSection(null);
  };

  const openModal = (mode: "add" | "edit" | "view" | "delete", section: any = null) => {
    setModalMode(mode);
    setSelectedSection(section);
    if (section && mode !== "add") {
      setFormData({
        name: section.name,
        sectionId: section.sectionId,
        classId: section.classId?._id || section.classId || "",
        teacherId: section.teacherId?._id || section.teacherId || "",
        room: section.room || "",
        capacity: section.capacity || 50
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
      const url = modalMode === "edit" ? `/api/admin/sections/${selectedSection._id}` : "/api/admin/sections";
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
        alert(data.error || `Failed to ${modalMode} section`);
      }
    } catch (error) {
      console.error(`Error ${modalMode}ing section:`, error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSection) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/sections/${selectedSection._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete section");
      }
    } catch (error) {
      console.error("Error deleting section:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { label: "Total Sections", value: sectionsList.length, icon: Layers, color: "bg-blue-500" },
    { label: "Active Now", value: sectionsList.filter(s => s.status === 'Active').length, icon: CheckCircle2, color: "bg-emerald-500" },
    { label: "Full Sections", value: sectionsList.filter(s => s.status === 'Full' || s.studentCount >= s.capacity).length, icon: AlertCircle, color: "bg-amber-500" },
    { label: "Total Students", value: sectionsList.reduce((acc, s) => acc + (s.studentCount || 0), 0), icon: Users, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Academic Sections</h1>
          <p className="text-slate-500">Manage class sections, room allocations, and student distribution.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => openModal("add")}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={18} />
            Add Section
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
            <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-current/20`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stat.value}</p>
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
              placeholder="Search sections by name, room or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </form>
          <div className="flex items-center gap-3">
             <button onClick={() => actions.filter("All Classes")} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-primary transition-all cursor-pointer">
              <Filter size={18} />
              All Classes
            </button>
          </div>
        </div>

        {/* Sections Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="px-6 py-4">Section Info</th>
                  <th className="px-6 py-4">Class</th>
                  <th className="px-6 py-4">Room & Teacher</th>
                  <th className="px-6 py-4">Enrollment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sectionsList.map((sec, i) => {
                  const isFull = sec.studentCount >= sec.capacity;
                  return (
                    <motion.tr 
                      key={sec._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200 group-hover:bg-primary group-hover:text-white transition-all uppercase">
                            {sec.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{sec.name}</p>
                            <p className="text-[10px] text-primary font-bold tracking-widest">{sec.sectionId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {sec.classId?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                            <MapPin size={12} className="text-slate-400" />
                            Room {sec.room}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                            <User size={12} className="text-slate-300" />
                            {sec.teacherId?.name || "Unassigned"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full max-w-[100px] space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className={isFull ? "text-red-500" : "text-slate-400"}>{sec.studentCount}/{sec.capacity}</span>
                            <span className="text-slate-300">{Math.round((sec.studentCount/sec.capacity)*100)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(sec.studentCount/sec.capacity)*100}%` }}
                              className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-primary'}`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                          isFull ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          {isFull ? 'Full' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => openModal("view", sec)}
                            className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer" 
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => openModal("edit", sec)}
                            className="p-2 text-slate-400 hover:text-amber-600 transition-all cursor-pointer" 
                            title="Edit Section"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => openModal("delete", sec)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-all cursor-pointer" 
                            title="Delete Section"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
                {sectionsList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">No sections found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Section Modal */}
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
              className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                      {modalMode === "add" && <>Create <span className="text-primary">Section</span></>}
                      {modalMode === "edit" && <>Edit <span className="text-primary">Section</span></>}
                      {modalMode === "view" && <><span className="text-primary">Section</span> Details</>}
                      {modalMode === "delete" && <>Delete <span className="text-primary">Section</span></>}
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                      {modalMode === "delete" ? "This action cannot be undone" : "Assign Class & Room Space"}
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
                          You are about to delete <span className="font-bold underline">{selectedSection?.name}</span>. 
                          This will remove the section record from the system.
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
                  <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Section Name</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === "view"}
                          placeholder="e.g. Section A"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Section ID</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === "view"}
                          placeholder="e.g. SEC-101"
                          value={formData.sectionId}
                          onChange={(e) => setFormData({...formData, sectionId: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Room Number</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === "view"}
                          placeholder="e.g. L-401"
                          value={formData.room}
                          onChange={(e) => setFormData({...formData, room: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all disabled:opacity-60"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Select Class</label>
                        <select 
                          required
                          disabled={modalMode === "view"}
                          value={formData.classId}
                          onChange={(e) => setFormData({...formData, classId: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all cursor-pointer disabled:opacity-60"
                        >
                          <option value="">Select a Class</option>
                          {classes.map(c => (
                            <option key={c._id} value={c._id}>{c.name} ({c.code})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Class Teacher</label>
                        <select 
                          required
                          disabled={modalMode === "view"}
                          value={formData.teacherId}
                          onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all cursor-pointer disabled:opacity-60"
                        >
                          <option value="">Select a Teacher</option>
                          {teachers.map(t => (
                            <option key={t._id} value={t._id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Capacity</label>
                        <input 
                          type="number" 
                          required
                          min="1"
                          disabled={modalMode === "view"}
                          value={formData.capacity}
                          onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all disabled:opacity-60"
                        />
                      </div>
                    </div>

                    <div className="col-span-2 pt-4">
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
                              {modalMode === "edit" ? "Update Section" : "Create Section"}
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
