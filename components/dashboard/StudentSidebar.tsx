"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  UserCircle, 
  CheckSquare, 
  GraduationCap, 
  Banknote as DollarSign, 
  BookOpen, 
  Calendar, 
  Library, 
  Bell, 
  MessageSquare, 
  Download, 
  Video,
  FileText,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const studentMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/student/dashboard",
  },
  {
    title: "My Profile",
    icon: UserCircle,
    href: "/student/profile",
  },
  {
    title: "Attendance",
    icon: CheckSquare,
    href: "/student/attendance",
  },
  {
    title: "Marks & Results",
    icon: GraduationCap,
    href: "/student/results",
  },
  {
    title: "Fees & Payment",
    icon: DollarSign,
    href: "/student/fees",
  },
  {
    title: "Courses",
    icon: BookOpen,
    href: "/student/courses",
  },
  {
    title: "Lectures",
    icon: FileText,
    href: "/student/lectures",
  },
  {
    title: "Class Routine",
    icon: Calendar,
    href: "/student/routine",
  },
  {
    title: "Library",
    icon: Library,
    href: "/student/library",
  },
  {
    title: "Announcements",
    icon: Bell,
    href: "/student/announcements",
  },
  {
    title: "Messaging",
    icon: MessageSquare,
    href: "/student/messages",
  },
  {
    title: "Online Classes",
    icon: Video,
    href: "/student/meetings",
  },
  {
    title: "Downloads",
    icon: Download,
    href: "/student/downloads",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/student/settings",
  },
];

export const StudentSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Clear the student session cookie
    document.cookie = "student_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    router.push("/login/student");
  };

  return (
    <aside className="w-64 h-full bg-primary text-white flex flex-col overflow-hidden shadow-xl border-r border-white/10">
      {/* Menu Header */}
      <Link href="/student/dashboard">
        <div className="p-3 border-b border-white/10 flex flex-col gap-4">
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
          {studentMenuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer",
                    isActive ? "bg-white/10 text-secondary" : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon size={20} className={cn(isActive ? "text-secondary" : "text-white/40 group-hover:text-white")} />
                  <span className="text-sm font-medium">{item.title}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary"
                    />
                  )}
                </Link>
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
