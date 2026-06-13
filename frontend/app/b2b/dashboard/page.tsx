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
          <ShieldCheck className="mx-auto text-fermion-french-blue" size={48} />
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Access Denied</h2>
          <p className="text-slate-400">This area is reserved for Fermion Business Partners.</p>
          <Link href="/auth">
            <Button className="bg-fermion-french-blue text-white rounded-xl px-8">Login as Partner</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="bg-fermion-french-blue/10 text-fermion-french-blue text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-fermion-french-blue/20">Business Partner</span>
            <span className="text-slate-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest bg-slate-100 border border-slate-200">Tier: Bronze</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">Partner <br/> Hub.</h1>
          <p className="text-sm font-medium text-slate-500">Welcome back, {user.full_name}. Overview of your wholesale activity.</p>
        </div>
        
        <Link href="/our-coffee">
          <Button className="bg-slate-900 hover:bg-fermion-french-blue text-white font-black tracking-widest uppercase italic px-8 h-14 rounded-2xl transition-all shadow-xl shadow-slate-900/10">
            Order Bulk Coffee <ArrowUpRight className="ml-2" size={16} />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={<Package size={20}/>} label="Total Volume" value="0 kg" sub="LTM Volume" color="blue" />
        <StatCard icon={<TrendingUp size={20}/>} label="Savings" value="Rp 0" sub="vs Retail Price" color="emerald" />
        <StatCard icon={<Calendar size={20}/>} label="Next Roast" value="TBD" sub="Check Schedule" color="amber" />
        <StatCard icon={<CreditCard size={20}/>} label="Outstanding" value="Rp 0" sub="All Paid" color="slate" />
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Contracts / Tiers */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[3.5rem] p-12 overflow-hidden relative group shadow-sm">
             <div className="absolute top-0 right-0 w-96 h-96 bg-fermion-french-blue/5 blur-3xl -mr-40 -mt-40 transition-transform group-hover:scale-110" />
             <div className="relative z-10 space-y-10">
                <div className="flex items-center justify-between">
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Tier Benefits & Progress</h3>
                   <Info size={16} className="text-slate-300" />
                </div>
                
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress to SILVER TIER</p>
                      <p className="text-sm font-black text-slate-900">0%</p>
                   </div>
                   <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                      <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: "0%" }}
                         className="h-full bg-fermion-french-blue"
                      />
                   </div>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic text-right">Reach 15kg this month to unlock Silver Tier.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                   <BenefitItem label="Current Discount" value="0% (Bronze)" />
                   <BenefitItem label="Payment Terms" value="Pay on Order" />
                   <BenefitItem label="Support" value="Standard" />
                </div>
             </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white border border-slate-100 rounded-[3rem] p-10 space-y-6 hover:shadow-xl transition-all group shadow-sm">
                <h4 className="text-slate-900 font-black uppercase italic tracking-tighter text-xl">Purchase Schedule</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Automate your inventory. Set weekly or monthly roasting cycles for your cafe.</p>
                <Button variant="outline" className="w-full border-slate-200 text-slate-900 rounded-2xl h-14 uppercase text-[10px] font-black tracking-widest hover:bg-slate-900 hover:text-white transition-all">Setup Schedule</Button>
             </div>
             <div className="bg-white border border-slate-100 rounded-[3rem] p-10 space-y-6 hover:shadow-xl transition-all group shadow-sm">
                <h4 className="text-slate-900 font-black uppercase italic tracking-tighter text-xl">Contract Prices</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">View your exclusive wholesale prices for all current micro-lots and blends.</p>
                <Button variant="outline" className="w-full border-slate-200 text-slate-900 rounded-2xl h-14 uppercase text-[10px] font-black tracking-widest hover:bg-slate-900 hover:text-white transition-all">View Price List</Button>
             </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-8">Recent Bulk Orders</h4>
              <div className="space-y-6 text-center py-16">
                 <Package className="mx-auto mb-4 text-slate-100" size={48} />
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No activity detected.</p>
              </div>
              <Button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl h-14 uppercase text-[10px] font-black tracking-widest">Order History</Button>
           </div>

           <div className="bg-slate-900 p-10 rounded-[3rem] space-y-6 shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-fermion-french-blue/10 blur-3xl -mr-32 -mt-32" />
              <h4 className="text-white font-black uppercase italic tracking-tighter text-xl relative z-10">Partner Support</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium relative z-10">Direct line to our Master Roaster for custom profile adjustments and machine troubleshooting.</p>
              <Button className="w-full bg-fermion-french-blue text-white rounded-2xl h-14 uppercase text-[10px] font-black tracking-widest relative z-10 hover:bg-white hover:text-slate-900 transition-all">WhatsApp Roaster</Button>
           </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: any, label: string, value: string, sub: string, color: string }) {
  const colorMap: any = {
    blue: "text-fermion-french-blue bg-fermion-french-blue/5 border-fermion-french-blue/10",
    emerald: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
    amber: "text-amber-500 bg-amber-500/5 border-amber-500/10",
    slate: "text-slate-400 bg-slate-50 border-slate-100"
  };
  
  return (
    <div className="bg-white border border-slate-100 p-10 rounded-[3rem] space-y-6 group hover:shadow-xl transition-all shadow-sm">
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorMap[color]}`}>
          {icon}
       </div>
       <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</p>
          <p className="text-3xl font-black text-slate-900 italic tracking-tight">{value}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{sub}</p>
       </div>
    </div>
  );
}

function BenefitItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
       <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
       <p className="text-xs font-black text-slate-900 uppercase italic">{value}</p>
    </div>
  );
}
