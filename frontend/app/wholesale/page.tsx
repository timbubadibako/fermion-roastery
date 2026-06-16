"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, ArrowRight, ShieldCheck, Truck, 
  Settings, BarChart3, Globe, Award, 
  Package, Calendar, CheckCircle2, Factory, Handshake, TrendingDown,
  Beaker, Microscope, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sticker } from "@/components/ui/sticker";
import { FooterV2 } from "@/components/sections/v2/FooterV2";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  { icon: <ShieldCheck size={20} />, title: "Quality Guarantee", desc: "Setiap batch dipanggang dengan standar kontrol kualitas yang ketat." },
  { icon: <Settings size={20} />, title: "Custom Roast", desc: "Sesuaikan profil sangrai untuk mencocokkan karakter unik brand cafe Anda." },
  { icon: <BarChart3 size={20} />, title: "Tiered Pricing", desc: "Dapatkan harga yang semakin kompetitif seiring bertambahnya volume Anda." },
  { icon: <Truck size={20} />, title: "Reliable Logistics", desc: "Pengiriman terjadwal untuk memastikan stok Anda tidak pernah kosong." },
  { icon: <Globe size={20} />, title: "Direct Sourcing", desc: "Akses langsung ke kebun kopi terbaik di seluruh nusantara." },
  { icon: <Award size={20} />, title: "Partner Support", desc: "Konsultasi menu dan kalibrasi rutin dari tim roaster ahli kami." }
];

