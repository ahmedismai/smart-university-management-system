"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Download, 
  ChevronRight, 
  CalendarDays,
  ExternalLink,
  Info,
  CalendarCheck,
  FileText,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const academicEvents = [
  {
    semester: "Spring Semester 2026",
    events: [
      { date: "Jan 15, 2026", title: "Semester Orientation", type: "academic", description: "Orientation program for newly admitted students." },
      { date: "Jan 18, 2026", title: "Classes Begin", type: "academic", description: "Regular classes commence for all departments." },
      { date: "Jan 25, 2026", title: "January 25 Revolution & Police Day", type: "holiday", description: "Public holiday / University closed." },
      { date: "Mar 10 - 20, 2026", title: "Mid-Term Examinations", type: "examination", description: "Mid-semester assessments for all undergraduate programs." },
      { date: "Apr 25, 2026", title: "Sinai Liberation Day", type: "holiday", description: "Public holiday / University closed." },
      { date: "May 01, 2026", title: "Labour Day", type: "holiday", description: "Public holiday / University closed." },
      { date: "May 15 - 30, 2026", title: "Final Examinations", type: "examination", description: "End of semester final examinations." }
    ]
  },
  {
    semester: "Fall Semester 2026",
    events: [
      { date: "Jul 05, 2026", title: "Admission Test: Undergraduate", type: "admission", description: "Centralized Admission Test for the Fall session." },
      { date: "Aug 01, 2026", title: "Fall Semester Orientation", type: "academic", description: "Welcoming the Fall 2026 batch." },
      { date: "Aug 03, 2026", title: "Fall Classes Start", type: "academic", description: "Academic session begins." },
      { date: "Sep 20 - 30, 2026", title: "Mid-Term Examinations", type: "examination", description: "Mid-semester evaluations." },
      { date: "Oct 06, 2026", title: "Armed Forces Day", type: "holiday", description: "National celebration / University holiday." },
      { date: "Dec 20 - Jan 05, 2027", title: "Final Examinations", type: "examination", description: "Final assessments and session wrap-up." }
    ]
  }
];

const categoryColors = {
  academic: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  holiday: "bg-red-500/10 text-red-600 border-red-500/20",
  examination: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  admission: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
};

