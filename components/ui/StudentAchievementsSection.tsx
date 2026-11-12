"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import { motion, Variants } from "framer-motion";
import { Trophy, Star, BookOpen, StarHalf, ArrowRight, ExternalLink, Award } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const achievements = [
  {
    id: 1,
    studentName: "Adnan Chowdhury",
    title: "Global Robotics Challenge: 1st Place",
    description: "Led the university team to victory at the 2026 World Robotics Summit in Singapore, developing an AI-driven rescue drone.",
    image: "/news/news_role_dashboards_hub_1776708512717.png", // Reusing news image
    category: "Technology",
    icon: Trophy,
    year: "2026"
  },
  {
    id: 2,
    studentName: "Sarah Ahmed",
    title: "National Research Fellowship",
    description: "Awarded for her groundbreaking research on sustainable urban architecture published in the International Journal of Engineering.",
    image: "/news/news_library_mgmt_system_1776708454384.png", // Reusing news image
    category: "Academic",
    icon: Award,
    year: "2026"
  },
  {
    id: 3,
    studentName: "Rakib Hassan",
    title: "Inter-University Debate Champion",
    description: "Crowned the Best Speaker at the National Parliamentary Debating Championship for consecutive two years.",
    image: "/news/news_orientation_day_1776708378873.png", // Reusing news image
    category: "Arts & Debate",
    icon: Star,
    year: "2025"
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function StudentAchievementsSection() {
  return (
    <section id="achievements" className="relative py-24 lg:py-32 overflow-hidden bg-surface">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-20 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white border border-primary/10 shadow-sm mb-8"
          >
            <div className="flex -space-x-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-secondary border border-white" />
              ))}
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary/70">Excellence in Action</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl lg:text-6xl font-black text-primary leading-tight tracking-tight mb-8"
          >
            All <span className="text-secondary  ">Achievements</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-main/50 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Celebrating the brilliance, innovation, and leadership of or students who are redefining excellence across the globe.
          </motion.p>
        </div>

        {/* Achievement Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {achievements.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="group relative bg-white rounded-3xl border border-primary/5 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Image Header */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.studentName}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors duration-500" />
                
                {/* Minimal Year Badge */}
                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-primary text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {item.year}
                  </span>
                </div>
              </div>

              {/* Content Context */}
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">
                      {item.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl lg:text-2xl font-black text-primary leading-tight group-hover:text-secondary transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 py-1">
                    <span className="text-sm font-bold text-primary">{item.studentName}</span>
                    <div className="h-[1px] flex-1 bg-primary/5" />
                  </div>
                  
                  <p className="text-sm font-medium text-text-main/50 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-primary/5">
                  <button onClick={(e) => actions.details(e)} className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest group/btn hover:text-secondary transition-colors">
                    View Full Story
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <button onClick={(e) => actions.details(e)} className="inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-primary/20 hover:bg-secondary hover:text-primary transition-all duration-500 hover:-translate-y-1 active:translate-y-0">
            View All Achievements
            <ExternalLink size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
