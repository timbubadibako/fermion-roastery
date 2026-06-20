"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

export function HeroV2() {
  const [settings, setSettings] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  
  const t = useI18n();
  const fallbackContent = t.landing.hero;

  const words = ["CURATED", "ROASTED", "REVERED"];

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setSettings(data))
      .catch(err => console.error("Failed to load hero settings", err));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let ctx: gsap.Context;

    const initGSAP = () => {
      ctx = gsap.context(() => {
        // 1. Main GSAP Timeline - Time-based, not scroll-based
        const mainTl = gsap.timeline({
          defaults: { ease: "none" }
        });

        // 2. Video Playback - Play video automatically
        // Set video to play, but don't bind it strictly to a duration in the timeline for the curtain
        mainTl.to(video, {
          currentTime: video.duration || 1,
          duration: 10, // Let video play for longer
          ease: "none",
          force3D: true
        }, 0);

        // 3. Persistent Typewriter Logic
        words.forEach((word, wordIdx) => {
          const charSelector = `.word-${wordIdx} .char`;
          const chars = gsap.utils.toArray(charSelector);
          const segmentStart = 0.2 + (wordIdx * 0.8); // Slower stagger between words

          mainTl.to(chars, {
            opacity: 1,
            stagger: 0.08, // Slower stagger within words
            duration: 0.1,
            force3D: true
          }, segmentStart);
        });

        // 4. THE PAPER CURTAIN RISE - Fixed delay, independent of video progress
        mainTl.to(curtainRef.current, {
          y: "0%",
          duration: 0.6,
          ease: "power2.inOut",
          force3D: true
        }, 2.5); // Slightly later rise

        // 5. Final Reveal
        mainTl.from(".hero-final-reveal", {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: "power2.out",
          force3D: true
        }, "<+=0.1"); // Trigger almost immediately after curtain starts rising
      }, containerRef.current || undefined);
    };

    if (video.readyState >= 1) {
      initGSAP();
    } else {
      video.addEventListener('loadedmetadata', initGSAP);
    }

    return () => {
      video.removeEventListener('loadedmetadata', initGSAP);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-black h-screen">
      
      {/* Background Cinematic Video Area */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          style={{ willChange: "contents" }}
        >
          <source src="/watermarked_preview.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_85%)] pointer-events-none" />
      </div>

      {/* THE PAPER CURTAIN - Midnight Navy */}
      <div 
        ref={curtainRef}
        className="absolute inset-0 bg-[#111827] z-[15] translate-y-[100%]"
        style={{ 
          boxShadow: "0 -20px 50px rgba(0,0,0,0.4)",
          willChange: "transform"
        }}
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />
      </div>

      {/* Hero Content Overlay */}
      <section className="relative h-full flex flex-col justify-center items-center px-6 text-center z-20">
        
        {/* Central Label Mask */}
        <div className="relative flex items-center justify-center min-h-[450px] w-full translate-y-10">
           
           <div className="relative w-[90%] max-w-4xl min-h-[350px]">
              {/* Base card (stack) */}
              <div className="absolute inset-0 bg-[#E2DACB] border border-black/5 rotate-[1deg] shadow-sm"></div>
              
              {/* Main card */}
              <div className="absolute inset-0 bg-[#FDFBF7] border border-black/10 shadow-[10px_10px_0px_rgba(0,0,0,0.05)] rotate-[-1deg] flex flex-col items-center justify-center p-12">
                 
                 {/* Masking tape - positioned absolutely on top */}
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-50 w-24 h-8 bg-white/50 border border-black/5 rotate-[-2deg] backdrop-blur-sm shadow-sm"></div>
                 
                 <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #367F4D 1px, transparent 1px), linear-gradient(to bottom, #367F4D 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                 {/* Vertical Stack Typewriter Container */}
                 <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-6">
                    {words.map((word, wordIdx) => (
                      <div key={wordIdx} className={`word-${wordIdx} flex items-center justify-center gap-1 md:gap-3`}>
                        {word.split('').map((char, charIdx) => (
                            <span key={charIdx} className="char opacity-0 text-5xl md:text-7xl font-display font-black italic tracking-tighter text-slate-900 uppercase leading-none inline-block">
                              {char}
                            </span>
                        ))}
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Final CTA Area */}
        <div className="hero-final-reveal mt-12 space-y-8 relative z-30">
          <p className="text-[#8CADD8] font-black uppercase tracking-[0.5em] text-[10px]">
            {fallbackContent.subtitle}
          </p>
          
          <div className="flex justify-center gap-6">
             <Link href="/our-coffee">
                <button className="bg-[#F1B941] text-black px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all active:scale-95 shadow-2xl">
                  {fallbackContent.cta_primary}
                </button>
             </Link>
          </div>
        </div>

      </section>

      <div className="absolute bottom-0 left-0 w-full h-px bg-black/5 z-40" />
    </div>
  );
}
