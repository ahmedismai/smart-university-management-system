"use client";

import { actions } from "@/lib/siteActions";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Search, 
  MapPin, 
  GraduationCap, 
  Stethoscope, 
  Cpu, 
  BookOpen,
  ArrowUpRight,
  ChevronRight,
  Filter,
  Users2,
  ExternalLink,
  ShieldCheck,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "All Colleges", icon: Building2 },
  { id: "medical", name: "Medical & Dental", icon: Stethoscope },
  { id: "engineering", name: "Engineering & Tech", icon: Cpu },
  { id: "general", name: "General Education", icon: BookOpen },
];

const colleges = [
  { 
    id: "dmc", 
    name: "Dhaka Medical College", 
    category: "medical", 
    location: "Dhaka", 
    established: "1946",
    students: "2,500+", 
    specialization: "Medicine, Surgery, Cardiology",
    image: "/faculty-law.png" 
  },
  { 
    id: "mmc", 
    name: "Mymensingh Medical College", 
    category: "medical", 
    location: "Mymensingh", 
    established: "1962",
    students: "1,800+", 
    specialization: "General Medicine, Pediatrics",
    image: "/faculty-science.png"
  },
  { 
    id: "bite", 
    name: "Bangladesh Institute of Tech", 
    category: "engineering", 
    location: "Gazipur", 
    established: "1995",
    students: "3,200+", 
    specialization: "Textile, Civil, Mechanical",
    image: "/faculty-engineering.png"
  },
  { 
    id: "igc", 
    name: "Ideal General College", 
    category: "general", 
    location: "Dhaka", 
    established: "2001",
    students: "5,000+", 
    specialization: "Science, Commerce, Arts",
    image: "/faculty-arts.png"
  },
  { 
    id: "ssmc", 
    name: "Sir Salimullah Medical College", 
    category: "medical", 
    location: "Mitford, Dhaka", 
    established: "1875",
    students: "2,100+", 
    specialization: "Surgery, Orthopedics",
    image: "/faculty-business.png" 
  },
  { 
    id: "gist", 
    name: "Global Institute of Science", 
    category: "engineering", 
    location: "Chittagong", 
    established: "2008",
    students: "1,500+", 
    specialization: "Computer Science, EEE",
    image: "/campus-hero.png"
  }
];

