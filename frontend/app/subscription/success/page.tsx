"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, CalendarHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function SubscriptionSuccessPage() {
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
              Welcome to <br/> the Club!
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
              Your subscription is active. The first batch of freshly roasted beans will be on its way soon.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 flex flex-col justify-center items-center text-center border border-slate-100">
             <CalendarHeart size={32} className="text-fermion-blue mb-4" />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Next Delivery</p>
             <p className="text-lg font-bold text-slate-900">Preparing Schedule...</p>
          </div>

          <p className="text-xs text-slate-400 font-medium">
            You can manage your subscription settings anytime from your account dashboard.
          </p>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/our-coffee">
              <Button className="w-full sm:w-auto h-14 px-8 bg-slate-900 text-white font-black tracking-[0.2em] rounded-2xl hover:bg-fermion-blue transition-all duration-500 uppercase italic">
                Back to Shop <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>

        </motion.div>

      </div>
    </div>
  );
}
