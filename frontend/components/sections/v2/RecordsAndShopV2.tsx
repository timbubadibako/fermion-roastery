"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sticker } from "@/components/ui/sticker";
import { siteContent } from "@/lib/content";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/hooks/use-mobile";

gsap.registerPlugin(ScrollTrigger);

export function NewReleasesV2() {
  const isMobile = useIsMobile();
  const content = siteContent.newReleases;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Smooth/Remove zigzag on mobile
  const sectionClip = isMobile 
    ? "polygon(0 0, 100% 0, 100% 99%, 0 100%)" 
    : "polygon(0 0, 100% 0, 100% 98%, 90% 100%, 80% 98%, 70% 100%, 60% 98%, 50% 100%, 40% 98%, 30% 100%, 20% 98%, 10% 100%, 0 98%)";

  const cardClip = isMobile
    ? "none" 
    : "polygon(0 -20%, 100% -20%, 100% 98%, 95% 100%, 90% 98%, 85% 100%, 80% 98%, 75% 100%, 70% 98%, 65% 100%, 60% 98%, 55% 100%, 50% 98%, 45% 100%, 40% 98%, 35% 100%, 30% 98%, 25% 100%, 20% 98%, 15% 100%, 10% 98%, 5% 100%, 0 98%)";

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewReleases();
  }, []);
