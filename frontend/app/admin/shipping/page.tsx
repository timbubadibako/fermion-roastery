"use client";

import React, { useState, useEffect } from "react";
import { Truck, Search, ExternalLink, Filter, MapPin, Package, MoreVertical, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export default function AdminShippingLab() {
  const [shippedOrders, setShippedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState<string | null>(null);

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
        toast.success(`Status pesanan diperbarui ke ${status}`);
        fetchShipped();
      }
    } catch (e) {
      toast.error("Gagal memperbarui status");
    }
  };

  const openConfirmDeliver = (id: string) => {
    setOrderToConfirm(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDeliver = () => {
    if (orderToConfirm) {
      handleUpdateStatus(orderToConfirm, 'DELIVERED');
      setOrderToConfirm(null);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Memuat Data Logistik...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-left">
          <h1 className="display-font text-6xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">Manajemen <br/> Logistik.</h1>
          <p className="text-sm font-medium text-slate-500">Pantau seluruh pengiriman produk dan riwayat kargo yang aktif.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="rounded-xl h-12 px-6 gap-2 border-slate-200 text-[10px] font-black uppercase tracking-widest"><Filter size={14} /> Filter Kurir</Button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[3.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-8">ID & Nama Pembeli</th>
                <th className="p-8">Kurir</th>
                <th className="p-8">Nomor Resi (AWB)</th>
                <th className="p-8">Status</th>
                <th className="p-8 text-right">Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shippedOrders.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs italic">Tidak ada pengiriman aktif.</td></tr>
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
                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-500'}`}>
                          {order.status === 'DELIVERED' ? 'Diterima' : 'Dikirim'}
                       </span>
                    </td>
                    <td className="p-8 text-right">
                       <div className="flex items-center justify-end gap-3">
                          {order.status === 'SHIPPED' && (
                             <Button 
                              onClick={() => openConfirmDeliver(order.id)}
                              className="h-10 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
                             >
                               Tandai Diterima
                             </Button>
                          )}
                          <Button 
                            onClick={() => window.open(`https://biteship.com/track/${order.shipping_awb}`, '_blank')}
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                            title="Lacak Paket di Biteship"
                          >
                            <ExternalLink size={16} />
                          </Button>
                       </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeliver}
        title="Selesaikan Pengiriman?"
        description="Apakah Anda yakin paket ini sudah diterima oleh pelanggan? Status akan berubah menjadi Selesai."
        confirmText="Ya, Selesai"
        cancelText="Batal"
      />
    </div>
  );
}
