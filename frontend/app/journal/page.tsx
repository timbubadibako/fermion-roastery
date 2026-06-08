"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Search } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "Understanding Natural Yeast Fermentation",
    category: "EDUCATION",
    date: "June 05, 2026",
    img: "https://placehold.co/800x600/7a9cff/ffffff?text=Science+of+Coffee"
  },
  {
    id: 2,
    title: "Sourcing in Kendal: Meet the Farmers",
    category: "ORIGIN STORY",
    date: "June 01, 2026",
    img: "https://placehold.co/800x600/ffd700/0f172a?text=The+Producer"
  },
  {
    id: 3,
    title: "How to Dial Your Espresso at Home",
    category: "BREWING",
    date: "May 28, 2026",
    img: "https://placehold.co/800x600/ff4b4b/ffffff?text=Home+Brewing"
  },
  {
    id: 4,
    title: "The Rise of Micro-Roasting in Cirebon",
    category: "COMMUNITY",
    date: "May 20, 2026",
    img: "https://placehold.co/800x600/0f172a/ffffff?text=Local+Hero"
  }
];

export default function JournalPage() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-32 pb-40">
      <div className="max-w-6xl mx-auto px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
           <div className="space-y-4">
              <p className="text-[10px] font-black text-fermion-blue tracking-[0.4em] uppercase">The Fermion Journal</p>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase italic">
                 Stories <br/> Behind the Beans.
              </h1>
           </div>
           <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-full px-6 py-3 shadow-sm max-w-xs w-full">
              <Search size={16} className="text-slate-300" />
              <input type="text" placeholder="Search articles..." className="bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest w-full" />
           </div>
        </div>

        {/* Featured Article */}
        <div className="group cursor-pointer mb-24 relative overflow-hidden rounded-[3rem] aspect-[21/9] border border-slate-100 shadow-sm">
           <Image 
              src="https://placehold.co/1920x800/7a9cff/ffffff?text=FEATURED+JOURNAL" 
              alt="Featured Article" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-12">
              <div className="max-w-2xl space-y-4">
                 <p className="text-[10px] font-black tracking-widest text-fermion-blue uppercase">LATEST STORY</p>
                 <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight">The Future of Liberika: <br/> A Highland Journey.</h2>
                 <p className="text-white/70 text-sm font-medium leading-relaxed">Discover why the forgotten varietal is making a massive comeback in our latest sourcing trip to the West Java highlands.</p>
              </div>
           </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           {articles.map((article) => (
             <Link key={article.id} href={`/journal/${article.id}`} className="group space-y-6">
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 shadow-sm">
                   <Image src={article.img} alt={article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black tracking-widest text-slate-900 shadow-sm border border-white/20">
                      {article.category}
                   </div>
                </div>
                <div className="space-y-2 px-2">
                   <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{article.date}</p>
                   <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight group-hover:text-fermion-blue transition-colors">
                      {article.title}
                   </h3>
                </div>
             </Link>
           ))}
        </div>

        {/* Load More */}
        <div className="mt-24 text-center">
           <button className="text-[11px] font-black text-slate-900 tracking-[0.3em] uppercase border-b-2 border-slate-900 pb-2 hover:text-fermion-blue hover:border-fermion-blue transition-all">
              Load More Stories
           </button>
        </div>
      </div>
    </div>
  );
}
