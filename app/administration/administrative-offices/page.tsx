"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Stethoscope, 
  Terminal, 
  BadgeCent, 
  MessageSquareQuote, 
  Construction, 
  Trophy, 
  Newspaper,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  ChevronRight,
  Activity,
  Network,
  Scale
} from "lucide-react";
import { cn } from "@/lib/utils";

const offices = [
  {
    title: "Proctor Office",
    description: "Maintaining campus discipline, student safety, and coordinating security operations across the university territory.",
    icon: ShieldCheck,
    color: "bg-red-500/10 text-red-600",
    head: "Professor Dr. Md. Maksudur Rahman",
    designation: "Proctor",
    location: "Administrative Building, Ground Floor",
    email: "proctor@nextgen.edu",
    phone: "Ext: 105"
  },
  {
    title: "Medical Center",
    description: "Providing 24/7 emergency medical services, routine check-ups, and pharmaceutical support for students and faculty.",
    icon: Stethoscope,
    color: "bg-emerald-500/10 text-emerald-600",
    head: "Dr. Sarwar Jahan Khurshid",
    designation: "Chief Medical Officer",
    location: "University Medical Complex",
    email: "medical@nextgen.edu",
    phone: "Emergency: 999"
  },
  {
    title: "ICT Cell",
    description: "Driving the university's digital transformation, maintaining network infrastructure, and supporting e-governance systems.",
    icon: Terminal,
    color: "bg-blue-500/10 text-blue-600",
    head: "Professor Dr. Md. Adnan Maula",
    designation: "Director",
    location: "IT Tower, 3rd Floor",
    email: "ict@nextgen.edu",
    phone: "Support: 501"
  },
  {
    title: "Accounts & Finance",
    description: "Managing the institutional budget, student tuition fees, faculty payroll, and overall financial transparency.",
    icon: BadgeCent,
    color: "bg-amber-500/10 text-amber-600",
    head: "Md. Jashim Uddin",
    designation: "Director",
    location: "Finance Wing, 1st Floor",
    email: "accounts@nextgen.edu",
    phone: "Ext: 204"
  },
  {
    title: "Student Affairs",
    description: "Overseeing student organizations, career counseling, extracurricular activities, and welfare services.",
    icon: MessageSquareQuote,
    color: "bg-purple-500/10 text-purple-600",
    head: "Professor Dr. Novera Abbas",
    designation: "Director",
    location: "TSC, 2nd Floor",
    email: "student.affairs@nextgen.edu",
    phone: "Ext: 308"
  },
  {
    title: "Planning & Development",
    description: "Designing the university masterplan, overseeing infrastructure construction, and institutional expansion projects.",
    icon: Construction,
    color: "bg-orange-500/10 text-orange-600",
    head: "Engr. Md. Anisur Rahman",
    designation: "Director",
    location: "P&D Annexe, Ground Floor",
    email: "planning@nextgen.edu",
    phone: "Ext: 412"
  },
  {
    title: "Public Relations",
    description: "Managing university media relations, institutional branding, news publications, and official events.",
    icon: Newspaper,
    color: "bg-indigo-500/10 text-indigo-600",
    head: "Mahmood Alam",
    designation: "Director",
    location: "Senate Bhaban, Room 102",
    email: "pr@nextgen.edu",
    phone: "Ext: 110"
  },
  {
    title: "Physical Education",
    description: "Promoting physical wellness, managing athletic facilities, and organizing inter-university sports tournaments.",
    icon: Trophy,
    color: "bg-rose-500/10 text-rose-600",
    head: "Md. Shahjahan Ali",
    designation: "Director",
    location: "Central Gymnasium",
    email: "sports@nextgen.edu",
    phone: "Ext: 505"
  }
];

