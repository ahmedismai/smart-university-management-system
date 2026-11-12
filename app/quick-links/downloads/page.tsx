"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Search, 
  Download, 
  Clock, 
  ChevronRight,
  Info,
  HelpCircle,
  FileBadge
} from "lucide-react";
import { cn } from "@/lib/utils";

const documents = [
  {
    id: 1,
    title: "Undergraduate Admission Form 2025-26",
    category: "Admission",
    format: "PDF",
    size: "1.2 MB",
    updated: "Jan 12, 2025",
    description: "Official admission form for all undergraduate programs for the upcoming academic session."
  },
  {
    id: 2,
    title: "Semester Withdrawal Request Form",
    category: "Students",
    format: "DOCX",
    size: "450 KB",
    updated: "Nov 05, 2024",
    description: "Required for students wishing to take a temporary break or withdraw from a semester."
  },
  {
    id: 3,
    title: "Faculty Research Grant Application",
    category: "Research",
    format: "PDF",
    size: "2.8 MB",
    updated: "Feb 01, 2025",
    description: "Guidelines and application form for the University Internal Research Fund (UIRF)."
  },
  {
    id: 4,
    title: "Medical Insurance Claim Form",
    category: "Students",
    format: "PDF",
    size: "980 KB",
    updated: "Dec 15, 2024",
    description: "Official form for processing student health insurance claims under the university policy."
  },
  {
    id: 5,
    title: "Staff Annual Leave Application",
    category: "Faculty",
    format: "XLSX",
    size: "320 KB",
    updated: "Jan 05, 2025",
    description: "Electronic leave tracking form for administrative and academic staff."
  },
  {
    id: 6,
    title: "Ethics Committee Clearance Form",
    category: "Research",
    format: "PDF",
    size: "1.5 MB",
    updated: "Mar 10, 2025",
    description: "Mandatory clearance form for all research involving human or animal subjects."
  }
];

const categories = ["All Resources", "Students", "Faculty", "Admission", "Research"];

