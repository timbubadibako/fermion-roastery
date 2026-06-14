"use client";

import React from "react";
import { BarChart3, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function InventoryManagement() {
  return (
    <div className="space-y-12">
      <div className="space-y-2 text-left">
        <h1 className="display-font text-6xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">Green Bean <br/> Inventory.</h1>
        <p className="text-sm font-medium text-slate-500">Track raw coffee lot arrival and remaining batch weight.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 rounded-[3.5rem] p-20 flex flex-col items-center justify-center text-center space-y-8 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 blur-3xl -ml-40 -mt-40 pointer-events-none" />
        
        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-300 relative z-10 shadow-inner">
           <BarChart3 size={48} />
        </div>
        
        <div className="space-y-4 relative z-10 max-w-lg">
           <span className="status-badge bg-emerald-50 text-emerald-500 uppercase tracking-widest px-3 py-1">PHASE_4_ROADMAP</span>
           <h2 className="display-font text-4xl italic font-black text-slate-900 tracking-tighter leading-none mt-2">Coming Soon.</h2>
           <p className="text-sm font-medium text-slate-500 leading-relaxed">
             Green Bean Lot Management is scheduled for the next major architecture update. This module will integrate directly with the Roastery Journal for total farm-to-cup traceability.
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
