"use client";

import React, { useState, useEffect, memo } from "react";
import { siteContent } from "@/lib/content";
import { PartnerCard, PartnerCardProps } from "./PartnerCard";

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

function PartnerRibbonV2Component() {
  const [isScrolling, setIsScrolling] = useState(false);

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
    <section className={`py-12 bg-[#FAF9F6] relative z-30 overflow-hidden border-y-2 border-dashed border-black/5 ${isScrolling ? "pointer-events-none" : ""}`}>
      {/* Label for the ribbon */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40">
         <div className="bg-white px-3 py-1 border border-black/10 shadow-sm rounded-sm text-[6px] font-black uppercase tracking-[0.3em] text-stone-400 rotate-[-1deg]">
           Trusted Laboratory Partners
         </div>
      </div>

      <div className="flex overflow-hidden opacity-100 transition-opacity duration-700">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes ribbonScroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .ribbon-container {
            display: flex;
            width: max-content;
            animation: ribbonScroll 40s linear infinite;
            will-change: transform;
          }
        `}} />
        
        <div className="ribbon-container">
          {/* First Set */}
          <div className="flex gap-20 items-center px-10">
            {renderPartners()}
          </div>
          {/* Second Set (Duplicate for seamless loop) */}
          <div className="flex gap-20 items-center px-10">
            {renderPartners()}
          </div>
        </div>
      </div>

      {/* Subtle bottom shadow to separate from Series */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-black/5"></div>
    </section>
  );
}

export const PartnerRibbonV2 = memo(PartnerRibbonV2Component);