export default function DownloadsPage() {
  const [activeCategory, setActiveCategory] = useState("All Resources");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = activeCategory === "All Resources" || doc.category === activeCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/journals-hero.png"
          alt="Forms & Documents"
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
             <FileBadge size={16} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Repository</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl lg:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter"
          >
             Forms & <br />
             <span className="text-secondary">Downloads</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-white/70 max-w-2xl mx-auto font-medium leading-relaxed"
          >
             Your central access point for official university forms, guidelines, and administrative documents. Filter and search for quick access.
          </motion.p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="-mt-16 relative z-30">
         <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-[3rem] p-6 lg:p-10 shadow-[0_48px_100px_-20px_rgba(0,0,0,0.12)] border border-gray-100">
               <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 relative">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30" size={24} />
                     <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for forms, tags, or document codes..."
                        className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-surface border border-transparent focus:bg-white focus:border-secondary/30 focus:ring-4 focus:ring-secondary/10 transition-all font-bold text-primary placeholder:text-primary/20"
                     />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                     {categories.map((cat) => (
                        <button 
                           key={cat}
                           onClick={() => setActiveCategory(cat)}
                           className={cn(
                              "px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border",
                              activeCategory === cat 
                                 ? "bg-secondary text-primary border-secondary shadow-lg shadow-secondary/20" 
                                 : "bg-surface text-primary/40 border-transparent hover:border-secondary/30 hover:text-primary"
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

      {/* Document Directory */}
      <section className="py-24 bg-white">
         <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <AnimatePresence mode="popLayout">
                  {filteredDocs.map((doc, i) => (
                     <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: i * 0.05 }}
                        className="group bg-surface rounded-[3rem] p-8 lg:p-10 border border-transparent hover:bg-white hover:border-secondary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                     >
                        <div className="flex items-start gap-8">
                           <div className="w-16 h-16 shrink-0 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                              <FileText size={32} />
                           </div>
                           <div className="flex-1 space-y-4">
                              <div className="flex items-center justify-between">
                                 <span className="px-3 py-1 bg-primary/5 text-primary/40 rounded-full text-[9px] font-bold uppercase tracking-widest">{doc.category}</span>
                                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary/20">
                                    <Clock size={12} /> Updated: {doc.updated}
                                 </div>
                              </div>
                              <h3 className="text-xl lg:text-2xl font-black text-primary uppercase leading-tight group-hover:text-secondary transition-colors">
                                 {doc.title}
                              </h3>
                              <p className="text-sm font-medium text-text-main/50 leading-relaxed">
                                 {doc.description}
                              </p>
                              
                              <div className="pt-6 mt-6 border-t border-primary/5 flex items-center justify-between">
                                 <div className="flex gap-4">
                                    <div className="space-y-0.5">
                                       <p className="text-[8px] font-black text-primary/20 uppercase tracking-widest">Format</p>
                                       <p className="text-xs font-bold text-primary">{doc.format}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                       <p className="text-[8px] font-black text-primary/20 uppercase tracking-widest">Size</p>
                                       <p className="text-xs font-bold text-primary">{doc.size}</p>
                                    </div>
                                 </div>
                                 <button onClick={() => actions.print()} className="flex items-center gap-2 px-6 py-3 bg-primary text-secondary rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-secondary hover:text-primary transition-all">
                                    Download <Download size={14} />
                                 </button>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>

               {filteredDocs.length === 0 && (
                  <div className="col-span-full py-32 text-center space-y-6">
                     <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto text-primary/10">
                        <Search size={48} />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-2xl font-black text-primary uppercase">No forms found</h3>
                        <p className="text-text-main/50 font-medium tracking-wide">Refine your search or browse by category.</p>
                     </div>
                     <button 
                        onClick={() => {setActiveCategory("All Resources"); setSearchQuery("");}}
                        className="text-secondary font-black uppercase text-xs tracking-widest hover:underline"
                     >
                        Clear all filters
                     </button>
                  </div>
               )}
            </div>
         </div>
      </section>

      {/* Manual Request Section */}
      <section className="py-32 bg-surface">
         <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-12">
                  <div className="space-y-6">
                     <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-[0.9] tracking-tighter">
                        Can't find <br /> what you're <span className="text-secondary">looking for?</span>
                     </h2>
                     <p className="text-xl text-text-main/60 font-medium leading-relaxed">
                        Some specialized documents like official transcripts, gap certificates, and degree verification require a manual request process.
                     </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                     {[
                        { title: "Transcript Request", desc: "Contact the Controller's Office." },
                        { title: "Verification", desc: "Formal degree authenticity check." },
                        { title: "Lost ID Card", desc: "Security clearance & reissue form." },
                        { title: "Special Permits", desc: "Parking & specialized lab access." }
                     ].map((item, i) => (
                        <div key={item.title} className="p-8 bg-white rounded-[2rem] border border-gray-100 flex flex-col justify-between group">
                           <div className="space-y-2">
                              <h4 className="font-black text-primary uppercase text-sm tracking-tight">{item.title}</h4>
                              <p className="text-xs font-bold text-text-main/40 uppercase leading-snug">{item.desc}</p>
                           </div>
                           <button onClick={() => actions.print()} className="mt-6 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-secondary group-hover:translate-x-1 transition-transform">
                              Detailed Guide <ChevronRight size={14} />
                           </button>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="relative">
                  <div className="absolute inset-0 bg-secondary/5 blur-[120px] rounded-full animate-pulse" />
                  <div className="relative bg-primary rounded-[4rem] p-12 lg:p-20 text-white shadow-2xl overflow-hidden">
                     <div className="space-y-10 relative z-10">
                        <div className="space-y-4">
                           <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-secondary font-black text-[10px] uppercase tracking-widest">
                              <Info size={14} /> Submission Guidelines
                           </div>
                           <h3 className="text-3xl font-black uppercase tracking-tight">Important <span className="text-secondary">Notices</span></h3>
                        </div>

                        <div className="space-y-6">
                           {[
                              { label: "Original Papers", text: "Physical submission may be required following the digital copy." },
                              { label: "Processing Time", text: "Standard forms take 3-5 working days for official approval." },
                              { label: "Verify Format", text: "Ensure PDF documents are not password protected before upload." }
                           ].map((note) => (
                              <div key={note.label} className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                                 <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em]">{note.label}</p>
                                 <p className="text-sm font-medium text-white/70 leading-relaxed">{note.text}</p>
                              </div>
                           ))}
                        </div>

                        <button onClick={() => actions.inquiry("Contact Registrar", { type: "contact", title: "Contact Registrar", context: "Page: downloads" })} className="w-full py-5 bg-white text-primary rounded-2xl font-black uppercase text-xs tracking-[0.4em] hover:bg-secondary transition-all">
                           Contact Registrar
                        </button>
                     </div>
                     <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none grayscale">
                        <HelpCircle size={400} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-24 bg-white text-center">
         <div className="container mx-auto px-4 max-w-4xl space-y-12">
            <div className="space-y-4">
               <h3 className="text-3xl lg:text-5xl font-black text-primary uppercase tracking-tighter">Document <span className="text-secondary font-serif font-black underline decoration-4 underline-offset-8">Support</span></h3>
               <p className="text-text-main/60 font-medium text-lg max-w-2xl mx-auto">Our administrative desk is open 9:00 AM — 5:00 PM for all in-person document verification and submission queries.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
               <button onClick={() => actions.inquiry("Request: Visit IT Helpdesk", { type: "contact", title: "Visit IT Helpdesk", description: "Tell us how to reach you and we will send you this information." })} className="px-12 py-5 bg-primary text-secondary rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  Visit IT Helpdesk
               </button>
               <button onClick={(e) => actions.details(e)} className="px-12 py-5 bg-white text-primary border border-gray-100 rounded-2xl font-black uppercase text-sm tracking-widest hover:border-secondary transition-all shadow-xl shadow-primary/5">
                  Frequently Asked Questions
               </button>
            </div>
         </div>
      </section>
    </main>
  );
}
