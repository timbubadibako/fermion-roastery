"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

const HERO_WORDS = ["CURATED", "ROASTED", "REVERED"];

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const [canEnhanceHero, setCanEnhanceHero] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

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

    const idleWindow = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const scheduleVideoLoad = () => setShouldLoadVideo(true);

    if (typeof idleWindow.requestIdleCallback === "function") {
      const idleId = idleWindow.requestIdleCallback(scheduleVideoLoad, { timeout: 2500 });
      return () => idleWindow.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(scheduleVideoLoad, 1800);
    return () => window.clearTimeout(timeoutId);
  }, [canEnhanceHero]);

  useEffect(() => {
    if (!canEnhanceHero || !shouldLoadVideo || !videoReady) return;
    if (!containerRef.current || !curtainRef.current || !videoRef.current) return;

    let mounted = true;
    let cleanup: (() => void) | undefined;

    async function runAnimation() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (!mounted || !containerRef.current || !curtainRef.current || !videoRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const mainTl = gsap.timeline({
          defaults: { ease: "none" },
        });

        mainTl.to(
          videoRef.current,
          {
            currentTime: videoRef.current?.duration || 1,
            duration: 10,
            force3D: true,
          },
          0
        );

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
          2.5
        );

        mainTl.from(
          ".hero-final-reveal",
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out",
            force3D: true,
          },
          "<+=0.1"
        );
      }, containerRef.current);

      cleanup = () => ctx.revert();
    }

    runAnimation();

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, [canEnhanceHero, shouldLoadVideo, videoReady]);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/hero-video-poster.jpg"
          alt="Roasted coffee beans from Fermion Roastery"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {canEnhanceHero ? (
          <video
            ref={videoRef}
            muted
            playsInline
            preload="none"
            autoPlay={shouldLoadVideo}
            loop
            poster="/hero-video-poster.jpg"
            className={`absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity duration-700 ${
              videoReady ? "opacity-60" : "opacity-0"
            }`}
            onCanPlay={() => setVideoReady(true)}
          >
            {shouldLoadVideo ? <source src="/watermarked_preview.mp4" type="video/mp4" /> : null}
          </video>
        ) : null}

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
        >
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            }}
          />
        </div>
      ) : null}

      <section className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="relative flex min-h-[450px] w-full translate-y-10 items-center justify-center">
          <div className="relative min-h-[350px] w-[90%] max-w-4xl">
            <div className="absolute inset-0 rotate-[1deg] border border-black/5 bg-[#E2DACB] shadow-sm" />

            <div className="absolute inset-0 rotate-[-1deg] border border-black/10 bg-[#FDFBF7] p-12 shadow-[10px_10px_0px_rgba(0,0,0,0.05)]">
              <div className="absolute -top-6 left-1/2 z-50 h-8 w-24 -translate-x-1/2 rotate-[-2deg] border border-black/5 bg-white/50 shadow-sm backdrop-blur-sm" />

              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #367F4D 1px, transparent 1px), linear-gradient(to bottom, #367F4D 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-6">
                {HERO_WORDS.map((word, wordIdx) => (
                  <div
                    key={wordIdx}
                    className={`word-${wordIdx} flex items-center justify-center gap-1 md:gap-3`}
                  >
                    {word.split("").map((char, charIdx) => (
                      <span
                        key={charIdx}
                        className={`char inline-block text-5xl font-display font-black uppercase leading-none tracking-tighter text-slate-900 italic md:text-7xl ${
                          canEnhanceHero ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hero-final-reveal relative z-30 mt-12 space-y-8">
          <p className="mx-auto max-w-3xl text-[10px] font-black uppercase tracking-[0.35em] text-[#8CADD8] md:tracking-[0.5em]">
            {fallbackContent.subtitle}
          </p>

          <div className="flex justify-center gap-6">
            <Link href="/our-coffee">
              <button className="rounded-full bg-[#F1B941] px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-black shadow-2xl transition-all hover:bg-white active:scale-95">
                {fallbackContent.cta_primary}
              </button>
            </Link>
          </div>
        </div>
      </section>

      <div className="absolute bottom-0 left-0 z-40 h-px w-full bg-black/5" />
    </div>
  );
}
