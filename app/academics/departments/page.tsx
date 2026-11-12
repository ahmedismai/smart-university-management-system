"use client";

import { actions } from "@/lib/siteActions";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  BookOpen, 
  ChevronRight, 
  ArrowUpRight,
  School,
  Building2,
  Users2,
  Award,
  FlaskConical,
  Palette,
  Briefcase,
  Scale
} from "lucide-react";
import { cn } from "@/lib/utils";

const faculties = [
  { id: "all", name: "All Faculties", icon: School },
  { id: "science", name: "Science", icon: FlaskConical },
  { id: "engineering", name: "Engineering & Tech", icon: Building2 },
  { id: "business", name: "Business Studies", icon: Briefcase },
  { id: "arts", name: "Arts & Humanities", icon: Palette },
  { id: "law", name: "Law", icon: Scale }
];

const departments = [
  { id: "cse", name: "Computer Science & Engineering", faculty: "engineering", description: "Specializing in software engineering, AI, and cybersecurity.", academicStaff: 45, students: 1200 },
  { id: "physics", name: "Physics", faculty: "science", description: "Exploring quantum mechanics, astrophysics, and material science.", academicStaff: 32, students: 450 },
  { id: "finance", name: "Finance & Banking", faculty: "business", description: "Focusing on global markets, investment banking, and fintech.", academicStaff: 28, students: 800 },
  { id: "english", name: "English", faculty: "arts", description: "In-depth study of linguistics, world literature, and creative writing.", academicStaff: 22, students: 600 },
  { id: "math", name: "Mathematics", faculty: "science", description: "Pure and applied mathematics with focus on cryptography.", academicStaff: 25, students: 400 },
  { id: "eee", name: "Electrical & Electronic Engineering", faculty: "engineering", description: "Leading in power systems, robotics, and nanotechnology.", academicStaff: 38, students: 950 },
  { id: "marketing", name: "Marketing", faculty: "business", description: "Expertise in digital marketing, consumer behavior, and branding.", academicStaff: 20, students: 700 },
  { id: "history", name: "History", faculty: "arts", description: "Preserving global heritage and analyzing socio-political evolution.", academicStaff: 18, students: 350 },
  { id: "law", name: "Law", faculty: "law", description: "Excellence in international law, criminal justice, and civil rights.", academicStaff: 30, students: 500 },
  { id: "economics", name: "Economics", faculty: "business", description: "Developing policy-driven solutions for global socio-economic challenges.", academicStaff: 24, students: 650 },
  { id: "civil", name: "Civil Engineering", faculty: "engineering", description: "Designing sustainable infrastructure and smart city solutions.", academicStaff: 35, students: 880 },
  { id: "philosophy", name: "Philosophy", faculty: "arts", description: "Exploring logic, ethics, and the fundamental nature of existence.", academicStaff: 15, students: 200 }
];

