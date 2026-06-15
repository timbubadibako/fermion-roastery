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
    <section className="py-10 border-y border-slate-100 bg-white/50 backdrop-blur-sm relative z-20 overflow-hidden">
      <div className="flex">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex gap-16 items-center whitespace-nowrap pr-16"
        >
          {renderPartners()}
        </motion.div>

        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex gap-16 items-center whitespace-nowrap pr-16"
        >
          {renderPartners()}
        </motion.div>
      </div>
    </section>
  );
}