export default function AdministrativeOfficesPage() {
  return (
    <main className="flex flex-col min-h-screen pt-20 lg:pt-0">
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&h=600&auto=format&fit=crop"
          alt="Modern Administrative Corridor"
          fill
          className="object-cover opacity-15 scale-105 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-transparent to-primary" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl">
               <Network size={16} className="text-secondary" />
               <span className="text-xs font-bold uppercase tracking-[0.2em]">University Governance</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tight">
               Administrative <br/>
               <span className="text-secondary font-serif">Offices</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
               The backbone of university operations, facilitating student services, technical growth, and the institutional integrity of NextGen University.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Directory Section */}
      <section className="py-24 bg-surface relative overflow-hidden">
         {/* Decorative elements */}
         <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

         <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {offices.map((office, i) => (
                  <motion.div
                    key={office.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex flex-col bg-white p-8 rounded-[3rem] border border-primary/5 hover:border-secondary/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden"
                  >
                     <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className={cn("p-5 rounded-3xl shadow-sm transition-all duration-500 group-hover:scale-110", office.color)}>
                           <office.icon size={28} />
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-[10px] font-black text-primary/20 uppercase tracking-widest leading-none mb-1">Office Unit</span>
                           <span className="text-[14px] font-bold text-primary group-hover:text-secondary transition-colors">NGU-{String(i + 1).padStart(2, '0')}</span>
                        </div>
                     </div>

                     <div className="space-y-4 mb-8 flex-1 relative z-10">
                        <h3 className="text-2xl font-black text-primary uppercase leading-tight group-hover:text-secondary transition-colors">
                           {office.title}
                        </h3>
                        <p className="text-sm font-bold text-text-main/50 leading-relaxed">
                           {office.description}
                        </p>
                     </div>

                     <div className="space-y-6 pt-6 border-t border-primary/5 relative z-10">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em] mb-2 leading-none">Office Metadata</span>
                           <div className="space-y-3">
                              <div className="flex items-center gap-2 group/meta">
                                 <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                 <span className="text-[11px] font-bold text-primary/60 group-hover/meta:text-primary transition-colors">{office.head} ({office.designation})</span>
                              </div>
                              <div className="flex items-center gap-2 group/meta">
                                 <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                 <span className="text-[11px] font-bold text-primary/60 group-hover/meta:text-primary transition-colors underline decoration-secondary/30">{office.location}</span>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                           <button onClick={() => actions.mail("info@sums.edu")} className="flex items-center justify-center gap-2 py-3 bg-surface rounded-xl hover:bg-primary hover:text-white transition-all group/btn">
                              <Mail size={14} className="text-secondary group-hover/btn:text-white" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Email</span>
                           </button>
                           <button onClick={() => actions.tel("+880 2 5566 7788")} className="flex items-center justify-center gap-2 py-3 bg-surface rounded-xl hover:bg-primary hover:text-white transition-all group/btn">
                              <Phone size={14} className="text-secondary group-hover/btn:text-white" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Call</span>
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Support Vision */}
      <section className="py-24 bg-white overflow-hidden relative">
         <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-20">
               <div className="lg:w-1/2 space-y-10">
                  <div className="space-y-4">
                     <span className="text-secondary font-black text-sm uppercase tracking-widest">Service Delivery</span>
                     <h2 className="text-5xl lg:text-6xl font-black text-primary uppercase leading-tight tracking-tighter">
                        Institutional <br /> <span className="text-secondary font-serif">Support</span> Systems
                     </h2>
                  </div>
                  <p className="text-xl text-text-main/60 font-medium leading-relaxed max-w-xl">
                     Our administrative offices are dedicated to providing seamless support services to students and faculty, ensuring that everyday academic and personal campus life remains efficient, safe, and technologically forward.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-primary/5">
                     <div className="flex gap-4">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shrink-0">
                           <Activity size={24} className="text-secondary" />
                        </div>
                        <div className="space-y-1">
                           <h4 className="font-black text-primary uppercase text-sm">Emergency Support</h4>
                           <p className="text-[11px] font-bold text-primary/40 leading-tight">24/7 Response for life safety & medical needs.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shrink-0">
                           <Construction size={24} className="text-secondary" />
                        </div>
                        <div className="space-y-1">
                           <h4 className="font-black text-primary uppercase text-sm">Facility Requests</h4>
                           <p className="text-[11px] font-bold text-primary/40 leading-tight">Streamlined reporting for campus maintenance.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="lg:w-1/2 relative group">
                  <div className="absolute -inset-10 bg-secondary/10 blur-[100px] rounded-full group-hover:bg-secondary/20 transition-all duration-1000" />
                  <div className="relative aspect-[4/5] max-w-md mx-auto rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl shadow-primary/10">
                     <Image 
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&h=1600&auto=format&fit=crop"
                        alt="High Tech University Nerve Center"
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                     <div className="absolute bottom-10 left-10 right-10 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white transform group-hover:-translate-y-2 transition-transform">
                        <Scale size={32} className="text-secondary mb-4" />
                        <div className="text-sm font-black uppercase tracking-widest mb-1">University Integrity</div>
                        <div className="text-2xl font-bold">Standardized Administrative Framework</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </main>
  );
}
