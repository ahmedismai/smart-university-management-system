"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Beaker, 
  Cpu, 
  Dna, 
  Leaf, 
  Microscope, 
  Binary, 
  Globe, 
  BarChart3, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Target,
  FlaskConical
} from "lucide-react";
import { cn } from "@/lib/utils";

const researchCenters = [
  {
    id: "ai-robotics",
    name: "Advanced AI & Robotics Lab",
    acronym: "AAIRL",
    category: "Technology",
    description: "Pioneering the future of autonomous systems, neural networks, and human-robot interaction for industrial and medical applications.",
    leads: "Dr. Sarah Mitchell & Team",
    focus: ["Deep Learning", "Control Systems", "Computer Vision"],
    image: "/research-ai.png",
    color: "bg-blue-500/10 text-blue-600",
    icon: Cpu
  },
  {
    id: "biotech",
    name: "Genomic & Biotech Center",
    acronym: "GBC",
    category: "Life Sciences",
    description: "Dedicated to breakthrough discoveries in gene editing, vaccine platforms, and regenerative medicine using CRISPR technologies.",
    leads: "Prof. Ahmed Karim",
    focus: ["Molecular Biology", "Bio-informatics", "Neuroscience"],
    image: "/research-biotech.png",
    color: "bg-emerald-500/10 text-emerald-600",
    icon: FlaskConical
  },
  {
    id: "sustainability",
    name: "Climate Action Hub",
    acronym: "CAH",
    category: "Sustainability",
    description: "Investigating renewable energy solutions, carbon capture systems, and sustainable urban frameworks to combat climate change.",
    leads: "Dr. Elena Rossi",
    focus: ["Solar Energy", "Circular Economy", "Green Materials"],
    image: "/research-sustainability.png",
    color: "bg-amber-500/10 text-amber-600",
    icon: Leaf
  },
  {
    id: "quantum",
    name: "Quantum Computing Lab",
    acronym: "QCL",
    category: "Physics",
    description: "Exploring the boundaries of quantum mechanics to develop next-generation cryptographic systems and super-dense processing arrays.",
    leads: "Dr. James Wilson",
    focus: ["Quantum Algorithms", "Cryptography", "Nano-photonics"],
    image: "/research-quantum.png",
    color: "bg-indigo-500/10 text-indigo-600",
    icon: Binary
  }
];

const stats = [
  { icon: Globe, label: "Global Partners", value: "125+" },
  { icon: Zap, label: "Annual Patents", value: "48" },
  { icon: BarChart3, label: "Research Grants", value: "EGP 180M" },
  { icon: Target, label: "H-Index Avg", value: "65.4" },
];

