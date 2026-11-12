"use client";

import { actions } from "@/lib/siteActions";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Mail, 
  MapPin, 
  Search, 
  Filter, 
  ArrowUpRight, 
  FlaskConical,
  Cpu,
  Briefcase,
  Palette,
  Scale,
  School,
  Building2,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const faculties = [
  { id: "all", name: "All Faculties", icon: School },
  { id: "science", name: "Science", icon: FlaskConical, color: "text-blue-600 bg-blue-50" },
  { id: "engineering", name: "Engineering & Tech", icon: Building2, color: "text-orange-600 bg-orange-50" },
  { id: "business", name: "Business Studies", icon: Briefcase, color: "text-emerald-600 bg-emerald-50" },
  { id: "arts", name: "Arts & Humanities", icon: Palette, color: "text-purple-600 bg-purple-50" },
  { id: "law", name: "Law", icon: Scale, color: "text-red-600 bg-red-50" }
];

const chairmen = [
  {
    id: "cse",
    name: "Professor Dr. Md. Saidur Rahman",
    role: "Chairman, Computer Science & Engineering",
    faculty: "engineering",
    email: "chairman.cse@nextgen.edu",
    office: "Engineering Wing, Room 402",
    image: "https://cse.buet.ac.bd/graph_drawing/public/assets/img/md_saidur_rahman.jpeg"
  },
  {
    id: "physics",
    name: "Professor Dr. Ishtiaque M. Syed",
    role: "Chairman, Department of Physics",
    faculty: "science",
    email: "chairman.physics@nextgen.edu",
    office: "Science Complex, Room 205",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop"
  },
  {
    id: "finance",
    name: "Professor Dr. M. Sadiqul Islam",
    role: "Chairman, Finance & Banking",
    faculty: "business",
    email: "chairman.finance@nextgen.edu",
    office: "Business Complex, Room 301",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&auto=format&fit=crop"
  },
  {
    id: "english",
    name: "Professor Dr. Shamsad Mortuza",
    role: "Chairman, Department of English",
    faculty: "arts",
    email: "chairman.english@nextgen.edu",
    office: "Arts Building, Room 112",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&auto=format&fit=crop"
  },
  {
    id: "math",
    name: "Professor Dr. Md. Showkat Ali",
    role: "Chairman, Department of Mathematics",
    faculty: "science",
    email: "chairman.math@nextgen.edu",
    office: "Science Complex, Room 408",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&h=400&auto=format&fit=crop"
  },
  {
    id: "eee",
    name: "Professor Dr. Md. Shafiqul Islam",
    role: "Chairman, Electrical & Electronic Engineering",
    faculty: "engineering",
    email: "chairman.eee@nextgen.edu",
    office: "Engineering Annex, Room 215",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&auto=format&fit=crop"
  },
  {
    id: "marketing",
    name: "Professor Dr. Mian Sayeed Bin Hashim",
    role: "Chairman, Department of Marketing",
    faculty: "business",
    email: "chairman.marketing@nextgen.edu",
    office: "Business Complex, Room 402",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=400&auto=format&fit=crop"
  },
  {
    id: "history",
    name: "Professor Dr. Abu Md. Delwar Hosain",
    role: "Chairman, Department of History",
    faculty: "arts",
    email: "chairman.history@nextgen.edu",
    office: "Arts Building, Room 204",
    image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=400&h=400&auto=format&fit=crop"
  },
  {
    id: "law",
    name: "Professor Dr. Md. Akram Hossain",
    role: "Chairman, Faculty of Law",
    faculty: "law",
    email: "chairman.law@nextgen.edu",
    office: "Law Annex, Room 301",
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=400&h=400&auto=format&fit=crop"
  },
  {
    id: "economics",
    name: "Professor Dr. Mahbubul Mokaddem",
    role: "Chairman, Department of Economics",
    faculty: "business",
    email: "chairman.economics@nextgen.edu",
    office: "Social Science Annex, Room 410",
    image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=400&h=400&auto=format&fit=crop"
  },
  {
    id: "civil",
    name: "Professor Dr. Md. Mujibur Rahman",
    role: "Chairman, Civil Engineering",
    faculty: "engineering",
    email: "chairman.civil@nextgen.edu",
    office: "Engineering Annex, Room 512",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&h=400&auto=format&fit=crop"
  },
  {
    id: "philosophy",
    name: "Professor Dr. Md. Sajahan Miah",
    role: "Chairman, Department of Philosophy",
    faculty: "arts",
    email: "chairman.philosophy@nextgen.edu",
    office: "Arts Building, Room 316",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&h=400&auto=format&fit=crop"
  }
];

