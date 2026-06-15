"use client";

import React from "react";
import { siteContent } from "@/lib/content";
import { Sticker } from "@/components/ui/sticker";

/**
 * SECTION 7: ARTISAN FOOTER
 */
export function FooterV2() {
  const content = siteContent.footer;

  return (
    <footer className="w-full bg-black text-white py-20 px-6 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        
        {/* Brand Statement */}
        <div className="md:col-span-1 space-y-6 relative">
          <h2 className="text-3xl font-black leading-tight tracking-tighter italic text-gray-200 relative z-10">
            CRAFTED FOR<br />
            THE CURIOUS.
          </h2>
          {/* Sticker di bawah Crafted - Vibrant Pink */}
          <Sticker rotate={-15} className="top-16 -left-4 hidden lg:block scale-90" color="#f472b6" variant="dashed">
            100% ARTISAN
          </Sticker>
        </div>

        {/* Dynamic Link Groups based on siteContent */}
        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-5 gap-8">
          {[
            { title: "ROASTERY", links: ["Our Coffee", "B2B Wholesale", "Calibration"] },
            { title: "KNOWLEDGE", links: ["Journal", "Brew Guides", "Our Story"] },
            { title: "SUPPORT", links: ["FAQ", "Contact", "Feedback"] },
            { title: "LEGAL", links: ["Privacy", "Terms", "Shipping"] },
            { title: "FOLLOW US", links: content.socials },
          ].map((group, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{group.title}</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                {group.links.map((link: string, i: number) => (
                  <li key={i}><a href="#" className="hover:text-white transition-colors uppercase tracking-wider text-xs">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex justify-between items-center gap-4 relative">
          <div className="relative">
            <img src="/fermion-logo.png" alt="Fermion Logo" className="h-8 invert" />
          </div>
          <div className="relative">
            <p className="text-[10px] text-gray-500 tracking-widest uppercase">
              {content.copyright}
            </p>
            {/* Sticker di kanan bawah dekat copyright - Vibrant Blue */}
            <Sticker rotate={15} className="-top-12 -right-8 hidden lg:block scale-90" color="#60a5fa" variant="solid">
              ENGINEERED JOY
            </Sticker>
          </div>
      </div>
    </footer>
  );
}
