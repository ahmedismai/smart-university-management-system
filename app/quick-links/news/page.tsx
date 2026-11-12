"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Newspaper, 
  Search, 
  Calendar, 
  ArrowUpRight, 
  Megaphone,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const notices = [
  {
    id: 1,
    title: "Revised Mid-term Examination Schedule - Spring 2026",
    date: "April 20, 2026",
    category: "Academic",
    type: "Urgent",
    excerpt: "The mid-term examination schedule for all undergraduate courses has been revised due to unavoidable circumstances."
  },
  {
    id: 2,
    title: "University Holiday Notice: Eid-ul-Fitr 2026",
    date: "April 18, 2026",
    category: "Administrative",
    type: "General",
    excerpt: "The university offices and classes will remain closed from March 28 to April 5 on the occasion of Eid-ul-Fitr."
  },
  {
    id: 3,
    title: "Submission of Research Proposals for Internal Grant 2026",
    date: "April 15, 2026",
    category: "Research",
    type: "Update",
    excerpt: "The Office of Research Innovation (ORI) invites proposals for the 2026 Internal Research Grant cycle."
  },
  {
    id: 4,
    title: "Notice for 55th Convocation Registration Extension",
    date: "April 10, 2026",
    category: "Admission",
    type: "Update",
    excerpt: "Registration for the 55th Convocation has been extended until April 30, 2026, for all eligible graduates."
  }
];

const newsArticles = [
  {
    id: 1,
    title: "NextGen University Ranks #1 in Sustainable Research Hubs",
    date: "April 22, 2026",
    category: "Achievement",
    image: "/research-hero.png",
    excerpt: "We are proud to announce that our Sustainability Hub has been recognized as the leading research unit in the region."
  },
  {
    id: 2,
    title: "Inauguration of the New High-Performance Computing (HPC) Cluster",
    date: "April 15, 2026",
    category: "Technology",
    image: "/research-hero.png",
    excerpt: "The new HPC cluster at the Innovation Lab is now operational, providing 2.4 Petaflops of processing power for research."
  },
  {
    id: 3,
    title: "University Debate Team Wins National Championship 2026",
    date: "April 12, 2026",
    category: "Student Life",
    image: "/research-hero.png",
    excerpt: "Our debate team secured the championship title after a rigorous 3-day national tournament held in the capital."
  }
];

