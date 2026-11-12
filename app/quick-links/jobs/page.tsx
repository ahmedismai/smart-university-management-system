"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Clock, 
  Building2, 
  ChevronRight, 
  GraduationCap,
  Users,
  Heart,
  Globe,
  FileText,
  BadgeCheck,
  MousePointer2
} from "lucide-react";
import { cn } from "@/lib/utils";

const jobs = [
  {
    id: 1,
    title: "Professor of Artificial Intelligence",
    department: "Computer Science & Engineering",
    type: "Full-time",
    location: "Main Campus, Dhaka",
    deadline: "May 15, 2026",
    category: "Academic",
    salary: "Grade 1-3 (As per Govt. Scale)"
  },
  {
    id: 2,
    title: "Post-Doctoral Fellow (Quantum Computing)",
    department: "Innovation Lab",
    type: "Contract (2 Years)",
    location: "Main Campus, Dhaka",
    deadline: "May 20, 2026",
    category: "Research",
    salary: "Negotiable / Research Grant"
  },
  {
    id: 3,
    title: "Deputy Registrar (Academic)",
    department: "Registrar Office",
    type: "Full-time",
    location: "Administrative Block",
    deadline: "June 05, 2026",
    category: "Administrative",
    salary: "Grade 5 (As per Govt. Scale)"
  },
  {
    id: 4,
    title: "Senior Research Engineer (AR/VR)",
    department: "Research Center",
    type: "Full-time",
    location: "Main Campus, Dhaka",
    deadline: "May 12, 2026",
    category: "Research",
    salary: "Project Based (Competitive)"
  },
  {
    id: 5,
    title: "Associate Professor (Econometrics)",
    department: "Economics",
    type: "Full-time",
    location: "Main Campus, Dhaka",
    deadline: "June 10, 2026",
    category: "Academic",
    salary: "Grade 4 (As per Govt. Scale)"
  },
  {
    id: 6,
    title: "IT Support Specialist",
    department: "ICT Division",
    type: "Full-time",
    location: "Main Campus, Dhaka",
    deadline: "May 30, 2026",
    category: "Administrative",
    salary: "Grade 9-11 (As per Govt. Scale)"
  }
];

const categories = ["All Positions", "Academic", "Research", "Administrative"];

