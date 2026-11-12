"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

type Me = { id: string; name: string; email: string; class: string; section: string; status: string; joinedAt?: string };

export default function IdCardPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/student/profile")
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed to load");
        setMe(j.student);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="text-red-600 font-bold">{error}</div>;
  if (!me) return <div className="text-gray-500 font-bold">Loading...</div>;

  const joined = me.joinedAt ? new Date(me.joinedAt) : new Date();
  const validUntil = new Date(joined.getFullYear() + 4, joined.getMonth(), joined.getDate());
  const initials = me.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between no-print">
        <Link href="/student/profile" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
          <ArrowLeft size={16} /> Back to profile
        </Link>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90">
          <Printer size={16} /> Print / Save as PDF
        </button>
      </div>

      <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 bg-white" data-keep-colors>
        <div className="bg-gradient-to-br from-[#0F2E5D] to-[#2E5E9F] text-white px-8 py-6">
          <p className="text-[10px] font-black tracking-[0.3em] text-yellow-300">NEXTGEN UNIVERSITY OF BANGLADESH</p>
          <p className="text-xl font-black mt-1">Student Identity Card</p>
        </div>
        <div className="p-8 flex gap-6 items-center">
          <div className="w-28 h-28 rounded-2xl bg-[#0F2E5D]/10 text-[#0F2E5D] flex items-center justify-center text-4xl font-black shrink-0">{initials}</div>
          <div className="space-y-1 min-w-0">
            <p className="text-2xl font-black text-gray-900 leading-tight">{me.name}</p>
            <p className="text-sm font-bold text-[#2E5E9F]">{me.id}</p>
            <p className="text-sm text-gray-600">{me.class}{me.section ? ` · ${me.section}` : ""}</p>
            <p className="text-xs text-gray-400 truncate">{me.email}</p>
          </div>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between text-xs font-bold text-gray-500">
          <span>Status: <span className={me.status === "Active" ? "text-emerald-600" : "text-red-600"}>{me.status}</span></span>
          <span>Valid until {validUntil.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center no-print">Use the print dialog to save this card as a PDF or print it.</p>
    </div>
  );
}
