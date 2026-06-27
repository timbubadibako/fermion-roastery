"use client";

import { apiFetch } from "@/lib/api"; // atau "../../lib/api" tergantung posisi file
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
  Navigation,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface Order {
  id: string;
  customer_name: string;
  customer_phone?: string;
  status: string;
  total_amount: string;
  items: any[];
  shipping_awb?: string;
  shipping_courier?: string;
  shipping_label_url?: string;
  biteship_order_id?: string;
  created_at?: string;
}

export default function KanbanBoard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isQCModalOpen, setIsQCModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isAWBModalOpen, setIsAWBModalOpen] = useState(false);
  const [awbData, setAwbData] = useState({ type: 'ekspedisi', courier: '', resi: '' });

  // Batch Mode State
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // QC Sliders State
  const [qcData, setQcData] = useState({ sweetness: 4.5, acidity: 3.2, body: 4.0 });

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await apiFetch("/api/admin/orders");
      if (res.ok) setOrders(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string, additionalData?: any) => {
    try {
      const res = await apiFetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus, ...additionalData })
      });
      if (res.ok) {
        toast.success(`Status diperbarui ke ${newStatus}`);
        fetchOrders();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.message || "Gagal memperbarui status.");
      }
    } catch (e) {
      toast.error("Gagal memperbarui status.");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBatchPrint = async (ids?: any) => {
    const targetIds = Array.isArray(ids) ? ids : selectedIds;
    if (!targetIds || targetIds.length === 0) return;

    toast.loading(`Mempersiapkan ${targetIds.length} label pengiriman...`);
    try {
      const res = await fetch("/api/shipping/batch-labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: targetIds })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const win = window.open(url, '_blank');
        if (win) {
          win.focus();
          toast.dismiss();
          toast.success("PDF Berhasil dibuat.");
        } else {
          toast.error("Gagal membuka tab baru. Mohon periksa pop-up blocker.");
        }
      } else {
        toast.error("Gagal membuat PDF label.");
      }
    } catch (e) {
      console.error("Batch print error:", e);
      toast.error("Kesalahan jaringan saat membuat PDF.");
    } finally {
      toast.dismiss();
    }
  };

  const handlePrintLabel = (order: Order) => {
    handleBatchPrint([order.id]);
  };

  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    e.dataTransfer.setData("orderId", orderId);
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
      setSelectedOrder(order);
      setIsQCModalOpen(true);
    } else {
      handleUpdateStatus(orderId, newStatus);
    }
  };

  const openReject = (order: Order) => {
    setSelectedOrder(order);
    setIsRejectModalOpen(true);
  };

  const openQC = (order: Order) => {
    setSelectedOrder(order);
    setIsQCModalOpen(true);
  };

  const handleExportCSV = () => {
    if (!orders.length) {
      toast.error("Tidak ada data pesanan untuk diekspor");
      return;
    }

    // CSV Header
    const headers = [
      "Order ID", "Tanggal", "Nama Pelanggan", "Telepon", "Total Tagihan (Rp)",
      "Status", "Kurir", "No Resi", "Jumlah Item", "Produk"
    ];

    // CSV Rows
    const rows = orders.map(o => {
      const date = new Date(o.created_at || Date.now()).toLocaleDateString('id-ID');
      const itemsDetail = o.items?.map(i => `${i.quantity}x ${i.product_name}`).join('; ') || '';
      return [
        o.id,
        date,
        `"${o.customer_name || ''}"`,
        `"${o.customer_phone || ''}"`,
        o.total_amount,
        o.status,
        `"${o.shipping_courier || ''}"`,
        `"${o.shipping_awb || ''}"`,
        o.items?.length || 0,
        `"${itemsDetail}"`
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fermion_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Laporan berhasil diunduh");
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
      <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Mengakses Data Logistik...</p>
    </div>
  );

  const columns = [
    { id: 'UNPAID', label: 'Menunggu Bayar', icon: Clock },
    { id: 'PAID', label: 'Pesanan Baru', icon: Package },
    { id: 'READY_TO_SHIP', label: 'Siap Kirim', icon: CheckCircle2 },
    { id: 'ROASTING', label: 'Proses Roasting', icon: Beaker },
    { id: 'SHIPPED', label: 'Sudah Dikirim', icon: Truck },
  ];

  const filteredOrders = orders.filter(o => {
    const query = searchQuery.toLowerCase();
    return (
      o.customer_name.toLowerCase().includes(query) ||
      o.id.toLowerCase().includes(query) ||
      `#ORD-${o.id.slice(0, 8)}`.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/5 pb-10">
        <div className="space-y-3 text-left">
          <h1 className="text-5xl md:text-7xl font-display italic tracking-tighter text-slate-900 leading-none">Manajemen <br /> Pesanan.</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Pusat kendali operasional dan pengiriman kopi.</p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <Button
            onClick={() => {
              setIsBatchMode(!isBatchMode);
              if (isBatchMode) setSelectedIds([]);
              else setSelectedIds(orders.filter(o => o.status === 'READY_TO_SHIP').map(o => o.id));
            }}
            className={`h-12 px-6 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all border shadow-none ${isBatchMode ? 'bg-[#367F4D] text-white border-[#367F4D] hover:bg-[#2d6a41]' : 'bg-white border-black/10 text-slate-600 hover:bg-stone-50 hover:text-[#367F4D] hover:border-[#367F4D]/30'}`}
          >
            {isBatchMode ? 'Matikan Mode Massal' : 'Mode Cetak Massal'}
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="h-12 px-6 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all border border-black/10 bg-white text-slate-600 shadow-none hover:bg-stone-50 hover:text-emerald-600 hover:border-emerald-600/30"
          >
            <Download size={14} className="mr-2" /> Unduh CSV
          </Button>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={14} />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari Nama atau #ORD-..."
              className="pl-10 h-12 w-64 bg-white border-black/10 rounded-sm text-[10px] font-bold focus-visible:ring-[#367F4D] focus-visible:border-[#367F4D]/30"
            />
          </div>
          {isBatchMode && selectedIds.length > 0 && (
            <Button onClick={handleBatchPrint} className="h-12 px-8 bg-slate-900 text-white rounded-sm font-black uppercase tracking-widest italic shadow-xl hover:bg-[#367F4D] transition-all gap-3 animate-in fade-in slide-in-from-right-4 border-none">
              <Printer size={14} /> Cetak {selectedIds.length} Label
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {columns.map(col => (
          <div
            key={col.id}
            className="flex flex-col h-full space-y-6"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                <col.icon size={16} className="text-[#367F4D]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">{col.label}</span>
              </div>
              <span className="text-sm font-black bg-stone-900 text-white px-3 py-1 rounded-sm shadow-md min-w-[32px] text-center">
                {filteredOrders.filter(o => o.status === col.id).length}
              </span>
            </div>

            <div className="flex-1 space-y-4 min-h-[600px] border border-transparent border-dashed rounded-sm transition-colors p-1 hover:border-black/5">
              <AnimatePresence>
                {filteredOrders.filter(o => o.status === col.id).map(order => {
                  const isSelected = selectedIds.includes(order.id);
                  return (
                    <motion.div
                      key={order.id}
                      layoutId={order.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, order.id)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-6 rounded-sm border transition-all relative overflow-hidden group cursor-grab active:cursor-grabbing ${isSelected ? 'border-[#367F4D] bg-[#367F4D]/[0.02] shadow-md' : 'bg-white border-black/5 hover:border-black/10 shadow-sm'
                        }`}
                    >
                      {isBatchMode && col.id === 'READY_TO_SHIP' && (
                        <button
                          onClick={() => toggleSelect(order.id)}
                          className={`absolute top-0 left-0 w-full h-full z-20 transition-all ${isSelected ? 'bg-transparent' : 'bg-transparent hover:bg-stone-50/40'}`}
                        />
                      )}

                      <div className="flex justify-between items-start mb-4 relative z-10">
                        {order.biteship_order_id ? (
                          <a
                            href={order.status === 'UNPAID' ? 'https://dashboard.biteship.com/draft-orders' : `https://dashboard.biteship.com/orders/details/${order.biteship_order_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[8px] font-black uppercase tracking-widest text-[#367F4D] hover:underline"
                          >
                            #ORD-{order.id.slice(0, 8)}
                          </a>
                        ) : (
                          <p className="text-[8px] font-black uppercase tracking-widest text-stone-300">#ORD-{order.id.slice(0, 8)}</p>
                        )}

                        {isBatchMode && col.id === 'READY_TO_SHIP' ? (
                          <div className={`w-5 h-5 rounded-sm border transition-all flex items-center justify-center ${isSelected ? 'bg-[#367F4D] border-[#367F4D] text-white' : 'bg-white border-black/10'}`}>
                            {isSelected && <CheckCircle2 size={12} />}
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="text-stone-300 hover:text-slate-600 transition-colors p-1 outline-none"><MoreVertical size={14} /></button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-sm border-black/5 shadow-xl font-sans p-1 bg-white">
                              <DropdownMenuItem
                                className="text-[10px] font-bold uppercase tracking-widest py-3 cursor-pointer text-slate-600 focus:bg-stone-50 focus:text-slate-900 outline-none"
                                onClick={() => window.open(order.status === 'UNPAID' ? 'https://dashboard.biteship.com/draft-orders' : `https://dashboard.biteship.com/orders/details/${order.biteship_order_id}`, '_blank')}
                              >
                                Detail Biteship
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-[10px] font-bold uppercase tracking-widest py-3 cursor-pointer text-[#367F4D] focus:bg-[#367F4D]/5 focus:text-[#367F4D] outline-none"
                                onClick={() => window.open(`https://wa.me/${order.customer_phone?.replace(/\D/g, '')}`, '_blank')}
                              >
                                Hubungi WhatsApp
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-black/5" />
                              <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-widest py-3 cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600 outline-none" onClick={() => openReject(order)}>
                                Batalkan Pesanan
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>

                      <div className="relative z-10">
                        <h4 className="font-bold uppercase tracking-tight text-sm text-slate-900 leading-tight mb-1">{order.customer_name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 font-mono">
                          Rp {parseInt(order.total_amount).toLocaleString('id-ID')}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-black/5 space-y-2 relative z-10">
                        {order.status === 'UNPAID' && (
                          <Button onClick={() => handleUpdateStatus(order.id, 'PAID')} className="w-full h-10 bg-amber-50 hover:bg-slate-900 hover:text-white text-amber-600 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all border-none">
                            Konfirmasi Bayar
                          </Button>
                        )}
                        {order.status === 'PAID' && (
                          <Button onClick={() => handleUpdateStatus(order.id, 'READY_TO_SHIP')} className="w-full h-10 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all border-none">
                            Terbitkan Resi
                          </Button>
                        )}
                        {order.status === 'READY_TO_SHIP' && !isBatchMode && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <Button onClick={() => handleUpdateStatus(order.id, 'ROASTING')} className="bg-[#367F4D] hover:bg-emerald-700 text-white rounded-sm text-[8px] font-black uppercase tracking-widest h-9 border-none">Terima</Button>
                              <Button onClick={() => openReject(order)} className="bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-sm text-[8px] font-black uppercase tracking-widest h-9 border-none">Tolak</Button>
                            </div>
                            {order.shipping_label_url && (
                              <Button onClick={() => handlePrintLabel(order)} className="w-full h-9 bg-white border border-black/5 hover:bg-stone-50 text-slate-400 hover:text-slate-900 rounded-sm text-[8px] font-black uppercase tracking-widest transition-all gap-2 shadow-none">
                                <Printer size={12} /> Cetak Label
                              </Button>
                            )}
                          </div>
                        )}
                        {order.status === 'ROASTING' && (
                          <Button onClick={() => openQC(order)} className="w-full h-10 bg-slate-900 hover:bg-[#367F4D] text-white rounded-sm text-[9px] font-black uppercase tracking-widest transition-all border-none">
                            Input Detail Rasa
                          </Button>
                        )}
                        {order.status === 'SHIPPED' && (
                          <Button onClick={() => window.open(`https://biteship.com/track/${order.shipping_awb}`, '_blank')} className="w-full h-10 bg-white border border-black/5 hover:bg-stone-50 text-slate-400 hover:text-slate-900 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all gap-2 shadow-none">
                            <Navigation size={12} /> Lacak Lokasi
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
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
              className="bg-white rounded-sm w-full max-w-md p-10 space-y-8 shadow-2xl text-left border border-black/5"
            >
              <div className="flex justify-between items-start">
                <h2 className="font-display text-3xl italic font-bold text-slate-950 leading-none">Tolak Pesanan.</h2>
                <button onClick={() => setIsRejectModalOpen(false)}><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Alasan Penolakan</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Contoh: Stok Green Bean Gayo habis..."
                  className="w-full h-32 bg-stone-50 border border-black/5 rounded-sm p-4 text-xs font-bold focus:ring-[#367F4D] outline-none"
                />
              </div>
              <Button
                onClick={() => {
                  handleUpdateStatus(selectedOrder!.id, 'CANCELLED', { rejection_reason: rejectionReason });
                  setIsRejectModalOpen(false);
                }}
                disabled={!rejectionReason}
                className="w-full h-14 bg-red-500 text-white rounded-sm font-black uppercase italic text-[10px] hover:bg-red-600 border-none shadow-none"
              >
                Batalkan Pesanan <Ban size={16} className="ml-2" />
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QC SIDE SHEET */}
      <Sheet open={isQCModalOpen} onOpenChange={setIsQCModalOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-10 border-l border-black/5 shadow-2xl">
          <SheetHeader className="text-left space-y-6 pb-8 border-b border-black/5 mb-10">
            <div className="space-y-1">
              <span className="status-badge bg-[#367F4D] text-white uppercase tracking-widest px-3 py-1 rounded-sm text-[8px] font-black border-none">Detail Rasa</span>
              <SheetTitle className="font-display text-4xl italic font-bold tracking-tighter text-slate-900 leading-none pt-4">Data Produk.</SheetTitle>
              <SheetDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedOrder?.customer_name}</SheetDescription>
            </div>
          </SheetHeader>

          <div className="space-y-10">
            {[
              { id: 'sweetness', label: 'Sweetness Intensity' },
              { id: 'acidity', label: 'Acidity Brightness' },
              { id: 'body', label: 'Mouthfeel / Body' }
            ].map(sensor => (
              <div key={sensor.id} className="space-y-4">
                <div className="flex justify-between items-end text-left">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{sensor.label}</label>
                  <span className="text-xl font-black italic text-[#367F4D]">{(qcData as any)[sensor.id]}/5.0</span>
                </div>
                <input
                  type="range" min="0" max="5" step="0.1"
                  value={(qcData as any)[sensor.id]}
                  onChange={(e) => setQcData({ ...qcData, [sensor.id]: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-stone-100 appearance-none cursor-pointer rounded-full accent-[#367F4D]"
                />
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 left-10 right-10">
            <Button
              onClick={() => {
                handleUpdateStatus(selectedOrder!.id, 'ROASTING', { qcData });
                setIsQCModalOpen(false);
                toast.success("Data disimpan. Pesanan siap dikirim.");
              }}
              className="w-full h-16 bg-slate-950 text-white rounded-sm font-black uppercase tracking-[0.3em] italic text-[10px] shadow-2xl hover:bg-[#367F4D] transition-all border-none"
            >
              Simpan & Tutup <CheckCircle2 size={18} className="ml-2" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* AWB/RESI SIDE SHEET */}
      <Sheet open={isAWBModalOpen} onOpenChange={setIsAWBModalOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-10 border-l border-black/5 shadow-2xl">
          <SheetHeader className="text-left space-y-6 pb-8 border-b border-black/5 mb-10">
            <div className="space-y-1">
              <span className="status-badge bg-emerald-500 text-white uppercase tracking-widest px-3 py-1 rounded-sm text-[8px] font-black border-none">Logistik</span>
              <SheetTitle className="font-display text-4xl italic font-bold tracking-tighter text-slate-900 leading-none pt-4">Kirim Paket.</SheetTitle>
              <SheetDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Input Resi Manual untuk #{selectedOrder?.id.slice(0, 8)}</SheetDescription>
            </div>
          </SheetHeader>

          <div className="space-y-8">
            <div className="space-y-2 text-left">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Metode Pengiriman</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'mandiri', label: 'Mandiri / Ambil' },
                  { id: 'staff', label: 'Kurir Staff' },
                  { id: 'ekspedisi', label: 'Ekspedisi Luar' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setAwbData({ ...awbData, type: t.id })}
                    className={`h-12 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all ${awbData.type === t.id ? 'bg-[#367F4D] text-white' : 'bg-stone-50 text-slate-400 border border-black/5 hover:bg-stone-100'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {awbData.type === 'ekspedisi' && (
              <>
                <div className="space-y-2 text-left animate-in fade-in slide-in-from-top-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Nama Kurir</label>
                  <Input
                    value={awbData.courier}
                    onChange={(e) => setAwbData({ ...awbData, courier: e.target.value })}
                    placeholder="e.g. JNE Trucking"
                    className="h-14 bg-stone-50 border-black/5 rounded-sm px-6 text-xs font-bold text-slate-900 focus-visible:ring-[#367F4D]"
                  />
                </div>
                <div className="space-y-2 text-left animate-in fade-in slide-in-from-top-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Nomor Resi (AWB)</label>
                  <Input
                    value={awbData.resi}
                    onChange={(e) => setAwbData({ ...awbData, resi: e.target.value })}
                    placeholder="AWB123456789"
                    className="h-14 bg-stone-50 border-black/5 rounded-sm px-6 text-xs font-bold text-slate-900 font-mono focus-visible:ring-[#367F4D]"
                  />
                </div>
              </>
            )}
          </div>

          <div className="absolute bottom-10 left-10 right-10">
            <Button
              onClick={() => {
                let finalCourier = awbData.courier;
                let finalAwb = awbData.resi;

                if (awbData.type === 'mandiri') { finalCourier = 'AMBIL_MANDIRI'; finalAwb = 'INTERNAL'; }
                if (awbData.type === 'staff') { finalCourier = 'KURIR_STAFF'; finalAwb = 'INTERNAL'; }

                if (awbData.type === 'ekspedisi' && !finalCourier) {
                  toast.error("Nama kurir ekspedisi wajib diisi.");
                  return;
                }

                handleUpdateStatus(selectedOrder!.id, 'SHIPPED', { shipping_courier: finalCourier, shipping_awb: finalAwb });
                setIsAWBModalOpen(false);
                setAwbData({ type: 'ekspedisi', courier: '', resi: '' });
                toast.success("Pesanan dalam pengiriman!");
              }}
              className="w-full h-16 bg-emerald-500 text-white rounded-sm font-black uppercase tracking-[0.3em] italic text-[10px] shadow-2xl hover:bg-emerald-600 transition-all border-none"
            >
              Kirim Pesanan <Navigation size={18} className="ml-2" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
