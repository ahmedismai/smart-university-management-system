"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Clock, 
  Building2, 
  ChevronRight, 
  GraduationCap,
  Users,
  Heart,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const jobs = [
  {
    id: 1,
    title: "Professor of Artificial Intelligence",
    department: "Computer Science & Engineering",
    type: "Full-time",
    location: "Main Campus, Dhaka",
    deadline: "May 15, 2026",
    category: "Academic",
    salary: "Grade 1-3"
  },
  {
    id: 2,
    title: "Post-Doctoral Fellow (Quantum Computing)",
    department: "Innovation Lab",
    type: "Contract (2 Years)",
    location: "Main Campus, Dhaka",
    deadline: "May 20, 2026",
    category: "Research",
    salary: "Negotiable"
  },
  {
    id: 3,
    title: "Deputy Registrar (Academic)",
    department: "Registrar Office",
    type: "Full-time",
    location: "Administrative Block",
    deadline: "June 05, 2026",
    category: "Administrative",
    salary: "Grade 5"
  },
  {
    id: 4,
    title: "Senior Research Engineer (AR/VR)",
    department: "Research Center",
    type: "Full-time",
    location: "Main Campus, Dhaka",
    deadline: "May 12, 2026",
    category: "Research",
    salary: "Competitive"
  },
  {
    id: 5,
    title: "Associate Professor (Econometrics)",
    department: "Economics",
    type: "Full-time",
    location: "Main Campus, Dhaka",
    deadline: "June 10, 2026",
    category: "Academic",
    salary: "Grade 4"
  },
  {
    id: 6,
    title: "IT Support Specialist",
    department: "ICT Division",
    type: "Full-time",
    location: "Main Campus, Dhaka",
    deadline: "May 30, 2026",
    category: "Administrative",
    salary: "Grade 9-11"
  }
];

const categories = ["All Positions", "Academic", "Research", "Administrative"];

