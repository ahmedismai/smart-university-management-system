"use client";

import React from "react";
import { Wrench } from "lucide-react";

interface AdminPageSkeletonProps {
  title: string;
  description: string;
}

export const AdminPageSkeleton = ({ title, description }: AdminPageSkeletonProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="text-slate-500">{description}</p>
      </div>

      <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
          <Wrench size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Section Under Development</h3>
        <p className="text-slate-500 max-w-sm mt-2">
          We are currently building this section of the Admin Dashboard. Please check back later for full functionality.
        </p>
        <button 
          onClick={() => window.history.back()}
          className="mt-6 px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};
