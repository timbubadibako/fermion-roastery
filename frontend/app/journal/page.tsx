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

const dateFormatted = (dateStr: string) => {
   if (!dateStr) return "";
   const date = new Date(dateStr);
   return date.toLocaleDateString("en-US", { day: "2-digit", month: "short" }).toUpperCase();
};

export default function JournalPageV2() {
   const [mounted, setMounted] = useState(false);
   const [posts, setPosts] = useState<any[]>([]);
   
   const heroRef = useRef<HTMLElement>(null);
   const gridRef = useRef<HTMLDivElement>(null);
   const exploreRef = useRef<HTMLDivElement>(null);

   useEffect(() => { 
      setMounted(true);
      fetch('/api/journal')
         .then(res => res.json())
         .then(data => {
            if (Array.isArray(data)) setPosts(data);
         })
         .catch(console.error);
   }, []);

   const pinnedPosts = posts.filter(p => p.is_pinned).slice(0, 4);
   const explorePosts = posts.filter(p => !p.is_pinned);

   // 1. Hero text animation runs immediately
   useEffect(() => {
      if (!mounted) return;
      let ctx = gsap.context(() => {
         const heroText = gsap.utils.toArray(".journal-hero-text");
         if (heroText.length > 0) {
            gsap.fromTo(heroText, { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: "power3.out" });
         }
      });
      return () => ctx.revert();
   }, [mounted]);

   // 2. Article cards animation runs only when posts are loaded
   useEffect(() => {
      if (!mounted || posts.length === 0) return;
      
      let ctx = gsap.context(() => {
         if (gridRef.current) {
            const cards = gsap.utils.toArray<HTMLElement>('.article-scrap', gridRef.current);
            if (cards.length > 0) {
               gsap.fromTo(cards, {
                  y: 100,
                  opacity: 0,
               }, {
                  y: 0,
                  opacity: 1,
                  stagger: 0.2,
                  duration: 1.2,
                  ease: "back.out(1.2)",
                  scrollTrigger: { trigger: gridRef.current, start: "top 80%" }
               });
            }
         }
         ScrollTrigger.refresh();
      });

      return () => ctx.revert();
   }, [mounted, posts.length]);

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
                  <div className="inline-block px-4 py-1.5 bg-[#392438] shadow-sm rotate-[-1deg] text-[10px] font-black tracking-[0.4em] text-white uppercase journal-hero-text opacity-0">
                     <PenTool size={12} className="inline mr-2" /> Field Notes & Records
                  </div>

                  {/* 🟢 UPDATE JUDUL: text-stone-900 (Charcoal) & aksen Bright Purple untuk "the Field." */}
                  <h1 id="tour-journal-hero" className="text-5xl md:text-7xl font-cloude tracking-tighter leading-[0.8] journal-hero-text opacity-0 text-stone-900">
                     Stories from <br /> <span className="font-display italic text-[#A855F7]">the Field.</span>
                  </h1>
               </div>

               <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 journal-hero-text opacity-0">
                  {/* 🟢 UPDATE DESKRIPSI: Dibuat lebih gelap (text-stone-700) agar tajam dibaca */}
                  <p className="max-w-xl text-stone-700 font-medium text-lg leading-relaxed border-l-2 border-purple-300 pl-6">
                     A repository of sourcing journals, sensory analysis, and technical records from the Fermion Laboratory.
                  </p>

                  {/* 🟢 UPDATE SEARCH BAR: Disesuaikan menggunakan border gelap transparan agar stand out di background terang */}
                  <div id="tour-journal-search" className="flex items-center gap-4 bg-stone-950/5 border border-stone-950/10 rounded-full px-6 py-3.5 min-w-[320px] backdrop-blur-sm focus-within:border-purple-500/30 focus-within:bg-stone-950/10 transition-all group/search">
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
            <div id="tour-journal-grid" ref={gridRef} className="max-w-7xl mx-auto relative min-h-[1000px] pt-20">

               {/* Article 1: Large Center-Left */}
               {pinnedPosts[0] && (
               <div className="article-scrap opacity-0 absolute top-0 left-0 w-full lg:w-[60%] z-20">
                  <Link href={`/journal/${pinnedPosts[0].slug}`} className="group block bg-white p-6 md:p-10 border border-black/10 shadow-[20px_20px_0px_rgba(46,33,64,0.02)] rotate-[-1deg] rounded-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[30px_30px_0px_rgba(46,33,64,0.03)]">
                     <div className="absolute top-[-15px] left-1/3 w-32 h-8 bg-[#A288E3]/20 border border-black/5 rotate-[2deg] backdrop-blur-sm z-30 shadow-sm opacity-80"></div>
                     <div className="aspect-square relative overflow-hidden rounded-sm border border-black/5 mb-10 bg-stone-50">
                        <Image src={pinnedPosts[0].featured_image || 'https://placehold.co/800x800/4B365F/e2dacb?text=LAB+PROCESS'} alt={pinnedPosts[0].title} fill className="object-cover filter contrast-125 grayscale group-hover:grayscale-0 transition-all duration-1000" />
                        <Sticker rotate={-10} className="top-6 left-6" color="#F1B941">LATEST ENTRY</Sticker>
                     </div>
                     <div className="space-y-6">
                        <div className="flex items-center gap-4 text-[#A288E3]">
                           <Microscope size={18} strokeWidth={2.5} />
                           <span className="text-[10px] font-black uppercase tracking-[0.4em]">{pinnedPosts[0].category}</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-display font-black text-slate-900 leading-[0.9] tracking-tighter uppercase italic">{pinnedPosts[0].title}</h2>
                        <p className="text-stone-500 text-lg max-w-xl font-medium leading-relaxed italic">"{pinnedPosts[0].excerpt}"</p>
                     </div>
                  </Link>
               </div>
               )}

               {/* Article 2: Small Right Sticky */}
               {pinnedPosts[1] && (
               <div className="article-scrap opacity-0 absolute top-32 right-0 w-full lg:w-[35%] z-30">
                  <Link href={`/journal/${pinnedPosts[1].slug}`} className="group block bg-white p-8 border border-black/10 shadow-xl rotate-[3deg] rounded-sm transition-all duration-500 hover:rotate-0 hover:-translate-y-4">
                     <div className="absolute -top-4 right-10 w-4 h-12 border-4 border-stone-200 rounded-full rotate-12"></div>
                     <div className="aspect-square relative overflow-hidden mb-6 bg-stone-100">
                        <Image src={pinnedPosts[1].featured_image || 'https://placehold.co/800x800/e2dacb/4B365F?text=FIELD+WORK'} alt={pinnedPosts[1].title} fill className="object-cover filter sepia-[0.4]" />
                     </div>
                     <div className="space-y-4">
                        <p className="text-[10px] font-black text-[#A288E3] uppercase tracking-widest">{dateFormatted(pinnedPosts[1].published_at)} / FIELD REPORT</p>
                        <h3 className="text-3xl font-cloude text-slate-900 leading-none">{pinnedPosts[1].title}</h3>
                        <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                           <span className="text-[9px] font-black uppercase tracking-widest text-stone-300 group-hover:text-[#A288E3]">Open File</span>
                           <ArrowRight size={14} className="text-stone-200 group-hover:text-[#A288E3]" />
                        </div>
                     </div>
                  </Link>
               </div>
               )}

               {/* Article 3: Medium Bottom-Right */}
               {pinnedPosts[2] && (
               <div className="article-scrap opacity-0 absolute top-[500px] right-[10%] w-full lg:w-[45%] z-10">
                  <Link href={`/journal/${pinnedPosts[2].slug}`} className="group block bg-stone-50 p-10 border border-black/5 shadow-md rotate-[-2deg] rounded-sm hover:bg-white hover:shadow-2xl transition-all duration-500">
                     <div className="aspect-[4/3] relative overflow-hidden mb-8">
                        <Image src={pinnedPosts[2].featured_image || 'https://placehold.co/800x800/2E2140/f4f0e6?text=HOME+BREW'} alt={pinnedPosts[2].title} fill className="object-cover filter contrast-125 saturate-50" />
                     </div>
                     <h3 className="text-4xl font-display font-black text-slate-900 leading-none uppercase italic tracking-tighter">{pinnedPosts[2].title}</h3>
                     <p className="text-sm text-stone-400 font-medium mt-4 line-clamp-2">{pinnedPosts[2].excerpt}</p>
                  </Link>
               </div>
               )}

               {/* Decorative Note */}
               <div className="article-scrap opacity-0 absolute top-[700px] left-[5%] w-full lg:w-[25%] rotate-[8deg] bg-[#EBA294]/10 p-8 border border-[#EBA294]/20 hidden lg:block">
                  <Quote size={32} className="text-[#EBA294] opacity-30 mb-4" />
                  <p className="text-[13px] font-medium text-[#2E2140] leading-relaxed italic">
                     "The archive is not just a collection of past roasts, but a roadmap for future rituals."
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest mt-6 text-[#2E2140]/40">— Curator's Note</p>
               </div>

               {/* Article 4: Large Bottom-Center */}
               {pinnedPosts[3] && (
               <div className="article-scrap opacity-0 absolute top-[800px] left-[30%] w-full lg:w-[50%] z-20">
                  <Link href={`/journal/${pinnedPosts[3].slug}`} className="group block bg-white p-6 border border-black/10 shadow-[15px_15px_0px_rgba(0,0,0,0.02)] rotate-[1deg] rounded-sm transition-all duration-500 hover:scale-[1.02]">
                     <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-full md:w-1/2 aspect-square relative overflow-hidden rounded-sm border border-black/5">
                           <Image src={pinnedPosts[3].featured_image || 'https://placehold.co/800x800/4B365F/ffffff?text=LOCAL+HERO'} alt={pinnedPosts[3].title} fill className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000" />
                        </div>
                        <div className="w-full md:w-1/2 space-y-6">
                           <div className="inline-block px-3 py-1 bg-[#2E2140] text-white text-[9px] font-black uppercase tracking-widest">{pinnedPosts[3].category}</div>
                           <h3 className="text-4xl font-cloude text-slate-900 leading-tight">{pinnedPosts[3].title}</h3>
                           <ArrowRight size={24} className="text-stone-200 group-hover:text-[#A288E3] group-hover:translate-x-2 transition-all" />
                        </div>
                     </div>
                  </Link>
               </div>
               )}

            </div>


            {/* Explore Section (Small Cards) */}
            <div id="tour-journal-explore" ref={exploreRef} className="mt-10 pt-10 pb-20 max-w-7xl mx-auto">
               <div className="flex items-center gap-4 mb-12">
                  <div className="h-1 w-12 bg-[#2E2140]"></div>
                  <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-[#2E2140]">Explore The Archives</h3>
               </div>
               
               <div className="flex overflow-x-auto gap-6 pb-8 pt-4 px-2 -mx-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {explorePosts.map((post) => (
                     <Link key={post.id} href={`/journal/${post.slug}`} className="group block bg-white border border-black/5 rounded-sm p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 min-w-[220px] md:min-w-[240px] lg:min-w-[260px] snap-start shrink-0">
                        <div className="aspect-square relative overflow-hidden rounded-sm mb-4 bg-stone-100">
                           <Image src={post.featured_image || `https://placehold.co/500x500/eaeaea/2A1619?text=${post.category}`} alt={post.title} fill className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <div className="space-y-3">
                           <p className="text-[9px] font-black uppercase tracking-widest text-[#A288E3]">{dateFormatted(post.published_at)}</p>
                           <h4 className="text-xl font-cloude text-slate-900 leading-tight line-clamp-2 group-hover:text-[#A288E3] transition-colors">{post.title}</h4>
                           <p className="text-xs text-stone-500 font-medium line-clamp-3">{post.excerpt}</p>
                        </div>
                     </Link>
                  ))}
               </div>

               {explorePosts.length === 0 && (
                  <div className="text-center text-stone-500 py-12 italic border border-dashed border-stone-300">
                     No more articles found in the archive.
                  </div>
               )}
            </div>
         </section>

         <FooterV2 />
      </div>
   );
}
