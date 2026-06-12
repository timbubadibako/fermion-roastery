"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sticker } from "@/components/ui/sticker";
import { siteContent } from "@/lib/content";

/**
 * SECTION 3: SERIES SELECTION
 * Key text items imported from @/lib/content:
 * - espresso { title, subtitle, cta, sticker }
 * - filter { title, subtitle, cta, sticker }
 */
export function SeriesV2() {
  const content = siteContent.series;

  return (
    <section className="flex flex-col lg:flex-row min-h-[600px] border-b border-slate-100 relative group/section">
      
      {/* Espresso Panel */}
      <motion.div 
        whileHover={{ flex: 1.5 }}
        className="flex-1 bg-slate-950 flex items-center justify-center p-20 relative overflow-hidden group transition-all duration-1000 ease-out"
      >
        <div className="text-center space-y-6 z-10 transition-transform duration-700 group-hover:scale-105">
           <h3 className="text-6xl md:text-8xl font-display font-black italic text-white leading-[0.85]">
             Espresso<br/>Series.
           </h3>
           <p className="text-slate-500 text-xs font-black tracking-widest uppercase">{content.espresso.subtitle}</p>
           <Link href="/our-coffee?type=espresso">
              <button className="mt-8 px-10 py-3 bg-white text-slate-900 rounded-full text-[9px] font-black tracking-widest uppercase italic hover:bg-fermion-french-blue hover:text-white transition-all shadow-xl">
                 {content.espresso.cta}
              </button>
           </Link>
        </div>

        <Sticker rotate={-5} className="top-12 left-12 opacity-0 group-hover:opacity-100 transition-all duration-700">
           {content.espresso.sticker}
        </Sticker>

        <div className="absolute inset-0 bg-[url('https://placehold.co/800x600/0f172a/1e293b?text=Espresso')] bg-cover opacity-20" />
      </motion.div>

      {/* Filter Panel */}
      <motion.div 
        whileHover={{ flex: 1.5 }}
        className="flex-1 bg-white flex items-center justify-center p-20 relative overflow-hidden group transition-all duration-1000 ease-out"
      >
        <div className="text-center space-y-6 z-10 transition-transform duration-700 group-hover:scale-105">
           <h3 className="text-6xl md:text-8xl font-display font-black italic text-slate-900 leading-[0.85]">
             Filter<br/>Series.
           </h3>
           <p className="text-slate-400 text-xs font-black tracking-widest uppercase">{content.filter.subtitle}</p>
           <Link href="/our-coffee?type=filter">
              <button className="mt-8 px-10 py-3 bg-slate-900 text-white rounded-full text-[9px] font-black tracking-widest uppercase italic hover:bg-fermion-french-blue transition-all shadow-xl">
                 {content.filter.cta}
              </button>
           </Link>
        </div>

        <Sticker rotate={12} color="var(--cartoon-green)" className="bottom-12 right-12 opacity-0 group-hover:opacity-100 transition-all duration-700">
           {content.filter.sticker}
        </Sticker>

        <div className="absolute inset-0 bg-[url('https://placehold.co/800x600/ffffff/f1f5f9?text=Filter')] bg-cover opacity-10" />
      </motion.div>

    </section>
  );
}
