"use client";

import { actions } from "@/lib/siteActions";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Globe, 
  User, 
  Library, 
  GraduationCap, 
  Briefcase, 
  Users,
  Settings,
  BookOpen,
  FileText,
  HeartPulse
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { 
    name: "About", 
    href: "#", 
    hasDropdown: true,
    items: [
      { name: "Historical Outline", href: "/about/history" },
      { name: "Vision & Mission", href: "/about/vision-mission" },
      { name: "Campus Map", href: "/about/campus-map" },
      { name: "University Ordinance", href: "/about/ordinance" },
      { name: "Senate & Syndicate", href: "/about/senate-syndicate" }
    ]
  },
  { 
    name: "Academics", 
    href: "#", 
    hasDropdown: true,
    items: [
      { name: "Faculties", href: "/academics/faculties" },
      { name: "Departments", href: "/academics/departments" },
      { name: "Institutes", href: "/academics/institutes" },
      { name: "Academic Calendar", href: "/academics/academic-calendar" },
      { name: "Libraries", href: "/academics/libraries" },
      { name: "Affiliated Colleges", href: "/academics/affiliated-colleges" }
    ]
  },
  { 
    name: "Administration", 
    href: "#", 
    hasDropdown: true,
    items: [
      { name: "Office of the VC", href: "/administration/office-of-vc" },
      { name: "Registrar Office", href: "/administration/registrar-office" },
      { name: "Deans of Faculties", href: "/administration/deans" },
      { name: "Chairmen of Departments", href: "/administration/chairmen" },
      { name: "Administrative Offices", href: "/administration/administrative-offices" }
    ]
  },
  { 
    name: "Admission", 
    href: "#", 
    hasDropdown: true,
    items: [
      { name: "Undergraduate", href: "/admission/undergraduate" },
      { name: "Graduate", href: "/admission/graduate" },
      { name: "M.Phil/Ph.D", href: "/admission/mphil-phd" },
      { name: "International Students", href: "/admission/international" },
      { name: "Scholarships", href: "/admission/scholarships" },
      { name: "Rules & Guidelines", href: "/admission/rules" }
    ]
  },
  { 
    name: "Students", 
    href: "#", 
    hasDropdown: true,
    items: [
      { name: "Halls of Residence", href: "/students/halls" },
      { name: "Student Login", href: "/login/student" },
      { name: "Results", href: "/students/results" },
      { name: "Health Insurance", href: "/students/health-insurance" },
      { name: "Transport", href: "/students/transport" },
      { name: "Club Activities", href: "/students/clubs" }
    ]
  },
  { 
    name: "Research", 
    href: "#", 
    hasDropdown: true,
    items: [
      { name: "Research Centers", href: "/research/research-centers" },
      { name: "Publications", href: "/research/publications" },
      { name: "Journals", href: "/research/journals" },
      { name: "Funded Projects", href: "/research/funded-projects" },
      { name: "Innovation Lab", href: "/research/innovation-lab" }
    ]
  },
  { 
    name: "Quick Links", 
    href: "#", 
    hasDropdown: true,
    items: [
      { name: "Student Union", href: "/quick-links/student-union" },
      { name: "JOBS", href: "/quick-links/jobs" },
      { name: "Forms & Downloads", href: "/quick-links/downloads" },
      { name: "Notices & News", href: "/quick-links/news" },
      { name: "Events", href: "/quick-links/events" }
    ]
  },
];

