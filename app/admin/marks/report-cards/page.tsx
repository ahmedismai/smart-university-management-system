"use client";

import { actions } from "@/lib/siteActions";
import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Printer, 
  Mail, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Layout, 
  ArrowUpRight, 
  Layers, 
  Users, 
  ExternalLink,
  Plus,
  Send,
  Eye,
  Settings,
  Loader2,
  X,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const templates = [
  { name: "Official Transcript", type: "Standard", img: "bg-slate-50" },
  { name: "Progress Report", type: "Detailed", img: "bg-primary/5" },
  { name: "Semester Marksheet", type: "Simple", img: "bg-slate-100" },
];

export default function ReportCardManagement() {
  const [batches, setBatches] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [studentIdSearch, setStudentIdSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [batchesRes, coursesRes, sectionsRes] = await Promise.all([
        fetch("/api/admin/marks/report-cards"),
        fetch("/api/admin/courses"),
        fetch("/api/admin/sections")
      ]);

      const [batchesData, coursesData, sectionsData] = await Promise.all([
        batchesRes.json(),
        coursesRes.json(),
        sectionsRes.json()
      ]);

      setBatches(batchesData);
      setCourses(coursesData);
      setSections(sectionsData);
    } catch (error) {
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateBatch = async () => {
    if (!selectedCourse || !selectedSection) {
      toast.error("Please select course and section");
      return;
    }

    setIsGenerating(true);
    try {
      // First get student count for this section
      const studentsRes = await fetch(`/api/admin/students?sectionId=${selectedSection}`);
      const students = await studentsRes.json();

      const res = await fetch("/api/admin/marks/report-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedCourse,
          sectionId: selectedSection,
          studentCount: students.length,
          template: "Detailed"
        }),
      });

      if (res.ok) {
        toast.success("Batch generation started!");
        setIsModalOpen(false);
        fetchData();
      } else {
        toast.error("Failed to start generation");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Report Card Management</h1>
          <p className="text-slate-500">Generate, review and distribute digital and physical semester report cards.</p>
        </div>
        <div className="flex items-center gap-3">
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={18} />
            Generate Batch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left Column: Generator & Stats */}
        <div className="xl:col-span-3 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Layers size={20} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Batches</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{batches.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Distributed</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">8,450</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                <Send size={20} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Email</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">320</p>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                Recent Generation History
              </h3>
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" placeholder="Search batch..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20" />
                 </div>
                 <button onClick={() => actions.filter("Filter rows")} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-primary transition-all cursor-pointer"><Filter size={16} /></button>
              </div>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    <tr>
                      <th className="px-6 py-4">Batch ID</th>
                      <th className="px-6 py-4">Class & Section</th>
                      <th className="px-6 py-4">Students</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Created On</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {batches.length > 0 ? batches.map((batch, i) => (
                      <motion.tr 
                        key={batch._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-primary">{batch.batchId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800">{batch.classId?.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Section {batch.sectionId?.name || 'A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-700">{batch.studentCount} Students</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            batch.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' : 
                            batch.status === 'Sent' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {batch.status === 'Ready' ? <CheckCircle2 size={12} /> : 
                             batch.status === 'Sent' ? <Send size={12} /> : <Clock size={12} className="animate-spin" />}
                            {batch.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-500">{new Date(batch.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => actions.print()} className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer"><Printer size={16} /></button>
                            <button onClick={() => actions.exportCsv("Report Card Management")} className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer"><Download size={16} /></button>
                            <button onClick={(e) => actions.details(e)} className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer"><Mail size={16} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">No report card batches found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="p-4 bg-slate-50 text-center">
              <button onClick={actions.exportCsv.bind(null, "Report card archive")} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline cursor-pointer">View Archive Log</button>
            </div>
          </div>
        </div>

        {/* Right Column: Templates & Actions */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
             <div className="relative z-10">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-secondary">
                   <Layout size={20} />
                   Active Template
                </h3>
                <div className="space-y-3 mb-8">
                   {templates.map((tpl, i) => (
                      <div key={i} className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group/tpl ${
                        i === 1 ? 'bg-white/10 border-white/20' : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}>
                         <div className="flex items-center gap-3">
                            <div className={`w-8 h-10 rounded shadow-sm ${tpl.img}`} />
                            <div>
                               <p className="text-xs font-bold">{tpl.name}</p>
                               <p className="text-[10px] text-white/40">{tpl.type}</p>
                            </div>
                         </div>
                         {i === 1 && <CheckCircle2 size={16} className="text-secondary" />}
                      </div>
                   ))}
                </div>
                
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Users size={18} className="text-primary" />
                Quick Search
             </h3>
             <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Enter Student ID..." 
                  value={studentIdSearch}
                  onChange={(e) => setStudentIdSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-primary/20" 
                />
                <button onClick={actions.print} className="w-full py-3 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20">
                   Generate Single
                   <ArrowUpRight size={14} />
                </button>
             </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
             <Printer size={18} className="text-amber-500 mt-0.5" />
             <div>
                <h5 className="text-xs font-bold text-amber-900">Printer Queue</h5>
                <p className="text-[10px] text-amber-700 mt-1">45 report cards currently in the physical printing queue for CSE-101 Sec A.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Batch Generation Modal */}
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
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Plus className="text-primary" />
                  Generate Report Batch
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Select Course</label>
                    <select 
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Choose Course</option>
                      {courses.map(course => (
                        <option key={course._id} value={course._id}>{course.name} ({course.code})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Select Section</label>
                    <select 
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Choose Section</option>
                      {sections.map(section => (
                        <option key={section._id} value={section._id}>{section.name} (Room {section.room})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                  <Clock size={18} className="text-blue-500 mt-0.5" />
                  <p className="text-[11px] text-blue-700 font-medium">Batch generation takes a few minutes as it calculates GPA and generates individual PDFs for each student.</p>
                </div>

                <button 
                  onClick={handleGenerateBatch}
                  disabled={isGenerating}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Layers size={18} />}
                  Generate Reports
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
