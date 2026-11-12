"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Building, 
  Users, 
  Gavel, 
  FileCheck, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

const senateFunctions = [
  "Rectify the Statutes passed by the Syndicate.",
  "Consider and pass resolutions on the annual report and annual accounts.",
  "Exercise such other powers and perform such other duties as may be conferred or imposed by the Ordinance.",
  "Approve the annual budget of the University.",
  "Formulate broad policies for the development of the University."
];

const syndicateFunctions = [
  "Manage and administer the revenue and property of the University.",
  "Direct the form, custody, and use of the common seal of the University.",
  "Regulate and determine all matters concerning the University in accordance with the Ordinance.",
  "Appoint Teachers and Officers of the University on the recommendation of Selection Committees.",
  "Enter into, vary, carry out and cancel contracts on behalf of the University."
];

export default function SenateSyndicatePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/governance-hero.png"
          alt="University Governance Boardroom"
          fill
          className="object-cover opacity-30"
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
              <ShieldCheck size={16} className="text-secondary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Institutional Governance</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight uppercase">
              Senate & <br/>
              <span className="text-secondary font-serif">Syndicate</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
              The supreme administrative and executive bodies ensuring the strategic integrity and excellence of NextGen University.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Governance Overview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-20">
             <div className="inline-flex items-center gap-3 text-secondary">
                <div className="h-px w-8 bg-current" />
                <span className="text-xs font-black uppercase tracking-widest">Leadership & Control</span>
                <div className="h-px w-8 bg-current" />
             </div>
             <h2 className="text-4xl lg:text-5xl font-black text-primary leading-tight uppercase">
                The Pillars of <br/> <span className="text-secondary">University Authority</span>
             </h2>
             <p className="text-text-main/70 text-lg font-medium leading-relaxed">
                Our governance model follows a dual-body structure. The **Senate** acts as the supreme policy-making body, while the **Syndicate** serves as the chief executive organ responsible for the day-to-day administration and management of the university's assets.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Senate Section */}
            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="group p-10 rounded-[3rem] bg-surface border border-primary/5 hover:border-secondary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
            >
               <div className="flex items-center justify-between mb-10">
                  <div className="p-5 bg-white rounded-2xl text-secondary shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                     <Building size={32} />
                  </div>
                  <span className="text-[10px] font-black text-primary/30 uppercase tracking-[0.3em]">Policy & Ratification</span>
               </div>
               
               <h3 className="text-3xl font-black text-primary mb-6 flex items-center gap-4 uppercase tracking-tighter">
                  The <span className="text-secondary">Senate</span>
               </h3>
               
               <p className="text-text-main/60 font-medium mb-10 leading-relaxed">
                  The Senate serves as the broadest representative body of the university, consisting of members from academic, administrative, and public spheres. Its primary role is to ratify statutes and approve budgetary frameworks.
               </p>

               <div className="space-y-4">
                  <h4 className="text-sm font-black text-primary/40 uppercase tracking-widest mb-6">Principal Functions</h4>
                  {senateFunctions.map((func, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-transparent group-hover:border-primary/5 transition-all">
                       <div className="mt-1 p-1 bg-secondary/10 text-secondary rounded-lg shrink-0">
                          <CheckCircle2 size={16} />
                       </div>
                       <p className="text-sm font-bold text-text-main/70 leading-relaxed">{func}</p>
                    </div>
                  ))}
               </div>
            </motion.div>

            {/* Syndicate Section */}
            <motion.div 
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="group p-10 rounded-[3rem] bg-primary text-white border border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30"
            >
               <div className="flex items-center justify-between mb-10">
                  <div className="p-5 bg-white/10 rounded-2xl text-secondary shadow-sm group-hover:bg-secondary group-hover:text-primary transition-all duration-500">
                     <Gavel size={32} />
                  </div>
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Executive Governance</span>
               </div>
               
               <h3 className="text-3xl font-black text-white mb-6 flex items-center gap-4 uppercase tracking-tighter">
                  The <span className="text-secondary">Syndicate</span>
               </h3>
               
               <p className="text-white/60 font-medium mb-10 leading-relaxed">
                  As the supreme executive body, the Syndicate oversees the administration of all university property and finances. It ensures that all academic and administrative activities align with the University Ordinance.
               </p>

               <div className="space-y-4">
                  <h4 className="text-sm font-black text-white/40 uppercase tracking-widest mb-6 text-secondary">Operational Powers</h4>
                  {syndicateFunctions.map((func, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-all">
                       <div className="mt-1 p-1 bg-secondary text-primary rounded-lg shrink-0">
                          <CheckCircle2 size={16} />
                       </div>
                       <p className="text-sm font-bold text-white/80 leading-relaxed">{func}</p>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Composition Stats */}
      <section className="py-24 bg-surface">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 rounded-3xl bg-white shadow-sm border border-primary/5 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary text-secondary rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                     <Users size={32} />
                  </div>
                  <h4 className="text-3xl font-black text-primary uppercase">Senate</h4>
                  <p className="text-xs font-black text-primary/30 uppercase tracking-widest">Representative Council</p>
                  <p className="text-text-main/60 font-medium text-sm">Chaired by the Chancellor, including representatives from teachers, graduates, and registered members.</p>
               </div>
               <div className="p-8 rounded-3xl bg-white shadow-sm border border-primary/5 text-center space-y-4">
                  <div className="w-16 h-16 bg-secondary text-primary rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                     <Briefcase size={32} />
                  </div>
                  <h4 className="text-3xl font-black text-primary uppercase">Syndicate</h4>
                  <p className="text-xs font-black text-primary/30 uppercase tracking-widest">Executive Authority</p>
                  <p className="text-text-main/60 font-medium text-sm">Members appointed by the Chancellor, Government, and Senate to lead administrative strategy.</p>
               </div>
               <div className="p-8 rounded-3xl bg-white shadow-sm border border-primary/5 text-center space-y-4">
                  <div className="w-16 h-16 bg-surface text-primary rounded-2xl border border-primary/5 flex items-center justify-center mx-auto shadow-sm">
                     <FileCheck size={32} />
                  </div>
                  <h4 className="text-3xl font-black text-primary uppercase">Committees</h4>
                  <p className="text-xs font-black text-primary/30 uppercase tracking-widest">Statutory Bodies</p>
                  <p className="text-text-main/60 font-medium text-sm">Academic Council, Finance Committee, and Planning Committee reporting to the bodies above.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Actions Callout */}
      <section className="py-24 bg-white">
         <div className="container mx-auto px-4">
            <div className="bg-primary rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center md:text-left">
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="max-w-xl space-y-6">
                     <h3 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">Administrative Transparency</h3>
                     <p className="text-white/60 text-lg font-medium leading-relaxed">
                        Access official session minutes, gazette notifications, and the members list through our digital governance repository.
                     </p>
                  </div>
                  <button onClick={() => actions.inquiry("Request: Explore Repository", { type: "contact", title: "Explore Repository", description: "Tell us how to reach you and we will send you this information." })} className="whitespace-nowrap px-10 py-5 bg-secondary text-primary font-black uppercase tracking-widest text-sm rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                     Explore Repository <ArrowRight size={20} />
                  </button>
               </div>
            </div>
         </div>
      </section>
    </main>
  );
}
