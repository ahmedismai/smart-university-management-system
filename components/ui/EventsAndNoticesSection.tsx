"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import { motion, Variants } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Bell, 
  ChevronRight, 
  Clock,
  Trophy,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const events = [
  {
    id: 1,
    title: "Annual Convocation Ceremony 2026",
    description: "Celebrating the achievements of our graduating class with a grand ceremony and distinguished guests.",
    date: "24",
    month: "APR",
    location: "Main Auditorium, NGUB",
    time: "10:00 AM",
    image: "/events/convocation.png",
    category: "Academic",
    icon: Trophy
  },
  {
    id: 2,
    title: "NextGen Tech Fest & Hackathon",
    description: "A 48-hour innovation challenge where students build solutions for real-world problems using cutting-edge tech.",
    date: "12",
    month: "MAY",
    location: "Innovation Hub, Level 4",
    time: "09:00 AM",
    image: "/events/tech-fest.png",
    category: "Technology",
    icon: Cpu
  }
];

const notices = [
  {
    id: 1,
    title: "Final Semester Registration Deadline Extended",
    date: "April 20, 2026",
    tag: "Urgent",
    type: "warning"
  },
  {
    id: 2,
    title: "Summer Internship Fair: List of Participating Companies",
    date: "April 18, 2026",
    tag: "Career",
    type: "info"
  },
  {
    id: 3,
    title: "New Research Grant Policy for Faculty and Students",
    date: "April 15, 2026",
    tag: "Academic",
    type: "general"
  },
  {
    id: 4,
    title: "Campus Wi-Fi Maintenance Schedule: Sunday Night",
    date: "April 12, 2026",
    tag: "Facility",
    type: "general"
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function EventsAndNoticesSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-white">
      {/* Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Events (8 Columns) */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/5 border border-primary/10 text-primary"
                >
                  <Calendar size={14} className="text-secondary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Happening Soon</span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl lg:text-5xl font-black text-primary leading-tight tracking-tight"
                >
                  Upcoming <span className="text-secondary  ">Events</span>
                </motion.h2>
              </div>
              <motion.button
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="group flex items-center gap-2 text-primary/60 hover:text-secondary font-black text-xs uppercase tracking-widest transition-all"
              >
                View Event Calendar
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className="group relative flex flex-col bg-surface rounded-3xl border border-primary/5 overflow-hidden transition-all duration-500 hover:border-secondary/30 hover:shadow-2xl hover:shadow-primary/5"
                >
                  {/* Event Image */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    {/* Date Badge */}
                    <div className="absolute top-6 left-6 flex flex-col items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-xl border border-primary/5">
                      <span className="text-xl font-black text-primary leading-none">{event.date}</span>
                      <span className="text-[10px] font-bold text-secondary uppercase">{event.month}</span>
                    </div>

                    {/* Category Label */}
                    <div className="absolute top-6 right-6">
                      <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-8 space-y-6 flex-1 flex flex-col">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-2 text-secondary">
                        <event.icon size={18} />
                        <h3 className="text-xl font-black text-primary group-hover:text-secondary transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                      </div>
                      <p className="text-sm font-medium text-text-main/50 leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-primary/5 space-y-3">
                      <div className="flex items-center gap-3 text-text-main/40 text-[11px] font-bold">
                        <MapPin size={14} className="text-primary/30" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-3 text-text-main/40 text-[11px] font-bold">
                        <Clock size={14} className="text-primary/30" />
                        {event.time}
                      </div>
                    </div>

                    <button onClick={() => actions.inquiry("Register Now", { type: "registration", title: "Register Now", context: "Page: ui" })} className="mt-6 w-full py-4 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-secondary hover:text-primary active:scale-95">
                      Register Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Notices (4 Columns) */}
          <div className="lg:col-span-4 space-y-12">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-secondary/10 border border-secondary/20 text-secondary"
              >
                <Bell size={14} className="animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Notice Board</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-black text-primary leading-tight tracking-tight"
              >
                Latest <span className="text-secondary  ">Notices</span>
              </motion.h2>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {notices.map((notice) => (
                <motion.div
                  key={notice.id}
                  variants={itemVariants}
                  className="group p-6 rounded-2xl bg-surface border border-primary/5 hover:border-secondary/30 transition-all hover:translate-x-1 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                       <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                          notice.type === "urgent" ? "bg-red-500 text-white" : 
                          notice.type === "warning" ? "bg-amber-500 text-white" :
                          notice.type === "info" ? "bg-blue-500 text-white" : "bg-primary/10 text-primary"
                        )}>
                          {notice.tag}
                        </span>
                        <span className="text-[10px] font-bold text-text-main/30 uppercase">{notice.date}</span>
                      </div>
                      <h4 className="text-sm font-black text-primary leading-snug group-hover:text-secondary transition-colors">
                        {notice.title}
                      </h4>
                    </div>
                    <div className="shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center border border-primary/5 text-primary/20 group-hover:text-secondary group-hover:border-secondary/30 transition-all">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.button
                variants={itemVariants}
                className="w-full py-5 rounded-2xl border-2 border-dashed border-primary/10 text-primary/40 font-black text-[10px] uppercase tracking-widest hover:border-secondary/50 hover:text-secondary transition-all"
              >
                View Archive Announcements
              </motion.button>
            </motion.div>

        </div>
      </div>
    </div>
  </section>
  );
}