export default function WholesalePageV2() {
  const [volume, setVolume] = useState<number>(15);
  const [tier, setTier] = useState("Bronze");
  const [discountPerKg, setDiscountPerKg] = useState(10000);
  const [savings, setSavings] = useState(0);

  const heroRef = useRef<HTMLElement>(null);
  const calcRef = useRef<HTMLElement>(null);
  const benefitsRef = useRef<HTMLElement>(null);

  // Helper to format currency into "Jt" or "Rb"
  const formatCompactCurrency = (val: number) => {
    if (val >= 1000000) {
      return { 
        value: (val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1), 
        unit: "JUTA" 
      };
    }
    return { 
      value: (val / 1000).toFixed(0), 
      unit: "RIBU" 
    };
  };

  const formattedSavings = formatCompactCurrency(savings);

  useEffect(() => {
    let currentDiscount = 10000;
    let currentTier = "Bronze Partner";

    if (volume >= 50) {
      currentTier = "Gold Partner";
      currentDiscount = 20000;
    } else if (volume >= 15) {
      currentTier = "Silver Partner";
      currentDiscount = 15000;
    } else {
      currentTier = "Bronze Partner";
      currentDiscount = 10000;
    }

    setTier(currentTier);
    setDiscountPerKg(currentDiscount);
    setSavings(volume * currentDiscount);
  }, [volume]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Hero reveal
      gsap.from(".wholesale-hero-text", {
        y: 50, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out"
      });

      // Bento cards parallax-ish
      gsap.from(".bento-item", {
        y: 80, rotation: (i) => i % 2 === 0 ? -3 : 3, opacity: 0, stagger: 0.15, duration: 1.2, ease: "back.out(1.2)"
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#FAF9F6] min-h-screen relative overflow-hidden font-sans">
      
      {/* Background Aesthetics */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* SECTION 1: SCRAPBOOK HERO */}
      <section ref={heroRef} className="pt-48 pb-24 px-6 relative z-10 bg-[#E2DACB]/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 space-y-10">
            <div className="inline-block px-4 py-1.5 bg-white border border-black/10 shadow-[4px_4px_0_rgba(0,0,0,0.02)] rotate-[-1deg] text-[10px] font-black tracking-[0.3em] text-[#367F4D] uppercase wholesale-hero-text">
               B2B Partnership Lab
            </div>
            
            <h1 className="text-7xl md:text-9xl font-cloude tracking-tighter leading-[0.8] text-slate-900 wholesale-hero-text">
              Scale Your <br/>
              <span className="font-display italic text-[#367F4D]">Business.</span>
            </h1>
            
            <p className="max-w-md text-stone-600 font-medium text-lg leading-relaxed bg-white/40 p-5 border-l-4 border-[#367F4D]/20 backdrop-blur-sm shadow-sm wholesale-hero-text">
              Solusi kopi hulu-ke-hilir untuk bisnis yang mengutamakan kualitas, konsistensi, dan cerita di balik setiap biji.
            </p>
            
            <div className="pt-4 wholesale-hero-text">
              <Link href="/b2b/register">
                <button className="bg-[#367F4D] text-white px-10 py-5 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-sm hover:-translate-y-1 hover:bg-[#2B4031] transition-all active:scale-95 flex items-center gap-4">
                  Join the Partner Hub <ArrowRight size={16} strokeWidth={3} />
                </button>
              </Link>
            </div>
          </div>

          {/* B2B Scrapbook Bento */}
          <div className="lg:col-span-7 grid grid-cols-2 grid-rows-2 gap-8 h-[500px] lg:h-[650px] relative mt-12 lg:mt-0">
            {/* Main Polaroid */}
            <div className="bento-item col-span-1 row-span-2 bg-white p-4 pb-12 border border-black/10 shadow-[10px_10px_0px_rgba(0,0,0,0.03)] rotate-[-3deg] relative z-20">
               {/* Tape */}
               <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-20 h-6 bg-white/60 border border-black/5 rotate-[4deg] z-30 backdrop-blur-sm shadow-sm"></div>
               
               <div className="w-full h-full bg-[#E2DACB] overflow-hidden relative border border-black/5">
                  <img src="https://placehold.co/600x800/2a1619/e2dacb?text=BATCH+001" alt="Roast Machine" className="w-full h-full object-cover filter contrast-125 saturate-50 grayscale-[0.2]" />
                  <Sticker rotate={12} className="bottom-6 right-6 border border-black/10 shadow-sm" color="#F1B941">HIGH VOLUME</Sticker>
               </div>
            </div>

            {/* Note Panel 1 */}
            <div className="bento-item col-span-1 row-span-1 bg-[#FDFBF7] p-8 border border-black/10 shadow-[8px_8px_0px_rgba(0,0,0,0.02)] rotate-[4deg] flex flex-col justify-center gap-4 relative">
               <div className="absolute top-4 right-6 opacity-10"><Factory size={48} /></div>
               <h3 className="text-3xl font-display font-black uppercase tracking-tighter leading-none text-slate-900">Dedicated<br/><span className="text-[#367F4D] italic">Facility.</span></h3>
               <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest italic border-t border-black/5 pt-4">Centralized Roastery Ops</p>
            </div>

            {/* Note Panel 2 */}
            <div className="bento-item col-span-1 row-span-1 bg-[#1A2B20] p-8 border border-black/10 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] rotate-[-2deg] flex flex-col justify-center gap-4 text-white relative">
               <div className="absolute -top-4 right-8 w-8 h-12 border-l-2 border-r-2 border-white/10 bg-transparent rotate-12"></div>
               <h3 className="text-3xl font-cloude tracking-widest leading-none text-[#EBA294]">Trusted<br/>Partner.</h3>
               <div className="flex items-center gap-2 mt-2">
                  <Handshake size={16} className="text-[#EBA294]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Est. 2026</span>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: CALCULATOR (Lab Report Style) */}
      <section ref={calcRef} id="calculator" className="py-40 px-6 relative z-10 bg-[#FAF9F6]">
        {/* Torn Edge Separator */}
        <div className="absolute top-0 left-0 w-full h-8 bg-[#E2DACB]/30" style={{ clipPath: "polygon(0 0, 10% 40%, 20% 0, 30% 50%, 40% 0, 50% 30%, 60% 0, 70% 60%, 80% 0, 90% 40%, 100% 0, 100% 100%, 0 100%)" }}></div>

        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 text-stone-400">
               <Microscope size={20} />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Economic Feasibility Test</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-cloude tracking-tighter text-slate-900 leading-none">Your Growth Engine.</h2>
          </div>

          <div className="bg-white border border-black/10 rounded-2xl p-10 md:p-20 shadow-[15px_15px_0px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-16 relative overflow-hidden">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #367F4D 1px, transparent 1px), linear-gradient(to bottom, #367F4D 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="flex-1 space-y-12 z-10">
               <div className="space-y-6">
                 <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#367F4D]" />
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Monthly Specimen Volume</label>
                 </div>
                 
                 <div className="flex items-end gap-3">
                    <span className="text-8xl font-display font-black italic text-slate-900 leading-none">{volume}</span>
                    <span className="text-2xl font-cloude text-[#367F4D] pb-2 underline decoration-wavy">KG</span>
                 </div>
                 
                 <div className="relative pt-6">
                    <input 
                        type="range" min="10" max="200" step="5"
                        value={volume} onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#367F4D]"
                    />
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-stone-400 tracking-tighter">
                        <span>MIN 10 KG</span>
                        <span>SCALE 200+ KG</span>
                    </div>
                 </div>
               </div>
            </div>

            <div className="flex-1 bg-[#2B4031] rounded-xl p-10 text-white flex flex-col justify-center relative overflow-hidden shadow-sm z-10 rotate-1">
               {/* Masking Tape */}
               <div className="absolute top-[-10px] left-10 w-16 h-4 bg-white/20 border border-white/5 rotate-[-5deg] backdrop-blur-sm z-50"></div>
               
               <div className="space-y-10 relative z-10">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#8CADD8]">Current Allocation Tier</p>
                     <h3 className="text-4xl font-display font-black italic text-[#F1B941] leading-none underline decoration-double">{tier}</h3>
                  </div>
                  
                  <div className="space-y-8 py-8 border-y border-white/10 border-dashed">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Lab Discount</span>
                        <p className="text-2xl font-cloude text-[#EBA294]">
                           Rp {(discountPerKg / 1000).toFixed(0)}K<span className="text-[10px] opacity-40 ml-1">/KG</span>
                        </p>
                     </div>
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#8CADD8]">Projected Savings</span>
                        <div className="text-right leading-none">
                           <span className="text-5xl font-cloude text-white">{formattedSavings.value}</span>
                           <span className="text-[12px] font-black block mt-2 opacity-50 tracking-[0.2em]">{formattedSavings.unit} / MO</span>
                        </div>
                     </div>
                  </div>

                  <p className="text-[10px] text-stone-400 leading-relaxed font-medium italic">
                    {tier === 'Gold Partner' 
                      ? "*Bespoke coordination with Lab Admin required for Gold allocation."
                      : `*Commitment of ${volume < 15 ? '10kg' : '15kg'}/month verified.`}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: BENEFITS (Clean Note Stack) */}
      <section ref={benefitsRef} className="py-40 px-6 relative z-10 bg-[#E2DACB]/20">
        <div className="max-w-7xl mx-auto space-y-24">
           <div className="text-center space-y-6">
              <h2 className="text-7xl md:text-8xl font-cloude tracking-tighter text-slate-900 leading-none italic">Why Partner?</h2>
              <div className="w-24 h-1 bg-[#EBA294] mx-auto rotate-1"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
              {benefits.map((benefit, i) => (
                <div 
                  key={i}
                  className="bg-white p-10 border border-black/10 shadow-[8px_8px_0px_rgba(0,0,0,0.02)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(0,0,0,0.04)] transition-all duration-500 group relative flex flex-col"
                  style={{ 
                    transform: `rotate(${i % 2 === 0 ? -1 : 1.5}deg)`,
                    borderRadius: "4px 2px 6px 3px"
                  }}
                >
                  {/* Decorative tape on some notes */}
                  {i % 3 === 0 && <div className="absolute top-[-8px] left-10 w-12 h-4 bg-stone-100/60 border border-black/5 rotate-[-12deg] z-20 backdrop-blur-sm"></div>}
                  
                  {i === 2 && <Sticker rotate={12} className="top-4 right-4 border border-black/5 shadow-sm scale-90" variant="solid" color="#EBA294">PROFIT</Sticker>}

                  <div className="w-14 h-14 bg-stone-50 border border-black/5 rounded-xl flex items-center justify-center text-stone-400 group-hover:text-[#367F4D] group-hover:scale-110 transition-all duration-500 mb-8 shadow-sm">
                    {benefit.icon}
                  </div>
                  
                  <h3 className="text-2xl font-display font-black uppercase tracking-tighter text-slate-900 mb-4">{benefit.title}</h3>
                  
                  {/* Squiggly divider */}
                  <svg className="w-12 opacity-10 mb-6" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5" stroke="currentColor" fill="transparent" strokeWidth="2" strokeLinecap="round" />
                  </svg>

                  <p className="text-sm text-stone-500 font-medium leading-relaxed flex-1">{benefit.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* SECTION 4: CTA (Lab Dark Mode) */}
      <section className="py-40 px-6 relative z-50 -mt-20 overflow-hidden bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto pt-10">
          <div className="bg-[#2A1619] p-12 md:p-24 rounded-2xl border border-black/20 shadow-2xl relative overflow-hidden group"
               style={{ clipPath: "polygon(0 3%, 8% 0, 16% 3%, 24% 0, 32% 3%, 40% 0, 48% 3%, 56% 0, 64% 3%, 72% 0, 80% 3%, 88% 0, 96% 3%, 100% 0, 100% 100%, 0 100%)" }}
          >
            {/* Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            
            <Sticker rotate={-10} className="top-10 left-10 border border-white/10 shadow-sm" color="#F1B941" variant="solid">
              <span className="p-2 text-slate-900 uppercase font-black tracking-widest text-[9px]">Confidential</span>
            </Sticker>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 text-center lg:text-left mt-16 lg:mt-0">
              <div className="space-y-6 flex-1">
                <h2 className="text-5xl md:text-7xl font-cloude text-white leading-none tracking-tighter">Initialize <br/> <span className="text-[#EBA294] italic font-display">Onboarding.</span></h2>
                <p className="text-white/60 font-medium text-lg max-w-xl">
                  Automate your partnership. Fill the form, download your lab contract, and activate your wholesale access instantly.
                </p>
              </div>
              
              <Link href="/b2b/register" className="w-full lg:w-auto shrink-0">
                <button className="w-full lg:w-auto h-20 px-12 bg-white text-slate-900 font-black tracking-[0.3em] rounded-xl hover:bg-[#EBA294] transition-all duration-500 uppercase text-xs shadow-sm hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4">
                  Begin Registration <ArrowRight size={18} strokeWidth={3} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FooterV2 />
    </div>
  );
}
