"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { 
  TrendingDown, 
  Truck, 
  Zap, 
  ArrowRight,
  Globe,
  Beaker,
  UserCheck,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FooterSection } from "@/components/sections/footer-section";

const benefits = [
  { icon: <TrendingDown className="w-6 h-6" />, title: "Price Lock Guarantee", description: "Protect your cafe’s bottom line. Lock in prices for up to 6 months." },
  { icon: <Zap className="w-6 h-6" />, title: "Micro-Batch Roast", description: "Custom roast profiles crafted in precision micro-batches for consistency." },
  { icon: <Beaker className="w-6 h-6" />, title: "Pre-Release Access", description: "Exclusive invitations to rare, seasonal lots before public launch.", comingSoon: true },
  { icon: <UserCheck className="w-6 h-6" />, title: "Barista Training", description: "Access complimentary calibration sessions and specialized training." },
  { icon: <Truck className="w-6 h-6" />, title: "Cargo Tracking", description: "Monitor your bulk supply with real-time freight cargo tracking." },
  { icon: <Globe className="w-6 h-6" />, title: "Digital Tech Perks", description: "Access our network to digitize your POS or build custom websites." }
];

const firstGroup = benefits.slice(0, 3);
const secondGroup = benefits.slice(3, 6);

// --- 1. HERO COMPONENT ---
function Hero() {
  return (
    <section className="sticky top-0 h-screen w-full flex items-center justify-center bg-slate-950 z-0">
      <Image 
        src="https://placehold.co/1920x1080/0f172a/ffffff?text=ELITE+ROASTERY+LAB" 
        alt="Hero" 
        fill 
        className="object-cover brightness-[0.25]" 
        priority 
      />
      <div className="relative z-10 text-center space-y-6 px-12">
         <p className="text-[10px] font-black text-fermion-blue tracking-[0.6em] uppercase">Partnership Invitation</p>
         <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white uppercase italic leading-[0.8]">
           Scale Your <br/> Vision.
         </h1>
         <p className="text-white/30 text-xs font-bold tracking-[0.4em] uppercase mt-8">Engineering Industrial Excellence</p>
      </div>
    </section>
  );
}

// --- 2. TECH NARRATIVE (STACKING COVER) ---
function TechNarrative() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const techText = "Experience coffee roasting reimagined with cutting-edge technology. Fermion Roastery combines precision temperature control, intelligent air-flow management, and micro-batch engineering to elevate every cup. From origin selection to final roast, our science adapts to the beans.";

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = viewportHeight * 1.5;
      const scrolled = Math.max(0, -rect.top);
      setProgress(Math.min(1, scrolled / totalScrollable));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const words = techText.split(" ");

  return (
    <section ref={sectionRef} className="relative z-10 bg-[#FAF9F6] border-t border-slate-200 shadow-[0_-50px_100px_rgba(0,0,0,0.2)]">
      <div className="sticky top-0 h-screen flex items-center justify-center px-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-[0.9] text-left">
            {words.map((word, index) => {
              const wordProgress = index / words.length;
              const isRevealed = progress > wordProgress;
              return (
                <span key={index} className="transition-colors duration-200" style={{ color: isRevealed ? "#0f172a" : "#e2e8f0" }}>
                  {word}{index < words.length - 1 ? " " : ""}
                </span>
              );
            })}
          </p>
        </div>
      </div>
      <div className="h-[150vh]" />
    </section>
  );
}

// --- 3. HORIZONTAL BENEFITS (GALLERY STYLE) ---
function HorizontalBenefits() {
  const sectionRef = useRef<HTMLElement>(null);
  const [translateX1, setTranslateX1] = useState(0);
  const [translateX2, setTranslateX2] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = viewportHeight * 3;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / totalScrollable);
      
      const maxShift = 1000; // Approximated shift
      setTranslateX1(progress * -maxShift);
      setTranslateX2(-maxShift + (progress * maxShift));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 bg-[#FAF9F6]">
      <div className="sticky top-0 h-screen flex flex-col justify-center space-y-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-12 w-full">
           <h2 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic">The Advantage.</h2>
        </div>

        {/* Row 1: Right -> Left */}
        <div className="w-full flex items-center overflow-hidden">
           <div 
             className="flex gap-10 px-12 transition-transform duration-150 ease-out"
             style={{ transform: `translateX(${translateX1 + 500}px)` }}
           >
              {firstGroup.map((b, i) => <Card key={i} benefit={b} index={i+1} />)}
           </div>
        </div>

        {/* Row 2: Left -> Right (REVERSE) */}
        <div className="w-full flex items-center overflow-hidden">
           <div 
             className="flex gap-10 px-12 transition-transform duration-150 ease-out"
             style={{ transform: `translateX(${translateX2 - 500}px)` }}
           >
              {secondGroup.map((b, i) => <Card key={i} benefit={b} index={i+4} />)}
           </div>
        </div>
      </div>
      <div className="h-[300vh]" />
    </section>
  );
}

