"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";
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

interface JournalSectionProps {
  initialPosts: Post[];
}

export function JournalSection({ initialPosts }: JournalSectionProps) {
  const t = useI18n();
  const content = t.landing.journal;
  const [posts] = useState<Post[]>(initialPosts);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          x: -50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        });
      }

      if (featureRef.current) {
        gsap.from(featureRef.current, {
          y: 50,
          rotation: 1,
          duration: 1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: featureRef.current,
            start: "top 80%",
          }
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [posts]);

  if (posts.length === 0) return null;

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-24 px-6 relative z-30 overflow-hidden bg-[#F7F2FA] border-b border-purple-900/5 flex flex-col justify-center"
    >
      {/* Paper Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("/textures/grain-noise.svg")' }}></div>

      {/* Giant faded text background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-sans font-black uppercase text-purple-950 opacity-[0.035] pointer-events-none select-none tracking-tighter rotate-[-5deg]">
         Chronicle
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
        
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 md:mb-10">
          <div className="space-y-4 relative">
             <div className="flex items-center gap-3 text-slate-900">
                <BookOpen size={22} strokeWidth={2.5} className="text-[#523B59]" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-[0.35em] bg-[#392438] text-white px-3 py-1 border border-[#392438] shadow-xs rotate-[-1deg] rounded-xs">
                  Jurnal Roastery
                </span>
             </div>
             <h2 className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tight uppercase text-slate-900 leading-[0.85] pt-4">
                Stories <br/>
                <span className="font-display italic font-normal normal-case text-[#6B5377]">from the field.</span>
             </h2>
          </div>
          
          <Link href="/journal" className="group flex items-center gap-4 text-xs font-mono font-bold uppercase tracking-[0.2em] text-slate-900 hover:text-[#392438] transition-all duration-300 pb-2 bg-white px-6 py-3 border border-purple-900/10 shadow-xs rotate-[1deg] hover:-translate-y-1 hover:scale-105 active:scale-95 rounded-xs">
             <span>{content.viewAll}</span>
             <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {posts.length > 0 && (
             <div ref={featureRef} className="relative">
                {/* Decorative Tape */}
                <div className="absolute -top-4 right-10 w-32 h-10 bg-purple-100/40 border border-purple-900/10 rotate-[3deg] backdrop-blur-sm shadow-xs z-30"></div>
                <div className="absolute -bottom-6 left-12 w-24 h-8 bg-purple-200/30 border border-purple-900/10 rotate-[-5deg] backdrop-blur-sm shadow-xs z-30"></div>

                <Link href={`/journal/${posts[0].slug}`} className="group block w-full bg-white border border-purple-900/10 shadow-[8px_12px_40px_rgba(57,36,56,0.05)] hover:shadow-[12px_20px_50px_rgba(57,36,56,0.08)] transition-all duration-500 hover:-translate-y-2 p-4 md:p-6 lg:p-8 relative z-20 rounded-xs">
                   <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
                      
                      {/* Left: Huge Image */}
                      <div className="w-full lg:w-3/5 aspect-square lg:aspect-[4/3] relative overflow-hidden bg-purple-50/30 border border-purple-900/5">
                         {posts[0].featured_image ? (
                            <Image
                              src={posts[0].featured_image}
                              alt={posts[0].title}
                              fill
                              sizes="(max-width: 1024px) 100vw, 60vw"
                              className="object-cover filter contrast-105 group-hover:scale-105 transition-all duration-1000"
                            />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center text-purple-300">
                               <BookOpen size={64} />
                            </div>
                         )}
                         {/* Badge overlay */}
                         <div className="absolute top-6 left-6 bg-[#392438] text-white px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] flex items-center gap-2 rounded-xs shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D8B4FE] animate-pulse"></span>
                            TERBARU
                         </div>
                      </div>

                      {/* Right: Content */}
                      <div className="w-full lg:w-2/5 flex flex-col justify-center space-y-6 lg:pr-8 pb-8 lg:pb-0">
                         <div className="flex items-center gap-4">
                            <div className="h-px w-12 bg-[#6B5377]"></div>
                            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#6B5377]">
                               {new Date(posts[0].published_at || posts[0].created_at || new Date()).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </span>
                         </div>
                         
                         <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-slate-900 leading-[0.9] italic tracking-tight group-hover:text-[#392438] transition-colors">
                            {posts[0].title}
                         </h3>
                         
                         <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-lg pt-4 border-t border-purple-900/10">
                            &quot;{posts[0].excerpt}&quot;
                         </p>

                         <div className="pt-6">
                            <div className="inline-flex items-center justify-center gap-3 bg-slate-900 text-white border border-transparent px-6 py-3 text-xs font-mono font-bold uppercase tracking-widest group-hover:bg-[#392438] transition-all duration-300 rounded-xs shadow-xs">
                               <span>{content.readReport}</span>
                               <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                         </div>
                      </div>

                   </div>
                </Link>
             </div>
        )}

      </div>
    </section>
  );
}
