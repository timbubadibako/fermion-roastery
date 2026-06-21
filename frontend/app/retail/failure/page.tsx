"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function PaymentFailure() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-40 pb-20 px-6 flex items-center justify-center font-sans relative overflow-hidden">
      
      {/* Background Polish */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.04]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      <div className="max-w-md w-full relative z-10">
        
        {/* Base Stack Effect */}
        <div className="absolute inset-0 bg-red-50 border border-black/5 rotate-[0.8deg] shadow-sm rounded-sm"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white p-12 border border-black/10 shadow-[12px_12px_0px_rgba(0,0,0,0.02)] rounded-sm space-y-12 text-center relative rotate-[-0.5deg]"
        >
          {/* Tape Element */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/60 border border-black/5 rotate-[-3deg] z-20 backdrop-blur-sm shadow-sm flex items-center justify-center">
             <div className="w-16 h-px bg-black/5" />
          </div>
          
          {/* Status Icon */}
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 border border-black/5 shadow-inner">
            <XCircle size={32} />
          </div>
          
          {/* Text Content */}
          <div className="space-y-4">
            <h1 className="text-5xl font-sans font-bold italic tracking-tighter text-slate-900 leading-none">
              Gagal<span className="text-red-500">.</span>
            </h1>
            <p className="text-stone-500 font-bold text-[10px] uppercase tracking-[0.3em] leading-relaxed italic px-4">
              Maaf, pembayaran Anda tidak dapat kami proses saat ini. Mohon periksa kembali saldo atau metode pembayaran Anda.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-4">
            <Link href="/cart">
              <Button className="w-full h-16 bg-slate-900 text-white rounded-sm font-black uppercase tracking-[0.2em] italic text-[10px] shadow-xl hover:bg-red-500 transition-all gap-3 hover:-translate-y-1 active:scale-95">
                <RefreshCcw size={14} /> Coba Bayar Lagi
              </Button>
            </Link>
            <Link href="/our-coffee">
              <Button variant="ghost" className="w-full h-14 border-black/5 text-stone-400 hover:text-slate-900 rounded-sm font-black uppercase tracking-widest text-[9px] transition-all gap-2">
                <ArrowLeft size={14} /> Kembali ke Katalog
              </Button>
            </Link>
          </div>

          {/* Footer Info */}
          <div className="pt-8 border-t border-dashed border-black/10">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-300 italic">
              Roastery Dispatch Interrupted
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
