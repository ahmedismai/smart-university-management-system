"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { 
  Milestone, 
  Flag, 
  Rocket, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Trophy,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";

const timelineData = [
  {
    year: "2011",
    title: "The Foundation",
    description: "NextGen University of Bangladesh was founded with a vision to revolutionize higher education through technology and innovation. The first campus was established in the heart of Dhaka.",
    icon: Flag,
    color: "bg-blue-500",
  },
  {
    year: "2014",
    title: "Scaling Horizons",
    description: "The university celebrated its first convocation ceremony. Over 500 students graduated from the newly formed Engineering and Business Administration faculties.",
    icon: Trophy,
    color: "bg-amber-500",
  },
  {
    year: "2018",
    title: "Innovation Hub Launch",
    description: "Established the central Innovation Lab and Research Wing, securing major international grants for AI and Sustainable Energy research.",
    icon: Rocket,
    color: "bg-emerald-500",
  },
  {
    year: "2023",
    title: "Digital Revolution",
    description: "Launched the state-of-the-art Smart University Management System (SUMS), migrating all academic and administrative processes to a unified digital ecosystem.",
    icon: Cpu,
    color: "bg-purple-500",
  },
  {
    year: "2026",
    title: "Modern Excellence",
    description: "NextGen University is now ranked as the #1 Tech University in Bangladesh, fostering global partnerships and pioneering next-generation academic standards.",
    icon: Globe,
    color: "bg-indigo-500",
  }
];

export default function HistoryTimeline() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-20">
      {/* Central Progress Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-primary/5 -translate-x-1/2 hidden lg:block" />
      <motion.div 
        style={{ scaleY }}
        className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-secondary origin-top -translate-x-1/2 hidden lg:block" 
      />

      <div className="space-y-32 lg:space-y-48">
        {timelineData.map((item, idx) => {
          const isEven = idx % 2 === 0;
          
          return (
            <div key={item.year} className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
              {/* Desktop Mirroring */}
              <div className={cn(
                "w-full lg:w-1/2 flex items-center px-4 lg:px-16",
                isEven ? "lg:justify-end lg:text-right" : "lg:order-last lg:justify-start lg:text-left"
              )}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8 }}
                  className="max-w-xl space-y-4"
                >
                  <span className="text-4xl lg:text-5xl font-black text-secondary tracking-tighter block mb-2">
                    {item.year}
                  </span>
                  
                  <h3 className="text-2xl lg:text-3xl font-black text-primary tracking-tight uppercase">
                    {item.title}
                  </h3>
                  
                  <p className="text-base lg:text-lg font-medium text-text-main/50 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              </div>

              {/* Central Icon Container */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-4">
                 <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.1 }}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl bg-primary border-4 border-white",
                    )}
                 >
                    <item.icon size={18} />
                 </motion.div>
              </div>

              {/* Decorative Content Space (Desktop) */}
              <div className={cn(
                "w-full lg:w-1/2 hidden lg:flex items-center px-16",
                !isEven ? "lg:justify-end" : "lg:justify-start"
              )}>
                 <div className="w-full h-[1px] bg-primary/5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
