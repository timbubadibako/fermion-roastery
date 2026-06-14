"use client";

import React, { useState, useEffect } from "react";
import { Truck, Search, ExternalLink, Filter, MapPin, Package, MoreVertical, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminShippingLab() {
  const [shippedOrders, setShippedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipped();
  }, []);

  const fetchShipped = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setShippedOrders(data.filter((o: any) => ['SHIPPED', 'DELIVERED'].includes(o.status)));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Order status updated to ${status}`);
        fetchShipped();
      }
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Querying Logistics Data...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-left">
          <h1 className="display-font text-6xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">Shipping <br/> Lab.</h1>
          <p className="text-sm font-medium text-slate-500">Monitor all dispatched specimens and active cargo timelines.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="rounded-xl h-12 px-6 gap-2 border-slate-200 text-[10px] font-black uppercase tracking-widest"><Filter size={14} /> Filter Carriers</Button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[3.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-8">Protocol & Client</th>
                <th className="p-8">Cargo Carrier</th>
                <th className="p-8">Air Waybill (Resi)</th>
                <th className="p-8">Status</th>
                <th className="p-8 text-right">Operational</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shippedOrders.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs italic">No active cargo detected.</td></tr>
              ) : (
                shippedOrders.map((order, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={order.id} 
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-8">
                       <div className="space-y-1">
                          <p className="font-black uppercase italic text-slate-900 tracking-tight">#{order.id.slice(0, 8)}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{order.customer_name}</p>
                       </div>
                    </td>
                    <td className="p-8 font-black uppercase text-[10px] text-slate-500 tracking-widest">
                       {order.shipping_courier || 'UNKNOWN'}
                    </td>
                    <td className="p-8 font-mono font-bold text-xs text-periwinkle">
                       {order.shipping_awb || 'AWB_PENDING'}
                    </td>
                    <td className="p-8">
                       <span className={`status-badge uppercase px-3 py-1 ${order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-500 border border-blue-100'}`}>
                          {order.status}
                       </span>
                    </td>
                    <td className="p-8 text-right">
                       <div className="flex items-center justify-end gap-3">
                          {order.status === 'SHIPPED' && (
                             <Button 
                              onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                              className="h-10 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
                             >
                               Mark Delivered
                             </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300"><ExternalLink size={16} /></Button>
                       </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
