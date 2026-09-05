"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Plus, ShoppingBag } from "lucide-react";
import { Sticker } from "@/components/ui/sticker";
import { useI18n } from "@/lib/i18n";

export interface ProductCardItem {
  id: string;
  name: string;
  origin?: string | null;
  category?: string | null;
  sub_category?: string | null;
  notes?: string | null;
  lot_number?: string | number | null;
  process?: string | null;
  altitude?: string | null;
  price_retail?: number | null;
  price?: number | null;
  original_price?: number | null;
  image_url?: string | null;
  product_variants?: Array<{
    id?: string;
    weight?: string;
    price: number;
    original_price?: number;
  }>;
}

export interface ProductCardProps {
  product: ProductCardItem;
  index?: number;
  rotate?: boolean;
  sticker?: { text: string; color: string } | null;
  onAddToCart?: (e: React.MouseEvent, product: ProductCardItem) => void;
  className?: string;
}

export function ProductCard({
  product,
  index = 0,
  rotate = false,
  sticker,
  onAddToCart,
  className = "",
}: ProductCardProps) {
  const t = useI18n();

  // Lot number from database or fallback generator
  const lotText = product.lot_number
    ? `LOT #${product.lot_number}`
    : `LOT #${1024 + (index % 100)}`;

  // Parse tasting notes from DB string or provide specialty fallbacks
  const tastingNotesList = product.notes && product.notes.trim().length > 0
    ? product.notes.split(/[,•|]/).map((n) => n.trim()).filter(Boolean)
    : ["SPECIALTY GRADE", "FRESH ROASTED"];

  const displayPrice = Number(
    product.product_variants?.[0]?.price ??
      product.price ??
      product.price_retail ??
      0
  );

  const rotationClass = rotate
    ? index % 2 === 0
      ? "lg:-rotate-[1deg]"
      : "lg:rotate-[1deg]"
    : "rotate-0";

  const categoryTag = product.category || product.sub_category || "WHOLE BEAN";

  return (
    <div
      className={`product-card group bg-[#FDFBF7] border border-black/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] hover:shadow-[10px_10px_0px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-500 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col text-slate-900 ${rotationClass} ${className}`}
    >
      {/* Top Craft Spec Bar */}
      <div className="bg-[#FAF8F3] px-4 sm:px-5 py-2 sm:py-2.5 border-b border-black/10 flex justify-between items-center text-[8.5px] sm:text-[9px] font-black tracking-widest uppercase text-stone-600">
        <span className="inline-flex items-center gap-1 text-[#367F4D] font-bold truncate max-w-[130px] sm:max-w-[170px]">
          <Sparkles size={10} className="shrink-0" />
          <span className="truncate">{product.origin || "INDONESIA"}</span>
        </span>
        <span className="text-stone-400 font-mono tracking-wider shrink-0">{lotText}</span>
      </div>

      {/* Product Image Container */}
      <div className="aspect-[4/3] bg-stone-200 relative overflow-hidden border-b border-black/10 group-hover:bg-stone-300 transition-colors">
        {sticker && (
          <Sticker
            rotate={6}
            className="absolute top-2.5 right-2.5 z-20 border border-black/5 shadow-sm scale-90 sm:scale-100"
            color={sticker.color}
          >
            {sticker.text}
          </Sticker>
        )}

        <Link href={`/our-coffee/${product.id}`} className="block w-full h-full relative">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover grayscale-[0.12] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-display font-black text-2xl sm:text-3xl tracking-widest uppercase text-stone-400 rotate-[-5deg]">
              Fermion
            </div>
          )}
        </Link>

        {/* Category Pill Tag Overlay */}
        <div className="absolute top-2.5 left-2.5 bg-[#1A202C] text-white px-2.5 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[8.5px] font-black uppercase tracking-[0.2em] rounded-xs shadow-md pointer-events-none z-10">
          {categoryTag}
        </div>
      </div>

      {/* Editorial Tasting Spec Content */}
      <div className="p-4 sm:p-5 space-y-3.5 sm:space-y-4 flex-1 flex flex-col justify-between">
        
        {/* Title & Origin Details */}
        <div className="space-y-1">
          <span className="text-[8.5px] sm:text-[9.5px] font-bold text-[#367F4D] uppercase tracking-[0.2em] block truncate">
            {product.origin || "INDONESIA SPECIALTY"}
          </span>

          <Link href={`/our-coffee/${product.id}`}>
            <h3 className="font-display font-black text-base sm:text-lg lg:text-xl uppercase tracking-tight leading-snug text-slate-900 group-hover:text-[#367F4D] transition-colors line-clamp-2 min-h-[2.5rem] sm:min-h-[2.8rem]">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Tasting Notes Chips Spec Grid */}
        <div className="space-y-1.5 pt-2 sm:pt-2.5 border-t border-black/10">
          <span className="text-[8px] sm:text-[8.5px] font-black uppercase tracking-widest text-stone-600 block">
            PROFIL &amp; TASTING NOTES
          </span>

          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {tastingNotesList.slice(0, 3).map((note, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 bg-[#FAF8F3] border border-black/10 text-[8px] sm:text-[8.5px] font-black uppercase tracking-wider text-slate-800 rounded-full shadow-2xs"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2.5 sm:pt-3 border-t border-black/10 flex items-center justify-between gap-2 mt-auto">
          <div className="space-y-0.5 min-w-0 flex-1">
            <span className="text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-widest text-stone-600 block whitespace-nowrap">
              HARGA RETAIL
            </span>
            <span className="font-display font-black text-sm sm:text-base lg:text-lg text-slate-900 tabular-nums whitespace-nowrap block truncate">
              Rp {displayPrice.toLocaleString("id-ID")}
            </span>
          </div>

          {onAddToCart ? (
            <button
              type="button"
              aria-label={`Tambah ${product.name} ke keranjang`}
              onClick={(e) => onAddToCart(e, product)}
              className="bg-[#367F4D] hover:bg-[#2b643d] text-white w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 shadow-md shrink-0 hover:scale-105"
              title="Tambah ke Keranjang"
            >
              <ShoppingBag size={16} strokeWidth={2} />
            </button>
          ) : (
            <Link href={`/our-coffee/${product.id}`}>
              <button 
                type="button"
                className="bg-[#367F4D] hover:bg-[#2b643d] text-white w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 shadow-md shrink-0 hover:scale-105"
                title="Lihat Detail"
              >
                <ArrowRight size={16} strokeWidth={2} />
              </button>
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
