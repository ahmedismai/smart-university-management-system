"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  FlaskConical, 
  Binary, 
  Palette, 
  Briefcase, 
  Scale, 
  GraduationCap, 
  Microscope,
  Cpu,
  ChevronRight,
  ArrowUpRight,
  Library,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const faculties = [
  {
    id: "science",
    code: "F-01",
    name: "Faculty of Science",
    icon: FlaskConical,
    description: "Leading in fundamental research and exploration of the natural world through rigorous methodology.",
    departments: ["Physics", "Chemistry", "Mathematics", "Statistics", "Biology"],
    color: "bg-blue-500/10 text-blue-600",
    image: "/faculty-science.png"
  },
  {
    id: "engineering",
    code: "F-02",
    name: "Faculty of Engineering & Tech",
    icon: Cpu,
    description: "Innovating the future with state-of-the-art technology and sustainable engineering solutions.",
    departments: ["Computer Science", "Electrical Engineering", "Civil Engineering", "Mechanical", "Architecture"],
    color: "bg-orange-500/10 text-orange-600",
    image: "/faculty-engineering.png"
  },
  {
    id: "business",
    code: "F-03",
    name: "Faculty of Business Studies",
    icon: Briefcase,
    description: "Developing next-generation global leaders and entrepreneurs with strategic management excellence.",
    departments: ["Accounting", "Finance", "Marketing", "Management", "International Business"],
    color: "bg-emerald-500/10 text-emerald-600",
    image: "/faculty-business.png"
  },
  {
    id: "arts",
    code: "F-04",
    name: "Faculty of Arts & Humanities",
    icon: Palette,
    description: "Exploring the depth of human expression, culture, and history through critical inquiry.",
    departments: ["English", "History", "Philosophy", "Fine Arts", "Linguistics"],
    color: "bg-purple-500/10 text-purple-600",
    image: "/faculty-arts.png"
  },
  {
    id: "law",
    code: "F-05",
    name: "Faculty of Law",
    icon: Scale,
    description: "Upholding justice and legal excellence through comprehensive study of jurisprudence and human rights.",
    departments: ["General Law", "Corporate Law", "Human Rights", "International Law"],
    color: "bg-red-500/10 text-red-600",
    image: "/faculty-law.png"
  },
  {
    id: "social-science",
    code: "F-06",
    name: "Faculty of Social Sciences",
    icon: Library,
    description: "Understanding societies and making structural impacts through data-driven research and policy.",
    departments: ["Economics", "Sociology", "Political Science", "Psychology", "Anthropology"],
    color: "bg-indigo-500/10 text-indigo-600",
    image: "/faculty-social.png"
  }
];

export default function FacultiesPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/faculties-hero.png"
          alt="Modern University Academic Building"
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
              <GraduationCap size={16} className="text-secondary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Academic Excellence</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tight">
              Our <br/>
              <span className="text-secondary font-serif">Faculties</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
              Explore our diverse range of academic disciplines, led by world-class educators and researchers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-12">
             <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-tight">
                   Centers of <span className="text-secondary">Transformative</span> Learning
                </h2>
                <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full" />
             </div>
             <p className="text-text-main/70 text-lg lg:text-xl font-medium leading-relaxed">
                NextGen University is organized into 12 primary faculties, each dedicated to advancing knowledge in its specific field. Our faculties provide a vibrant ecosystem for interdisciplinary research and student-centric education.
             </p>
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-24 bg-surface relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faculties.map((faculty, index) => (
              <motion.div
                key={faculty.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-[2rem] overflow-hidden border border-primary/5 transition-all duration-500 flex flex-col shadow-sm hover:shadow-2xl hover:shadow-primary/5"
              >
                {/* Faculty Card Image Header */}
                <div className="relative h-56 overflow-hidden">
                   <Image 
                    src={faculty.image} 
                    alt={faculty.name} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   
                   {/* Code Badge */}
                   <div className="absolute top-6 right-6 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-black text-white tracking-widest">
                      {faculty.code}
                   </div>
                </div>

                <div className="p-8 space-y-6 flex-1 flex flex-col relative">
                  {/* Floating Icon */}
                  <div className={cn(
                    "absolute -top-8 left-8 p-4 rounded-2xl shadow-xl transition-all duration-500 group-hover:-translate-y-2",
                    faculty.color,
                    "bg-white border border-primary/5"
                   )}>
                     <faculty.icon size={24} />
                  </div>

                  <div className="pt-4 space-y-3">
                    <h3 className="text-2xl font-black text-primary leading-tight uppercase transition-colors group-hover:text-secondary">
                      {faculty.name}
                    </h3>
                    <p className="text-sm font-medium text-text-main/60 leading-relaxed line-clamp-2">
                      {faculty.description}
                    </p>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap gap-2">
                       {faculty.departments.map(dept => (
                         <span key={dept} className="px-3 py-1 rounded-lg text-[10px] font-bold text-primary/40 border border-primary/5 group-hover:border-secondary/20 group-hover:text-primary transition-all">
                           {dept}
                         </span>
                       ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-primary/5 flex items-center justify-between">
                    <button onClick={(e) => actions.details(e)} className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] group/btn">
                      Explore Faculty <ArrowUpRight size={14} className="text-secondary group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center group-hover:bg-secondary transition-colors duration-500">
                       <ChevronRight size={14} className="text-primary/20 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Resources Callout */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
           <div className="bg-primary rounded-[3rem] p-12 lg:p-20 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                 <Image src="/ordinance-hero.png" alt="Overlay" fill className="object-cover" />
              </div>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-6">
                    <h3 className="text-4xl font-black text-white uppercase tracking-tight leading-tight">Academic <span className="text-secondary font-serif">Support</span> & Growth</h3>
                    <p className="text-white/60 text-lg font-medium leading-relaxed">
                       From interdisciplinary research centers to high-end labs, our faculties are equipped with everything needed for modern academic excellence.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                       <button onClick={() => actions.go("/academics/departments")} className="flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-bold hover:bg-secondary hover:text-primary transition-all">
                          <BookOpen size={18} /> Course Catalog
                       </button>
                       <button onClick={() => actions.go("/academics/departments")} className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white hover:text-primary transition-all">
                          Research Areas
                       </button>
                    </div>
                 </div>
                 <div className="hidden md:flex justify-end">
                    <div className="w-64 h-64 border-2 border-white/20 rounded-full flex items-center justify-center relative">
                       <div className="w-48 h-48 border-2 border-white/10 rounded-full flex items-center justify-center animate-pulse">
                          <div className="w-32 h-32 bg-secondary rounded-full flex items-center justify-center shadow-2xl shadow-secondary/50">
                             <GraduationCap size={48} className="text-primary" />
                          </div>
                       </div>
                       <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-secondary/40 rounded-full"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </main>
  );
}
