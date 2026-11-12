"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Bus, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  PhoneCall, 
  ChevronRight, 
  Info,
  Calendar,
  Zap,
  Navigation,
  CreditCard,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  {
    name: "Campus Express",
    desc: "Direct shuttle between North and South Campus wings.",
    timing: "Every 15 mins",
    icon: Zap,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    name: "City Link",
    desc: "Connecting main campus to the City Central terminal.",
    timing: "Every 30 mins",
    icon: Navigation,
    color: "text-green-600",
    bg: "bg-green-50"
  },
  {
    name: "Residential Loop",
    desc: "Shuttle service for all off-campus student galleries.",
    timing: "Every 20 mins",
    icon: MapPin,
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    name: "Night Shuttle",
    desc: "Late-night service for library and lab students.",
    timing: "08:00 PM - 12:00 AM",
    icon: Clock,
    color: "text-orange-600",
    bg: "bg-orange-50"
  }
];

const schedule = [
  { busNo: "T-101", route: "Campus North → South", departure: "08:00 AM", interval: "15 Mins", status: "Active" },
  { busNo: "T-102", route: "Main Campus → Dorms", departure: "08:15 AM", interval: "20 Mins", status: "Active" },
  { busNo: "T-201", route: "City Center → Campus", departure: "07:30 AM", interval: "30 Mins", status: "Active" },
  { busNo: "T-202", route: "Station → Campus", departure: "07:45 AM", interval: "30 Mins", status: "Active" },
  { busNo: "T-301", route: "West Wing → Library", departure: "09:00 AM", interval: "10 Mins", status: "Active" },
];

