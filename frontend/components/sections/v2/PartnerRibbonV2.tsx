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
  const [partners, setPartners] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/admin/partners')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const approved = data.filter((p: any) => p.status === 'approved' && p.cafe_logo_url);
        setPartners(approved);
      })
      .catch(() => {});
  }, []);

  const renderPartners = () => {
    if (partners.length === 0) {
      return [1, 2, 3, 4, 5, 6].map((p) => (
        <div key={p} className="w-48 h-20 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center text-[9px] font-black text-slate-300 tracking-[0.4em] uppercase">
          {content.placeholder}
        </div>
      ));
    }
    return partners.map((p) => (
      <div key={p.id} className="w-48 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-700 opacity-60 hover:opacity-100">
        <img src={p.cafe_logo_url} alt={p.company_name} className="max-h-12 max-w-[140px] object-contain" />
      </div>
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
