"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Lightbulb, 
  Cpu, 
  Rocket, 
  ArrowUpRight, 
  Zap, 
  FlaskConical,
  Layers,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const facilities = [
  {
    id: 1,
    title: "Advanced Robotics & AI",
    desc: "Rapid prototyping for autonomous systems, neural processing units, and human-machine interfaces.",
    icon: Cpu,
    color: "bg-blue-600/10 text-blue-600"
  },
  {
    id: 2,
    title: "V-Reality & Immersive Media",
    desc: "State-of-the-art visualization cluster for AR/VR applications in medicine and architecture.",
    icon: Layers,
    color: "bg-purple-600/10 text-purple-600"
  },
  {
    id: 3,
    title: "Digital Fabrication Lab",
    desc: "Industrial-grade 3D printing (SLA/FDM), CNC machining, and laser fabrication suites.",
    icon: Settings,
    color: "bg-emerald-600/10 text-emerald-600"
  },
  {
    id: 4,
    title: "Bio-Innovation Hub",
    desc: "Wet lab for synthetic biology, microbial fuel cells, and sustainable material synthesis.",
    icon: FlaskConical,
    color: "bg-orange-600/10 text-orange-600"
  }
];

const startups = [
  {
    name: "NeuralFlux AI",
    category: "HealthTech",
    stage: "Series A",
    description: "Developing non-invasive neural interfaces for real-time stroke prevention monitoring.",
    impact: "Saved 200+ clinical hours."
  },
  {
    name: "AquaSense Solutions",
    category: "AgriTech",
    stage: "Seed Funded",
    description: "IoT-based irrigation systems that reduce water consumption in delta farming by 40%.",
    impact: "Partnered with 5k farmers."
  },
  {
    name: "BlockAcademic",
    category: "EdTech",
    stage: "Pilot Stage",
    description: "Decentralized certification platform ensuring permanent, tamper-proof academic credentials.",
    impact: "15k+ credentials issued."
  }
];

