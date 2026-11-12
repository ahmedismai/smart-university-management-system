"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  FileText, 
  Download, 
  Quote, 
  ExternalLink, 
  Calendar, 
  User, 
  Bookmark,
  ChevronRight,
  BookOpen,
  ArrowUpRight,
  Award,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

const publications = [
  {
    id: 1,
    title: "Neuro-Cognitive Architectures for Autonomous Decision Making in Robotics",
    authors: "Sarah Mitchell, Ahmed Karim, et al.",
    journal: "Journal of Artificial Intelligence Research",
    year: "2026",
    doi: "10.1234/jair.2026.4523",
    category: "Science & Technology",
    image: "/journal-tech.png",
    citations: 124,
    featured: true
  },
  {
    id: 2,
    title: "Sustainable Urban Frameworks: A Study of Climate-Resilient Infrastructure in South Asia",
    authors: "Elena Rossi, David Chen",
    journal: "Global Environmental Change",
    year: "2026",
    doi: "10.1234/gec.2026.8812",
    category: "Sustainability",
    image: "/journal-nature.png",
    citations: 89,
    featured: true
  },
  {
    id: 3,
    title: "The Digital Renaissance: Reshaping Cultural Heritage in the Age of Metamaterials",
    authors: "Julian Thorne, Marcus Vane",
    journal: "Humanities & Social Sciences Review",
    year: "2025",
    doi: "10.1234/hssr.2025.1102",
    category: "Humanities",
    image: "/journal-humanities.png",
    citations: 56,
    featured: false
  },
  {
    id: 4,
    title: "Macro-Economic Resilience in Post-Digital Developing Economies",
    authors: "Linda Park, Kevin Stewart",
    journal: "Journal of Economic Perspectives",
    year: "2025",
    doi: "10.1234/jep.2025.7761",
    category: "Business & Economics",
    image: "/journal-business.png",
    citations: 210,
    featured: false
  },
  {
    id: 5,
    title: "Quantum Cryptographic Protocols for Decentralized Financial Networks",
    authors: "James Wilson, Robert Frost",
    journal: "Physical Review Letters",
    year: "2026",
    doi: "10.1234/prl.2026.3341",
    category: "Science & Technology",
    image: "/journal-tech.png",
    citations: 45,
    featured: false
  }
];

const categories = ["All Domains", "Science & Technology", "Sustainability", "Humanities", "Business & Economics", "Medical Sciences"];
const years = ["2026", "2025", "2024", "2023", "Archive"];

