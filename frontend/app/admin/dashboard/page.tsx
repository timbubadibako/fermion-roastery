"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Package, Users, Zap, Loader2, ArrowUpRight, Coffee, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({
    revenue: 55000000,
    volume: 320,
    pendingB2B: 4,
    activeSubs: 12,
    volumeTrends: [
      { name: "Espresso Blend", kg: 150 },
      { name: "Filter Single Origin", kg: 100 },
      { name: "Decaf", kg: 70 },
    ]
  }); // Mocking stats for now since getAdminStats is commented out
  const [churnAlerts, setChurnAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Churn Alerts
    fetch('http://localhost:3001/api/admin/churn')
      .then(res => res.json())
      .then(data => {
        setChurnAlerts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load churn alerts", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <Loader2 className="animate-spin text-fermion-french-blue" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Gathering data...</p>
    </div>
  );

  if (!stats) return <p className="text-red-500">Failed to load analytics.</p>;

  return (
    <div className="space-y-16">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
          Command <br/> Overview.
        </h1>
        <p className="text-slate-500 font-medium text-sm max-w-sm">
          Tracking the growth and operational health of Fermion Roastery.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Total Revenue", val: `Rp ${(stats.revenue / 1000000).toFixed(1)}M`, icon: TrendingUp, color: "text-green-500", trend: "+12%" },
          { label: "Volume Sold", val: `${stats.volume} Kg`, icon: Coffee, color: "text-fermion-french-blue", trend: "+8%" },
          { label: "Pending B2B", val: stats.pendingB2B, icon: Users, color: "text-amber-500", trend: "High Priority" },
          { label: "Active Subs", val: stats.activeSubs, icon: Zap, color: "text-fermion-lilac", trend: "+5 new" },
        ].map((s, i) => (
          <motion.div 
            key={s.label} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group hover:shadow-xl transition-all duration-500"
          >
             <div className="flex justify-between items-start relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
                  <s.icon size={20} strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-1 text-[9px] font-black text-green-500 uppercase tracking-widest bg-green-50 px-2.5 py-1 rounded-full">
                  <ArrowUpRight size={10} /> {s.trend}
                </div>
             </div>
             <div className="space-y-1 relative z-10">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
               <p className="text-3xl font-black tracking-tight text-slate-900 italic">{s.val}</p>
             </div>
             <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
                <s.icon size={120} />
             </div>
          </motion.div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Main Chart Area */}
         <div className="lg:col-span-8 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Revenue Performance</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">June 2026 • Daily Trends</p>
              </div>
              <div className="flex gap-2">
                 <button className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Weekly</button>
                 <button className="px-4 py-2 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-slate-100 transition-colors">Monthly</button>
              </div>
            </div>
            
            <div className="h-80 w-full bg-slate-50/50 rounded-[2.5rem] flex items-center justify-center border border-dashed border-slate-200">
               <div className="text-center space-y-3">
                  <TrendingUp className="mx-auto text-slate-200" size={40} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">[ Recharts Line Visualization ]</p>
               </div>
            </div>
         </div>

         {/* Distribution / Side Data */}
         <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white flex flex-col justify-between h-full group overflow-hidden relative">
               <div className="relative z-10">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8">Volume Mix</h4>
                  <div className="space-y-6">
                    {stats.volumeTrends.map((v: any) => (
                      <div key={v.name} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span>{v.name}</span>
                          <span>{v.kg} Kg</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(v.kg / stats.volume) * 100}%` }}
                            className="h-full bg-fermion-french-blue"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="pt-12 relative z-10">
                  <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-fermion-french-blue hover:text-white transition-colors">
                    Detailed Report <ArrowUpRight size={14} />
                  </button>
               </div>
               <Package size={200} className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
            </div>
         </div>
      </div>

      {/* RECENT ALERTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3">
               <Clock size={16} className="text-slate-400" />
               <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Recent Command Center Alerts</h4>
            </div>
            <div className="divide-y divide-slate-50">
               {[
                 { type: "B2B", msg: "New Wholesale Application: 'Kopi Kenangan Senayan'", time: "2 mins ago", status: "Urgent" },
                 { type: "STOCK", msg: "Inventory Alert: 'NOT ONLY INTENSE' batch below 10kg", time: "1 hour ago", status: "Warning" },
                 { type: "ORDER", msg: "Large Retail Order: 15 items by anonymous guest", time: "3 hours ago", status: "Success" },
               ].map((alert, i) => (
                 <div key={i} className="py-6 flex items-center justify-between group cursor-pointer hover:px-4 transition-all duration-300 rounded-2xl">
                    <div className="flex items-center gap-6">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 w-12">{alert.type}</span>
                      <p className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{alert.msg}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-medium text-slate-400 italic">{alert.time}</span>
                      <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full ${
                        alert.status === 'Urgent' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'
                      }`}>{alert.status}</span>
                    </div>
                 </div>
               ))}
            </div>
        </div>

        {/* CHURN ALERTS */}
        <div className="bg-white p-12 rounded-[3.5rem] border border-red-100 shadow-sm space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
            <div className="flex items-center gap-3">
               <Users size={16} className="text-red-500" />
               <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">B2B Churn Alerts (&gt; 45 Days)</h4>
            </div>
            <div className="divide-y divide-slate-50">
               {churnAlerts.length === 0 ? (
                 <p className="text-sm text-slate-500 py-4">No churn alerts currently.</p>
               ) : (
                 churnAlerts.map((partner, i) => (
                   <div key={i} className="py-6 flex items-center justify-between group cursor-pointer hover:px-4 transition-all duration-300 rounded-2xl">
                      <div className="flex items-center gap-6">
                        <span className="text-[9px] font-black uppercase tracking-widest text-red-300 w-12">CHURN</span>
                        <p className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{partner.company_name}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-medium text-slate-400 italic">Last order: {partner.last_order_date ? new Date(partner.last_order_date).toLocaleDateString() : 'Never'}</span>
                        <span className="text-[8px] font-black uppercase px-2.5 py-1 rounded-full bg-red-50 text-red-500">Action Req</span>
                      </div>
                   </div>
                 ))
               )}
            </div>
        </div>
      </div>
    </div>
  );
}