export default function TransportPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[550px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/students/transport.png"
          alt="University Shuttle Service"
          fill
          className="object-cover opacity-40 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/80 to-primary" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 backdrop-blur-md border border-secondary/30 text-secondary">
                <Bus size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">NextGen Transit • Campus Motion</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-[0.9] uppercase tracking-tight">
                Move with <br/>
                <span className="text-secondary font-serif">Precision</span>
              </h1>
              
              <p className="text-xl text-white/70 max-w-xl font-medium leading-relaxed">
                Reliable, safe, and efficient transportation connecting all parts of the university. Your campus journey, simplified.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button onClick={() => actions.inquiry("Live Bus Tracking", { type: "contact", title: "Live Bus Tracking", context: "Page: Move with" })} className="px-10 py-4 bg-secondary text-primary rounded-2xl font-black uppercase tracking-widest text-sm hover:translate-y-[-5px] active:translate-y-0 transition-all shadow-2xl">
                  Live Bus Tracking
                </button>
                <button onClick={() => actions.inquiry("Full Schedule", { type: "contact", title: "Full Schedule", context: "Page: Move with" })} className="px-10 py-4 border-2 border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-primary transition-all">
                  Full Schedule
                </button>
              </div>
            </motion.div>

            {/* Transport Pass Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="hidden lg:block relative group"
            >
              <div className="w-[480px] aspect-[1.58/1] bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] transition-transform duration-700 group-hover:scale-125" />
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                           <Image src="/logo.png" alt="Logo" width={28} height={28} />
                        </div>
                        <span className="text-white font-black uppercase text-lg tracking-tighter">NextGen Transit</span>
                      </div>
                      <p className="text-[10px] uppercase font-bold text-white/40 tracking-[0.3em] ml-1">Student Universal Pass</p>
                    </div>
                    <div className="p-3 bg-secondary/10 rounded-2xl border border-secondary/20">
                       <Zap className="text-secondary" size={24} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1">
                       <h3 className="text-3xl font-black text-white uppercase tracking-tight">Tasnimul Haque</h3>
                       <p className="text-xs font-bold text-white/50 tracking-[0.2em] uppercase">Route: North Campus Link</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Active Member</span>
                       </div>
                       <div className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Expires: June 2026</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Decorative Icon */}
              <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-50 rotate-6 animate-float">
                 <Bus className="text-primary" size={32} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Routes Grid */}
      <section className="py-32 bg-slate-50/50">
        <div className="container mx-auto px-4">
           <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-4xl lg:text-6xl font-black text-primary uppercase tracking-tight leading-tight">
              Shuttle <span className="text-secondary">Networks</span>
            </h2>
            <p className="text-primary/50 text-lg font-medium leading-relaxed">
              We operate a widespread network of shuttle services designed to minimize wait times and maximize student comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {routes.map((route, i) => (
              <motion.div
                key={route.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white p-10 rounded-[3.5rem] border border-white shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500"
              >
                <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 transition-transform group-hover:scale-110", route.bg, route.color)}>
                  <route.icon size={32} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-primary tracking-tight uppercase">{route.name}</h3>
                  <p className="text-sm font-medium text-primary/40 leading-relaxed">
                    {route.desc}
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-secondary">
                     <Clock size={16} />
                     <span className="text-xs font-black uppercase tracking-widest">{route.timing}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Schedule */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
              <div className="lg:col-span-1 space-y-10 lg:sticky lg:top-32">
                 <div className="space-y-6">
                    <h2 className="text-5xl font-black text-primary uppercase tracking-tight">Daily <br/> <span className="text-secondary">Dispatch</span></h2>
                    <p className="text-lg text-primary/50 font-medium">Real-time schedule for the current academic session. Accurate and timely.</p>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle size={24} />
                       </div>
                       <div>
                          <h4 className="font-black text-primary uppercase text-sm mb-1">Service Delay</h4>
                          <p className="text-xs font-medium text-primary/40 leading-relaxed">Due to road maintenance on City Link, expect a 10-min delay on T-201 and T-202.</p>
                       </div>
                    </div>
                    <div className="p-8 bg-secondary/10 rounded-[2.5rem] border border-secondary/20 flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center flex-shrink-0">
                          <Calendar size={24} />
                       </div>
                       <div>
                          <h4 className="font-black text-primary uppercase text-sm mb-1">Special Service</h4>
                          <p className="text-xs font-medium text-primary/40 leading-relaxed">Orientation shuttle will run continuously this Sunday (June 15).</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-2">
                 <div className="bg-white rounded-[4rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="p-10 lg:p-14 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                       <h3 className="text-2xl font-black text-primary uppercase tracking-tight">Time Table</h3>
                       <button onClick={() => actions.print()} className="flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest hover:text-primary transition-colors">
                          Download PDF <ChevronRight size={16} />
                       </button>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead>
                             <tr className="border-b border-slate-50">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Bus No</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Route Direction</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30 text-center">First Trip</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30 text-right">Frequency</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {schedule.map((item, i) => (
                               <motion.tr 
                                 key={item.busNo}
                                 initial={{ opacity: 0, x: -20 }}
                                 whileInView={{ opacity: 1, x: 0 }}
                                 viewport={{ once: true }}
                                 transition={{ delay: i * 0.05 }}
                                 className="hover:bg-slate-50/50 transition-colors group cursor-default"
                               >
                                  <td className="px-10 py-8 font-black text-primary uppercase tracking-widest text-sm">{item.busNo}</td>
                                  <td className="px-6 py-8 font-bold text-primary group-hover:text-secondary transition-colors text-sm">{item.route}</td>
                                  <td className="px-6 py-8 text-center text-sm font-black text-primary/40 tracking-widest uppercase">{item.departure}</td>
                                  <td className="px-10 py-8 text-right text-sm">
                                     <span className="inline-block px-4 py-1.5 bg-slate-50 rounded-full font-black text-primary/60 text-[10px] uppercase tracking-widest">
                                        {item.interval}
                                     </span>
                                  </td>
                               </motion.tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                    <div className="p-10 lg:p-14 bg-primary/5 flex items-center gap-4 border-t border-slate-50">
                       <div className="flex -space-x-3">
                          {[1, 2, 3, 4].map(p => (
                            <div key={p} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                               <Image src={`/vc-portrait.png`} alt="User" fill className="object-cover grayscale" />
                            </div>
                          ))}
                       </div>
                       <p className="text-xs font-bold text-primary/40 uppercase tracking-widest leading-relaxed">
                          Over <span className="text-secondary">4,500 students</span> use our transit system daily.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Support & Pass */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
           <div className="bg-primary rounded-[4rem] p-12 lg:p-20 relative overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                 <div className="max-w-xl space-y-6 text-center lg:text-left">
                    <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight uppercase">
                      Need a <span className="text-secondary">Transport Pass?</span>
                    </h2>
                    <p className="text-lg text-white/50 font-medium">
                      All full-time students are eligible for a universal transport pass. Apply online or visit the transport office in the Main Admin Wing.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                       <button onClick={() => actions.inquiry("Apply Now", { type: "apply", title: "Apply Now", context: "Page: Move with" })} className="px-10 py-5 bg-white text-primary rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-secondary transition-all">
                          Apply Now
                       </button>
                       <button onClick={() => actions.inquiry("Lost Pass?", { type: "contact", title: "Lost Pass?", context: "Page: Move with" })} className="px-10 py-5 bg-white/5 border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-primary transition-all">
                          Lost Pass?
                       </button>
                    </div>
                 </div>

                 <div className="flex flex-col gap-6 w-full lg:w-auto">
                    <div className="flex items-center gap-6 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] text-white group hover:bg-white/10 transition-all">
                       <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary shadow-2xl group-hover:scale-110 transition-transform">
                          <PhoneCall size={28} />
                       </div>
                       <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Transit Desk</div>
                          <div className="text-xl font-black tracking-widest">+880 1622 333 444</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-6 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] text-white group hover:bg-white/10 transition-all">
                       <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary shadow-2xl group-hover:scale-110 transition-transform">
                          <MapPin size={28} />
                       </div>
                       <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Main Office</div>
                          <div className="text-xl font-black tracking-widest">Zone B, Entry 3</div>
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
