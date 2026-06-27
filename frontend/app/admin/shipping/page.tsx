"use client";

import { apiFetch } from "@/lib/api"; // atau "../../lib/api" tergantung posisi file
import React, { useState, useEffect } from "react";
import { Truck, Search, ExternalLink, Filter, MapPin, Package, MoreVertical, CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export default function AdminShippingLab() {
  const [shippedOrders, setShippedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [courierFilter, setCourierFilter] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchShipped();
  }, []);

  const fetchShipped = async () => {
    try {
      const res = await apiFetch("/api/admin/orders");
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
      const res = await apiFetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Status pengiriman diperbarui.`);
        fetchShipped();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.message || "Gagal memperbarui status.");
      }
    } catch (e) {
      toast.error("Gagal memperbarui status.");
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
      setIsConfirmModalOpen(false);
    }
  };

  // Unique couriers for filter
  const couriers = Array.from(new Set(shippedOrders.map(o => o.shipping_courier))).filter(Boolean);

  const filteredOrders = shippedOrders.filter(order => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_awb?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourier = !courierFilter || order.shipping_courier === courierFilter;

    return matchesSearch && matchesCourier;
  });

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
      <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Memproses Data Logistik...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/5 pb-10">
        <div className="space-y-3 text-left">
          <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">Manajemen <br /> Pengiriman.</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Pemantauan logistik real-time dan kendali kargo aktif.</p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={14} />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari Nama, ID, atau Resi..."
              className="pl-10 h-12 w-64 bg-white border-black/10 rounded-sm text-[10px] font-bold focus-visible:ring-[#367F4D]"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-sm h-12 px-6 gap-2 bg-white border border-black/10 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-stone-50 transition-all shadow-none">
                <Filter size={14} /> {courierFilter || "Semua Kurir"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-sm border-black/5 shadow-2xl p-1 bg-white">
              <DropdownMenuItem onClick={() => setCourierFilter(null)} className="text-[10px] font-bold uppercase py-3 focus:bg-stone-50">Semua Kurir</DropdownMenuItem>
              {couriers.map(c => (
                <DropdownMenuItem key={c} onClick={() => setCourierFilter(c)} className="text-[10px] font-bold uppercase py-3 focus:bg-stone-50 focus:text-[#367F4D]">{c}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-white border border-black/5 rounded-sm overflow-hidden shadow-sm">
        <div className="p-8 border-b border-black/5 flex items-center justify-between bg-stone-50/50">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Kargo Aktif ({filteredOrders.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-black/5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-8 font-black">ID & Nama Penerima</th>
                <th className="p-8 font-black">Mitra Kurir</th>
                <th className="p-8 font-black">Nomor Resi (AWB)</th>
                <th className="p-8 font-black">Status Logistik</th>
                <th className="p-8 text-right font-black">Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={5} className="p-24 text-center text-stone-300 font-bold uppercase tracking-widest text-xs italic">Tidak ada pengiriman aktif terdeteksi.</td></tr>
              ) : (
                filteredOrders.map((order, i) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={order.id}
                    className="hover:bg-stone-50/50 transition-colors group"
                  >
                    <td className="p-8">
                      <div className="space-y-1">
                        <p className="font-bold uppercase tracking-tight text-slate-900">#{order.id.slice(0, 8)}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.customer_name}</p>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-stone-100 px-3 py-1 rounded-sm border border-black/5">{order.shipping_courier || 'UNKNOWN'}</span>
                    </td>
                    <td className="p-8 font-mono font-bold text-xs text-[#367F4D]">
                      {order.shipping_awb || 'MENUNGGU_RESI'}
                    </td>
                    <td className="p-8">
                      {order.status === 'DELIVERED' ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full w-fit">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Telah Diterima</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full w-fit">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Dalam Pengiriman</span>
                        </div>
                      )}
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex items-center justify-end gap-4">
                        {order.status === 'SHIPPED' && (
                          <Button
                            onClick={() => openConfirmDeliver(order.id)}
                            className="h-10 px-6 bg-slate-900 hover:bg-[#367F4D] text-white rounded-sm text-[9px] font-black uppercase tracking-widest transition-all shadow-none border-none"
                          >
                            Tandai Sampai
                          </Button>
                        )}
                        <Button
                          onClick={() => window.open(`https://biteship.com/track/${order.shipping_awb}`, '_blank')}
                          className="h-10 w-10 rounded-sm bg-white border border-black/5 text-slate-400 hover:text-slate-900 hover:bg-stone-50 transition-all shadow-none"
                          title="Lacak Paket"
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
        title="Konfirmasi Kedatangan?"
        description="Apakah Anda yakin paket ini telah sampai di tangan pelanggan? Status akan diperbarui menjadi Selesai."
        confirmText="Ya, Sudah Sampai"
        cancelText="Batal"
      />
    </div>
  );
}
