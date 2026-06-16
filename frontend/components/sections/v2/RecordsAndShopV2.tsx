"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sticker } from "@/components/ui/sticker";
import { siteContent } from "@/lib/content";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function NewReleasesV2() {
  const content = siteContent.newReleases;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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
    let ctx = gsap.context(() => {
      gsap.from(".release-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      const cards = gsap.utils.toArray<HTMLElement>('.product-card');
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
    }, sectionRef);
    return () => ctx.revert();
  }, [loading]);

  return (
    <section 
      ref={sectionRef}
      // Dark Maroon side of the zig-zag
      className="bg-[#2A1619] py-40 px-6 relative z-20 -mt-20 overflow-hidden text-[#E2DACB]"
      style={{
        clipPath: "polygon(0 2%, 12% 0%, 25% 3%, 38% 0%, 50% 2%, 62% 0%, 75% 3%, 88% 0%, 100% 2%, 100% 100%, 0 100%)"
      }}
    >
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      
      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        
        <div className="text-center lg:text-left space-y-6 release-title relative">
           <Sticker rotate={-10} className="-top-8 -left-4 hidden lg:block border border-black/10 shadow-sm scale-110" color="#F1B941" variant="solid">
             Fresh Roast
           </Sticker>
           
           <h2 className="text-7xl md:text-9xl font-cloude tracking-tighter leading-[0.8] text-white">
             {content.title.split(' ')[0]} <br/>
             <span className="font-display italic text-[#EBA294]">{content.title.split(' ')[1]}</span>
           </h2>
           
           <div className="w-32 h-1 bg-[#EBA294] mt-6 mx-auto lg:mx-0 rotate-1"></div>
           
           <p className="text-[#EBA294] font-bold uppercase tracking-[0.4em] text-xs font-sans bg-black/40 inline-block px-4 py-2 border border-black/20 rotate-[-1deg]">
             {content.subtitle}
           </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-12 mt-12">
           {loading ? (
             [1,2,3].map(i => <div key={i} className="aspect-[3/4] bg-white/10 animate-pulse border border-black/5" style={{ transform: `rotate(1deg)` }} />)
           ) : products.map((product, idx) => (
              <div 
                key={product.id} 
                className="product-card group relative bg-white p-6 pb-8 shadow-[8px_8px_0px_rgba(0,0,0,0.03)] border border-black/10 hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(0,0,0,0.05)] transition-all duration-300 cursor-pointer flex flex-col"
                style={{
                  transform: `rotate(${idx % 2 === 0 ? -1 : 2}deg)`,
                  borderRadius: "2px 6px 4px 2px"
                }}
              >
                {/* Masking tape on top */}
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-20 h-6 bg-white/60 border border-black/5 rotate-[-2deg] z-20 backdrop-blur-sm shadow-sm"></div>
                
                {/* Image Container */}
                <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden mb-6 rounded-sm">
                   {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                   ) : (
                      <div className="w-full h-full bg-slate-100 relative">
                        <div className="absolute inset-0 flex items-center justify-center font-cloude text-4xl text-slate-300 rotate-[-5deg]">No Image</div>
                      </div>
                   )}
                   <Sticker rotate={12} className="top-4 right-4 scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-black/10" color="#FFF">{content.stickerSize}</Sticker>
                   
                   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 bg-white/90 backdrop-blur-md text-slate-900 px-3 py-2 rounded-full border border-black/5 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <p className="text-[9px] font-black uppercase tracking-widest italic text-center truncate">✨ {product.notes || 'Curated Selection'}</p>
                   </div>
                </div>

                {/* Details written like a note */}
                <div className="px-2 space-y-4 relative flex-1 flex flex-col">
                   <div className="flex justify-between items-start gap-2">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                          {product.origin || 'Single Origin'}
                        </p>
                        <h4 className="text-2xl font-display font-black uppercase tracking-tight leading-none text-slate-900 mt-1">
                          {product.name}
                        </h4>
                     </div>
                     <div className="text-xl font-cloude text-fermion-french-blue whitespace-nowrap">
                       Rp{Number(product.price_retail).toLocaleString('id-ID')}
                     </div>
                   </div>

                   {/* Squiggly line separator */}
                   <svg className="w-16 opacity-30 mt-2 mb-4 text-black" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
                     <path d="M 0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5" stroke="currentColor" fill="transparent" strokeWidth="2" strokeLinecap="round" />
                   </svg>
                   
                   <div className="mt-auto pt-4">
                     <Link href={`/our-coffee/${product.id}`} className="block">
                        <button className="w-full bg-slate-50 text-slate-900 py-3 rounded-full border border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-fermion-french-blue hover:text-white hover:border-fermion-french-blue transition-all duration-300 hover:-translate-y-1 active:scale-95">
                            {content.cta}
                        </button>
                     </Link>
                   </div>
                </div>
              </div>
           ))}
        </div>
      </div>
    </section>
  );
}
