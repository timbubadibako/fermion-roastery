"use client";

import React from "react";
import { motion } from "framer-motion";
import { siteContent } from "@/lib/content";

/**
 * SECTION 2: PARTNER RIBBON
 * Key text items imported from @/lib/content:
 * - placeholder (labels for dashed cafe partner boxes)
 */
export function PartnerRibbonV2() {
  const content = siteContent.partnerRibbon;
  const partners = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <section className="py-10 border-y border-slate-100 bg-white/50 backdrop-blur-sm relative z-20 overflow-hidden">
      <div className="flex">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex gap-12 items-center whitespace-nowrap pr-12"
        >
          {partners.map((p) => (
            <div key={p} className="w-48 h-20 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center text-[9px] font-black text-slate-300 tracking-[0.4em] uppercase hover:border-fermion-french-blue hover:text-fermion-french-blue transition-colors cursor-help">
              {content.placeholder}
            </div>
          ))}
        </motion.div>

        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex gap-12 items-center whitespace-nowrap pr-12"
        >
          {partners.map((p) => (
            <div key={`dup-${p}`} className="w-48 h-20 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center text-[9px] font-black text-slate-300 tracking-[0.4em] uppercase hover:border-fermion-french-blue hover:text-fermion-french-blue transition-colors cursor-help">
              {content.placeholder}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
