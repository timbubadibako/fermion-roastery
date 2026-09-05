"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle2, MessageSquare, Calculator, FileText } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION: WHOLESALE B2B CTA SECTION WITH REFINED MONOCHROME & FOREST GREEN CALCULATOR + GSAP REVEAL
 * Clean, high-craft dark editorial B2B partnership section.
 */
export function WholesaleCTASection() {
  const [volume, setVolume] = useState<number>(25);
  const [tier, setTier] = useState<string>("Silver Tier");
  const [discountPerKg, setDiscountPerKg] = useState<number>(15000);
  const [savings, setSavings] = useState<number>(375000);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let currentDiscount = 10000;
    let currentTier = "Bronze Tier";

    if (volume >= 50) {
      currentTier = "Gold Tier";
      currentDiscount = 20000;
    } else if (volume >= 15) {
      currentTier = "Silver Tier";
      currentDiscount = 15000;
    } else {
      currentTier = "Bronze Tier";
      currentDiscount = 10000;
    }

    setTier(currentTier);
    setDiscountPerKg(currentDiscount);
    setSavings(volume * currentDiscount);
  }, [volume]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".wholesale-reveal", {
        y: 45,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });

      gsap.from(".wholesale-calc-card", {
        y: 60,
        scale: 0.97,
        opacity: 0,
        duration: 1.0,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return { value: (val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1), unit: "JUTA" };
    }
    return { value: (val / 1000).toFixed(0), unit: "RIBU" };
  };

  const formattedSavings = formatCurrency(savings);

  return (
    <section id="wholesale" ref={sectionRef} className="py-24 px-6 bg-[#111827] text-white relative z-20 overflow-hidden border-b border-white/5">
      
      {/* Background Subtle Grid */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: B2B Value Proposition */}
          <div className="lg:col-span-6 space-y-8">
            
            <div className="space-y-4 wholesale-reveal">
              <span className="inline-block px-3 py-1 bg-white/10 border border-white/15 text-white text-[9px] font-black uppercase tracking-[0.35em] rounded-sm">
                KEMITRAAN &amp; GROSIR B2B
              </span>
              
              <h2 className="font-cloude text-4xl md:text-6xl text-white leading-[0.95] relative">
                Kemitraan Kopi Khusus <br />
                <span className="text-[#367F4D]">Kafe &amp; Bisnis.</span>
              </h2>

              <p className="text-xs md:text-sm text-stone-300 font-medium leading-relaxed max-w-xl pt-2">
                Pasokan biji kopi specialty sangrai segar langsung dari roastery dengan harga bertingkat, profil sangrai kustom, dan tanpa potongan fee marketplace.
              </p>
            </div>

            {/* 3 B2B Advantages - Clean Uniform Style */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 wholesale-reveal">
              
              <div className="bg-[#1E293B]/70 p-5 border border-white/10 rounded-sm space-y-2">
                <div className="flex items-center gap-2 text-[#367F4D]">
                  <CheckCircle2 size={15} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#367F4D]">HARGA LANGSUNG</span>
                </div>
                <h3 className="font-display font-black text-sm uppercase text-white tracking-tight">Hemat Hingga 30%</h3>
                <p className="text-[11px] text-stone-400 font-medium leading-normal">
                  Tiered pricing sesuai volume pemesanan bulanan kafe Anda.
                </p>
              </div>

              <div className="bg-[#1E293B]/70 p-5 border border-white/10 rounded-sm space-y-2">
                <div className="flex items-center gap-2 text-[#367F4D]">
                  <CheckCircle2 size={15} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#367F4D]">PROFIL KUSTOM</span>
                </div>
                <h3 className="font-display font-black text-sm uppercase text-white tracking-tight">House Blend Khas</h3>
                <p className="text-[11px] text-stone-400 font-medium leading-normal">
                  Konsultasi &amp; racikan khusus untuk karakter kafe Anda.
                </p>
              </div>

              <div className="bg-[#1E293B]/70 p-5 border border-white/10 rounded-sm space-y-2">
                <div className="flex items-center gap-2 text-[#367F4D]">
                  <CheckCircle2 size={15} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#367F4D]">DUKUNGAN TEKNIS</span>
                </div>
                <h3 className="font-display font-black text-sm uppercase text-white tracking-tight">Kalibrasi Barista</h3>
                <p className="text-[11px] text-stone-400 font-medium leading-normal">
                  Bimbingan kalibrasi mesin &amp; pelatihan penyeduhan terstandar.
                </p>
              </div>

            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4 wholesale-reveal">
              <Link href="/b2b/register">
                <button className="px-8 py-4 bg-[#367F4D] text-white rounded-full text-[10px] font-black tracking-[0.25em] uppercase hover:bg-[#2b643d] transition-all duration-300 active:scale-95 shadow-xl flex items-center gap-2">
                  <span>DAFTAR AKUN B2B</span>
                  <ArrowRight size={14} />
                </button>
              </Link>

              <a 
                href="https://wa.me/628123456789" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <button className="px-7 py-4 bg-white/5 border border-white/15 rounded-full text-[10px] font-black tracking-[0.25em] uppercase text-stone-300 backdrop-blur-sm hover:bg-white hover:text-slate-900 transition-all duration-300 active:scale-95 flex items-center gap-2">
                  <MessageSquare size={14} />
                  <span>KONSULTASI WHATSAPP</span>
                </button>
              </a>
            </div>

          </div>

          {/* Right Column: Clean & Minimal Partner Calculator */}
          <div className="lg:col-span-6 wholesale-calc-card">
            <div className="bg-[#1E293B]/90 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden">
              
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#367F4D]/20 border border-[#367F4D]/30 flex items-center justify-center text-[#367F4D]">
                    <Calculator size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-display font-black uppercase tracking-wider text-white">
                      ESTIMASI HEMAT B2B
                    </h3>
                    <p className="text-[10px] text-stone-400 font-medium">
                      Simulasi potongan harga &amp; tier pemesanan bulanan
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-block text-[9px] font-black uppercase tracking-widest text-stone-400 bg-white/5 border border-white/10 px-3 py-1 rounded-sm">
                  LIVE ESTIMATOR
                </span>
              </div>

              {/* Volume Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2 text-stone-400">
                    <FileText size={14} className="text-[#367F4D]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">VOLUME KEBUTUHAN</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-display font-black text-white italic leading-none">{volume}</span>
                    <span className="text-sm font-cloude text-[#367F4D]">KG / BULAN</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <input 
                    type="range" 
                    min="5" 
                    max="200" 
                    step="5" 
                    value={volume} 
                    onChange={(e) => setVolume(Number(e.target.value))} 
                    className="w-full h-2.5 bg-white/25 border border-white/20 rounded-lg appearance-none cursor-pointer accent-[#367F4D] transition-colors"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                    <span>5 KG</span>
                    <span>50 KG (Gold Tier)</span>
                    <span>200 KG</span>
                  </div>
                </div>
              </div>

              {/* Minimal Clean Result Box */}
              <div className="bg-[#111827] border border-white/10 rounded-xl p-6 relative overflow-hidden space-y-6">
                
                <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-5">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">TIER KEMITRAAN</span>
                    <h4 className="text-xl sm:text-2xl font-display font-black italic text-white">
                      {tier}
                    </h4>
                  </div>

                  <div className="space-y-1 text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">POTONGAN / KG</span>
                    <h4 className="text-xl sm:text-2xl font-cloude text-[#367F4D]">
                      Rp {(discountPerKg / 1000).toFixed(0)}K
                    </h4>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">ESTIMASI TOTAL HEMAT</span>
                    <p className="text-[10px] text-stone-400 font-medium">Tanpa potongan fee marketplace</p>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl sm:text-4xl font-cloude text-[#367F4D]">
                      Rp {formattedSavings.value} {formattedSavings.unit}
                    </span>
                    <span className="text-[9px] font-black text-stone-400 block tracking-widest uppercase">/ BULAN</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
