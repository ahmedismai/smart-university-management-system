"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Upload, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft,
  School,
  FileText,
  CreditCard,
  Lock,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Personal Info", icon: User },
  { id: 2, name: "Academic History", icon: GraduationCap },
  { id: 3, name: "Program Selection", icon: School },
  { id: 4, name: "Documents", icon: Upload },
];

type Program = { code: string; name: string };

const DOCUMENTS = [
  { kind: "photo", label: "Personal Photo", info: "JPG, PNG (max 2MB)", accept: "image/jpeg,image/png,image/webp" },
  { kind: "nationalId", label: "National ID (both sides)", info: "JPG, PNG, PDF (max 2MB)", accept: "image/jpeg,image/png,image/webp,application/pdf" },
  { kind: "secondaryCertificate", label: "Thanaweya Amma Certificate", info: "JPG, PNG, PDF (max 2MB)", accept: "image/jpeg,image/png,image/webp,application/pdf" },
  { kind: "birthCertificate", label: "Birth Certificate", info: "JPG, PNG, PDF (max 2MB)", accept: "image/jpeg,image/png,image/webp,application/pdf" },
] as const;
const MAX_FILE = 2 * 1024 * 1024;

export default function AdmissionApplyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [programs, setPrograms] = useState<Program[] | null>(null);
  const [files, setFiles] = useState<Record<string, File>>({});
  const [fileError, setFileError] = useState("");
  const [uploadIssues, setUploadIssues] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admission/programs")
      .then((r) => r.json())
      .then((j) => setPrograms(j.programs || []))
      .catch(() => setPrograms([]));
  }, []);

  const pickFile = (kind: string, file?: File) => {
    setFileError("");
    if (!file) return;
    if (file.size > MAX_FILE) {
      setFileError(`${file.name} is larger than 2MB`);
      return;
    }
    setFiles((f) => ({ ...f, [kind]: file }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleFieldChange = (e: React.ChangeEvent<HTMLElement>) => {
    const t = e.target as HTMLInputElement;
    if (t.name) setForm((f) => ({ ...f, [t.name]: t.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if ((form.password || "").length < 8) {
      setSubmitError("Please create a password of at least 8 characters (step 1)");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setSubmitError("The two passwords do not match (step 1)");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admission/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, confirmPassword: undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed");

      // Upload the chosen documents one by one (keeps each request small).
      const issues: string[] = [];
      for (const doc of DOCUMENTS) {
        const file = files[doc.kind];
        if (!file) continue;
        const fd = new FormData();
        fd.append("applicationId", json.applicationId);
        fd.append("token", json.uploadToken);
        fd.append("kind", doc.kind);
        fd.append("file", file);
        const up = await fetch("/api/admission/documents", { method: "POST", body: fd }).catch(() => null);
        if (!up || !up.ok) issues.push(doc.label);
      }
      setUploadIssues(issues);
      setApplicationId(json.applicationId);
      setIsSubmitted(true);
      window.scrollTo({ top: 0 });
    } catch (err: any) {
      setSubmitError(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-secondary w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-primary mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-8">
            Your application for admission has been successfully received. Our admissions team will review your details and contact you soon via email.
          </p>
          {applicationId && (
            <div className="mb-6 p-4 rounded-2xl bg-surface">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Your Application ID</p>
              <p className="text-2xl font-black text-primary tracking-wider">{applicationId}</p>
              <p className="text-xs text-gray-500 mt-1">Save it: you need it with your email to check your admission result.</p>
            </div>
          )}
          {uploadIssues.length > 0 && (
            <p className="mb-6 text-xs font-bold text-amber-700 bg-amber-50 rounded-xl p-3">
              Some documents could not be uploaded ({uploadIssues.join(", ")}). Please bring them to the admissions office.
            </p>
          )}
          <Link
            href={`/admission/status?id=${encodeURIComponent(applicationId)}`}
            className="block w-full bg-secondary text-primary py-4 rounded-xl font-bold hover:shadow-lg transition-all mb-3"
          >
            Check Application Status
          </Link>
          <Link
            href="/"
            className="block w-full bg-primary text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            Return to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-bold uppercase tracking-wider">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              Admissions Open 2026-27
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-primary leading-tight">
              Start Your Journey with <span className="text-secondary">NextGen</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Apply today to join our vibrant community of scholars, innovators, and leaders. Experience world-class education with cutting-edge facilities.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-[300px] lg:h-[400px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image 
              src="/admission-hero.png" 
              alt="University Campus" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm font-medium opacity-80 uppercase tracking-widest mb-1">Our Campus</p>
              <h3 className="text-2xl font-bold">Innovation Center</h3>
            </div>
          </motion.div>
        </div>

        {/* Main Application Container */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row min-h-[700px]">
          
          {/* Sidebar - Progress Steps */}
          <div className="w-full lg:w-80 bg-primary p-8 lg:p-12 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
                <FileText className="text-secondary" />
                Apply Now
              </h2>
              
              <div className="space-y-8 relative">
                {/* Connection Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10 hidden lg:block" />
                
                {steps.map((step) => (
                  <div 
                    key={step.id} 
                    onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                    className={cn(
                      "relative flex items-center gap-4 group transition-all",
                      step.id < currentStep ? "cursor-pointer" : ""
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10",
                      currentStep === step.id 
                        ? "bg-secondary text-primary shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                        : currentStep > step.id 
                          ? "bg-green-500 text-white" 
                          : "bg-white/10 text-white/40"
                    )}>
                      {currentStep > step.id ? <CheckCircle2 size={24} /> : <step.icon size={24} />}
                    </div>
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-[10px] uppercase tracking-[0.2em] font-bold",
                        currentStep === step.id ? "text-secondary" : "text-white/40"
                      )}>
                        Step {step.id}
                      </span>
                      <span className={cn(
                        "font-bold transition-colors",
                        currentStep === step.id ? "text-white" : "text-white/60"
                      )}>
                        {step.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block mt-20 p-6 bg-white/5 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all group/help">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full border-2 border-secondary overflow-hidden relative group-hover/help:scale-110 transition-transform">
                   <Image src="/admission-student.png" alt="Support" fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase font-bold tracking-tighter">Need Help?</p>
                  <p className="text-sm font-bold group-hover/help:text-secondary transition-colors">Admission Office</p>
                </div>
              </div>
              <p className="text-xs text-white/60 leading-relaxed group-hover/help:text-white transition-colors">
                Contact us at <span className="text-secondary">admissions@nextgen.edu.eg</span> for any queries.
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-8 lg:p-12 bg-white relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                <div className="flex-1" onChange={handleFieldChange}>
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Personal Information</h3>
                        <p className="text-gray-500">Please provide your basic contact and identity details.</p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-primary/70 ml-1">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                              type="text" 
                              name="fullName" defaultValue={form.fullName ?? ""} placeholder="John Doe"
                              className="w-full pl-12 pr-4 py-4 bg-surface rounded-xl border-2 border-transparent focus:border-secondary focus:bg-white transition-all outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-primary/70 ml-1">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                              type="email" 
                              name="email" defaultValue={form.email ?? ""} placeholder="john@example.com"
                              className="w-full pl-12 pr-4 py-4 bg-surface rounded-xl border-2 border-transparent focus:border-secondary focus:bg-white transition-all outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-primary/70 ml-1">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                              type="tel" 
                              name="phone" defaultValue={form.phone ?? ""} placeholder="+20 1X XXXX XXXX"
                              className="w-full pl-12 pr-4 py-4 bg-surface rounded-xl border-2 border-transparent focus:border-secondary focus:bg-white transition-all outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-primary/70 ml-1">Date of Birth</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                              type="date" 
                              name="dob" defaultValue={form.dob ?? ""}
                              className="w-full pl-12 pr-4 py-4 bg-surface rounded-xl border-2 border-transparent focus:border-secondary focus:bg-white transition-all outline-none"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-bold text-primary/70 ml-1">National ID Number</label>
                          <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={14}
                              name="nationalId" defaultValue={form.nationalId ?? ""} placeholder="14-digit national ID"
                              className="w-full pl-12 pr-4 py-4 bg-surface rounded-xl border-2 border-transparent focus:border-secondary focus:bg-white transition-all outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-primary/70 ml-1">Create Password</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                              type="password"
                              autoComplete="new-password"
                              name="password" defaultValue={form.password ?? ""} placeholder="At least 8 characters"
                              className="w-full pl-12 pr-4 py-4 bg-surface rounded-xl border-2 border-transparent focus:border-secondary focus:bg-white transition-all outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-primary/70 ml-1">Confirm Password</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                              type="password"
                              autoComplete="new-password"
                              name="confirmPassword" defaultValue={form.confirmPassword ?? ""} placeholder="Repeat the password"
                              className="w-full pl-12 pr-4 py-4 bg-surface rounded-xl border-2 border-transparent focus:border-secondary focus:bg-white transition-all outline-none"
                            />
                          </div>
                        </div>
                        <p className="md:col-span-2 -mt-3 text-xs text-gray-400 ml-1">
                          If you are accepted, you will sign in to the student portal with your Student ID and this password.
                        </p>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-bold text-primary/70 ml-1">Address</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                            <textarea 
                              rows={3}
                              name="address" defaultValue={form.address ?? ""} placeholder="Street, District, City, Governorate"
                              className="w-full pl-12 pr-4 py-4 bg-surface rounded-xl border-2 border-transparent focus:border-secondary focus:bg-white transition-all outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Academic History</h3>
                        <p className="text-gray-500">Your previous educational background and achievements.</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="p-6 bg-surface rounded-2xl border-2 border-transparent hover:border-secondary/20 transition-all group">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                              <School size={20} />
                            </div>
                            <h4 className="font-bold text-primary">Preparatory Certificate (Al-Shahada Al-I&apos;dadiya)</h4>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <input name="sscInstitution" defaultValue={form.sscInstitution ?? ""} placeholder="School Name" className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-100 outline-none focus:border-secondary" />
                            <div className="grid grid-cols-2 gap-4">
                               <input name="sscYear" defaultValue={form.sscYear ?? ""} placeholder="Passing Year" className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-100 outline-none focus:border-secondary" />
                               <input name="sscGpa" defaultValue={form.sscGpa ?? ""} placeholder="Total / Percentage" className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-100 outline-none focus:border-secondary" />
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-surface rounded-2xl border-2 border-transparent hover:border-secondary/20 transition-all group">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                              <BookOpen size={20} />
                            </div>
                            <h4 className="font-bold text-primary">Secondary Certificate (Thanaweya Amma / IGCSE / American Diploma)</h4>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <input name="hscInstitution" defaultValue={form.hscInstitution ?? ""} placeholder="School Name" className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-100 outline-none focus:border-secondary" />
                            <div className="grid grid-cols-2 gap-4">
                               <input name="hscYear" defaultValue={form.hscYear ?? ""} placeholder="Passing Year" className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-100 outline-none focus:border-secondary" />
                               <input name="hscGpa" defaultValue={form.hscGpa ?? ""} placeholder="Total / Percentage" className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-100 outline-none focus:border-secondary" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Program Selection</h3>
                        <p className="text-gray-500">Choose the program you want to join.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-primary/70 ml-1">Desired Program</label>
                        {programs === null && <p className="text-sm text-gray-400">Loading programs...</p>}
                        {programs?.length === 0 && (
                          <p className="text-sm text-red-600">Programs could not be loaded. Please refresh the page.</p>
                        )}
                        <div className="grid sm:grid-cols-2 gap-4">
                          {programs?.map((p) => (
                            <label key={p.code} className="relative cursor-pointer group">
                              <input type="radio" name="programCode" value={p.code} defaultChecked={form.programCode === p.code} className="peer sr-only" />
                              <div className="p-4 bg-surface rounded-xl border-2 border-transparent peer-checked:border-secondary peer-checked:bg-secondary/5 group-hover:bg-secondary/5 transition-all">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-secondary">{p.code}</span>
                                <span className="font-semibold text-primary/80 group-hover:text-primary">{p.name}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Document Upload</h3>
                        <p className="text-gray-500">Upload scanned copies of your certificates and identity.</p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        {DOCUMENTS.map((doc) => {
                          const chosen = files[doc.kind];
                          return (
                            <label
                              key={doc.kind}
                              className={cn(
                                "relative p-6 border-2 border-dashed rounded-2xl transition-all text-center group cursor-pointer",
                                chosen ? "border-secondary bg-secondary/5" : "border-gray-200 hover:border-secondary/50 hover:bg-secondary/5"
                              )}
                            >
                              <input
                                type="file"
                                accept={doc.accept}
                                className="sr-only"
                                onChange={(e) => pickFile(doc.kind, e.target.files?.[0])}
                              />
                              {chosen ? (
                                <CheckCircle2 className="mx-auto text-secondary mb-3" size={32} />
                              ) : (
                                <Upload className="mx-auto text-gray-400 group-hover:text-secondary mb-3 transition-colors" size={32} />
                              )}
                              <h4 className="font-bold text-primary mb-1">{doc.label}</h4>
                              <p className="text-[10px] text-gray-400 uppercase font-bold truncate">{chosen ? chosen.name : doc.info}</p>
                              {chosen && (
                                <button
                                  type="button"
                                  aria-label={`Remove ${doc.label}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setFiles((f) => {
                                      const next = { ...f };
                                      delete next[doc.kind];
                                      return next;
                                    });
                                  }}
                                  className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:bg-white hover:text-red-500 cursor-pointer"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </label>
                          );
                        })}
                      </div>
                      {fileError && <p className="text-sm font-bold text-red-600">{fileError}</p>}
                      <p className="text-xs text-gray-400">Documents are optional now, but required before enrollment.</p>

                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                        <CheckCircle2 className="text-blue-500 shrink-0" size={20} />
                        <p className="text-xs text-blue-700 leading-relaxed">
                          By clicking submit, I certify that all information provided is true and accurate. I understand that any false information may result in the rejection of my application.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-12 flex justify-between items-center">
                  <button 
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                      currentStep === 1 ? "opacity-0 pointer-events-none" : "text-primary hover:bg-surface cursor-pointer"
                    )}
                  >
                    <ArrowLeft size={20} />
                    Back
                  </button>
                  
                  {submitError && <p className="text-sm font-bold text-red-600 mr-auto ml-4">{submitError}</p>}
                  {currentStep < steps.length ? (
                    <button 
                      onClick={nextStep}
                      className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer"
                    >
                      Continue
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button 
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="disabled:opacity-60 bg-secondary text-primary px-12 py-3 rounded-xl font-extrabold shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-wider cursor-pointer"
                    >
                      {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