export default function AffiliatedCollegesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredColleges = useMemo(() => {
    return colleges.filter(college => {
      const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           college.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" || college.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/campus-hero.png"
          alt="Majestic University Gateway"
          fill
          className="object-cover opacity-30 scale-105 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-transparent to-primary" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl">
               <GraduationCap size={16} className="text-secondary" />
               <span className="text-xs font-bold uppercase tracking-[0.2em]">Institutional Network</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tight">
               Affiliated <br/>
               <span className="text-secondary font-serif">Colleges</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
               NextGen University oversees a vast network of 100+ prestigious colleges, ensuring uniform academic excellence across Bangladesh.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="-mt-16 relative z-20 pb-12">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
              {[
                { label: "Total Colleges", value: "105", icon: Building2 },
                { label: "Medical Seats", value: "4,500+", icon: Stethoscope },
                { label: "Engineering Seats", value: "8,200+", icon: Cpu },
                { label: "Active Students", value: "150k+", icon: Users2 },
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-primary/5 text-center space-y-2 group hover:-translate-y-2 transition-all duration-300"
                >
                   <stat.icon className="mx-auto text-secondary mb-2 group-hover:scale-110 transition-transform" size={28} />
                   <div className="text-4xl font-black text-primary">{stat.value}</div>
                   <div className="text-[10px] font-black text-text-main/40 uppercase tracking-[0.2em]">{stat.label}</div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="py-12 bg-white sticky top-[80px] z-[40]">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
                <div className="relative w-full lg:max-w-md group">
                   <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-primary/30 group-focus-within:text-secondary transition-colors">
                      <Search size={22} />
                   </div>
                   <input 
                     type="text" 
                     placeholder="Search College or City..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-16 pr-8 py-6 rounded-3xl bg-surface border border-primary/5 focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:bg-white focus:border-secondary transition-all font-bold text-primary placeholder:text-primary/20 shadow-sm"
                   />
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-4 lg:pb-0 w-full lg:w-auto no-scrollbar">
                   {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                          "flex items-center gap-3 px-8 py-4 rounded-2xl font-black whitespace-nowrap transition-all duration-500 border text-xs uppercase tracking-widest",
                          activeCategory === cat.id 
                            ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105" 
                            : "bg-surface text-primary/40 border-primary/5 hover:border-secondary/30 hover:text-primary"
                        )}
                      >
                         <cat.icon size={16} className={activeCategory === cat.id ? "text-secondary" : ""} />
                         {cat.name}
                      </button>
                   ))}
                </div>
            </div>
         </div>
      </section>

      {/* College Grid */}
      <section className="py-24 bg-surface min-h-[600px] relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
         
         <div className="container mx-auto px-4 lg:px-8">
            <AnimatePresence mode="popLayout">
               {filteredColleges.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                     {filteredColleges.map((college, idx) => (
                        <motion.div
                          layout
                          key={college.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, delay: idx * 0.05 }}
                          className="group bg-white rounded-[3rem] overflow-hidden border border-primary/5 hover:border-secondary/30 transition-all duration-500 flex flex-col shadow-sm hover:shadow-2xl hover:shadow-primary/5"
                        >
                           <div className="relative h-64 overflow-hidden">
                              <Image 
                                src={college.image} 
                                alt={college.name} 
                                fill 
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                              <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white tracking-widest uppercase">
                                 Est. {college.established}
                              </div>
                              <div className="absolute bottom-6 left-6 right-6">
                                 <h3 className="text-2xl font-black text-white leading-tight uppercase">
                                    {college.name}
                                 </h3>
                              </div>
                           </div>

                           <div className="p-8 space-y-6 flex-1 flex flex-col">
                              <div className="flex flex-wrap gap-2">
                                 <div className="flex items-center gap-1.5 px-3 py-1 bg-surface rounded-lg text-[10px] font-black text-primary/60 uppercase">
                                    <MapPin size={12} className="text-secondary" /> {college.location}
                                 </div>
                                 <div className="px-3 py-1 bg-secondary/10 rounded-lg text-[10px] font-black text-secondary uppercase">
                                    {college.category}
                                 </div>
                              </div>

                              <div className="space-y-4 flex-1">
                                 <p className="text-sm font-medium text-text-main/60 leading-relaxed  ">
                                    &ldquo;{college.specialization}&rdquo;
                                 </p>
                                 <div className="pt-4 grid grid-cols-2 gap-4 border-t border-primary/5">
                                    <div className="space-y-1">
                                       <span className="text-[10px] font-black text-primary/30 uppercase tracking-widest">Enrolled Students</span>
                                       <p className="text-sm font-black text-primary">{college.students}</p>
                                    </div>
                                    <div className="flex items-end justify-end">
                                       <div className="w-10 h-10 rounded-2xl bg-surface flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-secondary transition-all duration-500">
                                          <ArrowUpRight size={18} />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              
                              <button onClick={(e) => actions.details(e)} className="w-full py-4 bg-surface group-hover:bg-primary rounded-2xl flex items-center justify-center gap-3 transition-all duration-500">
                                 <span className="text-xs font-black uppercase tracking-widest text-primary group-hover:text-white">View College Profile</span>
                                 <ExternalLink size={14} className="text-secondary" />
                              </button>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-40 text-center space-y-6"
                  >
                     <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <Search size={48} className="text-primary/10" />
                     </div>
                     <h3 className="text-3xl font-black text-primary uppercase">No Colleges Found</h3>
                     <p className="text-text-main/50 font-bold max-w-md mx-auto">
                        We couldn&apos;t find any affiliated colleges matching your search or selected category.
                     </p>
                     <button 
                        onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                        className="px-8 py-4 bg-secondary text-primary font-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
                     >
                        Reset All Filters
                     </button>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </section>

      {/* Admission & Standards Section */}
      <section className="py-24 bg-white">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="relative group">
                   <div className="absolute -inset-10 bg-primary/5 rounded-full blur-[100px] group-hover:bg-secondary/5 transition-colors duration-1000" />
                   <div className="relative bg-primary rounded-[4rem] p-12 lg:p-20 text-white space-y-10 overflow-hidden shadow-2xl">
                      <div className="space-y-6 relative z-10">
                         <ShieldCheck size={56} className="text-secondary" />
                         <h2 className="text-4xl font-black uppercase tracking-tight leading-tight">
                            Academic <br /> <span className="text-secondary font-serif">Standards</span>
                         </h2>
                         <div className="space-y-6 pt-4">
                            {[
                               { title: "Unified Syllabus", desc: "All affiliated institutions follow a centralized curriculum reviewed annually by the University Academic Council." },
                               { title: "Standardized Exams", desc: "Final examinations and evaluation processes are conducted centrally by the University Controller Office." },
                               { title: "Quality Audits", desc: "Periodic inspections of labs, libraries, and faculty standards to ensure global benchmark compliance." }
                            ].map((item) => (
                               <div key={item.title} className="space-y-2">
                                  <h4 className="text-secondary font-black uppercase text-xs tracking-widest">{item.title}</h4>
                                  <p className="text-white/60 font-medium leading-relaxed text-sm">{item.desc}</p>
                               </div>
                            ))}
                         </div>
                      </div>
                      <div className="absolute -bottom-20 -right-20 opacity-5">
                          <Building2 size={400} />
                      </div>
                   </div>
               </div>

               <div className="space-y-10">
                  <div className="space-y-4">
                     <h2 className="text-4xl lg:text-6xl font-black text-primary uppercase leading-tight tracking-tight">
                        Integrated <br /> <span className="text-secondary">Admissions</span>
                     </h2>
                     <p className="text-lg text-text-main/60 font-medium leading-relaxed max-w-xl">
                        Interested in joining one of our affiliated colleges? The admission process is centralized to ensure merit-based selection and transparency.
                     </p>
                  </div>

                  <div className="grid gap-6">
                     {[
                        { title: "Check Eligibility", icon: Info, color: "text-blue-500 bg-blue-500/10" },
                        { title: "Application Portal", icon: MousePointer2, color: "text-emerald-500 bg-emerald-500/10" },
                        { title: "Entrance Schedule", icon: Calendar, color: "text-orange-500 bg-orange-500/10" },
                     ].map((step) => (
                        <div key={step.title} className="flex items-center justify-between p-8 bg-surface rounded-[2.5rem] group hover:bg-primary transition-all duration-500 cursor-pointer">
                           <div className="flex items-center gap-6">
                              <div className={cn("p-4 rounded-2xl transition-colors", step.color, "group-hover:bg-white group-hover:text-primary")}>
                                 <step.icon size={24} />
                              </div>
                              <span className="font-black text-primary uppercase tracking-tight group-hover:text-white transition-colors">{step.title}</span>
                           </div>
                           <ChevronRight size={24} className="text-primary/20 group-hover:text-secondary transition-colors" />
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

// Reusing global component MousePointer2 from institutes/page logic or Lucide
function MousePointer2({ size, className }: { size?: number, className?: string }) {
   return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/>
    </svg>
   );
}

function Calendar({ size, className }: { size?: number, className?: string }) {
   return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
   );
}
