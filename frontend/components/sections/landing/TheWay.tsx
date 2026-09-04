"use client";

import React, { memo } from "react";
import { useI18n } from "@/lib/i18n";

/**
 * SECTION 4: THE FERMION WAY / NILAI FERMION
 * Editorial 4-Stage Roastery Process Timeline with craft details & micro-specs
 */
function TheWayComponent() {
  const t = useI18n();
  const content = t.landing.theWay;

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
    <section id="the-way" className="py-28 px-6 border-b border-black/5 bg-[#EDE8DF] relative z-30 overflow-hidden">
      
      {/* Background Decorative Ambient Lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/10 pb-8">
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

        {/* 4-Step Process Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Horizontal Connecting Craft Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px border-t border-dashed border-black/15 z-0" />

          {pillars.map((p) => (
            <div 
              key={p.num}
              className="bg-white border border-black/10 p-8 rounded-sm shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-3 hover:scale-[1.01] hover:border-black/25 relative group overflow-hidden flex flex-col justify-between min-h-[340px] z-10"
            >
              {/* Oversized Background Watermark Number */}
              <span 
                className="absolute -bottom-4 -right-2 text-8xl font-display font-black italic opacity-5 group-hover:opacity-20 group-hover:scale-105 transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] pointer-events-none select-none"
                style={{ color: p.accent }}
              >
                {p.num}
              </span>

              {/* Masking Tape Accent at Top Right */}
              <div className="absolute top-0 right-8 w-12 h-3 bg-[#E2DACB]/60 border-x border-b border-black/5 opacity-70 group-hover:opacity-100 transition-opacity" />

              {/* Card Header & Stage Badge */}
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center">
                  <span className={`w-8 h-8 ${p.badgeBg} rounded-sm font-display font-black text-xs flex items-center justify-center shadow-sm`}>
                    {p.num}
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-[0.25em] text-stone-400">
                    {p.stage}
                  </span>
                </div>

                <h3 className="font-display font-black text-xl uppercase italic text-slate-900 tracking-tight pt-2">
                  {p.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {p.desc}
                </p>
              </div>

              {/* Card Footer Micro Spec Chip */}
              <div className="pt-6 relative z-10 border-t border-black/5 mt-4">
                <span className="inline-block px-2.5 py-1 bg-[#FAF9F6] border border-black/10 text-[7.5px] font-black uppercase tracking-widest text-slate-700 rounded-sm">
                  {p.chip}
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
