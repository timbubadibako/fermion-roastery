"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Package, Truck, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";

export default function OrderSuccessPage() {
  const [mounted, setMounted] = useState(false);
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const { removeItems } = useCartStore();

  useEffect(() => { 
    setMounted(true); 
    
    // Add a small delay to ensure store hydration is complete
    const timer = setTimeout(() => {
        const purchasedIds = localStorage.getItem('purchasedLineItemIds');
        if (purchasedIds) {
            try {
                const idsToRemove = JSON.parse(purchasedIds);
                if (Array.isArray(idsToRemove) && idsToRemove.length > 0) {
                    removeItems(idsToRemove);
                }
                localStorage.removeItem('purchasedLineItemIds');
            } catch (e) { console.error("Failed to parse purchased IDs", e); }
        }

        const summary = localStorage.getItem('latestOrderSummary');
        if (summary) {
            try {
                setOrderSummary(JSON.parse(summary));
                // Optional: localStorage.removeItem('latestOrderSummary'); 
                // Kita biarkan saja agar jika di-refresh masih ada (atau dihapus jika tidak mau persisten)
            } catch (e) {}
        }
    }, 800);

    return () => clearTimeout(timer);
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
          className="bg-white p-12 border border-black/10 shadow-[12px_12px_0px_rgba(0,0,0,0.02)] rounded-sm space-y-8 text-center relative rotate-[-0.5deg]"
        >
          {/* Tape Element */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/60 border border-black/5 rotate-[-3deg] z-20 backdrop-blur-sm shadow-sm flex items-center justify-center">
             <div className="w-16 h-px bg-black/5" />
          </div>
          
          {/* Success Icon */}
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-[#367F4D] border border-black/5 shadow-inner">
            <CheckCircle2 size={28} />
          </div>
          
          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-sans font-black italic tracking-tighter text-slate-900 leading-none uppercase">
              Pesanan Berhasil<span className="text-[#367F4D]">!</span>
            </h1>
            <p className="text-stone-500 font-bold text-[9px] uppercase tracking-[0.3em] italic">
              Terima kasih. Pesanan Anda sedang diproses.
            </p>
          </div>

          {/* Invoice Summary */}
          {orderSummary ? (
            <div className="bg-stone-50 border border-black/5 rounded-sm p-6 text-left space-y-4">
               <div className="flex justify-between items-center pb-4 border-b border-black/5">
                 <div>
                   <p className="text-[8px] font-bold uppercase tracking-widest text-stone-400">Order ID</p>
                   <p className="text-[10px] font-mono font-bold text-slate-900 mt-1">{orderSummary.orderId}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[8px] font-bold uppercase tracking-widest text-stone-400">Status</p>
                   <p className="text-[10px] font-bold text-[#367F4D] mt-1 uppercase tracking-widest">Lunas</p>
                 </div>
               </div>

               <div className="space-y-3">
                 {orderSummary.items.map((item: any, i: number) => (
                   <div key={i} className="flex justify-between items-start text-sm">
                     <div className="flex-1">
                       <p className="font-black text-slate-900 text-[10px] uppercase tracking-wider">{item.name}</p>
                       <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">{item.quantity}x • {item.weight} • {item.grind}</p>
                     </div>
                     <span className="font-mono text-[10px] font-bold text-slate-900 whitespace-nowrap ml-4">
                       Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                     </span>
                   </div>
                 ))}
               </div>

               <div className="pt-4 border-t border-dashed border-black/10 space-y-2">
                 <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-stone-400">
                   <span>Subtotal</span>
                   <span className="font-mono text-slate-600">Rp {orderSummary.subtotal.toLocaleString('id-ID')}</span>
                 </div>
                 <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-stone-400">
                   <span>Ongkos Kirim</span>
                   <span className="font-mono text-slate-600">Rp {orderSummary.shippingFee.toLocaleString('id-ID')}</span>
                 </div>
                 <div className="flex justify-between text-[11px] font-black uppercase italic text-slate-900 pt-3 border-t border-black/5">
                   <span>Total</span>
                   <span className="font-mono text-[#367F4D]">Rp {orderSummary.total.toLocaleString('id-ID')}</span>
                 </div>
               </div>
            </div>
          ) : (
             <div className="bg-stone-50 p-6 flex flex-col items-center text-center border border-black/5 rounded-sm">
                <Package size={24} className="text-[#367F4D] mb-3 opacity-50" />
                <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Pesanan Diproses</p>
             </div>
          )}

          <div className="pt-2 space-y-4">
            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.2em] italic">
              Konfirmasi lengkap dikirim ke email Anda.
            </p>
            <Link href="/account" className="block text-[8px] font-black uppercase tracking-[0.3em] text-stone-300 hover:text-slate-900 transition-colors underline underline-offset-4">
              Cek Dashboard
            </Link>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/our-coffee">
              <Button className="w-full sm:w-auto h-12 px-8 bg-slate-900 text-white font-black tracking-[0.2em] rounded-sm hover:bg-[#367F4D] transition-all uppercase italic text-[9px] shadow-xl hover:-translate-y-1 active:scale-95">
                Katalog <ShoppingBag size={12} className="ml-2" />
              </Button>
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
