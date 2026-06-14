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

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Locating Cargo Data...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="space-y-2 text-left">
        <h1 className="display-font text-6xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">Cargo <br/> Tracking.</h1>
        <p className="text-sm font-medium text-slate-500">Live timeline tracking for your dispatched laboratory specimens.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* ACTIVE SHIPMENTS LIST */}
        <div className="lg:col-span-4 space-y-6">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input placeholder="Search AWB or Protocol ID..." className="h-14 bg-white border-slate-100 rounded-3xl pl-12 text-xs font-bold shadow-sm" />
           </div>

           <div className="space-y-4">
              {orders.length === 0 ? (
                 <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm text-center space-y-4 opacity-50">
                    <Truck className="mx-auto text-slate-300" size={32} />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">No active cargo detected</p>
                 </div>
              ) : (
                orders.map((order, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={order.id} 
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-periwinkle transition-colors cursor-pointer group"
                  >
                     <div className="flex justify-between items-start mb-4">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">IN_TRANSIT</span>
                        <p className="text-[10px] font-bold text-slate-400">{new Date(order.created_at).toLocaleDateString()}</p>
                     </div>
                     <h4 className="font-black italic text-sm uppercase tracking-tight text-slate-900 group-hover:text-periwinkle transition-colors">#{order.id.slice(0,8)}</h4>
                     <p className="text-[10px] font-bold text-slate-500 mt-1">{order.shipping_courier || 'J&T Cargo'} • <span className="font-mono">{order.shipping_awb || 'AWB-PENDING'}</span></p>
                  </motion.div>
                ))
              )}
           </div>
        </div>

        {/* TRACKING TIMELINE */}
        <div className="lg:col-span-8">
           <div className="bg-slate-950 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden h-full min-h-[500px]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-periwinkle/10 blur-3xl -mr-40 -mt-40" />
              
              {orders.length > 0 ? (
                <div className="space-y-12 relative z-10">
                   <div className="flex justify-between items-center pb-8 border-b border-white/10">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Status</p>
                         <h3 className="display-font text-3xl font-black italic">On The Way.</h3>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Est. Arrival</p>
                         <h3 className="text-xl font-bold font-mono text-periwinkle">14 JUN 2026</h3>
                      </div>
                   </div>

                   {/* Timeline */}
                   <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                      
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                         <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-periwinkle text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <Truck size={14} />
                         </div>
                         <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white/5 border border-white/10 shadow">
                            <div className="flex items-center justify-between mb-1">
                               <div className="text-[10px] font-black uppercase tracking-widest text-periwinkle">In Transit</div>
                               <div className="text-[9px] font-bold text-slate-500">10:42 AM</div>
                            </div>
                            <div className="text-xs text-slate-300">Departed from Sorting Center (Jakarta)</div>
                         </div>
                      </div>

                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                         <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-white/20 text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <MapPin size={14} />
                         </div>
                         <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-transparent border border-white/5 shadow">
                            <div className="flex items-center justify-between mb-1">
                               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Picked Up</div>
                               <div className="text-[9px] font-bold text-slate-500">08:15 AM</div>
                            </div>
                            <div className="text-xs text-slate-500">Package handed over to courier</div>
                         </div>
                      </div>

                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                         <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-white/20 text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <Package size={14} />
                         </div>
                         <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-transparent border border-white/5 shadow">
                            <div className="flex items-center justify-between mb-1">
                               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Packed</div>
                               <div className="text-[9px] font-bold text-slate-500">Yesterday</div>
                            </div>
                            <div className="text-xs text-slate-500">Manifest generated at Fermion Lab</div>
                         </div>
                      </div>

                   </div>

                   <Button className="w-full bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl h-14 uppercase text-[10px] font-black tracking-widest transition-all">
                      Open Biteship Portal <ExternalLink size={14} className="ml-2" />
                   </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 opacity-50">
                   <Truck size={64} strokeWidth={1} />
                   <p className="text-[10px] font-black uppercase tracking-widest">Select a shipment to track</p>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