export default function AcademicCalendarPage() {
  const [activeSemester, setActiveSemester] = useState(0);

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/ordinance-hero.png" // Reusing professional formal image
          alt="University Tower Clock"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-transparent to-primary" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl">
              <Calendar size={16} className="text-secondary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Schedule & Planning</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tight">
              Academic <br/>
              <span className="text-secondary font-serif">Calendar</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
              Stay ahead with our comprehensive academic schedule, including semester dates, examination periods, and university holidays.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Sidebar: Controls & Downloads */}
            <div className="lg:w-1/3 space-y-8">
               <div className="bg-white p-8 rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5 space-y-8">
                  <div className="space-y-4">
                     <h3 className="text-xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
                        <CalendarDays className="text-secondary" /> Select Session
                     </h3>
                     <div className="grid gap-3">
                        {academicEvents.map((session, idx) => (
                           <button
                             key={session.semester}
                             onClick={() => setActiveSemester(idx)}
                             className={cn(
                               "w-full p-4 rounded-2xl flex items-center justify-between font-bold transition-all duration-300 border",
                               activeSemester === idx 
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                                : "bg-surface text-primary/60 border-transparent hover:border-secondary/30 hover:text-primary"
                             )}
                           >
                              {session.semester}
                              <ChevronRight size={18} className={cn("transition-transform", activeSemester === idx ? "rotate-90" : "")} />
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="pt-8 border-t border-primary/5 space-y-4">
                     <h3 className="text-xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
                        <Download className="text-secondary" /> Resources
                     </h3>
                     <div className="grid gap-3">
                        {[
                           { name: "Academic Calendar 2026", size: "1.2 MB", format: "PDF" },
                           { name: "Holiday List 2026", size: "850 KB", format: "PDF" },
                           { name: "Exam Regulations", size: "2.4 MB", format: "PDF" },
                        ].map((file) => (
                           <button onClick={(e) => actions.details(e)} key={file.name} className="group w-full p-4 bg-surface rounded-2xl flex items-center justify-between hover:bg-primary transition-all duration-500">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 bg-white rounded-lg group-hover:bg-secondary/20 transition-colors">
                                    <FileText className="text-primary group-hover:text-secondary" size={20} />
                                 </div>
                                 <div className="text-left">
                                    <p className="text-sm font-bold text-primary group-hover:text-white transition-colors">{file.name}</p>
                                    <p className="text-[10px] font-black text-primary/30 group-hover:text-white/40 uppercase">{file.size} • {file.format}</p>
                                 </div>
                              </div>
                              <Download size={18} className="text-secondary group-hover:translate-y-0.5 transition-transform" />
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Notice Box */}
               <div className="bg-secondary p-8 rounded-[2rem] text-primary relative overflow-hidden group">
                  <div className="relative z-10 space-y-4">
                     <AlertCircle size={32} className="opacity-40" />
                     <h4 className="text-lg font-black uppercase tracking-tight">Important Notice</h4>
                     <p className="text-sm font-bold leading-relaxed opacity-80">
                        Dates are subject to change based on government notifications or university syndicate decisions. Please check regular notices for updates.
                     </p>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                     <Info size={120} />
                  </div>
               </div>
            </div>

            {/* Right Side: Timeline */}
            <div className="lg:w-2/3">
               <div className="space-y-6">
                  <div className="flex justify-between items-end mb-8">
                     <div className="space-y-2">
                        <h2 className="text-4xl font-black text-primary uppercase leading-none">
                           Timeline
                        </h2>
                        <div className="w-16 h-1.5 bg-secondary rounded-full" />
                     </div>
                     <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Academic</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Holiday</span>
                        </div>
                     </div>
                  </div>

                  <div className="relative space-y-8">
                     {/* Horizontal line (behind) */}
                     <div className="absolute left-[33px] top-6 bottom-6 w-0.5 bg-primary/5" />

                     <AnimatePresence mode="wait">
                        <motion.div
                          key={activeSemester}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-6"
                        >
                           {academicEvents[activeSemester].events.map((event, i) => (
                              <motion.div 
                                key={event.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative flex gap-8 group"
                              >
                                 <div className="flex-none w-[66px] h-[66px] bg-white rounded-3xl border border-primary/5 flex items-center justify-center flex-col z-10 shadow-sm group-hover:border-secondary transition-colors duration-500">
                                    <CalendarCheck size={20} className="text-secondary mb-1" />
                                    <div className="text-[9px] font-black text-primary/40 uppercase">Day {i+1}</div>
                                 </div>
                                 
                                 <div className="flex-1 bg-white p-8 rounded-[2rem] border border-primary/5 hover:border-secondary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                       <div className="space-y-1">
                                          <div className="flex items-center gap-3">
                                             <span className="text-secondary font-black text-sm tracking-tight">{event.date}</span>
                                             <span className={cn(
                                                "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                categoryColors[event.type as keyof typeof categoryColors]
                                             )}>
                                                {event.type}
                                             </span>
                                          </div>
                                          <h3 className="text-2xl font-black text-primary uppercase tracking-tight group-hover:text-secondary transition-colors">
                                             {event.title}
                                          </h3>
                                       </div>
                                       <div className="flex-none p-4 bg-surface rounded-2xl group-hover:bg-primary group-hover:text-secondary transition-all duration-500">
                                          <Clock size={20} />
                                       </div>
                                    </div>
                                    <p className="text-sm font-bold text-text-main/50 leading-relaxed max-w-2xl">
                                       {event.description}
                                    </p>
                                 </div>
                              </motion.div>
                           ))}
                        </motion.div>
                     </AnimatePresence>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Calendar Access */}
      <section className="py-24 bg-white relative">
         <div className="container mx-auto px-4">
            <div className="relative p-12 lg:p-24 rounded-[4rem] bg-primary overflow-hidden">
               <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="grid grid-cols-6 gap-8 h-full w-full rotate-12 scale-150">
                     {Array.from({length: 24}).map((_, i) => (
                        <div key={i} className="border-2 border-white/20 rounded-2xl aspect-square" />
                     ))}
                  </div>
               </div>
               
               <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                  <div className="space-y-6 lg:max-w-xl text-center lg:text-left">
                     <h2 className="text-4xl lg:text-6xl font-black text-white uppercase leading-tight tracking-tight">
                        Sync with <br /> <span className="text-secondary">Your Journey</span>
                     </h2>
                     <p className="text-white/60 text-lg font-medium leading-relaxed">
                        Never miss a deadline. Export the full academic calendar to your Google Calendar, iCal, or Outlook and stay informed on the go.
                     </p>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                     <button onClick={() => actions.go("/academics/academic-calendar")} className="flex items-center gap-3 px-8 py-5 bg-secondary text-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all">
                        <Calendar size={20} /> Google Calendar
                     </button>
                     <button onClick={() => actions.print()} className="flex items-center gap-3 px-8 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-primary transition-all backdrop-blur-md">
                        <ExternalLink size={20} /> Other Formats
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </main>
  );
}
