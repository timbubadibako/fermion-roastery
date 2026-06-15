"use client";

import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, Loader2, Mail, MessageSquare, User } from "lucide-react";
import { strings } from "@/lib/strings";
import { Sticker } from "@/components/ui/sticker";

export function ContactSection() {
  const lang = 'id';
  const content = strings[lang].contact;
  const [formData, setFormData] = useState({ full_name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await axios.post("/api/content/contact", formData);
      setStatus("success");
      setFormData({ full_name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-32 px-6 bg-stone-50 text-stone-900 font-sans relative overflow-hidden">
      {/* Background Flourish */}
      <div className="absolute top-0 -right-20 w-[600px] h-[600px] bg-emerald-100 rounded-full blur-[120px] -z-0 opacity-40" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-rose-100 rounded-full blur-[100px] -z-0 opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-20">
          {/* Left Column: Heading & Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-12"
          >
            <div className="space-y-8">
              <div className="inline-block px-4 py-1 border border-stone-300 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">
                Direct Access
              </div>
              <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase italic text-stone-950 leading-[0.85]">
                Get in<br />touch.
              </h2>
              <div className="w-24 h-1.5 bg-stone-900"></div>
              <p className="text-stone-600 max-w-xl text-xl font-medium leading-relaxed">
                Let's discuss precision roasting, wholesale partnerships, or technical inquiries. Our team is ready to engineer your perfect brew.
              </p>
            </div>

            {/* Quick Contact Info Buttons */}
            <div className="flex gap-6">
                <Sticker rotate={-5} className="relative !absolute-none scale-100" color="#fef3c7" variant="dashed">
                    <a href="mailto:lab@fermion.co" className="flex items-center gap-2 font-sans">
                        <Mail size={14} /> LAB NOTES
                    </a>
                </Sticker>
                <Sticker rotate={3} className="relative !absolute-none scale-100" color="#bae6fd" variant="solid">
                    <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans">
                        <MessageSquare size={14} /> 24/7 SUPPORT
                    </a>
                </Sticker>
            </div>
          </motion.div>

          {/* Right Column: Lab-Notebook Style Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ 
              y: -8,
              rotate: 0.5,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-3 relative cursor-pointer"
          >
            {/* Stacked background paper */}
            <div className="absolute top-2 left-2 w-full h-full bg-stone-200 border border-amber-900 -rotate-1 rounded-sm"></div>
            
            <form onSubmit={handleSubmit} className="p-12 bg-[#fdfaf6] border border-amber-900 shadow-sm relative z-10 rounded-sm">
               {/* Subtle Graph Paper Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #d6d3d1 1px, transparent 1px), linear-gradient(to bottom, #d6d3d1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              
              <div className="space-y-12 relative z-10">
                <div className="grid md:grid-cols-2 gap-0 border-b border-amber-900 border-dashed">
                  <div className="p-6 border-r-0 md:border-r border-amber-900 border-dashed space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-stone-500">Full Name</label>
                    <input 
                      type="text" required
                      placeholder="John Doe"
                      value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})}
                      className="w-full bg-transparent py-2 outline-none text-lg font-serif italic text-stone-900 placeholder:text-stone-300"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-stone-500">Email Address</label>
                    <input 
                      type="email" required
                      placeholder="john@example.com"
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-transparent py-2 outline-none text-lg font-serif italic text-stone-900 placeholder:text-stone-300"
                    />
                  </div>
                </div>

                <div className="p-6 space-y-2 border-b border-amber-900 border-dashed">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-stone-500">Message</label>
                    <textarea 
                      required rows={4}
                      placeholder="Tell us about your roasting needs..."
                      value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-transparent py-2 outline-none text-lg font-serif italic text-stone-900 resize-none placeholder:text-stone-300"
                    />
                </div>
                
                <motion.button 
                  type="submit" disabled={status === 'loading'}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-4 px-10 py-5 bg-amber-900 text-white transition-all uppercase text-xs font-black tracking-[0.2em] w-full justify-center rounded-sm border border-amber-950 shadow-[4px_4px_0px_0px_rgba(60,30,0,1)]"
                >
                  {status === 'loading' ? <Loader2 className="animate-spin" size={16} /> : "Send Message"}
                  {!status || status === 'loading' ? null : <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
