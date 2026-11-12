"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  User, 
  Award, 
  Briefcase, 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar,
  Globe,
  ChevronRight,
  ShieldCheck,
  Zap,
  Target,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const officeStaff = [
  { 
    name: "Dr. Ahmed Rahman", 
    role: "Special Assistant to the VC", 
    mail: "ahmed.rahman@university.gov", 
    phone: "+880 1711-XXXXXX",
    image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=400&h=400&auto=format&fit=crop"
  },
  { 
    name: "Ms. Sarah Khan", 
    role: "Private Secretary", 
    mail: "sarah.khan@university.gov", 
    phone: "+880 1712-XXXXXX",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&auto=format&fit=crop"
  },
  { 
    name: "Mr. Tanvir Hossain", 
    role: "Administrative Officer", 
    mail: "tanvir.h@university.gov", 
    phone: "+880 1713-XXXXXX",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400&h=400&auto=format&fit=crop"
  },
  { 
    name: "Mrs. Nasrin Sultana", 
    role: "Public Relations Officer", 
    mail: "nasrin.s@university.gov", 
    phone: "+880 1714-XXXXXX",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&auto=format&fit=crop"
  }
];

export default function OfficeOfVCPage() {
  return (
    <main className="flex flex-col min-h-screen pt-20 lg:pt-0">
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/campus-hero.png" // Reusing grand campus shot
          alt="Majestic University Gateway"
          fill
          className="object-cover opacity-30 shadow-inner"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-transparent to-primary" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl">
               <ShieldCheck size={16} className="text-secondary" />
               <span className="text-xs font-bold uppercase tracking-[0.2em]">Leadership & Excellence</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tight">
               Office of <br/>
               <span className="text-secondary font-serif">The Vice Chancellor</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
               The apex administrative office overseeing the strategic vision, academic integrity, and future-ready transformations of NextGen University.
            </p>
          </motion.div>
        </div>
      </section>

      {/* VC Profile Section */}
      <section className="py-24 bg-surface relative overflow-hidden">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
               {/* Image Side */}
               <motion.div 
                 initial={{ opacity: 0, x: -30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="lg:w-1/3 relative"
               >
                  <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl z-10 bg-primary/10">
                     <Image 
                       src="/vc-portrait.png" 
                       alt="Professor Dr. Md. Amdad Islam" 
                       fill 
                       className="object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
                  
                  <div className="mt-8 space-y-2 text-center lg:text-left">
                     <h2 className="text-2xl font-black text-primary uppercase">Professor Dr. Md. Amdad Islam</h2>
                     <p className="text-secondary font-bold tracking-widest uppercase text-xs">Vice Chancellor</p>
                  </div>
               </motion.div>

               {/* Content Side */}
               <div className="lg:w-2/3 space-y-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                  >
                     <div className="inline-block px-4 py-1.5 bg-primary text-secondary rounded-full font-black text-[10px] uppercase tracking-widest">Biography</div>
                     <h3 className="text-4xl font-black text-primary uppercase leading-tight">
                        A Legacy of academic <br /> and <span className="text-secondary">Administrative leadership</span>
                     </h3>
                     <p className="text-text-main/60 font-medium leading-relaxed text-lg">
                        Professor Dr. Md. Amdad Islam took office as the 29th Vice-Chancellor of NextGen University. A visionary academician and a pioneer in the field of Applied Sciences, he has dedicated over three decades to elevating the standards of higher education in Bangladesh.
                     </p>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {[
                        { title: "Academic Excellence", desc: "Ph.D. from Commonwealth University, Post-Doc from MIT Research Labs.", icon: Award },
                        { title: "Strategic Vision", desc: "Implementing 'Smart University 2030' framework for digital transformation.", icon: Target },
                        { title: "Global Research", desc: "Published 150+ papers in Q1 journals and holds 5 international patents.", icon: Globe },
                        { title: "Administrative Mastery", desc: "Former Dean and Pro-VC with 15+ years of institutional governance.", icon: Zap },
                     ].map((item, i) => (
                        <motion.div 
                          key={item.title}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="p-8 bg-white rounded-[2rem] border border-primary/5 shadow-sm group hover:border-secondary transition-all duration-500"
                        >
                           <item.icon className="text-secondary mb-4 group-hover:scale-110 transition-transform" size={32} />
                           <h4 className="text-xl font-black text-primary mb-2 uppercase tracking-tight">{item.title}</h4>
                           <p className="text-sm font-medium text-text-main/50 leading-relaxed">{item.desc}</p>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* VC's Message Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
         <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto rounded-[4rem] bg-white p-12 lg:p-24 relative shadow-2xl shadow-black/20">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <MessageSquare size={200} className="text-primary" />
               </div>
               
               <div className="space-y-10 relative z-10 text-center lg:text-left">
                  <div className="space-y-4">
                     <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-tight tracking-tight">
                        Vice Chancellor's <br /> <span className="text-secondary">Message</span>
                     </h2>
                     <div className="h-2 w-24 bg-secondary rounded-full" />
                  </div>
                  
                  <div className="space-y-6 text-text-main/60 font-medium text-xl   leading-relaxed font-serif">
                     <p>&ldquo;NextGen University is more than an institution; it is a cradle of innovation and human values. Our mission is to empower the youth of Bangladesh with global standards of knowledge while rooted in our deep cultural heritage.&rdquo;</p>
                     <p>&ldquo;In this digital era, we are committed to building a Smarter University—one that fosters critical thinking, research impact, and entrepreneurial spirit. I invite you all to join us in this journey of transformation.&rdquo;</p>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-primary/5">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-secondary text-primary flex items-center justify-center font-black text-2xl">A</div>
                        <div>
                           <p className="text-xl font-black text-primary uppercase leading-none">Professor Dr. Md. Amdad Islam</p>
                           <p className="text-sm font-bold text-secondary uppercase tracking-widest mt-2">Vice-Chancellor</p>
                        </div>
                     </div>
                     <button onClick={(e) => actions.details(e)} className="flex items-center gap-3 px-8 py-5 bg-primary text-secondary rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        Read Full Message <ArrowUpRight size={18} />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Administrative Staff Section */}
      <section className="py-24 bg-surface">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-6">
               <div className="space-y-4">
                  <div className="h-1.5 w-24 bg-secondary rounded-full" />
                  <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-none">
                     Office <span className="text-secondary font-serif">Staff</span>
                  </h2>
               </div>
               <p className="text-text-main/50 font-bold max-w-md lg:text-right">
                  The primary contacts for official communications and administrative coordination within the Vice Chancellor's office.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {officeStaff.map((staff, i) => (
                  <motion.div
                    key={staff.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 bg-white rounded-[2.5rem] border border-primary/5 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all group overflow-hidden"
                  >
                     <div className="relative w-full aspect-square mb-8 rounded-3xl overflow-hidden bg-primary/5 border border-primary/5 group-hover:border-secondary transition-all duration-500">
                        <Image 
                           src={staff.image}
                           alt={staff.name}
                           fill
                           className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <div className="space-y-4">
                        <div>
                           <h4 className="text-lg font-black text-primary uppercase tracking-tight">{staff.name}</h4>
                           <p className="text-xs font-bold text-secondary uppercase tracking-widest mt-1">{staff.role}</p>
                        </div>
                        <div className="space-y-2 pt-4 border-t border-primary/5">
                           <div className="flex items-center gap-2 text-[10px] font-black text-primary/40 uppercase">
                              <Mail size={12} className="text-secondary" /> {staff.mail}
                           </div>
                           <div className="flex items-center gap-2 text-[10px] font-black text-primary/40 uppercase">
                              <Phone size={12} className="text-secondary" /> {staff.phone}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Appointment CTA Section */}
      <section className="py-24 bg-white relative">
         <div className="container mx-auto px-4">
            <div className="bg-surface p-12 lg:p-24 rounded-[4rem] relative overflow-hidden group">
               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               
               <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                  <div className="space-y-6 lg:max-w-xl text-center lg:text-left">
                     <h2 className="text-4xl lg:text-6xl font-black text-primary uppercase leading-tight tracking-tight">
                        Schedule an <br /> <span className="text-secondary">Appointment</span>
                     </h2>
                     <p className="text-text-main/60 text-lg font-medium leading-relaxed">
                        Official meetings and appointments with the Vice Chancellor must be scheduled through the private secretary's office with prior notice.
                     </p>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                     <button onClick={() => actions.inquiry("Request Meeting", { type: "contact", title: "Request Meeting", context: "Page: Office of" })} className="flex items-center gap-3 px-8 py-5 bg-primary text-secondary rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        <Calendar size={20} /> Request Meeting
                     </button>
                     <button onClick={() => actions.print()} className="flex items-center gap-3 px-8 py-5 bg-white text-primary border border-primary/5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg">
                         Protocol Guidelines
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </main>
  );
}
