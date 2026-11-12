"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Wifi, 
  Coffee, 
  Utensils, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Total Halls", value: "18", icon: Building2 },
  { label: "Male Halls", value: "10", icon: Users },
  { label: "Female Halls", value: "08", icon: Users },
  { label: "Student Capacity", value: "12,000+", icon: Sparkles },
];

const maleHalls = [
  { name: "Sir Isaac Newton Hall", capacity: "850", location: "North Campus" },
  { name: "Albert Einstein Hall", capacity: "720", location: "East Wing" },
  { name: "Leonardo da Vinci Hall", capacity: "650", location: "Central Campus" },
  { name: "Nikola Tesla Hall", capacity: "900", location: "Tech Zone" },
  { name: "Rabindranath Tagore Hall", capacity: "800", location: "West Campus" },
];

const femaleHalls = [
  { name: "Marie Curie Hall", capacity: "750", location: "South Campus" },
  { name: "Ada Lovelace Hall", capacity: "680", location: "Tech Zone" },
  { name: "Florence Nightingale Hall", capacity: "820", location: "Medical Zone" },
  { name: "Begum Huda Shaarawi Hall", capacity: "900", location: "Central Campus" },
  { name: "Jane Austen Hall", capacity: "600", location: "Riverside" },
];

const facilities = [
  { 
    title: "High-Speed Wi-Fi", 
    description: "Gigabit internet connectivity across all rooms and common areas.",
    icon: Wifi 
  },
  { 
    title: "24/7 Security", 
    description: "Advanced surveillance and round-the-clock security personnel.",
    icon: ShieldCheck 
  },
  { 
    title: "Dining Services", 
    description: "Nutritious and varied meal plans served in modern cafeterias.",
    icon: Utensils 
  },
  { 
    title: "Laundry Facilities", 
    description: "Fully automated laundry rooms with modern washers and dryers.",
    icon: Coffee 
  },
  { 
    title: "Common Rooms", 
    description: "Spaces for relaxation, indoor games, and social interaction.",
    icon: Users 
  },
  { 
    title: "Medical Center", 
    description: "Immediate medical assistance and first-aid services available 24/7.",
    icon: Info 
  },
];

const steps = [
  {
    title: "Check Eligibility",
    desc: "Only full-time enrolled students are eligible for hall seat allocation."
  },
  {
    title: "Online Application",
    desc: "Fill out the residential application form through the student portal."
  },
  {
    title: "Review & Selection",
    desc: "Allocations are made based on distance from home and academic results."
  },
  {
    title: "Payment & Move-in",
    desc: "Pay the residential fees and collect your room keys from the Provost office."
  }
];

