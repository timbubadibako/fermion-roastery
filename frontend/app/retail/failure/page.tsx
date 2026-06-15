"use client";

import React from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function PaymentFailure() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6 pt-20">
      <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3.5rem] p-12 text-center space-y-10 shadow-2xl relative overflow-hidden"
      >
        {/* Status Icon */}
        <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-red-500 mx-auto shadow-inner">
           <XCircle size={48} />
        </div>

        {/* Text Content */}
        <div className="space-y-4">
           <h1 className="display-font text-5xl font-black italic tracking-tighter text-slate-900 leading-none">Gagal.</h1>
           <p className="text-slate-500 font-medium text-sm leading-relaxed px-4">
             Maaf, pembayaran Anda tidak dapat kami proses saat ini. Mohon periksa kembali saldo atau metode pembayaran Anda.
           </p>
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-4">
           <Link href="/cart">
              <Button className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest italic text-[10px] shadow-xl hover:bg-fermion-french-blue transition-all gap-2">
                 <RefreshCcw size={16} /> Coba Bayar Lagi
              </Button>
           </Link>
           <Link href="/our-coffee">
              <Button variant="outline" className="w-full h-16 border-slate-200 text-slate-400 hover:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all gap-2">
                 <ArrowLeft size={16} /> Kembali ke Menu
              </Button>
           </Link>
        </div>

        {/* Footer Info */}
        <div className="pt-8 border-t border-slate-50">
           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">
             Laboratory Dispatch Interrupted
           </p>
        </div>
      </motion.div>
    </div>
  );
}
