"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  FileText, 
  Book, 
  Scale, 
  ShieldCheck, 
  Download, 
  ChevronRight,
  ExternalLink,
  History,
  Building2,
  Users2
} from "lucide-react";
import { cn } from "@/lib/utils";

const ordinanceSections = [
  {
    part: "Part I",
    title: "Preliminary & Incorporation",
    description: "Definition of terms, name of the University, and the powers and functions of the University as a body corporate.",
    icon: Building2
  },
  {
    part: "Part II",
    title: "Officers of the University",
    description: "Legal provisions regarding the Chancellor, Vice-Chancellor, Pro-Vice-Chancellor, Treasurer, and other key academic and administrative officers.",
    icon: Users2
  },
  {
    part: "Part III",
    title: "Authorities of the University",
    description: "Constitution and powers of the Senate, Syndicate, Academic Council, and various committees governing the institution.",
    icon: ShieldCheck
  },
  {
    part: "Part IV",
    title: "Statutes, University Ordinances & Regulations",
    description: "The methodology for framing new laws and the hierarchy of legal documents within the University system.",
    icon: Scale
  },
  {
    part: "Part V",
    title: "Appointment of Teachers & Staff",
    description: "Procedures for recruitment, selection committees, and terms of service for the academic and administrative community.",
    icon: Users2
  },
  {
    part: "Part VI",
    title: "Financial Administration",
    description: "Provisions for the University fund, auditing procedures, and the role of the Finance Committee.",
    icon: FileText
  }
];

export default function OrdinancePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/ordinance-hero.png"
          alt="University Ordinance Hero"
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
              <Scale size={16} className="text-secondary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Legal Framework</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tight">
              University <br/>
              <span className="text-secondary font-serif">Ordinance</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
              The foundational legal document defining the governance, administration, and operational excellence of our institution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Sidebar - Quick Info */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="bg-surface rounded-3xl p-8 border border-primary/5 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-black text-primary/40 uppercase tracking-[0.2em]">Document Summary</h3>
                  <div className="w-12 h-1 bg-secondary rounded-full" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-white rounded-xl shadow-sm text-secondary">
                        <History size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-primary">Establishment</h4>
                        <p className="text-sm text-text-main/60">Founded under the University Act of 2021, providing full autonomy.</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-white rounded-xl shadow-sm text-secondary">
                        <Book size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-primary">Core Purpose</h4>
                        <p className="text-sm text-text-main/60">To ensure academic integrity, administrative transparency, and social impact.</p>
                     </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-primary/5">
                   <button onClick={() => actions.print()} className="w-full flex items-center justify-between p-4 bg-primary text-white rounded-2xl hover:bg-primary/95 transition-all group">
                      <div className="flex items-center gap-3">
                         <Download size={20} className="text-secondary" />
                         <span className="font-bold text-sm">Download Full PDF</span>
                      </div>
                      <ChevronRight size={18} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-secondary/5 border border-secondary/10">
                 <h4 className="text-primary font-bold mb-2">Legal Disclaimer</h4>
                 <p className="text-xs text-primary/60 leading-relaxed font-medium">
                    This digital version is for informational purposes only. In case of any conflict, the printed gazette notified by the Board of Trustees remains the authoritative source.
                 </p>
              </div>
            </aside>

            {/* Main Details */}
            <div className="lg:col-span-8 space-y-12">
               <div className="space-y-6">
                  <h2 className="text-4xl font-black text-primary uppercase leading-tight">Structural <span className="text-secondary">Ordinance</span> Overview</h2>
                  <p className="text-text-main/70 text-lg leading-relaxed font-medium">
                     The NextGen University Ordinance serves as the primary constitution of the university. It details the administrative structures, defines roles and responsibilities, and provides the procedures for academic and financial management.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ordinanceSections.map((section, index) => (
                    <motion.div
                      key={section.part}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group p-8 rounded-[2rem] bg-surface border border-primary/5 hover:border-secondary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-white rounded-2xl text-secondary shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                          <section.icon size={24} />
                        </div>
                        <span className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em]">{section.part}</span>
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">{section.title}</h3>
                      <p className="text-sm text-text-main/60 leading-relaxed font-medium">
                        {section.description}
                      </p>
                    </motion.div>
                  ))}
               </div>

               <div className="pt-12">
                  <div className="p-10 rounded-[2.5rem] bg-primary text-white relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                     <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 text-center md:text-left">
                           <h3 className="text-3xl font-black uppercase">Need the official Gazette?</h3>
                           <p className="text-white/60 font-medium max-w-md">Our Registrar&apos;s office maintains the historical records and official amendments of the University Ordinance.</p>
                        </div>
                        <button onClick={() => actions.inquiry("Contact Registrar", { type: "contact", title: "Contact Registrar", context: "Page: University" })} className="whitespace-nowrap px-8 py-4 bg-secondary text-primary font-bold rounded-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                           <ExternalLink size={18} />
                           Contact Registrar
                        </button>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
