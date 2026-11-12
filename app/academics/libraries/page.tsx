"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Library as LibraryIcon, 
  Book, 
  Globe, 
  Clock, 
  Search, 
  Download, 
  ArrowUpRight,
  ChevronRight,
  BookOpen,
  History,
  FileText,
  MousePointer2
} from "lucide-react";
import { cn } from "@/lib/utils";

const libraries = [
  {
    id: "central",
    name: "Central Library",
    description: "The intellectual heart of NextGen University, housing over 800,000 volumes across 6 floors of state-of-the-art facilities.",
    specialization: "General Collection",
    capacity: "3,000+ Students",
    color: "bg-blue-500/10 text-blue-600",
    image: "/campus-hero.png" // Reusing grand architectural asset
  },
  {
    id: "science",
    name: "Science & Tech Library",
    description: "A specialized hub for STEM research with dedicated wings for Physics, Biology, and Engineering manuscripts.",
    specialization: "STEM & Innovation",
    capacity: "800+ Students",
    color: "bg-orange-500/10 text-orange-600",
    image: "/faculty-science.png" // Reusing professional asset
  },
  {
    id: "business",
    name: "Executive Business Library",
    description: "Curation of global trade journals, corporate case studies, and real-time financial market databases.",
    specialization: "Business & Finance",
    capacity: "500+ Students",
    color: "bg-emerald-500/10 text-emerald-600",
    image: "/faculty-business.png" // Reusing professional asset
  },
  {
    id: "law",
    name: "Jurisprudence Wing",
    description: "Housing one of the country's largest collections of legal precedents, constitutional law, and human rights archives.",
    specialization: "Law & Humanities",
    capacity: "400+ Students",
    color: "bg-red-500/10 text-red-600",
    image: "/faculty-law.png" // Reusing professional asset
  }
];

