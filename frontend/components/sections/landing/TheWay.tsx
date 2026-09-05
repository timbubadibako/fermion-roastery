"use client";

import React, { memo, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION 4: THE FERMION WAY / NILAI FERMION WITH SAFE GSAP REVEAL
 * Editorial 4-Stage Roastery Process Timeline with craft details & micro-specs
 */
function TheWayComponent() {
  const t = useI18n();
  const content = t.landing.theWay;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    let ctx: gsap.Context;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          ".way-title",
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
            }
          }
        );

        gsap.fromTo(
          ".way-step-card",
          { y: 45, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.9,
            ease: "power2.out",
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
            }
          }
        );
      }, sectionRef.current || undefined);
    }, 50);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  const pillars = [
    {
      num: "01",
      stage: "HULU / ORIGIN",
      title: "Sourcing & Micro-Lot",
      desc: "Biji kopi dipetik dari kemitraan petani lokal Indonesia dengan evaluasi skor kupping minimal 84+.",
      chip: "[ ALTITUDE 1200–1600 MASL ]",
      accent: "#367F4D", // Forest Green
      badgeBg: "bg-[#367F4D] text-white"
    },
    {
      num: "02",
      stage: "SANGRAI / CRAFT",
      title: "Presisi Curve Roasting",
      desc: "Penyangraian terkontrol per batch kecil untuk menonjolkan profil manis alami dan kejernihan cita rasa.",
      chip: "[ CONTROLLED ROAST CURVE ]",
      accent: "#F1B941", // Warm Gold
      badgeBg: "bg-[#F1B941] text-black"
    },
    {
      num: "03",
      stage: "EVALUASI / QC",
      title: "Quality Control & Cupping",
      desc: "Uji rasa terstandar SCA pada setiap batch sangrai untuk memastikan konsistensi aroma dan bodi.",
      chip: "[ SCA STANDARD EVALUATION ]",
      accent: "#8CADD8", // Horizon Blue
      badgeBg: "bg-[#8CADD8] text-slate-900"
    },
    {
      num: "04",
      stage: "KEMASAN / FRESH",
      title: "Degassing & Packaging",
      desc: "Dikemas langsung dengan valve satu arah demi menjaga kesegaran aroma hingga masuk cangkir Anda.",
      chip: "[ ONE-WAY DEGASSING VALVE ]",
      accent: "#111827", // Dark Slate
      badgeBg: "bg-slate-900 text-white"
    }
  ];

  return (
    <section id="the-way" ref={sectionRef} className="py-28 px-6 border-b border-black/5 bg-[#EDE8DF] relative z-30 overflow-hidden">
      
      {/* Background Decorative Ambient Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/textures/grain-noise.svg")' }} />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/10 pb-8 way-title">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white border border-black/10 text-[9px] font-black uppercase tracking-[0.35em] text-[#367F4D] rounded-sm shadow-sm">
              METODOLOGI ROASTERY
            </span>
            <h2 className="font-cloude text-4xl md:text-6xl text-slate-900 leading-[0.95] relative">
              {content.titleMain || "Cara Kerja Presisi"} <span className="text-[#367F4D]">{content.titleSub || "Fermion."}</span>
            </h2>
            <p className="text-xs text-stone-600 font-medium leading-relaxed max-w-xl">
              {content.description || "Pendekatan ilmiah dan seni terukur dari pemilihan biji kopi di hulu hingga kemasan degassing valve."}
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-stone-400 border-l border-black/10 pl-6 py-2">
            <span>4 TAHAPAN UTAMA PROSES</span>
          </div>
        </div>

        {/* 4-Step Process Timeline Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Subtle Connecting Process Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-black/15 -z-0 -translate-y-6" />

          {pillars.map((pillar, i) => (
            <div 
              key={i}
              className="way-step-card group bg-[#FAF9F6] border border-black/10 p-7 rounded-sm shadow-[6px_6px_0px_rgba(0,0,0,0.03)] hover:shadow-[12px_12px_0px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between relative overflow-hidden min-h-[320px] cursor-pointer"
            >
              {/* Oversized Background Watermark Number */}
              <div className="absolute -bottom-4 -right-2 text-7xl font-display font-black text-black/5 select-none pointer-events-none group-hover:text-black/10 group-hover:scale-110 transition-all duration-500">
                {pillar.num}
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className={`inline-block px-2.5 py-1 text-[8px] font-black uppercase tracking-widest rounded-xs ${pillar.badgeBg}`}>
                    {pillar.stage}
                  </span>
                  <span className="text-xs font-mono font-bold text-stone-400">
                    PHASE {pillar.num}
                  </span>
                </div>

                <h3 className="font-display font-black text-xl uppercase italic text-slate-900 tracking-tight pt-2 group-hover:text-[#367F4D] transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-6 relative z-10 border-t border-black/5 mt-6">
                <span className="text-[9px] font-mono font-bold text-stone-400 tracking-tighter uppercase block">
                  {pillar.chip}
                </span>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export const TheWay = memo(TheWayComponent);
