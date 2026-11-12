"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { KeyRound, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [role, setRole] = useState("Student");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "password-reset",
          subject: `Password reset request (${role})`,
          email,
          message: note,
          meta: { role, userId },
          pagePath: "/forgot-password",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not send the request");
      setDone(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const input = "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0F2E5D] focus:ring-2 focus:ring-[#0F2E5D]/10";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        {done ? (
          <div className="text-center space-y-4">
            <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
            <h1 className="text-xl font-black text-[#0F2E5D]">Request received</h1>
            <p className="text-sm text-gray-500">The administration will verify your identity and reset your password. You will be contacted at {email}.</p>
            <Link href={role === "Student" ? "/login/student" : "/login/employee"} className="inline-block text-sm font-bold text-[#0F2E5D] hover:underline">
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#0F2E5D]/5 text-[#0F2E5D] flex items-center justify-center">
                <KeyRound size={20} />
              </div>
              <div>
                <h1 className="text-xl font-black text-[#0F2E5D]">Forgot password?</h1>
                <p className="text-xs text-gray-500">Send a reset request to the administration.</p>
              </div>
            </div>
            <select value={role} onChange={(e) => setRole(e.target.value)} className={input}>
              <option>Student</option>
              <option>Employee</option>
            </select>
            <input value={userId} onChange={(e) => setUserId(e.target.value)} required placeholder={role === "Student" ? "Student ID (e.g. CSE2024001)" : "Employee ID (e.g. T-001)"} className={input} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Your university email" className={input} />
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Anything else we should know? (optional)" className={input} />
            <button disabled={busy} className="w-full flex items-center justify-center gap-2 bg-[#0F2E5D] text-white font-bold rounded-xl py-3 hover:opacity-90 disabled:opacity-60">
              {busy && <Loader2 size={16} className="animate-spin" />} Send request
            </button>
            <Link href={role === "Student" ? "/login/student" : "/login/employee"} className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-[#0F2E5D]">
              <ArrowLeft size={14} /> Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
