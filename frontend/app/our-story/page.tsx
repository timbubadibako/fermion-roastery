"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Activity, Globe2, Coffee, Quote, Microscope, PenTool, Archive } from "lucide-react";
import { Sticker } from "@/components/ui/sticker";
import { FooterV2 } from "@/components/sections/v2/FooterV2";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StoryPageV2() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const philosophyRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    
    let ctx: gsap.Context;

    const runAnimations = () => {
      ctx = gsap.context(() => {
        const heroText = gsap.utils.toArray(".story-hero-text");
        if (heroText.length > 0) {
          gsap.from(heroText, { y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out" });
        }
        
        const heroPolaroid = gsap.utils.toArray(".hero-polaroid");
        if (heroPolaroid.length > 0) {
          gsap.from(heroPolaroid, { x: 100, rotation: 5, opacity: 0, duration: 1.5, ease: "back.out(1.2)" });
        }

        if (philosophyRef.current) {
          const cards = gsap.utils.toArray(".philosophy-card", philosophyRef.current);
          if (cards.length > 0) {
            gsap.from(cards, { y: 50, opacity: 0, stagger: 0.2, duration: 1, ease: "power2.out", scrollTrigger: { trigger: philosophyRef.current, start: "top 75%" } });
          }
        }
        
        if (galleryRef.current) {
          const gallery = gsap.utils.toArray(".gallery-item", galleryRef.current);
          if (gallery.length > 0) {
            gsap.from(gallery, { scale: 0.9, opacity: 0, stagger: 0.15, duration: 1, ease: "power2.out", scrollTrigger: { trigger: galleryRef.current, start: "top 70%" } });
          }
        }
        ScrollTrigger.refresh();
      });
    };

    const timer = setTimeout(runAnimations, 50);
    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="bg-[#FAF9F6] min-h-screen relative overflow-hidden font-sans">
      
      {/* Background Aesthetics */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* SECTION 1: HERO (Character: Horizon Blue & White) */}
      <section ref={heroRef} className="pt-48 pb-40 px-6 relative z-10 bg-[#E8F1F8]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
           
           <div className="flex-1 space-y-10 order-2 lg:order-1">
              <div className="inline-block px-4 py-1.5 bg-white border border-[#8CADD8]/30 shadow-[4px_4px_0_rgba(140,173,216,0.1)] rotate-[-1deg] text-[10px] font-black tracking-[0.3em] text-[#0F3A8D] uppercase story-hero-text">
                 <Archive size={12} className="inline mr-2" /> The Roastery Manifesto
              </div>
              <h1 className="text-7xl md:text-9xl font-cloude tracking-tighter text-slate-900 leading-[0.8] story-hero-text">
                 The Flavor <br/> <span className="font-display italic text-[#8CADD8]">Bridge.</span>
              </h1>
              <div className="space-y-6 text-stone-600 font-medium text-lg md:text-xl leading-relaxed max-w-2xl bg-white/40 p-6 border-l-4 border-[#8CADD8]/40 backdrop-blur-sm shadow-sm story-hero-text">
                 <p>
                    We exist to connect the hands that grow the coffee to the hands that brew it. Our role is simple but critical: to serve as the flavor bridge between the producer and the coffee drinker.
                 </p>
                 <p className="italic">
                    There are good intentions, unique character, and intrinsic values within every single bean. It is our sworn duty to ensure those values remain unbroken from farm to cup.
                 </p>
              </div>
           </div>

           <div className="w-full lg:w-[500px] relative aspect-[4/5] order-1 lg:order-2 hero-polaroid">
              <div className="bg-white p-4 pb-16 border border-black/10 shadow-[20px_20px_0px_rgba(0,0,0,0.02)] rotate-[3deg] relative z-20">
                 <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-32 h-8 bg-white/60 border border-black/5 rotate-[-2deg] z-30 backdrop-blur-sm shadow-sm opacity-80"></div>
                 
                 <div className="relative w-full h-full bg-[#E8F1F8] overflow-hidden border border-black/5">
                    <Image 
                      src="https://placehold.co/800x1000/0f3a8d/e8f1f8?text=GARAGE+ERA" 
                      alt="Origins" fill className="object-cover grayscale contrast-125"
                    />
                 </div>
                 <div className="absolute bottom-4 right-6 text-right">
                    <p className="font-cloude text-[#0F3A8D] text-4xl opacity-20 italic">#EST-2018</p>
                 </div>
              </div>
              <Sticker rotate={-12} className="absolute -top-6 -left-6 z-40 border border-black/10 shadow-sm" color="#F1B941">GARAGE DAYS</Sticker>
           </div>
        </div>
      </section>

      {/* SECTION 2: PHILOSOPHY (Lab Note Cards - Character: Dark Navy) */}
      <section ref={philosophyRef} className="py-48 px-6 relative z-20 -mt-16 overflow-hidden bg-[#1A2B40] text-white"
        style={{ clipPath: "polygon(0 40px, 12% 0%, 25% 40px, 38% 0%, 50% 40px, 62% 0%, 75% 40px, 88% 0%, 100% 40px, 100% 100%, 0 100%)" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 pt-12">
           {[
              { 
                idx: "01", category: "THE PRODUCER", title: "Honoring the Origin.", icon: <Globe2 size={24} />,
                desc: "We source directly from dedicated farmers. Every cherry carries their hard work and a unique terroir that we are sworn to protect and highlight through careful profiling."
              },
              { 
                idx: "02", category: "THE DRINKER", title: "Delivering the Value.", icon: <Activity size={24} />,
                desc: "Through scientific precision and sensory calibration, we ensure that the original goodness and unique flavor profile reach your morning ritual intact and unbroken."
              }
           ].map((p, i) => (
             <div key={i} className="philosophy-card bg-[#233854] p-12 border border-white/5 shadow-2xl rounded-xl relative overflow-hidden group">
                <div className="absolute -top-4 right-12 w-4 h-12 rounded-full border-4 border-white/10 bg-transparent rotate-12 z-20"></div>
                <div className="w-16 h-16 bg-[#1A2B40] border border-white/10 rounded-2xl flex items-center justify-center text-[#8CADD8] group-hover:scale-110 transition-transform duration-500 mb-8">
                   {p.icon}
                </div>
                <div className="space-y-6 relative z-10">
                   <p className="text-[10px] font-black text-[#8CADD8] tracking-[0.4em] uppercase">{p.idx} / {p.category}</p>
                   <h2 className="text-4xl font-display font-black text-white uppercase italic tracking-tighter leading-none">{p.title}</h2>
                   <svg className="w-16 opacity-10" viewBox="0 0 100 10"><path d="M 0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5" stroke="currentColor" fill="transparent" strokeWidth="3" strokeLinecap="round" /></svg>
                   <p className="text-white/60 leading-relaxed font-medium text-lg">{p.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* SECTION 3: GALLERY (Stacked Records - Character: Light Stone) */}
      <section ref={galleryRef} className="py-48 px-6 relative z-30 -mt-16 overflow-hidden bg-[#FAF9F6]"
        style={{ clipPath: "polygon(0 40px, 15% 0%, 30% 40px, 45% 0%, 60% 40px, 75% 0%, 85% 40px, 100% 0%, 100% 100%, 0 100%)" }}
      >
         <div className="max-w-7xl mx-auto space-y-24 pt-12">
           <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-3 text-stone-400">
                 <Microscope size={20} />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em]">Visual Evidence</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-cloude tracking-tighter text-slate-900 leading-none italic">Where the magic happens.</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 pt-10">
              {[
                { title: "Machine", text: "The Probat", color: "#F1B941", img: "https://placehold.co/600x800/0f3a8d/e8f1f8?text=THE+PROBAT" },
                { title: "QC Pass", text: "Quality Check", color: "#8CADD8", img: "https://placehold.co/600x800/1a2b20/ffffff?text=CALIBRATION" },
                { title: "Hand Packed", text: "Final Record", color: "#EBA294", img: "https://placehold.co/600x800/0f3a8d/ffffff?text=PACKAGING" }
              ].map((item, i) => (
                <div key={i} className={`gallery-item relative bg-white p-4 pb-12 border border-black/10 shadow-lg group
                  ${i === 1 ? 'md:-translate-y-12' : ''}
                `} style={{ transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}>
                   <div className="relative aspect-[3/4] overflow-hidden border border-black/5 bg-stone-100">
                      <Image src={item.img} alt={item.text} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                   </div>
                   <Sticker rotate={i % 2 === 0 ? 8 : -8} className="absolute bottom-8 right-8 z-30 shadow-sm border border-black/10" variant="solid" color={item.color}>
                      <span className="px-2 uppercase">{item.title}</span>
                   </Sticker>
                </div>
              ))}
           </div>
         </div>
      </section>

      {/* SECTION 4: MANIFESTO (Character: Pale Beige Archive) */}
      <section className="py-48 px-6 relative z-40 -mt-16 overflow-hidden bg-[#F4F0E6] text-[#1A2B40]"
        style={{ clipPath: "polygon(0 40px, 10% 0, 20% 40px, 35% 0, 50% 40px, 65% 0, 80% 40px, 90% 0, 100% 40px, 100% 100%, 0 100%)" }}
      >
         <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10 pt-10">
            <Quote size={60} className="text-[#367F4D] opacity-10 mx-auto" />
            <h2 className="text-4xl md:text-6xl font-display font-black italic tracking-tighter leading-tight text-balance">
               "Tugas kami adalah sebagai jembatan rasa antara producer dan coffee drinker. Ada hal baik, rasa yang unik dan value yang tidak boleh putus."
            </h2>
            <div className="w-24 h-1 bg-[#8CADD8]/50 mx-auto rotate-1"></div>
            <p className="font-cloude text-[#0F3A8D] text-2xl tracking-widest uppercase">
               — The Fermion Manifesto
            </p>
         </div>
      </section>

      <FooterV2 />
    </div>
  );
}
