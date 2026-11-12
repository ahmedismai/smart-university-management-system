"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Award, 
  GraduationCap, 
  HeartHandshake, 
  SearchCode, 
  TrendingUp, 
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Calculator,
  Laptop
} from "lucide-react";
import { cn } from "@/lib/utils";

const scholarshipCategories = [
  {
    title: "Academic Excellence",
    description: "Awarded to top-tier applicants with exceptional academic records and standardized test scores.",
    amount: "Up to 100% Tuition",
    icon: GraduationCap,
    color: "text-blue-500",
  },
  {
    title: "Research Fellowships",
    description: "For students pursuing specific research paths in science, technology, and advanced humanities.",
    amount: "Full Stipend + Tuition",
    icon: SearchCode,
    color: "text-amber-500",
  },
  {
    title: "International Talent",
    description: "Supporting global diversity by awarding exceptional students from around the world.",
    amount: "Partial to Full Waivers",
    icon: Sparkles,
    color: "text-purple-500",
  },
  {
    title: "Social Impact Award",
    description: "For students who have demonstrated significant commitment to community service and leadership.",
    amount: "Variable Merit Grant",
    icon: HeartHandshake,
    color: "text-rose-500",
  },
];

const timelineSteps = [
  { month: "OCT - DEC", title: "Early Decision Cycle", desc: "Submit your preliminary application for early consideration." },
  { month: "JAN - MAR", title: "Main Scholarship Window", desc: "The primary period for merit and need-based applications." },
  { month: "APR - MAY", title: "Review & Interviews", desc: "Shortlisted candidates are invited for faculty panel discussions." },
  { month: "JUNE", title: "Final Award Notification", desc: "Official scholarship letters are issued to successful applicants." },
];

