"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Users, 
  Handshake, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Heart,
  Scale,
  MessagesSquare,
  GraduationCap
} from "lucide-react";

const executiveBody = [
  { role: "President", name: "Tanvir Ahmed", department: "Law", term: "2025-26" },
  { role: "Vice President", name: "Sadiya Islam", department: "Political Science", term: "2025-26" },
  { role: "General Secretary", name: "Rashed Karim", department: "Economics", term: "2025-26" },
  { role: "Joint Secretary", name: "Nabila Tabassum", department: "English", term: "2025-26" },
  { role: "Cultural Secretary", name: "Areeba Khan", department: "Fine Arts", term: "2025-26" },
  { role: "Welfare Secretary", name: "Zubair Hossain", department: "Social Work", term: "2025-26" }
];

const pillars = [
  {
    icon: Scale,
    title: "Advocacy",
    desc: "Representing student interests in university senate & syndicate meetings."
  },
  {
    icon: Heart,
    title: "Welfare",
    desc: "Ensuring health, transport, and residential facilities meet student needs."
  },
  {
    icon: Users,
    title: "Unity",
    desc: "Fostering a diverse and inclusive environment across all faculties."
  }
];

export default function StudentUnionPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/research-hero.png"
          alt="Student Union Hub"
          fill
          className="object-cover opacity-20 scale-105 animate-slow-zoom"
          priority
        />
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-secondary shadow-2xl"
          >
             <GraduationCap size={16} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Student Voice & Leadership</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl lg:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter"
          >
             Central <br />
             <span className="text-secondary">Student Union</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-white/70 max-w-2xl mx-auto font-medium leading-relaxed"
          >
             The official representative body of the university, dedicated to safeguarding student rights, promoting welfare, and fostering excellence.
          </motion.p>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-32 bg-white relative overflow-hidden">
         <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-8"
               >
                  <div className="space-y-4">
                     <div className="h-1.5 w-20 bg-secondary rounded-full" />
                     <h2 className="text-4xl lg:text-6xl font-black text-primary uppercase leading-[0.9] tracking-tighter">
                        Leading the <br /> <span className="text-secondary">NextGen</span> Pulse
                     </h2>
                  </div>
                  <p className="text-xl text-text-main/60 font-medium leading-relaxed">
                     The Central Student Union (CSU) acts as the bridge between the student body and university administration. We are committed to a campus culture that values every voice and empowers every dreamer.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-6 pt-4">
                     {pillars.map((pillar) => (
                        <div key={pillar.title} className="p-8 rounded-[2.5rem] bg-surface border border-gray-50 hover:border-secondary/20 transition-all group">
                           <pillar.icon className="text-secondary mb-4 group-hover:scale-110 transition-transform" size={28} />
                           <h4 className="font-black text-primary uppercase text-sm tracking-tight mb-2">{pillar.title}</h4>
                           <p className="text-xs font-bold text-text-main/40 uppercase leading-snug">{pillar.desc}</p>
                        </div>
                     ))}
                  </div>
               </motion.div>

               <div className="relative group">
                  <div className="absolute -inset-4 bg-secondary/10 rounded-[4rem] group-hover:bg-secondary/20 transition-all duration-700 blur-2xl" />
                  <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl">
                     <Image 
                        src="/research-hero.png" 
                        alt="Student Leadership" 
                        fill 
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                     />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Leadership Executive Grid */}
      <section className="py-32 bg-surface">
         <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-20">
               <h2 className="text-4xl lg:text-6xl font-black text-primary uppercase tracking-tighter">Executive <span className="text-secondary">Body</span></h2>
               <p className="text-text-main/50 font-bold uppercase tracking-widest text-sm">Elected representatives for the 2025-26 academic session</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
               {executiveBody.map((member, i) => (
                  <motion.div
                     key={member.name}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                     viewport={{ once: true }}
                     className="bg-white p-10 rounded-[3rem] border border-gray-100 hover:border-secondary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all group"
                  >
                     <div className="flex flex-col items-center text-center space-y-6">
                        <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center text-secondary relative overflow-hidden group-hover:bg-primary group-hover:text-white transition-all">
                           <Users size={40} />
                           {/* Decorative ring */}
                           <div className="absolute inset-0 border-4 border-secondary/10 group-hover:border-white/10 rounded-full" />
                        </div>
                        <div className="space-y-2">
                           <div className="inline-flex px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[9px] font-black uppercase tracking-widest">{member.role}</div>
                           <h3 className="text-2xl font-black text-primary uppercase leading-tight group-hover:text-secondary transition-colors">
                              {member.name}
                           </h3>
                           <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em]">{member.department}</p>
                        </div>
                        <div className="pt-6 border-t border-gray-50 w-full flex justify-between items-center px-4">
                           <div className="text-left space-y-0.5">
                              <p className="text-[8px] font-black text-primary/20 uppercase tracking-widest">Office Term</p>
                              <p className="text-xs font-bold text-primary">{member.term}</p>
                           </div>
                           <button onClick={(e) => actions.details(e)} className="p-3 bg-surface rounded-xl text-primary/30 hover:bg-secondary hover:text-primary transition-all">
                              <MessagesSquare size={18} />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Services & Contact Section */}
      <section className="py-32 bg-white">
         <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid lg:grid-cols-2 gap-20">
               <div className="space-y-12">
                  <div className="space-y-4">
                     <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Student <span className="text-secondary">Welfare</span></h2>
                     <p className="text-text-main/60 font-medium">Empowering the student body through strategic services and welfare support.</p>
                  </div>
                  
                  <div className="space-y-4">
                     {[
                        { title: "Legal & Advocacy", desc: "Assistance with university regulations and student rights." },
                        { title: "Health & Well-being", desc: "Liaisons for the university healthcare and insurance policy." },
                        { title: "Campus Mobility", desc: "Advocating for better transport and accessibility across campus." },
                        { title: "Cultural Hub", desc: "Coordinating inter-departmental cultural competitions." }
                     ].map((item) => (
                        <div key={item.title} className="p-6 rounded-3xl bg-surface hover:bg-secondary/5 border border-transparent hover:border-secondary/20 transition-all group flex items-start justify-between">
                           <div className="space-y-1">
                              <h4 className="font-black text-primary uppercase text-sm tracking-tight">{item.title}</h4>
                              <p className="text-xs font-bold text-text-main/40 uppercase leading-snug">{item.desc}</p>
                           </div>
                           <ChevronRight size={18} className="text-primary/20 group-hover:text-secondary group-hover:translate-x-1 transition-all mt-1" />
                        </div>
                     ))}
                  </div>
               </div>

               <div className="space-y-12 lg:pl-12 lg:border-l border-gray-100">
                  <div className="space-y-4">
                     <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Governance <span className="text-secondary">Vault</span></h2>
                     <p className="text-text-main/60 font-medium text-balance">Review our constitutional documents, election reports, and transparency statements.</p>
                  </div>

                  <div className="grid gap-4">
                     {[
                        { title: "Union Constitution 2025", date: "Jan 12, 2025" },
                        { title: "Annual Activity Report", date: "Dec 15, 2024" },
                        { title: "Welfare Fund Audit", date: "Nov 20, 2024" },
                        { title: "Senate Minutes 2025-A", date: "Ongoing" }
                     ].map((doc) => (
                        <button onClick={(e) => actions.details(e)} key={doc.title} className="w-full p-6 text-left rounded-3xl bg-white border border-gray-100 hover:border-secondary transition-all flex items-center justify-between group shadow-sm hover:shadow-xl">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-primary group-hover:bg-secondary transition-colors">
                                 <FileText size={20} />
                              </div>
                              <div className="space-y-0.5">
                                 <h4 className="font-bold text-primary">{doc.title}</h4>
                                 <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">{doc.date}</p>
                              </div>
                           </div>
                           <ExternalLink size={18} className="text-primary/10 group-hover:text-secondary transition-colors" />
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Join the Conversation Page */}
      <section className="py-24 bg-surface text-center">
         <div className="container mx-auto px-4 max-w-4xl space-y-12">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-secondary font-black text-[10px] uppercase tracking-widest shadow-sm">
                  <Handshake size={14} /> Collective Growth
               </div>
               <h3 className="text-3xl lg:text-5xl font-black text-primary uppercase tracking-tighter">Become a <span className="text-secondary">Leader</span></h3>
               <p className="text-text-main/60 font-medium text-lg max-w-2xl mx-auto">Passionate about advocacy? Want to represent your faculty? Join our volunteer network or run for the upcoming elections.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
               <button onClick={() => actions.inquiry("Get Involved", { type: "contact", title: "Get Involved", context: "Page: student-union" })} className="px-12 py-5 bg-primary text-secondary rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  Get Involved
               </button>
               <button onClick={() => actions.inquiry("Election Schedule", { type: "contact", title: "Election Schedule", context: "Page: student-union" })} className="px-12 py-5 bg-white text-primary border border-gray-100 rounded-2xl font-black uppercase text-sm tracking-widest hover:border-secondary transition-all shadow-xl shadow-primary/5">
                  Election Schedule
               </button>
            </div>
         </div>
      </section>
    </main>
  );
}
