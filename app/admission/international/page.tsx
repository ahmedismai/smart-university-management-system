"use client";

import { actions } from "@/lib/siteActions";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Globe, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Plane, 
  Home, 
  Languages, 
  ArrowRight,
  HandHelping,
  Sparkles
} from "lucide-react";

const supportServices = [
  {
    title: "Visa Assistance",
    description: "Personalized guidance through the student visa application process and legal documentation.",
    icon: ShieldCheck,
  },
  {
    title: "Pre-Arrival Support",
    description: "Orientation webinars and guides to help you prepare for your journey to Bangladesh.",
    icon: Plane,
  },
  {
    title: "Housing & Residence",
    description: "Help finding suitable accommodation, whether on-campus or in the vibrant surrounding city.",
    icon: Home,
  },
  {
    title: "Language Services",
    description: "English language support and cultural integration programs for a smooth transition.",
    icon: Languages,
  },
];

const roadmapSteps = [
  { title: "Review Programs", desc: "Choose from our wide array of undergraduate and graduate degrees." },
  { title: "English Proficiency", desc: "Submit your TOEFL, IELTS, or Duolingo English Test scores." },
  { title: "Submit Application", desc: "Apply through our specialized international student portal." },
  { title: "Visa & Enrollment", desc: "Once accepted, we help you with the visa and travel arrangements." },
];

