"use client";

import React, { useState, useEffect } from "react";
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Package,
  Search,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store";
import { motion } from "framer-motion";

export default function ShippingTracker() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      fetch(`/api/orders/my-orders?profileId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          // Only show shipped/delivered orders
          setOrders(data.filter((o: any) => ['SHIPPED', 'DELIVERED'].includes(o.status)));
          setLoading(false);
        });
    }
  }, [user]);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (o.shipping_awb && o.shipping_awb.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
      <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Melacak Kargo...</p>
    </div>
  );

  return (
    <div className="space-y-12 text-left">
      <div className="space-y-3">
        <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">Pantau <br/> Kiriman.</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Lacak pergerakan batch kopi Anda secara real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* ACTIVE SHIPMENTS LIST */}
        <div className="lg:col-span-4 space-y-6">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
              <Input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari Resi atau Order ID..." 
                className="h-14 bg-white border-black/5 rounded-sm pl-12 text-xs font-bold shadow-sm focus-visible:ring-[#367F4D]" 
              />
           </div>

           <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                 <div className="bg-white p-10 rounded-sm border border-black/5 shadow-sm text-center space-y-4 opacity-50">
                    <Truck className="mx-auto text-stone-300" size={32} />
                    <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Tidak ada pengiriman aktif</p>
                 </div>
              ) : (
                filteredOrders.map((order, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={order.id} 
                    className="bg-white p-6 rounded-sm border border-black/5 shadow-sm hover:border-[#367F4D]/30 transition-colors cursor-pointer group"
                  >
                     <div className="flex justify-between items-start mb-4">
                        {order.status === 'DELIVERED' ? (
                          <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">Selesai</span>
                        ) : (
                          <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Dalam Perjalanan</span>
                        )}
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                     </div>
                     <h4 className="font-bold italic text-sm uppercase tracking-tight text-slate-900 group-hover:text-[#367F4D] transition-colors">#{order.id.slice(0,8)}</h4>
                     <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{order.shipping_courier || 'Kurir Eksternal'} • <span className="font-mono">{order.shipping_awb || 'MENUNGGU RESI'}</span></p>
                  </motion.div>
                ))
              )}
           </div>
        </div>

        {/* TRACKING TIMELINE */}
        <div className="lg:col-span-8">
           <div className="bg-slate-900 rounded-sm p-12 text-white shadow-2xl relative overflow-hidden h-full min-h-[500px] border border-black">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-3xl -mr-40 -mt-40" />
              
              {orders.length > 0 ? (
                <div className="space-y-12 relative z-10">
                   <div className="flex justify-between items-center pb-8 border-b border-white/10">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status Live</p>
                         <h3 className="font-display text-4xl font-bold italic tracking-tighter text-white">Dalam Perjalanan.</h3>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estimasi Tiba</p>
                         <h3 className="text-xl font-bold font-mono text-[#367F4D]">14 JUN 2026</h3>
                      </div>
                   </div>

                   {/* Timeline */}
                   <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-[#367F4D] before:via-white/10 before:to-transparent">
                      
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                         <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-[#367F4D] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <Truck size={14} />
                         </div>
                         <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-sm bg-white/5 border border-white/10 shadow">
                            <div className="flex items-center justify-between mb-2">
                               <div className="text-[10px] font-black uppercase tracking-widest text-[#367F4D]">Transit</div>
                               <div className="text-[9px] font-bold text-slate-400">10:42 WIB</div>
                            </div>
                            <div className="text-xs text-slate-300 font-medium leading-relaxed">Berangkat dari pusat penyortiran (Jakarta)</div>
                         </div>
                      </div>

                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                         <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-white/10 text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <MapPin size={14} />
                         </div>
                         <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-sm bg-transparent border border-white/5 shadow">
                            <div className="flex items-center justify-between mb-2">
                               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Diambil Kurir</div>
                               <div className="text-[9px] font-bold text-slate-500">08:15 WIB</div>
                            </div>
                            <div className="text-xs text-slate-400 font-medium leading-relaxed">Paket telah diserahkan ke pihak ekspedisi</div>
                         </div>
                      </div>

                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                         <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-white/10 text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <Package size={14} />
                         </div>
                         <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-sm bg-transparent border border-white/5 shadow">
                            <div className="flex items-center justify-between mb-2">
                               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dikemas</div>
                               <div className="text-[9px] font-bold text-slate-500">Kemarin</div>
                            </div>
                            <div className="text-xs text-slate-400 font-medium leading-relaxed">Manifest dibuat di fasilitas Fermion Lab</div>
                         </div>
                      </div>

                   </div>

                   <Button className="w-full bg-white/5 border border-white/10 hover:bg-[#367F4D] text-white hover:text-white rounded-sm h-14 uppercase text-[10px] font-black tracking-widest transition-all shadow-none mt-8">
                      Lacak via Portal Biteship <ExternalLink size={14} className="ml-2" />
                   </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 opacity-50">
                   <Truck size={64} strokeWidth={1} />
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pilih resi untuk melacak</p>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