export default function InnovationLabPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/research-hero.png"
          alt="Modern Innovation Hub"
          fill
          className="object-cover opacity-30 scale-105 animate-slow-zoom"
          priority
        />
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-secondary shadow-2xl"
          >
             <Lightbulb size={16} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Incubating the Future</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl lg:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter"
          >
             Innovation <br />
             <span className="text-secondary">Lab</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-white/70 max-w-2xl mx-auto font-medium leading-relaxed"
          >
             A cross-disciplinary maker space where students, faculty, and industry partners transform breakthrough research into scalable startups.
          </motion.p>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-32 bg-white relative overflow-hidden">
         <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-8"
               >
                  <div className="space-y-4">
                     <div className="h-1.5 w-20 bg-secondary rounded-full" />
                     <h2 className="text-4xl lg:text-6xl font-black text-primary uppercase leading-[0.9] tracking-tighter">
                        From <span className="text-secondary">Idea</span> <br /> to Impact
                     </h2>
                  </div>
                  <p className="text-xl text-text-main/60 font-medium leading-relaxed">
                     The Innovation Lab (iLab) is the heart of the university's startup ecosystem. We provide the infrastructure, funding, and mentorship necessary to move from laboratory prototypes to market-ready solutions.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-8 pt-4">
                     {[
                        { icon: Rocket, label: "Launched Startups", value: "48+" },
                        { icon: Zap, label: "Funding Raised", value: "EGP 12M" }
                     ].map((stat) => (
                        <div key={stat.label} className="space-y-1">
                           <div className="text-4xl font-black text-primary">{stat.value}</div>
                           <div className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                     ))}
                  </div>
               </motion.div>

               <div className="grid grid-cols-2 gap-4">
                  {[
                     { title: "Venture Capital", desc: "Connecting founders with top-tier VCs." },
                     { title: "IP Legal Support", desc: "Expert guidance on patent filing." },
                     { title: "Mentorship", desc: "Access to 100+ industry CEOs." },
                     { title: "Seed Grants", desc: "Up to EGP 50k in localized grants." }
                  ].map((item, i) => (
                     <motion.div 
                        key={item.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 bg-surface rounded-[2.5rem] border border-gray-50 hover:border-secondary/20 transition-all group"
                     >
                        <h4 className="font-black text-primary uppercase text-sm tracking-tight mb-2">{item.title}</h4>
                        <p className="text-xs font-bold text-text-main/40 uppercase leading-snug">{item.desc}</p>
                     </motion.div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Lab Facilities */}
      <section className="py-32 bg-surface">
         <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-20">
               <h2 className="text-4xl lg:text-6xl font-black text-primary uppercase tracking-tighter">Lab <span className="text-secondary">Facilities</span></h2>
               <p className="text-text-main/50 font-bold uppercase tracking-widest text-sm">State-of-the-art infrastructure for rapid innovation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {facilities.map((fac, i) => (
                  <motion.div
                     key={fac.id}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                     viewport={{ once: true }}
                     className="group bg-white p-10 rounded-[3rem] border border-gray-100 hover:border-secondary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                  >
                     <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform", fac.color)}>
                        <fac.icon size={28} />
                     </div>
                     <h3 className="text-xl font-black text-primary uppercase mb-4 leading-tight">
                        {fac.title}
                     </h3>
                     <p className="text-sm font-medium text-text-main/50 leading-relaxed">
                        {fac.desc}
                     </p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Startups Showcase */}
      <section className="py-32 bg-white">
         <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-20 px-4">
               <div className="space-y-4 text-center lg:text-left">
                  <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase tracking-tighter">Startup <span className="text-secondary">Portfolio</span></h2>
                  <p className="text-text-main/50 font-bold uppercase tracking-widest text-xs lg:text-sm">Innovations commercialized within our walls</p>
               </div>
               <button onClick={(e) => actions.details(e)} className="hidden lg:flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-primary/30 hover:text-secondary transition-colors">
                  View Full Roster <ArrowUpRight size={16} />
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {startups.map((startup, i) => (
                  <motion.div
                     key={startup.name}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                     viewport={{ once: true }}
                     className="p-10 rounded-[3rem] bg-surface border border-gray-50 flex flex-col justify-between space-y-8 hover:border-secondary/20 transition-all group"
                  >
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{startup.category}</span>
                           <span className="px-3 py-1 bg-white rounded-full text-[8px] font-black uppercase tracking-widest border border-gray-100">{startup.stage}</span>
                        </div>
                        <h4 className="text-3xl font-black text-primary group-hover:text-secondary transition-colors">{startup.name}</h4>
                        <p className="text-sm font-medium text-text-main/60 leading-relaxed">
                           {startup.description}
                        </p>
                     </div>
                     <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="space-y-1 text-left">
                           <p className="text-[8px] font-black text-primary/30 uppercase tracking-widest">Growth Metric</p>
                           <p className="text-xs font-bold text-primary">{startup.impact}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                           <ArrowUpRight size={20} />
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Membership & Events */}
      <section className="py-32 bg-white relative overflow-hidden">
         <div className="container mx-auto px-4 max-w-6xl">
            <div className="relative p-12 lg:p-24 rounded-[4rem] bg-primary text-white overflow-hidden shadow-2xl">
               <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                  <div className="space-y-8">
                     <div className="space-y-4 text-center lg:text-left">
                        <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">Join the <br /><span className="text-secondary font-serif">iLab Community</span></h2>
                        <p className="text-white/60 text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                           Whether you're a first-year student with an idea or a PhD candidate with a patentable process, we have the resources to help you build.
                        </p>
                     </div>
                     <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        <button onClick={() => actions.inquiry("Membership Inquiry", { type: "contact", title: "Membership Inquiry", context: "Page: innovation-lab" })} className="px-10 py-5 bg-secondary text-primary rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 active:scale-95 transition-all">
                           Membership Inquiry
                        </button>
                        <button onClick={(e) => actions.details(e)} className="px-10 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-primary transition-all backdrop-blur-md">
                           Lab Calendar
                        </button>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="p-8 bg-white/5 backdrop-blur-sm rounded-[2rem] border border-white/10 space-y-4">
                        <div className="flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest">
                           <Zap size={14} /> Upcoming Event
                        </div>
                        <h4 className="text-2xl font-black">2026 Innovation Hackathon</h4>
                        <div className="flex items-center justify-between py-4 border-t border-white/10">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Date</p>
                              <p className="font-bold">Sept 15 - 17, 2026</p>
                           </div>
                           <div className="space-y-1 text-right">
                              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Venue</p>
                              <p className="font-bold">iLab Main Atrium</p>
                           </div>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-white/5 backdrop-blur-sm rounded-[2rem] border border-white/10 text-center">
                           <div className="text-2xl font-black text-secondary">350+</div>
                           <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">Fellows</div>
                        </div>
                        <div className="p-6 bg-white/5 backdrop-blur-sm rounded-[2rem] border border-white/10 text-center">
                           <div className="text-2xl font-black text-secondary">15</div>
                           <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">Industry Partners</div>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none grayscale">
                  <Lightbulb size={400} />
               </div>
            </div>
         </div>
      </section>
    </main>
  );
}
