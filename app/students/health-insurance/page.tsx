"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  HeartPulse, 
  ShieldCheck, 
  Stethoscope, 
  Tablets, 
  FileText, 
  PhoneCall, 
  CheckCircle2, 
  Activity,
  CreditCard,
  ChevronRight,
  Info,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

const benefits = [
  {
    title: "IPD Coverage",
    value: "EGP 15,000",
    desc: "In-patient department coverage for surgery and long-term stays.",
    icon: Stethoscope,
    bg: "bg-blue-50",
    text: "text-blue-600"
  },
  {
    title: "OPD Benefits",
    value: "EGP 2,000",
    desc: "Out-patient coverage including doctor visits and diagnostics.",
    icon: HeartPulse,
    bg: "bg-green-50",
    text: "text-green-600"
  },
  {
    title: "Medicine",
    value: "100%",
    desc: "Full coverage for prescribed essential medicines at partner pharmacies.",
    icon: Tablets,
    bg: "bg-purple-50",
    text: "text-purple-600"
  },
  {
    title: "Dental & Vision",
    value: "EGP 500",
    desc: "Annual allowance for dental checkups and prescription glasses.",
    icon: Activity,
    bg: "bg-orange-50",
    text: "text-orange-600"
  }
];

const claimsSteps = [
  { title: "Consultation", desc: "Visit any partner hospital or the student health center." },
  { title: "Verification", desc: "Present your Digital ID card for cashless processing." },
  { title: "Treatment", desc: "Receive high-quality care from certified professionals." },
  { title: "Confirmation", desc: "Receive a SMS/Email summary of the treatment and costs." }
];

