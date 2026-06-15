"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar, ChevronRight } from "lucide-react";

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

  useEffect(() => {
    fetch("/api/journal?status=published")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setPosts(data.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-32 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
             <div className="flex items-center gap-3 text-fermion-french-blue">
                <BookOpen size={20} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Roastery Journal</span>
             </div>
             <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
                Stories from <br/> the Field.
             </h2>
          </div>
          <Link href="/journal" className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-fermion-french-blue transition-colors pb-2">
             <span>Browse All Entries</span>
             <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-fermion-french-blue transition-all">
                <ArrowRight size={16} />
             </div>
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {loading ? (
             [1,2,3].map(i => (
                <div key={i} className="space-y-6 animate-pulse">
                   <div className="aspect-[4/5] bg-slate-100 rounded-[3rem]" />
                   <div className="h-4 bg-slate-100 w-2/3 rounded-full" />
                   <div className="h-20 bg-slate-50 rounded-2xl" />
                </div>
             ))
          ) : (
            posts.map((post, i) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link href={`/journal/${post.slug}`}>
                  <div className="space-y-8">
                     {/* Image Container */}
                     <div className="aspect-[4/5] overflow-hidden rounded-[3.5rem] relative bg-slate-100">
                        {post.featured_image ? (
                          <img 
                            src={post.featured_image} 
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-200">
                             <BookOpen size={48} />
                          </div>
                        )}
                        <div className="absolute top-6 left-6">
                           <div className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white/50">
                              <Calendar size={12} className="text-fermion-french-blue" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">
                                 {new Date(post.published_at || post.created_at || new Date()).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                              </span>
                           </div>
                        </div>
                     </div>

                     {/* Content */}
                     <div className="space-y-4 px-2">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 group-hover:text-fermion-french-blue transition-colors leading-tight">
                           {post.title}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed">
                           {post.excerpt}
                        </p>
                        <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-fermion-french-blue opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                           <span>Read Full Story</span>
                           <ChevronRight size={14} />
                        </div>
                     </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>

      </div>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-black text-slate-50 opacity-[0.03] select-none pointer-events-none uppercase italic italic tracking-tighter">
         Chronicle.
      </div>
    </section>
  );
}
