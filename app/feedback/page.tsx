"use client";

import toast from "react-hot-toast";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  CheckCircle2, 
  Sparkles,
  AlertTriangle,
  HelpCircle,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const feedbackCategories = [
  { id: 'suggestion', name: 'Suggestion', icon: Sparkles, color: 'text-secondary' },
  { id: 'complaint', name: 'Complaint', icon: AlertTriangle, color: 'text-red-500' },
  { id: 'inquiry', name: 'Inquiry', icon: HelpCircle, color: 'text-blue-500' },
  { id: 'appreciation', name: 'Appreciation', icon: ThumbsUp, color: 'text-emerald-500' }
];

export default function FeedbackPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('suggestion');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          subject: `Feedback (${activeCategory}): ${formData.subject}`,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          meta: { category: activeCategory },
          pagePath: "/feedback",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not send your feedback");
      setIsSubmitted(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-primary">
      {/* Centered Minimal Header */}
      <section className="relative pt-32 pb-12 lg:pt-48 lg:pb-20 text-center overflow-hidden bg-white">
        {/* Background Image with refined overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/vision-mission-hero.png" 
            alt="Feedback Background"
            fill
            className="object-cover opacity-[0.07] grayscale"
            priority
            sizes="100vw"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-6 text-secondary font-bold text-xs uppercase tracking-widest"
          >
            Feedback Portal
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            We value your <span className="text-secondary font-serif">perspective</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary/50 font-medium max-w-xl mx-auto"
          >
            Your input helps us improve the institutional ecosystem for everyone.
          </motion.p>
        </div>
      </section>

      {/* Centered Elegant Form */}
      <section className="pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
             
             {/* Category Picker - Minimal Row */}
             <div className="flex flex-wrap justify-center gap-3 mb-12 mt-12">
                {feedbackCategories.map((cat) => (
                   <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                         "flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all duration-300",
                         activeCategory === cat.id 
                            ? "bg-primary border-primary text-white shadow-xl shadow-primary/10" 
                            : "bg-gray-50 border-transparent text-primary/40 hover:bg-gray-100"
                      )}
                   >
                      <cat.icon size={16} className={cn(activeCategory === cat.id ? "text-secondary" : cat.color)} />
                      <span className="text-xs font-bold uppercase tracking-widest">{cat.name}</span>
                   </button>
                ))}
             </div>

             <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 p-8 md:p-16 relative overflow-hidden">
                <AnimatePresence mode="wait">
                   {!isSubmitted ? (
                      <motion.form 
                         key="form"
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -20 }}
                         onSubmit={handleSubmit}
                         className="space-y-8"
                      >
                         <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest ml-4">Full Name</label>
                               <input 
                                  required
                                  type="text" 
                                  placeholder="John Doe"
                                  className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-secondary/30 transition-all font-medium text-primary placeholder:text-primary/20"
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest ml-4">Email Address</label>
                               <input 
                                  required
                                  type="email" 
                                  placeholder="john@example.com"
                                  className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-secondary/30 transition-all font-medium text-primary placeholder:text-primary/20"
                                  value={formData.email}
                                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest ml-4">Subject</label>
                            <input 
                               required
                               type="text" 
                               placeholder="What is this about?"
                               className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-secondary/30 transition-all font-medium text-primary placeholder:text-primary/20"
                               value={formData.subject}
                               onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            />
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest ml-4">Message</label>
                            <textarea 
                               required
                               rows={5}
                               placeholder="Your detailed feedback..."
                               className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-secondary/30 transition-all font-medium text-primary placeholder:text-primary/20 resize-none"
                               value={formData.message}
                               onChange={(e) => setFormData({...formData, message: e.target.value})}
                            />
                         </div>

                         <button 
                            type="submit" disabled={sending}
                            className="w-full py-5 bg-primary text-white rounded-xl font-bold text-sm tracking-widest hover:bg-secondary transition-all shadow-xl shadow-primary/5 flex items-center justify-center gap-3 active:scale-[0.98]"
                         >
                            Submit Feedback <Send size={18} />
                         </button>
                      </motion.form>
                   ) : (
                      <motion.div 
                         key="success"
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="text-center py-20 space-y-8"
                      >
                         <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 size={40} />
                         </div>
                         <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight">Thank you!</h2>
                            <p className="text-primary/50 font-medium">Your feedback has been received and will be reviewed by our team.</p>
                         </div>
                         <button 
                            onClick={() => setIsSubmitted(false)}
                            className="text-secondary font-bold text-sm hover:underline"
                         >
                            Send another message
                         </button>
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </section>

      {/* Support Info */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
         <div className="container mx-auto px-6 text-center">
            <p className="text-xs font-bold text-primary/30 uppercase tracking-[0.2em] mb-4">Urgent Issue?</p>
            <h4 className="text-xl font-bold tracking-tight mb-8">Contact our 24/7 Support Helpline</h4>
            <div className="flex flex-wrap justify-center gap-4">
               <button onClick={() => actions.inquiry("Support Desk", { type: "contact", title: "Support Desk", context: "Page: feedback" })} className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm hover:border-primary/20 transition-all">Support Desk</button>
               <button onClick={() => actions.inquiry("Report Safety Concern", { type: "contact", title: "Report Safety Concern", context: "Page: feedback" })} className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm hover:border-primary/20 transition-all">Report Safety Concern</button>
            </div>
         </div>
      </section>
    </main>
  );
}