// --- MAIN PAGE ---
export default function WholesalePage() {
  const moqRef = useRef(null);
  const isMoqInView = useInView(moqRef, { amount: 0.5 });

  return (
    <div className="bg-[#FAF9F6] min-h-screen overflow-x-hidden">
      <Hero />
      <TechNarrative />
      <HorizontalBenefits />

      {/* 4. MOQ SECTION (UNCHANGED) */}
      <section ref={moqRef} className="py-60 bg-slate-950 text-white overflow-hidden relative z-20 shadow-[0_-50px_100px_rgba(0,0,0,0.5)]">
         <motion.div animate={{ backgroundPosition: ["0px 0px", "60px 60px"] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
         <div className="max-w-6xl mx-auto px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
            <div className="space-y-10 text-left">
               <div className="space-y-4">
                 <p className="text-[10px] font-black text-fermion-blue tracking-[0.6em] uppercase">Supply Commitment</p>
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85]">The 50KG <br/> Standard.</h2>
               </div>
               <p className="text-white/40 text-lg leading-relaxed font-medium">Minimum monthly commitment for micro-batch priority roasting.</p>
               <div className="flex gap-4">
                  <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10 text-[9px] font-black tracking-widest uppercase italic italic">Weekly Roast Schedule</div>
                  <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10 text-[9px] font-black tracking-widest uppercase italic italic">Direct Partnership</div>
               </div>
            </div>
            <div className="relative flex items-center justify-center">
               <div className="absolute w-[140%] h-[140%] bg-fermion-blue/20 rounded-full blur-[140px] animate-pulse" />
               <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full border border-white/10 flex items-center justify-center bg-slate-900/60 backdrop-blur-3xl shadow-3xl">
                  <svg className="absolute w-full h-full -rotate-90 p-4">
                    <circle cx="50%" cy="50%" r="48%" stroke="white" strokeWidth="1" fill="transparent" strokeDasharray="100, 100" className="opacity-10" />
                    <motion.circle
                      cx="50%" cy="50%" r="48%" stroke="#7a9cff" strokeWidth="8" fill="transparent"
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={isMoqInView ? { strokeDasharray: "65, 100" } : {}}
                      transition={{ duration: 2, delay: 0.5, ease: [0.85, 0, 0.15, 1] }}
                    />
                  </svg>
                  <div className="text-center">
                    <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={isMoqInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.8, duration: 1 }} className="text-8xl md:text-9xl font-black italic tracking-tighter leading-none">
                      50<span className="text-2xl not-italic text-fermion-blue ml-2">KG</span>
                    </motion.p>
                    <p className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mt-4 italic">Baseline Supply</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-60 px-6 bg-white relative z-20">
        <div className="max-w-4xl mx-auto text-center space-y-12">
           <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase italic leading-[0.85]">Join the <br/> Supply Revolution.</h2>
           <Link href="/b2b/register"><Button className="bg-slate-900 text-white font-black tracking-[0.2em] px-12 h-20 rounded-[1.5rem] hover:bg-fermion-blue transition-all duration-500 uppercase italic text-lg shadow-xl shadow-slate-900/10">Register Partner</Button></Link>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}

function Card({ benefit, index }: { benefit: any; index: number }) {
  return (
    <div className="flex-1 min-w-[340px] max-w-[400px] h-[450px] bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 space-y-8 flex flex-col justify-between group relative overflow-hidden text-left">
       <span className="absolute -top-4 -right-2 text-9xl font-black text-slate-900/[0.02] italic pointer-events-none select-none">0{index}</span>
       <div className="space-y-6">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
             {benefit.icon}
          </div>
          <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase italic leading-tight">{benefit.title}</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">{benefit.description}</p>
       </div>
       <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 group-hover:text-fermion-blue transition-colors uppercase tracking-widest cursor-pointer">
          Explore Detail <ArrowRight size={14} />
       </div>
    </div>
  );
}
