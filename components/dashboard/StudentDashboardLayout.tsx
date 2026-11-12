"use client";

import React from "react";
import { StudentSidebar } from "./StudentSidebar";
import { StudentDashboardHeader } from "./StudentDashboardHeader";
import { motion } from "framer-motion";

export const StudentDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <StudentDashboardHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
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
