"use client";

import { actions } from "@/lib/siteActions";
import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Building2, 
  Award, 
  FileText, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye,
  Download,
  Upload,
  BookOpen,
  Library,
  Loader2,
  X,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CourseManagement() {
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view" | "delete">("add");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    courseCode: "",
    title: "",
    department: "",
    credits: 3,
    type: "Core",
    status: "Active",
    description: ""
  });

  const fetchData = async (search = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses${search ? `?search=${search}` : ""}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCoursesList(data);
      } else {
        setCoursesList([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
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
    setFormData({
      courseCode: "",
      title: "",
      department: "",
      credits: 3,
      type: "Core",
      status: "Active",
      description: ""
    });
    setSelectedCourse(null);
  };

  const openModal = (mode: "add" | "edit" | "view" | "delete", course: any = null) => {
    setModalMode(mode);
    setSelectedCourse(course);
    if (course && mode !== "add") {
      setFormData({
        courseCode: course.courseCode,
        title: course.title,
        department: course.department,
        credits: course.credits,
        type: course.type,
        status: course.status,
        description: course.description || ""
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
      const url = modalMode === "edit" ? `/api/admin/courses/${selectedCourse._id}` : "/api/admin/courses";
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
        alert(data.error || `Failed to ${modalMode} course`);
      }
    } catch (error) {
      console.error(`Error ${modalMode}ing course:`, error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/courses/${selectedCourse._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { label: "Total Courses", value: coursesList.length, icon: Library, color: "bg-blue-500" },
    { label: "Core Courses", value: coursesList.filter(c => c.type === 'Core').length, icon: BookOpen, color: "bg-emerald-500" },
    { label: "Elective Courses", value: coursesList.filter(c => c.type === 'Elective').length, icon: Award, color: "bg-purple-500" },
    { label: "Total Credits", value: coursesList.reduce((acc, c) => acc + (c.credits || 0), 0), icon: FileText, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Course Management</h1>
          <p className="text-slate-500">Manage university curriculum, course codes, and credit distributions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => actions.inquiry("Bulk import request", { type: "other", title: "Bulk import", description: "Send us your CSV/Excel file details and the team will import the records.", fields: ["name","email","message"] })} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
            <Upload size={18} />
            Bulk Import
          </button>
          <button 
            onClick={() => openModal("add")}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={18} />
            Add Course
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
            <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-current/10`}>
              <stat.icon size={20} />
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
              placeholder="Search courses by title, code or department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </form>
          <div className="flex items-center gap-3">
             <button onClick={() => actions.filter("All Depts")} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-primary transition-all cursor-pointer">
              <Filter size={18} />
              All Depts
            </button>
            <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold text-slate-600">
              <option>Undergraduate</option>
              <option>Graduate</option>
              <option>Post-Graduate</option>
            </select>
          </div>
        </div>

        {/* Courses Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="px-6 py-4">Course Info</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Credits</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Syllabus</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {coursesList.map((course, i) => (
                  <motion.tr 
                    key={course._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{course.title}</span>
                        <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{course.courseCode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Building2 size={14} className="text-slate-300" />
                        {course.department}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 w-fit px-2 py-1 rounded">
                        <Award size={14} className="text-amber-500" />
                        {Number(course.credits).toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        course.type === 'Core' ? 'bg-blue-50 text-blue-600' : 
                        course.type === 'Elective' ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-600'
                      }`}>
                        {course.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => actions.exportCsv("View PDF")} className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline cursor-pointer">
                        <FileText size={14} />
                        View PDF
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        course.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${course.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openModal("view", course)}
                          className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer" 
                          title="Preview Course"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => openModal("edit", course)}
                          className="p-2 text-slate-400 hover:text-amber-600 transition-all cursor-pointer" 
                          title="Edit Course"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => openModal("delete", course)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-all cursor-pointer" 
                          title="Delete Course"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {coursesList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">No courses found in catalog.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Info */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium tracking-wide">Showing {coursesList.length} courses in university catalog</p>
          <div className="flex items-center gap-4">
            <button onClick={() => actions.exportCsv("Download Catalog (CSV)")} className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer">
              Download Catalog (CSV)
              <Download size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* CRUD Modal */}
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
                      {modalMode === "add" && <>Add New <span className="text-primary">Course</span></>}
                      {modalMode === "edit" && <>Edit <span className="text-primary">Course</span></>}
                      {modalMode === "view" && <><span className="text-primary">Course</span> Details</>}
                      {modalMode === "delete" && <>Delete <span className="text-primary">Course</span></>}
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                      {modalMode === "delete" ? "This action cannot be undone" : "Academic Curriculum Management"}
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
                          You are about to delete <span className="font-bold underline">{selectedCourse?.title}</span>. 
                          This will remove the course from the university curriculum.
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
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Course Title</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === "view"}
                          placeholder="e.g. Artificial Intelligence"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Course Code</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === "view"}
                          placeholder="e.g. CSE-4105"
                          value={formData.courseCode}
                          onChange={(e) => setFormData({...formData, courseCode: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Department</label>
                        <select 
                          required
                          disabled={modalMode === "view"}
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all cursor-pointer disabled:opacity-60"
                        >
                          <option value="">Select Dept</option>
                          <option value="CSE">CSE</option>
                          <option value="EEE">EEE</option>
                          <option value="BBA">BBA</option>
                          <option value="Architecture">Architecture</option>
                          <option value="English">English</option>
                          <option value="LLB">LLB</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Credits</label>
                        <input 
                          type="number" 
                          step="0.5"
                          required
                          disabled={modalMode === "view"}
                          value={formData.credits}
                          onChange={(e) => setFormData({...formData, credits: parseFloat(e.target.value)})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Course Type</label>
                        <select 
                          required
                          disabled={modalMode === "view"}
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all cursor-pointer disabled:opacity-60"
                        >
                          <option value="Core">Core</option>
                          <option value="Elective">Elective</option>
                          <option value="General">General</option>
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
                              {modalMode === "edit" ? "Update Course" : "Create Course"}
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
