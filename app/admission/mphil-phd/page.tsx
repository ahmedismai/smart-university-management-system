"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Search, 
  Map, 
  Users, 
  Award, 
  BookOpen, 
  Globe, 
  Lightbulb, 
  Microscope,
  FileText,
  MessageSquare,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const phdSteps = [
  {
    title: "Research Proposal",
    description: "Define your research question and methodology under the guidance of our expert faculty.",
    icon: Search,
  },
  {
    title: "Candidacy Exam",
    description: "Demonstrate mastery of your field and readiness to contribute original knowledge.",
    icon: ShieldCheck,
  },
  {
    title: "The Dissertation",
    description: "Execute your primary research, making an original contribution to human understanding.",
    icon: Microscope,
  },
  {
    title: "The Defense",
    description: "Publicly present and defend your findings before a committee of global experts.",
    icon: Award,
  },
];

const researchAreas = [
  { title: "Quantum Computing", icon: Lightbulb, color: "text-blue-500" },
  { title: "Sustainable Policy", icon: Globe, color: "text-emerald-500" },
  { title: "Biomedical Ethics", icon: Microscope, color: "text-rose-500" },
  { title: "Structural Economics", icon: BookOpen, color: "text-amber-500" },
  { title: "Advanced Robotics", icon: Microscope, color: "text-indigo-500" },
  { title: "Humanistic Studies", icon: FileText, color: "text-purple-500" },
];

