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
      className="bg-[#2A1619] py-32 relative z-20 overflow-hidden text-[#E2DACB] border-b border-black/20"
    >
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ backgroundImage: 'url("/textures/grain-noise.svg")' }} 
      />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10 px-6">

        {/* Section Title Header */}
        <div className="text-center lg:text-left lg:ml-6 space-y-6 release-title relative">
          <Sticker rotate={-8} className="-top-8 -left-4 hidden lg:block border border-black/10 shadow-sm scale-110" color="#F1B941" variant="solid">
            Fresh Roast
          </Sticker>

          <h2 className="text-6xl md:text-7xl font-cloude tracking-tighter leading-[0.8] text-white">
            {content.title.split(' ')[0]} <br />
            <span className="font-display italic text-[#EBA294]">{content.title.split(' ')[1]}</span>
          </h2>

          <div className="w-32 h-1 bg-[#EBA294] mx-auto lg:mx-0 rotate-1"></div>

          <p className="text-[#EBA294] font-bold uppercase tracking-[0.4em] text-xs font-sans bg-black/40 inline-block px-4 py-1 border border-black/20 rotate-[-1deg]">
            {content.subtitle}
          </p>
        </div>

        {/* Products Grid — Editorial Tasting Spec Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 relative">

          {products.length === 0 ? (
            [1, 2, 3].map(i => (
              <div key={i} className="aspect-[3/4] bg-white/10 animate-pulse border border-black/5 rounded-sm" />
            ))
          ) : products.map((product, idx) => {
            const tastingNotesList = product.notes
              ? product.notes.split(/[,•|]/).map(n => n.trim()).filter(Boolean)
              : ["Specialty Grade", "Fresh Roasted"];

            return (
              <div
                key={product.id}
                className={`product-card group bg-[#FDFBF7] border border-black/10 shadow-[8px_8px_0px_rgba(0,0,0,0.06)] hover:shadow-[16px_16px_0px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-500 rounded-sm overflow-hidden flex flex-col text-slate-900 ${
                  idx % 2 === 0 ? 'lg:-rotate-[1deg]' : 'lg:rotate-[1deg]'
                }`}
              >
                {/* Top Craft Spec Bar */}
                <div className="bg-[#FAF8F3] px-6 py-3 border-b border-black/10 flex justify-between items-center text-[9px] font-black tracking-widest uppercase text-stone-600">
                  <span className="inline-flex items-center gap-1.5 text-[#367F4D]">
                    <Sparkles size={11} />
                    {product.origin || 'SINGLE ORIGIN'}
                  </span>
                  <span className="text-stone-400 font-mono">LOT #{idx + 1024}</span>
                </div>

                {/* Product Image Container */}
                <div className="aspect-[4/3] bg-stone-200 relative overflow-hidden border-b border-black/10 group-hover:bg-stone-300 transition-colors">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover grayscale-[0.15] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-cloude text-4xl text-stone-400 rotate-[-5deg]">
                      Fermion
                    </div>
                  )}

                  {/* Category Pill Tag Overlay */}
                  <div className="absolute top-3 left-3 bg-slate-900/90 text-white backdrop-blur-sm px-3 py-1 text-[8px] font-black uppercase tracking-[0.25em] rounded-xs shadow-sm">
                    {product.category || 'WHOLE BEAN'}
                  </div>
                </div>

                {/* Editorial Tasting Spec Content */}
                <div className="p-6 sm:p-7 space-y-6 flex-1 flex flex-col justify-between">
                  
                  {/* Title & Origin Details */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#367F4D] uppercase tracking-[0.2em] block">
                      {product.origin || 'INDONESIA SPECIALTY'}
                    </span>

                    <h3 className="font-display font-black text-2xl uppercase tracking-tight leading-tight text-slate-900 group-hover:text-[#367F4D] transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  {/* Tasting Notes Chips Pill Grid */}
                  <div className="space-y-2 pt-2 border-t border-black/10">
                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 block">
                      PROFIL &amp; TASTING NOTES
                    </span>

                    <div className="flex flex-wrap gap-1.5">
                      {tastingNotesList.map((note, i) => (
                        <span 
                          key={i} 
                          className="px-2.5 py-1 bg-[#FAF8F3] border border-black/10 text-[9px] font-black uppercase tracking-wider text-slate-800 rounded-sm shadow-2xs"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-4 border-t border-black/10 flex items-center justify-between gap-4 mt-auto">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 block">
                        HARGA RETAIL
                      </span>
                      <span className="font-display font-black text-xl text-slate-900">
                        Rp {Number(product.price_retail).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <Link href={`/our-coffee/${product.id}`}>
                      <button className="bg-[#367F4D] hover:bg-[#2b643d] text-white py-3 px-5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 shadow-md flex items-center gap-1.5 group-hover:translate-x-0.5">
                        <span>{content.ctaViewDetails}</span>
                        <ArrowRight size={13} />
                      </button>
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
