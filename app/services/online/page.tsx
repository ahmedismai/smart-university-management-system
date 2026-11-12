"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  CreditCard, 
  Search, 
  ShieldCheck, 
  Cpu, 
  Smartphone, 
  Zap, 
  Headphones, 
  FileCheck, 
  ArrowRight,
  MousePointer2,
  Lock,
  RefreshCw,
  Mail,
  Layout
} from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  {
    id: 1,
    title: "e-Payment Gateway",
    category: "Students",
    description: "Secure portal for semester fee payments, hall dues, and transcript processing fees.",
    icon: CreditCard,
    status: "Secure"
  },
  {
    id: 2,
    title: "Degree Verification",
    category: "Public",
    description: "Automated verification system for employers and external institutions to verify academic credentials.",
    icon: FileCheck,
    status: "Live"
  },
  {
    id: 3,
    title: "Admission Tracking",
    category: "Public",
    description: "Real-time status updates for prospective students throughout the application and admission cycle.",
    icon: Search,
    status: "Active"
  },
  {
    id: 4,
    title: "Faculty Dashboard",
    category: "Faculty",
    description: "Integrated console for managing research grants, payroll, and departmental logistics.",
    icon: Layout,
    status: "Secure"
  },
  {
    id: 5,
    title: "Student Health Portal",
    category: "Students",
    description: "Manage health insurance claims, book infirmary appointments, and access wellness resources.",
    icon: ShieldCheck,
    status: "Active"
  },
  {
    id: 6,
    title: "Digital Library Access",
    category: "Students",
    description: "Remote access to 500,000+ e-journals, research papers, and digital archives.",
    icon: Database, // I notice Database is not in my imports, I should use Search or BookOpen or Laptop
    status: "24/7 Access"
  }
];

// Fix: Database was missing in imports, using Laptop instead
import { Laptop, Database } from "lucide-react";

const categories = ["All Services", "Students", "Faculty", "Public"];

