"use client";

import React from "react";
import { Sticker } from "@/components/ui/sticker";
import { siteContent } from "@/lib/content";

/**
 * SECTION 7: ARTISAN FOOTER
 * Key text items imported from @/lib/content:
 * - titleMain, titleSub, socials, navTitle, navLinks, copyright, links, signature
 */
export function FooterV2() {
  const content = siteContent.footer;

  return (
    <footer className="bg-slate-950 pt-20 pb-12 px-6 relative overflow-hidden font-sans">
      {/* Top Border Glow */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-fermion-blue/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12 relative z-10">
        
        {/* Branding & Socials */}
        <div className="space-y-8 text-left">
           <h2 className="text-5xl font-display font-black text-white italic leading-none">
              {content.titleMain} <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fermion-blue to-purple-400 not-italic font-sans">{content.titleSub}</span>
           </h2>
           
           <div className="flex flex-wrap gap-3">
              {content.socials.map((social, idx) => (
                <div key={idx} className="p-1 bg-white rotate-[-3deg] shadow-lg even:rotate-[5deg]">
                   <div className="border border-dashed border-slate-200 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-fermion-blue transition-colors">
                     {social}
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Quick Links */}
        <div className="flex gap-20 text-right pb-2">
           <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">{content.navTitle}</p>
              <ul className="space-y-2 text-white text-xs font-black uppercase italic tracking-widest">
                 {content.navLinks.map((link, idx) => (
                   <li key={idx} className="hover:text-fermion-blue transition-colors cursor-pointer">{link}</li>
                 ))}
              </ul>
           </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em]">
           {content.copyright}
        </p>
        <div className="flex gap-8">
           {content.links.map((link, idx) => (
             <p key={idx} className="text-[8px] font-black text-slate-700 hover:text-slate-400 uppercase tracking-widest cursor-pointer transition-colors">{link}</p>
           ))}
        </div>
      </div>

      {/* Signature Sticker - Moved to Bottom Right for balance */}
      <Sticker rotate={12} className="hidden lg:block bottom-8 right-8" variant="dashed">
        {content.signature}
      </Sticker>

    </footer>
  );
}
