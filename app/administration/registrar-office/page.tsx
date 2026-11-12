"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  FileText, 
  UserCheck, 
  ClipboardCheck, 
  Download, 
  Mail, 
  Phone, 
  Briefcase, 
  Users,
  ShieldCheck,
  ArrowUpRight,
  BookOpen,
  History,
  Scale
} from "lucide-react";
import { cn } from "@/lib/utils";

const officeStaff = [
  { 
    name: "Dr. Farhana Ahmed", 
    role: "Deputy Registrar (Academic)", 
    mail: "farhana.a@registrar.gov", 
    phone: "+880 1721-XXXXXX",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&h=400&auto=format&fit=crop"
  },
  { 
    name: "Mr. Rakibul Hassan", 
    role: "Assistant Registrar (Admin)", 
    mail: "rakib.h@registrar.gov", 
    phone: "+880 1722-XXXXXX",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/27/Bangladesh_Ambassador_Md._Jashim_Uddin.png"
  },
  { 
    name: "Mr. Jashim Uddin", 
    role: "Section Officer (Records)", 
    mail: "jashim.u@registrar.gov", 
    phone: "+880 1723-XXXXXX",
    image: "https://media.licdn.com/dms/image/v2/D5603AQFqH9pOD8HdnQ/profile-displayphoto-scale_200_200/B56Z2HTy_eGsAY-/0/1776091609179?e=2147483647&v=beta&t=8v3UiDxd_DTnAeX3gv6UhuAgRpvhObi_WOwZASPitaQ"
  },
  { 
    name: "Ms. Tania Sultana", 
    role: "Academic Coordination Officer", 
    mail: "tania.s@registrar.gov", 
    phone: "+880 1724-XXXXXX",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&h=400&auto=format&fit=crop"
  }
];

const forms = [
  { name: "Migration Certificate Request", type: "PDF", size: "245 KB" },
  { name: "Duplicate Transcript Application", type: "PDF", size: "180 KB" },
  { name: "Convocation Registration Form", type: "DOCX", size: "1.2 MB" },
  { name: "Faculty Appraisal Form", type: "PDF", size: "890 KB" },
  { name: "Emergency Leave Application", type: "PDF", size: "150 KB" },
  { name: "Semester Drop Application", type: "PDF", size: "210 KB" },
];

