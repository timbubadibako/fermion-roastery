"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sticker } from "@/components/ui/sticker";

gsap.registerPlugin(ScrollTrigger);

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featured_image: string;
  published_at: string;
  created_at?: string;
}

export function JournalSectionV2() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/journal?status=published")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setPosts(data.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    
    let ctx = gsap.context(() => {
      gsap.from(".journal-header", {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      const cards = gsap.utils.toArray<HTMLElement>('.journal-card');
      gsap.from(cards, {
        y: 50,
        rotation: (idx) => idx % 2 === 0 ? 1 : -2,
        stagger: 0.15,
        duration: 1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, posts]);

  if (!loading && posts.length === 0) return null;

  return (
    <section 
      ref={sectionRef}
      // Light side of the zig-zag (Pale Beige / Old Paper)
      className="py-40 relative z-10 -mt-32 overflow-hidden bg-[#F4F0E6]"
    >
      {/* Paper Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Giant faded text background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-cloude text-black opacity-5 pointer-events-none select-none rotate-[-5deg]">
         Chronicle
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 my-20 journal-header">
          <div className="space-y-4 relative">
             <Sticker rotate={15} className="-top-12 -left-8 hidden md:block border border-black/10 shadow-sm" color="#8CADD8" variant="dashed">
               Read Me
             </Sticker>
             
             <div className="flex items-center gap-3 text-black">
                <BookOpen size={24} strokeWidth={2} />
                <span className="text-[12px] font-black uppercase tracking-[0.4em] bg-white px-2 border border-black/10 shadow-[4px_4px_0_rgba(0,0,0,0.03)] rotate-[-2deg]">
                  Roastery Journal
                </span>
             </div>
             <h2 className="text-6xl md:text-7xl font-cloude tracking-tighter text-slate-900 leading-[0.85] pt-4">
                Stories from <br/>
                <span className="font-display italic text-[#367F4D]">the Field.</span>
             </h2>
          </div>
          
          <Link href="/journal" className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-black hover:text-[#367F4D] transition-all duration-300 pb-2 bg-white px-6 py-3 border border-black/10 shadow-sm rotate-[1deg] hover:-translate-y-1 hover:scale-105 active:scale-95">
             <span>Browse All</span>
             <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
           <div className="w-full aspect-[21/9] bg-white border border-black/5 animate-pulse shadow-sm" />
        ) : (
           posts.length > 0 && (
             <div className="relative">
                {/* Decorative Tape */}
                <div className="absolute -top-4 right-10 w-32 h-10 bg-white/40 border border-black/5 rotate-[3deg] backdrop-blur-sm shadow-sm z-30"></div>
                <div className="absolute -bottom-6 left-12 w-24 h-8 bg-fermion-french-blue/10 border border-black/5 rotate-[-5deg] backdrop-blur-sm shadow-sm z-30"></div>

                <Link href={`/journal/${posts[0].slug}`} className="group block w-full bg-white border border-black/10 shadow-[8px_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[12px_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 p-4 md:p-6 lg:p-8 relative z-20">
                   <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
                      
                      {/* Left: Huge Image */}
                      <div className="w-full lg:w-3/5 aspect-square lg:aspect-[4/3] relative overflow-hidden bg-stone-100 border border-black/5">
                         {posts[0].featured_image ? (
                            <img 
                              src={posts[0].featured_image} 
                              alt={posts[0].title}
                              className="w-full h-full object-cover filter contrast-110 sepia-[0.1] group-hover:sepia-0 group-hover:scale-105 transition-all duration-1000"
                            />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                               <BookOpen size={64} />
                            </div>
                         )}
                         {/* Badge overlay */}
                         <div className="absolute top-6 left-6 bg-[#2E2140] text-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F1B941] animate-pulse"></span>
                            LATEST DISPATCH
                         </div>
                      </div>

                      {/* Right: Content */}
                      <div className="w-full lg:w-2/5 flex flex-col justify-center space-y-6 lg:pr-8 pb-8 lg:pb-0">
                         <div className="flex items-center gap-4">
                            <div className="h-px w-12 bg-fermion-french-blue"></div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-fermion-french-blue">
                               {new Date(posts[0].published_at || posts[0].created_at || new Date()).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </span>
                         </div>
                         
                         <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-slate-900 leading-[0.9] italic tracking-tight group-hover:text-fermion-french-blue transition-colors">
                            {posts[0].title}
                         </h3>
                         
                         <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-lg pt-4 border-t border-black/5">
                            "{posts[0].excerpt}"
                         </p>

                         <div className="pt-6">
                            <div className="inline-flex items-center justify-center gap-3 bg-white border border-black/10 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-900 group-hover:bg-[#2E2140] group-hover:text-white group-hover:border-transparent transition-all duration-300">
                               <span>Read Field Report</span>
                               <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                         </div>
                      </div>

                   </div>
                </Link>
             </div>
           )
        )}

      </div>
    </section>
  );
}