const utilityLinks = [
  { name: "Student Login", icon: GraduationCap, href: "/login/student" },
  { name: "Employee Login", icon: User, href: "/login/employee" },
  { name: "Online Services", icon: Globe, href: "/services/online" },
  { name: "University Library", icon: Library, href: "/academics/libraries" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Helper to check if a link or any of its sub-items are active
  const isLinkActive = (link: typeof navLinks[0]) => {
    if (link.href !== "#" && pathname === link.href) return true;
    if (link.items) {
      return link.items.some(item => {
        const itemHref = typeof item === "string" ? "#" : item.href;
        return pathname === itemHref;
      });
    }
    return false;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Utility Bar */}
      <div 
        className={cn(
          "bg-primary text-white transition-all duration-300 overflow-hidden hidden lg:block",
          isScrolled ? "h-0 py-0 opacity-0" : "h-auto py-2 opacity-100"
        )}
      >
        <div className="container mx-auto px-4 flex justify-between items-center text-xs font-medium">
          <div className="flex gap-6">
            {utilityLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="flex items-center gap-1.5 hover:text-secondary transition-colors cursor-pointer"
              >
                <link.icon size={14} />
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
             <Link href="/career" className="hover:text-secondary transition-colors text-[11px] font-bold uppercase tracking-widest">Career</Link>
             <Link href="/tenders" className="hover:text-secondary transition-colors text-[11px] font-bold uppercase tracking-widest">Tenders</Link>
             <Link href="/feedback" className="hover:text-secondary transition-colors text-[11px] font-bold uppercase tracking-widest">Feedback</Link>
            <button onClick={() => actions.filter("Search this page")} className="flex items-center gap-1.5 hover:text-secondary transition-colors font-bold border-l border-white/20 pl-4 uppercase tracking-wider cursor-pointer">
              <Search size={14} />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav 
        className={cn(
          "w-full transition-all duration-300 border-b",
          isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-lg py-2 border-gray-100" 
            : "bg-white py-3 border-transparent"
        )}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo Section */}
          <Link href="/" className="relative flex items-center gap-3 shrink-0 cursor-pointer">
            <div className="relative w-12 h-12 lg:w-16 lg:h-16 transition-all duration-300">
              <Image 
                src="/logo.png" 
                alt="NextGen University Logo" 
                fill 
                className="object-contain"
                priority
                sizes="(max-width: 768px) 48px, 64px"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-primary font-bold text-lg lg:text-xl leading-tight">NextGen University</span>
              <span className="text-secondary font-medium text-[9px] lg:text-[11px] tracking-[0.2em] uppercase">Of Bangladesh</span>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-4">
            {navLinks.map((link) => (
              <div 
                key={link.name}
                className="relative group"
                onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link 
                  href={link.href}
                  className={cn(
                    "px-3 xl:px-4 py-3 flex items-center gap-1 font-bold text-[13px] xl:text-[14px] transition-all relative group cursor-pointer",
                    isLinkActive(link) ? "text-secondary" : "text-primary hover:text-secondary"
                  )}
                >
                  {link.name}
                  {link.hasDropdown && (
                    <ChevronDown size={14} className={cn("transition-transform duration-300 opacity-60", activeDropdown === link.name ? "rotate-180" : "")} />
                  )}
                  
                  {isLinkActive(link) && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute bottom-0 left-3 xl:left-4 right-3 xl:right-4 h-0.5 bg-secondary rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
                {/* Mega-style Dropdown */}
                <AnimatePresence>
                  {link.hasDropdown && activeDropdown === link.name && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 min-w-[240px] bg-white shadow-2xl p-4 mt-0.5 rounded-b-xl overflow-hidden"
                    >
                      <div className="grid gap-1">
                        {link.items?.map((item) => {
                          const itemName = typeof item === "string" ? item : item.name;
                          const itemHref = typeof item === "string" ? "#" : item.href;
                          return (
                            <Link 
                              key={itemName}
                              href={itemHref}
                              className={cn(
                                "p-2.5 rounded-lg transition-all group/item flex items-center gap-2",
                                pathname === itemHref ? "bg-secondary/10" : "hover:bg-surface"
                              )}
                            >
                               <div className={cn(
                                 "w-1.5 h-1.5 rounded-full bg-secondary transition-transform duration-300",
                                 pathname === itemHref ? "scale-100" : "scale-0 group-hover/item:scale-100"
                               )} />
                              <span className={cn(
                                "text-[13px] font-semibold transition-all",
                                pathname === itemHref ? "text-primary translate-x-1" : "text-text-main group-hover/item:text-primary group-hover/item:translate-x-1"
                              )}>
                                 {itemName}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Action Button & Toggle */}
          <div className="flex items-center gap-4">
             <Link 
              href="/admission/apply" 
              className="hidden sm:block bg-secondary text-primary px-5 py-2.5 rounded-md text-[13px] font-extrabold shadow-md hover:shadow-gold/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wider"
            >
              Apply Online
            </Link>
            
            <button 
              className="lg:hidden text-primary p-2 transition-transform active:scale-90 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={32} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[320px] bg-white z-[70] lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-100 bg-surface">
                 <Link href="/" className="relative flex items-center gap-2">
                  <Image src="/logo.png" alt="Logo" width={40} height={40} />
                  <span className="text-primary font-bold text-lg">NextGen</span>
                </Link>
                <button 
                  className="text-primary p-2 bg-white rounded-full shadow-md hover:rotate-90 transition-all duration-300 cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                 {navLinks.map((link) => (
                    <details key={link.name} className="group overflow-hidden rounded-xl bg-surface/50 border border-transparent open:border-gray-100 open:bg-white transition-all duration-300">
                      <summary className={cn(
                        "list-none p-4 flex justify-between items-center cursor-pointer font-bold transition-colors",
                        isLinkActive(link) ? "text-secondary" : "text-primary group-open:text-secondary"
                      )}>
                        {link.name}
                        {link.hasDropdown && <ChevronDown size={18} className="group-open:rotate-180 transition-transform" />}
                      </summary>
                      {link.hasDropdown && (
                        <div className="px-4 pb-4 grid gap-1">
                          {link.items?.map((item) => {
                            const itemName = typeof item === "string" ? item : item.name;
                            const itemHref = typeof item === "string" ? "#" : item.href;
                            return (
                              <Link 
                                key={itemName} 
                                href={itemHref} 
                                className={cn(
                                  "p-3 rounded-lg text-sm font-semibold border-l-4 transition-all cursor-pointer",
                                  pathname === itemHref 
                                    ? "bg-secondary/10 text-primary border-secondary" 
                                    : "bg-surface text-text-main border-transparent hover:border-secondary hover:bg-secondary/5"
                                )}
                              >
                                {itemName}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </details>
                 ))}

                 <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-3 p-2">
                    {utilityLinks.map((link) => (
                      <Link 
                        key={link.name} 
                        href={link.href}
                        className="flex flex-col items-center gap-2 p-4 bg-surface rounded-xl hover:bg-secondary/10 transition-all duration-300 group"
                      >
                        <link.icon size={20} className="text-primary group-hover:text-secondary group-hover:scale-110 transition-all" />
                        <span className="text-[10px] font-bold text-center uppercase tracking-tighter text-gray-400 group-hover:text-primary">{link.name}</span>
                      </Link>
                    ))}
                 </div>
              </div>

              <div className="p-6 bg-surface/30">
                <Link 
                  href="/admission/apply" 
                  className="block w-full bg-primary text-secondary text-center py-4 rounded-xl font-extrabold text-lg shadow-xl active:scale-95 transition-transform cursor-pointer"
                >
                  Apply Online
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
