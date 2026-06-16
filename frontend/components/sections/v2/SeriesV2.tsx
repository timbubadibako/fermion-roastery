"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sticker } from "@/components/ui/sticker";
import { siteContent } from "@/lib/content";

/**
 * SECTION 3: SERIES SELECTION
 * Reverted to the 50/50 split layout, but optimized with the new font (Cloude)
 * and cleaner background textures instead of generic placeholder images.
 */
export function SeriesV2() {
  const content = siteContent.series;

  return (
    <section className="flex flex-col lg:flex-row min-h-[700px] relative group/section z-40 border-y border-black/5 overflow-hidden">
      
      {/* Espresso Panel */}
      <motion.div 
        whileHover={{ flex: 1.4 }}
        className="flex-1 bg-[#1A1A1A] flex items-center justify-center p-20 relative overflow-hidden group transition-all duration-700 ease-out border-r border-black"
      >
        {/* Subtle texture instead of placehold.co */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent z-0"></div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

        <div className="text-center space-y-6 z-10 transition-transform duration-700 group-hover:scale-105">
           <h3 className="text-6xl md:text-8xl font-cloude text-white leading-[0.85]">
             Espresso<br/>
             <span className="font-display italic text-[#EBA294]">Series.</span>
           </h3>
           <p className="text-[#EBA294]/80 text-xs font-black tracking-[0.3em] uppercase">{content.espresso.subtitle}</p>
           <Link href="/our-coffee?type=espresso">
              <button className="mt-8 px-10 py-3 bg-white text-black border border-black/10 rounded-none text-[10px] font-black tracking-widest uppercase hover:bg-[#EBA294] transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 shadow-sm">
                 {content.espresso.cta}
              </button>
           </Link>
        </div>

        <Sticker rotate={-8} className="top-12 left-12 opacity-0 group-hover:opacity-100 transition-all duration-500 border border-black/5 shadow-sm" color="#EBA294" variant="solid">
           {content.espresso.sticker}
        </Sticker>
      </motion.div>

      {/* Filter Panel */}
      <motion.div 
        whileHover={{ flex: 1.4 }}
        className="flex-1 bg-[#FDFBF7] flex items-center justify-center p-20 relative overflow-hidden group transition-all duration-700 ease-out"
      >
        {/* Subtle texture instead of placehold.co */}
        <div className="absolute inset-0 bg-gradient-to-tl from-black/5 to-transparent z-0"></div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

        <div className="text-center space-y-6 z-10 transition-transform duration-700 group-hover:scale-105">
           <h3 className="text-6xl md:text-8xl font-cloude text-slate-900 leading-[0.85]">
             Filter<br/>
             <span className="font-display italic text-[#367F4D]">Series.</span>
           </h3>
           <p className="text-[#367F4D]/80 text-xs font-black tracking-[0.3em] uppercase">{content.filter.subtitle}</p>
           <Link href="/our-coffee?type=filter">
              <button className="mt-8 px-10 py-3 bg-black text-white border border-black/10 rounded-none text-[10px] font-black tracking-widest uppercase hover:bg-[#367F4D] transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 shadow-sm">
                 {content.filter.cta}
              </button>
           </Link>
        </div>

        <Sticker rotate={12} className="bottom-12 right-12 opacity-0 group-hover:opacity-100 transition-all duration-500 border border-black/5 shadow-sm" color="#8CADD8" variant="solid">
           {content.filter.sticker}
        </Sticker>
      </motion.div>

    </section>
  );
}
