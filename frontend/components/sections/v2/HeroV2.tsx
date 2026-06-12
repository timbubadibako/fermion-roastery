"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { strings } from "@/lib/strings";

export function HeroV2() {
  const [settings, setSettings] = useState<any>(null);
  
  // Hardcoding language to 'id' for now, can be wired to a context later
  const lang = 'id';
  const fallbackContent = strings[lang].hero;

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Failed to load hero settings", err));
  }, []);

  const title = settings?.hero_title || fallbackContent.title;
  const subtitle = settings?.hero_description || fallbackContent.subtitle;
  const badge = settings?.hero_subtitle || "Exclusive Coffee Roastery";

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-slate-900">
      {/* Cinematic Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/watermarked_preview.mp4" type="video/mp4" />
      </video>

      {/* Scrim Overlay: Linear gradient from black to transparent */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent mix-blend-multiply pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 px-6 max-w-7xl w-full mx-auto">
        <div className="max-w-2xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-[9px] font-black tracking-[0.4em] text-fermion-gold uppercase"
          >
            {badge}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight leading-tight text-white drop-shadow-md">
               {title}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <p className="text-xl md:text-2xl font-sans font-medium text-[var(--color-fermion-horizon)] leading-relaxed drop-shadow-sm max-w-xl">
               {subtitle}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-4 pt-4"
          >
             <Link href="/our-coffee">
                <button className="bg-[var(--color-fermion-gold)] text-[var(--color-fermion-black)] px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform active:scale-95 border-2 border-transparent hover:border-white/20">
                  {fallbackContent.cta_primary}
                </button>
             </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
