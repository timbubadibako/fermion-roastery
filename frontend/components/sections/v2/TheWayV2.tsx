"use client";

import React, { useEffect, useRef } from "react";
import { siteContent } from "@/lib/content";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sticker } from "@/components/ui/sticker";

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION 4: THE FERMION WAY (SCRAPBOOK AESTHETIC)
 * Redesigned with a "Freedom Scrapbook" vibe, using cream/pastel background
 * and paper-like elements scattered dynamically.
 */
export function TheWayV2() {
  const content = siteContent.theWay;
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // More chaotic, scrapbook-like placement
  const layout = [
    { top: "5%", left: "2%", rotate: -8, zIndex: 10, bg: "bg-[#FFFDF9]", tape: "top-[-10px] left-[50%] rotate-[15deg]" },
    { top: "15%", left: "35%", rotate: 6, zIndex: 20, bg: "bg-[#F3EDE2]", tape: "top-[-5px] right-[-15px] rotate-[-20deg]" },
    { top: "2%", right: "5%", rotate: -3, zIndex: 15, bg: "bg-[#FAFAFA]", tape: "top-[-12px] left-[40%] rotate-[5deg]" },
    { top: "45%", left: "10%", rotate: 12, zIndex: 12, bg: "bg-[#F0F2F5]", tape: "bottom-[-10px] left-[20%] rotate-[-10deg]" },
    { top: "50%", left: "40%", rotate: -5, zIndex: 25, bg: "bg-[#FFFDF9]", tape: "top-[40%] right-[-10px] rotate-[80deg]" },
    { top: "35%", right: "8%", rotate: 9, zIndex: 18, bg: "bg-[#EAE4DC]", tape: "top-[-5px] left-[30%] rotate-[-5deg]" },
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Parallax effect on the paper notes
      const notes = gsap.utils.toArray<HTMLElement>('.scrapbook-note');
      
      notes.forEach((note, i) => {
        gsap.fromTo(note, 
          { y: 100, opacity: 0, rotate: layout[i].rotate + (Math.random() * 10 - 5) },
          {
            y: 0,
            opacity: 1,
            rotate: layout[i].rotate,
            duration: 1.2,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
              end: "center center",
              scrub: 1,
            }
          }
        );
      });

      // Title reveal
      gsap.from(".scrapbook-title", {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [layout]);

  return (
    <section 
      ref={sectionRef} 
      className="relative z-10 w-full pt-32 pb-40 overflow-hidden bg-[#E2DACB]" // Base Cream/Pastel background for the Zig-Zag flow
    >
      {/* Decorative Texture/Noise over the background */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="mb-24 md:ml-12 scrapbook-title relative inline-block">
          {/* Rough underline effect */}
          <div className="absolute -bottom-4 left-0 w-full h-4 bg-fermion-gold/40 -rotate-1 z-0"></div>
          <h2 className="text-6xl md:text-8xl font-cloude text-[#1A202C] relative z-10 leading-[0.9]">
            {content.titleMain} <br /> 
            <span className="font-display italic text-[#3B4252]">{content.titleSub}</span>
          </h2>
          <p className="mt-6 text-[#4A5568] font-bold uppercase tracking-[0.3em] text-xs font-sans max-w-sm">
            {content.description}
          </p>
        </div>

        <div ref={containerRef} className="relative min-h-[700px] w-full hidden lg:block mt-12">
          {content.pillars.map((p, idx) => (
            <div
              key={p.id}
              className={`scrapbook-note absolute w-[280px] p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.05)] border border-black/5 hover:z-50 transition-transform duration-300 hover:scale-105 cursor-pointer ${layout[idx].bg}`}
              style={{ 
                top: layout[idx].top, 
                left: layout[idx].left, 
                right: layout[idx].right, 
                zIndex: layout[idx].zIndex,
                // Ragged edge approximation
                borderRadius: `4px 8px 3px 6px`
              }}
            >
               {/* Masking tape effect */}
               <div className={`absolute w-16 h-6 bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm opacity-80 z-20 ${layout[idx].tape}`}></div>
               
               <p className="text-[3.5rem] font-cloude text-black/10 absolute -top-4 right-4">{p.id}</p>
               
               <h4 className="text-xl font-display font-black uppercase tracking-wide mb-3 text-black relative z-10">{p.title}</h4>
               
               {/* Squiggly line separator */}
               <svg className="mb-4 w-16 opacity-30" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
                 <path d="M 0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5" stroke="currentColor" fill="transparent" strokeWidth="2" strokeLinecap="round" />
               </svg>

               <p className="text-sm text-black/70 leading-relaxed font-sans font-medium">{p.desc}</p>
            </div>
          ))}

          <Sticker rotate={22} className="top-[300px] left-[25%] shadow-sm border border-black/10">{content.stickers.lab}</Sticker>
          <Sticker rotate={-15} color="#FFB6C1" className="bottom-[100px] right-[25%] shadow-sm border border-black/10">{content.stickers.map}</Sticker>
        </div>

        {/* Mobile Stack - Also themed as cards */}
        <div className="flex flex-col items-center gap-8 lg:hidden">
          {content.pillars.map((p, idx) => (
            <div key={p.id} className={`w-full max-w-sm p-8 shadow-[6px_6px_0px_rgba(0,0,0,0.05)] border border-black/5 relative ${layout[idx].bg}`}
              style={{
                transform: `rotate(-1deg)`,
                borderRadius: '4px 8px 3px 6px'
              }}
            >
               <div className="absolute top-[-10px] left-[50%] -translate-x-1/2 w-12 h-4 bg-white/50 border border-black/5 rotate-2"></div>
               <p className="text-4xl font-cloude text-black/10 absolute top-2 right-4">{p.id}</p>
               <h4 className="text-lg font-display font-black uppercase tracking-widest mb-2">{p.title}</h4>
               <p className="text-sm text-black/70 font-medium">{p.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
