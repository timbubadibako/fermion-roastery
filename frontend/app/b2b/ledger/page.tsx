"use client";

import React, { useState, useEffect } from "react";
import { 
  History, 
  Search, 
  Download, 
  Truck, 
  ExternalLink,
  ChevronRight,
  MoreVertical,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store";

export default function OrderLedger() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders/my-orders?profileId=${user?.id}`);
      if (res.ok) setOrders(await res.json());
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Querying Ledger...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="space-y-2 text-left">
        <h1 className="display-font text-6xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">Order <br/> Logs.</h1>
        <p className="text-sm font-medium text-slate-500">Track your commercial history and download official laboratory invoices.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-[3.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-8">Protocol ID</th>
                <th className="p-8">Details</th>
                <th className="p-8">Total Weight</th>
                <th className="p-8">Net Settlement</th>
                <th className="p-8 text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs italic">No commercial records found.</td></tr>
              ) : (
                orders.map((order, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={order.id} 
                    className="hover:bg-slate-50/30 transition-colors group"
                  >
                    <td className="p-8 font-black uppercase italic text-xs tracking-tight">#ORD-${order.id.slice(0, 8)}</td>
                    <td className="p-8">
                       <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="p-8 font-bold text-xs">
                       {(parseFloat(order.total_amount) / 120000).toFixed(1)} <span className="text-slate-300 font-medium">KG</span>
                    </td>
                    <td className="p-8 font-black text-xs">Rp {parseInt(order.total_amount).toLocaleString()}</td>
                    <td className="p-8 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="h-10 px-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                             <FileText size={14} /> PDF Invoice
                          </button>
                          {order.status === 'SHIPPED' && (
                            <button className="h-10 w-10 bg-periwinkle/10 text-periwinkle hover:bg-periwinkle hover:text-white rounded-xl flex items-center justify-center transition-all">
                               <Truck size={16} />
                            </button>
                          )}
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