export default function LibrariesPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[55vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/campus-hero.png"
          alt="Majestic Library Entrance"
          fill
          className="object-cover opacity-40 scale-105 animate-slow-zoom"
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
               <LibraryIcon size={16} className="text-secondary" />
               <span className="text-xs font-bold uppercase tracking-[0.2em]">The Infinite Collection</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tight">
               University <br/>
               <span className="text-secondary font-serif">Libraries</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
               More than just books—our libraries are gateways to global knowledge, offering 24/7 digital access and serene physical spaces.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="-mt-20 relative z-20">
         <div className="container mx-auto px-4">
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-primary/10 border border-primary/5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x border-primary/5">
                   {[
                      { icon: Book, label: "Physical Volumes", value: "1.2M+" },
                      { icon: Globe, label: "Digital Journals", value: "50k+" },
                      { icon: MousePointer2, label: "Terminal Access", value: "800+" },
                      { icon: Clock, label: "System Uptime", value: "24/7" },
                   ].map((stat, i) => (
                      <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex flex-col items-center text-center space-y-2 px-4"
                      >
                         <stat.icon className="text-secondary mb-2" size={32} />
                         <div className="text-4xl font-black text-primary">{stat.value}</div>
                         <div className="text-[10px] font-black text-text-main/40 uppercase tracking-[0.2em]">{stat.label}</div>
                      </motion.div>
                   ))}
                </div>
            </div>
         </div>
      </section>

      {/* Search CTA */}
      <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
             <div className="max-w-4xl mx-auto bg-surface rounded-[4rem] p-12 lg:p-20 relative overflow-hidden group">
                <div className="relative z-10 space-y-8 text-center">
                   <div className="space-y-4">
                      <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-tight">
                         Access Global <span className="text-secondary">E-Catalog</span>
                      </h2>
                      <p className="text-text-main/60 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                         Search through our entire collection across all libraries from a single interface. Access institutional repositories and world-class digital databases.
                      </p>
                   </div>
                   <div className="relative max-w-2xl mx-auto">
                      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                         <Search className="text-primary/30" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Search Books, Journals, or Papers..."
                        className="w-full pl-16 pr-8 py-6 rounded-full bg-white border border-primary/5 focus:ring-4 focus:ring-secondary/20 focus:border-secondary transition-all font-bold text-primary shadow-xl shadow-primary/5 placeholder:text-primary/20"
                      />
                      <button onClick={() => actions.filter("Search this page")} className="absolute right-3 top-3 bottom-3 px-8 bg-primary text-secondary rounded-full font-black uppercase text-xs tracking-widest hover:bg-secondary hover:text-primary transition-all">
                         Search
                      </button>
                   </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
             </div>
          </div>
      </section>

      {/* Library Directory */}
      <section className="py-24 bg-surface relative">
         <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-6">
               <div className="space-y-4">
                  <div className="h-1.5 w-24 bg-secondary rounded-full" />
                  <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-none">
                     Library <span className="text-secondary font-serif">Directory</span>
                  </h2>
               </div>
               <p className="text-text-main/50 font-bold max-w-md lg:text-right">
                  Our network of libraries spans across the entire North Campus, ensuring specialized knowledge is always within reach.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {libraries.map((lib, index) => (
                  <motion.div
                    key={lib.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="group flex flex-col lg:flex-row bg-white rounded-[3rem] overflow-hidden border border-primary/5 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                  >
                     <div className="lg:w-2/5 relative h-64 lg:h-auto overflow-hidden">
                        <Image 
                          src={lib.image} 
                          alt={lib.name} 
                          fill 
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     </div>
                     <div className="lg:w-3/5 p-10 space-y-6 flex flex-col justify-center">
                        <div className="space-y-2">
                           <div className={cn(
                              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                              lib.color
                           )}>
                              {lib.specialization}
                           </div>
                           <h3 className="text-3xl font-black text-primary uppercase group-hover:text-secondary transition-colors leading-tight">
                              {lib.name}
                           </h3>
                        </div>
                        <p className="text-sm font-medium text-text-main/60 leading-relaxed">
                           {lib.description}
                        </p>
                        <div className="flex items-center gap-6 pt-4">
                           <div className="space-y-1">
                              <span className="text-[10px] font-black text-primary/30 uppercase tracking-widest">Capacity</span>
                              <p className="text-sm font-black text-primary">{lib.capacity}</p>
                           </div>
                           <button onClick={(e) => actions.details(e)} className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] group/btn">
                              Explore Library <ArrowUpRight size={14} className="text-secondary group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Opening Hours Section */}
      <section className="py-24 bg-white overflow-hidden relative">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <div className="space-y-4">
                     <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-tight tracking-tight">
                        Working <br /> <span className="text-secondary">Hours</span>
                     </h2>
                     <p className="text-lg text-text-main/60 font-medium leading-relaxed max-w-xl">
                        Our facilities are designed to accommodate the rigorous schedules of our students and researchers. During exam sessions, select wings remain open 24/7.
                     </p>
                  </div>
                  
                  <div className="space-y-4">
                     {[
                        { day: "Sunday - Wednesday", hours: "08:00 AM - 10:00 PM" },
                        { day: "Thursday", hours: "08:00 AM - 08:00 PM" },
                        { day: "Friday & Public Holidays", hours: "Closed" },
                        { day: "Saturday", hours: "10:00 AM - 05:00 PM" },
                     ].map((schedule, i) => (
                        <div key={schedule.day} className="flex items-center justify-between p-6 bg-surface rounded-3xl group hover:bg-primary transition-all duration-300">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-secondary group-hover:text-primary transition-colors">
                                 <Clock size={20} />
                              </div>
                              <span className="font-black text-primary uppercase tracking-tight group-hover:text-white transition-colors">{schedule.day}</span>
                           </div>
                           <span className="text-sm font-bold text-text-main/40 group-hover:text-secondary mb-0.5">{schedule.hours}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="relative">
                  <div className="absolute -inset-10 bg-secondary/20 blur-3xl rounded-full animate-pulse px-0" />
                  <div className="relative bg-primary rounded-[4rem] p-12 lg:p-20 text-white space-y-10 overflow-hidden shadow-2xl">
                     <div className="space-y-4 relative z-10">
                        <History size={48} className="text-secondary" />
                        <h3 className="text-3xl font-black uppercase tracking-tight">Library Guidelines</h3>
                        <div className="space-y-4 pt-6">
                           {[
                              "University ID Card is mandatory for entry",
                              "Quiet zones must be respected at all times",
                              "Standard borrowing period is 14 days",
                              "No outside food or drinks allowed"
                           ].map((rule) => (
                              <div key={rule} className="flex items-start gap-4">
                                 <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-none" />
                                 <p className="text-white/70 font-medium">{rule}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                     <button onClick={() => actions.print()} className="relative z-10 w-full py-5 bg-secondary text-primary rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-secondary/10 hover:scale-105 active:scale-95 transition-all">
                        Full Membership Guide
                     </button>
                     <div className="absolute -bottom-20 -right-20 opacity-5">
                         <LibraryIcon size={400} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Digital CTA */}
      <section className="py-24 bg-surface">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 p-12 lg:p-20 rounded-[4rem] bg-gradient-to-br from-primary to-primary/90 text-white relative overflow-hidden">
               <div className="space-y-6 relative z-10">
                  <h2 className="text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tight">
                     Research <span className="text-secondary font-serif">Anywhere</span>
                  </h2>
                  <p className="text-white/60 text-lg font-medium max-w-xl leading-relaxed">
                     Our e-library platform allows you to browse, borrow, and read thousands of titles from the comfort of your home.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                     <button onClick={() => actions.go("/login/student")} className="flex items-center gap-3 px-8 py-4 bg-secondary text-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all">
                        <MousePointer2 size={18} /> Student Login
                     </button>
                     <button onClick={(e) => actions.details(e)} className="flex items-center gap-3 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-primary transition-all backdrop-blur-md">
                        <FileText size={18} /> E-Resources
                     </button>
                  </div>
               </div>
               <div className="relative z-10 hidden xl:block">
                   <div className="w-64 h-64 border-2 border-white/10 rounded-[3rem] p-8 flex items-center justify-center animate-bounce-slow">
                      <div className="w-full h-full bg-secondary/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center">
                         <Download size={64} className="text-secondary" />
                      </div>
                   </div>
               </div>
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <Globe size={400} />
               </div>
            </div>
         </div>
      </section>
    </main>
  );
}
