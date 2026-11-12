"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Download, 
  ArrowRight, 
  Info,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

const tenders = [
  {
    id: "TND/2026/001",
    title: "Procurement of High-Performance Computing (HPC) Clusters",
    publishedDate: "15 Apr 2026",
    closingDate: "10 May 2026",
    category: "Equipment",
    status: "Active",
    department: "ICT Division"
  },
  {
    id: "TND/2026/002",
    title: "Construction of Multi-Story Student Hostel (Phase II)",
    publishedDate: "18 Apr 2026",
    closingDate: "25 May 2026",
    category: "Construction",
    status: "Active",
    department: "Engineering Office"
  },
  {
    id: "TND/2026/003",
    title: "Annual Maintenance Contract for Lab Instruments",
    publishedDate: "20 Apr 2026",
    closingDate: "05 May 2026",
    category: "Maintenance",
    status: "Active",
    department: "Procurement Section"
  },
  {
    id: "TND/2026/004",
    title: "Supply of Solar Power Grid for Library Complex",
    publishedDate: "10 Apr 2026",
    closingDate: "30 Apr 2026",
    category: "Energy",
    status: "Closing Soon",
    department: "Sustainability Cell"
  },
  {
    id: "TND/2026/005",
    title: "Licensed Software Subscription Renewal (Creative Cloud)",
    publishedDate: "22 Apr 2026",
    closingDate: "15 May 2026",
    category: "Software",
    status: "Active",
    department: "ICT Division"
  }
];

const categories = ["All", "Equipment", "Construction", "Maintenance", "Software"];

export default function TendersPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTenders = activeCategory === "All" 
    ? tenders 
    : tenders.filter(t => t.category === activeCategory);

  return (
    <main className="min-h-screen bg-white text-primary">
      {/* Super Minimal Hero */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 border-b border-gray-100 bg-white overflow-hidden">
        {/* Background Image with refined overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/governance-hero.png" 
            alt="Governance Background"
            fill
            className="object-cover opacity-[0.07] grayscale"
            priority
            sizes="100vw"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-4">
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-secondary font-bold text-xs uppercase tracking-widest"
             >
               Procurement & Tenders
             </motion.div>
             <motion.h1
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-4xl md:text-6xl font-bold tracking-tight"
             >
               Transparent bidding for a <br className="hidden md:block" />
               <span className="text-secondary font-serif">connected</span> campus.
             </motion.h1>
          </div>
        </div>
      </section>

      {/* Tender List - More like a clean table/list */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Minimal Filter & Search Overlay */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-wrap gap-2">
                 {categories.map((cat) => (
                    <button 
                       key={cat}
                       onClick={() => setActiveCategory(cat)}
                       className={cn(
                          "px-5 py-2 text-xs font-bold transition-all",
                          activeCategory === cat ? "text-primary border-b-2 border-secondary" : "text-primary/30 hover:text-primary"
                       )}
                    >
                       {cat}
                    </button>
                 ))}
              </div>
              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
                 <input 
                    type="text" 
                    placeholder="Search by ID or title..."
                    className="pl-10 pr-4 py-2 bg-gray-50 border-gray-100 border rounded-lg text-sm font-medium w-full md:w-64 focus:bg-white focus:ring-2 focus:ring-secondary/10 transition-all"
                 />
              </div>
            </div>

            {/* List */}
            <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
               <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 hidden md:grid grid-cols-12 text-[10px] font-black uppercase tracking-widest text-primary/30">
                  <div className="col-span-2">Tender ID</div>
                  <div className="col-span-5">Project Title</div>
                  <div className="col-span-2">Department</div>
                  <div className="col-span-2">Closing Date</div>
                  <div className="col-span-1 text-right">Status</div>
               </div>

               <div className="divide-y divide-gray-50">
                  <AnimatePresence mode="popLayout">
                     {filteredTenders.map((tender, i) => (
                        <motion.div
                           key={tender.id}
                           layout
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ delay: i * 0.05 }}
                           className="group px-8 py-6 md:grid md:grid-cols-12 gap-4 items-center hover:bg-gray-50/50 transition-all cursor-pointer"
                        >
                           <div className="col-span-2 text-xs font-bold text-primary/40 mb-2 md:mb-0">{tender.id}</div>
                           <div className="col-span-5 space-y-1">
                              <h3 className="text-sm md:text-base font-bold tracking-tight group-hover:text-secondary transition-colors line-clamp-1">{tender.title}</h3>
                              <p className="text-[10px] font-bold text-primary/20 uppercase tracking-widest md:hidden">{tender.department}</p>
                           </div>
                           <div className="col-span-2 text-xs font-medium text-primary/50 hidden md:block">{tender.department}</div>
                           <div className="col-span-2 flex items-center gap-2 mt-4 md:mt-0">
                              <Calendar size={14} className="text-primary/20" />
                              <span className="text-xs font-bold text-primary/70">{tender.closingDate}</span>
                           </div>
                           <div className="col-span-1 text-right hidden md:block">
                              <div className={cn(
                                 "w-2.5 h-2.5 rounded-full inline-block",
                                 tender.status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400'
                              )} />
                           </div>
                           
                           {/* Mobile CTA */}
                           <div className="flex items-center justify-between mt-6 md:hidden">
                              <div className={cn(
                                 "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                 tender.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                              )}>
                                 {tender.status}
                              </div>
                              <button onClick={(e) => actions.details(e)} className="text-secondary text-xs font-bold flex items-center gap-1">Details <ArrowRight size={14}/></button>
                           </div>
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer Info */}
      <section className="py-20 bg-gray-50">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100">
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest"><Info size={14} /> Submission Guidelines</div>
                  <h4 className="text-xl font-bold tracking-tight">Need assistance with bidding?</h4>
                  <p className="text-primary/40 text-sm font-medium">Download our vendor manual for detailed instructions on the process.</p>
               </div>
               <button onClick={() => actions.print()} className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:translate-y-[-2px] transition-all shadow-lg shadow-primary/5">
                  <Download size={18} /> Vendor Manual
               </button>
            </div>
         </div>
      </section>
    </main>
  );
}
