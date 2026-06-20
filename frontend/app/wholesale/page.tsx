"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Truck, 
  Settings, BarChart3, Globe, Award, 
  Factory, Handshake, Microscope, FileText
} from "lucide-react";
import { Sticker } from "@/components/ui/sticker";
import { FooterV2 } from "@/components/sections/v2/FooterV2";
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
    <div className="bg-[#FAF9F6] min-h-screen relative overflow-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      <section ref={heroRef} className="pt-32 pb-16 px-6 relative z-10 bg-[#E2DACB]/30">
        <div className="max-w-7xl mx-auto flex flex-col gap-12 items-center text-center lg:text-left lg:flex-row">
          <div className="w-full space-y-6">
            <div className="inline-block px-4 py-1.5 bg-white border border-black/10 shadow-[4px_4px_0_rgba(0,0,0,0.02)] rotate-[-1deg] text-[9px] font-black tracking-[0.3em] text-[#367F4D] uppercase wholesale-hero-text">
               {tWholesale.heroBadge}
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-cloude tracking-tighter leading-[0.9] text-slate-900 wholesale-hero-text">
              {tWholesale.heroTitle1} <br/>
              <span className="font-display italic text-[#367F4D]">{tWholesale.heroTitle2}</span>
            </h1>
            <p className="max-w-lg mx-auto lg:mx-0 text-stone-600 font-medium text-base leading-relaxed bg-white/40 p-4 border-l-4 border-[#367F4D]/20 backdrop-blur-sm shadow-sm wholesale-hero-text">
              {tWholesale.heroDesc}
            </p>
            <div className="pt-2 wholesale-hero-text">
              <Link href="/b2b/register">
                <button className="w-full lg:w-auto bg-[#367F4D] text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm hover:bg-[#2B4031] transition-all flex items-center justify-center gap-3">
                  {tWholesale.joinHub} <ArrowRight size={14} strokeWidth={3} />
                </button>
              </Link>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 h-auto relative">
            <div className="bento-item bg-white p-3 pb-8 border border-black/10 shadow-[6px_6px_0px_rgba(0,0,0,0.03)] rotate-0 md:rotate-[-3deg] relative z-20">
               <div className="w-full aspect-[4/3] bg-[#E2DACB] overflow-hidden relative border border-black/5">
                  <img src="https://placehold.co/800x600/2a1619/e2dacb?text=BATCH+001" alt="Roast Machine" className="w-full h-full object-cover filter contrast-125 saturate-50 grayscale-[0.2]" />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bento-item bg-[#FDFBF7] p-6 border border-black/10 shadow-[6px_6px_0px_rgba(0,0,0,0.02)] flex flex-col justify-center gap-2">
                 <h3 className="text-xl font-display font-black uppercase tracking-tighter leading-none text-slate-900">{tWholesale.dedicated}<br/><span className="text-[#367F4D] italic">{tWholesale.facility}</span></h3>
                 <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest italic border-t border-black/5 pt-2">{tWholesale.centralizedOps}</p>
              </div>
              <div className="bento-item bg-[#1A2B20] p-6 border border-black/10 shadow-[6px_6px_0px_rgba(0,0,0,0.1)] flex flex-col justify-center gap-2 text-white">
                 <h3 className="text-xl font-cloude tracking-widest leading-none text-[#EBA294]">{tWholesale.trusted}<br/>{tWholesale.partner}</h3>
                 <div className="flex items-center gap-2 mt-1">
                    <Handshake size={12} className="text-[#EBA294]" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">{tWholesale.est}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="calculator" className="calc-reveal py-40 px-6 relative z-10 bg-[#FAF9F6]">
        <div className="absolute top-[-32px] left-0 w-full overflow-hidden leading-0">
          <svg className="block w-full h-8" viewBox="0 0 100 10" preserveAspectRatio="none" fill="#FAF9F6">
            <path d="M0 10 L0 0 L5 5 L10 0 L15 5 L20 0 L25 5 L30 0 L35 5 L40 0 L45 5 L50 0 L55 5 L60 0 L65 5 L70 0 L75 5 L80 0 L85 5 L90 0 L95 5 L100 0 L100 10 Z" fill="#FAF9F6" fillOpacity="1"/>
          </svg>
        </div>
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 text-stone-400">
               <Microscope size={20} />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">{tWholesale.ecoTest}</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-cloude tracking-tighter text-slate-900 leading-none">{tWholesale.growthEngine}</h2>
          </div>
          <div className="bg-white border border-black/10 rounded-2xl p-10 md:p-20 shadow-[15px_15px_0px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #367F4D 1px, transparent 1px), linear-gradient(to bottom, #367F4D 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="flex-1 space-y-12 z-10" id="tour-wholesale-slider">
               <div className="space-y-6">
                 <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#367F4D]" />
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">{tWholesale.monthlyVol}</label>
                 </div>
                 <div className="flex items-end gap-3">
                    <span className="text-8xl font-display font-black italic text-slate-900 leading-none">{volume}</span>
                    <span className="text-2xl font-cloude text-[#367F4D] pb-2 underline decoration-wavy">KG</span>
                 </div>
                 <div className="relative pt-6">
                    <input type="range" min="10" max="200" step="5" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#367F4D]"/>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-stone-400 tracking-tighter">
                        <span>{tWholesale.min}</span>
                        <span>{tWholesale.scale}</span>
                    </div>
                 </div>
               </div>
            </div>
            <div className="flex-1 bg-[#2B4031] rounded-xl p-10 text-white flex flex-col justify-center relative overflow-hidden shadow-sm z-10 rotate-1" id="tour-wholesale-tier">
               <div className="absolute top-[-10px] left-10 w-16 h-4 bg-white/20 border border-white/5 rotate-[-5deg] backdrop-blur-sm z-50"></div>
               <div className="space-y-10 relative z-10">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#8CADD8]">{tWholesale.currentTier}</p>
                     <h3 className="text-4xl font-display font-black italic text-[#F1B941] leading-none underline decoration-double">{tier}</h3>
                  </div>
                  <div className="space-y-8 py-8 border-y border-white/10 border-dashed">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{tWholesale.labDiscount}</span>
                        <p className="text-2xl font-cloude text-[#EBA294]">
                           Rp {(discountPerKg / 1000).toFixed(0)}K<span className="text-[10px] opacity-40 ml-1">/KG</span>
                        </p>
                     </div>
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#8CADD8]">{tWholesale.projectedSavings}</span>
                        <div className="text-right leading-none">
                           <span className="text-5xl font-cloude text-white">{formattedSavings.value}</span>
                           <span className="text-[12px] font-black block mt-2 opacity-50 tracking-[0.2em]">{formattedSavings.unit} / {tWholesale.perMo}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={benefitsRef} className="py-40 px-6 relative z-10 bg-[#E2DACB]/20" id="tour-wholesale-benefits">
        <div className="max-w-7xl mx-auto space-y-24">
           <div className="text-center space-y-6">
              <h2 className="text-7xl md:text-8xl font-cloude tracking-tighter text-slate-900 leading-none italic">{tWholesale.whyPartner}</h2>
              <div className="w-24 h-1 bg-[#EBA294] mx-auto rotate-1"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
              {benefits.map((benefit, i) => (
                <div 
                  key={i}
                  id={i === 0 ? "tour-wholesale-benefit-card" : undefined}
                  className="benefit-card bg-white p-10 border border-black/10 shadow-[8px_8px_0px_rgba(0,0,0,0.02)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(0,0,0,0.04)] transition-all duration-500 group relative flex flex-col"
                  style={{ 
                    transform: `rotate(${i % 2 === 0 ? -1 : 1.5}deg)`,
                    borderRadius: "4px 2px 6px 3px"
                  }}
                >
                  {i % 3 === 0 && <div className="absolute top-[-8px] left-10 w-12 h-4 bg-stone-100/60 border border-black/5 rotate-[-12deg] z-20 backdrop-blur-sm"></div>}
                  {i === 2 && <Sticker rotate={12} className="top-4 right-4 border border-black/5 shadow-sm scale-90" variant="solid" color="#EBA294">PROFIT</Sticker>}
                  <div className="w-14 h-14 bg-stone-50 border border-black/5 rounded-xl flex items-center justify-center text-stone-400 group-hover:text-[#367F4D] group-hover:scale-110 transition-all duration-500 mb-8 shadow-sm">
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-display font-black uppercase tracking-tighter text-slate-900 mb-4">{benefit.title}</h3>
                  <svg className="w-12 opacity-10 mb-6" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5" stroke="currentColor" fill="transparent" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <p className="text-sm text-stone-500 font-medium leading-relaxed flex-1">{benefit.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      <section ref={ctaRef} className="cta-reveal py-40 px-6 relative z-50 -mt-20 overflow-hidden bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto pt-10">
          <div className="bg-[#2A1619] p-12 md:p-24 rounded-2xl border border-black/20 shadow-2xl relative overflow-hidden group"
               style={{ clipPath: "polygon(0 3%, 8% 0, 16% 3%, 24% 0, 32% 3%, 40% 0, 48% 3%, 56% 0, 64% 3%, 72% 0, 80% 3%, 88% 0, 96% 3%, 100% 0, 100% 100%, 0 100%)" }}
          >
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            
            <Sticker rotate={-10} className="top-10 left-10 border border-white/10 shadow-sm" color="#F1B941" variant="solid">
              <span className="p-2 text-slate-900 uppercase font-black tracking-widest text-[9px]">{tWholesale.confidential}</span>
            </Sticker>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 text-center lg:text-left mt-16 lg:mt-0">
              <div className="space-y-6 flex-1">
                <h2 className="text-5xl md:text-7xl font-cloude text-white leading-none tracking-tighter">{tWholesale.initialize} <br/> <span className="text-[#EBA294] italic font-display">{tWholesale.onboarding}</span></h2>
                <p className="text-white/60 font-medium text-lg max-w-xl">
                  {tWholesale.ctaDesc}
                </p>
              </div>
              
              <Link href="/b2b/register" className="w-full lg:w-auto shrink-0" id="tour-wholesale-join">
                <button className="w-full lg:w-auto h-20 px-12 bg-white text-slate-900 font-black tracking-[0.3em] rounded-xl hover:bg-[#EBA294] transition-all duration-500 uppercase text-xs shadow-sm hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4">
                  {tWholesale.beginRegistration} <ArrowRight size={18} strokeWidth={3} />
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
