"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Globe, 
  Search, 
  ArrowUpRight, 
  BarChart3, 
  ShieldCheck, 
  Users, 
  Briefcase,
  Target,
  Zap,
  Building2,
  Calendar,
  Layers,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";

const projects = [
  {
    id: 1,
    title: "Eco-Resilient Urban Frameworks for Delta Regions",
    lead: "Prof. Ahmed Karim",
    agency: "World Bank Research Grant",
    amount: "EGP 2.4M",
    duration: "2024 - 2027",
    status: "Ongoing",
    category: "Sustainability",
    collaborators: ["MIT", "Deltares", "BUET"],
    description: "Developing comprehensive architectural and civil engineering guidelines for rising sea levels in megacity delta regions."
  },
  {
    id: 2,
    title: "NextGen Neural Interfacing for Prosthetic Control",
    lead: "Dr. Sarah Mitchell",
    agency: "National Science Foundation",
    amount: "EGP 1.8M",
    duration: "2023 - 2026",
    status: "Ongoing",
    category: "Health & Robotics",
    collaborators: ["Stanford Robotics", "Siemens Health"],
    description: "Creating sub-millisecond latency neural processing units for high-fidelity control of robotic limbs."
  },
  {
    id: 3,
    title: "Blockchain Protocols for Decentralized University Governance",
    lead: "Dr. Kevin Stewart",
    agency: "EU Horizon 2024",
    amount: "EGP 950k",
    duration: "2024 - 2025",
    status: "Ongoing",
    category: "Technology",
    collaborators: ["ETH Zurich", "IBM Research"],
    description: "A pilot project to digitize academic records and senate voting systems using private Ethereum sidechains."
  },
  {
    id: 4,
    title: "Quantum Cryptography for National Data Security",
    lead: "Prof. James Wilson",
    agency: "Govt. ICT Division",
    amount: "EGP 3.2M",
    duration: "2022 - 2025",
    status: "Ongoing",
    category: "Security",
    collaborators: ["National Physics Lab", "Cisco Systems"],
    description: "Implementing post-quantum secure layers for critical national infrastructure communication."
  },
  {
    id: 5,
    title: "Genomic Mapping of Heat-Resistant Staple Crops",
    lead: "Dr. Elena Rossi",
    agency: "Bill & Melinda Gates Foundation",
    amount: "EGP 4.5M",
    duration: "2021 - 2025",
    status: "Completed",
    category: "Agriculture",
    collaborators: ["CIMMYT", "FAO"],
    description: "Successful identification of genetic markers for rice varieties resistant to extreme temperature fluctuations."
  }
];

const stats = [
  { icon: Globe, label: "Global Projects", value: "85+" },
  { icon: Zap, label: "Active Grants", value: "124" },
  { icon: BarChart3, label: "Total Funding", value: "EGP 420M" },
  { icon: Layers, label: "Partners", value: "350+" },
];

const categories = ["All Sectors", "Sustainability", "Health & Robotics", "Technology", "Security", "Agriculture"];

