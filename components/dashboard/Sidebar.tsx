"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CheckSquare, 
  GraduationCap, 
  Banknote as DollarSign, 
  Library, 
  Package, 
  Building2, 
  Bell, 
  BarChart3, 
  History, 
  Settings, 
  LogOut,
  ChevronRight,
  UserCircle,
  GraduationCap as StudentIcon,
  UserPlus,
  Users2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    title: "User Management",
    icon: Users,
    href: "/admin/users",
    subItems: [
      { title: "All Users", href: "/admin/users" },
      { title: "Students", href: "/admin/students" },
      { title: "Teachers", href: "/admin/teachers" },
      { title: "Parents", href: "/admin/parents" },
      { title: "Staff", href: "/admin/staff" },
      { title: "Role Assignment", href: "/admin/roles" },
      { title: "Applications", href: "/admin/applications" },
      { title: "Requests & Inquiries", href: "/admin/inquiries" },
    ]
  },
  {
    title: "Academic",
    icon: BookOpen,
    href: "/admin/academic",
    subItems: [
      { title: "Classes", href: "/admin/academic/classes" },
      { title: "Sections", href: "/admin/academic/sections" },
      { title: "Courses", href: "/admin/academic/courses" },
      { title: "Routines", href: "/admin/academic/routines" },
      { title: "Exams", href: "/admin/academic/exams" },
      { title: "Results", href: "/admin/academic/results" },
    ]
  },
  {
    title: "Attendance",
    icon: CheckSquare,
    href: "/admin/attendance",
    subItems: [
      { title: "Records", href: "/admin/attendance/records" },
      { title: "Reports", href: "/admin/attendance/reports" },
      { title: "Policies", href: "/admin/attendance/policies" },
    ]
  },
  {
    title: "Marks & Results",
    icon: GraduationCap,
    href: "/admin/marks",
    subItems: [
      { title: "Upload Marks", href: "/admin/marks/upload" },
      { title: "Grade Management", href: "/admin/marks/grades" },
      { title: "Transcript", href: "/admin/marks/transcript" },
      { title: "Report Cards", href: "/admin/marks/report-cards" },
    ]
  },
  {
    title: "Financial",
    icon: DollarSign,
    href: "/admin/financial",
    subItems: [
      { title: "Fees & Structure", href: "/admin/financial/fees" },
      { title: "Invoices", href: "/admin/financial/invoices" },
      { title: "Payments", href: "/admin/financial/payments" },
      { title: "Waivers", href: "/admin/financial/waivers" },
      { title: "Fines", href: "/admin/financial/fines" },
      { title: "Reports", href: "/admin/financial/reports" },
    ]
  },
  {
    title: "Library",
    icon: Library,
    href: "/admin/library",
  },
  {
    title: "Inventory",
    icon: Package,
    href: "/admin/inventory",
  },
  {
    title: "Hostel & Transport",
    icon: Building2,
    href: "/admin/hostel-transport",
  },
  {
    title: "Announcements",
    icon: Bell,
    href: "/admin/announcements",
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/admin/reports",
  },
  {
    title: "Audit Logs",
    icon: History,
    href: "/admin/audit-logs",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const router = useRouter();
  const toggleExpand = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(i => i !== title) 
        : [...prev, title]
    );
  };

  const handleLogout = () => {
    // Clear the session cookie
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    router.push("/login/employee");
  };

  return (
    <aside className="w-64 h-full bg-primary text-white flex flex-col overflow-hidden shadow-xl border-r border-white/10">
      {/* Menu Header */}
      <Link href={'/'}>
      
      <div className="p-5 border-b border-white/10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-white rounded-xl p-1 shadow-inner">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              fill 
              sizes="40px"
              className="object-contain p-1"
            />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">NextGen</h1>
            <p className="text-[10px] text-secondary font-medium mt-0.5">University</p>
          </div>
        </div>
      </div>
       </Link>
      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 no-scrollbar">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.subItems && item.subItems.some(s => pathname === s.href));
            const isExpanded = expandedItems.includes(item.title) || (isActive && item.subItems);

            return (
              <li key={item.title}>
                {item.subItems ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleExpand(item.title)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer",
                        isActive ? "bg-white/10 text-secondary" : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} className={cn(isActive ? "text-secondary" : "text-white/40 group-hover:text-white")} />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      <ChevronRight 
                        size={16} 
                        className={cn("transition-transform duration-200", isExpanded && "rotate-90")} 
                      />
                    </button>
                    
                    {isExpanded && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="pl-9 space-y-1"
                      >
                        {item.subItems.map((sub) => (
                          <li key={sub.title}>
                            <Link
                              href={sub.href}
                              className={cn(
                                "block py-2 text-xs transition-colors cursor-pointer",
                                pathname === sub.href ? "text-secondary font-semibold" : "text-white/50 hover:text-white"
                              )}
                            >
                              {sub.title}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer",
                      isActive ? "bg-white/10 text-secondary" : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon size={20} className={cn(isActive ? "text-secondary" : "text-white/40 group-hover:text-white")} />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-red-500/10 hover:text-red-400 w-full transition-all cursor-pointer"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
