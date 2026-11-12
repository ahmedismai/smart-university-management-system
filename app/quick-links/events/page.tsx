"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowUpRight, 
  Search, 
  Ticket, 
  Tag, 
  GraduationCap,
  Star,
  Building2,
  ChevronRight,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

const events = [
  {
    id: 1,
    title: "International Symposium on Quantum Resilience 2026",
    date: "May 15",
    month: "MAY",
    time: "09:00 AM - 05:00 PM",
    venue: "Main Auditorium",
    category: "Academic",
    status: "Featured",
    description: "Bringing together global leaders in quantum computing to discuss the future of secure communication."
  },
  {
    id: 2,
    title: "Eco-Tech Innovation Hackathon",
    date: "May 22 - 24",
    month: "MAY",
    time: "48 Hours Session",
    venue: "Innovation Lab",
    category: "Technology",
    status: "Registration Open",
    description: "A weekend of solving environmental challenges using sustainable technology and rapid prototyping."
  },
  {
    id: 3,
    title: "Annual Cultural Fusion Festival 2026",
    date: "June 02",
    month: "JUN",
    time: "04:00 PM - 11:00 PM",
    venue: "Central Plaza",
    category: "Cultural",
    status: "Upcoming",
    description: "Expanding the boundaries of traditional performance with a night of collaborative global arts."
  },
  {
    id: 4,
    title: "Inter-Faculty Football Championship Final",
    date: "May 18",
    month: "MAY",
    time: "03:30 PM",
    venue: "University Stadium",
    category: "Sports",
    status: "Matchday",
    description: "The grand finale between the Faculty of Law and Faculty of Engineering."
  },
  {
    id: 5,
    title: "Career Fair: Global Finance & FinTech",
    date: "June 10",
    month: "JUN",
    time: "10:00 AM - 04:00 PM",
    venue: "Senate Hall",
    category: "Career",
    status: "Upcoming",
    description: "Connecting our graduating seniors with top-tier global financial institutions and startups."
  },
  {
    id: 6,
    title: "Workshop: Advanced Research Methodologies",
    date: "May 12",
    month: "MAY",
    time: "11:00 AM",
    venue: "Library Seminar Room",
    category: "Academic",
    status: "Last Few Seats",
    description: "Specialized training for postgraduate students on metadata analysis and qualitative synthesis."
  }
];

