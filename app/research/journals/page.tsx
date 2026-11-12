"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Search, 
  ArrowUpRight, 
  BarChart3, 
  ShieldCheck, 
  Users, 
  BookMarked,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";

const journals = [
  {
    id: 1,
    title: "NextGen Journal of Advanced Science & Technology",
    acronym: "NJAST",
    category: "Science & Technology",
    indexing: ["Scopus", "Web of Science", "DOAJ"],
    impactFactor: "4.2",
    description: "Our flagship publication focusing on breakthroughs in AI, Nanotechnology, and Biomedical Engineering.",
    image: "/journal-tech.png",
    color: "bg-blue-600/10 text-blue-600",
    frequency: "Quarterly"
  },
  {
    id: 2,
    title: "University Review of Humanities & Social Sciences",
    acronym: "URHSS",
    category: "Humanities",
    indexing: ["ERIC", "ProQuest", "EBSCO"],
    impactFactor: "2.8",
    description: "Multidisciplinary research in global policy, historical studies, and contemporary social structures.",
    image: "/journal-humanities.png",
    color: "bg-amber-600/10 text-amber-600",
    frequency: "Bi-Annual"
  },
  {
    id: 3,
    title: "Progress in Environmental & Sustainable Studies",
    acronym: "PESS",
    category: "Sustainability",
    indexing: ["Scopus", "Geobase", "Cabell's"],
    impactFactor: "5.1",
    description: "Focusing on climate resilient urbanism, circular economies, and renewable material science.",
    image: "/journal-nature.png",
    color: "bg-emerald-600/10 text-emerald-600",
    frequency: "Quarterly"
  },
  {
    id: 4,
    title: "International Journal of Business & Global Governance",
    acronym: "IJBG",
    category: "Business & Law",
    indexing: ["ABDC", "Social Science Edition", "JCR"],
    impactFactor: "3.5",
    description: "Exploring global trade policies, micro-economic resilience, and corporate governance in digital age.",
    image: "/journal-business.png",
    color: "bg-indigo-600/10 text-indigo-600",
    frequency: "Quarterly"
  }
];

const categories = ["All Journals", "Science & Technology", "Humanities", "Sustainability", "Business & Law"];

