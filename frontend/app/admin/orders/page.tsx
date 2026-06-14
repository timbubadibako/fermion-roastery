"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  Search, 
  ArrowRight, 
  Beaker, 
  Truck, 
  CheckCircle2, 
  ChevronRight,
  MoreVertical,
  Filter,
  Save,
  X,
  Plus,
  Clock,
  Printer,
  Ban,
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Order {
  id: string;
  customer_name: string;
  status: string;
  total_amount: string;
  items: any[];
  shipping_awb?: string;
  shipping_courier?: string;
  shipping_label_url?: string;
}

export default function KanbanBoard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isQCModalOpen, setIsQCModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isAWBModalOpen, setIsAWBModalOpen] = useState(false);
  const [awbData, setAwbData] = useState({ courier: '', resi: '' });
  
  // QC Sliders State
  const [qcData, setQcData] = useState({ sweetness: 4.5, acidity: 3.2, body: 4.0 });

  useEffect(() => {
    fetchOrders();

    // Auto-refresh using Polling (Every 15 seconds)
    const interval = setInterval(() => {
      fetchOrders();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) setOrders(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string, additionalData?: any) => {
    try {
      const payload = { status: newStatus, ...additionalData };
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (e) {
      toast.error("Status update failed");
    }
  };

  const openQC = (order: Order) => {
    setSelectedOrder(order);
    setIsQCModalOpen(true);
  };

  const openReject = (order: Order) => {
    setSelectedOrder(order);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, order: Order) => {
    e.dataTransfer.setData("orderId", order.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    const orderId = e.dataTransfer.getData("orderId");
    if (!orderId) return;

    const order = orders.find(o => o.id === orderId);
    if (!order || order.status === newStatus) return;

    if (newStatus === 'SHIPPED') {
      setSelectedOrder(order);
      setIsAWBModalOpen(true);
    } else if (newStatus === 'ROASTING') {
      handleUpdateStatus(orderId, newStatus);
      openQC(order);
    } else {
      handleUpdateStatus(orderId, newStatus);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Memuat Antrean...</p>
    </div>
  );

  const columns = [
    { id: 'UNPAID', label: 'Belum Bayar', icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { id: 'PAID', label: 'Pesanan Baru', icon: Package, color: 'bg-slate-100 text-slate-600' },
    { id: 'READY_TO_SHIP', label: 'Siap Kirim (Resi OK)', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { id: 'ROASTING', label: 'Proses Roasting', icon: Beaker, color: 'bg-blue-500 text-white' },
    { id: 'SHIPPED', label: 'Sudah Diambil Kurir', icon: Truck, color: 'bg-emerald-500 text-white' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-left">
          <h1 className="display-font text-6xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">Papan <br/> Pesanan.</h1>
          <p className="text-sm font-medium text-slate-500">Pusat kendali operasional dan pengiriman kopi.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="rounded-xl h-12 px-6 gap-2 border-slate-200 text-[10px] font-black uppercase tracking-widest"><Filter size={14} /> Filter Antrean</Button>
           <Button className="bg-slate-950 text-white rounded-xl h-12 px-6 gap-2 text-[10px] font-black uppercase tracking-widest"><Plus size={14} /> Pesanan Manual</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-8">
        {columns.map(col => (
          <div 
            key={col.id} 
            className="flex flex-col h-full space-y-6"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
             <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-3">
                   <col.icon size={16} className="text-slate-400" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{col.label}</span>
                </div>
                <span className="text-[10px] font-black bg-white border border-slate-100 px-3 py-1 rounded-full text-slate-400 shadow-sm">
                   {orders.filter(o => o.status === col.id).length}
                </span>
             </div>

             <div className="flex-1 space-y-6 min-h-[600px] border-2 border-transparent border-dashed rounded-[3rem] transition-colors p-2 hover:border-slate-100">
                <AnimatePresence>
                  {orders.filter(o => o.status === col.id).map(order => (
                    <motion.div 
                      key={order.id}
                      layoutId={order.id}
                      draggable
                      onDragStart={(e: any) => handleDragStart(e, order)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`cursor-grab active:cursor-grabbing p-6 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all group relative overflow-hidden ${order.status === 'ROASTING' ? 'bg-slate-950 text-white border-blue-500/50' : 'bg-white hover:border-periwinkle'}`}
                    >
                       <div className="flex justify-between items-start mb-4">
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 opacity-60">#ORD-{order.id.slice(0, 8)}</p>
                          <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={14} /></button>
                       </div>
                       <h4 className={`font-black uppercase italic text-base leading-tight mb-1 ${order.status === 'ROASTING' ? 'text-white' : 'text-slate-900'}`}>{order.customer_name}</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                          {order.items?.length || 0} Items • Rp {parseInt(order.total_amount).toLocaleString()}
                       </p>

                       <div className="pt-4 border-t border-slate-50/10 space-y-2">
                          {order.status === 'UNPAID' && (
                             <Button 
                              onClick={() => handleUpdateStatus(order.id, 'PAID')}
                              className="w-full py-5 bg-amber-50 hover:bg-slate-950 hover:text-white text-amber-600 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all"
                             >
                               Konfirmasi Bayar <ChevronRight size={14} className="ml-1" />
                             </Button>
                          )}
                          {order.status === 'PAID' && (
                             <Button 
                              onClick={() => handleUpdateStatus(order.id, 'READY_TO_SHIP')}
                              className="w-full py-5 bg-slate-50 hover:bg-slate-950 hover:text-white text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all"
                             >
                               Terbitkan Resi <ChevronRight size={14} className="ml-1" />
                             </Button>
                          )}
                          {order.status === 'READY_TO_SHIP' && (
                             <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                   <Button 
                                    onClick={() => handleUpdateStatus(order.id, 'ROASTING')}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest h-10 px-0"
                                   >
                                      Terima
                                   </Button>
                                   <Button 
                                    onClick={() => openReject(order)}
                                    variant="outline"
                                    className="border-red-100 text-red-400 hover:bg-red-50 rounded-xl text-[8px] font-black uppercase tracking-widest h-10 px-0"
                                   >
                                      Tolak
                                   </Button>
                                </div>
                                {order.shipping_label_url && (
                                  <Button 
                                    onClick={() => window.open(order.shipping_label_url, '_blank')}
                                    variant="outline"
                                    className="w-full py-4 border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all gap-2"
                                  >
                                    <Printer size={12} /> Cetak Label
                                  </Button>
                                )}
                             </div>
                          )}
                          {order.status === 'ROASTING' && (
                             <Button 
                              onClick={() => openQC(order)}
                              className="w-full py-5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all"
                             >
                                Input Detail Rasa <Beaker size={14} className="ml-1" />
                             </Button>
                          )}
                          {order.status === 'SHIPPED' && (
                             <div className="space-y-3">
                                <div className="flex items-center gap-2 text-emerald-500">
                                   <CheckCircle2 size={14} />
                                   <span className="text-[9px] font-black uppercase tracking-widest">Dalam Pengiriman</span>
                                </div>
                                <Button 
                                  onClick={() => window.open(`https://biteship.com/track/${order.shipping_awb}`, '_blank')}
                                  variant="outline"
                                  className="w-full py-4 border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all gap-2"
                                >
                                  <Navigation size={12} /> Pantau Lokasi
                                </Button>
                             </div>
                          )}
                       </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
          </div>
        ))}
      </div>

      {/* REJECT MODAL */}
      <AnimatePresence>
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
             <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[3rem] w-full max-w-md p-10 space-y-8 shadow-2xl text-left"
             >
                <div className="flex justify-between items-start">
                   <h2 className="display-font text-3xl italic font-black text-slate-950 leading-none">Tolak Pesanan.</h2>
                   <button onClick={() => setIsRejectModalOpen(false)}><X size={20} /></button>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Alasan Penolakan</label>
                   <textarea 
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Contoh: Stok Green Bean Gayo habis..."
                    className="w-full h-32 bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold"
                   />
                </div>
                <Button 
                  onClick={() => {
                    handleUpdateStatus(selectedOrder!.id, 'CANCELLED', { rejection_reason: rejectionReason });
                    setIsRejectModalOpen(false);
                  }}
                  disabled={!rejectionReason}
                  className="w-full h-14 bg-red-500 text-white rounded-2xl font-black uppercase italic text-[10px]"
                >
                   Batalkan Pesanan <Ban size={16} className="ml-2" />
                </Button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QC MODAL */}
      <AnimatePresence>
        {isQCModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
             <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3.5rem] w-full max-w-xl p-12 space-y-10 shadow-2xl relative overflow-hidden text-left"
             >
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <span className="status-badge bg-blue-500 text-white uppercase tracking-widest px-3 py-1 rounded-full text-[8px] font-black">Detail_Rasa</span>
                      <h2 className="display-font text-4xl italic font-black tracking-tighter text-slate-950 leading-none mt-2">Detail Produk.</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedOrder?.customer_name}</p>
                   </div>
                   <button onClick={() => setIsQCModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <div className="space-y-10">
                   {[
                     { id: 'sweetness', label: 'Sweetness Intensity' },
                     { id: 'acidity', label: 'Acidity Brightness' },
                     { id: 'body', label: 'Mouthfeel / Body' }
                   ].map(sensor => (
                     <div key={sensor.id} className="space-y-4">
                        <div className="flex justify-between items-end">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{sensor.label}</label>
                           <span className="text-xl font-black italic text-periwinkle">{(qcData as any)[sensor.id]}/5.0</span>
                        </div>
                        <input 
                          type="range" min="0" max="5" step="0.1" 
                          value={(qcData as any)[sensor.id]}
                          onChange={(e) => setQcData({...qcData, [sensor.id]: parseFloat(e.target.value)})}
                          className="w-full h-1.5 bg-slate-100 appearance-none cursor-pointer rounded-full accent-periwinkle" 
                        />
                     </div>
                   ))}
                </div>

                <Button 
                  onClick={() => {
                    handleUpdateStatus(selectedOrder!.id, 'ROASTING', { qcData }); // Keep in ROASTING but save QC
                    setIsQCModalOpen(false);
                    toast.success("Data disimpan. Pesanan siap dikirim.");
                  }}
                  className="w-full h-16 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] italic text-[10px] shadow-2xl hover:bg-periwinkle transition-all"
                >
                   Simpan & Tutup <CheckCircle2 size={18} className="ml-2" />
                </Button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AWB/RESI MODAL (Manual Fallback) */}
      <AnimatePresence>
        {isAWBModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
             <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3.5rem] w-full max-w-lg p-12 space-y-10 shadow-2xl relative overflow-hidden text-left"
             >
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <span className="status-badge bg-emerald-500 text-white uppercase tracking-widest px-3 py-1 rounded-full text-[8px] font-black">Manajemen_Kirim</span>
                      <h2 className="display-font text-4xl italic font-black tracking-tighter text-slate-900 leading-none mt-2">Pengiriman.</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Input Resi Manual untuk #{selectedOrder?.id.slice(0,8)}</p>
                   </div>
                   <button onClick={() => setIsAWBModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Courier Name</label>
                      <Input 
                        value={awbData.courier}
                        onChange={(e) => setAwbData({...awbData, courier: e.target.value})}
                        placeholder="e.g. JNE Trucking" 
                        className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-xs font-bold text-slate-900" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Air Waybill (Resi)</label>
                      <Input 
                        value={awbData.resi}
                        onChange={(e) => setAwbData({...awbData, resi: e.target.value})}
                        placeholder="AWB123456789" 
                        className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-xs font-bold text-slate-900 font-mono" 
                      />
                   </div>
                </div>

                <Button 
                  onClick={() => {
                    handleUpdateStatus(selectedOrder!.id, 'SHIPPED', { shipping_courier: awbData.courier, shipping_awb: awbData.resi });
                    setIsAWBModalOpen(false);
                    setAwbData({ courier: '', resi: '' });
                  }}
                  disabled={!awbData.courier || !awbData.resi}
                  className="w-full h-16 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] italic text-[10px] shadow-2xl hover:bg-emerald-600 transition-all"
                >
                   Konfirmasi Pengiriman <Truck size={18} className="ml-2" />
                </Button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