const categories = ["All Events", "Academic", "Technology", "Cultural", "Sports", "Career"];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("All Events");
  const featuredEvent = events.find(e => e.status === "Featured");

  const filteredEvents = activeCategory === "All Events" 
    ? events 
    : events.filter(e => e.category === activeCategory);

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-primary text-center">
        <Image
          src="/research-hero.png"
          alt="University Events"
          fill
          className="object-cover opacity-20 scale-105 animate-slow-zoom"
          priority
        />
        
        <div className="container mx-auto px-4 relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-secondary shadow-2xl"
          >
             <Star size={16} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Highlights</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl lg:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter"
          >
             Global <br />
             <span className="text-secondary">Engagements</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-white/70 max-w-2xl mx-auto font-medium leading-relaxed"
          >
             From high-stakes academic symposia to vibrant cultural celebrations—be part of the events that define our legacy.
          </motion.p>
        </div>
      </section>

      {/* Featured Spotlight */}
      {featuredEvent && (
        <section className="-mt-20 relative z-30 pb-24">
           <div className="container mx-auto px-4">
              <motion.div 
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="max-w-6xl mx-auto bg-white rounded-[4rem] overflow-hidden shadow-[0_48px_120px_-20px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col lg:flex-row"
              >
                 <div className="lg:w-[45%] relative bg-primary">
                    <Image 
                       src="/research-hero.png" 
                       alt="Featured Event" 
                       fill 
                       className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-12">
                       <div className="space-y-4">
                          <div className="inline-flex px-4 py-2 bg-secondary text-primary rounded-full text-[10px] font-black uppercase tracking-widest">Featured Spotlight</div>
                          <h3 className="text-4xl text-white font-black leading-none uppercase tracking-tighter">Symposium <br /> <span className="text-secondary">2026</span></h3>
                       </div>
                    </div>
                 </div>
                 <div className="lg:w-[55%] p-12 lg:p-20 flex flex-col justify-between space-y-12">
                    <div className="space-y-6">
                       <div className="flex items-center gap-6">
                          <div className="text-center">
                             <div className="text-4xl font-black text-primary leading-none tracking-tighter">{featuredEvent.date}</div>
                             <div className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em]">{featuredEvent.month}</div>
                          </div>
                          <div className="h-12 w-px bg-gray-200" />
                          <div className="space-y-1">
                             <div className="text-[9px] font-black text-secondary uppercase tracking-widest">{featuredEvent.category}</div>
                             <h4 className="text-2xl font-black text-primary uppercase leading-tight">{featuredEvent.title}</h4>
                          </div>
                       </div>
                       <p className="text-lg text-text-main/60 font-medium leading-relaxed">
                          {featuredEvent.description}
                       </p>
                       <div className="flex flex-wrap gap-8">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-primary"><Clock size={18} /></div>
                             <span className="text-xs font-black text-primary uppercase">{featuredEvent.time}</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-primary"><MapPin size={18} /></div>
                             <span className="text-xs font-black text-primary uppercase">{featuredEvent.venue}</span>
                          </div>
                       </div>
                    </div>
                    <button onClick={() => actions.inquiry("Register Delegate", { type: "registration", title: "Register Delegate", context: "Page: events" })} className="flex items-center justify-center gap-4 px-12 py-6 bg-primary text-secondary rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                       Register Delegate <Ticket size={18} />
                    </button>
                 </div>
              </motion.div>
           </div>
        </section>
      )}

      {/* Directory Section */}
      <section className="py-24 bg-white">
         <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8 px-4">
               <div className="space-y-4">
                  <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase tracking-tighter">Event <span className="text-secondary  ">Explorer</span></h2>
                  <div className="flex flex-wrap gap-2">
                     {categories.map((cat) => (
                        <button 
                           key={cat}
                           onClick={() => setActiveCategory(cat)}
                           className={cn(
                              "px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
                              activeCategory === cat 
                                 ? "bg-secondary text-primary shadow-lg shadow-secondary/20" 
                                 : "bg-surface text-primary/40 hover:bg-secondary/10 hover:text-primary"
                           )}
                        >
                           {cat}
                        </button>
                     ))}
                  </div>
               </div>
               <div className="relative w-full lg:w-72">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                  <input type="text" placeholder="Find an event..." className="w-full pl-12 pr-6 py-4 rounded-2xl bg-surface border-none focus:ring-4 focus:ring-secondary/10 transition-all font-bold text-sm text-primary placeholder:text-primary/20 shadow-inner" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <AnimatePresence mode="popLayout">
                  {filteredEvents.map((event, i) => (
                     <motion.div
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: i * 0.05 }}
                        className="group bg-surface rounded-[3rem] p-10 border border-transparent hover:bg-white hover:border-secondary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col justify-between space-y-8"
                     >
                        <div className="space-y-6">
                           <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                 <span className="text-3xl font-black text-primary leading-none tracking-tighter">{event.date}</span>
                                 <span className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em]">{event.month}</span>
                              </div>
                              <span className={cn(
                                 "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                 event.status.includes("Registration") ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/5 text-primary/40"
                              )}>
                                 {event.status}
                              </span>
                           </div>
                           
                           <div className="space-y-2">
                              <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{event.category}</span>
                              <h4 className="text-2xl font-black text-primary uppercase leading-tight group-hover:text-secondary transition-colors">
                                 {event.title}
                              </h4>
                           </div>
                           
                           <p className="text-sm font-medium text-text-main/50 leading-relaxed line-clamp-2">
                              {event.description}
                           </p>

                           <div className="space-y-3 pt-4 border-t border-primary/5">
                              <div className="flex items-center gap-3 text-primary/40">
                                 <Clock size={14} className="text-secondary" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">{event.time}</span>
                              </div>
                              <div className="flex items-center gap-3 text-primary/40">
                                 <MapPin size={14} className="text-secondary" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">{event.venue}</span>
                              </div>
                           </div>
                        </div>

                        <button onClick={(e) => actions.details(e)} className="w-full py-4 bg-primary text-secondary rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center justify-center gap-2 group/btn">
                           View Details <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         </div>
      </section>

      {/* Collaboration Section */}
      <section className="py-32 bg-surface">
         <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div className="relative">
                  <div className="absolute -inset-10 bg-secondary/10 blur-[100px] rounded-full animate-pulse" />
                  <div className="relative bg-white rounded-[4rem] p-12 lg:p-24 shadow-2xl space-y-10 border border-gray-100">
                     <div className="space-y-4 text-center">
                        <div className="w-20 h-20 bg-surface rounded-3xl flex items-center justify-center text-secondary mx-auto shadow-inner">
                           <Building2 size={36} />
                        </div>
                        <h3 className="text-3xl font-black text-primary uppercase tracking-tighter">Host Your <br /> <span className="text-secondary">Initiative</span></h3>
                        <p className="text-text-main/60 font-medium">Departments and registered student clubs can propose events for the institutional calendar.</p>
                     </div>
                     <div className="space-y-4">
                        <button onClick={() => actions.inquiry("Submit Event Proposal", { type: "contact", title: "Submit Event Proposal", context: "Page: events" })} className="w-full py-6 bg-primary text-secondary rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                           Submit Event Proposal <Plus size={20} />
                        </button>
                        <button onClick={() => actions.inquiry("Request: Venue Booking Policy", { type: "contact", title: "Venue Booking Policy", description: "Tell us how to reach you and we will send you this information." })} className="w-full py-6 bg-white text-primary border border-gray-100 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:border-secondary transition-all">
                           Venue Booking Policy
                        </button>
                     </div>
                  </div>
               </div>

               <div className="space-y-12">
                  <div className="space-y-6">
                     <h2 className="text-4xl lg:text-6xl font-black text-primary uppercase leading-[0.9] tracking-tighter">
                        Engage. <br /> Innovate. <br /> <span className="text-secondary">Celebrate.</span>
                     </h2>
                     <p className="text-xl text-text-main/60 font-medium leading-relaxed">
                        Our campus is a stage for global thinkers and future leaders. Whether it's a guest lecture or a sports final, every event is an opportunity for growth.
                     </p>
                  </div>

                  <div className="space-y-6">
                     {[
                        { icon: Users, title: "150+ Annual Events", desc: "A vibrant calendar active throughout the academic year." },
                        { icon: GraduationCap, title: "Academic Rigor", desc: "Seminars led by global faculty and researchers." },
                        { icon: Star, title: "Campus Traditions", desc: "Iconic celebrations that define university life." }
                     ].map((item) => (
                        <div key={item.title} className="flex gap-6 items-start group">
                           <div className="shrink-0 w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all">
                              <item.icon size={24} />
                           </div>
                           <div className="space-y-1">
                              <h4 className="font-black text-primary uppercase text-sm tracking-tight">{item.title}</h4>
                              <p className="text-xs font-bold text-text-main/40 uppercase leading-snug">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Calendar Subscription Section */}
      <section className="py-24 bg-white text-center">
         <div className="container mx-auto px-4 max-w-4xl space-y-12">
            <div className="space-y-4">
               <h3 className="text-3xl lg:text-5xl font-black text-primary uppercase tracking-tighter">Sync your <span className="text-secondary text-serif underline decoration-4 underline-offset-8">Lifestyle</span></h3>
               <p className="text-text-main/60 font-medium text-lg max-w-2xl mx-auto">Never miss an institutional milestone. Subscribe to our official calendar feed directly into your specialized device.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
               <button onClick={() => actions.external("https://calendar.google.com")} className="flex items-center gap-3 px-12 py-5 bg-surface text-primary rounded-2xl font-black uppercase text-sm tracking-widest hover:border-secondary transition-all border border-transparent">
                   Subscribe iCal Hub
               </button>
               <button onClick={() => actions.go("/academics/academic-calendar")} className="flex items-center gap-3 px-12 py-5 bg-primary text-secondary rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  Full Monthly Calendar <ArrowUpRight size={18} />
               </button>
            </div>
         </div>
      </section>
    </main>
  );
}
