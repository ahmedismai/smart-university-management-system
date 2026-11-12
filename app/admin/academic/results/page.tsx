"use client";

import { actions } from "@/lib/siteActions";
import React, { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Search, 
  Plus, 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Filter, 
  Eye, 
  FileText, 
  MoreVertical,
  Clock,
  ExternalLink,
  Award,
  BookOpen,
  Loader2,
  X,
  Check,
  Edit3,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AcademicResults() {
  const [resultsList, setResultsList] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view" | "delete">("add");
  const [selectedResult, setSelectedResult] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    resultId: "",
    courseId: "",
    semester: "Summer 2026",
    avgGpa: 0,
    passRate: "0%",
    status: "Published"
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/results", window.location.origin);
      if (searchTerm) url.searchParams.append("search", searchTerm);
      if (selectedSemester !== "All") url.searchParams.append("semester", selectedSemester);

      const [resultsRes, coursesRes] = await Promise.all([
        fetch(url.toString()),
        fetch("/api/admin/courses")
      ]);
      const resultsData = await resultsRes.json();
      const coursesData = await coursesRes.json();
      
      setResultsList(Array.isArray(resultsData) ? resultsData : []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSemester]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const resetForm = () => {
    setFormData({
      resultId: "",
      courseId: "",
      semester: "Summer 2026",
      avgGpa: 0,
      passRate: "0%",
      status: "Published"
    });
    setSelectedResult(null);
  };

  const openModal = (mode: "add" | "edit" | "view" | "delete", result: any = null) => {
    setModalMode(mode);
    setSelectedResult(result);
    if (result && mode !== "add") {
      setFormData({
        resultId: result.resultId,
        courseId: result.courseId?._id || result.courseId || "",
        semester: result.semester,
        avgGpa: result.avgGpa,
        passRate: result.passRate,
        status: result.status
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
      const url = modalMode === "edit" ? `/api/admin/results/${selectedResult._id}` : "/api/admin/results";
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
        alert(data.error || `Failed to ${modalMode} result`);
      }
    } catch (error) {
      console.error(`Error ${modalMode}ing result:`, error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedResult) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/results/${selectedResult._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete result");
      }
    } catch (error) {
      console.error("Error deleting result:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { 
      label: "Overall Passing Rate", 
      value: resultsList.length > 0 
        ? (resultsList.reduce((acc, r) => acc + parseFloat(r.passRate), 0) / resultsList.length).toFixed(1) + "%" 
        : "0%", 
      icon: CheckCircle2, 
      color: "text-emerald-600 bg-emerald-100" 
    },
    { 
      label: "Average GPA", 
      value: resultsList.length > 0 
        ? (resultsList.reduce((acc, r) => acc + r.avgGpa, 0) / resultsList.length).toFixed(2) 
        : "0.00", 
      icon: TrendingUp, 
      color: "text-blue-600 bg-blue-100" 
    },
    { 
      label: "Pending Gradings", 
      value: resultsList.filter(r => r.status === 'Pending').length.toString(), 
      icon: Clock, 
      color: "text-amber-600 bg-amber-100" 
    },
    { 
      label: "Courses Published", 
      value: resultsList.filter(r => r.status === 'Published').length.toString(), 
      icon: Award, 
      color: "text-purple-600 bg-purple-100" 
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Academic Results</h1>
          <p className="text-slate-500">Publish, manage and analyze university-wide academic performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={(e) => actions.details(e)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
            <BarChart3 size={18} />
            Analytics
          </button>
          <button 
            onClick={() => openModal("add")}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={18} />
            Publish Result
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
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Results List */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearch} className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by course or code..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </form>
            <div className="flex items-center gap-2">
               <button onClick={() => actions.filter("Filter rows")} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:text-primary transition-colors cursor-pointer">
                <Filter size={20} />
              </button>
              <select 
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold text-slate-600"
              >
                <option value="All">All Semesters</option>
                <option value="Summer 2026">Summer 2026</option>
                <option value="Spring 2026">Spring 2026</option>
                <option value="Fall 2025">Fall 2025</option>
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
                      <th className="px-6 py-4">Course & ID</th>
                      <th className="px-6 py-4">Semester</th>
                      <th className="px-6 py-4">Avg GPA</th>
                      <th className="px-6 py-4">Pass Rate</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {resultsList.map((res, i) => (
                      <motion.tr 
                        key={res._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{res.courseId?.title}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{res.courseId?.courseCode} ({res.resultId})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-600">{res.semester}</td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-800">{res.avgGpa.toFixed(2)}</span>
                              {res.avgGpa > 0 && <BarChart3 size={14} className="text-emerald-500" />}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-800">{res.passRate}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            res.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 
                            res.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {res.status === 'Published' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            {res.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => openModal("view", res)}
                              className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => openModal("edit", res)}
                              className="p-2 text-slate-400 hover:text-amber-600 transition-all cursor-pointer"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => openModal("delete", res)}
                              className="p-2 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    {resultsList.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">No results found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="p-4 bg-slate-50 flex items-center justify-center">
              <button onClick={() => actions.exportCsv("Results archive")} className="text-xs text-primary font-bold hover:underline cursor-pointer">View All Semester Archives</button>
            </div>
          </div>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
             <div className="relative z-10">
                <div className="w-12 h-12 bg-secondary text-primary rounded-2xl flex items-center justify-center mb-6">
                   <GraduationCap size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Result Builder</h3>
                <p className="text-sm text-slate-400 mb-6">Generate and verify official transcripts and semester marksheets with digital signatures.</p>
                <button onClick={() => actions.exportCsv("Compile Transcripts")} className="w-full py-4 bg-secondary text-primary font-extrabold rounded-2xl hover:bg-white hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2">
                  <FileText size={18} />
                  Compile Transcripts
                </button>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <BookOpen size={120} />
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Award size={18} className="text-primary" />
                Dean's List Contenders
             </h3>
             <div className="space-y-4">
                {[
                  { name: "Abir Hasan", gpa: "3.98", dept: "CSE" },
                  { name: "Tahsin Noor", gpa: "3.95", dept: "BBA" },
                  { name: "Nabila Khan", gpa: "3.92", dept: "EEE" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-primary/5 transition-colors group cursor-pointer">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-primary">
                           {item.name.charAt(0)}
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-800">{item.name}</p>
                           <p className="text-[10px] text-slate-400 font-medium">{item.dept}</p>
                        </div>
                     </div>
                     <span className="text-xs font-bold text-primary">{item.gpa}</span>
                  </div>
                ))}
             </div>
             <button onClick={() => actions.exportCsv("View Full Rankings")} className="w-full mt-6 text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-2 hover:underline cursor-pointer">
                View Full Rankings
                <ExternalLink size={12} />
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
                      {modalMode === "add" && <>Publish <span className="text-primary">Result</span></>}
                      {modalMode === "edit" && <>Edit <span className="text-primary">Result</span></>}
                      {modalMode === "view" && <><span className="text-primary">Result</span> Details</>}
                      {modalMode === "delete" && <>Delete <span className="text-primary">Result</span></>}
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                      {modalMode === "delete" ? "This action cannot be undone" : "Course Performance & Academic Summaries"}
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
                          You are about to delete this result summary. 
                          This will remove it from the academic records.
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
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Result ID</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === "view"}
                          placeholder="e.g. RES-101"
                          value={formData.resultId}
                          onChange={(e) => setFormData({...formData, resultId: e.target.value})}
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
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Semester</label>
                        <select 
                          required
                          disabled={modalMode === "view"}
                          value={formData.semester}
                          onChange={(e) => setFormData({...formData, semester: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer disabled:opacity-60"
                        >
                          <option value="Summer 2026">Summer 2026</option>
                          <option value="Spring 2026">Spring 2026</option>
                          <option value="Fall 2025">Fall 2025</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Avg GPA</label>
                        <input 
                          type="number" 
                          step="0.01"
                          required
                          disabled={modalMode === "view"}
                          value={formData.avgGpa}
                          onChange={(e) => setFormData({...formData, avgGpa: parseFloat(e.target.value)})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Pass Rate (%)</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === "view"}
                          placeholder="e.g. 95%"
                          value={formData.passRate}
                          onChange={(e) => setFormData({...formData, passRate: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Status</label>
                        <select 
                          required
                          disabled={modalMode === "view"}
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer disabled:opacity-60"
                        >
                          <option value="Published">Published</option>
                          <option value="Pending">Pending</option>
                          <option value="Archived">Archived</option>
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
                              {modalMode === "edit" ? "Update Result" : "Publish Result"}
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