export default function CareerPage() {
  const [activeCategory, setActiveCategory] = useState("All Positions");

  const filteredJobs = activeCategory === "All Positions" 
    ? jobs 
    : jobs.filter(job => job.category === activeCategory);

  return (
    <main className="min-h-screen bg-white text-primary">
      {/* Refined Hero */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Image with refined overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/campus-hero.png" 
            alt="Campus Background"
            fill
            className="object-cover opacity-[0.07] grayscale"
            priority
          />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-6 text-secondary font-bold text-xs uppercase tracking-widest"
          >
            <span className="w-8 h-[1px] bg-secondary" />
            Careers at NextGen
            <span className="w-8 h-[1px] bg-secondary" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8"
          >
            Join a community of <br className="hidden md:block" />
            <span className="text-secondary font-serif">visionary</span> minds
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-primary/60 max-w-2xl mx-auto font-medium"
          >
            Empowering the next generation of global leaders through research, 
            innovation, and academic excellence.
          </motion.p>
        </div>
      </section>

      {/* Filter & Job Board */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Minimal Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-8 gap-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-xs font-bold transition-all border",
                      activeCategory === cat 
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/10" 
                        : "text-primary/40 border-gray-100 hover:border-primary/20 hover:text-primary"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="relative group min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20 group-hover:text-secondary transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search positions..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border-transparent border focus:bg-white focus:border-secondary/30 transition-all font-medium text-sm"
                />
              </div>
            </div>

            {/* List - Minimal and Professional */}
            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {filteredJobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group flex flex-col md:flex-row md:items-center justify-between p-8 rounded-2xl border border-gray-50 hover:border-gray-200 hover:bg-gray-50/30 transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-2.5 py-1 rounded-md">{job.category}</span>
                         <span className="text-[10px] font-bold text-primary/30 uppercase flex items-center gap-1">
                            <Clock size={12} /> {job.type}
                         </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-secondary transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-primary/40 font-medium">
                        <div className="flex items-center gap-1.5"><Building2 size={16} /> {job.department}</div>
                        <div className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</div>
                      </div>
                    </div>

                    <div className="mt-8 md:mt-0 flex items-center justify-between md:justify-end gap-12 border-t md:border-t-0 pt-6 md:pt-0 border-gray-100">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-primary/20 uppercase tracking-widest mb-1">Apply by</p>
                        <p className="font-bold text-sm text-primary/80">{job.deadline}</p>
                      </div>
                      <button onClick={(e) => actions.details(e)} className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-secondary transition-all active:scale-95">
                        View Details <ArrowUpRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Values */}
      <section className="py-32 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our workplace, your growth</h2>
              <p className="text-primary/50 font-medium text-lg">We provide an environment where your ambition can flourish.</p>
            </div>

            <div className="grid md:grid-cols-12 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
              {/* Values Bento Grid */}
              <div className="md:col-span-8 bg-white p-10 rounded-[2.5rem] border border-gray-200 flex flex-col justify-between group overflow-hidden relative">
                <Image src="/research-hero.png" alt="Research" fill className="object-cover opacity-0 group-hover:opacity-5 transition-opacity duration-700" />
                <div className="space-y-4 relative z-10">
                   <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-8"><Globe size={24} /></div>
                   <h3 className="text-2xl font-bold tracking-tight">Global Impact</h3>
                   <p className="text-primary/50 font-medium leading-relaxed max-w-md">Contribute to research that solves real-world challenges alongside worldwide partners.</p>
                </div>
                <div className="mt-8 relative z-10"><button onClick={(e) => actions.details(e)} className="text-sm font-bold text-secondary uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">Read stories <ChevronRight size={16}/></button></div>
              </div>

              <div className="md:col-span-4 bg-primary p-10 rounded-[2.5rem] flex flex-col justify-between text-white">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-secondary mb-8"><Heart size={24} /></div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold tracking-tight">Holistic Wellness</h3>
                  <p className="text-white/40 font-medium leading-relaxed">Comprehensive insurance and wellness plans for you and your family.</p>
                </div>
              </div>

              <div className="md:col-span-4 bg-white p-10 rounded-[2.5rem] border border-gray-200 flex flex-col justify-between">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-primary/40 mb-8"><GraduationCap size={24} /></div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold tracking-tight">Growth</h3>
                  <p className="text-primary/50 font-medium leading-relaxed">Sponsored higher education and research sabbaticals.</p>
                </div>
              </div>

              <div className="md:col-span-8 bg-secondary p-10 rounded-[2.5rem] flex items-center justify-between group overflow-hidden relative">
                 <div className="space-y-4 relative z-10">
                    <h3 className="text-3xl font-bold tracking-tight text-primary">Diverse Culture</h3>
                    <p className="text-primary/60 font-medium leading-relaxed max-w-sm">Join 1500+ professionals from 15+ countries.</p>
                 </div>
                 <Users className="w-48 h-48 text-primary/5 absolute -right-8 -bottom-8 group-hover:scale-110 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support CTA - Refined */}
      <section className="py-32 bg-white flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-2xl space-y-8">
           <h3 className="text-3xl md:text-5xl font-bold tracking-tight">Ready to shape <br /> the future?</h3>
           <p className="text-primary/50 font-medium text-lg">For technical queries or specific inquiries, our talent acquisition team is available to help.</p>
           <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => actions.inquiry("Contact HR Team", { type: "contact", title: "Contact HR Team", context: "Page: career" })} className="px-10 py-5 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-secondary transition-all shadow-xl shadow-primary/5">Contact HR Team</button>
              <button onClick={() => actions.inquiry("Support Center", { type: "contact", title: "Support Center", context: "Page: career" })} className="px-10 py-5 bg-gray-50 text-primary border border-gray-100 rounded-2xl font-bold text-sm hover:border-primary/20 transition-all">Support Center</button>
           </div>
        </div>
      </section>
    </main>
  );
}
