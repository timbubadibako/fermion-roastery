"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  Calendar,
  CreditCard,
  ArrowUpRight,
  ShieldCheck,
  History,
  Coffee,
  Info,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";

export default function B2BOverview() {
  const { user } = useAuthStore();
  const [partner, setPartner] = useState<any>(null);
  const [stats, setStats] = useState({ volume: 0, savings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [pRes, oRes] = await Promise.all([
        fetch(`/api/admin/partners?profileId=${user?.id}`),
        fetch(`/api/orders/my-orders?profileId=${user?.id}`)
      ]);

      if (pRes.ok) {
        const data = await pRes.json();
        setPartner(data.find((p: any) => p.profile_id === user?.id));
      }
      if (oRes.ok) {
        const orders = await oRes.json();
        const vol = orders.filter((o: any) => ['PAID', 'SHIPPED'].includes(o.status))
                          .reduce((acc: number, o: any) => acc + (parseFloat(o.total_amount) / 120000), 0); // Simulated KG
        setStats({ volume: vol, savings: vol * 10000 });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Syncing Partner Protocol...</p>
    </div>
  );

  const silverThreshold = 15;
  const progress = Math.min(100, Math.round((stats.volume / silverThreshold) * 100));

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-3">
             <span className="bg-periwinkle/10 text-periwinkle text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-periwinkle/20">Business Partner</span>
             <span className="bg-slate-100 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-slate-200">Tier: {partner?.tier_name || 'Bronze'}</span>
          </div>
          <h1 className="display-font text-6xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">Partner <br/> Hub.</h1>
          <p className="text-sm font-medium text-slate-500">Welcome back, {user?.full_name}. Overview of your wholesale activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* PROGRESS RING CARD */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[4rem] p-12 flex flex-col items-center justify-center text-center space-y-10 shadow-sm relative overflow-hidden">
           <div className="relative w-56 h-56 flex-shrink-0">
              <svg className="w-full h-full -rotate-90">
                 <circle cx="112" cy="112" r="100" stroke="#f1f5f9" strokeWidth="16" fill="transparent" />
                 <motion.circle 
                    cx="112" cy="112" r="100" 
                    stroke="var(--periwinkle)" 
                    strokeWidth="16" 
                    fill="transparent" 
                    strokeDasharray="628" 
                    initial={{ strokeDashoffset: 628 }}
                    animate={{ strokeDashoffset: 628 - (progress / 100 * 628) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round" 
                 />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                 <p className="text-5xl font-black italic tracking-tighter text-slate-900 leading-none">{stats.volume.toFixed(1)}</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">/ 15.0 KG</p>
              </div>
           </div>
           <div className="space-y-4">
              <h4 className="font-black uppercase italic text-sm text-slate-900 tracking-tight">Silver Tier Progress</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                 {stats.volume >= 15 
                  ? "Threshold reached. Upgrade available next cycle." 
                  : `${(15 - stats.volume).toFixed(1)}kg remaining to unlock Rp 15.000/kg discount.`}
              </p>
           </div>
        </div>

        {/* SHOP GATEWAY & STATS */}
        <div className="lg:col-span-8 space-y-10">
           <div className="p-12 rounded-[3.5rem] bg-slate-950 text-white flex items-center justify-between relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-3xl -mr-40 -mt-40" />
              <div className="space-y-8 relative z-10 flex-1">
                 <div className="space-y-2">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] bg-periwinkle text-white px-3 py-1 rounded-full">COMMERCIAL_GATEWAY</span>
                    <h3 className="display-font text-5xl italic font-black tracking-tighter leading-none">Wholesale <br/> Laboratory.</h3>
                 </div>
                 <p className="text-xs text-slate-400 font-medium tracking-wide max-w-sm">Secure your next batch of laboratory-grade specimens at your locked-in partner rates.</p>
                 <Link href="/our-coffee" className="block">
                    <Button className="bg-white text-slate-950 px-10 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-periwinkle hover:text-white transition-all shadow-xl">
                       Enter Shop <ArrowUpRight className="ml-2" size={16} />
                    </Button>
                 </Link>
              </div>
              <div className="w-48 h-48 bg-white/5 rounded-[3rem] rotate-12 flex items-center justify-center opacity-30 group-hover:rotate-0 transition-transform duration-700 pointer-events-none">
                 <Coffee size={80} strokeWidth={1} />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="bg-white border border-slate-100 p-10 rounded-[3rem] space-y-4 shadow-sm group hover:shadow-xl transition-all">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Net Savings</p>
                 <h4 className="text-4xl font-black italic tracking-tighter text-slate-900">Rp {stats.savings.toLocaleString()}</h4>
                 <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Calculated vs Retail Value</p>
              </div>
              <div className="bg-white border border-slate-100 p-10 rounded-[3rem] space-y-4 shadow-sm group hover:shadow-xl transition-all">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Active Contract</p>
                 <h4 className="text-4xl font-black italic tracking-tighter text-slate-900">134 <span className="text-lg text-slate-300 not-italic">DAYS</span></h4>
                 <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Status:</span>
                    <span className="text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">Active_Protocol</span>
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* MAINTENANCE RETENTION CARD */}
      <div className="bg-slate-950 p-12 rounded-[4rem] text-white flex items-center justify-between relative overflow-hidden grayscale opacity-50 group border border-white/5 shadow-2xl">
          <div className="space-y-6 relative z-10">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white"><ShieldCheck size={28} /></div>
                <h3 className="display-font text-3xl italic font-black uppercase italic tracking-tighter">Fermion Premium Service.</h3>
             </div>
             <p className="text-xs text-slate-400 font-medium tracking-wide max-w-xl leading-relaxed">Bi-monthly laboratory-grade machine calibration and deep-cleaning. Ensuring your equipment matches our roasting precision.</p>
          </div>
          <div className="text-right space-y-3 relative z-10">
             <div className="flex items-center justify-end gap-2 text-white">
                <Lock size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Locked Protocol</span>
             </div>
             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Unlocked at Contract Sequence #2</p>
          </div>
          <div className="absolute bottom-0 right-0 p-12 opacity-5"><ShieldCheck size={200} /></div>
      </div>
    </div>
  );
}
