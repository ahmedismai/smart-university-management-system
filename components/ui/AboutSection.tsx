"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Users, 
  GraduationCap, 
  LayoutDashboard, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Database, 
  BookOpen,
  Mail,
  Calendar,
  CreditCard,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Founded", value: "2011", icon: Target },
  { label: "Tech Rank", value: "#1", icon: Zap },
  { label: "Vision", value: "Smart", icon: ShieldCheck },
  { label: "System", value: "NGUB", icon: LayoutDashboard },
];

const stakeholders = [
  {
    title: "Administrators",
    description: "Manage academic, financial, and operational activities from one secure dashboard.",
    icon: ShieldCheck,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Teachers",
    description: "Handle attendance, results, course assignments, and communication more efficiently.",
    icon: Users,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Students",
    description: "Access academic records, fees, attendance, routines, and announcements in real time.",
    icon: GraduationCap,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    title: "Parents",
    description: "Stay informed about attendance, results, and financial updates for their children.",
    icon: LayoutDashboard,
    color: "bg-indigo-500/10 text-indigo-500",
  },
];

const features = [
  { label: "Admissions", icon: BookOpen },
  { label: "Attendance", icon: Calendar },
  { label: "Results", icon: Zap },
  { label: "Fee Collection", icon: CreditCard },
  { label: "Messaging", icon: Mail },
  { label: "Library", icon: BookOpen },
];

const techStack = [
  { name: "Next.js", icon: Cpu },
  { name: "React", icon: Zap },
  { name: "Tailwind CSS", icon: LayoutDashboard },
  { name: "ShadCN UI", icon: ShieldCheck },
  { name: "Node.js", icon: Cpu },
  { name: "MongoDB", icon: Database },
  { name: "Zod", icon: ShieldCheck },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 lg:py-32 overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-secondary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Image & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-secondary to-primary opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500 rounded-[2rem]" />
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-primary/5 shadow-2xl shadow-primary/10">
                <Image
                  src="/campus-hero.png"
                  alt="NextGen University Campus"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Floating Status Card */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/80 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl">
                    <div className="grid grid-cols-2 gap-6">
                      {stats.map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/5 text-primary">
                            <stat.icon size={18} />
                          </div>
                          <div>
                            <p className="text-xl font-black text-primary leading-none">{stat.value}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mt-1">{stat.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mission Bubble */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-6 -right-6 lg:-right-12 bg-secondary text-primary px-8 py-6 rounded-3xl font-bold flex flex-col items-center shadow-xl"
            >
              <span className="text-3xl font-black">100%</span>
              <span className="text-xs uppercase tracking-widest font-black leading-tight text-center">Smart<br/>Education</span>
            </motion.div>
          </motion.div>

          {/* Right Side: Content */}
          <div className="space-y-10">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary"
              >
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em]">Our Vision & System</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-5xl font-black text-primary leading-[1.1]"
              >
                NextGen University <br/>
                <span className="text-secondary  ">of Bangladesh</span>
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-text-main/70 leading-relaxed font-medium"
            >
              <p>
                NextGen University of Bangladesh is a forward-thinking educational institution committed to delivering modern, innovative, and student-centered academic experiences. We combine academic excellence with smart technology to create a dynamic learning environment.
              </p>
              <p>
                To support this vision, we’ve introduced the <span className="text-primary font-bold">Smart University Management System (SUMS)</span>—a powerful digital platform designed to streamline and automate key academic and administrative processes, eliminating delays, errors, and communication gaps found in traditional systems.
              </p>
            </motion.div>

            {/* Stakeholders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stakeholders.map((person, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="p-5 rounded-2xl bg-surface border border-primary/5 hover:border-secondary/30 transition-all group"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", person.color)}>
                    <person.icon size={20} />
                  </div>
                  <h4 className="text-sm font-black text-primary mb-1 uppercase tracking-wider">{person.title}</h4>
                  <p className="text-xs text-text-main/50 leading-relaxed font-medium">
                    {person.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Tech Stack List */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="pt-8 border-t border-primary/5"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 mb-4">Powered by Enterprise Technologies</p>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {techStack.map((tech, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-primary/60 hover:text-secondary transition-colors cursor-default">
                    <tech.icon size={14} className="opacity-50" />
                    <span className="text-[11px] font-black uppercase tracking-widest">{tech.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature Highlights Banner */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 lg:mt-32 p-1 lg:p-2 rounded-[2.5rem] bg-primary shadow-2xl"
        >
          <div className="rounded-[2.2rem] border border-white/10 px-8 py-10 lg:py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center bg-gradient-to-b from-white/5 to-transparent">
            {features.map((feature, idx) => (
              <div key={idx} className="space-y-4 group">
                <div className="mx-auto w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-500 scale-90 group-hover:scale-100">
                  <feature.icon size={28} />
                </div>
                <span className="block text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
