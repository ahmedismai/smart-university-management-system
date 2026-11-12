"use client";

import { actions } from "@/lib/siteActions";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    title: "NextGen University of Bangladesh",
    subtitle: "Smart University Management System",
    description: "A secure, scalable, and intelligent digital platform to automate academic, administrative, and financial operations in one unified dashboard.",
    image: "/hero-1.png",
    cta: "Explore Dashboard",
    secondaryCta: "Learn More",
    stats: [
      { label: "Security", icon: ShieldCheck, value: "Bank-Grade" },
      { label: "Performance", icon: Zap, value: "Real-time" },
      { label: "Reach", icon: Globe, value: "Unified" }
    ]
  },
  {
    id: 2,
    title: "Enterprise-Grade Efficiency",
    subtitle: "Complete Digital Transformation",
    description: "Manage students, teachers, classes, attendance, results, fees, messaging, and library services with a modern system designed for transparency.",
    image: "/hero-2.png",
    cta: "Request Demo",
    secondaryCta: "View Features",
    stats: [
      { label: "Efficiency", icon: Zap, value: "100%" },
      { label: "Scalability", icon: Globe, value: "Infinite" },
      { label: "Transparency", icon: ShieldCheck, value: "Absolute" }
    ]
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // Changed to 8 seconds for a better rhythm
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      className="relative w-full h-[90vh] lg:h-screen overflow-hidden bg-primary"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image with Parallax & Zoom Effect */}
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "linear" }}
            className="relative w-full h-full"
          >
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              className="object-cover"
              priority
            />
            {/* Dynamic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent z-10" />
            
            {/* Animated Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.05] z-10 pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(var(--color-secondary) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
          </motion.div>

          {/* Content Overlay */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4 lg:px-12">
              <div className="max-w-3xl space-y-8">
                {/* Subtitle Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 backdrop-blur-md"
                >
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span className="text-secondary font-bold text-xs lg:text-sm uppercase tracking-[0.2em]">
                    {slides[currentSlide].subtitle}
                  </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight"
                >
                  {slides[currentSlide].title}
                </motion.h1>

                {/* Description Text */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed font-medium"
                >
                  {slides[currentSlide].description}
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="flex flex-wrap gap-5 pt-4"
                >
                  <button onClick={(e) => actions.details(e)} className="group relative px-8 py-4 bg-secondary text-primary rounded-xl font-black text-sm lg:text-base uppercase tracking-wider overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:-translate-y-1">
                    <span className="relative z-10 flex items-center gap-2">
                       {slides[currentSlide].cta}
                       <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-500 opacity-20" />
                  </button>
                  
                  <button onClick={(e) => actions.details(e)} className="px-8 py-4 bg-white/5 border border-white/20 backdrop-blur-md text-white rounded-xl font-bold text-sm lg:text-base uppercase tracking-wider hover:bg-white/10 transition-all">
                    {slides[currentSlide].secondaryCta}
                  </button>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="grid grid-cols-2 lg:grid-cols-3 gap-8 pt-12 lg:pt-20 border-t border-white/10"
                >
                  {slides[currentSlide].stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-500">
                        <stat.icon size={24} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-black text-lg lg:text-xl">{stat.value}</span>
                        <span className="text-white/40 text-xs font-bold uppercase tracking-widest">{stat.label}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>


     
    </section>
  );
}
