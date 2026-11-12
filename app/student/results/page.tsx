"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, Award, BookOpen, Download, TrendingUp, BarChart3, ChevronDown, Search, Printer, Loader2, XCircle, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "react-hot-toast";

export default function ResultsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSemesterId, setActiveSemesterId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  // Review form states
  const [reviewSubject, setReviewSubject] = useState("");
  const [reviewReason, setReviewReason] = useState("");
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const fetchResults = async () => {
    try {
      const res = await fetch("/api/student/results");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login/student";
          return;
        }
        throw new Error("Failed to fetch academic results");
      }
      const json = await res.json();
      if (json.success) {
        setData(json);
        if (json.semesters && json.semesters.length > 0) {
          setActiveSemesterId(json.semesters[0].id);
        }
      } else {
        throw new Error(json.error || "An unexpected error occurred");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong while loading academic results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handlePrintTranscript = () => {
    if (!data) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocker prevented opening the print window.");
      return;
    }

    // Generate table rows for each semester
    let semesterTables = "";
    data.semesters.slice().reverse().forEach((sem: any) => {
      const courseRows = sem.results.map((res: any) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">
            <div style="font-weight: bold; color: #1e293b;">${res.course}</div>
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-top: 2px;">${res.code}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 13px; font-weight: 500; color: #334155;">${res.marks}%</td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 13px;">
            <span style="display: inline-block; padding: 2px 8px; font-weight: 700; border-radius: 4px; background-color: ${
              res.grade === 'F' ? '#fecaca' : '#dbeafe'
            }; color: ${
              res.grade === 'F' ? '#b91c1c' : '#1e40af'
            };">${res.grade}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 13px; font-weight: 600; color: #334155;">${res.credits || 3}.0</td>
        </tr>
      `).join("");

      semesterTables += `
        <div style="margin-bottom: 30px; page-break-inside: avoid;">
          <h3 style="font-size: 14px; font-weight: 800; border-bottom: 2px solid #0F2E5D; padding-bottom: 6px; color: #0F2E5D; text-transform: uppercase; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span>${sem.name}</span>
            <span style="float: right; color: #475569; font-weight: 700;">GPA: ${sem.gpa}</span>
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
            <thead>
              <tr style="background-color: #f8fafc; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569; border-bottom: 1px solid #cbd5e1;">
                <th style="padding: 10px 12px; text-align: left; letter-spacing: 0.5px;">Course Title & Code</th>
                <th style="padding: 10px 12px; text-align: center; letter-spacing: 0.5px; width: 100px;">Marks</th>
                <th style="padding: 10px 12px; text-align: center; letter-spacing: 0.5px; width: 100px;">Grade</th>
                <th style="padding: 10px 12px; text-align: center; letter-spacing: 0.5px; width: 100px;">Credits</th>
              </tr>
            </thead>
            <tbody>
              ${courseRows}
            </tbody>
          </table>
        </div>
      `;
    });

    printWindow.document.write(`
      <html>
        <head>
          <title>Academic Transcript - ${data.student.name}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; margin: 45px; line-height: 1.5; background-color: #ffffff; }
            .header { border-bottom: 3px solid #0F2E5D; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .title-area h1 { font-size: 28px; font-weight: 900; color: #0F2E5D; margin: 0; text-transform: uppercase; letter-spacing: -0.5px; }
            .title-area p { font-size: 11px; color: #64748b; margin: 5px 0 0 0; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; }
            .info-grid { display: grid; grid-template-cols: 1.2fr 1fr; gap: 24px; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 22px; border-radius: 16px; margin-bottom: 35px; }
            .info-item { font-size: 13px; }
            .info-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 4px; letter-spacing: 0.5px; }
            .info-value { font-size: 14px; font-weight: 800; color: #0f172a; }
            .info-value.cgpa { color: #059669; font-size: 18px; }
            .footer { margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 25px; display: flex; justify-content: space-between; align-items: flex-end; page-break-inside: avoid; }
            .verify-area { display: flex; align-items: center; gap: 15px; }
            .qr-placeholder { border: 1px solid #cbd5e1; padding: 6px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
            .verify-text { font-size: 9px; color: #64748b; max-w-sm; line-height: 1.4; }
            .signature-area { text-align: center; }
            .signature-line { width: 200px; height: 1px; border-top: 1px solid #475569; margin-bottom: 6px; }
            .signature-text { font-size: 11px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
            .signature-sub { font-size: 9px; color: #64748b; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title-area">
              <h1>NextGen University</h1>
              <p>Office of the Controller of Examinations</p>
            </div>
            <div style="font-weight: 900; font-size: 16px; color: #0F2E5D; background-color: #eff6ff; padding: 10px 20px; border-radius: 12px; border: 1.5px solid #bfdbfe; text-transform: uppercase; letter-spacing: 0.5px;">Official Transcript</div>
          </div>

          <div class="info-grid">
            <div>
              <div style="margin-bottom: 14px;">
                <div class="info-label">Student Name</div>
                <div class="info-value">${data.student.name}</div>
              </div>
              <div>
                <div class="info-label">Student ID</div>
                <div class="info-value" style="color: #0F2E5D;">${data.student.studentId}</div>
              </div>
            </div>
            <div>
              <div style="margin-bottom: 14px;">
                <div class="info-label">Academic Program</div>
                <div class="info-value">${data.student.department}</div>
              </div>
              <div style="display: flex; gap: 40px;">
                <div>
                  <div class="info-label">Cumulative GPA</div>
                  <div class="info-value cgpa">${data.cgpa}</div>
                </div>
                <div>
                  <div class="info-label">Credits Completed</div>
                  <div class="info-value">${data.totalCredits} Credits</div>
                </div>
              </div>
            </div>
          </div>

          ${semesterTables}

          <div class="footer">
            <div class="verify-area">
              <div class="qr-placeholder">
                <svg width="50" height="50" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm9-1h7v7h-7V0zm1 1v5h5V1h-5zm9-1h7v7h-7V0zm1 1v5h5V1h-5zM0 9h7v7H0V9zm1 1v5h5v-5H1zm11 0h5v2h-2v3h-3v-5zm7-1h7v7h-7V9zm1 1v5h5v-5h-5zM0 18h7v7H0v-7zm1 1v5h5v-5H1zm9 0h2v2h-2v-2zm2 2h3v3h-3v-3zm3-2h2v2h-2v-2zm0 3h2v4h-5v-2h3v-2zm5-3h5v5h-2v-2h-3v-3zm2 4h3v3h-3v-3z" fill="#0f172a"/>
                </svg>
              </div>
              <div class="verify-text">
                This academic transcript is digitally generated. Verify authenticity online at <strong>verify.nub.edu.bd</strong> using reference ID <strong>TR-${data.student.studentId}</strong>.
              </div>
            </div>
            <div class="signature-area">
              <div class="signature-line"></div>
              <div class="signature-text">Controller of Examinations</div>
              <div class="signature-sub">NextGen University of Bangladesh</div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    toast.success("Printing transcript...");
  };

  const handleApplyReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewSubject) {
      toast.error("Please select a subject");
      return;
    }
    if (!reviewReason.trim()) {
      toast.error("Please enter a reason for review");
      return;
    }

    setIsReviewSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsReviewSubmitting(false);
      setIsReviewModalOpen(false);
      toast.success(`Application for review of ${reviewSubject} submitted successfully!`);
      setReviewReason("");
      setReviewSubject("");
    }, 1200);
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-10 max-w-7xl mx-auto">
        {/* Title skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded w-64 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-11 bg-gray-200 rounded-xl w-36 animate-pulse"></div>
            <div className="h-11 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
          </div>
        </div>
        
        {/* Overview skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[260px] bg-gray-200 rounded-[2rem] animate-pulse"></div>
          <div className="h-[260px] bg-gray-200 rounded-[2rem] animate-pulse"></div>
        </div>

        {/* History skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[400px] bg-gray-200 rounded-[2rem] animate-pulse"></div>
          <div className="h-[400px] bg-gray-200 rounded-[2rem] animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 bg-white rounded-[2rem] border border-red-100 shadow-sm space-y-4 max-w-xl mx-auto">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <XCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Failed to Load Results</h3>
        <p className="text-gray-500 max-w-md">{error}</p>
        <button 
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchResults();
          }} 
          className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { student, cgpa, totalCredits, gpaTrend, semesters } = data;

  // Filter semesters
  const filteredSemesters = semesters.filter((sem: any) =>
    sem.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get active semester results
  const activeSemester = semesters.find((sem: any) => sem.id === activeSemesterId) || semesters[0];
  const activeResults = activeSemester ? activeSemester.results : [];

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Marks & Results</h1>
          <p className="text-gray-500 mt-1">Access your transcripts and academic performance reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrintTranscript}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Printer size={18} />
            Full Transcript
          </button>
          <button 
            onClick={() => toast.error("No certificates available for download yet. Please contact the registrar office.")}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Award size={18} />
            Certificates
          </button>
        </div>
      </div>

      {/* GPA Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-primary to-[#0A1F3D] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
           <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-blue-200 text-sm font-medium uppercase tracking-widest mb-1">Current Cumulative GPA</p>
                  <h2 className="text-6xl font-black">{cgpa}</h2>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm text-xs font-bold">
                     <TrendingUp size={14} className="text-emerald-400" />
                     Top 10%
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm text-xs font-bold">
                     {totalCredits} Credits
                   </div>
                </div>
                <button 
                  onClick={() => toast.success(`Your academic standing is Excellent with a CGPA of ${cgpa} across ${totalCredits} credits.`)}
                  className="px-8 py-3 bg-secondary text-primary font-black rounded-2xl hover:scale-105 transition-transform cursor-pointer"
                >
                  View Detailed Analysis
                </button>
              </div>
              <div className="hidden md:flex items-center justify-center">
                 <div className="w-48 h-48 rounded-full border-[12px] border-white/5 flex items-center justify-center relative">
                    <div className="absolute inset-0 border-[12px] border-secondary rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 85%)' }}></div>
                    <GraduationCap size={64} className="text-secondary" />
                 </div>
              </div>
           </div>
           <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000">
             <BarChart3 size={300} />
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col">
           <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
             <BookOpen size={20} className="text-primary" />
             Semester GPA Trend
           </h3>
           <div className="flex-1 flex items-end justify-between gap-4 px-2 pb-2">
             {gpaTrend.map((val: number, i: number) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative">
                 <motion.div 
                   initial={{ height: 0 }}
                   animate={{ height: `${(val / 4) * 100}%` }}
                   transition={{ duration: 1, delay: i * 0.1 }}
                   className={cn(
                     "w-full rounded-t-lg transition-all duration-300",
                     i === gpaTrend.length - 1 ? "bg-primary" : "bg-primary/10 group-hover:bg-primary/20"
                   )}
                 />
                 <span className="text-[10px] font-bold text-gray-400">S{i + 1}</span>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    GPA: {val.toFixed(2)}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Semester-wise details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Academic History</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Filter semesters..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                  />
                </div>
             </div>
             <div className="space-y-4">
                {filteredSemesters.map((sem: any) => (
                  <div 
                    key={sem.id} 
                    onClick={() => setActiveSemesterId(sem.id)}
                    className={cn(
                      "p-6 rounded-3xl border transition-all cursor-pointer group",
                      activeSemesterId === sem.id 
                        ? "border-gray-300 bg-primary/[0.01] shadow-sm" 
                        : "border-gray-100 hover:border-primary/20 hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-colors",
                           activeSemesterId === sem.id 
                             ? "bg-primary text-white" 
                             : "bg-gray-50 text-primary group-hover:bg-primary group-hover:text-white"
                         )}>
                           {sem.id}
                         </div>
                         <div>
                           <h4 className="font-bold text-gray-900">{sem.name}</h4>
                           <p className="text-xs text-gray-500">{sem.credits} Credits • {sem.status}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-8">
                         <div className="text-right">
                            <p className="text-xs font-bold text-gray-400 uppercase">GPA</p>
                            <p className="text-lg font-black text-primary">{sem.gpa}</p>
                         </div>
                         <ChevronDown size={20} className={cn(
                           "text-gray-400 transition-colors",
                           activeSemesterId === sem.id ? "text-primary rotate-180" : "group-hover:text-primary"
                         )} />
                      </div>
                    </div>
                  </div>
                ))}
                {filteredSemesters.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-sm font-semibold">No semesters found matching filter.</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Current Semester Breakdown */}
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {activeSemester ? activeSemester.name : "Semester"} Results
              </h2>
              <div className="space-y-4">
                 {activeResults.map((res: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 group">
                       <div className="flex items-start justify-between mb-2">
                          <div>
                             <h4 className="text-sm font-bold text-gray-900">{res.course}</h4>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{res.code}</p>
                          </div>
                          <div className="text-right">
                             <span className={cn(
                               "text-sm font-black px-2 py-0.5 rounded-lg",
                               res.grade.includes('A') ? "text-emerald-600 bg-emerald-50" : 
                               res.grade === 'F' ? "text-red-600 bg-red-50" : "text-blue-600 bg-blue-50"
                             )}>
                               {res.grade}
                             </span>
                          </div>
                       </div>
                       <div className="flex items-center justify-between mt-4">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden mr-4">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${res.marks}%` }}
                               transition={{ duration: 1.5, delay: i * 0.1 }}
                               className={cn(
                                 "h-full rounded-full",
                                 res.marks >= 80 ? "bg-emerald-500" : 
                                 res.marks >= 50 ? "bg-blue-500" : "bg-red-500"
                               )}
                             />
                          </div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{res.marks}/100</span>
                       </div>
                    </div>
                 ))}
                 {activeResults.length === 0 && (
                   <p className="text-sm text-gray-400 text-center py-6 font-medium">No courses available for this semester.</p>
                 )}
              </div>
              <button 
                onClick={() => setIsGradeModalOpen(true)}
                className="w-full mt-6 py-4 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-transparent hover:border-gray-200"
              >
                 <HelpCircle size={16} className="text-primary" />
                 Grade Conversion Table
              </button>
           </div>
           
           <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100">
              <h3 className="font-bold text-amber-900 mb-2">Result Re-check</h3>
              <p className="text-xs text-amber-700 leading-relaxed mb-6">
                Not satisfied with your results? You can apply for a formal re-check within 7 days of result publication.
              </p>
              <button 
                onClick={() => setIsReviewModalOpen(true)}
                className="w-full py-3 bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-600/20 hover:opacity-90 transition-opacity cursor-pointer"
              >
                 Apply for Review
              </button>
           </div>
        </div>
      </div>

      {/* Grade Conversion Modal */}
      <AnimatePresence>
        {isGradeModalOpen && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-w-md w-full overflow-hidden"
            >
              <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Award className="text-primary" />
                  Grade Conversion Table
                </h3>
                <button 
                  onClick={() => setIsGradeModalOpen(false)}
                  className="text-gray-400 hover:text-gray-900 font-light text-2xl leading-none cursor-pointer"
                >
                  &times;
                </button>
              </div>
              <div className="p-6">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <th className="pb-3">Mark Range</th>
                      <th className="pb-3 text-center">Letter Grade</th>
                      <th className="pb-3 text-center">Grade Point</th>
                      <th className="pb-3 text-right">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                    <tr>
                      <td className="py-2.5">80% - 100%</td>
                      <td className="py-2.5 text-center text-emerald-600 font-bold">A+</td>
                      <td className="py-2.5 text-center">4.00</td>
                      <td className="py-2.5 text-right text-xs">Excellent</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">75% - 79%</td>
                      <td className="py-2.5 text-center text-emerald-600 font-bold">A</td>
                      <td className="py-2.5 text-center">3.75</td>
                      <td className="py-2.5 text-right text-xs">Very Good</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">70% - 74%</td>
                      <td className="py-2.5 text-center text-emerald-600 font-bold">A-</td>
                      <td className="py-2.5 text-center">3.75</td>
                      <td className="py-2.5 text-right text-xs">Good</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">65% - 69%</td>
                      <td className="py-2.5 text-center text-blue-600 font-bold">B+</td>
                      <td className="py-2.5 text-center">3.25</td>
                      <td className="py-2.5 text-right text-xs">Satisfactory</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">60% - 64%</td>
                      <td className="py-2.5 text-center text-blue-600 font-bold">B</td>
                      <td className="py-2.5 text-center">3.00</td>
                      <td className="py-2.5 text-right text-xs">Above Average</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">50% - 59%</td>
                      <td className="py-2.5 text-center text-blue-600 font-bold">C</td>
                      <td className="py-2.5 text-center">2.00</td>
                      <td className="py-2.5 text-right text-xs">Pass</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">0% - 49%</td>
                      <td className="py-2.5 text-center text-red-600 font-bold">F</td>
                      <td className="py-2.5 text-center">0.00</td>
                      <td className="py-2.5 text-right text-xs">Fail</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Result Re-check Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="text-amber-500" />
                  Apply for Result Review
                </h3>
                <button 
                  onClick={() => setIsReviewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-900 font-light text-2xl leading-none cursor-pointer"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleApplyReviewSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Subject</label>
                  <select 
                    value={reviewSubject}
                    onChange={(e) => setReviewSubject(e.target.value)}
                    required
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">-- Choose Subject --</option>
                    {activeResults.map((res: any, idx: number) => (
                      <option key={idx} value={`${res.course} (${res.code})`}>
                        {res.course} ({res.code}) - Grade: {res.grade}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Reason for Review</label>
                  <textarea 
                    value={reviewReason}
                    onChange={(e) => setReviewReason(e.target.value)}
                    required
                    rows={4}
                    placeholder="Provide details about why you are requesting a review for this result..."
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  ></textarea>
                </div>
                <div className="bg-amber-50 border border-amber-200/50 p-4 rounded-xl flex gap-3 text-xs text-amber-800 leading-relaxed font-medium">
                  <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    Applications are subject to a processing charge of 200 EGP, which will be billed to your account upon review completion. Review outcomes are final.
                  </span>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isReviewSubmitting}
                    className="px-6 py-2.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-600/25"
                  >
                    {isReviewSubmitting && <Loader2 className="animate-spin" size={16} />}
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
