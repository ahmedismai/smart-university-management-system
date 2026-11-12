"use client";

import React from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardCheck, 
  Wallet, 
  MessageSquare, 
  Library, 
  FileText, 
  UserCircle, 
  Package, 
  Home, 
  Cpu,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    id: 1,
    title: "Authentication & Authorization",
    description: "Secure login and role-based access ensure that every user can access only the information and tools relevant to their role. Admin, Teacher, Student, Parent, and Staff accounts are protected with modern authentication methods.",
    icon: ShieldCheck,
    tag: "Security",
  },
  {
    id: 2,
    title: "Multi-Role Dashboard",
    description: "Each user gets a personalized dashboard with role-specific data, statistics, and quick actions. Students can view attendance and results, while teachers manage classes and marks efficiently.",
    icon: LayoutDashboard,
    tag: "Analytics",
  },
  {
    id: 3,
    title: "Student & Teacher Management",
    description: "System provides digital profiles for students and teachers, making it easy to manage personal information, academic records, departments, and performance history in a centralized database.",
    icon: Users,
    tag: "Profiles",
  },
  {
    id: 4,
    title: "Class & Routine Management",
    description: "SUMS helps generate and organize class schedules automatically while avoiding conflicts between teachers, rooms, and sections. Faster, smarter, and more reliable class planning.",
    icon: Calendar,
    tag: "Scheduling",
  },
  {
    id: 5,
    title: "Attendance & Result Management",
    description: "Teachers record attendance digitally, and the system automatically calculates grades, GPAs, and report cards. Parents and students access updated records in real time.",
    icon: ClipboardCheck,
    tag: "Academics",
  },
  {
    id: 6,
    title: "Fees & Financial System",
    description: "Track tuition fees, invoices, waivers, scholarships, fines, and refunds. Administrators monitor overdue payments and generate financial summaries with ease.",
    icon: Wallet,
    tag: "Finance",
  },
  {
    id: 7,
    title: "Messaging & Notification System",
    description: "Secure communication between teachers, students, parents, and administrators. Important announcements, notices, and updates delivered instantly through one system.",
    icon: MessageSquare,
    tag: "Communication",
  },
  {
    id: 8,
    title: "Library Management",
    description: "Manage book inventory, issue/return records, reservations, and overdue reminders. Track lost or damaged books in a highly organized digital module.",
    icon: Library,
    tag: "Resources",
  },
  {
    id: 9,
    title: "Course Registration",
    description: "Students enroll in courses each semester, while administrators manage course assignments, section mapping, and academic planning more efficiently.",
    icon: FileText,
    tag: "Enrollment",
  },
  {
    id: 10,
    title: "HR & Staff Management",
    description: "Staff profiles, designations, leave requests, and departmental information managed from one system, making administrative tasks more structured and transparent.",
    icon: UserCircle,
    tag: "Human Resources",
  },
  {
    id: 11,
    title: "Inventory & Asset Management",
    description: "Track university assets such as lab equipment, computers, and projectors. Support issue/return records and maintenance logs for campus resources.",
    icon: Package,
    tag: "Assets",
  },
  {
    id: 12,
    title: "Hostel & Transport Management",
    description: "Manage hostel room allocation, transport routes, and student assignments. Monthly transport fee tracking for a complete and connected campus experience.",
    icon: Home,
    tag: "Logistics",
  },
  {
    id: 13,
    title: "Secure & Scalable Architecture",
    description: "Built with modern technologies, the platform is secure, scalable, and future-ready. Designed to support growth while maintaining high performance and reliability.",
    icon: Cpu,
    tag: "System",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function FeaturesSection() {
  const [showAll, setShowAll] = React.useState(false);

  const displayedFeatures = showAll ? features : features.slice(0, 6);

  return (
    <section id="features" className="relative py-24 lg:py-32 overflow-hidden bg-surface">
      {/* Decorative Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="relative max-w-4xl mx-auto text-center mb-20 lg:mb-28">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/40 backdrop-blur-md border border-primary/10 shadow-sm mb-8 select-none"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary shadow-[0_0_8px_rgba(212,175,55,0.8)]"></span>
            </span>
            <span className="text-[11px] lg:text-xs font-black uppercase tracking-[0.3em] text-primary/80">NextGen Features</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-6xl font-black text-primary leading-[1.05] mb-10 tracking-tight"
          >
            Essential Features of <br/>
            <span className="relative inline-block mt-2 font-serif   text-secondary">
              NextGen University
              <motion.span 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent rounded-full opacity-40" 
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl lg:text-2xl text-text-main/50 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Empowering institutions with a <span className="text-primary font-bold">comprehensive ecosystem</span> designed to digitize, automate, and elevate every aspect of the academic journey.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {displayedFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                layout
                className={cn(
                  "group relative p-8 lg:p-10 rounded-[2.5rem] bg-white border border-primary/5 transition-all duration-500",
                  "hover:shadow-[0_20px_50px_rgba(15,46,93,0.1)] hover:-translate-y-2 hover:border-secondary/20",
                  feature.id === 13 ? "lg:col-span-1 md:col-span-2 md:bg-primary group/dark" : ""
                )}
              >
                {/* Feature Icon & Tag */}
                <div className="flex justify-between items-start mb-8">
                  <div className={cn(
                     "w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                     feature.id === 13 ? "bg-white/10 text-secondary" : "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white"
                  )}>
                    <feature.icon size={28} />
                  </div>
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                    feature.id === 13 ? "bg-white/10 text-white/60" : "bg-primary/5 text-primary/40 group-hover:bg-secondary/10 group-hover:text-secondary"
                  )}>
                     {feature.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className={cn(
                    "text-xl lg:text-2xl font-black transition-colors duration-500",
                    feature.id === 13 ? "text-white" : "text-primary group-hover:text-secondary"
                  )}>
                    {feature.title}
                  </h3>
                  <p className={cn(
                     "text-sm font-medium leading-relaxed transition-colors duration-500",
                     feature.id === 13 ? "text-white/60" : "text-text-main/50 group-hover:text-text-main/70"
                  )}>
                    {feature.description}
                  </p>
                </div>

                {/* Interactive Decoration */}
                <div className={cn(
                  "absolute bottom-8 right-8 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0",
                  feature.id === 13 ? "text-secondary" : "text-primary"
                )}>
                  <ArrowRight size={20} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Toggle Button */}
        <div className="mt-16 flex justify-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => {
              if (showAll) {
                setShowAll(false);
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                setShowAll(true);
              }
            }}
            className="group relative px-8 py-4 rounded-2xl bg-primary text-white font-bold overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/10 to-secondary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative flex items-center gap-2 cursor-pointer">
              {showAll ? (
                <>Show Fewer Features <ArrowRight size={18} className="rotate-[-90deg] group-hover:-translate-y-1 transition-transform" /></>
              ) : (
                <>Discover All Features <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
