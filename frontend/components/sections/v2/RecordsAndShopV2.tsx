"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sticker } from "@/components/ui/sticker";
import { ArrowRight, Beaker, Loader2 } from "lucide-react";
import { siteContent } from "@/lib/content";

/**
 * SECTION 5 & 6: LAB RECORDS & NEW RELEASES
 * Integrated with real database data.
 */
export function LabRecordsV2() {
  const content = siteContent.labRecords;
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetch("/api/content/batches");
        if (res.ok) {
          const data = await res.json();
          setBatches(data);
        }
      } catch (error) {
        console.error("Failed to fetch batches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-40 px-6 space-y-16">
      <div className="flex items-end justify-between border-b-2 border-slate-900 pb-8 relative">
        <div className="space-y-2">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900">{content.title}</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{content.subtitle}</p>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-fermion-french-blue transition-colors group">
           {content.ctaExplore} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 -mx-4">
        {loading ? (
          <div className="col-span-3 h-64 flex items-center justify-center"><Loader2 className="animate-spin text-slate-200" /></div>
        ) : batches.length === 0 ? (
          <div className="col-span-3 text-center py-20 bg-slate-50 rounded-[3rem] text-slate-300 font-black uppercase tracking-widest text-[10px]">No laboratory records found</div>
        ) : (
          batches.map((batch, idx) => (
            <motion.div 
              key={batch.id}
              whileHover={{ y: -10 }}
              className="aspect-square bg-white/20 backdrop-blur-[40px] border border-white/50 rounded-[3rem] p-12 flex flex-col justify-end group cursor-pointer relative overflow-hidden shadow-xl"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-fermion-lavender/5 rounded-full -mr-16 -mt-16 blur-2xl" />
               <Sticker rotate={idx % 2 === 0 ? 6 : -4} className="top-10 right-10">Batch #{batch.batch_number}</Sticker>
               
               <div className="space-y-4 relative z-10">
                  <h4 className="text-3xl font-black uppercase italic leading-tight text-slate-900">{batch.product_name}<br/>Analysis</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase">Origin</span>
                        <span className="text-xs font-bold text-slate-900 uppercase">{batch.origin}</span>
                    </div>
                    <div className="w-[1px] h-8 bg-slate-100" />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase">Process</span>
                        <span className="text-xs font-bold text-slate-900 uppercase">{batch.process}</span>
                    </div>
                  </div>
               </div>
            </motion.div>
          ))
        )}

        {/* CTA Card - Show only if we have room or at the end */}
        {batches.length < 3 && !loading && (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="aspect-square bg-slate-950 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center space-y-8 shadow-2xl shadow-slate-900/40 relative overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(122,156,255,0.15),transparent)]" />
             <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-fermion-french-blue backdrop-blur-xl border border-white/10 mb-2">
                <Beaker size={28} strokeWidth={2.5} />
             </div>
             <div className="space-y-2">
                <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{content.ctaDiveTitle}</h4>
                <p className="text-slate-500 text-xs font-medium max-w-[220px] mx-auto leading-relaxed">{content.ctaDiveDesc}</p>
             </div>
             <button className="bg-fermion-french-blue text-white px-10 py-5 rounded-2xl text-[9px] font-black uppercase tracking-widest italic shadow-xl hover:bg-white hover:text-slate-900 transition-all active:scale-95">
                {content.ctaDiveBtn}
             </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

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
