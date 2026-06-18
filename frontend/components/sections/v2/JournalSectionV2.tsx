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

        {/* Posts Grid - Scrapbook Stack */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {loading ? (
             [1,2,3].map(i => (
                <div key={i} className="aspect-[4/5] bg-white border border-black/5 shadow-[8px_8px_0_rgba(0,0,0,0.02)] animate-pulse" style={{ transform: `rotate(1deg)` }} />
             ))
          ) : (
            posts.map((post, i) => (
              <div 
                key={post.id}
                className="journal-card group cursor-pointer relative flex flex-col"
              >
                <Link href={`/journal/${post.slug}`} className="h-full">
                  <div 
                    className="bg-white p-6 pb-8 border border-black/10 hover:border-black/20 hover:-translate-y-2 hover:scale-[1.02] shadow-[8px_8px_0px_rgba(0,0,0,0.02)] hover:shadow-[12px_12px_0px_rgba(0,0,0,0.04)] transition-all duration-500 h-full flex flex-col"
                    style={{ borderRadius: "4px 2px 6px 3px" }}
                  >
                     {/* Masking tape effect */}
                     <div className="absolute top-[-8px] right-10 w-16 h-5 bg-white/60 border border-black/5 rotate-[8deg] z-20 backdrop-blur-sm shadow-sm"></div>

                     {/* Image Container */}
                     <div className="aspect-[4/5] overflow-hidden relative bg-slate-50 mb-6 rounded-sm">
                        {post.featured_image ? (
                          <img 
                            src={post.featured_image} 
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                             <BookOpen size={48} />
                          </div>
                        )}
                        
                        {/* Date Stamp */}
                        <div className="absolute bottom-4 left-4">
                           <div className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-full border border-black/5 shadow-sm flex items-center gap-2">
                              <Calendar size={12} className="text-fermion-french-blue" />
                              <span className="text-[9px] font-black uppercase tracking-widest">
                                 {new Date(post.published_at || post.created_at || new Date()).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                              </span>
                           </div>
                        </div>
                     </div>

                     {/* Content - Typed Note */}
                     <div className="flex-1 flex flex-col px-2 relative">
                        <h3 className="text-2xl font-display font-black uppercase tracking-tight text-slate-900 group-hover:text-fermion-french-blue transition-colors leading-tight mb-3 relative z-10">
                           {post.title}
                        </h3>
                        
                        {/* Squiggly line separator */}
                        <svg className="w-12 opacity-20 mb-4" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M 0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5" stroke="currentColor" fill="transparent" strokeWidth="2" strokeLinecap="round" />
                        </svg>

                        <p className="text-sm text-slate-500 font-sans font-medium line-clamp-3 leading-relaxed relative z-10">
                           {post.excerpt}
                        </p>
                        
                        <div className="pt-6 mt-auto">
                           <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-fermion-french-blue transition-colors relative z-10">
                             <span>Read Full Story</span>
                             <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                           </div>
                        </div>
                     </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