export default function FundedProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All Sectors");

  const filteredProjects = activeCategory === "All Sectors" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/research-hero.png"
          alt="Modern Research Park"
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
               <Briefcase size={16} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Invested in Innovation</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter"
            >
               Funded <br />
               <span className="text-secondary">Projects</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-white/70 max-w-2xl mx-auto font-medium leading-relaxed"
            >
               Showcasing our global research impact through large-scale funding, strategic partnerships, and breakthrough discoveries.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="-mt-16 relative z-30">
         <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-[4rem] p-8 lg:p-12 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] border border-gray-100">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 lg:divide-x border-gray-50">
                   {stats.map((stat, i) => (
                      <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-col items-center text-center space-y-4 px-6"
                      >
                         <div className="w-16 h-16 bg-surface rounded-3xl flex items-center justify-center text-secondary shadow-inner">
                            <stat.icon size={28} />
                         </div>
                         <div className="space-y-1">
                            <div className="text-3xl lg:text-4xl font-black text-primary tracking-tight">{stat.value}</div>
                            <div className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em]">{stat.label}</div>
                         </div>
                      </motion.div>
                   ))}
                </div>
            </div>
         </div>
      </section>

      {/* Search & Filters */}
      <section className="py-24 bg-white">
         <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-12">
               <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 relative">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30" size={24} />
                     <input 
                        type="text" 
                        placeholder="Search Projects, Researchers, or Agencies..."
                        className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-surface border border-transparent focus:bg-white focus:border-secondary/30 focus:ring-4 focus:ring-secondary/10 transition-all font-bold text-primary placeholder:text-primary/20"
                     />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
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
               </div>

               {/* Projects Grid */}
               <div className="grid grid-cols-1 gap-8">
                  {filteredProjects.map((project, i) => (
                     <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="group bg-surface rounded-[3rem] p-8 lg:p-12 border border-gray-50 hover:border-secondary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                     >
                        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
                           <div className="space-y-6 flex-1">
                              <div className="flex flex-wrap items-center gap-4">
                                 <span className={cn(
                                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                                    project.status === "Ongoing" ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/5 text-primary/40"
                                 )}>
                                    {project.status}
                                 </span>
                                 <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{project.category}</span>
                              </div>
                              
                              <div className="space-y-4">
                                 <h3 className="text-3xl lg:text-4xl font-black text-primary uppercase leading-tight group-hover:text-secondary transition-colors">
                                    {project.title}
                                 </h3>
                                 <p className="text-lg text-text-main/60 font-medium leading-relaxed max-w-3xl">
                                    {project.description}
                                 </p>
                              </div>

                              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
                                 <div className="space-y-1">
                                    <div className="text-[9px] font-black text-primary/30 uppercase tracking-widest flex items-center gap-2"><Target size={12} /> Lead Investigator</div>
                                    <div className="font-bold text-primary">{project.lead}</div>
                                 </div>
                                 <div className="space-y-1">
                                    <div className="text-[9px] font-black text-primary/30 uppercase tracking-widest flex items-center gap-2"><Building2 size={12} /> Funding Agency</div>
                                    <div className="font-bold text-primary">{project.agency}</div>
                                 </div>
                                 <div className="space-y-1">
                                    <div className="text-[9px] font-black text-primary/30 uppercase tracking-widest flex items-center gap-2"><Calendar size={12} /> Duration</div>
                                    <div className="font-bold text-primary">{project.duration}</div>
                                 </div>
                              </div>
                           </div>

                           <div className="lg:w-64 space-y-6 lg:pl-12 lg:border-l border-gray-200">
                              <div className="text-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm group-hover:border-secondary/20 transition-all">
                                 <div className="text-3xl font-black text-secondary">{project.amount}</div>
                                 <div className="text-[9px] font-black text-primary/30 uppercase tracking-widest">Total Grant</div>
                              </div>
                              
                              <div className="space-y-3">
                                 <div className="text-[9px] font-black text-primary/30 uppercase tracking-widest text-center">Collaborators</div>
                                 <div className="flex flex-wrap justify-center gap-2">
                                    {project.collaborators.map(partner => (
                                       <span key={partner} className="px-3 py-1 bg-white rounded-lg text-[9px] font-black text-primary/50 border border-gray-50">{partner}</span>
                                    ))}
                                 </div>
                              </div>

                              <button onClick={(e) => actions.details(e)} className="w-full py-4 bg-primary text-secondary rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center justify-center gap-2 group/btn">
                                 Project Details <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                              </button>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Grant Support Section */}
      <section className="py-32 bg-surface">
         <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-10">
                  <div className="space-y-6">
                     <h2 className="text-4xl lg:text-6xl font-black text-primary uppercase leading-[0.9] tracking-tighter">
                        Empowering <br /> <span className="text-secondary">Researchers</span>
                     </h2>
                     <p className="text-xl text-text-main/60 font-medium leading-relaxed">
                        Our Office of Research Innovation (ORI) provides end-to-end support for grant applications, ethical clearances, and international collaboration frameworks.
                     </p>
                  </div>

                  <div className="space-y-4">
                     {[
                        { icon: ShieldCheck, title: "Grant Writing Support", desc: "Expert assistance in drafting competitive proposals." },
                        { icon: Users, title: "Partner Matchmaking", desc: "Connecting you with 350+ global industry partners." },
                        { icon: Award, title: "Internal Funding", desc: "Seed grants for high-potential pilot projects." }
                     ].map((item) => (
                        <div key={item.title} className="flex gap-6 p-6 rounded-3xl bg-white border border-gray-100 hover:border-secondary/20 transition-all group">
                           <div className="shrink-0 w-14 h-14 bg-surface rounded-2xl flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all">
                              <item.icon size={24} />
                           </div>
                           <div className="space-y-1">
                              <h4 className="font-black text-primary uppercase text-sm tracking-tight">{item.title}</h4>
                              <p className="text-xs font-bold text-text-main/40 uppercase leading-snug">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="relative">
                  <div className="absolute inset-0 bg-secondary/5 blur-[120px] rounded-full animate-pulse" />
                  <div className="relative bg-white rounded-[4rem] p-12 lg:p-20 shadow-2xl border border-gray-100 text-center space-y-12">
                     <div className="space-y-4">
                        <h3 className="text-3xl font-black text-primary uppercase tracking-tight">Ready to <span className="text-secondary">Innovate?</span></h3>
                        <p className="text-text-main/60 font-medium  ">"Research is what I'm doing when I don't know what I'm doing." — Wernher von Braun</p>
                     </div>
                     
                     <div className="space-y-6">
                        <button onClick={() => actions.inquiry("Call for Proposals 2026", { type: "contact", title: "Call for Proposals 2026", context: "Page: funded-projects" })} className="w-full py-6 bg-primary text-secondary rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                           Call for Proposals 2026
                        </button>
                        <button onClick={() => actions.print()} className="w-full py-6 bg-white text-primary border border-gray-100 rounded-2xl font-black uppercase text-xs tracking-widest hover:border-secondary transition-all">
                           Funding Policy Guidelines
                        </button>
                     </div>

                     <div className="pt-6 flex justify-center gap-8 border-t border-gray-50">
                        <div className="text-center">
                           <div className="text-2xl font-black text-primary">EGP 15k</div>
                           <div className="text-[8px] font-black text-primary/20 uppercase tracking-widest">Internal Seed</div>
                        </div>
                        <div className="text-center">
                           <div className="text-2xl font-black text-primary">EGP 150k</div>
                           <div className="text-[8px] font-black text-primary/20 uppercase tracking-widest">Global Grant</div>
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
