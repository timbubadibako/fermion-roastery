"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Package, 
  Users, 
  Zap, 
  AlertTriangle,
  ArrowRight,
  Loader2,
  Calendar,
  Coffee
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface AdminStats {
  revenue: number;
  volume: number;
  pendingB2B: number;
  activeSubs: number;
  recentOrders: any[];
}

interface ChurnAlert {
  company_name: string;
  profile_id: string;
  last_order_date: string | null;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [churnAlerts, setChurnAlerts] = useState<ChurnAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then(res => res.ok ? res.json() : null),
      fetch("/api/admin/churn").then(res => res.ok ? res.json() : [])
    ])
    .then(([statsData, churnData]) => {
      setStats(statsData);
      setChurnAlerts(churnData);
      setLoading(false);
    })
    .catch(() => {
      toast.error("Failed to load command intelligence");
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Analyzing Terminal Data...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-left">
          <h1 className="display-font text-6xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">Command <br/> Overview.</h1>
          <p className="text-sm font-medium text-slate-500">Real-time intelligence on Fermion Roastery operations.</p>
        </div>
      </div>

      {/* CHURN ALERT STICKY - Real Data Only */}
      <AnimatePresence>
        {churnAlerts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="bg-red-50 border border-red-100 rounded-[2.5rem] p-8 flex items-center justify-between relative overflow-hidden group shadow-sm"
          >
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-500/20">
                  <AlertTriangle size={32} />
              </div>
              <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-red-500 text-white px-3 py-1 rounded-full">CRITICAL_CHURN</span>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">{churnAlerts[0].company_name} Inactive.</h3>
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest leading-relaxed">
                    {churnAlerts[0].last_order_date 
                      ? `${Math.floor((new Date().getTime() - new Date(churnAlerts[0].last_order_date).getTime()) / (1000 * 3600 * 24))} Days since last order protocol.`
                      : "No order history detected for approved partner."}
                  </p>
              </div>
            </div>
            <button className="bg-slate-950 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all relative z-10">Re-Engage via WA</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BENTO STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {[
          { label: "Total Revenue", val: `Rp ${((stats?.revenue || 0) / 1000000).toFixed(2)}M`, icon: TrendingUp, color: "text-blue-500", trend: "Live" },
          { label: "Volume Flow", val: `${(stats?.volume || 0).toFixed(1)} Kg`, icon: Package, color: "text-periwinkle", trend: "Monthly" },
          { label: "Active Partners", val: stats?.activeSubs || 0, icon: Users, color: "text-emerald-500", trend: "Stability" },
          { label: "Pending Review", val: stats?.pendingB2B || 0, icon: Zap, color: "text-amber-500", trend: "Urgency" },
        ].map((s, i) => (
          <motion.div 
            key={s.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
          >
             <div className="flex justify-between items-start relative z-10">
                <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${s.color} group-hover:bg-slate-950 group-hover:text-white transition-all`}>
                   <s.icon size={20} strokeWidth={2.5} />
                </div>
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">{s.trend}</span>
             </div>
             <div className="relative z-10">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <h4 className="text-4xl font-black italic tracking-tighter text-slate-900 leading-none">{s.val}</h4>
             </div>
             <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
                <s.icon size={120} />
             </div>
          </motion.div>
        ))}
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[3.5rem] p-12 shadow-sm space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Order Throughput</h3>
                <Calendar size={16} className="text-slate-200" />
             </div>
             <div className="h-[300px] flex items-center justify-center border border-dashed border-slate-100 rounded-3xl opacity-30 italic text-xs">
                Revenue vs Volume Visualization Placeholder
             </div>
          </div>

          <div className="lg:col-span-4 bg-slate-950 p-12 rounded-[3.5rem] text-white space-y-10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl -mr-32 -mt-32" />
             <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"><Coffee size={20} /></div>
                   <h3 className="display-font text-2xl italic font-black uppercase italic tracking-tighter">Lab Insights</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">Your current best-seller is Sumedang Anaerob. Consider prioritizing the next roasting batch for Silver Tier partners.</p>
             </div>
             <div className="space-y-2 pt-6 border-t border-white/5 relative z-10">
                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500"><span>Roast Precision</span><span>98.2%</span></div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="w-[98%] h-full bg-blue-500" />
                </div>
             </div>
             <button className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest italic text-[10px] shadow-xl hover:bg-periwinkle hover:text-white transition-all">Generate Strategy</button>
          </div>
      </div>
    </div>
  );
}