export default function HealthInsurancePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/students/health-insurance.png"
          alt="Student Health Care"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 backdrop-blur-md border border-secondary/30 text-secondary">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">NextGen Care • Insurance</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-[0.95] uppercase tracking-tight">
                Secure Your <br/>
                <span className="text-secondary font-serif">Wellbeing</span>
              </h1>
              
              <p className="text-xl text-white/70 max-w-xl font-medium leading-relaxed">
                Comprehensive health coverage for every student. From routine checkups to emergencies, we've got you covered 24/7.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button onClick={() => actions.print()} className="px-8 py-4 bg-secondary text-primary rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl">
                  Download Guide
                </button>
                <button onClick={() => actions.inquiry("Partner Hospitals", { type: "contact", title: "Partner Hospitals", context: "Page: Secure Your" })} className="px-8 py-4 border-2 border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-sm translate-y-0 hover:bg-white hover:text-primary transition-all">
                  Partner Hospitals
                </button>
              </div>
            </motion.div>

            {/* Digital ID Card Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="hidden lg:block relative"
            >
              <div className="w-[450px] aspect-[1.6/1] bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <span className="absolute top-0 right-0 w-40 h-40 bg-secondary/20 rounded-full blur-3xl -mr-10 -mt-10" />
                <span className="absolute bottom-0 left-0 w-32 h-32 bg-primary/40 rounded-full blur-3xl -ml-10 -mb-10" />
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Image src="/logo.png" alt="Logo" width={30} height={30} />
                        <span className="text-white font-black uppercase text-sm tracking-tighter">NextGen Care</span>
                      </div>
                      <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest">Student Medical ID</p>
                    </div>
                    <CreditCard className="text-secondary/50" />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                       <h3 className="text-2xl font-black text-white uppercase tracking-tight">Abdullah Al-Mamun</h3>
                       <p className="text-xs font-bold text-white/60 tracking-wider">ID: 2026-12345-CSE</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <div className="text-[9px] uppercase font-black text-white/40 tracking-[0.2em] mb-1">Policy Valid Thru</div>
                         <div className="text-sm font-bold text-white uppercase tracking-widest">Dec 2026</div>
                       </div>
                       <div className="text-right">
                         <div className="text-[9px] uppercase font-black text-white/40 tracking-[0.2em] mb-1">Blood Group</div>
                         <div className="text-sm font-bold text-secondary uppercase tracking-widest">O Positive (+ve)</div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Card Label */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-xl flex items-center gap-2 border border-slate-100">
                <ShieldCheck className="text-secondary" size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">NFC Enabled Token</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Coverage Grid */}
      <section className="py-32 bg-slate-50/50">
        <div className="container mx-auto px-4">
           <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-4xl lg:text-6xl font-black text-primary uppercase tracking-tight leading-tight">
              Comprehensive <span className="text-secondary">Protection</span>
            </h2>
            <p className="text-primary/60 text-lg font-medium leading-relaxed">
              Our policy is designed to eliminate financial stress during medical emergencies, allowing you to focus entirely on your academics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[3rem] border border-white shadow-[0_12px_40px_rgba(0,0,0,0.02)] transition-all group"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 transition-transform", benefit.bg, benefit.text)}>
                  <benefit.icon size={32} />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-3xl font-black text-primary tracking-tighter uppercase">{benefit.value}</h3>
                    <p className="text-[11px] font-extrabold text-primary/30 uppercase tracking-[0.2em]">{benefit.title}</p>
                  </div>
                  <p className="text-xs font-medium text-primary/50 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Claims Process */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="relative">
                <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl">
                  <Image 
                    src="/about-university.png" 
                    alt="Medical Support" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                </div>
                {/* Floating Stat */}
                <div className="absolute top-10 -right-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-50 max-w-[240px] animate-bounce-slow">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                        <CheckCircle2 size={24} />
                     </div>
                     <span className="font-black text-primary text-sm uppercase">100+ Clinics</span>
                   </div>
                   <p className="text-[10px] font-bold text-primary/40 leading-relaxed">Access to premium private and public healthcare facilities nationwide.</p>
                </div>
             </div>

             <div className="space-y-12">
                <div className="space-y-6 text-center lg:text-left">
                  <h2 className="text-5xl font-black text-primary uppercase tracking-tight lg:leading-[1.1]">
                    Cashless <span className="text-secondary">Claim</span> <br/>
                    Process
                  </h2>
                  <p className="text-lg text-primary/60 font-medium">Navigating healthcare has never been easier. Follow these simple steps for a stress-free experience.</p>
                </div>

                <div className="space-y-8">
                   {claimsSteps.map((step, i) => (
                     <div key={i} className="flex gap-8 group">
                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-xl text-primary group-hover:bg-primary group-hover:text-secondary transition-all">
                          0{i + 1}
                        </div>
                        <div className="pt-2">
                           <h4 className="text-lg font-black text-primary uppercase tracking-tight group-hover:text-secondary transition-colors">{step.title}</h4>
                           <p className="text-sm font-medium text-primary/40 leading-relaxed mt-1">{step.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="pt-4 text-center lg:text-left">
                   <button onClick={() => actions.inquiry("View Network Map", { type: "contact", title: "View Network Map", context: "Page: Secure Your" })} className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-secondary rounded-2xl font-black uppercase tracking-widest text-sm hover:translate-x-2 transition-all group shadow-xl">
                      View Network Map <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                   </button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
           <div className="bg-primary rounded-[4rem] p-12 lg:p-24 relative overflow-hidden text-center lg:text-left">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] -ml-24 -mb-24" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
                 <div className="lg:col-span-2 space-y-10">
                    <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tight">
                      We're Here <br/>
                      <span className="text-secondary">When You Need Us</span>
                    </h2>
                    <p className="text-xl text-white/60 max-w-xl font-medium leading-relaxed">
                      Our medical team and insurance advisors are available 24/7 to assist with emergencies, claims, and healthcare guidance.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                       <div className="flex items-center gap-6 group">
                          <div className="w-16 h-16 rounded-[2rem] bg-white/10 flex items-center justify-center text-secondary shadow-2xl group-hover:bg-secondary group-hover:text-primary transition-all duration-500">
                             <PhoneCall size={32} />
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Emergency Hotline</div>
                            <div className="text-2xl font-black text-white">+880 1622 000 999</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-6 group">
                          <div className="w-16 h-16 rounded-[2rem] bg-white/10 flex items-center justify-center text-secondary shadow-2xl group-hover:bg-secondary group-hover:text-primary transition-all duration-500">
                             <PhoneCall size={32} />
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Insurance Support</div>
                            <div className="text-2xl font-black text-white">+880 1622 111 222</div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3.5rem] space-y-8">
                    <div className="space-y-6">
                       <div className="flex items-center gap-4 text-white">
                          <MapPin className="text-secondary" />
                          <div>
                             <h4 className="font-black uppercase text-sm tracking-widest">Health Center</h4>
                             <p className="text-xs font-bold text-white/50 mt-1 uppercase tracking-tighter">Campus North Wing • Ground Floor</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 text-white">
                          <Info className="text-secondary" />
                          <div>
                             <h4 className="font-black uppercase text-sm tracking-widest">Office Hours</h4>
                             <p className="text-xs font-bold text-white/50 mt-1 uppercase tracking-tighter">Sun - Thu • 8:00 AM - 8:00 PM</p>
                          </div>
                       </div>
                    </div>
                    <button onClick={() => actions.inquiry("Full Hospital List", { type: "contact", title: "Full Hospital List", context: "Page: Secure Your" })} className="w-full py-5 bg-white text-primary rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-secondary transition-all shadow-2xl">
                       Full Hospital List
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </main>
  );
}
