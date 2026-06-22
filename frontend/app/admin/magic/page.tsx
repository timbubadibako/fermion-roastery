"use client";

import React from "react";
import { Sparkles, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MagicWandPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-2 text-left">
        <h1 className="font-display text-6xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">Magic <br/> Wand.</h1>
        <p className="text-sm font-medium text-slate-500">AI-powered insights and quick CMS actions.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 rounded-[3.5rem] p-20 flex flex-col items-center justify-center text-center space-y-8 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-3xl -mr-40 -mt-40 pointer-events-none" />
        
        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-300 relative z-10 shadow-inner">
           <Sparkles size={48} />
        </div>
        
        <div className="space-y-4 relative z-10 max-w-lg">
           <span className="status-badge bg-blue-50 text-blue-500 uppercase tracking-widest px-3 py-1">IN_DEVELOPMENT</span>
           <h2 className="font-display text-4xl italic font-black text-slate-900 tracking-tighter leading-none mt-2">Coming Soon.</h2>
           <p className="text-sm font-medium text-slate-500 leading-relaxed">
             Our tim analis are currently training the heuristic engine. Soon, you'll be able to receive automated tactical insights and perform one-click CMS edits directly from this terminal.
           </p>
        </div>

        <div className="pt-8 border-t border-slate-50 w-full max-w-md relative z-10">
           <Link href="/admin">
              <Button className="w-full h-16 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest italic text-[10px] shadow-xl hover:bg-fermion-french-blue transition-all gap-2">
                 <ArrowLeft size={16} /> Return to Command Overview
              </Button>
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
