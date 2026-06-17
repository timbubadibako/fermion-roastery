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
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
      <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Memuat Riwayat...</p>
    </div>
  );

  return (
    <div className="space-y-12 text-left">
      <div className="space-y-3">
        <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">Riwayat <br/> Pesanan.</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Lacak riwayat transaksi komersial dan unduh invoice resmi.</p>
      </div>

      <div className="bg-white border border-black/5 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-black/5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-8 font-black">ID Pesanan</th>
                <th className="p-8 font-black">Tanggal</th>
                <th className="p-8 font-black">Total Berat</th>
                <th className="p-8 font-black">Total Pembayaran</th>
                <th className="p-8 text-right font-black">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {orders.length === 0 ? (
                <tr><td colSpan={5} className="p-24 text-center text-stone-300 font-bold uppercase tracking-widest text-xs italic">Belum ada riwayat transaksi komersial.</td></tr>
              ) : (
                orders.map((order, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={order.id} 
                    className="hover:bg-stone-50/50 transition-colors group"
                  >
                    <td className="p-8 font-black uppercase italic text-xs tracking-tight text-[#367F4D]">#ORD-{order.id.slice(0, 8)}</td>
                    <td className="p-8">
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                    </td>
                    <td className="p-8 font-bold text-xs text-slate-900">
                       {(parseFloat(order.total_amount) / 120000).toFixed(1)} <span className="text-slate-400 font-medium">KG</span>
                    </td>
                    <td className="p-8 font-black text-xs text-slate-900">Rp {parseInt(order.total_amount).toLocaleString('id-ID')}</td>
                    <td className="p-8 text-right">
                       <div className="flex items-center justify-end gap-3">
                          <button className="h-10 px-6 bg-white border border-black/5 hover:bg-stone-50 hover:text-slate-900 text-slate-500 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-none">
                             <FileText size={14} /> PDF Invoice
                          </button>
                          {['SHIPPED', 'DELIVERED'].includes(order.status) && (
                            <button className="h-10 w-10 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-sm flex items-center justify-center transition-all border border-emerald-100 shadow-none border-none">
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
