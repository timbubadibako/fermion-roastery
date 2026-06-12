"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-40 pb-20 px-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-12 md:p-16 rounded-[3rem] border border-slate-100 shadow-2xl space-y-12 text-center"
        >
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-inner">
            <CheckCircle2 size={48} />
          </div>
          
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
              Order <br/> Confirmed!
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
              Thank you for your purchase. We're getting your beans ready for the roast.
            </p>
          </div>

          {/* Next Steps / Info */}
          <div className="bg-slate-50 rounded-3xl p-8 flex flex-col sm:flex-row gap-6 justify-center items-center text-left border border-slate-100">
             <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm"><Package size={20} className="text-fermion-french-blue" /></div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step 1</p>
                   <p className="text-sm font-bold text-slate-900">Roasting Schedule</p>
                </div>
             </div>
             <div className="h-10 w-[1px] bg-slate-200 hidden sm:block" />
             <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm"><Truck size={20} className="text-fermion-french-blue" /></div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step 2</p>
                   <p className="text-sm font-bold text-slate-900">Delivery Tracking</p>
                </div>
             </div>
          </div>

          <p className="text-xs text-slate-400 font-medium">
            An email receipt with tracking details will be sent to you shortly.
          </p>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/our-coffee">
              <Button className="w-full sm:w-auto h-14 px-8 bg-slate-900 text-white font-black tracking-[0.2em] rounded-2xl hover:bg-fermion-french-blue transition-all duration-500 uppercase italic">
                Continue Shopping <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>

        </motion.div>

      </div>
    </div>
  );
}
