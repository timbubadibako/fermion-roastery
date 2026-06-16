"use client";

import React, { useEffect, useRef } from "react";
import { siteContent } from "@/lib/content";
import { Sticker } from "@/components/ui/sticker";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION 7: ARTISAN FOOTER (Dark Scrapbook)
 */
export function FooterV2() {
  const content = siteContent.footer;
  const footerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".footer-reveal", {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
        }
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer 
      ref={footerRef}
      className="w-full bg-[#1A202C] text-[#E2DACB] pt-32 pb-16 px-6 font-sans relative z-60 -mt-20 overflow-hidden"
      style={{
        // Torn paper edge effect for the top border
        clipPath: "polygon(0 3%, 5% 0%, 15% 2%, 25% 0%, 35% 3%, 45% 0%, 55% 2%, 65% 0%, 75% 3%, 85% 0%, 95% 2%, 100% 0%, 100% 100%, 0 100%)"
      }}
    >
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
        
        {/* Brand Statement - Scrapbook Note Style */}
        <div className="md:col-span-1 space-y-6 relative footer-reveal">
          <div className="bg-[#2D3748] p-8 border border-white/10 shadow-[6px_6px_0px_rgba(0,0,0,0.2)] rotate-[-2deg] relative">
            {/* Tape */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-16 h-4 bg-white/20 border border-white/5 rotate-3"></div>
            
            <h2 className="text-4xl font-cloude leading-[0.9] text-white relative z-10">
              CRAFTED<br />
              <span className="text-[#8CADD8]">FOR THE</span><br />
              <span className="italic font-display text-fermion-coral text-5xl">CURIOUS.</span>
            </h2>
            
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#E2DACB]/60 border-l-2 border-fermion-coral pl-3">
              100% Artisan Roasted
            </p>
          </div>

          <Sticker rotate={-15} className="absolute -bottom-8 -right-8 scale-90 border border-black/10 shadow-sm" color="#f472b6" variant="dashed">
            ENGINEERED JOY
          </Sticker>
        </div>

        {/* Dynamic Link Groups */}
        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-5 gap-8 pt-4">
          {[
            { title: "ROASTERY", links: ["Our Coffee", "B2B Wholesale", "Calibration"] },
            { title: "KNOWLEDGE", links: ["Journal", "Brew Guides", "Our Story"] },
            { title: "SUPPORT", links: ["FAQ", "Contact", "Feedback"] },
            { title: "LEGAL", links: ["Privacy", "Terms", "Shipping"] },
            { title: "FOLLOW US", links: content.socials },
          ].map((group, idx) => (
            <div key={idx} className="space-y-6 footer-reveal" style={{ transform: `rotate(${idx % 2 === 0 ? 1 : -1}deg)` }}>
              <div className="inline-block border-b-2 border-fermion-gold/50 pb-1">
                <h3 className="text-[11px] font-black tracking-widest text-white uppercase">{group.title}</h3>
              </div>
              <ul className="space-y-4 text-sm text-[#E2DACB]/80 font-medium">
                {group.links.map((link: string, i: number) => (
                  <li key={i}>
                    <a href="#" className="hover:text-fermion-coral hover:italic transition-all uppercase tracking-wider text-xs inline-block hover:translate-x-1">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t-2 border-[#2D3748] border-dashed flex flex-col md:flex-row justify-between items-center gap-6 relative footer-reveal">
          <div className="relative bg-white/10 p-2 backdrop-blur-sm rotate-6 border border-white/20">
            <img src="/fermion-logo.png" alt="Fermion Logo" className="h-8 invert" />
          </div>
          
          <div className="relative text-center md:text-right">
            <p className="text-[10px] text-[#E2DACB]/50 font-bold tracking-widest uppercase">
              {content.copyright}
            </p>
            <p className="text-4xl font-cloude text-[#E2DACB]/20 mt-2">
              {content.signature}
            </p>
          </div>
      </div>
    </footer>
  );
}
