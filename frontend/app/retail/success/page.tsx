"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Package, Truck, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";

export default function OrderSuccessPage() {
  const [mounted, setMounted] = useState(false);
  const { removeItems } = useCartStore();

  useEffect(() => { 
    setMounted(true); 
    const purchasedIds = sessionStorage.getItem('purchasedLineItemIds');
    if (purchasedIds) {
        try {
            const idsToRemove = JSON.parse(purchasedIds);
            removeItems(idsToRemove);
            sessionStorage.removeItem('purchasedLineItemIds');
        } catch (e) { console.error("Failed to parse purchased IDs", e); }
    }
  }, [removeItems]);

  if (!mounted) return null;

  return (
    <div className="bg-[#F4F0E6] min-h-screen pt-40 pb-20 px-6 flex items-center justify-center font-sans relative overflow-hidden">
      
      {/* Background Polish */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.04]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      <div className="max-w-2xl w-full relative z-10">
        
        {/* Base Stack Effect */}
        <div className="absolute inset-0 bg-[#E2DACB] border border-black/5 rotate-[0.8deg] shadow-sm rounded-sm"></div>
        <div className="absolute inset-0 bg-white/50 border border-black/5 rotate-[-0.3deg] shadow-sm rounded-sm"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white p-12 md:p-20 border border-black/10 shadow-[12px_12px_0px_rgba(0,0,0,0.02)] rounded-sm space-y-12 text-center relative rotate-[-0.5deg]"
        >
          {/* Tape Element */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/60 border border-black/5 rotate-[-3deg] z-20 backdrop-blur-sm shadow-sm flex items-center justify-center">
             <div className="w-16 h-px bg-black/5" />
          </div>
          
          {/* Success Icon */}
          <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-[#367F4D] border border-black/5 shadow-inner">
            <CheckCircle2 size={32} />
          </div>
          
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-cloude italic tracking-tighter text-slate-900 leading-none">
              Pemesanan <br/> Berhasil<span className="text-[#367F4D]">!</span>
            </h1>
            <p className="text-stone-500 font-bold text-[10px] uppercase tracking-[0.3em] leading-relaxed max-w-sm mx-auto italic">
              Terima kasih atas pembelian Anda. Spesimen biji kopi terbaik sedang kami persiapkan.
            </p>
          </div>

          {/* Next Steps / Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="bg-stone-50 p-6 flex flex-col items-center text-center border border-black/5 rounded-sm group hover:bg-white hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:-translate-y-1 transition-transform border border-black/5">
                   <Package size={18} className="text-[#367F4D]" />
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Step 01</p>
                   <p className="text-xs font-black text-slate-900 mt-1 uppercase italic">Penyiapan Roast</p>
                </div>
             </div>
             <div className="bg-stone-50 p-6 flex flex-col items-center text-center border border-black/5 rounded-sm group hover:bg-white hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:-translate-y-1 transition-transform border border-black/5">
                   <Truck size={18} className="text-[#367F4D]" />
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Step 02</p>
                   <p className="text-xs font-black text-slate-900 mt-1 uppercase italic">Pengiriman Kurir</p>
                </div>
             </div>
          </div>

          <div className="pt-6 border-t border-dashed border-black/10 space-y-4">
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em] italic">
              Konfirmasi pesanan telah dikirim ke email Anda.
            </p>
            <Link href="/account" className="block text-[9px] font-black uppercase tracking-[0.3em] text-stone-300 hover:text-slate-900 transition-colors underline underline-offset-4">
              Pantau Status Pesanan di Dashboard
            </Link>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/our-coffee">
              <Button className="w-full sm:w-auto h-16 px-12 bg-slate-900 text-white font-black tracking-[0.2em] rounded-sm hover:bg-[#367F4D] transition-all uppercase italic text-[11px] shadow-xl hover:-translate-y-1 active:scale-95">
                Kembali ke Katalog <ShoppingBag size={14} className="ml-3" />
              </Button>
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
