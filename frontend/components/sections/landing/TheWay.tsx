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
      badgeBg: "bg-[#367F4D] text-white",
      hoverNumberClass: "group-hover:text-[#367F4D] group-hover:opacity-40",
      hoverTitleClass: "group-hover:text-[#367F4D]",
      chipColor: "text-[#367F4D]"
    },
    {
      num: "02",
      stage: "SANGRAI / CRAFT",
      title: "Presisi Curve Roasting",
      desc: "Penyangraian terkontrol per batch kecil untuk menonjolkan profil manis alami dan kejernihan cita rasa.",
      chip: "[ CONTROLLED ROAST CURVE ]",
      badgeBg: "bg-[#F1B941] text-black",
      hoverNumberClass: "group-hover:text-[#F1B941] group-hover:opacity-40",
      hoverTitleClass: "group-hover:text-[#F1B941]",
      chipColor: "text-[#F1B941]"
    },
    {
      num: "03",
      stage: "EVALUASI / QC",
      title: "Quality Control & Cupping",
      desc: "Uji rasa terstandar SCA pada setiap batch sangrai untuk memastikan konsistensi aroma dan bodi.",
      chip: "[ SCA STANDARD EVALUATION ]",
      badgeBg: "bg-[#8CADD8] text-slate-900",
      hoverNumberClass: "group-hover:text-[#8CADD8] group-hover:opacity-40",
      hoverTitleClass: "group-hover:text-[#8CADD8]",
      chipColor: "text-[#8CADD8]"
    },
    {
      num: "04",
      stage: "KEMASAN / FRESH",
      title: "Degassing & Packaging",
      desc: "Dikemas langsung dengan valve satu arah demi menjaga kesegaran aroma hingga masuk cangkir Anda.",
      chip: "[ ONE-WAY DEGASSING VALVE ]",
      badgeBg: "bg-[#EBA294] text-slate-950 font-bold",
      hoverNumberClass: "group-hover:text-[#EBA294] group-hover:opacity-40",
      hoverTitleClass: "group-hover:text-[#EBA294]",
      chipColor: "text-[#EBA294]"
    }
  ];

  return (
    <section id="the-way" ref={sectionRef} className="py-28 px-6 border-b border-white/10 bg-[#0F1D2F] text-white relative z-30 overflow-hidden">
      
      {/* Background Micro Dot Matrix */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} 
      />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8 way-title">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white/10 border border-white/15 text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-[#8CADD8] rounded-xs">
              METODOLOGI ROASTERY
            </span>
            <h2 className="font-sans font-black text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-[0.95] relative">
              {content.titleMain || "Cara Kerja Presisi"}{" "}
              <span className="font-display italic font-normal normal-case text-[#8CADD8]">{content.titleSub || "Fermion."}</span>
            </h2>
            <p className="text-xs text-stone-300 font-medium leading-relaxed max-w-xl">
              {content.description || "Pendekatan ilmiah dan seni terukur dari pemilihan biji kopi di hulu hingga kemasan degassing valve."}
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400 border-l border-white/10 pl-6 py-2">
            <span>4 TAHAPAN UTAMA PROSES</span>
          </div>
        </div>

        {/* 4-Step Process Timeline Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Subtle Connecting Process Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-white/15 -z-0 -translate-y-6" />

          {pillars.map((pillar, i) => (
            <div 
              key={i}
              className="way-step-card group bg-[#182638] border border-white/10 p-7 rounded-xs shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between relative overflow-hidden min-h-[320px] cursor-pointer backdrop-blur-xs"
            >
              {/* Oversized Background Watermark Number - Interactive Color Glow on Hover */}
              <div className={`absolute -bottom-4 -right-2 text-7xl font-display font-black text-white/5 select-none pointer-events-none ${pillar.hoverNumberClass} group-hover:scale-110 transition-all duration-500`}>
                {pillar.num}
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className={`inline-block px-2.5 py-1 text-[8px] font-mono font-bold uppercase tracking-widest rounded-xs ${pillar.badgeBg}`}>
                    {pillar.stage}
                  </span>
                  <span className="text-xs font-mono font-bold text-stone-400">
                    PHASE {pillar.num}
                  </span>
                </div>

                <h3 className={`font-display font-black text-xl uppercase italic text-white tracking-tight pt-2 ${pillar.hoverTitleClass} transition-colors`}>
                  {pillar.title}
                </h3>

                <p className="text-xs text-stone-300 font-medium leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-6 relative z-10 border-t border-white/10 mt-6">
                <span className={`text-[9px] font-mono font-bold ${pillar.chipColor} tracking-tighter uppercase block`}>
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
