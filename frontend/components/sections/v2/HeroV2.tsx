"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sticker } from "@/components/ui/sticker";
import { siteContent } from "@/lib/content";

/**
 * SECTION 1: HERO BENTO
 * Key text items imported from @/lib/content:
 * - badge, headlineMain, headlineJoy, description, cta, backgroundText, stickers
 */
export function HeroV2() {
  const content = siteContent.hero;

  return (
    <section className="min-h-screen pt-40 pb-20 px-6 relative flex flex-col items-center justify-center overflow-hidden">
      
      {/* Big Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
         <h1 className="text-[30vw] font-black italic tracking-tighter leading-none">{content.backgroundText}</h1>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
         
         <div className="lg:col-span-5 space-y-10 order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-2 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full text-[9px] font-black tracking-[0.4em] text-purple-600 uppercase"
            >
               {content.badge}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter italic leading-[0.75] text-slate-900">
                 {content.headlineMain} <br /> 
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 font-sans not-italic tracking-normal">{content.headlineJoy}</span>
              </h1>
              <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-sm">
                 {content.description}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 pt-4"
            >
               <Link href="/our-coffee">
                  <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest italic shadow-2xl hover:bg-fermion-blue transition-all active:scale-95">
                    {content.cta}
                  </button>
               </Link>
            </motion.div>
         </div>

         <div className="lg:col-span-7 grid grid-cols-6 grid-rows-6 gap-6 h-[650px] relative order-1 lg:order-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="col-span-3 row-span-4 bg-white/20 backdrop-blur-3xl border border-white/50 rounded-[3.5rem] overflow-hidden relative group"
            >
               <div className="absolute inset-0 bg-slate-200/50 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
                    style={{ backgroundImage: "url('https://placehold.co/600x800/e2e8f0/94a3b8?text=Direct+Trade')" }} />
               <Sticker rotate={-6} className="top-8 left-8">{content.stickers.origin}</Sticker>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="col-span-3 row-span-3 bg-white/20 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] overflow-hidden relative group"
            >
               <div className="absolute inset-0 bg-purple-100/30 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                    style={{ backgroundImage: "url('https://placehold.co/600x400/f3e8ff/a855f7?text=Lab')" }} />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="col-span-2 row-span-2 bg-blue-50/10 backdrop-blur-2xl border border-white/30 rounded-[2rem]" 
            />

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="col-span-4 row-span-3 bg-white/20 backdrop-blur-3xl border border-white/50 rounded-[3rem] relative overflow-hidden group"
            >
               <div className="absolute inset-0 bg-slate-300/40 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                    style={{ backgroundImage: "url('https://placehold.co/600x400/e0f2fe/38bdf8?text=Sensory')" }} />
               <Sticker rotate={12} className="bottom-8 right-8" color="var(--cartoon-yellow)" variant="solid">
                  <span className="p-4 block">{content.stickers.quality}</span>
               </Sticker>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="col-span-1 row-span-1 bg-yellow-50/10 backdrop-blur-md border border-white/20 rounded-[1.5rem]" 
            />
         </div>

      </div>
    </section>
  );
}