export default function RegistrarOfficePage() {
  return (
    <main className="flex flex-col min-h-screen pt-20 lg:pt-0">
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/governance-hero.png" // Reusing professional asset
          alt="University Administration Wing"
          fill
          className="object-cover opacity-20 scale-105 animate-slow-zoom"
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
               <ShieldCheck size={16} className="text-secondary" />
               <span className="text-xs font-bold uppercase tracking-[0.2em]">Institutional Governance</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tight">
               Office of <br/>
               <span className="text-secondary font-serif">The Registrar</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
               The central custodian of academic records, university statutes, and administrative coordination across all faculties and departments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Registrar Profile Section */}
      <section className="py-24 bg-surface relative overflow-hidden">
         <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col xl:flex-row gap-20 items-stretch">
               {/* Content Side */}
               <div className="xl:w-3/5 space-y-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                  >
                     <div className="inline-block px-4 py-1.5 bg-primary text-secondary rounded-full font-black text-[10px] uppercase tracking-widest">Office Head</div>
                     <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-tight tracking-tight">
                        Custodian of <br /> <span className="text-secondary">Academic Integrity</span>
                     </h2>
                     <p className="text-text-main/60 font-medium leading-relaxed text-lg lg:pr-12">
                        The Registrar is the principal administrative officer of the university, responsible for all statutory meetings, academic ceremonies, and the meticulous maintenance of student records from admission to graduation.
                     </p>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {[
                        { title: "Academic Custody", desc: "Digital and physical archival of 50+ years of university records.", icon: FileText },
                        { title: "Statutory Affairs", desc: "Overseeing Senate, Syndicate, and Academic Council proceedings.", icon: Scale },
                        { title: "HR Coordination", desc: "Management of faculty and administrative staff appointments.", icon: UserCheck },
                        { title: "Event Management", desc: "Planning and execution of Annual Convocations and special events.", icon: Briefcase },
                     ].map((item, i) => (
                        <motion.div 
                          key={item.title}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="p-8 bg-white rounded-[2rem] border border-primary/5 shadow-sm group hover:border-secondary transition-all"
                        >
                           <item.icon className="text-secondary mb-4" size={32} />
                           <h4 className="text-xl font-black text-primary mb-2 uppercase tracking-tight">{item.title}</h4>
                           <p className="text-sm font-medium text-text-main/50 leading-relaxed">{item.desc}</p>
                        </motion.div>
                     ))}
                  </div>
               </div>

               {/* Portrait Side */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="xl:w-2/5 flex flex-col justify-between"
               >
                  <div className="relative flex-1 rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl bg-primary/10 min-h-[500px]">
                     <Image 
                       src="https://miro.medium.com/1*zWyjquNyIeYzkZc6hopFMA.png"
                       alt="The Registrar"
                       fill
                       className="object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                     <div className="absolute bottom-10 left-10 p-2">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Professor Dr. Rebecca Ahmed</h3>
                        <p className="text-secondary font-bold tracking-widest uppercase text-xs mt-2">University Registrar</p>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Operational Wings */}
      <section className="py-24 bg-white relative">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               {[
                  { title: "Academic Section", focus: "Courses, Syllabi & Enrollment", color: "text-blue-600", desc: "Overseeing the implementation of academic regulations and course structures." },
                  { title: "Records Wing", focus: "Archiving & Certification", color: "text-amber-600", desc: "Processing graduation data, transcript requests and verified certificates." },
                  { title: "General Admin", focus: "HR & Logistics", color: "text-emerald-600", desc: "Coordinating inter-departmental logistics and administrative staff welfare." }
               ].map((wing, i) => (
                  <motion.div 
                    key={wing.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-12 rounded-[3rem] bg-surface border border-primary/5 hover:bg-primary transition-all duration-500 group"
                  >
                     <div className={cn("w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8", wing.color)}>
                        <ShieldCheck size={32} />
                     </div>
                     <h3 className="text-2xl font-black text-primary uppercase group-hover:text-white transition-colors">{wing.title}</h3>
                     <p className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mt-2">{wing.focus}</p>
                     <p className="mt-6 text-text-main/50 font-medium group-hover:text-white/60 transition-colors leading-relaxed">
                        {wing.desc}
                     </p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Forms & Downloads */}
      <section className="py-24 bg-surface">
         <div className="container mx-auto px-4">
            <div className="bg-white rounded-[4rem] p-12 lg:p-20 shadow-2xl shadow-primary/5 border border-primary/5">
                <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-6">
                   <div className="space-y-4">
                      <div className="h-1.5 w-24 bg-secondary rounded-full" />
                      <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-none">
                         Forms & <span className="text-secondary font-serif">Downloads</span>
                      </h2>
                   </div>
                   <button onClick={(e) => actions.details(e)} className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs group">
                      View All Documents <ArrowUpRight className="text-secondary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {forms.map((form, i) => (
                      <motion.div 
                        key={form.name}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-6 rounded-3xl bg-surface hover:bg-primary transition-colors duration-300 group cursor-pointer"
                      >
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-secondary group-hover:text-primary transition-colors">
                               <FileText />
                            </div>
                            <div>
                               <h4 className="font-black text-primary uppercase tracking-tight group-hover:text-white transition-colors">{form.name}</h4>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] font-black text-secondary">{form.type}</span>
                                  <span className="w-1 h-1 rounded-full bg-text-main/20" />
                                  <span className="text-[10px] font-bold text-text-main/40 uppercase group-hover:text-white/40">{form.size}</span>
                               </div>
                            </div>
                         </div>
                         <Download size={20} className="text-text-main/20 group-hover:text-secondary group-hover:scale-110 transition-all" />
                      </motion.div>
                   ))}
                </div>
            </div>
         </div>
      </section>

      {/* Staff Directory */}
      <section className="py-24 bg-white">
         <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-20">
               <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase tracking-tight">Administrative <span className="text-secondary">Personnel</span></h2>
               <p className="text-text-main/40 font-bold uppercase tracking-widest text-xs">Meet our expert management team</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {officeStaff.map((staff, i) => (
                  <motion.div
                    key={staff.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 bg-surface rounded-[2.5rem] border border-transparent hover:border-primary/5 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all group"
                  >
                     <div className="relative w-full aspect-square mb-6 rounded-3xl overflow-hidden border-4 border-white shadow-lg">
                        <Image 
                           src={staff.image}
                           alt={staff.name}
                           fill
                           className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                        />
                     </div>
                     <div className="space-y-4">
                        <div>
                           <h4 className="text-lg font-black text-primary uppercase tracking-tight">{staff.name}</h4>
                           <p className="text-[10px] font-black text-secondary uppercase tracking-widest mt-1 leading-tight">{staff.role}</p>
                        </div>
                        <div className="space-y-2 pt-4 border-t border-primary/5">
                           <div className="flex items-center gap-2 text-[9px] font-black text-primary/40 uppercase">
                              <Mail size={12} className="text-secondary" /> {staff.mail}
                           </div>
                           <div className="flex items-center gap-2 text-[9px] font-black text-primary/40 uppercase">
                              <Phone size={12} className="text-secondary" /> {staff.phone}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Emergency Contact CTA */}
      <section className="py-24 bg-surface">
         <div className="container mx-auto px-4">
            <div className="p-12 lg:p-20 rounded-[4rem] bg-primary text-white flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
                <div className="space-y-6 relative z-10 text-center lg:text-left">
                   <h2 className="text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tight">
                      Support & <span className="text-secondary font-serif">Queries</span>
                   </h2>
                   <p className="text-white/60 text-lg font-medium max-w-xl leading-relaxed">
                      For urgent certificate verification or student record corrections, please visit the help desk at the Registrar’s Wing during office hours.
                   </p>
                </div>
                <div className="flex flex-wrap gap-4 relative z-10 justify-center">
                   <button onClick={() => actions.inquiry("Contact Registrar Office", { type: "contact", title: "Contact Registrar Office", context: "Page: Office of" })} className="flex items-center gap-3 px-8 py-5 bg-secondary text-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all">
                      Contact Registrar Office
                   </button>
                   <button onClick={() => actions.inquiry("Request: Official FAQs", { type: "contact", title: "Official FAQs", description: "Tell us how to reach you and we will send you this information." })} className="flex items-center gap-3 px-8 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-primary transition-all backdrop-blur-md">
                      Official FAQs
                   </button>
                </div>
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <History size={400} />
                </div>
            </div>
         </div>
      </section>
    </main>
  );
}