export default function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaculty, setActiveFaculty] = useState("all");

  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => {
      const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFaculty = activeFaculty === "all" || dept.faculty === activeFaculty;
      return matchesSearch && matchesFaculty;
    });
  }, [searchQuery, activeFaculty]);

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/departments-hero.png"
          alt="University Academic Corridor"
          fill
          className="object-cover opacity-30 px-0"
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
              <BookOpen size={16} className="text-secondary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Academic Directory</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tight">
              Academic <br/>
              <span className="text-secondary font-serif">Departments</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
              Explore our specialized departments where academic excellence meets innovative research across diverse fields.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-12 bg-white sticky top-[80px] z-30">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
               {/* Search Bar */}
               <div className="relative w-full lg:max-w-md group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary/40 group-focus-within:text-secondary transition-colors">
                     <Search size={20} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search Departments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-surface border border-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:bg-white focus:border-secondary transition-all font-bold text-primary placeholder:text-primary/30"
                  />
               </div>

               {/* Faculty Filters */}
               <div className="flex items-center gap-2 overflow-x-auto pb-4 lg:pb-0 w-full lg:w-auto no-scrollbar">
                  {faculties.map((fac) => (
                    <button
                      key={fac.id}
                      onClick={() => setActiveFaculty(fac.id)}
                      className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-300 border text-sm",
                        activeFaculty === fac.id 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                          : "bg-surface text-primary/60 border-primary/5 hover:border-secondary/30 hover:text-primary hover:bg-white"
                      )}
                    >
                      <fac.icon size={16} className={activeFaculty === fac.id ? "text-secondary" : ""} />
                      {fac.name}
                    </button>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Departments Grid */}
      <section className="py-24 bg-surface min-h-[600px]">
         <div className="container mx-auto px-4 lg:px-8">
            {filteredDepartments.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredDepartments.map((dept, index) => (
                      <motion.div
                        layout
                        key={dept.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="group bg-white p-8 rounded-[2.5rem] border border-primary/5 hover:border-secondary/30 transition-all duration-500 flex flex-col shadow-sm hover:shadow-2xl hover:shadow-primary/5 h-full"
                      >
                         <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-surface rounded-2xl text-secondary shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                               <School size={24} />
                            </div>
                            <div className="px-3 py-1 bg-secondary/10 rounded-full text-[10px] font-black text-secondary tracking-widest uppercase">
                               {dept.faculty}
                            </div>
                         </div>

                         <div className="space-y-4 flex-1">
                            <h3 className="text-2xl font-black text-primary uppercase leading-tight group-hover:text-secondary transition-colors">
                               {dept.name}
                            </h3>
                            <p className="text-sm font-bold text-text-main/50 leading-relaxed">
                               {dept.description}
                            </p>
                         </div>

                         <div className="pt-8 mt-8 border-t border-primary/5 grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">Faculty Staff</p>
                               <div className="flex items-center gap-2 text-primary font-black">
                                  <Users2 size={16} className="text-secondary" />
                                  <span>{dept.academicStaff}</span>
                               </div>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">Enrollment</p>
                               <div className="flex items-center gap-2 text-primary font-black">
                                  <Award size={16} className="text-secondary" />
                                  <span>{dept.students}+</span>
                               </div>
                            </div>
                         </div>

                         <button onClick={(e) => actions.details(e)} className="mt-8 flex items-center justify-between w-full p-4 bg-surface rounded-2xl group/btn hover:bg-primary transition-all duration-500">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest group-hover/btn:text-white transition-colors">Department details</span>
                            <ArrowUpRight size={18} className="text-secondary group-hover/btn:rotate-45 transition-transform" />
                         </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
               </div>
            ) : (
               <div className="text-center py-40 space-y-6">
                  <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                     <Search size={48} className="text-primary/20" />
                  </div>
                  <h3 className="text-3xl font-black text-primary uppercase">No Departments Found</h3>
                  <p className="text-text-main/50 font-bold">Try adjusting your search or faculty filter.</p>
                  <button 
                    onClick={() => { setSearchQuery(""); setActiveFaculty("all"); }}
                    className="px-8 py-3 bg-secondary text-primary font-black rounded-xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
                  >
                    Clear All Filters
                  </button>
               </div>
            )}
         </div>
      </section>

      {/* Global Academic Impact */}
      <section className="py-24 bg-white overflow-hidden relative">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-20">
               <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
                  <div className="inline-flex items-center gap-3 text-secondary">
                     <div className="h-px w-8 bg-current" />
                     <span className="text-xs font-black uppercase tracking-widest">Institutional Growth</span>
                     <div className="h-px w-8 bg-current" />
                  </div>
                  <h2 className="text-4xl lg:text-6xl font-black text-primary uppercase leading-tight">
                     Pioneering the <br /> <span className="text-secondary">NextGen</span> of Research
                  </h2>
                  <p className="text-lg text-text-main/60 font-medium leading-relaxed">
                     Our departments are not just teaching centers; they are hubs of technological breakthrough and cultural preservation. With over 500+ research papers published annually, we are leading the transformation of Bangladesh&apos;s higher education.
                  </p>
                  <div className="grid grid-cols-2 gap-8 pt-8">
                     <div className="p-6 rounded-3xl bg-surface border border-primary/5">
                        <div className="text-4xl font-black text-primary mb-1">50+</div>
                        <div className="text-[10px] font-black text-secondary uppercase tracking-widest">Research Labs</div>
                     </div>
                     <div className="p-6 rounded-3xl bg-surface border border-primary/5">
                        <div className="text-4xl font-black text-primary mb-1">120+</div>
                        <div className="text-[10px] font-black text-secondary uppercase tracking-widest">Global Partners</div>
                     </div>
                  </div>
               </div>
               <div className="lg:w-1/2 relative group">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-secondary/30 to-primary/20 blur-3xl group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                  <div className="relative aspect-square max-w-lg mx-auto rounded-[3rem] overflow-hidden border border-primary/5 shadow-2xl">
                     <Image 
                        src="/academic-impact.png" 
                        alt="Academic Innovation Research" 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                     <div className="absolute bottom-10 left-10 right-10 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white space-y-2">
                        <div className="text-secondary font-black uppercase text-xs tracking-widest">Ongoing Project</div>
                        <div className="text-xl font-bold">Bridging AI & Social Structure</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </main>
  );
}
