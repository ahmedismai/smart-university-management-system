"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Monitor, 
  TrendingUp, 
  Database, 
  Languages, 
  GraduationCap, 
  Activity,
  ArrowUpRight,
  ChevronRight,
  BookOpen,
  Microscope,
  Award,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

const institutes = [
  {
    id: "iit",
    code: "INS-01",
    name: "Institute of Information Technology",
    icon: Monitor,
    description: "Centering academic excellence in software engineering, digital transformation, and cybersecurity through high-end research.",
    focusAreas: ["Software Engineering", "AI & Data Science", "Network Security", "Cloud Computing"],
    color: "bg-blue-500/10 text-blue-600",
    image: "/faculty-engineering.png" // Reusing available professional asset
  },
  {
    id: "iba",
    code: "INS-02",
    name: "Institute of Business Administration",
    icon: TrendingUp,
    description: "The premier business school developing next-generation global leaders with strategic management and entrepreneurial excellence.",
    focusAreas: ["Strategic Management", "Finance", "Global Marketing", "Entrepreneurship"],
    color: "bg-emerald-500/10 text-emerald-600",
    image: "/faculty-business.png" // Reusing available professional asset
  },
  {
    id: "isrt",
    code: "INS-03",
    name: "Statistical Research & Training",
    icon: Database,
    description: "Advancing knowledge in statistical science and data analytics through rigorous research and professional training.",
    focusAreas: ["Applied Statistics", "Bio-statistics", "Econometrics", "Demography"],
    color: "bg-indigo-500/10 text-indigo-600",
    image: "/faculty-science.png" // Reusing available professional asset
  },
  {
    id: "iml",
    code: "INS-04",
    name: "Institute of Modern Languages",
    icon: Languages,
    description: "Fostering multi-lingual expertise and cross-cultural communication through comprehensive language studies and research.",
    focusAreas: ["Linguistics", "Foreign Languages", "Translation Studies", "Cultural Studies"],
    color: "bg-orange-500/10 text-orange-600",
    image: "/faculty-arts.png" // Reusing available professional asset
  },
  {
    id: "ier",
    code: "INS-05",
    name: "Institute of Education & Research",
    icon: GraduationCap,
    description: "Pioneering the future of pedagogy and educational policy through innovative research and teacher training programs.",
    focusAreas: ["Educational Policy", "Curriculum Design", "Teacher Training", "Special Education"],
    color: "bg-purple-500/10 text-purple-600",
    image: "/institute-ier.png"
  },
  {
    id: "ihe",
    code: "INS-06",
    name: "Institute of Health Economics",
    icon: Activity,
    description: "Leading research in health policy, healthcare financing, and the economic impact of medical advancements.",
    focusAreas: ["Health Policy", "Healthcare Financing", "Disease Economics", "Medical Ethics"],
    color: "bg-red-500/10 text-red-600",
    image: "/faculty-law.png" // Reusing available asset
  }
];

