"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sticker } from "@/components/ui/sticker";
import { useI18n } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION 3: SERIES SELECTION (50/50 SPLIT WITH REAL COFFEE PHOTOGRAPHY & GSAP REVEAL)
 * High-craft split layout between Espresso Series and Filter Series with real photo overlays
 */
export function Series() {
  const t = useI18n();
  const content = t.landing.series;
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".series-panel", {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 1.0,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`flex flex-col lg:flex-row min-h-[550px] lg:min-h-[750px] relative group/section z-40 overflow-hidden ${isScrolling ? "pointer-events-none" : ""}`}
    >
      
      {/* Espresso Series Panel (Dark Coffee Roast Theme with Rich Espresso Extraction Photo Overlay) */}
      <motion.div 
        whileHover={{ flex: 1.35 }}
        style={{ willChange: "flex, transform" }}
        className="series-panel flex-1 bg-[#14110F] text-white flex flex-col justify-between p-12 md:p-20 relative overflow-hidden group transition-[flex,transform] duration-700 ease-out border-r border-black/20 min-h-[480px] lg:min-h-[750px]"
      >
        {/* Real Espresso Extraction Photography Background Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=1200&q=80"
            alt="Rich Golden Espresso Extraction with Crema"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14110F] via-[#14110F]/70 to-transparent" />
        </div>

        <div className="relative z-10 space-y-4 max-w-md">
          <span className="px-3.5 py-1.5 bg-[#F1B941] text-black text-[9px] font-black uppercase tracking-widest rounded-sm inline-block shadow-sm">
            ESPRESSO SERIES
          </span>
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black text-white uppercase tracking-tight leading-[0.95] relative">
            Espresso<br />
            <span className="font-display italic font-normal normal-case text-[#F1B941]">Series.</span>
          </h3>
          <p className="text-stone-300 text-xs font-medium leading-relaxed pt-2">
            {content.espresso.subtitle}
          </p>
        </div>

        <div className="relative z-10 pt-8">
          <Link href="/our-coffee?type=espresso">
            <button className="px-8 py-4 bg-white text-black rounded-full text-[10px] font-black tracking-[0.25em] uppercase hover:bg-[#F1B941] transition-all duration-300 active:scale-95 shadow-xl">
              {content.espresso.cta} ➔
            </button>
          </Link>
        </div>

        <Sticker rotate={-8} className="top-10 right-10 opacity-0 group-hover:opacity-100 transition-all duration-500 border border-black/10 shadow-md" color="#F1B941" variant="solid">
          {content.espresso.sticker}
        </Sticker>
      </motion.div>

      {/* Filter Series Panel (Warm Paper Theme with V60 Pour-Over Coffee Photo Overlay) */}
      <motion.div 
        whileHover={{ flex: 1.35 }}
        style={{ willChange: "flex, transform" }}
        className="series-panel flex-1 bg-[#FAF9F6] text-slate-900 flex flex-col justify-between p-12 md:p-20 relative overflow-hidden group transition-[flex,transform] duration-700 ease-out min-h-[480px] lg:min-h-[750px]"
      >
        {/* Real Filter Pour-Over Coffee Photography Background Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
            alt="Manual Pour-Over V60 Filter Coffee"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover opacity-25 group-hover:scale-105 group-hover:opacity-35 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/75 to-transparent" />
        </div>

        <div className="relative z-10 space-y-4 max-w-md">
          <span className="px-3.5 py-1.5 bg-[#367F4D] text-white text-[9px] font-black uppercase tracking-widest rounded-sm inline-block shadow-sm">
            FILTER SERIES
          </span>
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black text-slate-900 uppercase tracking-tight leading-[0.95] relative">
            Filter<br />
            <span className="font-display italic font-normal normal-case text-[#367F4D]">Series.</span>
          </h3>
          <p className="text-stone-600 text-xs font-medium leading-relaxed pt-2">
            {content.filter.subtitle}
          </p>
        </div>

        <div className="relative z-10 pt-8">
          <Link href="/our-coffee?type=filter">
            <button className="px-8 py-4 bg-slate-900 text-white rounded-full text-[10px] font-black tracking-[0.25em] uppercase hover:bg-[#367F4D] transition-all duration-300 active:scale-95 shadow-xl">
              {content.filter.cta} ➔
            </button>
          </Link>
        </div>

        <Sticker rotate={8} className="top-10 right-10 opacity-0 group-hover:opacity-100 transition-all duration-500 border border-black/10 shadow-md" color="#367F4D" variant="solid">
          {content.filter.sticker}
        </Sticker>
      </motion.div>

    </section>
  );
}
