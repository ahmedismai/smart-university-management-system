"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Palette, 
  Mic2, 
  Trophy, 
  Users, 
  ChevronRight, 
  Cpu, 
  Star,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const clubCategories = [
  {
    name: "Technology & Innovation",
    icon: Cpu,
    clubs: ["AI & Robotics Club", "Coding Society", "Cybersecurity Wing", "GDSC NextGen"],
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    name: "Creative Arts",
    icon: Palette,
    clubs: ["Visual Arts Guild", "Photography Society", "Drama & theater", "Design Lab"],
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    name: "Public Speaking",
    icon: Mic2,
    clubs: ["Debating Society", "MUN Association", "Toastmasters", "Linguistics Club"],
    color: "text-orange-600",
    bg: "bg-orange-50"
  },
  {
    name: "Sports & Fitness",
    icon: Trophy,
    clubs: ["Cricket Union", "Football Academy", "Chess Masters", "Athletics Club"],
    color: "text-green-600",
    bg: "bg-green-50"
  }
];

const upcomingEvents = [
  { 
    title: "Hackathon 2026", 
    date: "June 25-27", 
    organizer: "Coding Society", 
    desc: "A 48-hour marathon of innovation and building solutions for real-world problems.",
    status: "Active"
  },
  { 
    title: "Annual Debate Championship", 
    date: "July 02", 
    organizer: "Debating Society", 
    desc: "The biggest parliamentary debate event featuring teams from all departments.",
    status: "Active"
  },
  { 
    title: "Cultural Fest '26", 
    date: "July 12-15", 
    organizer: "Arts & Culture Council", 
    desc: "A celebration of diversity through music, dance, and traditional performances.",
    status: "Upcoming"
  },
  { 
    title: "Robot Sumo Challenge", 
    date: "August 05", 
    organizer: "AI & Robotics Club", 
    desc: "Test your engineering skills in a head-to-head robot wrestling competition.",
    status: "Upcoming"
  }
];