export default function JournalsPage() {
  const [activeCategory, setActiveCategory] = useState("All Journals");

  const filteredItems = activeCategory === "All Journals" 
    ? journals 
    : journals.filter(item => item.category === activeCategory);

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/journals-hero.png"
          alt="Modern Academic Archive"
          fill
          className="object-cover opacity-30 scale-105 animate-slow-zoom"
          priority
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-secondary shadow-2xl"
            >
               <BookMarked size={16} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scientific Excellence</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter"
            >
               University <br />
               <span className="text-secondary">Journals</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-white/70 max-w-2xl mx-auto font-medium leading-relaxed"
            >
               Disseminating world-class research through our prestigious network of peer-reviewed journals. High-impact works, indexed globally.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="-mt-16 relative z-30">
         <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-[3rem] p-6 lg:p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100">
               <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 relative">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30" size={24} />
                     <input 
                        type="text" 
                        placeholder="Search Journals by Name, ISSN, or Scope..."
                        className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-surface border border-transparent focus:bg-white focus:border-secondary/30 focus:ring-4 focus:ring-secondary/10 transition-all font-bold text-primary placeholder:text-primary/20"
                     />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                     {categories.map((cat) => (
                        <button 
                           key={cat}
                           onClick={() => setActiveCategory(cat)}
                           className={cn(
                              "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
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

      {/* Flagship Journals */}
      <section className="py-32 bg-white">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-end justify-between mb-20 px-4 gap-6">
               <div className="space-y-4">
                  <div className="h-1.5 w-24 bg-secondary rounded-full" />
                  <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-tight tracking-tighter">
                     Flagship <span className="text-secondary font-serif">Publications</span>
                  </h2>
               </div>
               <p className="max-w-md text-text-main/50 font-bold uppercase tracking-widest text-[11px] lg:text-right">
                  Highlighting our highest impact centers of knowledge and scientific discourse.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {filteredItems.map((journal, i) => (
                  <motion.div
                     key={journal.id}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: i * 0.1 }}
                     viewport={{ once: true }}
                     className="group bg-surface rounded-[4rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                  >
                     <div className="flex flex-col lg:flex-row min-h-[400px]">
                        <div className="lg:w-[45%] relative bg-white p-12 flex items-center justify-center">
                           <motion.div 
                              whileHover={{ scale: 1.05, rotate: -2 }}
                              className="relative w-full aspect-[3/4] shadow-2xl rounded-lg overflow-hidden border-8 border-white"
                           >
                              <Image 
                                 src={journal.image} 
                                 alt={journal.title} 
                                 fill 
                                 className="object-cover"
                              />
                           </motion.div>
                           <div className="absolute top-8 left-8 flex flex-col gap-2">
                              <span className="bg-secondary text-primary px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Flagship Issue</span>
                              <div className="p-3 bg-white/90 backdrop-blur rounded-2xl border border-gray-100 shadow-xl text-center">
                                 <div className="text-xl font-black text-primary">{journal.impactFactor}</div>
                                 <div className="text-[7px] font-black text-primary/30 uppercase tracking-widest">Impact Factor</div>
                              </div>
                           </div>
                        </div>
                        <div className="lg:w-[55%] p-10 flex flex-col justify-between">
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <div className={cn("inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest", journal.color)}>
                                    {journal.acronym} — {journal.frequency}
                                 </div>
                                 <h3 className="text-2xl lg:text-3xl font-black text-primary uppercase leading-tight group-hover:text-secondary transition-colors">
                                    {journal.title}
                                 </h3>
                              </div>
                              <p className="text-sm font-medium text-text-main/60 leading-relaxed">
                                 {journal.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                 {journal.indexing.map(idx => (
                                    <span key={idx} className="px-2 py-1 bg-white rounded-lg text-[9px] font-black text-primary/40 border border-gray-50">{idx}</span>
                                 ))}
                              </div>
                           </div>
                           
                           <div className="pt-8 mt-8 border-t border-primary/5 grid grid-cols-2 gap-4">
                              <button onClick={(e) => actions.details(e)} className="py-4 bg-primary text-secondary rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all">
                                 Current Issue
                              </button>
                              <button onClick={() => actions.inquiry("Submission", { type: "contact", title: "Submission", context: "Page: journals" })} className="py-4 bg-white text-primary border border-gray-100 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-secondary transition-all">
                                 Submission
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Indexing Section */}
      <section className="py-32 bg-surface">
         <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto bg-primary rounded-[4rem] p-12 lg:p-24 text-white flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
               <div className="space-y-8 relative z-10 lg:w-1/2">
                  <div className="space-y-4">
                     <h2 className="text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tighter">
                        Global <br /> <span className="text-secondary underline decoration-4 underline-offset-8">Indexing</span>
                     </h2>
                     <p className="text-white/60 text-lg font-medium leading-relaxed">
                        Our journals are recognized and indexed by leading global academic databases, ensuring maximum visibility and impact for your research.
                     </p>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                     {[
                        { label: "Indexing Partners", value: "45+" },
                        { label: "Annual Submissions", value: "12k+" },
                        { label: "Global Citations", value: "850k" },
                        { label: "Editor Network", value: "2.4k" }
                     ].map((stat) => (
                        <div key={stat.label} className="space-y-1">
                           <div className="text-3xl font-black text-secondary">{stat.value}</div>
                           <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="lg:w-1/2 grid grid-cols-2 gap-4 relative z-10">
                  {["Scopus", "Web of Science", "PubMed", "JCR", "SJR", "Scholar"].map((partner) => (
                     <div key={partner} className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <span className="text-xl font-black text-white/40 uppercase tracking-widest grayscale opacity-50">{partner}</span>
                     </div>
                  ))}
               </div>

               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <Globe size={400} />
               </div>
            </div>
         </div>
      </section>

      {/* Editorial Standards */}
      <section className="py-32 bg-white">
         <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
               <div className="relative">
                  <div className="absolute -inset-10 bg-secondary/10 blur-[100px] rounded-full animate-pulse px-0" />
                  <div className="relative rounded-[4rem] overflow-hidden shadow-2xl aspect-[4/5]">
                     <Image src="/journals-hero.png" alt="Editorial Process" fill className="object-cover" />
                  </div>
               </div>

               <div className="space-y-12">
                  <div className="space-y-6">
                     <h2 className="text-4xl lg:text-6xl font-black text-primary uppercase leading-[0.9] tracking-tighter">
                        World Class <br /> <span className="text-secondary">Editorial</span> Standards
                     </h2>
                     <p className="text-xl text-text-main/60 font-medium leading-relaxed">
                        Every submission undergoes a rigorous double-blind peer-review process, managed by international experts in their respective fields.
                     </p>
                  </div>

                  <div className="space-y-6">
                     {[
                        { icon: ShieldCheck, title: "Rigorous Peer Review", desc: "Two rounds of blind assessment for every paper." },
                        { icon: BarChart3, title: "Plagiarism Controls", desc: "State-of-the-art verification on all submissions." },
                        { icon: Users, title: "International Board", desc: "Editors representing 35+ countries worldwide." }
                     ].map((item) => (
                        <div key={item.title} className="flex gap-6 p-6 rounded-3xl bg-surface border border-gray-50 hover:border-secondary/20 transition-all group">
                           <div className="shrink-0 w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all">
                              <item.icon size={24} />
                           </div>
                           <div className="space-y-1">
                              <h4 className="font-black text-primary uppercase text-sm tracking-tight">{item.title}</h4>
                              <p className="text-xs font-bold text-text-main/40 uppercase leading-snug">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <button onClick={() => actions.inquiry("Call for reviewers", { type: "contact", title: "Call for reviewers", context: "Page: journals" })} className="flex items-center gap-4 text-[11px] font-black text-primary uppercase tracking-[0.4em] group">
                     Call for reviewers <ArrowUpRight className="text-secondary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-surface text-center">
         <div className="container mx-auto px-4 max-w-4xl space-y-12">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-secondary font-black text-[10px] uppercase tracking-widest shadow-sm">
                  <Award size={14} /> Scholarly Recognition
               </div>
               <h3 className="text-3xl lg:text-5xl font-black text-primary uppercase tracking-tighter">Publish Your <span className="text-secondary">Legacy</span></h3>
               <p className="text-text-main/60 font-medium text-lg max-w-2xl mx-auto">Join thousands of globally recognized researchers by submitting your manuscript to our prestigious journal network today.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
               <button onClick={() => actions.inquiry("Submit Manuscript", { type: "contact", title: "Submit Manuscript", context: "Page: journals" })} className="px-12 py-5 bg-primary text-secondary rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  Submit Manuscript
               </button>
               <button onClick={() => actions.print()} className="px-12 py-5 bg-white text-primary border border-gray-100 rounded-2xl font-black uppercase text-sm tracking-widest hover:border-secondary transition-all shadow-xl shadow-primary/5">
                  General Guidelines
               </button>
            </div>
         </div>
      </section>
    </main>
  );
}
