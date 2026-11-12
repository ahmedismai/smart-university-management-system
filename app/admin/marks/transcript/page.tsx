"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import { 
  FileCheck, 
  Search, 
  Download, 
  Printer, 
  ShieldCheck, 
  History, 
  QrCode, 
  User, 
  BookOpen, 
  GraduationCap, 
  ArrowUpRight,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  MapPin,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const requestHistory = [
  { id: "TR-5501", student: "Md. Amin Islam", stuId: "STU-1001", type: "Official", status: "Verified", date: "2026-04-20" },
  { id: "TR-5502", student: "Sifat Rahman", stuId: "STU-1002", type: "Un-official", status: "Ready", date: "2026-04-22" },
  { id: "TR-5503", student: "Jarin Tasnim", stuId: "STU-1003", type: "Official", status: "Pending Signature", date: "2026-04-24" },
];

export default function TranscriptManagement() {
  const [clearance, setClearance] = React.useState<{ cleared: number; total: number; students: { studentId: string; name: string; cleared: boolean; reasons: string[] }[] } | null>(null);
  const [clearing, setClearing] = React.useState(false);
  const runClearance = async () => {
    setClearing(true);
    try {
      const res = await fetch("/api/admin/marks/clearance");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setClearance(json);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setClearing(false);
    }
  };
  const [stuId, setStuId] = useState("");
  const [transcriptData, setTranscriptData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchTranscript = async () => {
    if (!stuId) {
      toast.error("Please enter a student ID");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/marks/transcript/${stuId}`);
      const data = await res.json();
      
      if (res.ok) {
        setTranscriptData(data);
        toast.success("Transcript generated successfully!");
      } else {
        toast.error(data.error || "Student not found");
        setTranscriptData(null);
      }
    } catch (error) {
      toast.error("Failed to fetch transcript");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12 print:p-0">
      {/* Page Header - Hidden on Print */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Academic Transcripts</h1>
          <p className="text-slate-500">Generate, verify and manage official institutional academic transcripts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => actions.go("/admin/audit-logs")} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
            <History size={18} />
            Request Logs
          </button>
          <button onClick={(e) => actions.details(e)} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer">
            <FileCheck size={18} />
            Verify Transcript
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Transcript Generator & Preview Area */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-50 bg-slate-50/30 print:hidden">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                   <Search size={20} className="text-primary" />
                   Generate Student Transcript
                </h3>
                <form 
                  onSubmit={(e) => { e.preventDefault(); fetchTranscript(); }}
                  className="flex flex-col md:flex-row gap-4"
                >
                   <div className="flex-1 relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Enter Student ID (e.g. STU001)..." 
                        value={stuId}
                        onChange={(e) => setStuId(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                      />
                   </div>
                   <button 
                     type="submit"
                     disabled={loading}
                     className="px-8 py-4 bg-primary text-white font-extrabold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                   >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                      Fetch Records
                   </button>
                </form>
             </div>

             {/* Transcript Content */}
             {transcriptData ? (
               <div className="p-8 space-y-8 bg-white" id="printable-transcript">
                  {/* Transcript Header */}
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                          NUB
                       </div>
                       <div>
                          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">NextGen University</h2>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Office of the Controller of Examinations</p>
                          <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-slate-400 uppercase">
                             <span className="flex items-center gap-1"><MapPin size={10} /> Dhaka, Bangladesh</span>
                             <span className="flex items-center gap-1"><Calendar size={10} /> Issued: {new Date().toLocaleDateString()}</span>
                          </div>
                       </div>
                    </div>
                    <div className="text-right print:hidden">
                       <div className="flex items-center gap-2 mb-4">
                          <button 
                            onClick={handlePrint}
                            className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                          >
                             <Printer size={20} />
                          </button>
                          <button onClick={() => actions.exportCsv("Academic Transcripts")} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
                             <Download size={20} />
                          </button>
                       </div>
                    </div>
                  </div>

                  {/* Student Info Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 px-8 bg-slate-50 rounded-3xl border border-slate-100">
                     <div className="space-y-4">
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Student Name</p>
                           <p className="text-lg font-black text-slate-800">{transcriptData.student.name}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Student ID</p>
                           <p className="text-sm font-bold text-primary">{transcriptData.student.studentId}</p>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Program</p>
                           <p className="text-sm font-bold text-slate-800">{transcriptData.student.classId?.name || "Undergraduate"}</p>
                        </div>
                        <div className="flex gap-8">
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">CGPA</p>
                              <p className="text-lg font-black text-emerald-600">{transcriptData.cgpa}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Total Credits</p>
                              <p className="text-lg font-black text-slate-800">{transcriptData.totalCredits}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Results Table */}
                  <div className="overflow-hidden border border-slate-200 rounded-2xl">
                     <table className="w-full text-left">
                        <thead className="bg-slate-900 text-[10px] uppercase tracking-widest text-white font-black">
                           <tr>
                              <th className="px-6 py-4">Course Details</th>
                              <th className="px-6 py-4 text-center">Marks (%)</th>
                              <th className="px-6 py-4 text-center">Grade</th>
                              <th className="px-6 py-4 text-center">Points</th>
                              <th className="px-6 py-4 text-center">Credits</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {transcriptData.results.map((res: any, i: number) => (
                              <tr key={i} className="hover:bg-slate-50 transition-colors">
                                 <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                       <span className="text-sm font-bold text-slate-800">{res.courseName}</span>
                                       <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{res.courseCode}</span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-center text-xs font-bold text-slate-700">{res.percentage}%</td>
                                 <td className="px-6 py-4 text-center">
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                                       res.grade === 'F' ? 'bg-red-100 text-red-600' : 'bg-primary/5 text-primary'
                                    }`}>{res.grade}</span>
                                 </td>
                                 <td className="px-6 py-4 text-center text-sm font-bold text-slate-800">{res.point.toFixed(2)}</td>
                                 <td className="px-6 py-4 text-center text-sm font-bold text-slate-500">{res.credits}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  {/* Transcript Footer */}
                  <div className="pt-12 flex justify-between items-end border-t border-slate-100">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                           <QrCode size={48} className="text-slate-800" />
                        </div>
                        <p className="text-[9px] text-slate-400 max-w-[150px] leading-relaxed font-medium">Scan this QR code to verify the authenticity of this document on the university portal.</p>
                     </div>
                     <div className="text-center">
                        <div className="w-40 h-px bg-slate-300 mb-2 mx-auto" />
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Controller of Examinations</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">NextGen University of Bangladesh</p>
                     </div>
                  </div>
               </div>
             ) : (
               <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                     <FileText size={40} />
                  </div>
                  <div>
                     <h4 className="text-lg font-bold text-slate-400">No Transcript Loaded</h4>
                     <p className="text-sm text-slate-300 max-w-[300px] mx-auto">Enter a valid student ID above to preview and generate their official transcript.</p>
                  </div>
               </div>
             )}
          </div>

          {/* Transcript Features Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
             <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                   <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                      <QrCode size={20} />
                   </div>
                   <h5 className="font-bold text-emerald-900">QR Verification</h5>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">Every official transcript includes a secure QR code for instant third-party verification via the public portal.</p>
             </div>
             <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                   <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <ShieldCheck size={20} />
                   </div>
                   <h5 className="font-bold text-blue-900">Digital Signature</h5>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">Automatic application of Controller of Examinations' digital signature for all verified transcript generations.</p>
             </div>
          </div>
        </div>

        {/* Recent Requests Sidebar */}
        <div className="space-y-6 print:hidden">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                   <History size={16} className="text-primary" />
                   Recent Requests
                </h3>
                <button onClick={actions.exportCsv.bind(null, "Transcript requests")} className="text-[10px] font-bold text-primary hover:underline cursor-pointer">View All</button>
             </div>
             <div className="divide-y divide-slate-50">
                {requestHistory.map((req, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, x: 10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer"
                   >
                      <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary text-[10px] font-bold">
                               {req.student.charAt(0)}
                            </div>
                            <div>
                               <p className="text-xs font-bold text-slate-800">{req.student}</p>
                               <p className="text-[10px] text-slate-400 font-medium">{req.stuId}</p>
                            </div>
                         </div>
                         <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            req.status === 'Verified' ? 'bg-emerald-100 text-emerald-600' : 
                            req.status === 'Ready' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                         }`}>
                            {req.status}
                         </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                         <span>{req.type} Transcript</span>
                         <span className="flex items-center gap-1 group-hover:text-primary transition-colors">
                            <Download size={12} />
                            Download
                         </span>
                      </div>
                   </motion.div>
                ))}
             </div>
          </div>

          <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
             <div className="relative z-10">
                <GraduationCap size={32} className="text-secondary mb-6" />
                <h3 className="text-lg font-bold mb-3">Graduation Clearance</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">Bulk verify all requirements for graduating students before issuing final complete transcripts.</p>
                <button onClick={runClearance} disabled={clearing} className="w-full py-3.5 bg-secondary text-primary font-extrabold rounded-xl text-xs hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-secondary/5">
                   {clearing ? "Checking..." : "Process Clearance"}
                   <ArrowUpRight size={14} />
                </button>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <BookOpen size={100} />
             </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
             <AlertCircle size={18} className="text-amber-500 mt-0.5" />
             <p className="text-[10px] text-amber-700 font-medium leading-relaxed">Official transcripts require a fee of 500 EGP. Un-official copies for student reference are free of charge.</p>
          </div>
        </div>
      </div>
      {clearance && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onMouseDown={() => setClearance(null)}>
          <div className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white rounded-3xl shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-black text-slate-800 text-lg">Graduation clearance</h3>
              <p className="text-xs text-slate-500">{clearance.cleared} of {clearance.total} active students are cleared (no unpaid fees or fines, no book out, results available).</p>
            </div>
            <div className="overflow-y-auto px-6 py-3">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-slate-50">
                  {clearance.students.map((st) => (
                    <tr key={st.studentId}>
                      <td className="py-2 font-bold text-slate-800">{st.name} <span className="text-[10px] text-slate-400">{st.studentId}</span></td>
                      <td className="py-2 text-right">
                        {st.cleared ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Cleared</span>
                        ) : (
                          <span className="text-xs text-amber-700">{st.reasons.join(" · ")}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-100">
              <button onClick={() => setClearance(null)} className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-bold">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
