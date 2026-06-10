"use client";

import React from "react";
import { useAuthStore } from "@/lib/store";
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  ShieldCheck, 
  Calendar,
  CreditCard,
  Settings,
  ArrowUpRight,
  Info,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function B2BDashboardPage() {
  const { user, logout } = useAuthStore();

  if (!user || user.role !== 'B2B') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <ShieldCheck className="mx-auto text-fermion-blue" size={48} />
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Access Denied</h2>
          <p className="text-slate-400">This area is reserved for Fermion Business Partners.</p>
          <Link href="/auth">
            <Button className="bg-fermion-blue text-white rounded-xl px-8">Login as Partner</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="bg-fermion-blue/20 text-fermion-blue text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-fermion-blue/30">Business Partner</span>
              <span className="text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest bg-emerald-400/10 border border-emerald-400/20">Silver Tier</span>
              <button 
                onClick={() => {
                  logout();
                  window.location.href = "/auth";
                }}
                className="ml-2 p-1.5 bg-white/5 rounded-lg border border-white/10 text-slate-500 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-white leading-tight">Partner <br/> Dashboard.</h1>
            <p className="text-sm font-medium text-slate-400">Welcome back, {user.full_name}. Manage your bulk orders and contracts.</p>
          </div>
          
          <Link href="/our-coffee">
            <Button className="bg-fermion-blue hover:bg-white hover:text-slate-900 text-white font-black tracking-widest uppercase italic px-8 h-14 rounded-2xl transition-all shadow-xl shadow-fermion-blue/20">
              Bulk Order Catalog <ArrowUpRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Package size={20}/>} label="Total Volume" value="124 kg" sub="LTM Volume" color="blue" />
          <StatCard icon={<TrendingUp size={20}/>} label="Savings" value="Rp 4.2M" sub="vs Retail Price" color="emerald" />
          <StatCard icon={<Calendar size={20}/>} label="Next Roast" value="June 12" sub="In 2 Days" color="amber" />
          <StatCard icon={<CreditCard size={20}/>} label="Outstanding" value="Rp 0" sub="All Paid" color="slate" />
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contracts / Tiers */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-[3rem] p-10 overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-96 h-96 bg-fermion-blue/10 blur-3xl -mr-40 -mt-40 transition-transform group-hover:scale-110" />
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Tier Benefits</h3>
                     <Info size={16} className="text-slate-500" />
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress to GOLD TIER</p>
                        <p className="text-sm font-black text-white">75%</p>
                     </div>
                     <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: "75%" }}
                           transition={{ duration: 1, ease: "easeOut" }}
                           className="h-full bg-gradient-to-r from-fermion-blue to-emerald-400"
                        />
                     </div>
                     <p className="text-[10px] text-slate-500 font-medium italic text-right">Order 26kg more to unlock 15% flat discount.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                     <BenefitItem label="Pricing" value="12% Discount" />
                     <BenefitItem label="Terms" value="Net 14 Days" />
                     <BenefitItem label="Support" value="Priority Line" />
                  </div>
               </div>
            </div>

            {/* Quick Actions Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-slate-800/50 border border-slate-700/50 rounded-[2.5rem] p-8 space-y-4 hover:border-fermion-blue/50 transition-colors group">
                  <h4 className="text-white font-black uppercase italic tracking-tighter">Purchase Schedule</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Automate your inventory. Set weekly or monthly roasting cycles.</p>
                  <Button variant="outline" className="w-full border-slate-700 text-white rounded-xl h-12 uppercase text-[10px] font-black tracking-widest group-hover:bg-white group-hover:text-slate-900">Manage Schedule</Button>
               </div>
               <div className="bg-slate-800/50 border border-slate-700/50 rounded-[2.5rem] p-8 space-y-4 hover:border-fermion-blue/50 transition-colors group">
                  <h4 className="text-white font-black uppercase italic tracking-tighter">Contract Prices</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">View your locked-in prices for specific micro-lots and blends.</p>
                  <Button variant="outline" className="w-full border-slate-700 text-white rounded-xl h-12 uppercase text-[10px] font-black tracking-widest group-hover:bg-white group-hover:text-slate-900">View Contracts</Button>
               </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-slate-800/50 border border-slate-700/50 rounded-[2.5rem] p-8">
                <h4 className="text-white font-black uppercase italic tracking-tighter mb-6">Recent Bulk Orders</h4>
                <div className="space-y-6 text-center py-10 opacity-30 italic">
                   <Package className="mx-auto mb-4" size={32} />
                   <p className="text-xs">No recent bulk orders found.</p>
                </div>
                <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white rounded-xl h-12 uppercase text-[10px] font-black tracking-widest">View All History</Button>
             </div>

             <div className="bg-fermion-blue/10 border border-fermion-blue/20 rounded-[2.5rem] p-8 space-y-4">
                <h4 className="text-fermion-blue font-black uppercase italic tracking-tighter">Partner Support</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Direct line to our Master Roaster for custom profile adjustments.</p>
                <Button className="w-full bg-fermion-blue text-white rounded-xl h-12 uppercase text-[10px] font-black tracking-widest">WhatsApp Roaster</Button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: any, label: string, value: string, sub: string, color: string }) {
  const colorMap: any = {
    blue: "text-fermion-blue bg-fermion-blue/10 border-fermion-blue/20",
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    slate: "text-slate-400 bg-slate-400/10 border-slate-700/50"
  };
  
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-[2rem] space-y-4 group hover:border-slate-600 transition-all">
       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          {icon}
       </div>
       <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-black text-white italic">{value}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{sub}</p>
       </div>
    </div>
  );
}

function BenefitItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/30">
       <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</p>
       <p className="text-xs font-black text-white uppercase italic">{value}</p>
    </div>
  );
}
