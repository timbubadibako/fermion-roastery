"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, BookOpen, Quote, PenTool, Calendar, Microscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sticker } from "@/components/ui/sticker";
import { FooterV2 } from "@/components/sections/v2/FooterV2";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const articles = [
   { id: 1, title: "Natural Yeast Fermentation", category: "EDUCATION", date: "05 JUN", img: "https://placehold.co/800x600/4B365F/e2dacb?text=LAB+PROCESS" },
   { id: 2, title: "Sourcing in Kendal", category: "ORIGIN STORY", date: "01 JUN", img: "https://placehold.co/800x600/e2dacb/4B365F?text=FIELD+WORK" },
   { id: 3, title: "Home Espresso Dialing", category: "BREWING", date: "28 MAY", img: "https://placehold.co/800x600/2E2140/f4f0e6?text=HOME+BREW" },
   { id: 4, title: "Cirebon Micro-Roasting", category: "COMMUNITY", date: "20 MAY", img: "https://placehold.co/800x600/4B365F/ffffff?text=LOCAL+HERO" }
];

export default function JournalPageV2() {
   const [mounted, setMounted] = useState(false);
   const heroRef = useRef<HTMLElement>(null);
   const gridRef = useRef<HTMLDivElement>(null);

   useEffect(() => { setMounted(true); }, []);

   useEffect(() => {
      if (!mounted) return;

      let ctx: gsap.Context;

      const runAnimations = () => {
         ctx = gsap.context(() => {
            const heroText = gsap.utils.toArray(".journal-hero-text");
            if (heroText.length > 0) {
               gsap.from(heroText, { y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out" });
            }

            if (gridRef.current) {
               const cards = gsap.utils.toArray<HTMLElement>('.article-scrap', gridRef.current);
               if (cards.length > 0) {
                  gsap.from(cards, {
                     y: 100,
                     rotation: (i) => i % 2 === 0 ? -3 : 3,
                     opacity: 0,
                     stagger: 0.2,
                     duration: 1.2,
                     ease: "back.out(1.2)",
                     scrollTrigger: { trigger: gridRef.current, start: "top 80%" }
                  });
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

         {/* Paper Texture Overlay */}
         <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.04]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
         />

         {/* SECTION 1: HEADER (Character: Pastel Lilac & Paper Textures) */}
         <section
            ref={heroRef}
            className="pt-48 pb-32 px-6 relative z-10 bg-[#F1EAFF] text-stone-900 overflow-hidden" // 🟢 FIXED: Berganti ke Ungu Pastel & Text Gelap
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 98%, 95% 99%, 90% 98%, 85% 99%, 80% 98%, 75% 99%, 70% 98%, 65% 99%, 60% 98%, 55% 99%, 50% 98%, 45% 99%, 40% 98%, 35% 99%, 30% 98%, 25% 99%, 20% 98%, 15% 99%, 10% 98%, 5% 99%, 0 98%)" }}
         >
            {/* 🟢 LOCAL PAPER TEXTURE: Mengunci murni di dalam area hero pastel */}
            <div
               className="absolute inset-0 pointer-events-none z-[1] opacity-[0.45] mix-blend-multiply"
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* Big Background Text Watermark */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[15vw] font-cloude text-purple-950 opacity-[0.03] select-none pointer-events-none uppercase rotate-[-5deg] z-[2]">
               Archive
            </div>

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
               <div className="space-y-6">
                  {/* 🟢 UPDATE BADGE: Warna plum tua agar kontras di latar pastel */}
                  <div className="inline-block px-4 py-1.5 bg-[#392438] shadow-sm rotate-[-1deg] text-[10px] font-black tracking-[0.4em] text-white uppercase journal-hero-text">
                     <PenTool size={12} className="inline mr-2" /> Field Notes & Records
                  </div>

                  {/* 🟢 UPDATE JUDUL: text-stone-900 (Charcoal) & aksen Bright Purple untuk "the Field." */}
                  <h1 className="text-7xl md:text-9xl font-cloude tracking-tighter leading-[0.8] journal-hero-text text-stone-900">
                     Stories from <br /> <span className="font-display italic text-[#A855F7]">the Field.</span>
                  </h1>
               </div>

               <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 journal-hero-text">
                  {/* 🟢 UPDATE DESKRIPSI: Dibuat lebih gelap (text-stone-700) agar tajam dibaca */}
                  <p className="max-w-xl text-stone-700 font-medium text-lg leading-relaxed border-l-2 border-purple-300 pl-6">
                     A repository of sourcing journals, sensory analysis, and technical records from the Fermion Laboratory.
                  </p>

                  {/* 🟢 UPDATE SEARCH BAR: Disesuaikan menggunakan border gelap transparan agar stand out di background terang */}
                  <div className="flex items-center gap-4 bg-stone-950/5 border border-stone-950/10 rounded-full px-6 py-3.5 min-w-[320px] backdrop-blur-sm focus-within:border-purple-500/30 focus-within:bg-stone-950/10 transition-all group/search">
                     {/* Ikon Search disesuaikan dengan warna ungu solid sesuai image_4b589c.png */}
                     <Search size={16} className="text-[#A855F7] transition-transform duration-300 group-focus-within/search:scale-105" strokeWidth={2.5} />
                     <input
                        type="text"
                        placeholder="Search the archives..."
                        className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-[0.15em] w-full text-stone-900 placeholder:text-stone-500/70"
                     />
                  </div>
               </div>
            </div>
         </section>

         {/* SECTION 2: THE STAGGERED SCRAPBOOK (New Layout) */}
         <section className="py-40 px-6 relative z-20 -mt-16 bg-[#FAF9F6] overflow-hidden"
            style={{ clipPath: "polygon(0 40px, 12% 0, 25% 40px, 38% 0, 50% 40px, 62% 0, 75% 40px, 88% 0, 100% 40px, 100% 100%, 0 100%)" }}
         >
            <div ref={gridRef} className="max-w-7xl mx-auto relative min-h-[1400px] pt-20">

               {/* Article 1: Large Center-Left */}
               <div className="article-scrap absolute top-0 left-0 w-full lg:w-[60%] z-20">
                  <Link href="/journal/1" className="group block bg-white p-6 md:p-10 border border-black/10 shadow-[20px_20px_0px_rgba(46,33,64,0.02)] rotate-[-1deg] rounded-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[30px_30px_0px_rgba(46,33,64,0.03)]">
                     <div className="absolute top-[-15px] left-1/3 w-32 h-8 bg-[#A288E3]/20 border border-black/5 rotate-[2deg] backdrop-blur-sm z-30 shadow-sm opacity-80"></div>
                     <div className="aspect-video relative overflow-hidden rounded-sm border border-black/5 mb-10 bg-stone-50">
                        <Image src={articles[0].img} alt="Post" fill className="object-cover filter contrast-125 grayscale group-hover:grayscale-0 transition-all duration-1000" />
                        <Sticker rotate={-10} className="top-6 left-6" color="#F1B941">LATEST ENTRY</Sticker>
                     </div>
                     <div className="space-y-6">
                        <div className="flex items-center gap-4 text-[#A288E3]">
                           <Microscope size={18} strokeWidth={2.5} />
                           <span className="text-[10px] font-black uppercase tracking-[0.4em]">{articles[0].category}</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-display font-black text-slate-900 leading-[0.9] tracking-tighter uppercase italic">{articles[0].title}</h2>
                        <p className="text-stone-500 text-lg max-w-xl font-medium leading-relaxed italic">"A technical analysis of sensory transformations during the first 72 hours of fermentation."</p>
                     </div>
                  </Link>
               </div>

               {/* Article 2: Small Right Sticky */}
               <div className="article-scrap absolute top-40 right-0 w-full lg:w-[35%] z-30">
                  <Link href="/journal/2" className="group block bg-white p-8 border border-black/10 shadow-xl rotate-[3deg] rounded-sm transition-all duration-500 hover:rotate-0 hover:-translate-y-4">
                     <div className="absolute -top-4 right-10 w-4 h-12 border-4 border-stone-200 rounded-full rotate-12"></div>
                     <div className="aspect-square relative overflow-hidden mb-6 bg-stone-100">
                        <Image src={articles[1].img} alt="Post" fill className="object-cover filter sepia-[0.4]" />
                     </div>
                     <div className="space-y-4">
                        <p className="text-[10px] font-black text-[#A288E3] uppercase tracking-widest">{articles[1].date} / FIELD REPORT</p>
                        <h3 className="text-3xl font-cloude text-slate-900 leading-none">{articles[1].title}</h3>
                        <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                           <span className="text-[9px] font-black uppercase tracking-widest text-stone-300 group-hover:text-[#A288E3]">Open File</span>
                           <ArrowRight size={14} className="text-stone-200 group-hover:text-[#A288E3]" />
                        </div>
                     </div>
                  </Link>
               </div>

               {/* Article 3: Medium Bottom-Right */}
               <div className="article-scrap absolute top-[700px] right-[10%] w-full lg:w-[45%] z-10">
                  <Link href="/journal/3" className="group block bg-stone-50 p-10 border border-black/5 shadow-md rotate-[-2deg] rounded-sm hover:bg-white hover:shadow-2xl transition-all duration-500">
                     <div className="aspect-[4/3] relative overflow-hidden mb-8">
                        <Image src={articles[2].img} alt="Post" fill className="object-cover filter contrast-125 saturate-50" />
                     </div>
                     <h3 className="text-4xl font-display font-black text-slate-900 leading-none uppercase italic tracking-tighter">{articles[2].title}</h3>
                     <p className="text-sm text-stone-400 font-medium mt-4 line-clamp-2">Observations on consistency and extraction yield across multiple domestic grinders.</p>
                  </Link>
               </div>

               {/* Decorative Note */}
               <div className="article-scrap absolute top-[950px] left-[5%] w-full lg:w-[25%] rotate-[8deg] bg-[#EBA294]/10 p-8 border border-[#EBA294]/20 hidden lg:block">
                  <Quote size={32} className="text-[#EBA294] opacity-30 mb-4" />
                  <p className="text-[13px] font-medium text-[#2E2140] leading-relaxed italic">
                     "The archive is not just a collection of past roasts, but a roadmap for future rituals."
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest mt-6 text-[#2E2140]/40">— Curator's Note</p>
               </div>

               {/* Article 4: Large Bottom-Center */}
               <div className="article-scrap absolute top-[1150px] left-[30%] w-full lg:w-[50%] z-20">
                  <Link href="/journal/4" className="group block bg-white p-6 border border-black/10 shadow-[15px_15px_0px_rgba(0,0,0,0.02)] rotate-[1deg] rounded-sm transition-all duration-500 hover:scale-[1.02]">
                     <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-full md:w-1/2 aspect-square relative overflow-hidden rounded-sm border border-black/5">
                           <Image src={articles[3].img} alt="Post" fill className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000" />
                        </div>
                        <div className="w-full md:w-1/2 space-y-6">
                           <div className="inline-block px-3 py-1 bg-[#2E2140] text-white text-[9px] font-black uppercase tracking-widest">Case Study</div>
                           <h3 className="text-4xl font-cloude text-slate-900 leading-tight">{articles[3].title}</h3>
                           <ArrowRight size={24} className="text-stone-200 group-hover:text-[#A288E3] group-hover:translate-x-2 transition-all" />
                        </div>
                     </div>
                  </Link>
               </div>

            </div>

            {/* Load More Area */}
            <div className="mt-80 pt-40 pb-20 flex justify-center">
               <button className="bg-[#2E2140] text-white px-16 py-5 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#4B365F] transition-all hover:-translate-y-1 active:scale-95 shadow-xl">
                  Access Older Archives
               </button>
            </div>
         </section>

         <FooterV2 />
      </div>
   );
}