export default function MPhilPhDPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Authoritative Hero Section */}
      <section className="relative h-[60vh] min-h-[650px] flex items-center justify-center overflow-hidden">
        <Image
          src="/admission/phd-hero.png"
          alt="Advanced Doctoral Research"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/80 backdrop-blur-[4px]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/20 text-secondary shadow-xl overflow-hidden group">
                <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">Expanding Human Knowledge</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.05] uppercase tracking-tighter">
                Research <br/>
                <span className="text-secondary font-serif normal-case tracking-tight   opacity-90">Mastery</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
                M.Phil and Ph.D programs at NextGen University are designed for scholars seeking to define the future through disciplined inquiry and original research.
              </p>
              
              <div className="flex flex-wrap gap-5 pt-8 justify-center">
                <button onClick={(e) => actions.details(e)} className="px-12 py-5 bg-secondary text-primary rounded-2xl font-black uppercase tracking-[0.15em] text-sm hover:scale-[1.02] transition-all shadow-[0_20px_50px_rgba(255,191,0,0.15)] active:scale-95">
                  Submit Research Interest
                </button>
                <button onClick={() => actions.print()} className="px-12 py-5 border border-white/20 text-white rounded-2xl font-black uppercase tracking-[0.15em] text-sm hover:bg-white hover:text-primary transition-all backdrop-blur-sm active:scale-95">
                  Download Graduate Guide
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20"
        >
           <div className="w-[1.5px] h-24 bg-gradient-to-b from-secondary via-secondary to-transparent rounded-full mx-auto" />
        </motion.div>
      </section>

      {/* The Doctoral Journey */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
               <div className="space-y-4">
                  <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-none tracking-tight">The Doctoral <br/><span className="text-secondary font-serif normal-case  ">Roadmap</span></h2>
                  <div className="w-32 h-2 bg-secondary rounded-full" />
               </div>
               
               <p className="text-lg text-text-main/70 font-medium leading-relaxed">
                 Earning a Ph.D. is a rigorous commitment to mastery. Our roadmap ensures you have the structure and support needed to navigate the complexities of advanced research.
               </p>
               
               <div className="space-y-8">
                  {phdSteps.map((step, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-6 group"
                    >
                       <div className="flex-shrink-0 w-14 h-14 bg-surface rounded-2xl flex items-center justify-center text-primary group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                          <step.icon size={28} />
                       </div>
                       <div className="space-y-1 py-1">
                          <h4 className="text-xl font-black text-primary uppercase tracking-tight">{step.title}</h4>
                          <p className="text-sm font-medium text-text-main/50 leading-relaxed max-w-md">{step.description}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl"
            >
               <Image 
                src="/admission/phd-research.png" 
                alt="Intensive Research" 
                fill 
                className="object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Research Areas */}
      <section className="py-32 bg-surface">
        <div className="container mx-auto px-4">
           <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
              <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase tracking-tight">Core <span className="text-secondary font-serif normal-case  ">Research Areas</span></h2>
              <p className="text-text-main/60 text-lg font-medium">NextGen University offers specialized doctoral research across diverse and interdisciplinary domains.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchAreas.map((area, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="bg-white p-10 rounded-[3rem] border border-primary/5 hover:border-secondary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col items-center text-center space-y-6"
                >
                   <div className={cn("p-6 rounded-[2rem] bg-surface", area.color)}>
                      <area.icon size={32} />
                   </div>
                   <h3 className="text-xl font-black text-primary uppercase tracking-tight">{area.title}</h3>
                   <button onClick={() => actions.inquiry("Explore Projects", { type: "contact", title: "Explore Projects", context: "Page: Research" })} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-main/40 hover:text-secondary transition-colors">
                      Explore Projects <ArrowRight size={14} />
                   </button>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Mentorship & Support */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
           <div className="bg-primary rounded-[5rem] overflow-hidden relative">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                 <div className="p-12 lg:p-24 space-y-10 relative z-10">
                    <h2 className="text-4xl lg:text-6xl font-black text-white uppercase leading-none tracking-tighter">Scholarly <br/><span className="text-secondary font-serif   normal-case">Mentorship</span></h2>
                    <p className="text-xl text-white/60 leading-relaxed font-light">
                      A PhD journey is as much about the partnership with your supervisor as it is about the research. We match you with world-class mentors who are leaders in their respective fields.
                    </p>
                    
                    <div className="space-y-6">
                       <div className="flex items-center gap-4 text-white text-lg font-bold">
                          <CheckCircle className="text-secondary" /> 1:1 Research Supervision
                       </div>
                       <div className="flex items-center gap-4 text-white text-lg font-bold">
                          <CheckCircle className="text-secondary" /> Global Publication Support
                       </div>
                       <div className="flex items-center gap-4 text-white text-lg font-bold">
                          <CheckCircle className="text-secondary" /> International Conference Funding
                       </div>
                    </div>
                    
                    <button onClick={() => actions.inquiry("Find a Supervisor", { type: "contact", title: "Find a Supervisor", context: "Page: Research" })} className="px-10 py-5 bg-secondary text-primary rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all">Find a Supervisor</button>
                 </div>
                 
                 <div className="relative min-h-[400px] lg:min-h-full">
                    <Image 
                      src="/admission/phd-collaboration.png" 
                      alt="Mentorship" 
                      fill 
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary lg:to-primary" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Admission Requirements & Funding */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1">
              <div className="space-y-10">
                 <h3 className="text-4xl font-black text-primary uppercase tracking-tight leading-none">Admission <span className="text-secondary font-serif   normal-case">Requirements</span></h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { 
                        title: "Academic Background", 
                        desc: "Master's degree with high honors (GPA 3.7+ or equivalent) in a relevant discipline. Evidence of research potential and academic excellence." 
                      },
                      { 
                        title: "Research Interest", 
                        desc: "A compelling research proposal (1500-2000 words) outlining your proposed area of inquiry, methodology, and significance." 
                      },
                      { 
                        title: "Recommendations", 
                        desc: "Three academic reference letters from individuals who can attest to your research capabilities and scholarly discipline." 
                      },
                      { 
                        title: "Publications (Optional)", 
                        desc: "Any previous peer-reviewed publications or conference presentations will significantly strengthen your application." 
                      }
                    ].map((req, i) => (
                      <div key={i} className="flex gap-6 group p-8 rounded-[3rem] bg-surface/50 border border-transparent hover:border-secondary/20 transition-all">
                         <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-secondary/20 flex items-center justify-center text-secondary text-sm font-black group-hover:bg-secondary group-hover:text-primary transition-all">
                            {i + 1}
                         </div>
                         <div className="space-y-2">
                            <h4 className="font-black text-primary uppercase text-sm tracking-widest">{req.title}</h4>
                            <p className="text-sm font-medium text-text-main/50 leading-relaxed">{req.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>
    </main>
  );
}

function CheckCircle({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <div className={cn("flex-shrink-0 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary", className)}>
       <ShieldCheck size={size-4} />
    </div>
  )
}
