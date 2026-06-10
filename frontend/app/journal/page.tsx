"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, BookOpen, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { Sticker } from "@/components/ui/sticker";
import { FooterV2 } from "@/components/sections/v2/FooterV2";

const articles = [
  {
    id: 1,
    title: "Understanding Natural Yeast Fermentation",
    category: "EDUCATION",
    date: "June 05, 2026",
    img: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Science+of+Coffee"
  },
  {
    id: 2,
    title: "Sourcing in Kendal: Meet the Farmers",
    category: "ORIGIN STORY",
    date: "June 01, 2026",
    img: "https://placehold.co/800x600/f8fafc/cbd5e1?text=The+Producer"
  },
  {
    id: 3,
    title: "How to Dial Your Espresso at Home",
    category: "BREWING",
    date: "May 28, 2026",
    img: "https://placehold.co/800x600/f1f5f9/94a3b8?text=Home+Brewing"
  },
  {
    id: 4,
    title: "The Rise of Micro-Roasting in Cirebon",
    category: "COMMUNITY",
    date: "May 20, 2026",
    img: "https://placehold.co/800x600/e2e8f0/64748b?text=Local+Hero"
  }
];

export default function JournalPageV2() {
  return (
    <div className="bg-[#f8f9fb] min-h-screen relative overflow-hidden font-sans">
      
      {/* Global Aesthetics */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Client%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      <div className="fixed top-[0px] right-[-200px] w-[800px] h-[800px] bg-purple-200/30 rounded-full blur-[120px] z-[-1] pointer-events-none" />
      <div className="fixed bottom-[-100px] left-[-100px] w-[700px] h-[700px] bg-blue-200/20 rounded-full blur-[120px] z-[-1] pointer-events-none" />

      {/* SECTION 1: HEADER & SEARCH */}
      <section className="pt-40 pb-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-10">
           <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-2 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full text-[9px] font-black tracking-[0.4em] text-fermion-blue uppercase flex items-center gap-2 w-fit"
              >
                <BookOpen size={12} /> The Lab Journal
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-display font-black tracking-tighter text-slate-900 uppercase italic leading-[0.85]"
              >
                Stories <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-fermion-blue to-purple-500 font-sans not-italic">Behind the Beans.</span>
              </motion.h1>
           </div>
           
           <motion.div 
             initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
             className="w-full md:w-auto"
           >
             <div className="flex items-center gap-4 bg-white/60 backdrop-blur-2xl border border-white/80 rounded-full px-6 py-4 shadow-xl shadow-slate-900/5 min-w-[300px]">
                <Search size={16} className="text-slate-400" />
                <input type="text" placeholder="Search the archives..." className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest w-full text-slate-900 placeholder:text-slate-400" />
             </div>
           </motion.div>
        </div>
      </section>

      {/* SECTION 2: FEATURED ARTICLE */}
      <section className="py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Link href="/journal/featured">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              className="group cursor-pointer relative overflow-hidden rounded-[3rem] lg:rounded-[4rem] aspect-[4/3] md:aspect-[21/9] border border-white/60 shadow-2xl flex items-end p-8 md:p-16"
            >
               <Image 
                  src="https://placehold.co/1920x800/1e293b/0f172a?text=Highland+Journey" 
                  alt="Featured Article" 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
               
               <Sticker rotate={-6} className="top-10 left-10 hidden md:block" color="var(--cartoon-yellow)" variant="solid">
                 <span className="p-2 text-slate-900">LATEST ENTRY</span>
               </Sticker>

               <div className="relative z-10 max-w-3xl space-y-6">
                  <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-[9px] font-black text-white uppercase tracking-widest">
                     Sourcing Trip
                  </div>
                  <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase italic tracking-tighter leading-[0.9]">
                    The Future of Liberika: <br/> A Highland Journey.
                  </h2>
                  <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed max-w-xl">
                    Discover why the forgotten varietal is making a massive comeback in our latest sourcing trip to the West Java highlands. Read the full field report.
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-fermion-blue group-hover:text-white transition-colors">
                    Read Story <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </div>
               </div>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* SECTION 3: ARTICLES GRID */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 lg:gap-16">
              {articles.map((article, i) => (
                <motion.div 
                  key={article.id} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/journal/${article.id}`} className="group block space-y-8">
                     <div className="artisan-glass p-4 rounded-[3rem] transition-all duration-500 hover:bg-white/60 hover:shadow-2xl hover:-translate-y-2">
                       <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/60">
                          <Image src={article.img} alt={article.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                          <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black tracking-widest text-slate-900 shadow-sm border border-white/20">
                             {article.category}
                          </div>
                       </div>
                       <div className="space-y-4 p-6">
                          <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">{article.date}</p>
                          <h3 className="text-3xl font-display font-black text-slate-900 italic tracking-tighter leading-tight group-hover:text-fermion-blue transition-colors">
                             {article.title}
                          </h3>
                       </div>
                     </div>
                  </Link>
                </motion.div>
              ))}
           </div>

           {/* Load More */}
           <div className="mt-32 text-center">
              <button className="px-10 py-5 bg-white/60 backdrop-blur-xl border border-white/80 rounded-full shadow-lg text-[10px] font-black text-slate-900 tracking-[0.3em] uppercase hover:bg-slate-900 hover:text-white hover:scale-105 transition-all active:scale-95">
                 Explore Archives
              </button>
           </div>
        </div>
      </section>

      <FooterV2 />
    </div>
  );
}
