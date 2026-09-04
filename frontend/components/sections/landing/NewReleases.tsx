"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

interface NewReleaseProduct {
  id: string;
  image_url?: string | null;
  name: string;
  origin?: string | null;
  category?: string | null;
  notes?: string | null;
  price_retail?: number | null;
}

interface NewReleasesProps {
  initialProducts: NewReleaseProduct[];
}

export function NewReleases({ initialProducts }: NewReleasesProps) {
  const t = useI18n();
  const content = t.landing.newReleases;
  const [products] = useState(initialProducts);

  return (
    <section id="new-releases" className="py-24 px-6 border-b border-black/5 bg-[#FDFBF7] relative z-20">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/10 pb-6">
          <div className="space-y-2">
            <span className="inline-block px-3.5 py-1.5 bg-white border border-black/10 text-[9px] font-black uppercase tracking-[0.35em] text-[#367F4D] rounded-sm shadow-sm">
              KOLEKSI RILIS TERBARU
            </span>
            <h2 className="font-cloude text-4xl md:text-6xl text-slate-900 leading-[0.95] relative">
              Single Origin <span className="text-[#367F4D]">Pilihan.</span>
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-stone-600 uppercase tracking-wider bg-white/80 px-4 py-2 border border-black/5 rounded-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#367F4D] animate-pulse"></span>
            <span>Sangrai Segar • Bebas Fee Marketplace</span>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length === 0 ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] bg-stone-100 animate-pulse border border-black/5 rounded-sm" />
            ))
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-black/10 p-6 rounded-sm space-y-5 transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:border-black/20 group flex flex-col justify-between"
              >
                {/* Product Image Container */}
                <div className="aspect-square bg-[#FAF9F6] rounded-sm overflow-hidden relative border border-black/5 group">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-6 text-center space-y-2">
                      <span className="font-display font-black text-2xl uppercase tracking-widest text-slate-800">FERMION</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">SPECIALTY COFFEE</span>
                    </div>
                  )}

                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-black/10 text-[8px] font-black uppercase tracking-widest text-slate-900 rounded-sm shadow-sm">
                      {product.category || "WHOLE BEAN"}
                    </span>
                  </div>
                </div>

                {/* Product Meta & Title */}
                <div className="space-y-3 flex-1">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-[#367F4D]">
                    <span>{product.origin || "INDONESIA SINGLE ORIGIN"}</span>
                    <span>FRESH ROAST</span>
                  </div>

                  <h3 className="font-display font-black text-2xl uppercase tracking-tight text-slate-900 leading-tight">
                    {product.name}
                  </h3>

                  {product.notes && (
                    <p className="text-xs text-stone-600 font-medium line-clamp-2 leading-relaxed bg-[#FAF9F6] p-2.5 border border-black/5 rounded-sm">
                      <span className="font-bold text-slate-900 uppercase text-[9px] tracking-wider">NOTES: </span>
                      {product.notes}
                    </p>
                  )}
                </div>

                {/* Price & Action Button */}
                <div className="pt-4 border-t border-black/5 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">HARGA RETAIL</span>
                    <span className="font-display font-black text-xl text-slate-900">
                      Rp {Number(product.price_retail || 0).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <Link href={`/our-coffee/${product.id}`} className="block">
                    <button className="w-full bg-slate-900 text-white py-3.5 px-6 rounded-full text-[10px] font-black uppercase tracking-[0.25em] hover:bg-[#367F4D] transition-all duration-300 active:scale-95 shadow-md flex items-center justify-center gap-2">
                      <span>LIHAT DETAIL &amp; BELI</span>
                      <span>➔</span>
                    </button>
                  </Link>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
