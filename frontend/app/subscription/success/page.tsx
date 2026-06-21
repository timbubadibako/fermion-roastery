"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, CalendarHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function SubscriptionSuccessPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#F4F0E6] py-20 px-6 flex items-center justify-center font-sans">

      {/* Background Polish */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.04]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      <div className="max-w-2xl w-full relative">
        {/* Base Stack */}
        <div className="absolute inset-0 bg-[#E2DACB] border border-black/5 rotate-[0.5deg] shadow-sm rounded-sm"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-12 md:p-20 border border-black/10 shadow-[8px_8px_0px_rgba(0,0,0,0.02)] rounded-sm space-y-12 text-center relative rotate-[-0.5deg]"
        >
          {/* Tape */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/60 border border-black/5 rotate-[-2deg] z-20 backdrop-blur-sm shadow-sm"></div>
          
          {/* Success Icon */}
          <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-[#367F4D] border border-black/5">
            <CheckCircle2 size={32} />
          </div>
          
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-sans font-bold italic tracking-tighter text-slate-900 leading-none">
              Welcome to <br/> the Club.
            </h1>
            <p className="text-stone-500 font-medium text-xs uppercase tracking-widest leading-relaxed max-w-sm mx-auto italic">
              Your subscription is active. The first batch of freshly roasted beans will be on its way soon.
            </p>
          </div>

          <div className="bg-stone-50 p-6 flex flex-col justify-center items-center text-center border border-black/5">
             <CalendarHeart size={24} className="text-[#8CADD8] mb-4" />
             <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Next Delivery</p>
             <p className="text-sm font-bold text-slate-900 mt-1">Preparing Schedule...</p>
          </div>

          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
            Manage subscription settings in your dashboard.
          </p>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/our-coffee">
              <Button className="w-full sm:w-auto h-14 px-10 bg-slate-900 text-white font-black tracking-[0.2em] rounded-sm hover:bg-[#367F4D] transition-all uppercase italic text-[10px]">
                Back to Shop <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