export default function InternationalStudentsPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Welcoming Hero Section */}
      <section className="relative h-[85vh] min-h-[650px] flex items-center justify-center overflow-hidden">
        <Image
          src="/admission/international-hero.png"
          alt="Diverse International Students"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/95 via-primary/40 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-secondary/10 backdrop-blur-md border border-secondary/20 text-secondary shadow-xl mx-auto">
                <Globe size={18} className="animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Your Global Future Starts Here</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tighter">
                Connect <br/>
                <span className="text-secondary font-serif normal-case tracking-tight text-6xl lg:text-8xl">with the World</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
                Join a vibrant, multi-cultural community of scholars from over 60 countries. At NextGen, your global perspective is our greatest asset.
              </p>
              
              <div className="flex flex-wrap gap-6 pt-6 justify-center">
                <button onClick={() => actions.go("/admission/apply")} className="px-12 py-5 bg-secondary text-primary rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl">
                  Start Application
                </button>
                <button onClick={() => actions.inquiry("Chat with an Ambassador", { type: "contact", title: "Chat with an Ambassador", context: "Page: Connect" })} className="px-12 py-5 border-2 border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-primary transition-all">
                  Chat with an Ambassador
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-0 right-0 p-12 hidden lg:block">
           <div className="flex items-center gap-4 text-white/40 font-bold uppercase tracking-widest text-xs">
              <MapPin size={20} className="text-secondary" /> Dhaka, Bangladesh
           </div>
        </div>
      </section>

      {/* Why NextGen? Global Excellence */}
      <section className="py-32 bg-white text-center">
        <div className="container mx-auto px-4 max-w-4xl">
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
           >
              <h2 className="text-4xl lg:text-6xl font-black text-primary uppercase leading-tight tracking-tight">A Global <span className="text-secondary font-serif normal-case">Powerhouse</span> of Learning</h2>
              <p className="text-lg text-text-main/60 font-medium leading-relaxed">
                NextGen University is recognized globally for its inclusive culture and academic rigor. We provide a supportive ecosystem designed specifically for the success of international scholars.
              </p>
           </motion.div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
              {[
                { label: "Country Diversity", value: "60+", icon: Globe },
                { label: "International Faculty", value: "35%", icon: Users },
                { label: "Global Partner Universities", value: "120+", icon: Sparkles },
              ].map((stat, i) => (
                <div key={i} className="space-y-3">
                   <stat.icon className="mx-auto text-secondary" size={32} />
                   <div className="text-4xl font-black text-primary uppercase tracking-tighter">{stat.value}</div>
                   <div className="text-[10px] font-black text-text-main/30 uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Specialized Support Services */}
      <section className="py-32 bg-surface relative overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-12">
                 <div className="space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase leading-none tracking-tight">Dedicated <br/><span className="text-secondary font-serif normal-case">Support</span> Services</h2>
                    <div className="w-32 h-2 bg-secondary rounded-full" />
                 </div>
                 
                 <p className="text-lg text-text-main/70 font-medium leading-relaxed">
                   Transitioning to a new country can be challenging. Our dedicated International Student Office provides continuous support from the moment you apply until the day you graduate.
                 </p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {supportServices.map((service, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ y: -5 }}
                        className="p-8 bg-white rounded-[2.5rem] border border-primary/5 hover:border-secondary/20 transition-all duration-300 group"
                      >
                         <service.icon className="text-secondary mb-4 group-hover:scale-110 transition-transform" size={28} />
                         <h4 className="text-lg font-black text-primary uppercase mb-2">{service.title}</h4>
                         <p className="text-sm font-medium text-text-main/40 leading-relaxed">{service.description}</p>
                      </motion.div>
                    ))}
                 </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-square lg:aspect-video rounded-[3rem] overflow-hidden shadow-2xl"
              >
                 <Image src="/admission/international-support.png" alt="International Support" fill className="object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              </motion.div>
           </div>
        </div>
      </section>

      {/* Global Campus Life */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
           <div className="bg-primary rounded-[5rem] overflow-hidden relative">
              <Image src="/admission/international-campus-life.png" alt="Campus Life" fill className="object-cover opacity-20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/40 to-transparent" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 p-12 lg:p-24 items-center gap-20">
                 <div className="space-y-10">
                    <h2 className="text-5xl lg:text-6xl font-black text-white uppercase leading-[0.9] tracking-tighter">A Home Away <br/><span className="text-secondary font-serif normal-case">From Home</span></h2>
                    <p className="text-xl text-white/60 leading-relaxed font-light max-w-xl">
                      Experience a campus where every culture is celebrated. With over 20 international student clubs and weekly cultural festivals, you'll never feel alone.
                    </p>
                    <div className="flex flex-wrap gap-4">
                       <button onClick={(e) => actions.details(e)} className="px-10 py-5 bg-secondary text-primary rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all">Explore Campus Clubs</button>
                       <button onClick={() => actions.inquiry("Virtual Tour", { type: "registration", title: "Virtual Tour", context: "Page: Connect" })} className="px-10 py-5 border-2 border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-primary transition-all">Virtual Tour</button>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: "Cultural Synergy", text: "Weekly global food and arts festivals." },
                      { title: "Peer Mentorship", text: "Matched with a senior student mentor." },
                      { title: "City Immersion", text: "Guided tours and cultural integration." },
                      { title: "Safety & Care", text: "24/7 dedicated support desk." }
                    ].map((feature, i) => (
                      <div key={i} className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl text-center space-y-2">
                         <div className="text-secondary font-black text-xs uppercase tracking-widest">{feature.title}</div>
                         <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase">{feature.text}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* International Roadmap */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
              <h2 className="text-4xl lg:text-5xl font-black text-primary uppercase tracking-tight">Application <span className="text-secondary">Roadmap</span></h2>
              <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full" />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {roadmapSteps.map((step, i) => (
                <div key={i} className="relative group p-10 border border-primary/5 rounded-[2.5rem] hover:bg-surface hover:border-secondary/20 transition-all duration-500">
                   <div className="absolute -top-5 left-10 w-10 h-10 bg-primary text-secondary rounded-xl flex items-center justify-center font-black text-lg shadow-xl group-hover:scale-110 transition-all">
                      {i + 1}
                   </div>
                   <div className="space-y-4 pt-4">
                      <h4 className="text-lg font-black text-primary uppercase tracking-tight">{step.title}</h4>
                      <p className="text-sm font-medium text-text-main/40 leading-relaxed">{step.desc}</p>
                   </div>
                   {i < 3 && (
                     <div className="hidden lg:block absolute top-1/2 -right-4 translate-x-1/2 text-primary/10">
                        <ArrowRight size={32} />
                     </div>
                   )}
                </div>
              ))}
           </div>
           
           <div className="mt-20 p-12 bg-surface rounded-[4rem] flex flex-col lg:flex-row items-center justify-between gap-10 border border-primary/5">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-primary text-secondary rounded-2xl flex items-center justify-center shadow-xl">
                    <HandHelping size={32} />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-2xl font-black text-primary uppercase tracking-tight">Need help during the process?</h4>
                    <p className="text-sm font-medium text-text-main/40 uppercase tracking-widest">Our international counselors are ready to assist you.</p>
                 </div>
              </div>
              <button onClick={() => actions.inquiry("Contact counselor", { type: "contact", title: "Contact counselor", context: "Page: Connect" })} className="px-12 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl">Contact counselor</button>
           </div>
        </div>
      </section>
    </main>
  );
}