useEffect(() => {
  if (!sectionRef.current || loading) return;

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

      let mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        if (cards.length > 0) {
          gsap.from(cards, {
            y: 100,
            rotation: (i) => i % 2 === 0 ? -2 : 3,
            stagger: 0.2,
            duration: 1.2,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
            }
          });
        }
      });
    }, sectionRef.current);
  };

  // Small delay to ensure DOM is ready
  const timer = setTimeout(runAnimations, 100);

  return () => {
    clearTimeout(timer);
    if (ctx) ctx.revert();
  };
}, [loading]);

  return (
    <section
      ref={sectionRef}
      // Dark Maroon side
      className="bg-[#2A1619] py-32 relative z-20 overflow-hidden text-[#E2DACB]"
      style={{
        clipPath: sectionClip
      }}
    >
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="max-w-7xl mx-auto space-y-24 relative z-10 px-6">

        <div className="text-center lg:text-left lg:ml-12 space-y-6 release-title relative">
          <Sticker rotate={-10} className="-top-8 -left-4 hidden lg:block border border-black/10 shadow-sm scale-110" color="#F1B941" variant="solid">
            Fresh Roast
          </Sticker>

          <h2 className="text-6xl md:text-7xl font-cloude tracking-tighter leading-[0.8] text-white">
            {content.title.split(' ')[0]} <br />
            <span className="font-display italic text-[#EBA294]">{content.title.split(' ')[1]}</span>
          </h2>

          <div className="w-32 h-1 bg-[#EBA294] mx-auto lg:mx-0 rotate-1"></div>

          <p className="text-[#EBA294] font-bold uppercase tracking-[0.4em] text-xs font-sans bg-black/40 inline-block px-4 border border-black/20 rotate-[-1deg]">
            {content.subtitle}
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-12 relative">
          {/* FULL WIDTH HANGING WIRE - Relative to the cards to prevent misalignment. Without pt-12, the hole is ~58px above the grid top. */}
          <div className="absolute left-[-50vw] right-[-50vw] h-[3px] bg-gradient-to-r from-transparent via-stone-500/50 to-transparent z-30 hidden lg:block"></div>
          <div className="absolute left-[-50vw] right-[-50vw] h-[1px] bg-white/10 z-30 hidden lg:block"></div>

          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="aspect-[3/4] bg-white/10 animate-pulse border border-black/5" style={{ transform: `rotate(1deg)` }} />)
          ) : products.map((product, idx) => (
            <div
              key={product.id}
              className={`product-card group relative bg-[#FDFBF7] p-0 shadow-[10px_10px_30px_rgba(0,0,0,0.2)] border-x border-black/5 transition-all duration-500 cursor-pointer flex flex-col will-change-transform hover:shadow-[15px_15px_40px_rgba(0,0,0,0.3)] ${idx % 2 === 0 ? 'lg:-rotate-[1.5deg]' : 'lg:rotate-[1.5deg]'}`}
              style={{
                clipPath: cardClip
              }}
            >
              {/* Desktop: Kitchen Clip | Mobile: Clear Tape */}
              {!isMobile ? (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-16 bg-gradient-to-b from-zinc-300 to-zinc-500 rounded-t-lg z-40 shadow-[0_6px_15px_rgba(0,0,0,0.4)] flex items-center justify-center border-t border-white/20">
                  {/* Metal Texture Detail */}
                  <div className="w-20 h-2 bg-zinc-600/30 rounded-full blur-[1px]"></div>
                  {/* The Hanger Hole - Positioned exactly on the wire */}
                  <div className="absolute -top-4 w-7 h-7 bg-zinc-600 rounded-full border-2 border-zinc-400 shadow-inner flex items-center justify-center">
                    <div className="w-3.5 h-3.5 bg-black/60 rounded-full"></div>
                  </div>
                  {/* The Pressure Plate */}
                  <div className="absolute bottom-0 w-full h-6 bg-zinc-400 border-t border-zinc-500 rounded-b-sm shadow-sm flex items-center justify-center">
                    <div className="w-16 h-1 bg-zinc-500/40 rounded-full"></div>
                  </div>
                </div>
              ) : (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-8 bg-white/40 backdrop-blur-[2px] border border-white/30 shadow-sm z-40 rotate-[-2deg] opacity-80"></div>
              )}

              {/* Punched Hole in Paper - Hide on mobile since we use tape */}
              {!isMobile && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#2A1619] rounded-full z-20 shadow-inner opacity-60"></div>
              )}

              {/* Internal Content Wrapper - Only this moves on hover to avoid wire clash */}
              <div className="flex-1 flex flex-col group-hover:scale-[1.02] transition-transform duration-500 origin-top">
                {/* Image Container */}
                <div className="aspect-[4/3] bg-stone-200 relative overflow-hidden mb-0 border-b border-dashed border-black/10">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-cloude text-4xl text-stone-400 rotate-[-5deg]">Specimen</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60"></div>
                </div>

                {/* Details written like a Kitchen Receipt */}
                <div className="p-8 space-y-6 flex-1 flex flex-col text-slate-800 font-mono">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-bold text-stone-400 uppercase tracking-tighter">
                      <span>{product.origin || 'Laboratory Grade'}</span>
                      <span>#{idx + 1024}</span>
                    </div>
                    <h4 className="text-2xl font-display font-black uppercase tracking-tight leading-tight text-slate-900 border-b border-stone-200 pb-2">
                      {product.name}
                    </h4>
                  </div>

                  <div className="space-y-2 text-[11px] font-medium leading-relaxed opacity-80 uppercase">
                    <p className="flex justify-between"><span>TYPE:</span> <span className="font-bold">{product.category || 'WHOLE BEAN'}</span></p>
                    <p className="flex justify-between"><span>NOTES:</span> <span className="font-bold truncate ml-4">{product.notes || 'CURATED'}</span></p>
                    <p className="flex justify-between border-t border-dashed border-stone-300 pt-2 text-sm">
                      <span>TOTAL PRICE:</span>
                      <span className="font-black text-slate-900">RP{Number(product.price_retail).toLocaleString('id-ID')}</span>
                    </p>
                  </div>

                  <div className="mt-auto pt-6">
                    <Link href={`/our-coffee/${product.id}`} className="block">
                      <button className="w-full bg-slate-900 text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-fermion-coral transition-all duration-300 hover:tracking-[0.4em] active:scale-95 shadow-xl">
                        Examine Specimen
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Vertical Receipt Line/Punching */}
                <div className="absolute top-0 left-4 bottom-0 w-px border-l border-dashed border-black/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}