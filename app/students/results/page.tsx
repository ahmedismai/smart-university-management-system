"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Download, 
  Printer, 
  FileText, 
  GraduationCap, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockResults = [
  { code: "CSE-301", title: "Database Management Systems", credit: 3.0, grade: "A+", point: 4.0 },
  { code: "CSE-302", title: "Software Engineering", credit: 3.0, grade: "A", point: 3.75 },
  { code: "CSE-303", title: "Computer Networks", credit: 3.0, grade: "A-", point: 3.5 },
  { code: "MAT-205", title: "Partial Differential Equations", credit: 4.0, grade: "B+", point: 3.25 },
  { code: "GEN-104", title: "History of Bangladesh", credit: 2.0, grade: "A+", point: 4.0 },
];

const semesterList = [
  "Fall 2025",
  "Spring 2025",
  "Fall 2024",
  "Spring 2024",
  "Fall 2023",
];

export default function ResultsPage() {
  const [studentId, setStudentId] = useState("");
  const [semester, setSemester] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const router = useRouter();

  // Results are private: they open in the student portal, and only for the signed-in student.
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !semester) return;
    setIsSearching(true);
    try {
      const me = await fetch("/api/auth/me").then((r) => r.json());
      if (me?.role === "Student" && String(me.id).toLowerCase() === studentId.trim().toLowerCase()) {
        router.push("/student/results");
      } else if (me?.role === "Student") {
        toast.error("You can only view your own results.");
      } else {
        toast("Please sign in with your student account to view your results.");
        router.push("/login/student");
      }
    } catch {
      toast.error("Could not check your session. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Hero Header */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/students/results-hero.png"
          alt="Student Success"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 backdrop-blur-md border border-secondary/20 text-secondary">
              <Award size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Academic Excellence</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tight">
              Student <span className="text-secondary">Results</span> Portal
            </h1>
            <p className="text-white/60 font-medium max-w-xl mx-auto">
              Access your marks, grades, and academic transcripts securely from any device.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-24 pb-32 pt-10 relative z-20">

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] p-10 lg:p-14 mb-16 border border-white/20 relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-10 -mt-10" />
          
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end relative z-10">
            <div className="space-y-4">
              <label className="text-[12px] font-extrabold uppercase tracking-widest text-primary/60 block ml-1">Student ID Number</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
                <input
                  type="text"
                  placeholder="e.g. 2026-12345"
                  className="w-full pl-12 pr-4 py-5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-white focus:border-secondary/20 transition-all font-bold placeholder:text-primary/20 text-primary shadow-inner"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[12px] font-extrabold uppercase tracking-widest text-primary/60 block ml-1">Academic Semester</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
                <select
                  className="w-full pl-12 pr-10 py-5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-white focus:border-secondary/20 transition-all font-bold text-primary appearance-none cursor-pointer shadow-inner"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Semester</option>
                  {semesterList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                   <ChevronRight className="rotate-90 text-primary/30" size={16} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className={cn(
                "w-full bg-primary text-secondary py-5 rounded-2xl font-black uppercase tracking-widest text-[13px] shadow-2xl hover:shadow-secondary/10 transition-all relative overflow-hidden group h-[64px]",
                isSearching ? "opacity-90" : "hover:-translate-y-1 active:translate-y-0"
              )}
            >
              <span className={cn("inline-flex items-center justify-center gap-3 w-full", isSearching ? "opacity-0" : "opacity-100")}>
                View Result Sheet <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              {isSearching && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-5 h-5 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
                </div>
              )}
            </button>
          </form>
        </motion.div>

        {/* Results View */}
        <AnimatePresence mode="wait">
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="space-y-12"
            >
              {/* Summary Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Semester GPA", value: "3.75", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
                  { label: "Cumulative GPA", value: "3.82", icon: Award, color: "text-secondary", bg: "bg-secondary/5" },
                  { label: "Credits Earned", value: "15.0", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-50" },
                  { label: "Academic Standing", value: "Excellent", icon: GraduationCap, color: "text-primary", bg: "bg-primary/5" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i }}
                    className="group bg-white p-8 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className={cn("absolute top-0 right-0 w-20 h-20 opacity-5 rounded-full -mr-6 -mt-6 transition-transform duration-700 group-hover:scale-150", stat.bg)} />
                    
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform duration-500 group-hover:scale-110", stat.bg, stat.color)}>
                      <stat.icon size={28} />
                    </div>
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary/30 mb-2">{stat.label}</div>
                    <div className={cn("text-4xl font-black tracking-tight", stat.color)}>{stat.value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Detailed Results Table */}
              <div className="bg-white rounded-[2.5rem] border border-primary/5 shadow-md overflow-hidden">
                <div className="p-8 lg:p-12 border-b border-slate-50 flex flex-wrap justify-between items-center gap-6">
                  <div>
                    <h3 className="text-2xl font-black text-primary uppercase tracking-tight">Grade Sheet</h3>
                    <p className="text-sm font-medium text-primary/40 uppercase tracking-widest mt-1">{semester} • Computer Science & Engineering</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => actions.print()} className="flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 text-primary rounded-xl font-bold text-sm transition-all border border-slate-100">
                      <Printer size={18} />
                      Print
                    </button>
                    <button onClick={() => actions.print()} className="flex items-center gap-2 px-6 py-3 bg-secondary text-primary rounded-xl font-black text-sm transition-all hover:shadow-lg shadow-secondary/20">
                      <Download size={18} />
                      Download Transcript
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Course Code</th>
                        <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Course Title</th>
                        <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 text-center">Credits</th>
                        <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 text-center">Grade</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 text-right">Grade Point</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {mockResults.map((item, i) => (
                        <motion.tr
                          key={item.code}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i + 0.4 }}
                          className="group hover:bg-slate-50/30 transition-colors"
                        >
                          <td className="px-12 py-6 font-black text-primary/30 tracking-widest text-sm uppercase">{item.code}</td>
                          <td className="px-6 py-6 font-bold text-primary text-sm tracking-tight">{item.title}</td>
                          <td className="px-6 py-6 font-bold text-primary/60 text-sm text-center">{item.credit.toFixed(1)}</td>
                          <td className="px-12 py-6 text-center">
                            <span className={cn(
                              "inline-flex items-center justify-center min-w-[45px] h-8 rounded-xl text-[12px] font-black shadow-sm",
                              item.grade.includes("A+") ? "bg-green-500 text-white shadow-green-200" :
                              item.grade.includes("A") ? "bg-green-100 text-green-700" :
                              item.grade.includes("B") ? "bg-blue-50 text-blue-700" :
                              "bg-slate-100 text-slate-500"
                            )}>
                              {item.grade}
                            </span>
                          </td>
                          <td className="px-12 py-6 font-black text-primary text-right text-sm tabular-nums">{item.point.toFixed(2)}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-12 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-10 border-t border-slate-100">
                   <div className="grid grid-cols-3 gap-10 lg:gap-16 text-center md:text-left">
                      <div className="space-y-1">
                        <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary/30">Total Credits</div>
                        <div className="text-2xl font-black text-primary">15.0</div>
                      </div>
                      <div className="space-y-1 border-x border-slate-200 px-10 lg:px-16">
                        <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary/30">Grade Points</div>
                        <div className="text-2xl font-black text-primary">56.25</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary/30">Semester GPA</div>
                        <div className="text-3xl font-black text-secondary">3.75</div>
                      </div>
                   </div>
                   <div className="flex-1 max-w-md w-full">
                      <div className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur rounded-[2rem] border border-white shadow-sm">
                         <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                            <AlertCircle size={20} />
                         </div>
                         <p className="text-[11px] font-bold text-primary/60 leading-relaxed  ">
                           This is an unofficial digital summary. Please visit the Registrar's Office for official transcripts.
                         </p>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State / Help Section */}
        {!showResults && !isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          >
            {[
              { icon: BookOpen, title: "Academic Calendar", desc: "View key dates for semesters, exams, and result publishing.", accent: "border-b-blue-500" },
              { icon: FileText, title: "Grading Policy", desc: "Understand our institutional grading system and point calculations.", accent: "border-b-secondary" },
              { icon: GraduationCap, title: "Help Desk", desc: "For any discrepancies in results, reach out to your department coordinator.", accent: "border-b-primary" },
            ].map((item, i) => (
              <div key={i} className={cn("group bg-white p-10 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-center space-y-5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 border-b-4", item.accent)}>
                 <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-primary mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                    <item.icon size={32} />
                 </div>
                 <div className="space-y-2">
                   <h4 className="font-black text-primary uppercase tracking-tight text-lg">{item.title}</h4>
                   <p className="text-[12px] font-medium text-primary/40 leading-relaxed px-4">{item.desc}</p>
                 </div>
                 <button onClick={() => actions.print()} className="text-secondary font-extrabold text-[11px] uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center gap-2 mx-auto pt-4 group/btn">
                    Read Guidelines <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
