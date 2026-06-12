"use client";

import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";
import { strings } from "@/lib/strings";

export function ContactSection() {
  const lang = 'id';
  const content = strings[lang].contact;
  const [formData, setFormData] = useState({ full_name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await axios.post("http://localhost:3001/api/content/contact", formData);
      setStatus("success");
      setFormData({ full_name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="py-32 px-6 bg-white relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Side: Brand Narrative */}
          <div className="space-y-12">
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-fermion-sea-green)]/10 text-[var(--color-fermion-sea-green)] rounded-full border border-[var(--color-fermion-sea-green)]/20"
              >
                <div className="w-1 h-1 bg-current rounded-full animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest">Connect with our Lab</span>
              </motion.div>
              
              <h2 className="text-6xl md:text-7xl font-display font-black text-[var(--color-fermion-black)] leading-[0.85] italic tracking-tighter">
                {content.title} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-fermion-sea-green)] to-[var(--color-fermion-french-blue)] font-sans not-italic">Engineers.</span>
              </h2>
              
              <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-md">
                Have questions about our roasting profiles or wholesale partnerships? Our technical team is ready to assist.
              </p>
            </div>

            {/* Quick Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-[var(--color-fermion-horizon)]/30 transition-colors duration-500">
                <Mail className="text-[var(--color-fermion-french-blue)] mb-4" size={24} strokeWidth={1.5} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">General Inquiry</p>
                <p className="text-sm font-bold text-slate-900">lab@fermion.co</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-[var(--color-fermion-sea-green)]/30 transition-colors duration-500">
                <MessageSquare className="text-[var(--color-fermion-sea-green)] mb-4" size={24} strokeWidth={1.5} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">WhatsApp Support</p>
                <p className="text-sm font-bold text-slate-900">+62 812 3456 789</p>
              </div>
            </div>
          </div>

          {/* Right Side: Modern Minimalist Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
          >
            {/* Form Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-fermion-gold)]/10 to-transparent rounded-bl-full pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
              <div className="group space-y-4">
                <div className="flex items-center gap-3 text-slate-400 group-focus-within:text-[var(--color-fermion-french-blue)] transition-colors">
                  <User size={16} />
                  <label className="text-[10px] font-black uppercase tracking-widest">{content.name}</label>
                </div>
                <input 
                  type="text" required
                  placeholder="Enter your full name..."
                  value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})}
                  className="w-full bg-transparent border-b border-slate-200 py-2 focus:border-[var(--color-fermion-french-blue)] outline-none transition-all duration-500 placeholder:text-slate-200 text-slate-900 font-bold"
                />
              </div>

              <div className="group space-y-4">
                <div className="flex items-center gap-3 text-slate-400 group-focus-within:text-[var(--color-fermion-french-blue)] transition-colors">
                  <Mail size={16} />
                  <label className="text-[10px] font-black uppercase tracking-widest">{content.email}</label>
                </div>
                <input 
                  type="email" required
                  placeholder="name@company.com"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-transparent border-b border-slate-200 py-2 focus:border-[var(--color-fermion-french-blue)] outline-none transition-all duration-500 placeholder:text-slate-200 text-slate-900 font-bold"
                />
              </div>

              <div className="group space-y-4">
                <div className="flex items-center gap-3 text-slate-400 group-focus-within:text-[var(--color-fermion-french-blue)] transition-colors">
                  <MessageSquare size={16} />
                  <label className="text-[10px] font-black uppercase tracking-widest">{content.message}</label>
                </div>
                <textarea 
                  required rows={3}
                  placeholder="Tell us about your project..."
                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-transparent border-b border-slate-200 py-2 focus:border-[var(--color-fermion-french-blue)] outline-none transition-all duration-500 resize-none placeholder:text-slate-200 text-slate-900 font-bold"
                />
              </div>
              
              <div className="pt-6">
                {status === 'success' ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full bg-green-500 text-white font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs shadow-xl"
                  >
                    <CheckCircle2 size={20} /> Sent Successfully
                  </motion.div>
                ) : (
                  <button 
                    type="submit" disabled={status === 'loading'}
                    className="w-full bg-[var(--color-fermion-black)] text-white font-black py-6 rounded-[2rem] hover:bg-[var(--color-fermion-french-blue)] hover:shadow-2xl hover:shadow-[var(--color-fermion-french-blue)]/30 transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs group active:scale-95"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        {content.submit}
                        <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                )}
                
                {status === 'error' && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center mt-4">{errorMessage}</p>
                )}
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
