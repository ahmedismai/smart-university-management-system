"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, Calendar, Users, Bell, LogOut, CheckSquare, GraduationCap, MessageSquare, Video, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TeacherDataProvider, useTeacherData } from "./useTeacherData";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/teacher/dashboard" },
  { title: "My Courses", icon: BookOpen, href: "/teacher/courses" },
  { title: "Lectures", icon: FileText, href: "/teacher/lectures" },
  { title: "Class Routine", icon: Calendar, href: "/teacher/routine" },
  { title: "My Students", icon: Users, href: "/teacher/students" },
  { title: "Attendance", icon: CheckSquare, href: "/teacher/attendance" },
  { title: "Marks Entry", icon: GraduationCap, href: "/teacher/marks" },
  { title: "Announcements", icon: Bell, href: "/teacher/announcements" },
  { title: "Messages", icon: MessageSquare, href: "/teacher/messages" },
  { title: "Meetings", icon: Video, href: "/teacher/meetings" },
];

const Shell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useTeacherData();

  const handleLogout = async () => {
    await fetch("/api/teacher/logout", { method: "POST" });
    router.push("/login/employee");
  };

  const initials = (data?.teacher.name || "T")
    .replace(/^(Dr|Prof)\.\s*/i, "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <aside className="w-64 h-full bg-primary text-white flex flex-col overflow-hidden shadow-xl border-r border-white/10">
        <Link href="/teacher/dashboard">
          <div className="p-3 border-b border-white/10 flex items-center gap-3">
            <div className="relative w-10 h-10 bg-white rounded-xl p-1 shadow-inner">
              <Image src="/logo.png" alt="Logo" fill sizes="40px" className="object-contain p-1" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-none">NextGen</h1>
              <p className="text-[10px] text-secondary font-medium mt-0.5">Faculty Portal</p>
            </div>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto py-4 no-scrollbar">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
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
                      <motion.div layoutId="teacher-active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

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

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 shrink-0">
          <p className="text-sm text-gray-500">
            Welcome back, <span className="font-bold text-primary">{data?.teacher.name || "..."}</span>
          </p>
          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-xs font-bold text-primary">{data?.teacher.teacherId}</p>
              <p className="text-[10px] text-gray-400">{data?.teacher.department} Department</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary text-secondary flex items-center justify-center text-xs font-black">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export const TeacherDashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <TeacherDataProvider>
    <Shell>{children}</Shell>
  </TeacherDataProvider>
);
