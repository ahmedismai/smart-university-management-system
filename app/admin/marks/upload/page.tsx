"use client";

import { actions } from "@/lib/siteActions";
import React, { useState, useEffect } from "react";
import { 
  Upload, 
  FileSpreadsheet, 
  Search, 
  Plus, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MoreVertical, 
  BookOpen, 
  Users, 
  Download,
  ShieldCheck,
  ArrowUpRight,
  ClipboardList,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";


const TOTALS: Record<string, number> = { Quiz: 20, Assignment: 20, Midterm: 30, Final: 50 };

/** Minimal CSV line splitter (handles quoted cells). */
const splitCsv = (line: string) => {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === "," && !q) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  out.push(cur.trim());
  return out;
};

export default function MarksUpload() {
  const [courses, setCourses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [pending, setPending] = useState<{ type: string; missing: string[] }[] | null>(null);
  const [manualEntryStudents, setManualEntryStudents] = useState<any[]>([]);
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  
  // Selection state
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [assessmentType, setAssessmentType] = useState("Midterm");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, sectionsRes, marksRes] = await Promise.all([
          fetch("/api/admin/courses"),
          fetch("/api/admin/sections"),
          fetch("/api/admin/marks")
        ]);

        const coursesData = await coursesRes.json();
        const sectionsData = await sectionsRes.json();
        const marksData = await marksRes.json();

        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setSections(Array.isArray(sectionsData) ? sectionsData : []);
        setRecentUploads(Array.isArray(marksData) ? marksData : []);
        
        if (coursesData.length > 0) setSelectedCourse(coursesData[0]._id);
        if (sectionsData.length > 0) setSelectedSection(sectionsData[0]._id);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast.success(`File "${e.target.files[0].name}" selected`);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    if (!selectedCourse || !selectedSection) {
      toast.error("Please select course and section");
      return;
    }

    setUploading(true);
    try {
      // 1. read the CSV: Student ID, Name, Marks, Remarks (the downloaded template)
      const lines = (await file.text()).split(String.fromCharCode(10)).map((l) => l.trim()).filter(Boolean);
      const head = splitCsv(lines[0] || "").map((h) => h.toLowerCase());
      const idCol = head.findIndex((h) => h.includes("student id") || h === "studentid" || h === "id");
      const marksCol = head.findIndex((h) => h.startsWith("mark") || h.includes("obtained"));
      const remarksCol = head.findIndex((h) => h.startsWith("remark"));
      if (idCol < 0 || marksCol < 0) throw new Error("The file needs the columns: Student ID and Marks (use the CSV template)");

      // 2. match the ids with the students of the chosen section
      const students = await fetch(`/api/admin/students?sectionId=${selectedSection}`).then((r) => r.json());
      const byRegId = new Map<string, any>((Array.isArray(students) ? students : []).map((st: any) => [String(st.studentId).toLowerCase(), st]));
      const section = sections.find((x: any) => x._id === selectedSection);
      const total = TOTALS[assessmentType];
      const payload: any[] = [];
      const problems: string[] = [];
      for (const line of lines.slice(1)) {
        const cells = splitCsv(line);
        const st = byRegId.get((cells[idCol] || "").toLowerCase());
        const raw = cells[marksCol];
        if (!cells[idCol]) continue;
        if (!st) {
          problems.push(`${cells[idCol]}: not in this section`);
          continue;
        }
        if (raw === undefined || raw === "") continue; // empty marks = not graded yet
        const n = Number(raw);
        if (!Number.isFinite(n) || n < 0 || n > total) {
          problems.push(`${cells[idCol]}: marks must be 0-${total}`);
          continue;
        }
        payload.push({ studentId: st._id, courseId: selectedCourse, classId: section?.classId?._id || section?.classId, examType: assessmentType, obtainedMarks: n, totalMarks: total, remarks: remarksCol >= 0 ? cells[remarksCol] || "" : "" });
      }
      if (!payload.length) throw new Error(problems[0] || "No marks found in the file");

      // 3. save
      const res = await fetch("/api/admin/marks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to upload marks");
      toast.success(`Saved ${json.saved} marks${problems.length ? `, skipped ${problems.length} (${problems.slice(0, 2).join("; ")})` : ""}`);
      setFile(null);
      setRecentUploads(await fetch("/api/admin/marks").then((r) => r.json()));
    } catch (error: any) {
      toast.error(error.message || "An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  // Students of the chosen section that still have no mark for each assessment of the chosen course
  const checkPending = async () => {
    if (!selectedCourse || !selectedSection) {
      toast.error("Please select course and section first");
      return;
    }
    try {
      const [students, marks] = await Promise.all([
        fetch(`/api/admin/students?sectionId=${selectedSection}`).then((r) => r.json()),
        fetch(`/api/admin/marks?courseId=${selectedCourse}`).then((r) => r.json()),
      ]);
      const list: any[] = Array.isArray(students) ? students : [];
      const have = (type: string, id: string) => (Array.isArray(marks) ? marks : []).some((m: any) => m.examType === type && String(m.studentId?._id || m.studentId) === id);
      setPending(Object.keys(TOTALS).map((type) => ({ type, missing: list.filter((st) => !have(type, st._id)).map((st) => `${st.studentId} - ${st.name}`) })));
    } catch {
      toast.error("Could not load the marks");
    }
  };

  const downloadTemplate = async () => {
    if (!selectedSection) {
      toast.error("Please select a section first");
      return;
    }

    try {
      const res = await fetch(`/api/admin/students?sectionId=${selectedSection}`);
      const students = await res.json();
      
      if (!students || students.length === 0) {
        toast.error("No students found in this section");
        return;
      }

      const csvContent = [
        ["Student ID", "Name", "Marks", "Remarks"],
        ...students.map((s: any) => [s.studentId, s.name, "", ""])
      ].map(e => e.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `marks_template_${assessmentType}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Template downloaded!");
    } catch (error) {
      toast.error("Failed to download template");
    }
  };

  const openManualEntry = async () => {
    if (!selectedCourse || !selectedSection) {
      toast.error("Please select course and section first");
      return;
    }

    try {
      const res = await fetch(`/api/admin/students?sectionId=${selectedSection}`);
      const students = await res.json();
      
      if (!students || students.length === 0) {
        toast.error("No students found in this section");
        return;
      }

      setManualEntryStudents(students.map((s: any) => ({
        studentId: s._id,
        regId: s.studentId,
        name: s.name,
        obtainedMarks: "",
        remarks: ""
      })));
      setIsManualEntryOpen(true);
    } catch (error) {
      toast.error("Failed to load students");
    }
  };

  const handleManualMarkChange = (id: string, field: string, value: string) => {
    setManualEntryStudents(prev => prev.map(s => 
      s.studentId === id ? { ...s, [field]: value } : s
    ));
  };

  const submitManualEntry = async () => {
    setIsSubmittingManual(true);
    try {
      const payload = manualEntryStudents.map(s => ({
        studentId: s.studentId,
        courseId: selectedCourse,
        classId: sections.find((x: any) => x._id === selectedSection)?.classId?._id || sections.find((x: any) => x._id === selectedSection)?.classId,
        examType: assessmentType,
        obtainedMarks: Number(s.obtainedMarks),
        totalMarks: TOTALS[assessmentType],
        remarks: s.remarks
      })).filter((r) => (manualEntryStudents.find((m) => m.studentId === r.studentId)?.obtainedMarks ?? "") !== "");
      if (!payload.length) {
        toast.error("Enter at least one mark");
        setIsSubmittingManual(false);
        return;
      }

      const res = await fetch("/api/admin/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const saved = await res.clone().json().catch(() => ({}));
      if (res.ok) {
        toast.success(`Marks saved (${saved.saved ?? payload.length})`);
        setIsManualEntryOpen(false);
        // Refresh history
        const marksRes = await fetch("/api/admin/marks");
        const marksData = await marksRes.json();
        setRecentUploads(marksData);
      } else {
        toast.error(saved.error || "Failed to submit marks");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmittingManual(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Marks Entry & Upload</h1>
          <p className="text-slate-500">Submit and verify student academic performances for various assessments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <Download size={18} />
            CSV Template
          </button>
          <button 
            onClick={openManualEntry}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={18} />
            Manual Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Selection & Upload Area */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                   <Filter size={18} className="text-primary" />
                   Select Assessment Target
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Select Course</label>
                      <select 
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {courses.map(course => (
                          <option key={course._id} value={course._id}>
                            {course.title} ({course.courseCode})
                          </option>
                        ))}
                      </select>
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Select Section</label>
                      <select 
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {sections.map(section => (
                          <option key={section._id} value={section._id}>
                            {section.name} ({section.sectionId})
                          </option>
                        ))}
                      </select>
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Assessment Type</label>
                      <select 
                        value={assessmentType}
                        onChange={(e) => setAssessmentType(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="Midterm">Mid-Term (30%)</option>
                        <option value="Final">Final Exam (50%)</option>
                        <option value="Quiz">Quiz (10%)</option>
                        <option value="Assignment">Assignment (10%)</option>
                      </select>
                   </div>
                </div>
             </div>

             <div className="p-12">
                <div 
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="max-w-xl mx-auto border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:bg-slate-50 hover:border-primary/30 transition-all group cursor-pointer"
                >
                   <input 
                     id="file-upload" 
                     type="file" 
                     accept=".csv,.xlsx" 
                     className="hidden" 
                     onChange={handleFileChange}
                   />
                   <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                      {uploading ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
                   </div>
                   <h4 className="text-xl font-bold text-slate-800 mb-2">
                     {file ? file.name : "Upload Excel or CSV File"}
                   </h4>
                   <p className="text-sm text-slate-400 mb-8">
                     {file ? "File ready for upload. Click the button below to process." : "Drag and drop your marksheet file here or click to browse files from your computer."}
                   </p>
                   {file ? (
                     <button 
                       onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                       disabled={uploading}
                       className="px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50"
                     >
                       {uploading ? "Uploading..." : "Start Upload"}
                     </button>
                   ) : (
                     <div className="flex justify-center gap-3">
                        <span className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-500">.XLSX</span>
                        <span className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-500">.CSV</span>
                     </div>
                   )}
                </div>
             </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   <ClipboardList size={18} className="text-primary" />
                   Recent Submission History
                </h3>
                <button onClick={actions.exportCsv.bind(null, "Marks upload logs")} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline cursor-pointer">View All Logs</button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    <tr>
                      <th className="px-6 py-4">Student ID</th>
                      <th className="px-6 py-4">Course & Type</th>
                      <th className="px-6 py-4">Marks</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentUploads.length > 0 ? recentUploads.map((up, i) => (
                      <motion.tr 
                        key={up._id || i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                           <span className="text-xs font-bold text-primary">{up.studentId?.studentId || "N/A"}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800">{up.courseId?.title || up.classId?.name || "N/A"}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{up.examType}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-700">
                          {up.obtainedMarks} / {up.totalMarks}
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              'bg-emerald-100 text-emerald-700'
                           }`}>
                              <CheckCircle2 size={12} />
                              Verified
                           </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-500">
                          {new Date(up.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                           <button onClick={(e) => actions.details(e)} className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer"><MoreVertical size={18} /></button>
                        </td>
                      </motion.tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">No recent submissions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* Sidebar Info & Guides */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
             <div className="relative z-10">
                <ShieldCheck size={32} className="text-secondary mb-6" />
                <h3 className="text-xl font-bold mb-4">How marks are saved</h3>
                <p className="text-xs text-slate-400 mb-8 leading-relaxed">Marks are saved straight away and students see them in Marks &amp; Results. A student has one mark per course and assessment: uploading again updates it. Use Check Pending to see who is still missing marks.</p>
                <div className="flex items-center gap-3 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Saved instantly</span>
                </div>
                <button onClick={checkPending} className="w-full py-4 bg-secondary text-primary font-extrabold rounded-2xl hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2">
                   Check Pending
                   <ArrowUpRight size={14} />
                </button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                <BookOpen size={18} className="text-primary" />
                Quick Guidelines
             </h3>
             <ul className="space-y-3">
                {[
                   "Use the standard university template for all CSV uploads.",
                   "Student IDs must match official university registration records.",
                   "Mark ranges are validated against course credit weights.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-[11px] text-slate-500 font-medium">
                     <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1 shrink-0" />
                     {item}
                  </li>
                ))}
             </ul>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
             <FileSpreadsheet size={18} className="text-blue-500 mt-0.5" />
             <div>
                <h5 className="text-xs font-bold text-blue-900">Need a Template?</h5>
                <p className="text-[10px] text-blue-700 mt-1 leading-relaxed">Download the pre-formatted Excel template with student names already filled for your selected section.</p>
                <button 
                  onClick={downloadTemplate}
                  className="mt-3 text-[10px] font-extrabold text-blue-800 uppercase tracking-widest flex items-center gap-1 hover:underline cursor-pointer"
                >
                   Download Now
                   <Download size={12} />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {isManualEntryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsManualEntryOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Manual Marks Entry</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                  {courses.find(c => c._id === selectedCourse)?.title} - {assessmentType}
                </p>
              </div>
              <button 
                onClick={() => setIsManualEntryOpen(false)}
                className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
              >
                <Plus size={20} className="rotate-45 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-100">
                    <th className="pb-4 px-2">Student ID</th>
                    <th className="pb-4 px-2">Student Name</th>
                    <th className="pb-4 px-2 w-32">Obtained Marks</th>
                    <th className="pb-4 px-2">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {manualEntryStudents.map((student) => (
                    <tr key={student.studentId} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-2 text-xs font-bold text-primary">{student.regId}</td>
                      <td className="py-4 px-2 text-sm font-medium text-slate-700">{student.name}</td>
                      <td className="py-4 px-2">
                        <input 
                          type="number"
                          placeholder="00"
                          value={student.obtainedMarks}
                          onChange={(e) => handleManualMarkChange(student.studentId, 'obtainedMarks', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </td>
                      <td className="py-4 px-2">
                        <input 
                          type="text"
                          placeholder="Add comments..."
                          value={student.remarks}
                          onChange={(e) => handleManualMarkChange(student.studentId, 'remarks', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="text-xs text-slate-500 font-medium">
                Total Students: <span className="font-bold text-slate-800">{manualEntryStudents.length}</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsManualEntryOpen(false)}
                  className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitManualEntry}
                  disabled={isSubmittingManual}
                  className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmittingManual ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  Submit All Marks
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {pending && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onMouseDown={() => setPending(null)}>
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6" onMouseDown={(e) => e.stopPropagation()}>
            <h3 className="font-black text-slate-800 text-lg mb-1">Marks still missing</h3>
            <p className="text-xs text-slate-500 mb-4">For the selected course and section.</p>
            <div className="space-y-4">
              {pending.map((p) => (
                <div key={p.type}>
                  <p className="text-sm font-bold text-slate-800">
                    {p.type} <span className={p.missing.length ? "text-amber-600" : "text-emerald-600"}>{p.missing.length ? `${p.missing.length} missing` : "complete"}</span>
                  </p>
                  {p.missing.length > 0 && <p className="text-xs text-slate-500 mt-1">{p.missing.join(", ")}</p>}
                </div>
              ))}
            </div>
            <button onClick={() => setPending(null)} className="mt-6 w-full py-2.5 bg-primary text-white rounded-xl text-sm font-bold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
