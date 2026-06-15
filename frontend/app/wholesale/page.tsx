"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Zap, ArrowRight, ShieldCheck, Truck, 
  Settings, BarChart3, Globe, Award, 
  Package, Calendar, CheckCircle2, Factory, Handshake, TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sticker } from "@/components/ui/sticker";
import { FooterV2 } from "@/components/sections/v2/FooterV2";

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

  return (
    <div className="bg-[#FAF9F6] min-h-screen relative overflow-hidden font-sans">
      
      {/* Global Aesthetics */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.025]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Client%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      <div className="fixed top-[-200px] right-[-100px] w-[900px] h-[900px] bg-fermion-wisteria/30 rounded-full blur-[120px] z-[-1]" />
      <div className="fixed bottom-[-100px] left-[-100px] w-[700px] h-[700px] bg-fermion-horizon/20 rounded-full blur-[120px] z-[-1]" />

      {/* SECTION 1: BENTO HERO */}
      <section className="pt-40 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-2 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full text-[9px] font-black tracking-[0.4em] text-fermion-lavender uppercase"
            >
              Fermion Wholesale
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl font-display font-black tracking-tighter italic leading-[0.8] text-slate-900"
            >
              Scale Your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-fermion-lavender to-fermion-horizon font-sans not-italic">Business.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-slate-500 font-medium text-xl max-w-md leading-relaxed"
            >
              Solusi kopi hulu-ke-hilir untuk bisnis yang mengutamakan kualitas, konsistensi, dan cerita di balik setiap biji.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <Link href="/b2b/register">
                <Button className="bg-slate-900 text-white px-10 py-8 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] italic shadow-2xl hover:bg-fermion-french-blue transition-all">
                  Join the Partner Hub <ArrowRight className="ml-3" size={16} />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* B2B Bento Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 grid-rows-2 gap-6 h-[500px] lg:h-[600px] relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              className="col-span-1 row-span-2 bg-white/20 backdrop-blur-3xl border border-white/50 rounded-[3rem] overflow-hidden relative group"
            >
               <div className="absolute inset-0 bg-[url('https://placehold.co/600x800/e2e8f0/94a3b8?text=Roast+Machine')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
               <Sticker rotate={-8} className="top-8 left-8" color="var(--cartoon-yellow)" variant="solid">
                 <span className="p-2 block">High<br/>Volume</span>
               </Sticker>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="col-span-1 row-span-1 bg-white/40 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] p-8 flex flex-col justify-end relative overflow-hidden"
            >
               <Factory className="absolute top-8 right-8 text-white/50 w-16 h-16" />
               <h3 className="text-3xl font-display font-black italic leading-none">Dedicated<br/>Facility</h3>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
              className="col-span-1 row-span-1 bg-slate-900 rounded-[2.5rem] p-8 flex flex-col justify-end relative overflow-hidden text-white group"
            >
               <Handshake className="absolute top-8 right-8 text-white/10 w-24 h-24 group-hover:scale-110 transition-transform duration-700" />
               <h3 className="text-3xl font-display font-black italic leading-none text-transparent bg-clip-text bg-gradient-to-r from-fermion-french-blue to-emerald-400">Trusted<br/>Partner</h3>
            </motion.div>
          </div>

        </div>
      </section>

      {/* SECTION 2: INTERACTIVE TIER SLIDER (The Money Talk) */}
      <section id="calculator" className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-5xl md:text-6xl font-display font-black italic tracking-tighter">Your Growth Engine.</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Interactive Savings Calculator</p>
          </div>

          <div className="bg-white/40 backdrop-blur-[40px] border border-white/60 rounded-[3rem] p-8 md:p-16 shadow-2xl flex flex-col md:flex-row gap-16 relative overflow-hidden">
            {/* Ambient Glow inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 blur-3xl rounded-full" />

            <div className="flex-1 space-y-10 z-10">
               <div>
                 <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 block">Estimated Monthly Volume</label>
                 <div className="flex items-end gap-2 mb-8">
                    <span className="text-7xl font-display font-black italic text-slate-900 leading-none">{volume}</span>
                    <span className="text-xl font-black text-slate-400 pb-1">KG</span>
                 </div>
                 
                 <input 
                    type="range" 
                    min="10" max="200" step="5"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-fermion-french-blue"
                 />
                 <div className="flex justify-between mt-2 text-[9px] font-black text-slate-400">
                    <span>10 KG</span>
                    <span>200+ KG</span>
                 </div>
               </div>
            </div>

            <div className="flex-1 bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-center relative overflow-hidden shadow-xl z-10">
               <div className="absolute top-0 right-0 bg-white/5 w-40 h-40 rounded-full blur-2xl" />
               <div className="space-y-8 relative z-10">
                  <div className="space-y-1">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Target Monthly Tier</p>
                     <h3 className="text-3xl font-display font-black italic text-transparent bg-clip-text bg-gradient-to-r from-fermion-french-blue to-emerald-400">{tier}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 py-6 border-y border-white/10">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Locked Discount</p>
                        <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">
                           Rp {(discountPerKg / 1000).toFixed(0)}K<span className="text-[10px] text-slate-500 font-bold ml-1">/KG</span>
                        </p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Monthly Savings</p>
                        <div className="flex flex-col leading-none">
                           <span className="text-4xl font-black italic text-emerald-400">{formattedSavings.value}</span>
                           <span className="text-[10px] font-black text-emerald-500/50 tracking-[0.3em] mt-1">{formattedSavings.unit}</span>
                        </div>
                     </div>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                    {tier === 'Gold Partner' 
                      ? "*Gold tier pricing is bespoke and requires direct coordination with our Lab Admin."
                      : `*Calculated based on a minimum commitment of ${volume < 15 ? '10kg' : '15kg'}/month. Savings are fixed per kilogram.`}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MAGNETIZED BENEFITS COLLAGE */}
      <section className="py-40 px-6 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-24">
           <div className="text-center space-y-4">
              <h2 className="text-6xl md:text-7xl font-display font-black italic tracking-tighter">Why Partner With Us?</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 50, rotate: i % 2 === 0 ? -10 : 10 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.1 }}
                  className="bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-xl hover:border-fermion-french-blue hover:-translate-y-2 transition-all duration-500 group relative"
                >
                  {/* Small decorative sticker randomly placed */}
                  {i === 2 && <Sticker rotate={12} className="top-4 right-4" variant="solid" color="var(--cartoon-pink)"><span className="px-2">PROFIT</span></Sticker>}
                  {i === 3 && <Sticker rotate={-8} className="bottom-4 right-4" variant="solid" color="var(--cartoon-green)"><span className="px-2">FAST</span></Sticker>}

                  <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white group-hover:bg-fermion-french-blue group-hover:scale-110 transition-all duration-500 mb-8 shadow-lg">
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight text-slate-900 mb-4">{benefit.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{benefit.desc}</p>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* SECTION 4: CONFIDENTIAL TERMINAL (CTA) */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-950 p-12 md:p-20 rounded-[4rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-fermion-french-blue/20 via-slate-900 to-slate-950 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <Sticker rotate={-10} className="top-10 left-10" color="var(--cartoon-yellow)" variant="solid">
              <span className="p-3 text-slate-900">CONFIDENTIAL</span>
            </Sticker>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left mt-16 md:mt-0">
              <div className="space-y-4 flex-1">
                <h2 className="text-4xl md:text-6xl font-display font-black text-white italic tracking-tighter">Initialize <br/> Onboarding.</h2>
                <p className="text-slate-400 font-medium text-lg">
                  Automate your partnership. Fill the form, download your lab contract, and activate your wholesale access instantly.
                </p>
              </div>
              
              <Link href="/b2b/register" className="w-full md:w-auto shrink-0">
                <Button className="w-full h-20 px-10 bg-white text-slate-900 font-black tracking-[0.3em] rounded-[2rem] hover:bg-fermion-french-blue hover:text-white transition-all duration-500 uppercase italic text-sm shadow-xl hover:scale-105 active:scale-95">
                  Begin Registration <ArrowRight className="ml-3" size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FooterV2 />
    </div>
  );
}
