"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sticker } from "@/components/ui/sticker";
import { siteContent } from "@/lib/content";

/**
 * SECTION 4: THE FERMION WAY (COLLAGE)
 * Key text items imported from @/lib/content:
 * - titleMain, titleSub, description, pillars, stickers
 */
export function TheWayV2() {
  const content = siteContent.theWay;
  
  // Layout coordinates preserved from v4.1
  const layout = [
    { top: 0, left: "5%", rotate: -5 },
    { top: 120, left: "38%", rotate: 3, zIndex: 10 },
    { top: 40, right: "8%", rotate: -3 },
    { top: 420, left: "12%", rotate: 4 },
    { top: 480, left: "45%", rotate: -2, zIndex: 10 },
    { top: 400, right: "10%", rotate: 6 },
  ];

  return (
    <section className="max-w-7xl mx-auto pt-60 pb-0 px-6 relative">
      
      <div className="text-center space-y-6 mb-32">
        <h2 className="text-7xl md:text-8xl font-display font-black tracking-tighter uppercase italic leading-[0.8]">
          {content.titleMain} <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fermion-lavender to-fermion-horizon not-italic font-sans">{content.titleSub}</span>
        </h2>
        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">{content.description}</p>
      </div>

      <div className="relative min-h-[650px] w-full hidden lg:block">
        {content.pillars.map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30, rotate: layout[idx].rotate }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.8 }}
            whileHover={{ 
              zIndex: 60, 
              rotate: 0, 
              y: -20,
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.85)" 
            }}
            className="absolute w-[300px] p-10 bg-white/25 backdrop-blur-[40px] border border-white/50 shadow-2xl rounded-[3rem] cursor-help transition-colors duration-500"
            style={{ 
              top: layout[idx].top, 
              left: layout[idx].left, 
              right: layout[idx].right, 
              zIndex: layout[idx].zIndex || 10,
            }}
          >
             <p className="text-[2.5rem] font-display font-black italic opacity-10 absolute top-4 right-8">{p.id}</p>
             <h4 className="text-lg font-black uppercase tracking-widest mb-2 text-slate-900">{p.title}</h4>
             <p className="text-sm text-slate-500 leading-relaxed italic">{p.desc}</p>
          </motion.div>
        ))}

        <Sticker rotate={15} className="top-[300px] left-[25%]">{content.stickers.lab}</Sticker>
        <Sticker rotate={-12} color="var(--cartoon-pink)" className="bottom-[150px] right-[28%]">{content.stickers.map}</Sticker>
      </div>

      {/* Mobile Stack */}
      <div className="flex flex-col items-center gap-10 lg:hidden">
        {content.pillars.map((p) => (
          <div key={p.id} className="w-full max-w-sm p-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] relative">
             <p className="text-3xl font-display font-black italic opacity-10 absolute top-4 right-6">{p.id}</p>
             <h4 className="text-base font-black uppercase tracking-widest mb-1">{p.title}</h4>
             <p className="text-sm text-slate-500 italic">{p.desc}</p>
          </div>
        ))}
      </div>

    </section>
  );
}