export default function OnlineServicesPage() {
  const [activeCategory, setActiveCategory] = useState("All Services");

  const filteredServices = activeCategory === "All Services" 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-primary text-center">
        <Image
          src="/research-hero.png"
          alt="Digital University Services"
          fill
          className="object-cover opacity-20 scale-105 animate-slow-zoom"
          priority
        />
        
        <div className="container mx-auto px-4 relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-secondary shadow-2xl"
          >
             <Globe size={16} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Global Digital Gateway</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl lg:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter"
          >
             Digital <br />
             <span className="text-secondary">Infrastructure</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-white/70 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Empowering the university community with seamless, secure, and world-class digital services. Stay connected, stay productive.
          </motion.p>
        </div>
      </section>

      {/* Service Explorer */}
      <section className="-mt-16 relative z-30 pb-24">
         <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
               <div className="bg-white rounded-[3rem] p-6 lg:p-10 shadow-[0_48px_100px_-20px_rgba(0,0,0,0.12)] border border-gray-100">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-8 px-4">
                     <div className="flex flex-wrap items-center gap-2">
                        {categories.map((cat) => (
                           <button 
                              key={cat}
                              onClick={() => setActiveCategory(cat)}
                              className={cn(
                                 "px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
                                 activeCategory === cat 
                                    ? "bg-secondary text-primary shadow-lg shadow-secondary/20" 
                                    : "bg-surface text-primary/40 hover:bg-secondary/10 hover:text-primary"
                              )}
                           >
                              {cat}
                           </button>
                        ))}
                     </div>
                     <div className="flex items-center gap-3 text-[10px] font-black text-primary/20 uppercase tracking-widest">
                        <RefreshCw size={14} className="animate-spin-slow" /> System Uptime: 99.99%
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                     {filteredServices.map((service, i) => (
                        <motion.div
                           key={service.id}
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           transition={{ duration: 0.2, delay: i * 0.05 }}
                           className="group bg-surface rounded-[3rem] p-10 border border-transparent hover:bg-white hover:border-secondary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col justify-between space-y-8"
                        >
                           <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                    <service.icon size={32} />
                                 </div>
                                 <div className="text-right">
                                    <span className="px-3 py-1 bg-primary/5 text-primary/40 rounded-full text-[8px] font-black uppercase tracking-widest block mb-1">{service.category}</span>
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center justify-end gap-1">
                                       <Zap size={10} /> {service.status}
                                    </span>
                                 </div>
                              </div>
                              
                              <div className="space-y-3">
                                 <h4 className="text-2xl font-black text-primary uppercase leading-tight group-hover:text-secondary transition-colors">
                                    {service.title}
                                 </h4>
                                 <p className="text-xs font-medium text-text-main/50 leading-relaxed uppercase tracking-wide">
                                    {service.description}
                                 </p>
                              </div>
                           </div>

                           <button onClick={() => actions.inquiry("Launch Service", { type: "contact", title: "Launch Service", context: "Page: online" })} className="w-full py-4 bg-primary text-secondary rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center justify-center gap-3 group/btn shadow-xl shadow-primary/5">
                              Launch Service <MousePointer2 size={16} className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                           </button>
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </div>
            </div>
         </div>
      </section>

      {/* Security & Support Section */}
      <section className="py-24 bg-surface">
         <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-12">
                  <div className="space-y-6">
                     <h2 className="text-4xl lg:text-6xl font-black text-primary uppercase leading-[0.9] tracking-tighter">
                        Enterprise <br /> <span className="text-secondary">Security</span> Standards
                     </h2>
                     <p className="text-xl text-text-main/60 font-medium leading-relaxed">
                        Your data security is our top priority. Every transaction and data exchange within our digital hub is protected by multi-layered encryption.
                     </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8">
                     {[
                        { icon: Lock, title: "SSL Encrypted", desc: "Military-grade 256-bit data encryption." },
                        { icon: Smartphone, title: "MFA Enabled", desc: "Multi-Factor Authentication for all sensitive portals." },
                        { icon: ShieldCheck, title: "Privacy Audit", desc: "Quarterly independent digital security audits." },
                        { icon: Cpu, title: "Edge Network", desc: "Global CDN delivery for low-latency reliable access." }
                     ].map((item) => (
                        <div key={item.title} className="flex gap-4 items-start group">
                           <div className="shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all">
                              <item.icon size={20} />
                           </div>
                           <div className="space-y-1">
                              <h4 className="font-black text-primary uppercase text-sm tracking-tight">{item.title}</h4>
                              <p className="text-[10px] font-black text-text-main/40 uppercase leading-tight tracking-wider">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="relative">
                  <div className="absolute -inset-10 bg-secondary/10 blur-[100px] rounded-full animate-pulse" />
                  <div className="relative bg-primary rounded-[4rem] p-12 lg:p-24 shadow-2xl space-y-12 text-white border border-white/5 overflow-hidden">
                     <div className="space-y-6 relative z-10 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-secondary mx-auto shadow-inner border border-white/10">
                           <Headphones size={36} />
                        </div>
                        <h3 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter">Digital <br /> <span className="text-secondary">Support</span> Hub</h3>
                        <p className="text-white/50 font-medium">Encountering technical issues or need help with your university credentials?</p>
                     </div>
                     <div className="space-y-4 relative z-10">
                        <button onClick={() => actions.inquiry("Contact ICT Support", { type: "contact", title: "Contact ICT Support", context: "Page: online" })} className="w-full py-6 bg-secondary text-primary rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4">
                           Contact ICT Support <Mail size={20} />
                        </button>
                        <button onClick={() => actions.print()} className="w-full py-6 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-white/10 transition-all">
                           ICT Policy Manual
                        </button>
                     </div>
                     <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none grayscale">
                        <Cpu size={400} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Global Notice Call-to-action */}
      <section className="py-24 bg-white text-center">
         <div className="container mx-auto px-4 max-w-4xl space-y-12">
            <div className="space-y-4">
               <h3 className="text-3xl lg:text-5xl font-black text-primary uppercase tracking-tighter">Stay <span className="text-secondary underline decoration-4 underline-offset-8">Synchronized</span></h3>
               <p className="text-text-main/60 font-medium text-lg max-w-2xl mx-auto">Access your university workspace from anywhere in the world. Our digital infrastructure is designed for the modern scholar.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
               <button onClick={(e) => actions.details(e)} className="flex items-center gap-3 px-12 py-5 bg-surface text-primary rounded-2xl font-black uppercase text-sm tracking-widest hover:border-secondary transition-all border border-transparent">
                   System Status <Zap size={18} className="text-secondary" />
               </button>
               <button onClick={(e) => actions.details(e)} className="flex items-center gap-3 px-12 py-5 bg-primary text-secondary rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  Access Portal Cloud <ArrowRight size={18} />
               </button>
            </div>
         </div>
      </section>
    </main>
  );
}
