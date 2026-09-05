"use client";

import React, { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { Sticker } from "@/components/ui/sticker";
import { PlasterTape } from "@/components/ui/plaster-tape";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/hooks/use-mobile";

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION 7: ARTISAN FOOTER (Dark Scrapbook)
 */
export function Footer() {
  const isMobile = useIsMobile();
  const t = useI18n();
  const content = t.landing.footer;
  const footerRef = useRef<HTMLElement>(null);

  // Smooth zigzag on mobile
  const footerClip = isMobile
    ? "polygon(0 1%, 100% 0%, 100% 100%, 0 100%)"
    : "polygon(0 3%, 5% 0%, 15% 2%, 25% 0%, 35% 3%, 45% 0%, 55% 2%, 65% 0%, 75% 3%, 85% 0%, 95% 2%, 100% 0%, 100% 100%, 0 100%)";
  
  useEffect(() => {
    const ctx = gsap.context(() => {
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
      className="w-full bg-[#1A202C] text-[#E2DACB] pt-10 sm:pt-12 md:pt-16 pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6 font-sans relative z-60 -mt-8 overflow-hidden"
      style={{
        // Torn paper edge effect for the top border
        clipPath: footerClip
      }}
    >
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("/textures/grain-noise.svg")' }}></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16 relative z-10">
        
        {/* Brand Statement - Scrapbook Note Style */}
        <div className="md:col-span-1 space-y-4 md:space-y-6 relative footer-reveal">
          <div className="bg-[#2D3748] p-5 sm:p-6 md:p-8 border border-white/10 shadow-[6px_6px_0px_rgba(0,0,0,0.2)] rotate-[-1.5deg] relative">
            {/* Patterned Plaster Tape */}
            <PlasterTape width={80} height={24} rotate={4} pattern="cross" className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20" />
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black tracking-tight leading-[0.95] text-white uppercase relative z-10">
              {content.statementTop}<br />
              <span className="text-[#8CADD8]">{content.statementMiddle}</span><br />
              <span className="italic font-display text-fermion-coral text-3xl sm:text-4xl md:text-5xl inline-block mt-0.5">{content.statementAccent}</span>
            </h2>
            
            <p className="mt-3 md:mt-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#E2DACB]/60 border-l-2 border-fermion-coral pl-2.5">
              {content.statementNote}
            </p>
          </div>
        </div>

        {/* Dynamic Link Groups */}
        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 pt-0 md:pt-4">
          {[
            { title: content.groups.roastery, links: [{ name: content.links.ourCoffee, url: "/our-coffee" }, { name: content.links.wholesale, url: "/wholesale" }] },
            { title: content.groups.knowledge, links: [{ name: content.links.journal, url: "/journal" }, { name: content.links.faq, url: "/#faq" }] },
            { title: content.groups.contact, links: [
                { name: content.links.maps, url: "https://maps.app.goo.gl/of51q75TqzTckWfV8" },
                { name: content.links.whatsapp, url: "https://wa.me/628" }
            ]},
            { title: content.groups.support, links: [{ name: content.links.admin, url: "/admin" }] },
            { title: content.groups.social, links: [{ name: content.links.instagram, url: "https://instagram.com/fermionroastery" }] },
          ].map((group, idx) => (
            <div key={idx} className="space-y-3 md:space-y-6 footer-reveal" style={{ transform: `rotate(${idx % 2 === 0 ? 1 : -1}deg)` }}>
              <div className="inline-block border-b-2 border-fermion-gold/50 pb-1">
                <h3 className="text-[10px] sm:text-[11px] font-black tracking-widest text-white uppercase">{group.title}</h3>
              </div>
              <ul className="space-y-2.5 md:space-y-4 text-xs text-[#E2DACB]/80 font-medium">
                {group.links.map((link: {name: string, url: string}, i: number) => (
                  <li key={i}>
                    <a href={link.url} className="hover:text-fermion-coral hover:italic transition-all uppercase tracking-wider text-[11px] sm:text-xs inline-block hover:translate-x-1">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-6 md:mt-8 pt-6 md:pt-8 border-t-2 border-[#2D3748] border-dashed flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 relative footer-reveal">
          <div className="relative bg-white/10 p-2 backdrop-blur-sm rotate-3 md:rotate-6 border border-white/20">
            <Image src="/fermion-logo.png" alt="Fermion Logo" width={90} height={28} style={{ width: "auto", height: "auto" }} className="max-h-7 object-contain" />
          </div>
          
          <div className="relative text-center md:text-right">
            <p className="text-[9px] sm:text-[10px] text-[#E2DACB]/50 font-bold tracking-widest uppercase">
              {content.copyright}
            </p>
            <p className="text-lg sm:text-2xl md:text-3xl font-display font-black italic tracking-wider text-[#E2DACB]/20 mt-1 md:mt-2 uppercase">
              {content.signature}
            </p>
          </div>
      </div>
    </footer>
  );
}