export default function JobsPage() {
  const [activeCategory, setActiveCategory] = useState("All Positions");

  const filteredJobs = activeCategory === "All Positions" 
    ? jobs 
    : jobs.filter(job => job.category === activeCategory);

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/journals-hero.png"
          alt="Modern Career Hub"
          fill
          className="object-cover opacity-20 scale-105 animate-slow-zoom"
          priority
        />
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-secondary shadow-2xl"
          >
             <Briefcase size={16} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Join our Global Mission</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl lg:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter"
          >
             Career <br />
             <span className="text-secondary">Opportunities</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-white/70 max-w-2xl mx-auto font-medium leading-relaxed"
          >
             Be part of a world-class academic community driving innovation, fostering excellence, and shaping the future of global education.
          </motion.p>
        </div>
      </section>

      {/* Search & Categories */}
      <section className="-mt-16 relative z-30">
         <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-[3rem] p-6 lg:p-10 shadow-[0_48px_100px_-20px_rgba(0,0,0,0.12)] border border-gray-100">
               <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 relative">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30" size={24} />
                     <input 
                        type="text" 
                        placeholder="Search by Job title, Department, or Rank..."
                        className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-surface border border-transparent focus:bg-white focus:border-secondary/30 focus:ring-4 focus:ring-secondary/10 transition-all font-bold text-primary placeholder:text-primary/20"
                     />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                     {categories.map((cat) => (
                        <button 
                           key={cat}
                           onClick={() => setActiveCategory(cat)}
                           className={cn(
                              "px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
                              activeCategory === cat 
                                 ? "bg-secondary text-primary shadow-lg shadow-secondary/20" 
                                 : "bg-surface text-primary/40 hover:bg-secondary/10 hover:text-primary"
                           )}
                        >
                           {cat}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Main Job Board */}
      <section className="py-24 bg-white">
         <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-8">
               <div className="flex items-center justify-between px-6 pb-6 border-b border-gray-100">
                  <div className="space-y-1">
                     <h2 className="text-3xl font-black text-primary uppercase tracking-tighter">Current <span className="text-secondary">Openings</span></h2>
                     <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em]">{filteredJobs.length} Positions found</p>
                  </div>
                  <div className="hidden lg:flex items-center gap-4 text-primary/20 text-[10px] font-black uppercase tracking-widest">
                     <span>Ranked by Relevance</span>
                     <ChevronRight size={14} />
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-6">
                  <AnimatePresence mode="popLayout">
                     {filteredJobs.map((job, i) => (
                        <motion.div
                           key={job.id}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           transition={{ duration: 0.2, delay: i * 0.05 }}
                           className="group bg-surface rounded-[2.5rem] p-8 lg:p-10 border border-transparent hover:border-secondary/20 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
                        >
                           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                              <div className="space-y-4 flex-1">
                                 <div className="flex flex-wrap items-center gap-3">
                                    <span className="px-3 py-1 bg-primary/5 text-primary/60 rounded-full text-[8px] font-black uppercase tracking-widest">{job.category}</span>
                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                                       <Clock size={10} /> {job.type}
                                    </span>
                                 </div>
                                 <h3 className="text-2xl lg:text-3xl font-black text-primary uppercase tracking-tight group-hover:text-secondary transition-colors">
                                    {job.title}
                                 </h3>
                                 <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-primary/40 uppercase tracking-widest">
                                       <Building2 size={12} /> {job.department}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-primary/40 uppercase tracking-widest">
                                       <MapPin size={12} /> {job.location}
                                    </div>
                                 </div>
                              </div>

                              <div className="flex flex-col lg:items-end gap-6 lg:min-w-[200px]">
                                 <div className="text-left lg:text-right space-y-1">
                                    <p className="text-[10px] font-black text-primary/20 uppercase tracking-widest">Deadline</p>
                                    <p className="font-bold text-primary">{job.deadline}</p>
                                 </div>
                                 <button onClick={() => actions.inquiry("Apply Now", { type: "apply", title: "Apply Now", context: "Page: jobs" })} className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-secondary rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-secondary hover:text-primary transition-all group/btn">
                                    Apply Now <MousePointer2 size={14} className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                                 </button>
                                 <p className="text-[8px] font-black text-primary/10 uppercase tracking-[0.2em] text-center lg:text-right">{job.salary}</p>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </div>
            </div>
         </div>
      </section>

      {/* Career Values */}
      <section className="py-32 bg-surface">
         <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
               <div className="space-y-12">
                  <div className="space-y-6">
                     <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-[0.9] tracking-tighter">
                        Why Build Your <br /> <span className="text-secondary font-serif">Future with Us?</span>
                     </h2>
                     <p className="text-xl text-text-main/60 font-medium leading-relaxed">
                        We don't just offer jobs; we offer a platform for global research impact, academic freedom, and institutional leadership.
                     </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8">
                     {[
                        { icon: Globe, title: "Global Impact", desc: "Contribute to research that solves real-world challenges." },
                        { icon: Heart, title: "Health & Well-being", desc: "Comprehensive insurance and wellness plans for all staff." },
                        { icon: GraduationCap, title: "Growth Mindset", desc: "Sponsored higher education and research sabbaticals." },
                        { icon: Users, title: "Diverse Culture", desc: "Join 1500+ professionals from 15+ countries." }
                     ].map((item) => (
                        <div key={item.title} className="space-y-4">
                           <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-secondary">
                              <item.icon size={22} />
                           </div>
                           <div className="space-y-1">
                              <h4 className="font-black text-primary uppercase text-sm tracking-tight">{item.title}</h4>
                              <p className="text-xs font-bold text-text-main/40 uppercase leading-snug">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="relative">
                  <div className="absolute inset-0 bg-secondary/10 blur-[120px] rounded-full animate-pulse" />
                  <div className="relative bg-primary rounded-[4rem] p-12 lg:p-20 text-white overflow-hidden shadow-2xl">
                     <div className="space-y-10 relative z-10">
                        <div className="space-y-4">
                           <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-secondary font-black text-[10px] uppercase tracking-widest">
                              <BadgeCheck size={14} /> Recruitment Roadmap
                           </div>
                           <h3 className="text-3xl font-black uppercase tracking-tight">Our Selection <span className="text-secondary">Process</span></h3>
                        </div>

                        <div className="space-y-6">
                           {[
                              "Review of Profile & Credentials",
                              "Preliminary Competence Interview",
                              "Faculty/Division Seminar & Defense",
                              "Administrative Onboarding"
                           ].map((step, i) => (
                              <div key={step} className="flex items-center gap-6 group">
                                 <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-black text-secondary group-hover:bg-secondary group-hover:text-primary transition-all">
                                    {i + 1}
                                 </div>
                                 <p className="font-bold text-white/70 group-hover:text-white transition-colors uppercase tracking-widest text-[11px]">{step}</p>
                              </div>
                           ))}
                        </div>

                        <button onClick={() => actions.inquiry("Request: Explore HR Policies", { type: "contact", title: "Explore HR Policies", description: "Tell us how to reach you and we will send you this information." })} className="w-full py-5 bg-white text-primary rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-secondary transition-all">
                           Explore HR Policies
                        </button>
                     </div>
                     <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none grayscale">
                        <Building2 size={400} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* HR Support CTA */}
      <section className="py-24 bg-white text-center">
         <div className="container mx-auto px-4 max-w-4xl space-y-12">
            <div className="space-y-4">
               <h3 className="text-3xl lg:text-5xl font-black text-primary uppercase tracking-tighter">Need <span className="text-secondary text-serif">Recruitment</span> Help?</h3>
               <p className="text-text-main/60 font-medium text-lg max-w-2xl mx-auto">For technical queries regarding the application portal or specific inquiries about a position, our HR team is here to help.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
               <button onClick={() => actions.print()} className="flex items-center gap-3 px-12 py-5 bg-surface text-primary rounded-2xl font-black uppercase text-sm tracking-widest hover:border-secondary transition-all border border-transparent">
                  <FileText size={18} className="text-secondary" /> Download Guide
               </button>
               <button onClick={() => actions.inquiry("Request: Recruitment FAQ", { type: "contact", title: "Recruitment FAQ", description: "Tell us how to reach you and we will send you this information." })} className="flex items-center gap-3 px-12 py-5 bg-surface text-primary rounded-2xl font-black uppercase text-sm tracking-widest hover:border-secondary transition-all border border-transparent">
                  <Users size={18} className="text-secondary" /> Recruitment FAQ
               </button>
            </div>
         </div>
      </section>
    </main>
  );
}