export default function ChairmenPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaculty, setActiveFaculty] = useState("all");

  const filteredChairmen = useMemo(() => {
    return chairmen.filter(chairman => {
      const matchesSearch = chairman.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          chairman.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFaculty = activeFaculty === "all" || chairman.faculty === activeFaculty;
      return matchesSearch && matchesFaculty;
    });
  }, [searchQuery, activeFaculty]);

  return (
    <main className="flex flex-col min-h-screen pt-20 lg:pt-0">
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/departments-hero.png" // Reusing stable asset
          alt="University Academic Corridor"
          fill
          className="object-cover opacity-20 scale-105 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-transparent to-primary" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl">
               <BookOpen size={16} className="text-secondary" />
               <span className="text-xs font-bold uppercase tracking-[0.2em]">Departmental Leadership</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tight">
               Chairmen of <br/>
               <span className="text-secondary font-serif">Departments</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
               The academic heads responsible for departmental excellence, research coordination, and student-faculty relations across all disciplines.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-12 bg-white sticky top-[80px] z-30 shadow-sm border-b border-primary/5">
         <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center bg-surface/50 p-3 rounded-[2.5rem] border border-primary/5 shadow-inner">
               {/* Search Bar */}
               <div className="relative w-full lg:max-w-md group">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-primary/40 group-focus-within:text-secondary transition-colors">
                     <Search size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Quick search by name or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white border border-primary/5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/15 focus:border-secondary transition-all font-bold text-primary placeholder:text-primary/20 shadow-sm"
                  />
               </div>

               {/* Faculty Filters */}
               <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 w-full lg:flex-1">
                  {faculties.map((fac) => (
                    <button
                      key={fac.id}
                      onClick={() => setActiveFaculty(fac.id)}
                      className={cn(
                        "relative flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 text-[13px] uppercase tracking-wider",
                        activeFaculty === fac.id 
                          ? "text-white shadow-xl shadow-primary/20" 
                          : "text-primary/50 hover:text-primary hover:bg-white/80"
                      )}
                    >
                      {activeFaculty === fac.id && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute inset-0 bg-primary rounded-2xl z-0"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <fac.icon size={16} className={cn("relative z-10", activeFaculty === fac.id ? "text-secondary" : "group-hover:text-primary")} />
                      <span className="relative z-10">{fac.name}</span>
                    </button>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Chairmen Directory */}
      <section className="py-24 bg-surface min-h-[600px] relative">
         {/* Background detail */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[120px] pointer-events-none" />
         
         <div className="container mx-auto px-4 lg:px-8">
            <AnimatePresence mode="popLayout">
               {filteredChairmen.length > 0 ? (
                  <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
                  >
                     {filteredChairmen.map((chairman, i) => (
                        <motion.div
                          key={chairman.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4 }}
                          className="group bg-white rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden flex flex-col h-full"
                        >
                           <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface border-b border-primary/5">
                              <Image 
                                 src={chairman.image}
                                 alt={chairman.name}
                                 fill
                                 className="object-cover transition-transform duration-1000 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              {/* Overlay Faculty Icon */}
                              <div className="absolute top-6 left-6 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover:translate-y-0">
                                 {(() => {
                                    const Icon = faculties.find(f => f.id === chairman.faculty)?.icon || School;
                                    return <Icon size={20} />;
                                 })()}
                              </div>
                           </div>

                           <div className="p-8 space-y-6 flex-1 flex flex-col">
                              <div className="space-y-3">
                                 <h4 className="text-xl font-black text-primary uppercase leading-tight tracking-tight group-hover:text-secondary transition-colors">
                                    {chairman.name}
                                 </h4>
                                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface rounded-lg">
                                    <div className="w-1 h-4 bg-secondary rounded-full" />
                                    <span className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em]">{chairman.role}</span>
                                 </div>
                              </div>

                              <div className="space-y-4 pt-6 border-t border-primary/5 flex-1">
                                 <div className="flex items-center gap-3 group/info">
                                    <div className="p-2 rounded-xl bg-surface text-secondary group-hover/info:bg-primary group-hover/info:text-white transition-colors">
                                       <Mail size={14} />
                                    </div>
                                    <span className="text-[11px] font-bold text-primary/60 lowercase">{chairman.email}</span>
                                 </div>
                                 <div className="flex items-center gap-3 group/info">
                                    <div className="p-2 rounded-xl bg-surface text-secondary group-hover/info:bg-primary group-hover/info:text-white transition-colors">
                                       <MapPin size={14} />
                                    </div>
                                    <span className="text-[11px] font-bold text-primary/60 uppercase leading-tight">{chairman.office}</span>
                                 </div>
                              </div>

                              <button onClick={(e) => actions.details(e)} className="flex items-center justify-between w-full h-14 px-8 mt-6 bg-surface rounded-2xl group/btn hover:bg-primary transition-all duration-500 shadow-sm">
                                 <span className="text-[10px] font-black text-primary group-hover/btn:text-white uppercase tracking-widest">Leadership Profile</span>
                                 <ArrowUpRight size={16} className="text-secondary group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                           </div>
                        </motion.div>
                     ))}
                  </motion.div>
               ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-40 space-y-6"
                  >
                     <div className="w-28 h-28 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl border border-primary/5">
                        <Users size={48} className="text-primary/10" />
                     </div>
                     <h3 className="text-3xl font-black text-primary uppercase">No Results Match</h3>
                     <p className="text-text-main/40 font-bold uppercase tracking-widest text-xs">Try adjusting your filters or department search</p>
                     <button 
                        onClick={() => { setSearchQuery(""); setActiveFaculty("all"); }}
                        className="px-12 py-5 bg-secondary text-primary font-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-[0.2em] shadow-lg shadow-secondary/20"
                     >
                        Reset Directory
                     </button>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </section>

      {/* Leadership Vision Callout */}
      <section className="py-24 bg-white relative overflow-hidden">
         <div className="container mx-auto px-4 lg:px-8">
            <div className="bg-primary rounded-[5rem] p-12 lg:p-24 relative overflow-hidden group border border-white/5 shadow-2xl">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000 rotate-12">
                  <School size={500} className="text-white" />
               </div>
               
               <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div className="space-y-10">
                     <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-secondary text-[11px] font-black uppercase tracking-[0.2em]">
                        Academic Governance
                     </div>
                     <h2 className="text-5xl lg:text-8xl font-black text-white uppercase leading-none tracking-tighter">
                        Academic <br /> <span className="text-secondary font-serif">Frontline</span>
                     </h2>
                     <p className="text-white/60 text-lg font-medium leading-relaxed max-w-xl">
                        Departmental Chairmen are the tactical backbone of NextGen University. They bridge strategic vision with operational excellence to ensure world-class education for every student.
                     </p>
                     <div className="flex flex-wrap gap-4 pt-4">
                        <button onClick={() => actions.inquiry("Request: Statutory Rules", { type: "contact", title: "Statutory Rules", description: "Tell us how to reach you and we will send you this information." })} className="px-12 py-6 bg-secondary text-primary rounded-[2rem] font-black text-[13px] uppercase tracking-widest shadow-2xl shadow-secondary/30 hover:scale-105 active:scale-95 transition-all">
                           Statutory Rules
                        </button>
                        <button onClick={() => actions.inquiry("Request: Support Registry", { type: "contact", title: "Support Registry", description: "Tell us how to reach you and we will send you this information." })} className="px-12 py-6 bg-white/5 text-white border border-white/20 rounded-[2rem] font-black text-[13px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all backdrop-blur-xl">
                           Support Registry
                        </button>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 relative">
                     {[
                        { label: "Research Labs", val: "120+", icon: FlaskConical },
                        { label: "Faculty Members", val: "1,200+", icon: Users }
                     ].map((stat, i) => (
                        <div key={stat.label} className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-sm group/stat hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 shadow-xl">
                           <stat.icon className="text-secondary mb-6 group-hover/stat:scale-110 transition-transform" size={40} />
                           <div className="text-5xl font-black text-white mb-2 tracking-tight">{stat.val}</div>
                           <div className="text-[11px] font-black text-white/30 uppercase tracking-[0.25em]">{stat.label}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

    </main>
  );
}
