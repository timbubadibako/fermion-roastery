"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import DynamicSky from "./DynamicSky";

const sideImages = [
  {
    src: "https://placehold.co/600x800/7a9cff/ffffff?text=Direct+Trade",
    alt: "Coffee Farmer Partnership",
    position: "left",
    span: 1,
  },
  {
    src: "/cartoon.jpeg",
    alt: "Fermion Roasting Lab",
    position: "left",
    span: 1,
  },
  {
    src: "https://placehold.co/600x800/ff4b4b/ffffff?text=Cupping",
    alt: "Quality Cupping Session",
    position: "right",
    span: 1,
  },
  {
    src: "https://placehold.co/600x800/0f172a/ffffff?text=Packaging",
    alt: "Handcrafted Packaging",
    position: "right",
    span: 1,
  },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = window.innerHeight * 2;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ORIGINAL SCROLL LOGIC
  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8));

  // REVERSED FONT ANIMATION: Starts at 0 opacity, becomes 1 as you scroll
  const textOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.4));

  // ORIGINAL LAYOUT CONSTANTS
  const centerWidth = 100 - (imageProgress * 58); // 100% to 42%
  const centerHeight = 100 - (imageProgress * 30); // 100% to 70%
  const sideWidth = imageProgress * 22; // 0% to 22%
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + (imageProgress * 100);
  const sideTranslateRight = 100 - (imageProgress * 100);
  const borderRadius = imageProgress * 24;
  const gap = imageProgress * 16;
  const sideTranslateY = -(imageProgress * 15);

  return (
    <section ref={sectionRef} className="relative bg-background">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">

          <div
            className="relative flex h-full w-full items-stretch justify-center"
            style={{ gap: `${gap}px`, padding: `${imageProgress * 16}px`, paddingBottom: `${60 + (imageProgress * 40)}px` }}
          >

            {/* Left Column - High Z */}
            <div
              className="relative z-20 flex flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateLeft}%) translateY(${sideTranslateY}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages.filter(img => img.position === "left").map((img, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden"
                  style={{ flex: img.span, borderRadius: `${borderRadius}px` }}
                >
                  <Image src={img.src} alt={img.alt} fill className="object-cover" />
                </div>
              ))}
            </div>

            {/* Main Center Area - Low Z */}
            <div
              className="relative z-10 overflow-hidden will-change-transform flex items-center justify-center"
              style={{
                width: `${centerWidth}%`,
                height: `${centerHeight}%`,
                flex: "0 0 auto",
                borderRadius: `${borderRadius}px`,
              }}
            >
              <DynamicSky />

              {/* Reversed Font Animation Logic */}
              <div
                className="relative z-30 text-center px-12 pointer-events-none"
                style={{ opacity: textOpacity }}
              >
                <h1 className="font-cloude text-white leading-[0.8] tracking-tighter">
                  <span className="block mr-3 text-[6vw]">FERMION</span>
                  <span className="block text-[4vw] -mt-[0.25vw] tracking-[0.2em]">roastery</span>
                </h1>
              </div>
            </div>

            {/* Right Column - High Z */}
            <div
              className="relative z-20 flex flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateRight}%) translateY(${sideTranslateY}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages.filter(img => img.position === "right").map((img, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden"
                  style={{ flex: img.span, borderRadius: `${borderRadius}px` }}
                >
                  <Image src={img.src} alt={img.alt} fill className="object-cover" />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <div className="h-[200vh]" />

      <div className="px-6 pt-32 pb-28 md:pt-48 md:px-12 md:pb-36 lg:px-20 lg:pt-56 lg:pb-44">
        <p className="mx-auto max-w-2xl text-center text-2xl leading-relaxed text-muted-foreground md:text-3xl lg:text-[2.5rem] lg:leading-snug font-medium italic">
          "Curated, roasted, and revered. <br /> Bringing happiness into your cup."
        </p>
      </div>
    </section>
  );
}
