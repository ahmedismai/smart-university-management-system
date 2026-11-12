"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Target, 
  Compass, 
  Lightbulb, 
  ShieldCheck, 
  Users, 
  Cpu, 
  Globe,
  GraduationCap
} from "lucide-react";

const coreValues = [
  {
    title: "Global Excellence",
    description: "Striving for the highest standards in education, research, and innovation on a global scale.",
    icon: Globe,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Innovative Spirit",
    description: "Encouraging creative thinking and the adoption of cutting-edge technologies in all pursuits.",
    icon: Cpu,
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Integrity & Ethics",
    description: "Maintaining the highest moral and ethical standards in academic and professional life.",
    icon: ShieldCheck,
    color: "bg-teal-50 text-teal-600"
  },
  {
    title: "Student Centricity",
    description: "Prioritizing the growth, well-being, and success of our students in everything we do.",
    icon: Users,
    color: "bg-orange-50 text-orange-600"
  }
];

const missionPoints = [
  "To provide world-class education that integrates advanced technology with traditional academic values.",
  "To foster a research-driven environment that addresses local and global challenges through innovation.",
  "To empower students with the skills and mindset needed to lead in the digital era.",
  "To build a sustainable and inclusive academic community that promotes lifelong learning."
];

export default function VisionMissionPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/vision-mission-hero.png"
          alt="Vision and Mission"
          fill
          className="object-cover opacity-20 scale-105"
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
              <Target size={16} className="text-secondary" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Our Purpose</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight">
              Vision & <br/>
              <span className="text-secondary   font-serif">Mission</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
              Defining our path towards becoming a global leader in smart education and transformative research.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex p-5 rounded-3xl bg-secondary/10 text-secondary mb-4"
            >
              <Lightbulb size={48} strokeWidth={1.5} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl lg:text-5xl font-black text-primary tracking-tight uppercase">
                Our <span className="text-secondary  ">Vision</span>
              </h2>
              <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full" />
              <blockquote className="text-2xl lg:text-4xl font-medium text-text-main/80   leading-relaxed">
                "To be a premier global institution recognized for excellence in smart governance, technological innovation, and producing future leaders who drive positive societal change."
              </blockquote>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      </section>

      {/* Mission Section */}
      <section className="py-24 lg:py-32 bg-surface relative">
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
                <h2 className="text-4xl lg:text-5xl font-black text-primary leading-tight tracking-tight uppercase">
                  Our <br/>
                  <span className="text-secondary  ">Mission</span>
                </h2>
              </div>

              <div className="space-y-6">
                {missionPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 group"
                  >
                    <div className="mt-1.5 flex-shrink-0 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                      <GraduationCap size={14} className="text-primary" />
                    </div>
                    <p className="text-lg text-text-main/70 leading-relaxed font-medium">
                      {point}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square lg:aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <Image
                src="/vision-mission-hero.png"
                alt="University Mission"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-primary/20" />
              <div className="absolute bottom-10 left-10 p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 max-w-[280px]">
                <Compass size={40} className="text-secondary mb-4" />
                <p className="text-xl font-black text-primary leading-tight">Navigating the Future of Education</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-primary tracking-tight uppercase">
              Core <span className="text-secondary  ">Values</span>
            </h2>
            <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full" />
            <p className="text-xl text-text-main/60 max-w-2xl mx-auto">
              The foundational principles that guide every decision and action at NextGen University.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-[2rem] bg-surface hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-primary/5"
              >
                <div className={`p-4 rounded-2xl w-fit mb-6 ${value.color}`}>
                  <value.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-primary mb-3 uppercase tracking-tight">{value.title}</h3>
                <p className="text-text-main/70 leading-relaxed font-medium">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