export default function ScholarshipsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Centered Prestigious Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="/admission/scholarships-hero.png"
          alt="Scholarship Awards"
          fill
          className="object-cover"
          priority
        />
        {/* Deep centered gradient for readability */}
        <div className="absolute inset-0 bg-primary/80 backdrop-blur-[2px]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/20 text-secondary shadow-xl overflow-hidden group">
                <Award size={14} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">Investing in Excellence</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.05] uppercase tracking-tighter">
                Unlock Your <br/>
                <span className="text-secondary font-serif normal-case tracking-tight   opacity-90">Full Potential</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
                At NextGen University, your talent is our priority. We offer a comprehensive suite of scholarships designed to attract and support the brightest minds.
              </p>
              
              <div className="flex flex-wrap gap-5 pt-8 justify-center">
                <button onClick={(e) => actions.details(e)} className="px-12 py-5 bg-secondary text-primary rounded-2xl font-black uppercase tracking-[0.15em] text-sm hover:scale-[1.02] transition-all shadow-[0_20px_50px_rgba(255,191,0,0.15)] active:scale-95">
                  Find Your Scholarship
                </button>
                <button onClick={() => actions.print()} className="px-12 py-5 border border-white/20 text-white rounded-2xl font-black uppercase tracking-[0.15em] text-sm hover:bg-white hover:text-primary transition-all backdrop-blur-sm active:scale-95">
                  Download Aid Guide
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Institutional Commitment */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-12">
                 <div className="space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-tight tracking-tight">Our <span className="text-secondary font-serif normal-case">Philosophy</span> on Success</h2>
                    <div className="w-32 h-2 bg-secondary rounded-full" />
                 </div>
                 
                 <p className="text-lg text-text-main/70 font-medium leading-relaxed">
                   We believe that financial barriers should never stand in the way of academic greatness. Our endowment is dedicated to providing more than just tuition support—it is an investment in your career legacy.
                 </p>
                 
                 <div className="space-y-6">
                    {[
                      "Over EGP 25M awarded annually in undergraduate aid.",
                      "100% of Ph.D. students receive full funding.",
                      "Special localized grants for first-generation scholars.",
                      "Renewable awards based on continued academic growth."
                    ].map((point, i) => (
                      <div key={i} className="flex items-center gap-4 text-primary font-bold">
                         <CheckCircle2 className="text-secondary" size={24} /> <span>{point}</span>
                      </div>
                    ))}
                 </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-square lg:aspect-video rounded-[4rem] overflow-hidden shadow-2xl border-8 border-surface"
              >
                 <Image src="/admission/scholarships-investment.png" alt="Institutional Investment" fill className="object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
              </motion.div>
           </div>
        </div>
      </section>

      {/* Scholarship Categories */}
      <section className="py-32 bg-surface">
         <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
               <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase tracking-tight">Support <span className="text-secondary">Categories</span></h2>
               <p className="text-text-main/50 font-medium text-lg leading-relaxed">Explore the various ways we can support your academic journey.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {scholarshipCategories.map((cat, i) => (
                 <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="bg-white p-10 rounded-[3rem] border border-primary/5 hover:border-secondary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col items-center text-center space-y-6"
                 >
                    <div className={cn("p-6 rounded-[2rem] bg-surface", cat.color)}>
                       <cat.icon size={32} />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-black text-primary uppercase tracking-tight">{cat.title}</h3>
                       <div className="text-xs font-black text-secondary uppercase tracking-widest">{cat.amount}</div>
                    </div>
                    <p className="text-sm font-medium text-text-main/40 leading-relaxed">{cat.description}</p>
                    <button onClick={() => actions.inquiry("Eligibility Details", { type: "contact", title: "Eligibility Details", context: "Page: Unlock Your" })} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-secondary transition-colors">
                       Eligibility Details <ChevronRight size={14} />
                    </button>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Featured Support / Story */}
      <section className="py-32 bg-white text-center sm:text-left">
         <div className="container mx-auto px-4">
            <div className="bg-primary rounded-[5rem] overflow-hidden relative">
               <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative min-h-[400px] lg:min-h-full">
                     <Image src="/admission/scholarships-support.png" alt="Student Support" fill className="object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary lg:to-primary" />
                  </div>
                  
                  <div className="p-12 lg:p-24 space-y-8 relative z-10">
                     <div className="inline-block p-4 bg-secondary/10 rounded-2xl text-secondary mb-4">
                        <TrendingUp size={32} />
                     </div>
                     <h2 className="text-4xl lg:text-6xl font-black text-white uppercase leading-none tracking-tighter">Investment in <br/><span className="text-secondary font-serif normal-case">Your Success</span></h2>
                     <p className="text-xl text-white/50 leading-relaxed font-light">
                       "Receiving the NextGen Scholarship wasn't just a financial relief; it was the moment I realized this university believed in my vision as much as I did. It gave me the freedom to focus entirely on my research."
                     </p>
                     
                     <div className="flex items-center gap-4 text-white">
                        <div className="w-12 h-12 rounded-full bg-secondary/20 overflow-hidden border border-secondary/20 flex items-center justify-center text-secondary font-black">SJ</div>
                        <div className="space-y-px">
                           <div className="font-black uppercase tracking-widest text-sm">Sarah Jenkins</div>
                           <div className="text-xs text-white/30 uppercase tracking-widest">Merit Scholar, Class of 2025</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Timeline & Next Steps */}
      <section className="py-32 bg-white">
         <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
               <div className="lg:col-span-8 space-y-12">
                  <h3 className="text-3xl lg:text-4xl font-black text-primary uppercase tracking-tight leading-none">Scholarship <span className="text-secondary font-serif normal-case">Timeline</span></h3>
                  
                  <div className="relative space-y-12 pl-10 border-l-2 border-surface">
                     {timelineSteps.map((step, i) => (
                       <div key={i} className="relative space-y-2">
                          <div className="absolute -left-[51px] top-1 w-5 h-5 bg-white border-4 border-secondary rounded-full" />
                          <div className="text-secondary font-black text-xs uppercase tracking-widest">{step.month}</div>
                          <h4 className="text-xl font-black text-primary uppercase tracking-tight">{step.title}</h4>
                          <p className="text-sm font-medium text-text-main/50 leading-relaxed">{step.desc}</p>
                       </div>
                     ))}
                  </div>
               </div>
               
               <div className="lg:col-span-4 space-y-8">
                  <div className="bg-surface rounded-[4rem] p-12 text-center space-y-6 border border-primary/5">
                     <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-primary mx-auto shadow-xl">
                        <Calculator size={32} />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-2xl font-black text-primary uppercase tracking-tight leading-none">Aid <span className="text-secondary">Estimator</span></h4>
                        <p className="text-xs font-medium text-text-main/40 leading-relaxed">Calculate your potential scholarship awards in under 3 minutes.</p>
                     </div>
                     <button onClick={() => actions.inquiry("Launch Estimator", { type: "contact", title: "Launch Estimator", context: "Page: Unlock Your" })} className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-secondary hover:text-primary transition-all">Launch Estimator</button>
                  </div>
                  
                  <div className="bg-secondary/10 rounded-[3rem] p-10 flex flex-col items-center text-center space-y-4">
                     <Laptop className="text-secondary" size={24} />
                     <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest leading-loose">Need help with your application? <br/><Link href="#" className="text-primary hover:underline">Attend an info session</Link></p>
                  </div>
               </div>
            </div>
            
            <div className="mt-20 text-center">
               <button onClick={() => actions.inquiry("Start Scholarship Application", { type: "apply", title: "Start Scholarship Application", context: "Page: Unlock Your" })} className="px-16 py-7 bg-primary text-secondary rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-white hover:text-primary border-2 border-primary transition-all shadow-2xl">
                  Start Scholarship Application
               </button>
            </div>
         </div>
      </section>
    </main>
  );
}
