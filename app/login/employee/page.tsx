"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  User, 
  ArrowRight, 
  Building2, 
  Mail, 
  AlertCircle,
  ChevronLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  Database,
  Network
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function EmployeeLoginPage() {
  const router = useRouter();
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
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
          emailOrId: isAdminLogin ? adminEmail : employeeId,
          password: password,
          role: isAdminLogin ? "Admin" : "Employee",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push(data.redirect);
    } catch (err: any) {
      setError(err.message || "Invalid Credentials");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/research-hero.png"
          alt="Employee Portal Background"
          fill
          className="object-cover opacity-30 scale-110 grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/60 to-primary/95" />
        <div className="absolute inset-0 backdrop-blur-[4px]" />
      </div>

      {/* Security Scanning Effect (Subtle) */}
      <motion.div 
         initial={{ top: "-10%" }}
         animate={{ top: "110%" }}
         transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
         className="absolute left-0 right-0 h-1 bg-secondary/5 blur-sm z-[1] pointer-events-none"
      />

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
              <h1 className="text-3xl font-black tracking-tight text-white uppercase">Staff <span className="text-secondary font-serif normal-case">Console</span></h1>
              <span className="text-xs font-bold text-white/50 tracking-[0.3em] uppercase">Security Level: Enterprise</span>
            </div>
          </Link>

          <div className="space-y-6">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-secondary font-black text-[10px] uppercase tracking-widest shadow-2xl">
                <ShieldCheck size={14} /> End-to-End Encrypted Session
             </div>
            <h2 className="text-6xl font-black leading-tight uppercase tracking-tighter">
              Institutional <br/>
              <span className="text-secondary font-serif normal-case">Management</span>
            </h2>
            <p className="text-lg text-white/60 max-w-md font-medium leading-relaxed">
              Standardized access for faculty and administrative staff. Manage research portfolios, payroll, and departmental logistics.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6">
            {[
              { icon: Database, title: "Data Integrity", desc: "Centralized record management" },
              { icon: Network, title: "MFA Active", desc: "Multi-layered authentication" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-3 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                <item.icon className="text-secondary group-hover:scale-110 transition-transform" size={24} />
                <div>
                  <h4 className="font-bold text-sm tracking-tight">{item.title}</h4>
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-secondary transition-colors text-sm font-bold uppercase tracking-widest pt-4 group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Return to Homepage
          </Link>
        </motion.div>

        {/* Right Side: Login Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full flex justify-center"
        >
          <div className="w-full max-w-[480px] bg-white text-primary rounded-[3rem] p-10 lg:p-14 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="lg:hidden flex flex-col items-center mb-10 text-center">
                 <Image src="/logo.png" alt="Logo" width={60} height={60} className="mb-4" />
                 <h1 className="text-2xl font-black text-primary uppercase tracking-tighter">Staff <span className="text-secondary font-serif">Console</span></h1>
              </div>

              <div className="mb-10 text-center lg:text-left flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-primary uppercase tracking-tight mb-2">
                    {isAdminLogin ? "Admin" : "Employee"} <span className="text-secondary">Login</span>
                  </h3>
                  <p className="text-primary/40 text-sm font-medium">Authorised Personnel Only</p>
                </div>
                {isAdminLogin && (
                  <button 
                    onClick={() => setIsAdminLogin(false)}
                    className="text-[10px] font-black text-primary/30 uppercase tracking-widest hover:text-secondary transition-colors"
                  >
                    Back to Employee
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-red-500/5 border border-red-500/10 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold"
                    >
                      <AlertCircle size={18} />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      {isAdminLogin ? <Mail className="text-primary/20" size={20} /> : <User className="text-primary/20" size={20} />}
                    </div>
                    <input
                      type={isAdminLogin ? "email" : "text"}
                      className="w-full bg-surface border border-transparent text-primary pl-14 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:bg-white focus:border-secondary/30 transition-all font-bold placeholder:text-primary/20 text-lg"
                      placeholder={isAdminLogin ? "Admin Email" : "Employee ID"}
                      value={isAdminLogin ? adminEmail : employeeId}
                      onChange={(e) => isAdminLogin ? setAdminEmail(e.target.value) : setEmployeeId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <Lock className="text-primary/20" size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-surface border border-transparent text-primary pl-14 pr-14 py-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:bg-white focus:border-secondary/30 transition-all font-bold placeholder:text-primary/20 text-lg"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-6 flex items-center text-primary/20 hover:text-secondary transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                       <input type="checkbox" className="peer sr-only" />
                       <div className="w-5 h-5 border-2 border-gray-100 rounded-md peer-checked:bg-secondary peer-checked:border-secondary transition-all" />
                       <ShieldCheck className="absolute text-primary opacity-0 peer-checked:opacity-100 transition-opacity" size={14} />
                    </div>
                    <span className="text-[10px] font-black text-primary/30 uppercase tracking-widest group-hover:text-primary/60 transition-colors">Private Workstation</span>
                  </label>
                  <Link href="/forgot-password" className="text-[10px] font-black text-secondary uppercase tracking-widest hover:text-primary transition-colors">
                    Reset Security
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full bg-primary text-secondary py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all relative overflow-hidden group/btn",
                    isLoading ? "opacity-90 cursor-wait" : "hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  <span className={cn("inline-flex items-center gap-2 transition-all", isLoading ? "opacity-0" : "opacity-100")}>
                    Secure Login <ArrowRight size={18} />
                  </span>
                  
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
                    </div>
                  )}
                </button>
              </form>

              <div className="mt-12 text-center">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-gray-100" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/10">Staff Channels</span>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>
                
                <div className="flex flex-col gap-3">
                  <button onClick={() => actions.external("https://outlook.office.com")} className="w-full flex items-center justify-between bg-surface border border-transparent text-primary rounded-2xl p-5 hover:border-secondary transition-all group px-8 cursor-pointer">
                     <div className="flex items-center gap-4">
                        <Building2 size={20} className="text-secondary" />
                        <span className="font-bold text-xs uppercase tracking-widest">Faculty Webmail</span>
                     </div>
                     <ArrowRight size={16} className="text-primary/20 group-hover:translate-x-1 transition-all" />
                  </button>
                  <button 
                    onClick={() => {
                      setIsAdminLogin(true);
                      setError("");
                    }}
                    className={cn(
                      "w-full flex items-center justify-between bg-surface border border-transparent text-primary rounded-2xl p-5 hover:border-secondary transition-all group px-8 cursor-pointer",
                      isAdminLogin && "border-secondary bg-white ring-2 ring-secondary/10"
                    )}
                  >
                     <div className="flex items-center gap-4">
                        <Mail size={20} className={cn("transition-colors", isAdminLogin ? "text-primary" : "text-secondary")} />
                        <span className="font-bold text-xs uppercase tracking-widest">Admin Dashboard</span>
                     </div>
                     <ArrowRight size={16} className="text-primary/20 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>

                <p className="mt-10 text-[10px] font-black text-primary/20 uppercase tracking-[0.2em]">
                  Security Protocol Exception? <Link href="/feedback" className="text-secondary hover:text-primary transition-colors underline underline-offset-4">Contact IT Core</Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