const categories = ["All", "Academic", "Administrative", "Research", "Events", "Achievement"];

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState("Notices");
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/research-hero.png"
          alt="University Dispatch"
          fill
          className="object-cover opacity-20 scale-105 animate-slow-zoom"
          priority
        />
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-secondary shadow-2xl"
          >
             <Megaphone size={16} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Official University Dispatch</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl lg:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter"
          >
             Notices & <br />
             <span className="text-secondary text-serif  ">News</span>
          </motion.h1>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-24 bg-white">
         <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-16">
               
               {/* Left Context - Filter & Sidebar */}
               <aside className="lg:w-1/4 space-y-12">
                  <div className="space-y-6">
                     <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
                        <input 
                           type="text" 
                           placeholder="Search dispatch..."
                           className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-transparent focus:bg-white focus:border-secondary/30 transition-all font-bold text-primary text-sm placeholder:text-primary/20"
                        />
                     </div>

                     <div className="space-y-2">
                        <p className="px-4 text-[10px] font-black text-primary/30 uppercase tracking-[0.2em]">Categories</p>
                        <div className="flex flex-wrap lg:flex-col gap-2">
                           {categories.map((cat) => (
                              <button 
                                 key={cat}
                                 onClick={() => setActiveCategory(cat)}
                                 className={cn(
                                    "px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-left transition-all",
                                    activeCategory === cat 
                                       ? "bg-primary text-secondary" 
                                       : "bg-surface text-primary/50 hover:bg-secondary/10 hover:text-primary"
                                 )}
                              >
                                 {cat}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="p-8 rounded-[3rem] bg-surface/50 border border-gray-50 space-y-6">
                     <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em]">Urgent Contact</p>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                              <Bell size={18} />
                           </div>
                           <div className="space-y-0.5">
                              <p className="text-[9px] font-black text-primary/30 uppercase tracking-widest">Office of Registrar</p>
                              <p className="text-sm font-bold text-primary">+880-1234-5678</p>
                           </div>
                        </div>
                     </div>
                     <button onClick={() => actions.inquiry("Emergency Protocals", { type: "contact", title: "Emergency Protocals", context: "Page: news" })} className="w-full py-4 border border-primary/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:border-secondary transition-all">
                        Emergency Protocals
                     </button>
                  </div>
               </aside>

               {/* Right Context - Feed */}
               <div className="lg:w-3/4 space-y-12">
                  {/* Feed Switcher */}
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                     {["Notices", "News Highlights"].map((tab) => (
                        <button 
                           key={tab}
                           onClick={() => setActiveTab(tab)}
                           className={cn(
                              "px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all relative",
                              activeTab === tab ? "text-primary" : "text-primary/20 hover:text-primary/40"
                           )}
                        >
                           {tab}
                           {activeTab === tab && (
                              <motion.div 
                                 layoutId="tabUnderline"
                                 className="absolute bottom-0 left-8 right-8 h-1 bg-secondary rounded-full"
                              />
                           )}
                        </button>
                     ))}
                  </div>

                  <AnimatePresence mode="wait">
                     {activeTab === "Notices" ? (
                        <motion.div 
                           key="notices-feed"
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -10 }}
                           className="space-y-6"
                        >
                           {notices.map((notice, i) => (
                              <div key={notice.id} className="group p-8 rounded-[2.5rem] bg-white border border-gray-100 hover:border-secondary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                       <div className="flex items-center gap-3">
                                          <span className={cn(
                                             "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                             notice.type === "Urgent" ? "bg-red-500/10 text-red-600" : "bg-primary/5 text-primary/40"
                                          )}>
                                             {notice.type}
                                          </span>
                                          <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{notice.category}</span>
                                       </div>
                                       <h3 className="text-xl lg:text-2xl font-black text-primary uppercase leading-tight group-hover:text-secondary transition-colors">
                                          {notice.title}
                                       </h3>
                                       <p className="text-sm font-medium text-text-main/50 leading-relaxed max-w-3xl">
                                          {notice.excerpt}
                                       </p>
                                    </div>
                                    <div className="flex flex-col md:items-end gap-6 md:min-w-[160px]">
                                       <div className="md:text-right space-y-1">
                                          <p className="text-[9px] font-black text-primary/20 uppercase tracking-widest flex items-center md:justify-end gap-2"><Calendar size={12} /> Date</p>
                                          <p className="text-sm font-bold text-primary">{notice.date}</p>
                                       </div>
                                       <button onClick={(e) => actions.details(e)} className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] group/btn">
                                          View Details <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </motion.div>
                     ) : (
                        <motion.div 
                           key="news-feed"
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -10 }}
                           className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                           {newsArticles.map((article, i) => (
                              <div key={article.id} className="group bg-surface rounded-[3rem] overflow-hidden border border-gray-50 hover:bg-white hover:border-secondary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                                 <div className="relative aspect-[16/9] overflow-hidden bg-primary/10">
                                    <Image src={article.image} alt={article.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur rounded-full text-[9px] font-black uppercase tracking-widest text-primary shadow-lg border border-white">
                                       {article.category}
                                    </div>
                                 </div>
                                 <div className="p-8 lg:p-10 space-y-6">
                                    <div className="space-y-4">
                                       <div className="flex items-center gap-2 text-[9px] font-black text-primary/30 uppercase tracking-widest">
                                          <Clock size={12} /> {article.date}
                                       </div>
                                       <h3 className="text-xl lg:text-2xl font-black text-primary uppercase leading-tight group-hover:text-secondary transition-colors">
                                          {article.title}
                                       </h3>
                                       <p className="text-xs font-medium text-text-main/50 leading-relaxed">
                                          {article.excerpt}
                                       </p>
                                    </div>
                                    <div className="pt-6 border-t border-primary/5 flex justify-between items-center">
                                       <span className="text-[9px] font-black text-primary/10 uppercase tracking-widest">Press Release</span>
                                       <button onClick={(e) => actions.details(e)} className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white shadow-sm transition-all">
                                          <ArrowUpRight size={18} />
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>
         </div>
      </section>

      {/* Subscription CTA */}
      <section className="py-24 bg-surface">
         <div className="container mx-auto px-4 max-w-6xl">
            <div className="relative p-12 lg:p-24 rounded-[4rem] bg-primary text-white overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center gap-20">
               <div className="space-y-6 relative z-10 lg:w-1/2">
                  <h3 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-tight">
                     University <br /><span className="text-secondary font-serif underline decoration-4 underline-offset-[12px]">Quarterly</span>
                  </h3>
                  <p className="text-white/60 text-lg font-medium leading-relaxed">
                     Subscribe to our seasonal newsletter to receive the best of our research breakthroughs, student achievements, and campus updates directly in your inbox.
                  </p>
               </div>
               
               <div className="lg:w-1/2 w-full relative z-10 space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                     <input 
                        type="email" 
                        placeholder="your@email.edu" 
                        className="flex-1 px-8 py-5 rounded-2xl bg-white/5 border border-white/20 text-white placeholder:text-white/20 font-bold focus:bg-white/10 transition-all outline-none"
                     />
                     <button onClick={() => actions.inquiry("Newsletter subscription", { type: "subscribe", title: "Subscribe to updates", description: "Get the latest news and notices from the university." })} className="px-10 py-5 bg-secondary text-primary rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                        Subscribe
                     </button>
                  </div>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] text-center lg:text-left">No spam. Only institutional excellence.</p>
               </div>

               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none grayscale">
                  <Newspaper size={400} />
               </div>
            </div>
         </div>
      </section>
    </main>
  );
}