export default function InstitutesPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/institutes-hero.png"
          alt="Modern Research Institute Architecture"
          fill
          className="object-cover opacity-40 scale-105 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-transparent to-primary" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl">
               <Microscope size={16} className="text-secondary" />
               <span className="text-xs font-bold uppercase tracking-[0.2em]">Research Foundations</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tight">
               Research <br/>
               <span className="text-secondary font-serif">Institutes</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
               Specialized hubs of innovation and advanced study, shaping the future through targeted research and professional training.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="-mt-16 relative z-20 pb-12">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Research Staff", value: "250+", icon: Award },
                { label: "Annual Projects", value: "80+", icon: BookOpen },
                { label: "Global Partners", value: "120+", icon: Globe },
                { label: "Active Patents", value: "45+", icon: Monitor },
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-white p-6 rounded-3xl shadow-xl shadow-primary/5 border border-primary/5 text-center space-y-2 group hover:-translate-y-2 transition-all duration-300"
                >
                   <stat.icon className="mx-auto text-secondary group-hover:scale-110 transition-transform" size={24} />
                   <div className="text-3xl font-black text-primary">{stat.value}</div>
                   <div className="text-[10px] font-black text-text-main/40 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-12">
             <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-tight">
                   Excellence through <span className="text-secondary">Specialized</span> Research
                </h2>
                <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full" />
             </div>
             <p className="text-text-main/70 text-lg lg:text-xl font-medium leading-relaxed">
                Beyond traditional departments, NextGen University&apos;s Institutes are dedicated to providing high-end research environments and professional training. They serve as bridge between academic theory and real-world industrial application.
             </p>
          </div>
        </div>
      </section>

      {/* Institutes Grid */}
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {institutes.map((inst, index) => (
              <motion.div
                key={inst.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-primary/5 transition-all duration-500 flex flex-col shadow-sm hover:shadow-2xl hover:shadow-primary/5"
              >
                {/* Image Header */}
                <div className="relative h-60 overflow-hidden">
                   <Image 
                    src={inst.image} 
                    alt={inst.name} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                   
                   {/* Icon Badge */}
                   <div className={cn(
                    "absolute bottom-6 left-6 p-4 rounded-2xl shadow-xl transition-all duration-500 group-hover:-translate-y-2",
                    inst.color,
                    "bg-white"
                   )}>
                      <inst.icon size={24} />
                   </div>

                   <div className="absolute top-6 right-6 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-black text-white tracking-widest">
                      {inst.code}
                   </div>
                </div>

                <div className="p-8 space-y-6 flex-1 flex flex-col">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-primary leading-tight uppercase transition-colors group-hover:text-secondary">
                      {inst.name}
                    </h3>
                    <p className="text-sm font-medium text-text-main/60 leading-relaxed line-clamp-3">
                      {inst.description}
                    </p>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap gap-2">
                       {inst.focusAreas.map(focus => (
                         <span key={focus} className="px-3 py-1 rounded-lg text-[10px] font-bold text-primary/40 border border-primary/5 group-hover:border-secondary/20 group-hover:text-primary transition-all">
                           {focus}
                         </span>
                       ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-primary/5 flex items-center justify-between">
                    <button onClick={(e) => actions.details(e)} className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] group/btn">
                      View details <ArrowUpRight size={14} className="text-secondary group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                       <ChevronRight size={16} className="text-primary/20 group-hover:text-secondary transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Impact CTAs */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="bg-primary rounded-[3rem] p-8 lg:p-16 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-20 pointer-events-none transition-transform duration-1000 group-hover:scale-110">
                 <Image src="/institute-research.png" alt="Lab Research" fill className="object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                 <div className="space-y-8">
                    <div className="space-y-4">
                       <div className="h-1 w-20 bg-secondary rounded-full" />
                       <h3 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                          Leading through <br />
                          <span className="text-secondary font-serif">Innovation</span>
                       </h3>
                    </div>
                    <p className="text-white/70 text-lg font-medium leading-relaxed max-w-xl">
                       Our Institutes work at the intersection of academia and industry, solving complex global challenges through data-driven research and technological breakthroughs.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                       <button onClick={() => actions.go("/research/research-centers")} className="flex items-center gap-2 px-8 py-4 bg-secondary text-primary rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-secondary/20">
                          Research Directory
                       </button>
                       <button onClick={() => actions.inquiry("Contact Deans", { type: "contact", title: "Contact Deans", context: "Page: Research" })} className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-primary transition-all backdrop-blur-md">
                          Contact Deans
                       </button>
                    </div>
                 </div>

                 {/* Decorative Badge */}
                 <div className="hidden lg:flex justify-end">
                    <motion.div 
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        y: [0, -10, 10, 0]
                      }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                      className="w-80 h-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[4rem] p-12 flex flex-col justify-center items-center text-center space-y-6"
                    >
                       <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center shadow-2xl shadow-secondary/40">
                          <BookOpen size={40} className="text-primary" />
                       </div>
                       <div className="space-y-2">
                          <div className="text-4xl font-black text-white">500+</div>
                          <div className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Papers Published</div>
                       </div>
                    </motion.div>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </main>
  );
}
