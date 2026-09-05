"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Sticker } from "@/components/ui/sticker";
import { useI18n } from "@/lib/i18n";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/hooks/use-mobile";

import { ProductCard } from "@/components/ui/product-card";

gsap.registerPlugin(ScrollTrigger);

interface NewReleaseProduct {
  id: string;
  image_url?: string | null;
  name: string;
  origin?: string | null;
  category?: string | null;
  notes?: string | null;
  price_retail?: number | null;
}

interface NewReleasesProps {
  initialProducts: NewReleaseProduct[];
}

export function NewReleases({ initialProducts }: NewReleasesProps) {
  const isMobile = useIsMobile();
  const t = useI18n();
  const content = t.landing.newReleases;
  const [products] = useState(initialProducts);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Smooth/Remove zigzag on mobile
  const sectionClip = isMobile
    ? "polygon(0 0, 100% 0, 100% 99%, 0 100%)"
    : "polygon(0 0, 100% 0, 100% 98%, 90% 100%, 80% 98%, 70% 100%, 60% 98%, 50% 100%, 40% 98%, 30% 100%, 20% 98%, 10% 100%, 0 98%)";

  useEffect(() => {
    if (!sectionRef.current) return;

    let ctx: gsap.Context;

    const runAnimations = () => {
      ctx = gsap.context(() => {
        const title = gsap.utils.toArray(".release-title");
        if (title.length > 0) {
          gsap.from(title, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            }
          });
        }

        const cards = gsap.utils.toArray<HTMLElement>('.product-card');

        const mm = gsap.matchMedia();

        mm.add("(min-width: 1024px)", () => {
          if (cards.length > 0) {
            gsap.from(cards, {
              y: 80,
              rotation: (i) => i % 2 === 0 ? -1.5 : 2,
              stagger: 0.15,
              duration: 1.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 80%",
              }
            });
          }
        });
      }, sectionRef.current || undefined);
    };

    const timer = setTimeout(runAnimations, 100);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#F0ECE1] py-32 relative z-20 overflow-hidden text-stone-900 border-b border-black/10"
    >
      {/* Clean Micro Dot Matrix Accent */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Subtle SVG Grid Line Accent */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10 px-6">

        {/* Section Title Header */}
        <div className="text-center lg:text-left lg:ml-6 space-y-6 release-title relative">
          <Sticker rotate={-8} className="-top-8 -left-4 hidden lg:block border border-black/10 shadow-xs scale-110" color="#F1B941" variant="solid">
            Fresh Roast
          </Sticker>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tight uppercase leading-[0.8] text-stone-900">
            {content.title.split(' ')[0]} <br />
            <span className="font-display italic font-normal normal-case text-[#D99B26]">{content.title.split(' ')[1]}</span>
          </h2>

          <div className="w-32 h-1 bg-[#D99B26] mx-auto lg:mx-0 rotate-1"></div>

          <p className="text-[#B57C17] font-mono font-bold uppercase tracking-[0.35em] text-xs bg-white/80 backdrop-blur-xs inline-block px-4 py-1.5 border border-stone-300/80 shadow-2xs rotate-[-1deg] rounded-xs">
            {content.subtitle}
          </p>
        </div>

        {/* Products Grid — Editorial Tasting Spec Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 relative">

          {products.length === 0 ? (
            [1, 2, 3].map(i => (
              <div key={i} className="aspect-[3/4] bg-stone-200/60 animate-pulse border border-black/5 rounded-xs" />
            ))
          ) : products.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
              rotate={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
