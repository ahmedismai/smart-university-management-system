"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block h-full flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
