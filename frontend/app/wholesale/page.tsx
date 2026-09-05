"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Truck, 
  Settings, BarChart3, Globe, Award, 
  Factory, Handshake, Microscope, FileText
} from "lucide-react";
import { Sticker } from "@/components/ui/sticker";
import { Footer } from "@/components/sections/Footer";
import { useI18n } from "@/lib/i18n";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// moved to component body so it can use i18n

export default function WholesalePageV2() {
  const [volume, setVolume] = useState<number>(15);
  const [tier, setTier] = useState("Bronze");
  const [discountPerKg, setDiscountPerKg] = useState(10000);
  const [savings, setSavings] = useState(0);

  const t = useI18n();
  const tWholesale = t.wholesale;
  const wholesaleHero = {
    badge: "B2B Roastery Partnership",
    title1: "Scale Your",
    title2: "Business.",
  };

  const benefits = [
    { icon: <ShieldCheck size={20} />, title: tWholesale.benefits.qualityTitle, desc: tWholesale.benefits.qualityDesc },
    { icon: <Settings size={20} />, title: tWholesale.benefits.customTitle, desc: tWholesale.benefits.customDesc },
    { icon: <BarChart3 size={20} />, title: tWholesale.benefits.tieredTitle, desc: tWholesale.benefits.tieredDesc },
    { icon: <Truck size={20} />, title: tWholesale.benefits.logisticsTitle, desc: tWholesale.benefits.logisticsDesc },
    { icon: <Globe size={20} />, title: tWholesale.benefits.sourcingTitle, desc: tWholesale.benefits.sourcingDesc },
    { icon: <Award size={20} />, title: tWholesale.benefits.supportTitle, desc: tWholesale.benefits.supportDesc }
  ];

  const heroRef = useRef<HTMLElement>(null);
  const calcRef = useRef<HTMLElement>(null);
  const benefitsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const formatCompactCurrency = (val: number) => {
    if (val >= 1000000) {
      return { value: (val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1), unit: "JUTA" };
    }
    return { value: (val / 1000).toFixed(0), unit: "RIBU" };
  };

  const formattedSavings = formatCompactCurrency(savings);

  useEffect(() => {
    let currentDiscount = 10000;
    let currentTier = tWholesale.bronze;

    if (volume >= 50) {
      currentTier = tWholesale.gold;
      currentDiscount = 20000;
    } else if (volume >= 15) {
      currentTier = tWholesale.silver;
      currentDiscount = 15000;
    } else {
      currentTier = tWholesale.bronze;
      currentDiscount = 10000;
    }

    setTier(currentTier);
    setDiscountPerKg(currentDiscount);
    setSavings(volume * currentDiscount);
  }, [volume]);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Hero reveal
        const heroText = gsap.utils.toArray(".wholesale-hero-text");
        if (heroText.length > 0) {
          gsap.from(heroText, {
            y: 50, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out"
          });
        }

        // Bento cards
        const bentoItems = gsap.utils.toArray(".bento-item");
        if (bentoItems.length > 0) {
          gsap.from(bentoItems, {
            y: 80, rotation: (i) => i % 2 === 0 ? -3 : 3, opacity: 0, stagger: 0.15, duration: 1.2, ease: "back.out(1.2)"
          });
        }

        // Calculator reveal
        const calculator = document.getElementById("calculator");
        if (calculator) {
          gsap.from(".calc-reveal", {
            y: 50, opacity: 0, duration: 1, ease: "power2.out",
            scrollTrigger: { trigger: calculator, start: "top 80%" }
          });
        }

        // Benefits reveal
        const benefits = benefitsRef.current;
        if (benefits) {
          const benefitCards = gsap.utils.toArray(".benefit-card");
          if (benefitCards.length > 0) {
            gsap.set(benefitCards, { y: 50, opacity: 1 });
            gsap.fromTo(benefitCards, 
              { y: 50, opacity: 0 },
              {
                y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: "power2.out",
                scrollTrigger: { trigger: benefits, start: "top 80%" }
              }
            );
          }
        }

        // CTA reveal
        const cta = ctaRef.current;
        if (cta) {
          gsap.from(".cta-reveal", {
            y: 50, opacity: 0, duration: 1, ease: "power2.out",
            scrollTrigger: { trigger: cta, start: "top 90%" }
          });
        }
        ScrollTrigger.refresh();
      });
      return ctx;
    }, 50);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="bg-[#F0ECE1] min-h-screen relative overflow-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.025]" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      <section ref={heroRef} className="pt-36 pb-24 px-6 relative z-10 bg-[#2A1619] text-white overflow-hidden border-b border-white/10">
        {/* Subtle Background Grid & Noise */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="max-w-7xl mx-auto flex flex-col gap-12 items-center text-center lg:text-left lg:flex-row relative z-10">
          <div className="w-full space-y-6 lg:min-h-[30rem] flex flex-col justify-center items-center lg:items-start">
            <div className="inline-block px-4 py-1.5 bg-white/10 border border-white/15 shadow-sm rotate-[-1deg] text-[9px] font-mono font-bold tracking-[0.35em] text-[#F1B941] uppercase wholesale-hero-text">
               {wholesaleHero.badge}
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-sans font-black tracking-tight text-white leading-[0.9] uppercase relative wholesale-hero-text">
              {wholesaleHero.title1}{" "}
              <span className="font-display italic font-normal normal-case text-[#EBA294] block sm:inline mt-1 sm:mt-0">
                {wholesaleHero.title2}
              </span>
            </h1>
            <p className="w-full min-h-[7.5rem] max-w-lg mx-auto lg:mx-0 text-stone-300 font-medium text-base leading-relaxed bg-white/5 p-5 border-l-4 border-[#EBA294] backdrop-blur-sm shadow-md wholesale-hero-text">
              {tWholesale.heroDesc}
            </p>
            <div className="pt-2 wholesale-hero-text">
              <Link href="/b2b/register">
                <button className="w-full lg:w-auto bg-[#EBA294] text-[#2A1619] px-8 py-4 rounded-xl text-[10px] font-mono font-bold uppercase tracking-[0.25em] shadow-xl hover:bg-[#F1B941] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-3">
                  {tWholesale.joinHub} <ArrowRight size={14} strokeWidth={3} />
                </button>
              </Link>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 h-auto relative">
            <div className="bento-item bg-white p-3 pb-8 border border-black/10 shadow-2xl rotate-0 md:rotate-[-3deg] relative z-20">
               <div className="w-full aspect-[4/3] bg-[#E2DACB] overflow-hidden relative border border-black/5">
                  <Image src="https://placehold.co/800x600/2a1619/e2dacb?text=BATCH+001" alt="Roast Machine" fill className="object-cover filter contrast-125 saturate-50 grayscale-[0.2]" />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bento-item bg-[#3D2024] p-6 border border-white/15 shadow-xl flex flex-col justify-center gap-2 md:min-h-[10.5rem] text-white backdrop-blur-sm">
                 <h3 className="text-xl font-display font-black uppercase tracking-tighter leading-none text-white">{tWholesale.dedicated}<br/><span className="text-[#EBA294] italic font-normal normal-case">{tWholesale.facility}</span></h3>
                 <p className="text-[8px] font-bold text-stone-300/80 uppercase tracking-widest italic border-t border-white/10 pt-2">{tWholesale.centralizedOps}</p>
              </div>
              <div className="bento-item bg-[#1C0F11] p-6 border border-white/15 shadow-xl flex flex-col justify-center gap-2 text-white md:min-h-[10.5rem] backdrop-blur-sm">
                 <h3 className="text-xl font-sans font-black uppercase tracking-tight leading-none text-[#F1B941]">{tWholesale.trusted}<br/><span className="font-display italic font-normal normal-case text-white">{tWholesale.partner}</span></h3>
                 <div className="flex items-center gap-2 mt-1">
                    <Handshake size={12} className="text-[#EBA294]" />
                    <span className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] opacity-80 text-[#EBA294]">{tWholesale.est}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="calculator" className="calc-reveal py-32 px-6 relative z-10 bg-[#F0ECE1] text-slate-900 border-b border-black/5">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
             <div className="inline-flex items-center gap-2 text-stone-500">
                <Microscope size={18} className="text-[#2A1619]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-[#2A1619]">{tWholesale.ecoTest}</span>
             </div>
             <h2 className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tight text-slate-900 leading-tight uppercase">{tWholesale.growthEngine}</h2>
          </div>

          <div className="bg-[#1C0F11] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden text-white">
            {/* Header Bar */}
            <div className="flex justify-between items-center border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#EBA294]/20 border border-[#EBA294]/30 flex items-center justify-center text-[#EBA294]">
                  <FileText size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    {tWholesale.growthEngine}
                  </h3>
                  <p className="text-[10px] text-stone-400 font-medium">
                    {tWholesale.monthlyVol}
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-block text-[9px] font-mono font-bold uppercase tracking-widest text-[#F1B941] bg-white/5 border border-white/10 px-3 py-1 rounded-xs">
                LIVE ESTIMATOR
              </span>
            </div>

            {/* Main Grid Layout matching landing calculator */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Column: Volume Slider */}
              <div className="md:col-span-6 space-y-6" id="tour-wholesale-slider">
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">{tWholesale.monthlyVol}</span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-300 block">VOLUME KEBUTUHAN</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl sm:text-6xl font-display font-black text-white italic leading-none">{volume}</span>
                    <span className="text-xs font-mono font-bold text-[#EBA294]">KG / {tWholesale.perMo}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <input 
                    type="range" 
                    min="10" 
                    max="200" 
                    step="5" 
                    value={volume} 
                    onChange={(e) => setVolume(Number(e.target.value))} 
                    className="w-full h-2.5 bg-white/20 border border-white/15 rounded-lg appearance-none cursor-pointer accent-[#EBA294] transition-colors"
                  />
                  <div className="flex justify-between text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                    <span>{tWholesale.min} (10 KG)</span>
                    <span>50 KG (Gold Tier)</span>
                    <span>{tWholesale.scale} (200 KG)</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Result Card matching landing page */}
              <div className="md:col-span-6" id="tour-wholesale-tier">
                <div className="bg-[#12090A] border border-white/10 rounded-xl p-6 sm:p-8 relative overflow-hidden space-y-6">
                  
                  <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-5">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400">{tWholesale.currentTier}</span>
                      <h4 className="text-2xl sm:text-3xl font-display font-black italic text-[#F1B941]">
                        {tier}
                      </h4>
                    </div>

                    <div className="space-y-1 text-right">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400">{tWholesale.labDiscount}</span>
                      <h4 className="text-2xl sm:text-3xl font-mono font-bold text-[#EBA294]">
                        Rp {(discountPerKg / 1000).toFixed(0)}K
                      </h4>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400">{tWholesale.projectedSavings}</span>
                      <p className="text-[10px] text-stone-400 font-medium">Tanpa potongan fee marketplace</p>
                    </div>

                    <div className="text-right">
                      <span className="text-3xl sm:text-4xl font-mono font-black text-white">
                        Rp {formattedSavings.value} {formattedSavings.unit}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-stone-400 block tracking-widest uppercase">/ {tWholesale.perMo}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section ref={benefitsRef} className="pt-20 md:pt-28 pb-12 md:pb-16 px-6 relative z-10 bg-[#FAF6F0] border-b border-black/5 overflow-hidden" id="tour-wholesale-benefits">
        {/* Soft Large Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-7xl mx-auto space-y-16 md:space-y-20 relative z-10">
           <div className="text-center space-y-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-[#EBA294] block">KEMITRAAN &amp; GROSIR</span>
              <h2 className="text-5xl sm:text-7xl md:text-8xl font-sans font-black tracking-tight text-slate-900 leading-none uppercase">{tWholesale.whyPartner}</h2>
              <div className="w-24 h-1 bg-[#EBA294] mx-auto rotate-1"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {benefits.map((benefit, i) => (
                <div 
                  key={i}
                  id={i === 0 ? "tour-wholesale-benefit-card" : undefined}
                  className="benefit-card bg-[#2A1619] text-white p-8 md:p-10 border border-white/10 shadow-[8px_8px_0px_rgba(0,0,0,0.12)] hover:-translate-y-2 hover:border-[#EBA294] hover:shadow-[12px_12px_0px_rgba(235,162,148,0.25)] transition-all duration-500 group relative flex flex-col"
                  style={{ 
                    transform: `rotate(${i % 2 === 0 ? -1 : 1.5}deg)`,
                    borderRadius: "4px 2px 6px 3px"
                  }}
                >
                  {i % 3 === 0 && <div className="absolute top-[-8px] left-10 w-12 h-4 bg-white/10 border border-white/10 rotate-[-12deg] z-20 backdrop-blur-sm"></div>}
                  {i === 2 && <Sticker rotate={12} className="top-4 right-4 border border-white/10 shadow-sm scale-90" variant="solid" color="#F1B941"><span className="text-[#2A1619] font-black tracking-widest">PROFIT</span></Sticker>}
                  <div className="w-14 h-14 bg-white/10 border border-white/15 rounded-xl flex items-center justify-center text-[#EBA294] group-hover:text-[#F1B941] group-hover:border-[#F1B941]/40 group-hover:scale-110 transition-all duration-500 mb-8 shadow-sm">
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-display font-black uppercase tracking-tighter text-white mb-4 group-hover:text-[#EBA294] transition-colors">{benefit.title}</h3>
                  <svg className="w-12 opacity-20 mb-6 text-[#EBA294]" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5" stroke="currentColor" fill="transparent" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <p className="text-sm text-stone-300 font-medium leading-relaxed flex-1">{benefit.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      <section ref={ctaRef} className="cta-reveal pt-8 md:pt-12 pb-16 md:pb-24 px-6 relative z-10 overflow-hidden bg-[#F0ECE1]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#2A1619] p-8 sm:p-12 md:p-16 rounded-2xl border border-black/20 shadow-2xl relative overflow-hidden group"
               style={{ clipPath: "polygon(0 3%, 8% 0, 16% 3%, 24% 0, 32% 3%, 40% 0, 48% 3%, 56% 0, 64% 3%, 72% 0, 80% 3%, 88% 0, 96% 3%, 100% 0, 100% 100%, 0 100%)" }}
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            <Sticker rotate={-10} className="top-6 left-6 border border-white/10 shadow-sm" color="#F1B941" variant="solid">
              <span className="p-2 text-slate-900 uppercase font-black tracking-widest text-[9px]">{tWholesale.confidential}</span>
            </Sticker>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-16 text-center lg:text-left mt-8 lg:mt-0">
              <div className="space-y-4 md:space-y-6 flex-1">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black uppercase text-white leading-tight tracking-tight">{tWholesale.initialize} <br/> <span className="text-[#EBA294] italic font-display font-normal normal-case">{tWholesale.onboarding}</span></h2>
                <p className="text-white/60 font-medium text-base md:text-lg max-w-xl">
                  {tWholesale.ctaDesc}
                </p>
              </div>
              
              <Link href="/b2b/register" className="w-full lg:w-auto shrink-0" id="tour-wholesale-join">
                <button className="w-full lg:w-auto h-16 sm:h-20 px-8 sm:px-12 bg-white text-slate-900 font-black tracking-[0.25em] md:tracking-[0.3em] rounded-xl hover:bg-[#EBA294] transition-all duration-500 uppercase text-xs shadow-sm hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4">
                  {tWholesale.beginRegistration} <ArrowRight size={18} strokeWidth={3} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
