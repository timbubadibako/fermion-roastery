"use client";

import React, { useState, useEffect, memo } from "react";
import { useI18n } from "@/lib/i18n";
import { PartnerCard } from "./PartnerCard";

/**
 * SECTION 2: PARTNER RIBBON
 */

// Move constants outside to prevent re-allocation on every render
const partnerBgColors: Record<string, string> = {
  'dewata': '#1d3e26',
  'lilla': '#000000',
  'elvizo' : '#ebebeb',
};

const staticPartners = [
  { id: 'dewata', name: 'Dewata', url: '/dewata-partner.jpeg', scale: 1.5 },
  { id: 'domo', name: 'Domo', url: '/domo-partner.jpeg', scale: 1.7 },
  { id: 'elvizo', name: 'Elvizo', url: '/elvizo-partner.jpeg', scale: 1.2 },
  { id: 'go', name: 'Go', url: '/go-partner.jpeg', scale: 1.5 },
  { id: 'lilla', name: 'Lilla', url: '/lilla-partner.jpeg', scale: 1 },
  { id: 'littleheaven', name: 'Little Heaven', url: '/littleheaven-partner.jpeg', scale: 1.5 },
  { id: 'depanteras', name: 'Depan Teras', url: '/depanteras-partner.jpeg', scale: 2 },
  { id: 'lovu', name: 'Lovu', url: '/lovu-cafe-partner.jpeg', scale: 1.5 },
];

function PartnerRibbonComponent() {
  const [isScrolling, setIsScrolling] = useState(false);
  const t = useI18n();
  const content = t.landing.partnerRibbon;

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

  const renderPartners = () => {
    return staticPartners.map((p) => (
      <PartnerCard 
        key={p.id} 
        url={p.url} 
        name={p.name} 
        bgColor={partnerBgColors[p.id] || 'white'} 
        imageScale={p.scale}
      />
    ));
  };

  return (
    <section className={`py-6 md:py-8 bg-white relative z-30 overflow-hidden border-b border-black/5 ${isScrolling ? "pointer-events-none" : ""}`}>
      
      {/* Header Badge */}
      <div className="text-center mb-4 px-4">
        <span className="inline-block px-4 py-1.5 bg-[#FAF9F6] border border-black/10 rounded-sm text-[9px] font-black uppercase tracking-[0.35em] text-stone-500 shadow-sm">
          {content.placeholder || "DIPERCAYA OLEH KAFE & PARTNER B2B PILIHAN"}
        </span>
      </div>

      {/* Edge Gradient Fade Masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-20" />

      {/* Infinite Scrolling Ticker */}
      <div className="flex overflow-hidden opacity-100 transition-opacity duration-700 py-2 md:py-3">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes ribbonScroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .ribbon-container {
            display: flex;
            width: max-content;
            animation: ribbonScroll 35s linear infinite;
            will-change: transform;
          }
          .ribbon-container:hover {
            animation-play-state: paused;
          }
        `}} />
        
        <div className="ribbon-container">
          {/* First Set */}
          <div className="flex gap-0 items-center px-0">
            {renderPartners()}
          </div>
          {/* Second Set (Duplicate for seamless loop) */}
          <div className="flex gap-0 items-center px-0">
            {renderPartners()}
          </div>
        </div>
      </div>

      {/* Bottom Subtle Border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-black/5" />
    </section>
  );
}

export const PartnerRibbon = memo(PartnerRibbonComponent);
