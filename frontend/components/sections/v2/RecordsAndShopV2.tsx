"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sticker } from "@/components/ui/sticker";
import { ArrowRight, Beaker, Loader2 } from "lucide-react";
import { siteContent } from "@/lib/content";

export function NewReleasesV2() {
  const content = siteContent.newReleases;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          // Sort by date or just take the first 3
          setProducts(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewReleases();
  }, []);

  return (
    <section className="bg-white py-60 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[1px] bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
      
      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        <div className="text-center lg:text-left space-y-4">
           <h2 className="text-7xl md:text-8xl font-display font-black italic tracking-tighter text-slate-900">{content.title}</h2>
           <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
           {loading ? (
             [1,2,3].map(i => <div key={i} className="aspect-square bg-slate-50 animate-pulse rounded-[4rem]" />)
           ) : products.map((product) => (
              <div key={product.id} className="space-y-8 group">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="aspect-square bg-slate-50 rounded-[4rem] relative flex items-center justify-center p-16 border border-slate-100 shadow-inner overflow-hidden"
                >
                   {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-[3rem] transition-transform duration-1000 group-hover:scale-110" />
                   ) : (
                      <div className="w-full h-full bg-slate-200/50 rounded-[3rem] transition-transform duration-1000 group-hover:scale-105" />
                   )}
                   <Sticker rotate={12} className="top-10 right-10">{content.stickerSize}</Sticker>
                   <div className="absolute -bottom-4 left-10 bg-white/80 backdrop-blur-xl px-6 py-4 rounded-full border border-white shadow-2xl transition-transform group-hover:-translate-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">✨ {product.notes || 'Curated Selection'}</p>
                   </div>
                </motion.div>

                <div className="px-4 space-y-8">
                   <div className="flex justify-between items-end border-b border-slate-100 pb-8">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-fermion-french-blue uppercase tracking-widest">{product.origin || 'Single Origin'}</p>
                         <h4 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-slate-900">{product.name}</h4>
                      </div>
                      <div className="text-right">
                         <p className="text-3xl font-black text-slate-900 italic">Rp {Number(product.price_retail).toLocaleString('id-ID')}</p>
                      </div>
                   </div>
                   <Link href={`/our-coffee/${product.id}`} className="block">
                      <button className="w-full bg-slate-950 text-white py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.5em] italic hover:bg-fermion-french-blue transition-all shadow-xl active:scale-[0.98]">
                          {content.cta}
                      </button>
                   </Link>
                </div>
              </div>
           ))}
        </div>
      </div>
    </section>
  );
}
