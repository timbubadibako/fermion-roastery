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
  FileText,
  Clock,
  CheckCircle2,
  Package,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";
import { toast } from "sonner";

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

  const getStatusConfig = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'PENDING': return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock, label: 'Menunggu' };
      case 'PROCESSING': return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: Package, label: 'Diproses' };
      case 'SHIPPED': return { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: Truck, label: 'Dikirim' };
      case 'DELIVERED': return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle2, label: 'Selesai' };
      default: return { color: 'text-stone-600', bg: 'bg-stone-50', border: 'border-stone-100', icon: Clock, label: status || 'Unknown' };
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
      <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Memuat Riwayat...</p>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 relative text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">
            Riwayat<span className="text-[#367F4D]">.</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Lacak transaksi & Unduh Invoice Resmi</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-stone-50 border border-dashed border-black/10 rounded-2xl p-16 text-center flex flex-col items-center justify-center min-h-[40vh]">
          <History className="text-stone-300 mb-4" size={40} />
          <h4 className="font-bold text-slate-400 uppercase tracking-widest text-sm">Belum Ada Transaksi</h4>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">Riwayat pemesanan B2B Anda akan muncul di sini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const status = getStatusConfig(order.status);
            const StatusIcon = status.icon;

            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={order.id} 
                className="bg-white border border-black/5 rounded-2xl p-6 hover:border-[#367F4D]/30 transition-all shadow-sm hover:shadow-md group flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Order Info */}
                <div className="flex items-start gap-6">
                   <div className="w-14 h-14 bg-stone-50 rounded-xl flex items-center justify-center shrink-0 border border-black/5 group-hover:scale-105 transition-transform">
                      <FileText className="text-stone-400" size={24} />
                   </div>
                   <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                         <h3 className="font-black uppercase italic text-sm tracking-tight text-[#367F4D]">#ORD-{order.id.slice(0, 8)}</h3>
                         <div className={`px-3 py-1 ${status.bg} ${status.border} border rounded-full flex items-center gap-1.5`}>
                            <StatusIcon size={12} className={status.color} />
                            <span className={`text-[9px] font-black uppercase tracking-widest ${status.color}`}>{status.label}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <span className="flex items-center gap-1.5"><Calendar size={12}/> {new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                   </div>
                </div>

                {/* Right: Price & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:border-l lg:border-black/5 lg:pl-8">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Pembayaran</p>
                      <p className="text-xl font-bold text-slate-900 tracking-tight">Rp {parseInt(order.total_amount).toLocaleString('id-ID')}</p>
                   </div>
                   <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button 
                        onClick={() => {
                           if (order.pdf_url) {
                              window.open(order.pdf_url, '_blank');
                           } else {
                              toast.info("Invoice belum tersedia atau sedang diproses.");
                           }
                        }}
                        variant="outline" 
                        className="flex-1 sm:flex-none h-12 bg-white text-slate-600 border-black/10 hover:bg-stone-50 rounded-lg font-black uppercase tracking-widest text-[9px] shadow-sm"
                      >
                         <Download size={14} className="mr-2" /> Invoice
                      </Button>
                      
                      {['READY_TO_SHIP', 'SHIPPED', 'DELIVERED'].includes(order.status) && (
                        <Link href="/b2b/shipping" className="flex-1 sm:flex-none">
                          <Button 
                            className="w-full h-12 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition-all border border-emerald-100 shadow-none font-black uppercase tracking-widest text-[9px]"
                          >
                             <Truck size={14} className="mr-2" /> Lacak
                          </Button>
                        </Link>
                      )}
                   </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
