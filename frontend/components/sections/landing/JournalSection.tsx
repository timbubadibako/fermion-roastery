"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

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

  if (posts.length === 0) return null;

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1, 3);

  return (
    <section id="journal" className="py-24 px-6 border-b border-black/5 bg-[#EBF1F5] relative z-20">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/10 pb-6">
          <div className="space-y-2">
            <span className="inline-block px-3.5 py-1.5 bg-white border border-black/10 text-[9px] font-black uppercase tracking-[0.35em] text-[#367F4D] rounded-sm shadow-sm">
              JURNAL &amp; CERITA ROASTERY
            </span>
            <h2 className="font-cloude text-4xl md:text-6xl text-slate-900 leading-[0.95] relative">
              Catatan <span className="text-[#367F4D]">Fermion.</span>
            </h2>
          </div>

          <Link href="/journal">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-black/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 active:scale-95 shadow-sm">
              <span>{content.viewAll || "LIHAT SEMUA JURNAL"}</span>
              <ArrowRight size={14} />
            </button>
          </Link>
        </div>

        {/* Featured Main Journal Article Card */}
        {featuredPost && (
          <Link href={`/journal/${featuredPost.slug}`} className="block group">
            <div className="bg-white border border-black/10 p-6 md:p-10 rounded-sm transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:border-black/20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Featured Image */}
                <div className="lg:col-span-7 aspect-[16/10] bg-stone-100 rounded-sm overflow-hidden relative border border-black/5">
                  {featuredPost.featured_image ? (
                    <Image
                      src={featuredPost.featured_image}
                      alt={featuredPost.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-6 text-center space-y-2 bg-[#FAF9F6]">
                      <BookOpen size={48} className="text-slate-700" />
                      <span className="font-display font-black text-xl uppercase tracking-widest text-slate-800">FERMION JOURNAL</span>
                    </div>
                  )}

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded-sm shadow-sm">
                      ARTIKEL UTAMA
                    </span>
                  </div>
                </div>

                {/* Featured Text Content */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-[#367F4D]">
                    <BookOpen size={14} />
                    <span>
                      {new Date(featuredPost.published_at || featuredPost.created_at || new Date()).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-2xl md:text-4xl uppercase italic tracking-tight text-slate-900 leading-[1.05] group-hover:text-[#367F4D] transition-colors">
                    {featuredPost.title}
                  </h3>

                  <p className="text-xs md:text-sm text-stone-600 font-medium leading-relaxed border-t border-black/5 pt-4 line-clamp-3">
                    &quot;{featuredPost.excerpt}&quot;
                  </p>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 group-hover:text-[#367F4D]">
                      <span>BACA SELENGKAPNYA</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </Link>
        )}

        {/* Secondary Posts Grid */}
        {otherPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {otherPosts.map((post) => (
              <Link key={post.id} href={`/journal/${post.slug}`} className="block group">
                <div className="bg-white border border-black/10 p-6 rounded-sm space-y-4 transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-md hover:border-black/20">
                  <div className="aspect-[16/9] bg-stone-100 rounded-sm overflow-hidden relative border border-black/5">
                    {post.featured_image ? (
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 bg-[#FAF9F6]">
                        <BookOpen size={32} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#367F4D]">
                      {new Date(post.published_at || post.created_at || new Date()).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>

                    <h4 className="font-display font-black text-xl uppercase tracking-tight text-slate-900 leading-snug group-hover:text-[#367F4D] transition-colors">
                      {post.title}
                    </h4>

                    <p className="text-xs text-stone-600 font-medium line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
