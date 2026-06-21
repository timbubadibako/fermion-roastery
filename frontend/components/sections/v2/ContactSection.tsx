"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send, Loader2, Mail, MessageSquare } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Sticker } from "@/components/ui/sticker";

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const t = useI18n();
  const content = t.landing.contact;
  const [formData, setFormData] = useState({ full_name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    let ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      gsap.from(formRef.current, {
        y: 100,
        rotation: 5,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

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
    <section 
      ref={sectionRef}
      // Light side of the zig-zag
      className="py-32 px-6 bg-[#FDFBF7] text-stone-900 font-sans relative z-50 -mt-20 overflow-hidden"
    >
      {/* Background Flourish (Ink stains/Watercolor) */}
      <div className="absolute top-0 -right-20 w-[600px] h-[600px] bg-amber-100 rounded-full blur-[120px] -z-0 opacity-60 mix-blend-multiply" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] -z-0 opacity-50 mix-blend-multiply" />

      {/* Decorative Texture/Noise over the background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-20 items-center">
          {/* Left Column: Heading & Contact Info */}
          <div ref={textRef} className="lg:col-span-2 space-y-12">
            <div className="space-y-8 relative">
              <div className="absolute -top-10 -left-6 w-24 h-24 bg-rose-200/50 rounded-full blur-xl -z-10"></div>
              
              <div className="inline-block px-4 py-1 border border-black/10 bg-white shadow-[4px_4px_0px_rgba(0,0,0,0.03)] rotate-[-3deg] text-[9px] font-black uppercase tracking-[0.3em]">
                Direct Access
              </div>
              
              <h2 className="text-6xl md:text-8xl font-cloude tracking-tighter text-black leading-[0.8] relative">
                Get in<br />
                <span className="font-display italic text-[#367F4D]">touch.</span>
              </h2>
              
              {/* Squiggly line separator */}
              <svg className="w-32 opacity-20" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5" stroke="currentColor" fill="transparent" strokeWidth="3" strokeLinecap="round" />
              </svg>
              
              <p className="text-stone-700 max-w-xl text-lg font-medium leading-relaxed bg-white/40 p-4 border-l-2 border-black/20 backdrop-blur-sm shadow-sm">
                Let's discuss precision roasting, wholesale partnerships, or technical inquiries. Our team is ready to engineer your perfect brew.
              </p>
            </div>

            {/* Quick Contact Info Buttons */}
            <div className="flex gap-6 relative">
                <Sticker rotate={-5} className="relative !absolute-none scale-100 border border-black/10 shadow-[4px_4px_0px_rgba(0,0,0,0.03)]" color="#fef3c7" variant="solid">
                    <a href="mailto:roastery@fermion.co" className="flex items-center gap-2 font-sans font-bold">
                        <Mail size={16} /> LAB NOTES
                    </a>
                </Sticker>
                <Sticker rotate={3} className="relative !absolute-none scale-100 border border-black/10 shadow-[4px_4px_0px_rgba(0,0,0,0.03)]" color="#367F4D" variant="solid">
                    <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans font-bold text-white">
                        <MessageSquare size={16} /> 24/7 SUPPORT
                    </a>
                </Sticker>
            </div>
          </div>

          {/* Right Column: Roastery-Notebook Style Form */}
          <div ref={formRef} className="lg:col-span-3 relative">
            {/* Background layered paper - Removed shadow, kept border for neat stack */}
            <div className="absolute top-3 left-3 w-full h-full bg-[#E2DACB] border border-black/5 rotate-1"></div>
            
            {/* Main Notebook Paper */}
            <form onSubmit={handleSubmit} className="p-10 md:p-14 bg-white border border-black/10 shadow-[10px_10px_0px_rgba(0,0,0,0.04)] relative z-10 -rotate-1 hover:rotate-0 hover:-translate-y-1 hover:shadow-[14px_14px_0px_rgba(0,0,0,0.06)] transition-all duration-500 cursor-default group/form">
               {/* Masking tape */}
               <div className="absolute top-[-15px] left-[50%] -translate-x-1/2 w-32 h-8 bg-white/70 backdrop-blur-md border border-black/5 rotate-[-2deg] shadow-sm z-20 mix-blend-luminosity opacity-80"></div>
               
               {/* Grid Paper Pattern */}
              <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #6486F4 1px, transparent 1px), linear-gradient(to bottom, #6486F4 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              
              <div className="space-y-10 relative z-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2 relative">
                    <label className="text-[12px] font-black tracking-widest uppercase text-black bg-white px-2 absolute -top-3 left-2 z-10 border border-black/10 rotate-[-2deg]">{content.name}</label>
                    <input 
                      type="text" required
                      placeholder="John Doe"
                      value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})}
                      className="w-full bg-transparent border-b border-black/40 py-4 outline-none text-xl font-display italic text-black placeholder:text-stone-300 focus:border-fermion-french-blue transition-colors relative z-0"
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-[12px] font-black tracking-widest uppercase text-black bg-white px-2 absolute -top-3 left-2 z-10 border border-black/10 rotate-[2deg]">{content.email}</label>
                    <input 
                      type="email" required
                      placeholder="john@example.com"
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-transparent border-b border-black/40 py-4 outline-none text-xl font-display italic text-black placeholder:text-stone-300 focus:border-fermion-french-blue transition-colors relative z-0"
                    />
                  </div>
                </div>

                <div className="space-y-2 relative pt-6">
                    <label className="text-[12px] font-black tracking-widest uppercase text-black bg-white px-2 absolute top-2 left-2 z-10 border border-black/10 rotate-[-1deg]">{content.message}</label>
                    <textarea 
                      required rows={5}
                      placeholder="Tell us about your roasting needs..."
                      value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-transparent border border-black/40 p-4 pt-8 outline-none text-xl font-display italic text-black resize-none placeholder:text-stone-300 focus:border-fermion-french-blue transition-colors shadow-[inset_4px_4px_0px_rgba(0,0,0,0.02)]"
                    />
                </div>
                
                <button 
                  type="submit" disabled={status === 'loading'}
                  className="group flex items-center gap-4 px-10 py-5 bg-[#367F4D] text-white transition-all uppercase text-sm font-black tracking-[0.2em] w-full justify-center border border-black/5 shadow-[6px_6px_0px_rgba(0,0,0,0.05)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.03)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
                >
                  {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : content.submit}
                  {!status || status === 'loading' ? null : <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
