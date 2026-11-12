"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  Lock, 
  User, 
  ArrowRight, 
  Layout, 
  Mail, 
  AlertCircle,
  ChevronLeft,
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function StudentLoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrId: studentId,
          password: password,
          role: "Student",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push(data.redirect);
    } catch (err: any) {
      setError(err.message || "Invalid Student ID or Password.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/auth/student-bg.png"
          alt="Student Portal Background"
          fill
          className="object-cover opacity-40 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/50 to-primary/95" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* Floating Sparkles/Particles (Subtle Animation) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-secondary/10"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              scale: Math.random() * 1 + 0.5
            }}
            animate={{ 
              y: ["-10%", "110%"],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
            style={{ width: Math.random() * 100 + 50 + "px", height: Math.random() * 100 + 50 + "px" }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Branding & Info */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col space-y-10 text-white"
        >
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-16 h-16 relative bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-secondary group-hover:scale-110 transition-all duration-500">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white uppercase">NextGen <span className="text-secondary font-serif normal-case">Portal</span></h1>
              <span className="text-xs font-bold text-white/50 tracking-[0.3em] uppercase">University of Bangladesh</span>
            </div>
          </Link>

          <div className="space-y-6">
            <h2 className="text-6xl font-black leading-tight uppercase">
              Access Your <br/>
              <span className="text-secondary font-serif">Academic Hub</span>
            </h2>
            <p className="text-lg text-white/60 max-w-md font-medium leading-relaxed">
              Log in to manage your courses, check results, access library resources, and stay connected with the university campus life.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6">
            {[
              { icon: ShieldCheck, title: "Secure Access", desc: "End-to-end encrypted sessions" },
              { icon: GraduationCap, title: "Student Perks", desc: "Exclusive digital resources" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-3 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                <item.icon className="text-secondary" size={24} />
                <div>
                  <h4 className="font-bold text-sm tracking-tight">{item.title}</h4>
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-secondary transition-colors text-sm font-bold uppercase tracking-widest pt-4 group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Website
          </Link>
        </motion.div>

        {/* Right Side: Login Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full flex justify-center"
        >
          <div className="w-full max-w-[480px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-10 lg:p-14 shadow-2xl relative overflow-hidden group">
            {/* Glossy Reflection Effect */}
            <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-12 pointer-events-none group-hover:animate-shine" />
            
            <div className="relative z-10">
              <div className="lg:hidden flex flex-col items-center mb-10 text-center">
                 <Image src="/logo.png" alt="Logo" width={60} height={60} className="mb-4" />
                 <h1 className="text-2xl font-black text-white uppercase tracking-tighter">NextGen <span className="text-secondary">Portal</span></h1>
              </div>

              <div className="mb-10 text-center lg:text-left">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Student <span className="text-secondary">Login</span></h3>
                <p className="text-white/50 text-sm font-medium mb-6">Please enter your credentials to continue</p>
                
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/70 text-xs font-semibold leading-relaxed text-left">
                  <span className="text-secondary font-bold">Demo Credentials:</span><br/>
                  Student ID: <code className="text-white bg-white/15 px-1.5 py-0.5 rounded font-mono select-all">STU001</code> <span className="text-white/30 mx-1">|</span> Password: <code className="text-white bg-white/15 px-1.5 py-0.5 rounded font-mono select-all">student123</code>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 text-sm font-bold"
                    >
                      <AlertCircle size={18} />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <User className="text-white/30" size={20} />
                    </div>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 text-white pl-14 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-white/10 transition-all font-bold placeholder:text-white/20 text-lg"
                      placeholder="Student ID (e.g. 2026-123)"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <Lock className="text-white/30" size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-white/5 border border-white/10 text-white pl-14 pr-14 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-white/10 transition-all font-bold placeholder:text-white/20 text-lg"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-6 flex items-center text-white/30 hover:text-secondary transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                       <input type="checkbox" className="peer sr-only" />
                       <div className="w-5 h-5 border-2 border-white/20 rounded-md peer-checked:bg-secondary peer-checked:border-secondary transition-all" />
                       <ShieldCheck className="absolute text-primary opacity-0 peer-checked:opacity-100 transition-opacity" size={14} />
                    </div>
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors">Remember Me</span>
                  </label>
                  <Link href="/forgot-password" className="text-xs font-bold text-secondary uppercase tracking-widest hover:text-white transition-colors">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full bg-secondary text-primary py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all relative overflow-hidden group/btn",
                    isLoading ? "opacity-90 cursor-wait" : "hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  <span className={cn("inline-flex items-center gap-2 transition-all", isLoading ? "opacity-0" : "opacity-100")}>
                    Access Portal <ArrowRight size={18} />
                  </span>
                  
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                  )}
                </button>
              </form>

              <div className="mt-12 text-center">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Other Methods</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                
                <div className="flex justify-center gap-4">
                  <button onClick={() => actions.external("https://outlook.office.com")} className="flex-1 flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white rounded-2xl py-4 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest group">
                    <Layout size={20} className="group-hover:scale-110 transition-transform" />
                    Student Mail
                  </button>
                  <button onClick={() => actions.external("https://outlook.office.com")} className="flex-1 flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white rounded-2xl py-4 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest group">
                    <Mail size={20} className="group-hover:scale-110 transition-transform" />
                    Office 365
                  </button>
                </div>

                <p className="mt-10 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                  Need Help? <Link href="/feedback" className="text-white/60 hover:text-secondary underline underline-offset-4 transition-colors">Contact Support</Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