export default function HallsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="/campus-hero.png" // Using existing campus-hero.png
          alt="University Residence Hall"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 backdrop-blur-md border border-secondary/30 text-secondary shadow-xl">
              <Building2 size={16} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Campus Life</span>
            </div>
            
            <h1 className="text-5xl lg:text-8xl font-black text-white leading-tight uppercase tracking-tight">
              Halls of <br/>
              <span className="text-secondary font-serif">Residence</span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
              Your home away from home. We provide comfortable, secure, and vibrant living spaces that foster academic success and personal growth.
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-secondary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Quick Stats */}
      <section className="relative z-20 -mt-12 container mx-auto px-4">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-primary/10 border border-primary/5 p-8 lg:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center space-y-3"
              >
                <div className="p-4 rounded-2xl bg-secondary/10 text-secondary">
                  <stat.icon size={28} />
                </div>
                <div>
                   <div className="text-3xl lg:text-4xl font-black text-primary">{stat.value}</div>
                   <div className="text-xs font-bold text-text-main/40 uppercase tracking-widest">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hall Directory */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Male Halls */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-primary uppercase">
                  Male <span className="text-secondary">Halls</span>
                </h2>
                <div className="w-20 h-1.5 bg-secondary rounded-full" />
              </div>
              
              <div className="space-y-4">
                {maleHalls.map((hall, i) => (
                  <div key={i} className="group p-6 bg-surface rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-between shadow-sm hover:shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-white/10 group-hover:text-secondary">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{hall.name}</h3>
                        <p className="text-sm opacity-60 font-medium">{hall.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase font-black tracking-widest opacity-40 mb-1">Capacity</div>
                      <div className="font-black text-secondary">{hall.capacity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Female Halls */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-primary uppercase">
                  Female <span className="text-secondary">Halls</span>
                </h2>
                <div className="w-20 h-1.5 bg-secondary rounded-full" />
              </div>
              
              <div className="space-y-4">
                {femaleHalls.map((hall, i) => (
                  <div key={i} className="group p-6 bg-surface rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-between shadow-sm hover:shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-white/10 group-hover:text-secondary">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{hall.name}</h3>
                        <p className="text-sm opacity-60 font-medium">{hall.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase font-black tracking-widest opacity-40 mb-1">Capacity</div>
                      <div className="font-black text-secondary">{hall.capacity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
              World-Class <span className="text-secondary">Facilities</span>
            </h2>
            <p className="text-white/60 text-lg font-medium">
              We provide everything you need for a comfortable and productive life on campus.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <motion.div 
                key={facility.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] hover:border-secondary/30 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-8 group-hover:scale-110 transition-transform">
                  <facility.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tight group-hover:text-secondary transition-colors">
                  {facility.title}
                </h3>
                <p className="text-white/50 font-medium leading-relaxed">
                  {facility.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-32 bg-surface">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <h2 className="text-5xl lg:text-6xl font-black text-primary leading-tight uppercase">
                Living <br/>
                <span className="text-secondary font-serif">On Campus</span>
              </h2>
              <p className="text-lg text-text-main/70 font-medium leading-relaxed max-w-xl">
                Securing a place in the halls is a competitive process. We prioritize first-year students and those living furthest from the campus.
              </p>
              
              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-secondary flex items-center justify-center font-black">
                      0{i + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-primary uppercase text-lg mb-1 tracking-tight">{step.title}</h4>
                      <p className="text-text-main/50 font-medium">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-8 flex flex-wrap gap-4">
                <button onClick={() => actions.inquiry("Residence application", { type: "registration", title: "Apply for residence", description: "Tell us your preferred hall and when you need the room.", fields: ["name", "email", "phone", "message"] })} className="px-8 py-4 bg-secondary text-primary rounded-xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl">Apply for Residence</button>
                <button onClick={() => actions.inquiry("Residential handbook request", { type: "contact", title: "Request the residential handbook", fields: ["name", "email"] })} className="px-8 py-4 border-2 border-primary/10 text-primary rounded-xl font-black uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all">Residential Handbook</button>
              </div>
            </div>
            
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl relative z-10"
              >
                <Image 
                  src="/campus-map.png" // Using existing campus-map.png as placeholder for hall environment
                  alt="Students Studying" 
                  fill 
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Support & Contact */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-[4rem] p-12 lg:p-20 relative overflow-hidden">
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                <div className="lg:col-span-2 space-y-8">
                  <h2 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
                    Need Help with <br/>
                    <span className="text-secondary">Accommodation?</span>
                  </h2>
                  <p className="text-white/60 text-lg font-medium max-w-xl">
                    Our residential support team is available to assist you with any queries regarding hall selection, applications, and student welfare.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="flex items-center gap-4 text-white">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-secondary">
                        <Phone size={24} />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest opacity-50">Call Us</div>
                        <div className="font-bold">+880 1234-567890</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-white">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-secondary">
                        <Mail size={24} />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest opacity-50">Email Us</div>
                        <div className="font-bold">housing@nextgen.edu.bd</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl">
                  <h3 className="text-2xl font-black text-primary uppercase mb-6 tracking-tight">Provost Office</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <MapPin className="text-secondary flex-shrink-0" size={20} />
                      <p className="text-sm font-medium text-text-main/70">
                        Admin Building, First Floor, Room 204
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                       <div className="text-xs font-black uppercase tracking-widest text-text-main/40 mb-2">Office Hours</div>
                       <div className="flex justify-between text-sm">
                          <span className="font-bold text-primary">Sun - Thu</span>
                          <span className="text-text-main/60">09:00 AM - 05:00 PM</span>
                       </div>
                    </div>
                    <button onClick={() => actions.inquiry("Book Appointment", { type: "registration", title: "Book Appointment", context: "Page: Halls of" })} className="w-full py-4 bg-primary text-secondary rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-secondary hover:text-primary transition-all">
                      Book Appointment
                    </button>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
}
