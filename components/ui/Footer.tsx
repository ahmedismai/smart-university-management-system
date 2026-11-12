"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  ExternalLink
} from "lucide-react";

interface CustomIconProps {
  size?: number;
  className?: string;
}

const Facebook = ({ size = 18, className }: CustomIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const Twitter = ({ size = 18, className }: CustomIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const Linkedin = ({ size = 18, className }: CustomIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);
const Youtube = ({ size = 18, className }: CustomIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
);

const colVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://x.com", label: "Twitter" },
  { icon: Linkedin, href: "https://www.linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://www.youtube.com", label: "YouTube" },
];

const quickLinks = [
  { name: "Programs & Admissions", href: "/admission/undergraduate" },
  { name: "Academic Calendar", href: "/academics/academic-calendar" },
  { name: "Research & Innovation", href: "/research/publications" },
  { name: "Alumni Network", href: "/career" },
  { name: "Campus Life", href: "/students/clubs" },
];

const resources = [
  { name: "SUMS Student Portal", href: "/login/student" },
  { name: "Digital Library", href: "/academics/libraries" },
  { name: "Career Services", href: "/career" },
  { name: "Institutional Repository", href: "/research/journals" },
  { name: "IT Support Center", href: "/services/online" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-primary text-white overflow-hidden pt-24 pb-12">
      {/* Decorative Background Accents */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          
          {/* Column 1: Identity */}
          <motion.div 
            custom={0}
            variants={colVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="SUMS Logo" width={50} height={50} className="relative w-12 h-12 lg:w-14 lg:h-14 object-contain transition-transform group-hover:scale-105" />
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg lg:text-xl leading-tight">NextGen University</span>
                  <span className="text-secondary font-medium text-[9px] lg:text-[11px] tracking-[0.2em] uppercase">Of Bangladesh</span>
                </div>
              </div>
            </Link>
            <p className="text-white/50 text-sm font-medium leading-relaxed max-w-xs">
              Pioneering excellence in higher education through innovation, digital transformation, and social impact since its inception. Empowering the next generation of global leaders.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((item, idx) => (
                <Link 
                  key={idx} 
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:bg-secondary hover:text-primary hover:border-secondary hover:-translate-y-1 group"
                  aria-label={item.label}
                >
                  <item.icon size={18} />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div 
            custom={1}
            variants={colVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-secondary">Academics</h4>
            <ul className="space-y-4">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-white/60 hover:text-white text-sm font-bold transition-all flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/0 group-hover:bg-secondary transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Resources */}
          <motion.div 
            custom={2}
            variants={colVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-secondary">Resources</h4>
            <ul className="space-y-4">
              {resources.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-white/60 hover:text-white text-sm font-bold transition-all flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/0 group-hover:bg-secondary transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact */}
          <motion.div 
            custom={3}
            variants={colVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-secondary">Connect</h4>
            <div className="space-y-6">
              <div className="flex gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-colors group-hover:border-secondary/50">
                  <MapPin size={18} className="text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-white/40 font-black uppercase tracking-widest mb-1">Campus Location</span>
                  <p className="text-sm font-bold text-white/80">
                    Gulshan-2 Academic Block<br/>Dhaka, 1212, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-colors group-hover:border-secondary/50">
                  <Mail size={18} className="text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-white/40 font-black uppercase tracking-widest mb-1">Inquiry Mailbox</span>
                  <p className="text-sm font-bold text-white/80">registrar@nextgen.university</p>
                </div>
              </div>

              <div className="flex gap-4 group text-secondary hover:text-white transition-colors cursor-pointer">
                <ShieldCheck size={18} />
                <span className="text-xs font-black uppercase tracking-widest leading-none">Security Reporting</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">
            <p>&copy; {currentYear} NextGen University of Bangladesh. All rights reserved.</p>
            <span className="hidden md:block w-px h-4 bg-white/10" />
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-secondary transition-colors  ">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-secondary transition-colors  ">Terms of Use</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">
            <ExternalLink size={12} className="text-secondary" />
            Powered by SUMS Digital Governance
          </div>
        </div>
      </div>
    </footer>
  );
}
