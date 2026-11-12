"use client";

import { actions } from "@/lib/siteActions";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Mail, 
  MapPin, 
  Phone, 
  ArrowUpRight, 
  ShieldCheck,
  FlaskConical,
  Cpu,
  Briefcase,
  Palette,
  Scale,
  Library,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";

const deans = [
  {
    name: "Professor Dr. M. Mahboob Hosain",
    title: "Dean, Faculty of Science",
    faculty: "Science",
    icon: FlaskConical,
    color: "text-blue-600 bg-blue-50",
    email: "dean.science@nextgen.edu",
    office: "Science Building, 2nd Floor, Room 302",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop"
  },
  {
    name: "Professor Dr. Md. Mostofa Akbar",
    title: "Dean, Faculty of Engineering & Tech",
    faculty: "Engineering",
    icon: Cpu,
    color: "text-orange-600 bg-orange-50",
    email: "dean.engg@nextgen.edu",
    office: "IT Tower, 5th Floor, Room 512",
    image: "https://cse.buet.ac.bd/web/assets/img/faculty/bayzid1.JPG"
  },
  {
    name: "Professor Dr. Mahmuda Akter",
    title: "Dean, Faculty of Business Studies",
    faculty: "Business",
    icon: Briefcase,
    color: "text-emerald-600 bg-emerald-50",
    email: "dean.business@nextgen.edu",
    office: "Business Complex, Ground Floor, Room 105",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&auto=format&fit=crop"
  },
  {
    name: "Professor Dr. Syed Azizul Huq",
    title: "Dean, Faculty of Arts & Humanities",
    faculty: "Arts",
    icon: Palette,
    color: "text-purple-600 bg-purple-50",
    email: "dean.arts@nextgen.edu",
    office: "Arts Building, 1st Floor, Room 214",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&auto=format&fit=crop"
  },
  {
    name: "Professor Dr. Md. Rahmat Ullah",
    title: "Dean, Faculty of Law",
    faculty: "Law",
    icon: Scale,
    color: "text-red-600 bg-red-50",
    email: "dean.law@nextgen.edu",
    office: "Law Annex, 3rd Floor, Room 301",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&auto=format&fit=crop"
  },
  {
    name: "Professor Dr. Sadeka Halim",
    title: "Dean, Faculty of Social Sciences",
    faculty: "Social Sciences",
    icon: Library,
    color: "text-indigo-600 bg-indigo-50",
    email: "dean.social@nextgen.edu",
    office: "Social Science Annex, 4th Floor, Room 408",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&auto=format&fit=crop"
  }
];

export default function DeansPage() {
  return (
    <main className="flex flex-col min-h-screen pt-20 lg:pt-0">
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/faculties-hero.png" // Reusing professional asset
          alt="University Academic Wing"
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
               <Award size={16} className="text-secondary" />
               <span className="text-xs font-bold uppercase tracking-[0.2em]">Academic Leadership</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tight">
               Deans of <br/>
               <span className="text-secondary font-serif">Faculties</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
               Meet the visionary academic leaders overseeing the research, innovation, and educational excellence across our specialized faculties.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
               {deans.map((dean, i) => (
                  <motion.div
                    key={dean.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 bg-white rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
                  >
                     <div className="relative w-full aspect-[4/5] mb-8 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl">
                        <Image 
                           src={dean.image}
                           alt={dean.name}
                           fill
                           className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                        />
                        {/* Overlay with Faculty Icon */}
                        <div className={cn("absolute bottom-6 left-6 p-4 rounded-2xl shadow-2xl transition-transform duration-500 group-hover:-translate-y-2", dean.color)}>
                           <dean.icon size={24} />
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-2">
                           <h4 className="text-2xl font-black text-primary uppercase leading-tight tracking-tight group-hover:text-secondary transition-colors">
                              {dean.name}
                           </h4>
                           <p className="text-xs font-bold text-text-main/40 uppercase tracking-widest">{dean.title}</p>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-primary/5">
                           <div className="flex items-start gap-3">
                              <div className="mt-1 p-1 rounded bg-secondary/10">
                                 <Mail size={12} className="text-secondary" />
                              </div>
                              <span className="text-[11px] font-bold text-primary/60 uppercase">{dean.email}</span>
                           </div>
                           <div className="flex items-start gap-3">
                              <div className="mt-1 p-1 rounded bg-secondary/10">
                                 <MapPin size={12} className="text-secondary" />
                              </div>
                              <span className="text-[11px] font-bold text-primary/60 uppercase leading-tight">{dean.office}</span>
                           </div>
                        </div>

                        <button onClick={(e) => actions.details(e)} className="w-full flex items-center justify-between p-4 bg-surface rounded-2xl group/btn hover:bg-primary transition-all duration-500">
                           <span className="text-[10px] font-black text-primary group-hover/btn:text-white uppercase tracking-widest">Leadership Profile</span>
                           <ArrowUpRight size={18} className="text-secondary group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </button>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Support Section */}
      <section className="py-24 bg-white">
         <div className="container mx-auto px-4">
            <div className="bg-primary p-12 lg:p-24 rounded-[4rem] relative overflow-hidden group">
               {/* Background pattern */}
               <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <ShieldCheck size={400} className="text-white absolute -bottom-20 -right-20" />
               </div>
               
               <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                  <div className="space-y-6 lg:max-w-2xl text-center lg:text-left">
                     <h2 className="text-4xl lg:text-6xl font-black text-white uppercase leading-tight tracking-tight">
                        Administrative <br /> <span className="text-secondary font-serif">Support</span>
                     </h2>
                     <p className="text-white/60 text-lg font-medium leading-relaxed">
                        The Office of the Deans coordinates all academic curricula, faculty research initiatives, and student examinations within their respective faculties. For administrative queries, please contact the specific Faculty office during office hours.
                     </p>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                     <button onClick={() => actions.inquiry("Request: Office Directory", { type: "contact", title: "Office Directory", description: "Tell us how to reach you and we will send you this information." })} className="px-8 py-5 bg-secondary text-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all">
                        Office Directory
                     </button>
                     <button onClick={() => actions.inquiry("Request: Institutional Helpdesk", { type: "contact", title: "Institutional Helpdesk", description: "Tell us how to reach you and we will send you this information." })} className="px-8 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-primary transition-all backdrop-blur-md">
                        Institutional Helpdesk
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </main>
  );
}
