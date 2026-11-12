"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  FileText,
  CreditCard,
  Building2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Majors Offered", value: "45+", icon: BookOpen },
  { label: "Student-Faculty Ratio", value: "14:1", icon: Users },
  { label: "Scholarship Fund", value: "EGP 2M+", icon: Trophy },
  { label: "Global Partners", value: "120+", icon: Sparkles },
];

const admissionSteps = [
  {
    title: "Choose Your Program",
    description: "Explore our diverse range of undergraduate degrees and find the one that aligns with your career goals.",
    icon: GraduationCap,
  },
  {
    title: "Check Requirements",
    description: "Review academic eligibility, English proficiency requirements, and necessary documentation.",
    icon: FileText,
  },
  {
    title: "Submit Application",
    description: "Complete the online application form and upload required documents through our admission portal.",
    icon: CheckCircle2,
  },
  {
    title: "Review & Interview",
    description: "Our admission committee will review your application. Selected candidates may be called for an interview.",
    icon: Users,
  },
];

export default function UndergraduatePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="/admission/undergraduate-hero.png"
          alt="Undergraduate Students on Campus"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10 text-left">
          <div className="max-w-3xl space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 backdrop-blur-md border border-secondary/30 text-secondary shadow-xl">
                <Sparkles size={16} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Admission Open 2026</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tight">
                Begin Your <br/>
                <span className="text-secondary font-serif">Future</span> Today
              </h1>
              
              <p className="text-xl text-white/80 max-w-xl font-medium leading-relaxed">
                Join a community of innovators, leaders, and global citizens. Our undergraduate programs are designed to challenge and inspire you.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/admission/apply" 
                  className="px-8 py-4 bg-secondary text-primary rounded-xl font-black uppercase tracking-widest text-sm hover:bg-white transition-all shadow-2xl hover:shadow-secondary/20"
                >
                  Apply Online Now
                </Link>
                <button onClick={() => actions.inquiry("Brochure request", { type: "contact", title: "Request the brochure", description: "Leave your email and we will send you the undergraduate brochure.", fields: ["name", "email", "phone"] })} className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-primary transition-all">View Brochure</button>
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-primary to-transparent h-32 pointer-events-none"
        />
      </section>

      {/* Quick Stats */}
      <section className="relative z-20 -mt-16 container mx-auto px-4">
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

      {/* Overview Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black text-primary leading-tight uppercase">
                  Excellence in <br/>
                  <span className="text-secondary font-serif">Every Dimension</span>
                </h2>
                <div className="w-24 h-2 bg-secondary rounded-full" />
              </div>
              
              <p className="text-lg text-text-main/70 font-medium leading-relaxed">
                NextGen University offers a transformative undergraduate experience that combines rigorous academics with real-world application. Our curriculum is designed to foster critical thinking, creativity, and leadership skills.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "World-class Faculty",
                  "Cutting-edge Research",
                  "Vibrant Student Life",
                  "Industry Connections",
                  "Global Exchange",
                  "Career Development"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-primary font-bold group">
                    <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all">
                      <CheckCircle2 size={16} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square lg:aspect-video rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <Image 
                src="/admission/undergraduate-programs.png" 
                alt="Academic Excellence" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[3rem]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Admission Journey */}
      <section className="py-32 bg-surface relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase tracking-tight">
              Your <span className="text-secondary">Admission</span> Journey
            </h2>
            <p className="text-text-main/60 text-lg font-medium">
              We've simplified our admission process to help you focus on what matters most—your future. Follow these steps to join us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {admissionSteps.map((step, index) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
              >
                <div className="absolute -top-6 left-10 w-12 h-12 bg-primary text-secondary rounded-2xl flex items-center justify-center font-black text-xl shadow-xl group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                
                <div className="mt-4 space-y-4">
                  <step.icon className="text-secondary mb-2" size={32} />
                  <h3 className="text-xl font-black text-primary uppercase tracking-tight group-hover:text-secondary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm font-medium text-text-main/50 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                <div className="absolute bottom-10 right-10 scale-0 group-hover:scale-100 transition-all duration-500 text-secondary">
                   <ArrowRight size={24} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* campus life & Call to Action */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-[4rem] p-12 lg:p-24 relative overflow-hidden text-center lg:text-left">
            <Image 
              src="/admission/undergraduate-campus-life.png" 
              alt="Campus Life" 
              fill 
              className="object-cover opacity-20 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                  Realize Your <br/>
                  <span className="text-secondary font-serif">Potential</span>
                </h2>
                <p className="text-xl text-white/70 max-w-xl font-medium leading-relaxed">
                  Beyond the classroom, find a community that supports your passions. From sports to arts, innovation to social impact, your journey is uniquely yours.
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <button onClick={() => actions.go("/admission/apply")} className="px-10 py-5 bg-secondary text-primary rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl">
                    Apply Now
                  </button>
                  <button onClick={() => actions.inquiry("Talk to an Advisor", { type: "contact", title: "Talk to an Advisor", context: "Page: Begin Your" })} className="px-10 py-5 border-2 border-white/20 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all">
                    Talk to an Advisor
                  </button>
                </div>
              </div>
              
              <div className="hidden lg:flex justify-end">
                 <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                    {[
                      { icon: GraduationCap, text: "Top Tier Academics" },
                      { icon: Building2, text: "Modern Campus" },
                      { icon: Users, text: "Supportive Peer Group" },
                      { icon: Clock, text: "Lifetime Career Support" }
                    ].map((feature, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ y: -5 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] text-center space-y-3"
                      >
                        <feature.icon className="mx-auto text-secondary" size={32} />
                        <span className="block text-xs font-black text-white uppercase tracking-widest leading-tight">{feature.text}</span>
                      </motion.div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1 space-y-6">
                <h3 className="text-3xl font-black text-primary uppercase leading-tight">Eligibility <span className="text-secondary">&</span> Process</h3>
                <p className="text-text-main/60 font-medium">Review our comprehensive requirements to ensure a smooth application process.</p>
                <div className="p-8 bg-surface rounded-[2rem] border border-primary/5">
                   <h4 className="font-black text-primary uppercase text-sm mb-4">Important Dates</h4>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-text-main/50 font-bold">Fall Intake Starts</span>
                         <span className="text-primary font-black">Aug 15, 2026</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-text-main/50 font-bold">Application Deadline</span>
                         <span className="text-secondary font-black">Nov 30, 2026</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-text-main/50 font-bold">Orientation</span>
                         <span className="text-primary font-black">Jan 10, 2027</span>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[
                   {
                     title: "Academic Excellence",
                     desc: "Minimum GPA 3.5 or equivalent in High School graduation. Proficiency in core subjects related to the chosen major.",
                     icon: GraduationCap
                   },
                   {
                     title: "Document Requirements",
                     desc: "Official transcripts, Statement of Purpose (SOP), Letters of Recommendation, and proof of High School completion.",
                     icon: FileText
                   },
                   {
                     title: "Financial Planning",
                     desc: "Explore various tuition fee payment plans and automatic merit-based scholarships eligibility.",
                     icon: CreditCard
                   },
                   {
                     title: "English Proficiency",
                     desc: "IELTS 6.5+, TOEFL iBT 80+, or Duolingo English Test 110+ for international and non-native students.",
                     icon: GraduationCap
                   }
                 ].map((box, i) => (
                   <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="p-10 border border-primary/5 rounded-[2.5rem] hover:border-secondary/20 hover:bg-surface transition-all duration-300"
                   >
                     <box.icon className="text-secondary mb-6" size={32} />
                     <h4 className="text-lg font-black text-primary uppercase mb-4 tracking-tight">{box.title}</h4>
                     <p className="text-sm font-medium text-text-main/50 leading-relaxed">{box.desc}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </section>
    </main>
  );
}
