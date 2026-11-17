"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Mail,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Hourglass,
  GraduationCap,
  LogIn,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Result = {
  applicationId: string;
  fullName: string;
  program: string;
  submittedAt: string;
  updatedAt: string;
  status: "Pending" | "Under Review" | "Accepted" | "Rejected";
  decisionNote: string;
  studentId: string | null;
  ownPassword: boolean;
};

const STEPS = [
  { key: "submitted", label: "Submitted", icon: FileText },
  { key: "review", label: "Under Review", icon: Hourglass },
  { key: "decision", label: "Decision", icon: GraduationCap },
];

function stepIndex(status: Result["status"]) {
  if (status === "Pending") return 0;
  if (status === "Under Review") return 1;
  return 2;
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

function StatusChecker() {
  const params = useSearchParams();
  const [applicationId, setApplicationId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const id = params.get("id");
    if (id) setApplicationId(id);
  }, [params]);

  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admission/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setResult(json.application);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const current = result ? stepIndex(result.status) : -1;

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-bold uppercase tracking-wider">
            <span className="w-2 h-2 bg-secondary rounded-full" />
            Admissions 2026-27
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-primary">Application Status</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Enter the application ID you received after applying and the email you used, to see the admission decision.
          </p>
        </motion.div>

        <form onSubmit={check} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="space-y-2 block">
              <span className="text-sm font-bold text-primary/70 ml-1">Application ID</span>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
                <input
                  required
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  placeholder="APP-2026-00001"
                  className="w-full pl-11 pr-4 py-3.5 bg-surface rounded-xl border-2 border-transparent focus:border-secondary focus:bg-white outline-none uppercase"
                />
              </div>
            </label>
            <label className="space-y-2 block">
              <span className="text-sm font-bold text-primary/70 ml-1">Email address</span>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-surface rounded-xl border-2 border-transparent focus:border-secondary focus:bg-white outline-none"
                />
              </div>
            </label>
          </div>
          {error && <p className="text-sm font-bold text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-60 cursor-pointer"
          >
            <Search size={18} />
            {loading ? "Checking..." : "Check Status"}
          </button>
          <p className="text-xs text-center text-gray-400">
            Haven&apos;t applied yet?{" "}
            <Link href="/admission/apply" className="text-primary font-bold hover:underline">Apply online</Link>
          </p>
        </form>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{result.applicationId}</p>
                <h2 className="text-2xl font-black text-primary">{result.fullName}</h2>
                <p className="text-sm text-gray-500">{result.program} · submitted {fmt(result.submittedAt)}</p>
              </div>
              <span
                className={cn(
                  "self-start md:self-auto px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest",
                  result.status === "Accepted" && "bg-emerald-100 text-emerald-700",
                  result.status === "Rejected" && "bg-red-100 text-red-700",
                  result.status === "Under Review" && "bg-blue-100 text-blue-700",
                  result.status === "Pending" && "bg-amber-100 text-amber-700"
                )}
              >
                {result.status}
              </span>
            </div>

            <div className="p-6 md:p-8">
              <ol className="grid grid-cols-3 gap-2 mb-8">
                {STEPS.map((s, i) => {
                  const done = i <= current;
                  const Icon = i === 2 && result.status === "Rejected" ? XCircle : s.icon;
                  return (
                    <li key={s.key} className="flex flex-col items-center text-center gap-2">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          done
                            ? i === 2 && result.status === "Rejected"
                              ? "bg-red-500 text-white"
                              : "bg-secondary text-primary"
                            : "bg-surface text-gray-300"
                        )}
                      >
                        <Icon size={22} />
                      </div>
                      <span className={cn("text-xs font-bold", done ? "text-primary" : "text-gray-300")}>
                        {i === 2 && current === 2 ? result.status : s.label}
                      </span>
                    </li>
                  );
                })}
              </ol>

              {result.status === "Accepted" && (
                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex gap-4">
                    <CheckCircle2 className="text-emerald-600 shrink-0" size={28} />
                    <div>
                      <h3 className="font-black text-emerald-800 text-lg">Congratulations, you have been admitted!</h3>
                      <p className="text-sm text-emerald-700">
                        Welcome to NextGen University of Egypt. You are now enrolled in <b>{result.program}</b>.
                      </p>
                    </div>
                  </div>
                  {result.studentId && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-primary text-white">
                        <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Your Student ID</p>
                        <p className="text-2xl font-black text-secondary tracking-wider">{result.studentId}</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-surface flex gap-3">
                        <KeyRound className="text-primary shrink-0" size={20} />
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {result.ownPassword ? (
                            <>
                              Sign in with your <b>Student ID</b> and the <b>password you created when you applied</b>.
                              Forgot it? Use <b>Forgot Password</b> on the login page.
                            </>
                          ) : (
                            <>
                              Sign in with your Student ID and the temporary password given to you by the admissions
                              office, then change it from <b>Settings</b>.
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  <Link
                    href="/login/student"
                    className="w-full flex items-center justify-center gap-2 bg-secondary text-primary py-4 rounded-xl font-black uppercase tracking-wider hover:shadow-lg transition-all"
                  >
                    <LogIn size={18} /> Go to Student Login <ArrowRight size={18} />
                  </Link>
                </div>
              )}

              {result.status === "Rejected" && (
                <div className="p-5 rounded-2xl bg-red-50 border border-red-100 flex gap-4">
                  <XCircle className="text-red-600 shrink-0" size={28} />
                  <div>
                    <h3 className="font-black text-red-800">We are unable to offer you admission this time</h3>
                    <p className="text-sm text-red-700">
                      Thank you for your interest in NextGen University. You are welcome to apply again next intake.
                    </p>
                  </div>
                </div>
              )}

              {(result.status === "Pending" || result.status === "Under Review") && (
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 flex gap-4">
                  <Clock className="text-blue-600 shrink-0" size={28} />
                  <div>
                    <h3 className="font-black text-blue-800">
                      {result.status === "Pending" ? "Your application has been received" : "Your application is being reviewed"}
                    </h3>
                    <p className="text-sm text-blue-700">
                      Decisions are usually made within 2 weeks. Check back here any time with the same details.
                    </p>
                  </div>
                </div>
              )}

              {result.decisionNote && (
                <div className="mt-5 p-5 rounded-2xl bg-surface">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Message from the admissions office</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{result.decisionNote}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function AdmissionStatusPage() {
  return (
    <Suspense>
      <StatusChecker />
    </Suspense>
  );
}