export default function PublicationsPage() {
  const [activeCategory, setActiveCategory] = useState("All Domains");

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/publications-hero.png"
          alt="Academic Knowledge Background"
          fill
          className="object-cover opacity-20 scale-105 animate-slow-zoom"
          priority
        />
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-secondary"
          >
             <FileText size={16} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Knowledge Archive</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tighter"
          >
             Academic <br />
             <span className="text-secondary">Publications</span>
          </motion.h1>
          
          <div className="max-w-2xl mx-auto space-y-6 pt-2">
            <p className="text-white/60 font-medium leading-relaxed">
               Exploring the boundaries of human knowledge. Access our full repository of peer-reviewed journals, books, and conference papers.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Search & Search Interface */}
      <section className="-mt-16 relative z-30">
         <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-[3rem] p-6 lg:p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100">
               <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 relative">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30" size={24} />
                     <input 
                        type="text" 
                        placeholder="Search by Title, Author, or Keyword..."
                        className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-surface border border-transparent focus:bg-white focus:border-secondary/30 focus:ring-4 focus:ring-secondary/10 transition-all font-bold text-primary placeholder:text-primary/20"
                     />
                  </div>
                  <div className="flex gap-4">
                     <button onClick={() => actions.filter("Search this page")} className="flex items-center gap-3 px-8 py-5 bg-primary text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/10 group">
                        Find Research <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                     </button>
                  </div>
               </div>

               {/* quick filters */}
               <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-primary/30 mr-2">
                     <Filter size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Filter By:</span>
                  </div>
                  {categories.map((cat) => (
                     <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                           "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border",
                           activeCategory === cat 
                              ? "bg-secondary text-primary border-secondary shadow-lg shadow-secondary/20" 
                              : "bg-white text-primary/40 border-gray-100 hover:border-secondary/30 hover:text-primary"
                        )}
                     >
                        {cat}
                     </button>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Featured Publications Grid */}
      <section className="py-32 bg-white">
         <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-16 px-4">
               <div className="space-y-4">
                  <div className="h-1.5 w-20 bg-secondary rounded-full" />
                  <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-none tracking-tighter">
                     Featured <span className="text-secondary">Impact</span>
                  </h2>
               </div>
               <p className="hidden lg:block text-text-main/50 font-bold max-w-xs text-right">
                  High-citation works and award-winning research papers from our global directory.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {publications.filter(p => p.featured).map((pub, i) => (
                  <motion.div
                     key={pub.id}
                     initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     className="group relative bg-surface rounded-[4rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-700"
                  >
                     <div className="flex flex-col lg:flex-row min-h-[400px]">
                        <div className="lg:w-2/5 relative overflow-hidden bg-white p-12 flex items-center justify-center">
                           <motion.div 
                              whileHover={{ scale: 1.05, rotate: -2 }}
                              className="relative w-full aspect-[3/4] shadow-2xl rounded-lg overflow-hidden border-8 border-white"
                           >
                              <Image 
                                 src={pub.image} 
                                 alt={pub.title} 
                                 fill 
                                 className="object-cover"
                              />
                           </motion.div>
                           <div className="absolute top-6 left-6 flex gap-2">
                              <span className="bg-secondary text-primary px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">Featured</span>
                           </div>
                        </div>
                        <div className="lg:w-3/5 p-10 flex flex-col justify-between space-y-8">
                           <div className="space-y-4">
                              <div className="flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-widest">
                                 <Calendar size={12} /> {pub.year} • {pub.category}
                              </div>
                              <h3 className="text-2xl lg:text-3xl font-black text-primary uppercase leading-tight group-hover:text-secondary transition-colors">
                                 {pub.title}
                              </h3>
                              <div className="flex items-center gap-2 text-text-main/50 text-sm font-medium">
                                 <User size={14} className="text-secondary" /> {pub.authors}
                              </div>
                           </div>

                           <p className="text-[10px] font-black text-primary/20 uppercase tracking-widest   truncate">
                              DOI: {pub.doi}
                           </p>

                           <div className="flex items-center gap-4 pt-4 border-t border-primary/5">
                              <button onClick={() => actions.print()} className="flex-1 py-4 bg-primary text-secondary rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-secondary hover:text-primary transition-all">
                                 Full Paper
                              </button>
                              <button onClick={() => actions.print()} className="p-4 bg-white text-secondary rounded-2xl border border-gray-100 hover:border-secondary transition-all">
                                 <Download size={18} />
                              </button>
                              <button onClick={(e) => actions.details(e)} className="p-4 bg-white text-secondary rounded-2xl border border-gray-100 hover:border-secondary transition-all">
                                 <Quote size={18} />
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Main Publication List */}
      <section className="py-32 bg-surface">
         <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center justify-between mb-12 px-6">
               <h2 className="text-3xl font-black text-primary uppercase tracking-tighter">Recent <span className="text-secondary">Release</span></h2>
               <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-primary/30 uppercase tracking-[0.2em]">Sort By:</span>
                  <select className="bg-transparent border-none font-black text-primary uppercase text-xs focus:ring-0 cursor-pointer">
                     <option>Newest First</option>
                     <option>Most Cited</option>
                     <option>A-Z List</option>
                  </select>
               </div>
            </div>

            <div className="space-y-4">
               {publications.map((pub, i) => (
                  <motion.div
                     key={pub.id}
                     initial={{ opacity: 0, y: 15 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-secondary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group"
                  >
                     <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                        <div className="flex gap-8 flex-1">
                           <div className="hidden sm:block shrink-0 w-20 h-24 bg-surface rounded-xl overflow-hidden relative shadow-md">
                              <Image src={pub.image} alt="Journal" fill className="object-cover" />
                           </div>
                           <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                 <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{pub.year}</span>
                                 <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                 <span className="text-[10px] font-black text-primary/30 uppercase tracking-widest">{pub.category}</span>
                              </div>
                              <h4 className="text-xl font-black text-primary uppercase leading-tight group-hover:text-secondary transition-colors line-clamp-1">
                                 {pub.title}
                              </h4>
                              <p className="text-sm font-bold text-text-main/40 line-clamp-1">
                                 {pub.authors} — <span className="text-primary/20  ">{pub.journal}</span>
                              </p>
                           </div>
                        </div>

                        <div className="flex items-center gap-4 lg:pl-10 lg:border-l border-gray-50">
                           <div className="text-center px-6">
                              <div className="text-2xl font-black text-primary">{pub.citations}</div>
                              <p className="text-[8px] font-black text-primary/20 uppercase tracking-widest">Citations</p>
                           </div>
                           <button onClick={() => actions.print()} className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-text-main hover:bg-secondary hover:border-secondary hover:text-primary transition-all">
                              <Download size={18} />
                           </button>
                           <button onClick={(e) => actions.details(e)} className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-text-main hover:bg-secondary hover:border-secondary hover:text-primary transition-all">
                              <ExternalLink size={18} />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Metrics Section */}
      <section className="py-24 bg-white relative overflow-hidden">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12 bg-primary rounded-[4rem] p-12 lg:p-20 text-white relative">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="lg:w-1/3 relative"
               >
                  <div className="w-64 h-64 border-[16px] border-white/5 rounded-full flex items-center justify-center relative">
                     <div className="text-center space-y-1">
                        <div className="text-6xl font-black text-secondary">A+</div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Global Ranking</p>
                     </div>
                     <Award className="absolute -top-4 -right-4 text-secondary" size={64} />
                  </div>
               </motion.div>

               <div className="lg:w-2/3 grid grid-cols-2 lg:grid-cols-3 gap-12">
                  {[
                     { label: "Citations (Last 3 Years)", value: "24.5k" },
                     { label: "Scopus Indexed Docs", value: "8.2k" },
                     { label: "International Journals", value: "450+" },
                     { label: "Authored Books", value: "120" },
                     { label: "Research Awards", value: "15" },
                     { label: "Global Repositories", value: "18" }
                  ].map((metric) => (
                     <div key={metric.label} className="space-y-2">
                        <div className="text-3xl font-black text-white">{metric.value}</div>
                        <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] leading-tight">{metric.label}</div>
                     </div>
                  ))}
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
