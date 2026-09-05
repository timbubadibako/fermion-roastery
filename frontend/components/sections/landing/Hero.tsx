"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

const HERO_WORDS = ["CURATED", "ROASTED", "REVERED"];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const [canEnhanceHero, setCanEnhanceHero] = useState(false);

  const t = useI18n();
  const fallbackContent = t.landing.hero;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setCanEnhanceHero(isDesktop && !prefersReducedMotion);
  }, []);

  useEffect(() => {
    if (!canEnhanceHero) return;
    if (!containerRef.current || !curtainRef.current) return;

    let mounted = true;
    let cleanup: (() => void) | undefined;

    const timer = setTimeout(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (!mounted || !containerRef.current || !curtainRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const mainTl = gsap.timeline({
          defaults: { ease: "none" },
        });

        HERO_WORDS.forEach((word, wordIdx) => {
          const chars = gsap.utils.toArray(`.word-${wordIdx} .char`);
          mainTl.to(
            chars,
            {
              opacity: 1,
              stagger: 0.08,
              duration: 0.1,
              force3D: true,
            },
            0.2 + wordIdx * 0.8
          );
        });

        mainTl.to(
          curtainRef.current,
          {
            y: "0%",
            duration: 0.6,
            ease: "power2.inOut",
            force3D: true,
          },
          2.0
        );

      }, containerRef.current);

      cleanup = () => ctx.revert();
    }, 50);

    return () => {
      mounted = false;
      clearTimeout(timer);
      cleanup?.();
    };
  }, [canEnhanceHero]);


  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#0A0D12]">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/hero-video-poster.jpg"
          alt="Roasted coffee beans from Fermion Roastery"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_85%)] pointer-events-none" />
      </div>

      {canEnhanceHero ? (
        <div
          ref={curtainRef}
          className="absolute inset-0 z-[15] translate-y-[100%] bg-[#111827]"
          style={{
            boxShadow: "0 -20px 50px rgba(0,0,0,0.4)",
            willChange: "transform",
          }}
        />
      ) : null}


      <section className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="relative flex min-h-[480px] w-full translate-y-6 items-center justify-center">
          <div className="relative min-h-[380px] w-[94%] max-w-4xl">
            {/* Background Paper Layer 1 (Medium Muted Sage Paper) */}
            <div className="absolute inset-0 rotate-[2.5deg] border border-black/10 bg-[#B8C5B9] shadow-sm rounded-sm" />

            {/* Background Paper Layer 2 (Warm Medium Kraft Paper) */}
            <div className="absolute inset-0 rotate-[-1deg] border border-black/10 bg-[#D9CDB8] shadow-sm rounded-sm" />

            {/* Main Ticket Paper Card */}
            <div className="absolute inset-0 rotate-[-1.5deg] border border-black/10 bg-[#FDFBF7] p-6 md:p-10 shadow-lg md:shadow-[14px_14px_0px_rgba(0,0,0,0.06)] rounded-sm" style={{ transform: "translateZ(0)" }}>
              
              {/* Masking Tape with Micro Text */}
              <div className="absolute -top-5 left-1/2 z-50 flex h-7 w-32 -translate-x-1/2 rotate-[-1deg] items-center justify-center border border-black/5 bg-white/70 px-2 text-[7px] font-black uppercase tracking-[0.25em] text-stone-500 shadow-sm backdrop-blur-sm">
                ROASTERY TICKET
              </div>

              {/* Floating Top Right Badge (Establishment Tag) */}
              <div className="absolute top-4 right-4 hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F6] border border-black/10 text-[8px] font-black uppercase tracking-widest text-slate-800 rounded-sm shadow-sm rotate-[2deg]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#367F4D] animate-pulse"></span>
                <span>SINCE 2024</span>
              </div>

              {/* Floating Bottom Left Badge */}
              <div className="absolute bottom-4 left-4 hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F6] border border-black/10 text-[8px] font-black uppercase tracking-widest text-slate-800 rounded-sm shadow-sm rotate-[-2deg]">
                <span>SPECIALTY GRADE</span>
              </div>

              {/* Grid Background Overlay */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #367F4D 1px, transparent 1px), linear-gradient(to bottom, #367F4D 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-4 md:gap-5 py-4">
                
                {/* Micro Tagline Ribbon */}
                <span className="text-[9px] font-black uppercase tracking-[0.35em] text-[#367F4D]">
                  SPECIALTY COFFEE ROASTERY • INDONESIA
                </span>

                {/* Main Dynamic Words */}
                <div className="space-y-1">
                  {HERO_WORDS.map((word, wordIdx) => (
                    <div
                      key={wordIdx}
                      className={`word-${wordIdx} flex items-center justify-center gap-1 md:gap-3`}
                    >
                      {word.split("").map((char, charIdx) => (
                        <span
                          key={charIdx}
                          className={`char inline-block text-5xl font-display font-black uppercase leading-none tracking-tighter italic md:text-7xl ${
                            word === "ROASTED" ? "text-[#367F4D]" : "text-slate-900"
                          }`}
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Pillar Micro-Pills (Authentic Product Specs) */}
                <div className="flex flex-wrap justify-center items-center gap-2 pt-2 text-[8px] font-black uppercase tracking-widest text-stone-500">
                  <span className="px-2.5 py-1 bg-stone-100 border border-black/5 rounded-full">[ SINGLE ORIGIN ]</span>
                  <span className="px-2.5 py-1 bg-stone-100 border border-black/5 rounded-full">[ SANGRAI SEGAR ]</span>
                  <span className="px-2.5 py-1 bg-stone-100 border border-black/5 rounded-full">[ BIJI & BUBUK ]</span>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="hero-final-reveal relative z-30 mt-10 space-y-8">
          <p className="mx-auto max-w-3xl text-[10px] font-black uppercase tracking-[0.35em] text-[#8CADD8] md:tracking-[0.5em]">
            {fallbackContent.subtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/our-coffee">
              <button className="rounded-full bg-[#F1B941] px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-black shadow-xl transition-all hover:bg-white active:scale-95">
                {fallbackContent.cta_primary} ➔
              </button>
            </Link>
            <Link href="/b2b">
              <button className="rounded-full bg-white/10 border border-white/30 px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white backdrop-blur-sm transition-all hover:bg-white hover:text-slate-900 active:scale-95">
                KEMITRAAN B2B
              </button>
            </Link>
          </div>
        </div>
      </section>

      <div className="absolute bottom-0 left-0 z-40 h-px w-full bg-black/5" />
    </div>
  );
}
