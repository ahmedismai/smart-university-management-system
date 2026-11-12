"use client";

import { actions } from "@/lib/siteActions";
import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye,
  ShieldCheck,
  Printer,
  Download,
  AlertCircle,
  History,
  Loader2,
  X,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExamManagement() {
  const [examsList, setExamsList] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view" | "delete">("add");
  const [selectedExam, setSelectedExam] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    examId: "",
    courseId: "",
    date: "",
    time: "10:00 AM",
    hall: "",
    studentsCount: 0,
    status: "Scheduled",
    description: ""
  });

  const fetchData = async (search = "") => {
    setLoading(true);
    try {
      const [examsRes, coursesRes] = await Promise.all([
        fetch(`/api/admin/exams${search ? `?search=${search}` : ""}`),
        fetch("/api/admin/courses")
      ]);
      const examsData = await examsRes.json();
      const coursesData = await coursesRes.json();
      
      setExamsList(Array.isArray(examsData) ? examsData : []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      console.error("Error fetching exams:", error);
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
      examId: "",
      courseId: "",
      date: "",
      time: "10:00 AM",
      hall: "",
      studentsCount: 0,
      status: "Scheduled",
      description: ""
    });
    setSelectedExam(null);
  };

  const openModal = (mode: "add" | "edit" | "view" | "delete", exam: any = null) => {
    setModalMode(mode);
    setSelectedExam(exam);
    if (exam && mode !== "add") {
      setFormData({
        examId: exam.examId,
        courseId: exam.courseId?._id || exam.courseId || "",
        date: exam.date,
        time: exam.time,
        hall: exam.hall,
        studentsCount: exam.studentsCount || 0,
        status: exam.status,
        description: exam.description || ""
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
      const url = modalMode === "edit" ? `/api/admin/exams/${selectedExam._id}` : "/api/admin/exams";
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
        alert(data.error || `Failed to ${modalMode} exam`);
      }
    } catch (error) {
      console.error(`Error ${modalMode}ing exam:`, error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedExam) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/exams/${selectedExam._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete exam");
      }
    } catch (error) {
      console.error("Error deleting exam:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { label: "Upcoming Exams", value: examsList.filter(e => e.status === 'Scheduled').length, icon: Calendar, color: "bg-blue-500" },
    { label: "Total Examinees", value: examsList.reduce((acc, e) => acc + (e.studentsCount || 0), 0).toLocaleString(), icon: Users, color: "bg-purple-500" },
    { label: "Exam Halls", value: [...new Set(examsList.map(e => e.hall))].length, icon: MapPin, color: "bg-emerald-500" },
    { label: "Active Semester", value: "24", icon: ShieldCheck, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Exam Management</h1>
          <p className="text-slate-500">Plan exam schedules, seat arrangements and invigilation duties.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => actions.print()} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
            <Printer size={18} />
            Admit Cards
          </button>
          <button 
            onClick={() => openModal("add")}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={18} />
            Create Exam
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
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-current/10`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Exam List Table */}
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearch} className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search exams by course or code..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </form>
            <div className="flex items-center gap-3">
              <button onClick={() => actions.filter("Filter rows")} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:text-primary transition-colors cursor-pointer">
                <Filter size={20} />
              </button>
              <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold text-slate-600">
                <option>Active Semester</option>
                <option>Upcoming Only</option>
                <option>Drafts</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    <tr>
                      <th className="px-6 py-4">Exam & Course</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Venue / Hall</th>
                      <th className="px-6 py-4">Examinees</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {examsList.map((exm, i) => (
                      <motion.tr 
                        key={exm._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{exm.courseId?.title}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{exm.courseId?.courseCode} ({exm.examId})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Calendar size={12} className="text-slate-400" />
                              {exm.date}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5">
                              <Clock size={12} className="text-slate-400" />
                              {exm.time}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                            <MapPin size={14} className="text-slate-300" />
                            {exm.hall}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-800">
                          {exm.studentsCount} Students
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            exm.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 
                            exm.status === 'Draft' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${exm.status === 'Scheduled' ? 'bg-blue-500 animate-pulse' : exm.status === 'Draft' ? 'bg-slate-400' : 'bg-emerald-500'}`} />
                            {exm.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => openModal("view", exm)}
                              className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => openModal("edit", exm)}
                              className="p-2 text-slate-400 hover:text-amber-600 transition-all cursor-pointer"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => openModal("delete", exm)}
                              className="p-2 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    {examsList.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">No exams found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="p-4 bg-slate-50 text-center">
              <button onClick={() => actions.exportCsv("Generate Complete Schedule PDF")} className="text-xs text-primary font-bold hover:underline cursor-pointer">Generate Complete Schedule PDF</button>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-xl">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-secondary/20 rounded-xl">
                   <ShieldCheck size={24} className="text-secondary" />
                </div>
                <h3 className="font-bold text-lg">Seat Planning</h3>
             </div>
             <p className="text-xs text-slate-400 mb-6 leading-relaxed">Automatically generate seat plans for all scheduled exams based on student enrollment and hall capacity.</p>
             <button onClick={actions.print} className="w-full py-3.5 bg-secondary text-primary font-extrabold rounded-xl text-sm shadow-lg hover:shadow-secondary/10 hover:-translate-y-0.5 transition-all cursor-pointer">
                Manage Seat Plan
             </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <History size={18} className="text-primary" />
                Recent Results
             </h3>
             <div className="space-y-4">
                {[
                  { title: "Mid-Term Spring '26", status: "Published" },
                  { title: "Quiz 2 - CSE-1102", status: "In Grading" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                     <div>
                        <p className="text-xs font-bold text-slate-700">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{item.status}</p>
                     </div>
                     <Download size={14} className="text-slate-300" />
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3">
             <AlertCircle size={18} className="text-red-500 mt-0.5" />
             <div>
                <h5 className="text-xs font-bold text-red-900">Room Conflict</h5>
                <p className="text-[10px] text-red-700 mt-1">Main Hall A is overbooked for May 15th morning session.</p>
             </div>
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
                      {modalMode === "add" && <>Create New <span className="text-primary">Exam</span></>}
                      {modalMode === "edit" && <>Edit <span className="text-primary">Exam</span></>}
                      {modalMode === "view" && <><span className="text-primary">Exam</span> Details</>}
                      {modalMode === "delete" && <>Delete <span className="text-primary">Exam</span></>}
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                      {modalMode === "delete" ? "This action cannot be undone" : "Exam Planning & Venue Scheduling"}
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
                          You are about to delete this exam entry. 
                          This will remove it from the master exam schedule.
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
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Exam ID</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === "view"}
                          placeholder="e.g. EXM-001"
                          value={formData.examId}
                          onChange={(e) => setFormData({...formData, examId: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Course</label>
                        <select 
                          required
                          disabled={modalMode === "view"}
                          value={formData.courseId}
                          onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer disabled:opacity-60"
                        >
                          <option value="">Select Course</option>
                          {courses.map(c => <option key={c._id} value={c._id}>{c.courseCode}: {c.title}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Exam Date</label>
                        <input 
                          type="date" 
                          required
                          disabled={modalMode === "view"}
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Exam Time</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === "view"}
                          placeholder="e.g. 10:00 AM"
                          value={formData.time}
                          onChange={(e) => setFormData({...formData, time: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Exam Hall / Venue</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === "view"}
                          placeholder="e.g. Main Hall A"
                          value={formData.hall}
                          onChange={(e) => setFormData({...formData, hall: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Expected Examinees</label>
                        <input 
                          type="number" 
                          required
                          disabled={modalMode === "view"}
                          value={formData.studentsCount}
                          onChange={(e) => setFormData({...formData, studentsCount: parseInt(e.target.value)})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-60"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Status</label>
                        <select 
                          required
                          disabled={modalMode === "view"}
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer disabled:opacity-60"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
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
                              <Check size={18} /> 
                              {modalMode === "edit" ? "Update Exam" : "Create Exam"}
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
