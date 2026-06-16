"use client";

import React from "react";
import { motion } from "framer-motion";
import { siteContent } from "@/lib/content";
import { PartnerCard } from "./PartnerCard";

/**
 * SECTION 2: PARTNER RIBBON
 */
export function PartnerRibbonV2() {
  const content = siteContent.partnerRibbon;
  
  // Mapping of partner IDs to their desired background colors
  const partnerBgColors: Record<string, string> = {
    'dewata': '#1d3e26', // Example dark green for Dewata
    'lilla': '#000000',  // Example black for Lilla
    'elvizo' : '#ebebeb',
    // Add more as needed
  };

  const staticPartners = [
    { id: 'dewata', name: 'Dewata', url: '/dewata-partner.jpeg' },
    { id: 'domo', name: 'Domo', url: '/domo-partner.jpeg' },
    { id: 'elvizo', name: 'Elvizo', url: '/elvizo-partner.jpeg' },
    { id: 'go', name: 'Go', url: '/go-partner.jpeg' },
    { id: 'lilla', name: 'Lilla', url: '/lilla-partner.jpeg' },
    { id: 'littleheaven', name: 'Little Heaven', url: '/littleheaven-partner.jpeg' },
  ];

  const renderPartners = () => {
    // For static partners, we use the config map
    return staticPartners.map((p) => (
      <PartnerCard 
        key={p.id} 
        url={p.url} 
        name={p.name} 
        bgColor={partnerBgColors[p.id] || 'white'} 
      />
    ));
  };

  return (
    <section className="py-12 bg-[#FAF9F6] relative z-30 overflow-hidden border-y-2 border-dashed border-black/5">
      {/* Label for the ribbon */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40">
         <div className="bg-white px-3 py-1 border border-black/10 shadow-sm rounded-sm text-[8px] font-black uppercase tracking-[0.3em] text-stone-400 rotate-[-1deg]">
           Trusted Laboratory Partners
         </div>
      </div>

      <div className="flex overflow-hidden opacity-100 transition-opacity duration-700">
        <motion.div 
          animate={{ x: "-50%" }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex w-max"
        >
          {/* First Set */}
          <div className="flex gap-20 items-center px-10">
            {renderPartners()}
          </div>
          {/* Second Set (Duplicate for seamless loop) */}
          <div className="flex gap-20 items-center px-10">
            {renderPartners()}
          </div>
        </motion.div>
      </div>

      {/* Subtle bottom shadow to separate from Series */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-black/5"></div>
    </section>
  );
}