export default function ClubActivitiesPage() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-50/30">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/students/clubs-hero.png"
          alt="Student Collaboration"
          fill
          className="object-cover opacity-50 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary/20 backdrop-blur-md border border-secondary/30 text-secondary">
              <Star size={16} fill="currentColor" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">Join the Community • Thrive Together</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[0.85] uppercase tracking-tighter">
               Find Your <br/>
               <span className="text-secondary">Passion</span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
              From tech innovation to creative arts, our 50+ student-led clubs offer a platform to lead, learn, and legacy.
            </p>

            <div className="flex flex-wrap justify-center gap-5 pt-4">
              <button onClick={(e) => actions.details(e)} className="px-10 py-4 bg-secondary text-primary rounded-[2rem] font-black uppercase tracking-[0.15em] text-[13px] hover:scale-105 transition-all shadow-[0_20px_50px_rgba(255,191,0,0.2)]">
                Discover Clubs
              </button>
              <button onClick={(e) => actions.details(e)} className="px-10 py-4 border-2 border-white/20 text-white rounded-[2rem] font-black uppercase tracking-[0.15em] text-[13px] hover:bg-white hover:text-primary transition-all">
                Event Calendar
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Discovery */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 ">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end mb-24">
              <div className="space-y-6">
                <div className="h-1 w-20 bg-secondary rounded-full" />
                <h2 className="text-5xl lg:text-6xl font-black text-primary uppercase tracking-tight leading-tight">
                  Unleash Your <br/>
                  <span className="text-primary/20">Creativity</span>
                </h2>
              </div>
              <p className="text-xl text-primary/40 font-medium leading-relaxed max-w-xl">
                 Exploration shouldn't stop at the classroom. Dive into our diverse ecosystem of clubs and find your like-minded tribe.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {clubCategories.map((category, i) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white p-12 rounded-[4rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-700 overflow-hidden relative"
                >
                  <div className={cn("absolute -right-20 -top-20 w-64 h-64 opacity-5 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-125", category.bg)} />
                  
                  <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
                     <div className={cn("w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-inner shrink-0 group-hover:rotate-12 transition-transform duration-500", category.bg, category.color)}>
                        <category.icon size={40} />
                     </div>
                     <div className="space-y-6 flex-1">
                        <h3 className="text-3xl font-black text-primary uppercase tracking-tight">{category.name}</h3>
                        <div className="flex flex-wrap gap-2">
                           {category.clubs.map(club => (
                             <span key={club} className="px-4 py-2 bg-slate-50 text-primary/60 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-secondary transition-colors cursor-default">
                                {club}
                             </span>
                           ))}
                        </div>
                        <button onClick={(e) => actions.details(e)} className="flex items-center gap-2 text-secondary font-black text-[11px] uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                           View All Clubs <ArrowRight size={14} />
                        </button>
                     </div>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50/30 to-transparent" />
        
        <div className="container mx-auto px-4">
           <div className="flex flex-col lg:flex-row justify-between items-center mb-24 gap-12">
              <div className="space-y-4 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <span className="w-12 h-[2px] bg-secondary" />
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-secondary">The Calendar</span>
                </div>
                <h2 className="text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter">Campus <span className="text-secondary">Fests</span></h2>
              </div>
              <button onClick={() => actions.external("https://calendar.google.com")} className="px-12 py-5 bg-white text-primary rounded-full font-black uppercase tracking-widest text-sm hover:bg-secondary transition-all shadow-2xl">
                 Sync to My Google Calendar
              </button>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {upcomingEvents.map((event, i) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[4rem] group hover:bg-white/10 transition-all duration-500 overflow-hidden relative"
                >
                  <div className="absolute top-10 right-10 flex flex-col items-center">
                     <span className="text-4xl font-black text-secondary leading-none">{event.date.split(' ')[1]}</span>
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{event.date.split(' ')[0]}</span>
                  </div>

                  <div className="space-y-6 pt-4">
                     <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary mb-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                           <span className="text-[9px] font-black tracking-widest uppercase">{event.status}</span>
                        </div>
                        <h4 className="text-3xl font-black text-white uppercase tracking-tight group-hover:text-secondary transition-colors">{event.title}</h4>
                        <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">By {event.organizer}</p>
                     </div>
                     <p className="text-lg text-white/50 font-medium leading-relaxed max-w-lg">
                        {event.desc}
                     </p>
                     <div className="pt-4">
                        <button onClick={(e) => actions.details(e)} className="flex items-center gap-3 text-white font-black text-[11px] uppercase tracking-[0.3em] group-hover:gap-5 transition-all">
                           Registration Info <ChevronRight size={16} className="text-secondary" />
                        </button>
                     </div>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Join the Community */}
      <section className="py-40 relative">
        <div className="container mx-auto px-4">
           <div className="max-w-6xl mx-auto bg-white rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.04)] border border-slate-50 p-12 lg:p-24 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -ml-24 -mb-24" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <div className="space-y-12">
                    <div className="space-y-6">
                       <h2 className="text-5xl lg:text-6xl font-black text-primary uppercase tracking-tighter leading-[0.9]">Ready to <br/> <span className="text-secondary">Lead?</span></h2>
                       <p className="text-xl text-primary/40 font-medium leading-relaxed">Membership starts with one simple click. Join our community of 10,000+ active club members.</p>
                    </div>
                    
                    <div className="space-y-8">
                       {[
                         { step: "Pick your choice", desc: "Browse through the 50+ active registered clubs." },
                         { step: "Connect online", desc: "Follow the club's portal and join the discord/whatsapp hubs." },
                         { step: "Show up & Shine", desc: "Attend the first meeting and start your journey." }
                       ].map((item, i) => (
                         <div key={i} className="flex gap-8 group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-xl text-primary group-hover:bg-primary group-hover:text-secondary transition-all">
                               0{i + 1}
                            </div>
                            <div>
                               <h4 className="text-lg font-black text-primary uppercase tracking-tight">{item.step}</h4>
                               <p className="text-sm font-medium text-primary/30 leading-relaxed mt-1">{item.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-10">
                    <div className="bg-slate-50 p-10 lg:p-14 rounded-[4rem] border border-slate-100 space-y-8">
                       <div className="flex items-start gap-5">
                          <div className="p-4 bg-white rounded-2xl shadow-sm">
                             <Users className="text-secondary" size={32} />
                          </div>
                          <div>
                             <h3 className="text-xl font-black text-primary uppercase tracking-tight">Visit the CSU Office</h3>
                             <p className="text-sm font-medium text-primary/30 mt-1 leading-relaxed">Central Students' Union • TSC Area, Level 2</p>
                          </div>
                       </div>
                       <p className="text-sm font-medium text-primary/50 leading-relaxed">For manual registrations or forming a new club, visit our administrative office during standard hours.</p>
                       <div className="space-y-4">
                          <button onClick={(e) => actions.details(e)} className="w-full py-5 bg-primary text-secondary rounded-[2rem] font-black uppercase tracking-widest text-[13px] hover:translate-y-[-4px] transition-all shadow-xl">
                             Online Registration
                          </button>
                          <button onClick={() => actions.print()} className="w-full py-5 bg-white text-primary border border-slate-200 rounded-[2rem] font-black uppercase tracking-widest text-[13px] hover:bg-slate-50 transition-all">
                             View Club Constitution
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </main>
  );
}
