"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  History, 
  MapPin, 
  Award, 
  BookOpen, 
  Lightbulb, 
  Star 
} from "lucide-react";
import HistoryTimeline from "@/components/ui/HistoryTimeline";

const quickStats = [
  { label: "Years of Excellence", value: "15+", icon: History },
  { label: "Graduated Students", value: "25k+", icon: Award },
  { label: "Global Partners", value: "40+", icon: Star },
];

export default function HistoricalOutlinePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/about-university.png"
          alt="NextGen University Campus History"
          fill
          className="object-cover opacity-30 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-transparent to-primary" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl">
              <History size={16} className="text-secondary" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Established 2011</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight">
              Our Legacy & <br/>
              <span className="text-secondary   font-serif">Historical Journey</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto font-medium leading-relaxed">
               From a vision of digital empowerment to becoming the region's leading smart academic institution.
            </p>
          </motion.div>
        </div>

        {/* Floating Scroll Badge */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
           <span className="text-[10px] font-black uppercase tracking-widest">Scroll to Explore</span>
           <div className="w-[1px] h-12 bg-gradient-to-b from-secondary to-transparent" />
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 lg:py-32 bg-white relative">
        <div className="container mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <div className="w-12 h-1.5 bg-secondary rounded-full" />
                <h2 className="text-4xl lg:text-5xl font-black text-primary leading-tight tracking-tight">
                  A Beacon of <br/>
                  <span className="text-secondary  ">Modern Education</span>
                </h2>
              </div>

              <div className="space-y-6 text-lg text-text-main/70 leading-relaxed font-medium">
                <p>
                  NextGen University of Bangladesh (NGUB) was established with a bold mission: to bridge the gap between traditional academic knowledge and the rapidly evolving technological landscape. Founded by a group of visionary educators and industry leaders, NGUB has grown from a single-faculty institute to a comprehensive university with five world-class faculties.
                </p>
                <p>
                  Our history is defined by a relentless pursuit of excellence, early adoption of digital governance, and a commitment to producing graduates who are not just job-seekers, but innovators and problem-solvers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-primary/5">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="space-y-2">
                     <div className="flex items-center gap-2 text-secondary">
                        <stat.icon size={18} />
                        <span className="text-2xl font-black text-primary leading-none">{stat.value}</span>
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <Image
                src="/about-university.png"
                alt="University Heritage"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-primary/10" />
              {/* Floating Award Label */}
              <div className="absolute top-10 right-10 bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-2 border border-primary/5">
                 <Award size={32} className="text-secondary" />
                 <span className="text-[10px] font-black text-primary uppercase tracking-widest">Heritage Site</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-surface relative pt-12">
         <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-primary tracking-tight uppercase">Journey Through <span className="text-secondary  ">Time</span></h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
         </div>
         <HistoryTimeline />
      </section>

    </main>
  );
}
