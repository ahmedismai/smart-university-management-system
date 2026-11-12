"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Globe, 
  Lightbulb, 
  Users, 
  ArrowRight, 
  CheckCircle,
  FlaskConical,
  Award,
  BookOpenCheck,
  Building,
} from "lucide-react";

const GraduatePage = () => {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Advanced Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden h-[60vh] min-h-[650px]">
        <Image
          src="/admission/graduate-hero.png"
          alt="Graduate Research Excellence"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/70 backdrop-blur-[2px]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/20 text-secondary shadow-xl overflow-hidden group">
                 <Award size={14} className="group-hover:rotate-12 transition-transform" />
                 <span className="text-[11px] font-black uppercase tracking-[0.4em]">Master your Future</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.05] uppercase tracking-tighter">
                Lead the <br/>
                <span className="text-secondary font-serif normal-case tracking-tight   opacity-90">Frontier</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
                Join our elite graduate community. We empower scholars to push the boundaries of knowledge and address the world's most complex challenges.
              </p>
              
              <div className="flex flex-wrap gap-5 pt-8 justify-center">
                <button onClick={() => actions.go("/admission/apply")} className="px-12 py-5 bg-secondary text-primary rounded-2xl font-black uppercase tracking-[0.15em] text-sm hover:scale-[1.02] transition-all shadow-[0_20px_50px_rgba(255,191,0,0.15)] active:scale-95">
                  Apply for Admission
                </button>
                <button onClick={() => actions.inquiry("Request Information", { type: "contact", title: "Request Information", context: "Page: Lead the" })} className="px-12 py-5 border border-white/20 text-white rounded-2xl font-black uppercase tracking-[0.15em] text-sm hover:bg-white hover:text-primary transition-all backdrop-blur-sm active:scale-95">
                  Request Information
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        

      </section>

      {/* Research Frontiers */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                 <div className="relative h-[600px] w-full rounded-[4rem] overflow-hidden shadow-2xl">
                    <Image src="/admission/graduate-research.png" alt="Advanced Research" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                 </div>
                 <div className="absolute -bottom-10 -right-10 p-12 bg-secondary rounded-[3rem] shadow-2xl max-w-xs hidden md:block">
                    <h4 className="text-primary font-black text-2xl uppercase leading-tight mb-4 tracking-tighter">Global <br/>Impact</h4>
                    <p className="text-primary/70 text-sm font-bold uppercase tracking-widest">Contributing to sustainable innovation across 12 disciplines.</p>
                 </div>
              </motion.div>
              
              <div className="space-y-12">
                 <div className="space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-none">Research <br/>Frontiers</h2>
                    <div className="w-32 h-2 bg-secondary rounded-full" />
                 </div>
                 
                 <p className="text-lg text-text-main/70 font-medium leading-relaxed">
                   NextGen University is ranked among the top research-intensive institutions globally. Our graduate students are integral parts of the research ecosystem, working alongside world-renowned faculty.
                 </p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { icon: FlaskConical, title: "STEM Excellence", text: "Leading-edge labs and industry partnerships." },
                      { icon: Users, title: "Social Impact", text: "Addressing global societal challenges through policy." },
                      { icon: Lightbulb, title: "Innovation Lab", text: "Turning research into scalable start-ups." },
                      { icon: Globe, title: "Global Network", text: "Connect with partners in over 40 countries." }
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ y: -5 }}
                        className="p-8 border border-primary/5 rounded-[2.5rem] hover:bg-surface transition-all duration-300 group"
                      >
                         <item.icon className="text-secondary mb-4 group-hover:scale-110 transition-transform" size={32} />
                         <h5 className="text-lg font-black text-primary uppercase mb-2">{item.title}</h5>
                         <p className="text-sm font-medium text-text-main/50 leading-relaxed">{item.text}</p>
                      </motion.div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Program Categories */}
      <section className="py-32 bg-surface">
        <div className="container mx-auto px-4">
           <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
              <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase tracking-tight leading-none">Advanced <span className="text-secondary font-serif normal-case">Programs</span></h2>
              <p className="text-text-main/60 text-lg font-medium">Choose a path that aligns with your professional aspirations and intellectual curiosity.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: "Master's Degrees", 
                  desc: "Comprehensive coursework and specialized research to master your professional field.",
                  features: ["Course-based", "Thesis-based", "1-2 Years Duration"]
                },
                { 
                  title: "Doctoral Programs", 
                  desc: "Produce original research and become a leading voice in your chosen academic discipline.",
                  features: ["Full Funding", "Teaching Roles", "3-5 Years Duration"]
                },
                { 
                  title: "Executive Education", 
                  desc: "Designed for professionals seeking advanced strategic management and leadership skills.",
                  features: ["Flexible Scheduling", "Industry Immersion", "Leadership Focus"]
                }
              ].map((prog, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-12 rounded-[3.5rem] shadow-xl shadow-primary/5 border border-primary/5 hover:-translate-y-2 transition-all duration-500"
                >
                   <h4 className="text-2xl font-black text-primary uppercase mb-6">{prog.title}</h4>
                   <p className="text-text-main/60 font-medium mb-8 leading-relaxed">{prog.desc}</p>
                   <ul className="space-y-4 mb-10">
                      {prog.features.map(f => (
                        <li key={f} className="flex items-center gap-3 text-sm font-bold text-primary">
                           <CheckCircle size={16} className="text-secondary" /> {f}
                        </li>
                      ))}
                   </ul>
                   <button onClick={() => actions.go("/academics/departments")} className="w-full py-4 bg-primary text-secondary rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-secondary hover:text-primary transition-all">Explore Programs</button>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Leadership & Alumni Impact */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="bg-primary rounded-[5rem] p-12 lg:p-24 relative overflow-hidden">
              <Image src="/admission/graduate-leadership.png" alt="Leadership" fill className="object-cover opacity-10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/80 to-transparent" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <div className="space-y-8">
                    <h2 className="text-5xl lg:text-6xl font-black text-white uppercase leading-[0.9] tracking-tighter">Scholars into <br/><span className="text-secondary font-serif   normal-case">Leaders</span></h2>
                    <p className="text-xl text-white/50 max-w-xl leading-relaxed font-light">
                      Our graduates are making waves in Fortune 500 companies, Ivy League institutions, and global non-profits. We don't just grant degrees; we build career legacies.
                    </p>
                    <div className="flex flex-wrap gap-8 py-4">
                       <div className="space-y-1">
                          <div className="text-4xl font-black text-secondary uppercase">94%</div>
                          <div className="text-xs font-bold text-white/40 tracking-[0.2em] uppercase">Employment Rate</div>
                       </div>
                       <div className="space-y-1">
                          <div className="text-4xl font-black text-secondary uppercase">150+</div>
                          <div className="text-xs font-bold text-white/40 tracking-[0.2em] uppercase">Global Recruiters</div>
                       </div>
                    </div>
                    <button onClick={() => actions.inquiry("Join the Network", { type: "contact", title: "Join the Network", context: "Page: Lead the" })} className="px-10 py-5 bg-white text-primary rounded-2xl font-black uppercase tracking-widest hover:bg-secondary transition-all">Join the Network</button>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-6">
                    {[
                      { role: "Senior Researcher at CERN", name: "Dr. Sarah Ahmed" },
                      { role: "Lead Systems Architect at Google", name: "David Chen, M.Sc." },
                      { role: "Director of International Policy, UN", name: "Elena Rodriguez, Ph.D." }
                    ].map((alumni, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ x: 10 }}
                        className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-between group"
                      >
                         <div className="space-y-1">
                            <h5 className="text-white font-black uppercase tracking-tight group-hover:text-secondary transition-colors">{alumni.name}</h5>
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{alumni.role}</p>
                         </div>
                         <ArrowRight className="text-secondary" size={24} />
                      </motion.div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Funding & Fellowships */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-5 space-y-8">
                 <h3 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-tight">Funding your <span className="text-secondary">Excellence</span></h3>
                 <p className="text-text-main/60 font-medium leading-relaxed">
                   We believe financial barriers should never stand in the way of advanced research. Explore our comprehensive fellowship and assistantship packages.
                 </p>
                 
                 <div className="space-y-4">
                    {[
                      { icon: Award, title: "Merit-based Fellowships", text: "Full tuition coverage plus living stipends for top scholars." },
                      { icon: BookOpenCheck, title: "Teaching Assistantships", text: "Gain classroom experience while funding your research." },
                      { icon: Building, title: "Industry Sponsorships", text: "Direct funding from our global corporate partners." }
                    ].map((fund, i) => (
                      <div key={i} className="flex gap-5 p-6 rounded-3xl border border-primary/5 hover:border-secondary/20 transition-all group">
                         <div className="p-4 rounded-2xl bg-surface group-hover:bg-secondary/10 transition-colors">
                            <fund.icon className="text-secondary" size={24} />
                         </div>
                         <div className="space-y-1">
                            <h5 className="text-primary font-black uppercase text-sm">{fund.title}</h5>
                            <p className="text-xs font-bold text-text-main/40 leading-relaxed">{fund.text}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              
              <div className="lg:col-span-7 bg-surface rounded-[4rem] p-12 lg:p-20 flex flex-col justify-center">
                 <div className="text-center space-y-10">
                    <h4 className="text-3xl font-black text-primary uppercase">Ready to elevate your <span className="text-secondary font-serif normal-case  ">career?</span></h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="p-8 bg-white rounded-3xl text-center space-y-2">
                          <div className="text-xs font-black text-text-main/30 uppercase tracking-[0.2em]">Application Deadline</div>
                          <div className="text-xl font-black text-primary">Dec 01, 2026</div>
                       </div>
                       <div className="p-8 bg-white rounded-3xl text-center space-y-2">
                          <div className="text-xs font-black text-text-main/30 uppercase tracking-[0.2em]">Notification Date</div>
                          <div className="text-xl font-black text-primary">Mar 15, 2027</div>
                       </div>
                    </div>
                    <button onClick={() => actions.go("/admission/apply")} className="w-full py-6 bg-secondary text-primary rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-2xl">
                      Start Your Application
                    </button>
                    <p className="text-[10px] font-bold text-text-main/30 uppercase tracking-widest">
                      Our admission office is available 24/7 to support your inquiry.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </main>
  );
};

export default GraduatePage;
