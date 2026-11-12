"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Toaster } from "react-hot-toast";
import ActionsProvider from "@/components/layout/ActionsProvider";
import ThemeApplier from "@/components/layout/ThemeApplier";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname?.startsWith("/admin/");
  const isStudentRoute = pathname === "/student" || pathname?.startsWith("/student/");

  const isTeacherRoute = pathname === "/teacher" || pathname?.startsWith("/teacher/");

  if (isAdminRoute || isStudentRoute || isTeacherRoute) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Toaster position="top-right" reverseOrder={false} />
        <ThemeApplier />
        <ActionsProvider />
        {children}
        {!isAdminRoute && !/\/meetings\/[^/]+/.test(pathname || "") && <ChatbotWidget />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />
      <ThemeApplier />
        <ActionsProvider />
      <Navbar />
      <div className="pt-[110px] flex-1">
        {children}
      </div>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
