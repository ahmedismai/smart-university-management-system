"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const newsItems = [
  {
    id: 1,
    title: "Inaugural Orientation: Welcoming the Class of 2026",
    description: "NextGen University of Bangladesh officially welcomed its newest cohort with a comprehensive orientation program, emphasizing academic excellence, institutional values, and digital literacy through the SUMS platform.",
    category: "Campus Life",
    date: "April 2026",
    image: "/news/news_orientation_day_1776708378873.png"
  },
  {
    id: 2,
    title: "Digital Attendance Ecosystem: Precision in Academic Tracking",
    description: "Facilitating seamless academic governance, the university has transitioned to a fully integrated digital attendance system, providing real-time analytics for faculty, students, and parents.",
    category: "Academic Update",
    date: "April 2026",
    image: "/news/news_attendance_system_1776708398136.png"
  },
  {
    id: 3,
    title: "Financial Portal Update: Enhanced Scholarship & Fee Management",
    description: "Our centralized financial module now offers optimized transparency in fee processing, scholarship disbursements, and academic invoicing, ensuring a frictionless experience for all stakeholders.",
    category: "Finance",
    date: "April 2026",
    image: "/news/news_finance_portal_1776708418195.png"
  },
  {
    id: 4,
    title: "Advanced Library Automation: Empowering Academic Research",
    description: "The newly deployed Library Management System offers advanced bibliographic tracking, digital reservations, and automated overdue protocols, significantly enhancing the university's research infrastructure.",
    category: "Resources",
    date: "April 2026",
    image: "/news/news_library_mgmt_system_1776708454384.png"
  },
  {
    id: 5,
    title: "Optimized Semester Routine: Strategic Resource Allocation",
    description: "The university has published the current semester's academic routine, utilizing advanced conflict-resolution algorithms to ensure optimal class distribution and faculty coordination.",
    category: "Academic Notice",
    date: "April 2026",
    image: "/news/news_academic_routine_1776708473756.png"
  },
  {
    id: 6,
    title: "Unified Command Center: Personalized Role-Based Dashboards",
    description: "In our pursuit of a connected campus, the Smart University Management System now features personalized dashboards, synchronizing critical data for students, faculty, and administrative staff.",
    category: "System Update",
    date: "April 2026",
    image: "/news/news_role_dashboards_hub_1776708512717.png"
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function NewsSection() {
  return (
    <section id="news" className="relative py-24 lg:py-32 overflow-hidden bg-white">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="relative max-w-4xl mx-auto text-center mb-20 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-surface border border-primary/10 shadow-sm mb-8 select-none"
          >
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span className="text-[11px] lg:text-xs font-black uppercase tracking-[0.35em] text-primary/70">Updates & Insights</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-6xl font-black text-primary leading-[1.05] mb-10 tracking-tight"
          >
            Latest News & <br/>
            <span className="relative inline-block mt-2 font-serif   text-secondary">
               Academic Updates
              <motion.span 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent rounded-full opacity-40" 
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl lg:text-2xl text-text-main/40 max-w-3xl mx-auto font-medium leading-relaxed  "
          >
            Facilitating excellence through transparency, digital transformation, and professional communication across <span className="text-primary font-bold not- ">NextGen University</span>.
          </motion.p>
        </div>

        {/* News Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {newsItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="group relative flex flex-col bg-white rounded-[2rem] border border-primary/10 overflow-hidden transition-all duration-500 hover:border-secondary/30 hover:shadow-[0_20px_50px_rgba(15,46,93,0.05)]"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/0 transition-colors duration-500" />
                
                {/* Category Badge over Image */}
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 rounded-xl bg-white shadow-sm text-primary text-[10px] font-black uppercase tracking-widest border border-primary/5">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content Container */}
              <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-text-main/40 text-[10px] font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-secondary" />
                      {item.date}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-primary/20" />
                    <span className="font-black text-primary/30">Official Notice</span>
                  </div>

                  <h3 className="text-xl lg:text-2xl font-black text-primary leading-tight group-hover:text-secondary transition-colors duration-500">
                    {item.title}
                  </h3>

                  <p className="text-sm font-medium text-text-main/50 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-primary/5 flex items-center justify-between">
                  <button onClick={(e) => actions.details(e)} className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest group/btn transition-colors hover:text-secondary">
                    View Full Story 
                    <ArrowRight size={16} className="text-secondary/50 group-hover/btn:translate-x-1 group-hover/btn:text-secondary transition-all" />
                  </button>
                  <div className="flex -space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-primary/10" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
