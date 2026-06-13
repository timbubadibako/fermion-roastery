"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrendingUp, Package, Users, Zap, Loader2, ArrowUpRight, Coffee, Clock, BarChart3, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [churnAlerts, setChurnAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, churnRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/churn')
        ]);
        
        if (statsRes.ok) setStats(await statsRes.json());
        if (churnRes.ok) setChurnAlerts(await churnRes.json());
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <Loader2 className="animate-spin text-fermion-french-blue" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Gathering intelligence...</p>
    </div>
  );

  if (!stats) return <p className="text-red-500 p-20 text-center font-black uppercase tracking-widest">Failed to load command center stats.</p>;

  return (
    <div className="space-y-16 pb-20">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
          Command <br/> Overview.
        </h1>
        <p className="text-slate-500 font-medium text-sm max-w-sm">
          Real-time intelligence on Fermion Roastery operations and growth.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
        {[
          { label: "Total Revenue", val: `Rp ${(stats.revenue / 1000000).toFixed(2)}M`, icon: TrendingUp, color: "text-green-500", trend: "Live" },
          { label: "Volume Sold", val: `${stats.volume.toFixed(1)} Kg`, icon: Coffee, color: "text-fermion-french-blue", trend: "Live" },
          { label: "Pending B2B", val: stats.pendingB2B, icon: Users, color: "text-amber-500", trend: stats.pendingB2B > 0 ? "Priority" : "Clean" },
          { label: "B2B Accounts", val: stats.activeSubs, icon: Zap, color: "text-fermion-lilac", trend: "Stable" },
        ].map((s, i) => (
          <motion.div 
            key={s.label} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
             <div className="flex justify-between items-center relative z-10">
                <div className="w-14 h-14 rounded-3xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
                  <s.icon size={24} strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
                   {s.trend}
                </div>
             </div>
             <div className="space-y-2 relative z-10">
               <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{s.label}</p>
               <p className="text-4xl font-black tracking-tighter text-slate-900 italic leading-none">{s.val}</p>
             </div>
             <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-700 pointer-events-none">
                <s.icon size={160} />
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
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last 7 Days • Daily Data</p>
              </div>
              <BarChart3 className="text-slate-100" size={24} />
            </div>
            
            <div className="h-[400px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.revenueTrends}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    />
                    <YAxis 
                      hide={true}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                      formatter={(value: any) => [`Rp ${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Distribution / Side Data */}
         <div className="lg:col-span-4 space-y-8 flex flex-col">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6 flex-1">
               <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Volume Velocity</h4>
                  <BarChart3 size={16} className="text-slate-200" />
               </div>
               <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.volumeTrends}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                      <XAxis dataKey="name" hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '9px', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="kg" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center italic">Kg sold per product category</p>
            </div>

            <div className="bg-slate-900 p-10 rounded-[3rem] text-white group overflow-hidden relative min-h-[200px] flex flex-col justify-center">
               <div className="relative z-10 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inventory Status</h4>
                  <div className="space-y-4">
                    {stats.volumeTrends.slice(0, 2).map((v: any) => (
                      <div key={v.name} className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                          <span className="truncate max-w-[120px]">{v.name}</span>
                          <span>{v.kg.toFixed(1)} Kg</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(v.kg / (stats.volume || 1)) * 100}%` }}
                            className="h-full bg-fermion-french-blue"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
               <Package size={150} className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
            </div>
         </div>
      </div>

      {/* RECENT TRANSACTIONS TABLE */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-10 border-b border-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <ShoppingCart size={18} className="text-slate-400" />
               <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Live Transaction Stream</h4>
            </div>
            <Link href="/admin/orders">
               <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest gap-2">View All Orders <ArrowUpRight size={14} /></Button>
            </Link>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                     <th className="px-10 py-6">Order ID</th>
                     <th className="px-10 py-6">Customer</th>
                     <th className="px-10 py-6">Status</th>
                     <th className="px-10 py-6">Amount</th>
                     <th className="px-10 py-6 text-right">Date</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {stats.recentOrders?.map((order: any) => (
                     <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-10 py-6 font-mono text-[10px] font-bold text-slate-400 group-hover:text-fermion-french-blue transition-colors">#{order.id.split('-')[0].toUpperCase()}</td>
                        <td className="px-10 py-6">
                           <p className="text-xs font-bold text-slate-900">{order.customer_name}</p>
                           <p className="text-[10px] text-slate-400 font-medium">{order.customer_email}</p>
                        </td>
                        <td className="px-10 py-6">
                           <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full ${
                              order.status === 'PAID' ? 'bg-blue-50 text-blue-500' : 
                              order.status === 'UNPAID' ? 'bg-slate-50 text-slate-400' :
                              'bg-green-50 text-green-500'
                           }`}>{order.status}</span>
                        </td>
                        <td className="px-10 py-6 font-mono text-xs font-bold text-slate-900">Rp {Number(order.total_amount).toLocaleString('id-ID')}</td>
                        <td className="px-10 py-6 text-[10px] font-bold text-slate-400 text-right uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
            {(!stats.recentOrders || stats.recentOrders.length === 0) && (
               <div className="p-20 text-center text-slate-300 font-black uppercase tracking-widest text-[10px]">No recent activity detected.</div>
            )}
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
               <div className="py-20 text-center space-y-4">
                  <Clock className="mx-auto text-slate-100" size={32} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No operational alerts detected.</p>
               </div>
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