export default function ResearchCentersPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/research-hero.png"
          alt="Modern Research Facility"
          fill
          className="object-cover opacity-30 scale-105 animate-slow-zoom"
          priority
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-secondary/20 backdrop-blur-xl border border-secondary/30 text-secondary shadow-2xl shadow-secondary/10"
            >
               <FlaskConical size={18} className="animate-pulse" />
               <span className="text-xs font-black uppercase tracking-[0.3em]">Excellence in Research</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter"
            >
               Centers of <br />
               <span className="text-secondary drop-shadow-sm">Innovation</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed"
            >
               Empowering the next generation of researchers to solve global challenges through interdisciplinary collaboration and state-of-the-art infrastructure.
            </motion.p>
          </div>
        </div>
        
        {/* Abstract Background Element */}
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* Impact Stats */}
      <section className="-mt-32 relative z-20">
         <div className="container mx-auto px-4">
            <div className="bg-white rounded-[4rem] p-8 lg:p-12 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] border border-gray-100 backdrop-blur-xl">
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
                            <div className="text-4xl lg:text-5xl font-black text-primary tracking-tight">{stat.value}</div>
                            <div className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em]">{stat.label}</div>
                         </div>
                      </motion.div>
                   ))}
                </div>
            </div>
         </div>
      </section>

      {/* Intro Section */}
      <section className="py-32 bg-white relative overflow-hidden">
         <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <motion.div 
                 initial={{ opacity: 0, x: -30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="space-y-8"
               >
                  <div className="space-y-4">
                     <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-[1.1] tracking-tighter">
                        Driving <span className="text-secondary">Progress</span> <br /> Through Discovery
                     </h2>
                     <div className="h-2 w-24 bg-secondary rounded-full" />
                  </div>
                  <p className="text-xl text-text-main/60 font-medium leading-relaxed">
                     NextGen University hosts 15 specialized research centers that act as incubators for global solutions. From the microscopic world of nanotechnology to the vast complexities of climate modeling, we are committed to pushing boundaries.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-6 pt-4">
                     {[
                        { icon: ShieldCheck, title: "Ethics First", desc: "Highest standards of research integrity." },
                        { icon: Beaker, title: "Modern Labs", desc: "Equipped with world-class instrumentation." }
                     ].map((item) => (
                        <div key={item.title} className="p-6 bg-surface rounded-3xl border border-gray-100 hover:border-secondary/20 transition-all group">
                           <item.icon className="text-secondary mb-3 group-hover:scale-110 transition-transform" size={24} />
                           <h4 className="font-black text-primary uppercase text-sm tracking-tight">{item.title}</h4>
                           <p className="text-xs font-bold text-text-main/40 mt-1 uppercase leading-snug">{item.desc}</p>
                        </div>
                     ))}
                  </div>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, x: 30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="relative group"
               >
                  <div className="absolute -inset-4 bg-secondary/10 rounded-[4rem] group-hover:bg-secondary/20 transition-all duration-700 blur-2xl" />
                  <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl">
                     <Image 
                        src="/research-hero.png" 
                        alt="Research in action" 
                        fill 
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" 
                     />
                  </div>
               </motion.div> 
            </div>
         </div>
      </section>

      {/* Directory Section */}
      <section className="py-32 bg-surface">
         <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-20">
               <h2 className="text-4xl lg:text-6xl font-black text-primary uppercase tracking-tighter">Research <span className="text-secondary">Directory</span></h2>
               <p className="text-text-main/50 font-bold uppercase tracking-widest text-sm">Explore our specialized centers of excellence</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {researchCenters.map((center, i) => (
                  <motion.div
                     key={center.id}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="group flex flex-col bg-white rounded-[4rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                  >
                     <div className="relative h-72 w-full overflow-hidden">
                        <Image 
                           src={center.image} 
                           alt={center.name} 
                           fill 
                           className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="absolute top-8 left-8">
                           <div className={cn(
                              "px-4 py-2 rounded-2xl backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-widest text-white shadow-xl",
                              "bg-black/20"
                           )}>
                              {center.category}
                           </div>
                        </div>

                        <div className="absolute bottom-8 right-8 scale-0 group-hover:scale-100 transition-transform duration-500">
                           <div className="w-16 h-16 bg-secondary text-primary rounded-full flex items-center justify-center shadow-xl">
                              <ArrowUpRight size={32} strokeWidth={3} />
                           </div>
                        </div>
                     </div>

                     <div className="p-12 space-y-8 flex-1 flex flex-col">
                        <div className="space-y-4">
                           <div className="flex items-center gap-4">
                              <div className={cn("p-4 rounded-2xl", center.color)}>
                                 <center.icon size={24} />
                              </div>
                              <h3 className="text-3xl font-black text-primary uppercase leading-tight group-hover:text-secondary transition-colors">
                                 {center.name}
                              </h3>
                           </div>
                           <p className="text-text-main/60 font-medium leading-relaxed">
                              {center.description}
                           </p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                           {center.focus.map(tag => (
                              <span key={tag} className="px-3 py-1 bg-surface rounded-full text-[10px] font-black uppercase tracking-wider text-primary/40 border border-gray-100">
                                 {tag}
                              </span>
                           ))}
                        </div>

                        <div className="pt-8 mt-auto border-t border-gray-50 flex items-center justify-between">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">Center Lead</p>
                              <p className="font-bold text-primary">{center.leads}</p>
                           </div>
                           <button onClick={(e) => actions.details(e)} className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors flex items-center gap-2">
                              View Portfolio <ArrowUpRight size={14} />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Featured Research / Collaboration */}
      <section className="py-24 bg-white relative overflow-hidden">
         <div className="container mx-auto px-4">
            <div className="relative p-12 lg:p-24 rounded-[4rem] bg-primary text-white overflow-hidden shadow-2xl">
               {/* Decorative background circle */}
               <motion.div 
                 animate={{ 
                   scale: [1, 1.2, 1],
                   rotate: [0, 90, 0]
                 }}
                 transition={{ 
                   duration: 20, 
                   repeat: Infinity,
                   ease: "linear"
                 }}
                 className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none" 
               />
               
               <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <h2 className="text-4xl lg:text-6xl font-black uppercase leading-tight tracking-tighter">
                           Collaborate <br /> <span className="text-secondary">With Us</span>
                        </h2>
                        <p className="text-white/60 text-lg font-medium leading-relaxed max-w-xl">
                           We partner with industry leaders, government bodies, and international universities to tackle the most pressing technological and social issues of our time.
                        </p>
                     </div>
                     <div className="flex flex-wrap gap-4 pt-6">
                        <button onClick={() => actions.inquiry("Partner Inquiry", { type: "contact", title: "Partner Inquiry", context: "Page: research-centers" })} className="px-10 py-5 bg-secondary text-primary rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all">
                           Partner Inquiry
                        </button>
                        <button onClick={() => actions.inquiry("Research Fellowships", { type: "contact", title: "Research Fellowships", context: "Page: research-centers" })} className="px-10 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-primary transition-all backdrop-blur-md">
                           Research Fellowships
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     {[
                        { label: "Partner Institutions", value: "350+" },
                        { label: "Active Projects", value: "1.2k+" },
                        { label: "PhD Researchers", value: "850+" },
                        { label: "Industry Partners", value: "120+" }
                     ].map((stat) => (
                        <div key={stat.label} className="p-8 bg-white/5 backdrop-blur-sm rounded-[2rem] border border-white/10 text-center space-y-2">
                           <div className="text-3xl font-black text-secondary">{stat.value}</div>
                           <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-surface text-center">
         <div className="container mx-auto px-4 max-w-4xl space-y-12">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="space-y-4"
            >
               <h3 className="text-3xl lg:text-5xl font-black text-primary uppercase tracking-tight">Stay Updated on <span className="text-secondary underline decoration-4 underline-offset-8">Research</span></h3>
               <p className="text-text-main/60 font-medium">Subscribe to our monthly research newsletter and impact reports.</p>
            </motion.div>
            
            <div className="relative max-w-2xl mx-auto">
               <input 
                  type="email" 
                  placeholder="Enter your email address..."
                  className="w-full px-10 py-6 rounded-3xl bg-white border border-gray-200 focus:ring-4 focus:ring-secondary/20 focus:border-secondary transition-all font-bold text-primary shadow-xl shadow-primary/5 placeholder:text-primary/20"
               />
               <button onClick={() => actions.inquiry("Newsletter subscription", { type: "subscribe", title: "Subscribe to updates", description: "Get the latest news and notices from the university." })} className="absolute right-3 top-3 bottom-3 px-10 bg-primary text-secondary rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-lg">
                  Subscribe
               </button>
            </div>
         </div>
      </section>
    </main>
  );
}
