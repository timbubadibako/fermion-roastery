"use client";

import { apiFetch } from "@/lib/api";
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
  CreditCard,
  Printer,
  Ban,
  Navigation,
  Download,
  Phone,
  ExternalLink,
  MessageSquare,
  Coffee,
  User,
  MapPin
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

interface OrderItem {
  id?: string;
  name?: string;
  product_name?: string;
  weight?: string;
  variant_weight?: string;
  variant_grind?: string;
  grind?: string;
  quantity: number;
  price?: number;
  unit_price?: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone?: string;
  status: string;
  total_amount: string | number;
  items: OrderItem[];
  order_items?: OrderItem[];
  shipping_awb?: string;
  shipping_courier?: string;
  shipping_label_url?: string;
  biteship_order_id?: string;
  created_at?: string;
}

const parseAmount = (val: any): number => {
  if (val == null) return 0;
  const num = typeof val === 'number' ? val : Number(String(val).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(num) ? Math.round(num) : 0;
};

const formatRp = (val: any): string => {
  return `Rp ${parseAmount(val).toLocaleString('id-ID')}`;
};

const getOrderItems = (order: Order): OrderItem[] => {
  const raw = (order as any).order_items || order.items;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const STAGE_TABS = [
  { id: 'ALL', label: 'Semua Pesanan' },
  { id: 'UNPAID', label: 'Menunggu Bayar', icon: Clock },
  { id: 'NET30', label: 'Tempo NET30', icon: Clock },
  { id: 'PENDING_CASH', label: 'Tunai Pending', icon: CreditCard },
  { id: 'PAID', label: 'Pesanan Baru', icon: Package },
  { id: 'ROASTING', label: 'Proses Roasting', icon: Beaker },
  { id: 'READY_TO_SHIP', label: 'Siap Kirim', icon: CheckCircle2 },
  { id: 'SHIPPED', label: 'Sudah Dikirim', icon: Truck },
];

const getStageTheme = (status: string) => {
  switch (status) {
    case 'UNPAID':
    case 'NET30':
    case 'PENDING_CASH':
      return {
        leftBar: 'border-l-4 border-l-amber-500',
        badgeBg: 'bg-amber-50 text-amber-900 border border-amber-300 font-extrabold',
        badgeText: status === 'NET30' ? 'Tempo NET30' : status === 'PENDING_CASH' ? 'Tunai Pending' : 'Menunggu Bayar',
        accentColor: 'text-amber-700',
        stageIconBg: 'bg-amber-100 text-amber-800'
      };
    case 'PAID':
      return {
        leftBar: 'border-l-4 border-l-emerald-500',
        badgeBg: 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-extrabold',
        badgeText: 'Pesanan Baru',
        accentColor: 'text-emerald-700',
        stageIconBg: 'bg-emerald-100 text-emerald-800'
      };
    case 'ROASTING':
      return {
        leftBar: 'border-l-4 border-l-purple-500',
        badgeBg: 'bg-purple-50 text-purple-900 border border-purple-300 font-extrabold',
        badgeText: 'Proses Roasting',
        accentColor: 'text-purple-700',
        stageIconBg: 'bg-purple-100 text-purple-800'
      };
    case 'READY_TO_SHIP':
      return {
        leftBar: 'border-l-4 border-l-blue-500',
        badgeBg: 'bg-blue-50 text-blue-900 border border-blue-300 font-extrabold',
        badgeText: 'Siap Kirim',
        accentColor: 'text-blue-700',
        stageIconBg: 'bg-blue-100 text-blue-800'
      };
    case 'SHIPPED':
      return {
        leftBar: 'border-l-4 border-l-slate-900',
        badgeBg: 'bg-slate-900 text-white border border-slate-900 font-black',
        badgeText: 'Sudah Dikirim',
        accentColor: 'text-slate-900',
        stageIconBg: 'bg-slate-800 text-white'
      };
    case 'CANCELLED':
    case 'REJECTED':
      return {
        leftBar: 'border-l-4 border-l-red-500',
        badgeBg: 'bg-red-50 text-red-800 border border-red-200 font-extrabold',
        badgeText: 'Dibatalkan',
        accentColor: 'text-red-700',
        stageIconBg: 'bg-red-100 text-red-800'
      };
    default:
      return {
        leftBar: 'border-l-4 border-l-slate-300',
        badgeBg: 'bg-slate-100 text-slate-700 border border-slate-200 font-extrabold',
        badgeText: status,
        accentColor: 'text-slate-700',
        stageIconBg: 'bg-slate-100 text-slate-700'
      };
  }
};

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStage, setActiveStage] = useState<string>("ALL");
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
        toast.success(`Status pesanan diperbarui ke ${newStatus.toUpperCase()}`);
        fetchOrders();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.message || "Gagal memperbarui status.");
      }
    } catch (err) {
      toast.error("Gagal memperbarui status pesanan.");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchPrint = async (targetIds?: string[]) => {
    const idsToPrint = targetIds || selectedIds;
    if (idsToPrint.length === 0) {
      toast.error("Pilih minimal 1 pesanan untuk dicetak.");
      return;
    }

    toast.loading("Menyiapkan PDF Label Cetak Massal...");
    try {
      const res = await apiFetch("/api/admin/shipping/batch-labels", {
        method: "POST",
        body: JSON.stringify({ orderIds: idsToPrint })
      });

      if (res.ok) {
        const data = await res.json();
        const win = window.open(data.pdfUrl || data.url, '_blank');
        if (win) {
          win.focus();
          toast.dismiss();
          toast.success("PDF Label siap dicetak.");
        } else {
          toast.error("Gagal membuka tab baru. Harap izinkan pop-up.");
        }
      } else {
        toast.error("Gagal menyiapkan PDF label.");
      }
    } catch (e) {
      toast.error("Kesalahan jaringan.");
    } finally {
      toast.dismiss();
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await apiFetch("/api/admin/exports/orders");
      if (!res.ok) throw new Error("Gagal menyiapkan ekspor CSV");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `fermion_orders_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Laporan pesanan berhasil diunduh.");
    } catch (error) {
      toast.error("Gagal mengekspor data pesanan.");
    }
  };

  const getNet30ReminderUrl = (order: Order) => {
    const dueDate = new Date(order.created_at || Date.now());
    dueDate.setDate(dueDate.getDate() + 30);
    const dueDateText = dueDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    let phone = order.customer_phone?.replace(/\D/g, '') || '';
    if (phone.startsWith('0')) phone = '62' + phone.slice(1);
    const message = encodeURIComponent(
      `Halo, kami mengingatkan invoice #ORD-${order.id.slice(0, 8).toUpperCase()} dari Fermion Roastery dengan total ${formatRp(order.total_amount)} jatuh tempo pada ${dueDateText}. Mohon konfirmasi jika pembayaran sudah diproses.`
    );

    return phone ? `https://wa.me/${phone}?text=${message}` : null;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeStage, searchQuery]);

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      (o.customer_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (o.id?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (o.shipping_awb?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    const matchesStage = activeStage === 'ALL' || o.status === activeStage;
    return matchesSearch && matchesStage;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  if (loading && orders.length === 0) return (
    <div className="h-[65vh] flex flex-col items-center justify-center gap-4 text-slate-400 font-sans">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-[#367F4D] rounded-full animate-spin" />
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mengakses Data Logistik Pesanan...</p>
    </div>
  );

  return (
    <div className="space-y-6 font-sans text-left">
      {/* Action Toolbar Header */}
      <div className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Package size={18} className="text-[#367F4D]" />
            <span>MANAJEMEN PESANAN & LOGISTIK</span>
            <span className="text-[10px] font-bold text-[#367F4D] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono">
              {orders.length} TOTAL PESANAN
            </span>
          </h1>
        </div>

        {/* Buttons & Search */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {selectedIds.length > 0 && (
            <Button
              onClick={() => handleBatchPrint(selectedIds)}
              className="h-9 bg-[#367F4D] hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl px-3.5 gap-2 border-none shadow-xs"
            >
              <Printer size={14} /> Cetak {selectedIds.length} Label
            </Button>
          )}

          <Button
            onClick={() => {
              setIsBatchMode(!isBatchMode);
              if (isBatchMode) setSelectedIds([]);
              else setSelectedIds(orders.filter(o => o.status === 'READY_TO_SHIP').map(o => o.id));
            }}
            variant="outline"
            className={`h-9 text-xs font-bold uppercase tracking-wider rounded-xl px-3.5 shadow-xs ${
              isBatchMode ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            {isBatchMode ? 'Matikan Pilih Massal' : 'Pilih Cetak Massal'}
          </Button>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="h-9 border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl px-3.5 gap-2 shadow-xs"
          >
            <Download size={14} className="text-[#367F4D]" /> Unduh CSV
          </Button>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari ID Pesanan / Pelanggan..."
              className="pl-9 h-9 w-60 bg-slate-50 border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#367F4D]"
            />
          </div>
        </div>
      </div>

      {/* STAGE FILTER PILLS BAR */}
      <div className="bg-white border border-slate-200/80 p-3.5 sm:p-4 rounded-2xl flex items-center gap-2 overflow-x-auto shadow-xs scrollbar-none">
        {STAGE_TABS.map(tab => {
          const count = tab.id === 'ALL'
            ? orders.length
            : orders.filter(o => o.status === tab.id).length;

          const isActive = activeStage === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveStage(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                isActive ? 'bg-slate-800 text-emerald-400' : 'bg-slate-200 text-slate-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* HIGH CONTRAST CLEAN CARDS GRID */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center text-slate-400 font-bold uppercase text-xs shadow-xs space-y-2">
          <Package size={36} className="mx-auto text-slate-300 mb-2" />
          <p>Tidak ada pesanan ditemukan pada tahap ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {paginatedOrders.map(order => {
              const isSelected = selectedIds.includes(order.id);
              const theme = getStageTheme(order.status);
              const orderItems = getOrderItems(order);
              const orderDate = order.created_at
                ? new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                : '';

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between ${theme.leftBar} ${
                    isSelected ? 'ring-2 ring-[#367F4D]' : ''
                  }`}
                >
                  {/* Card Header Row */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        {isBatchMode && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(order.id)}
                            className="w-4 h-4 rounded cursor-pointer accent-[#367F4D]"
                          />
                        )}
                        <div>
                          <span className="text-xs font-mono font-extrabold text-slate-900 block tracking-wider">
                            #ORD-{(order.id || '').slice(0, 8).toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{orderDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] ${theme.badgeBg}`}>
                          {theme.badgeText}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
                              <MoreVertical size={15} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white border border-slate-200 rounded-xl p-1 shadow-xl text-xs font-semibold">
                            {order.biteship_order_id && (
                              <DropdownMenuItem
                                className="py-2 px-3 cursor-pointer rounded-lg hover:bg-slate-100"
                                onClick={() => window.open(`https://dashboard.biteship.com/orders/details/${order.biteship_order_id}`, '_blank')}
                              >
                                Lihat Detail Biteship
                              </DropdownMenuItem>
                            )}
                            {order.customer_phone && (
                              <DropdownMenuItem
                                className="py-2 px-3 cursor-pointer rounded-lg text-[#367F4D] hover:bg-emerald-50"
                                onClick={() => {
                                  let phone = order.customer_phone?.replace(/\D/g, '') || '';
                                  if (phone.startsWith('0')) phone = '62' + phone.slice(1);
                                  window.open(`https://wa.me/${phone}`, '_blank');
                                }}
                              >
                                Hubungi via WhatsApp
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator className="bg-slate-100" />
                            <DropdownMenuItem
                              className="py-2 px-3 cursor-pointer rounded-lg text-red-600 hover:bg-red-50"
                              onClick={() => { setSelectedOrder(order); setIsRejectModalOpen(true); }}
                            >
                              Batalkan Pesanan
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Customer Info & Courier Tag */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 block capitalize leading-tight">
                          {order.customer_name || "Pelanggan Anonim"}
                        </h4>
                        {order.customer_phone && (
                          <span className="text-[10px] text-slate-500 font-mono block mt-1">
                            {order.customer_phone}
                          </span>
                        )}
                      </div>
                      {order.shipping_courier && (
                        <span className="text-[9px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md shrink-0 uppercase">
                          {order.shipping_courier}
                        </span>
                      )}
                    </div>

                    {/* Order Items Breakdown List */}
                    {orderItems.length > 0 ? (
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5 text-xs">
                        <div className="flex justify-between items-center text-[9px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-200/70 pb-1.5">
                          <span>Rincian Produk ({orderItems.length})</span>
                          <span>Subtotal</span>
                        </div>
                        <div className="space-y-2 max-h-44 overflow-y-auto pr-0.5 scrollbar-thin">
                          {orderItems.map((item: any, idx: number) => {
                            const itemName = item.product_name || item.name || 'Produk Kopi';
                            const itemPrice = parseAmount(item.unit_price ?? item.price);
                            const itemWeight = item.variant_weight || item.weight || '';
                            const itemGrind = item.variant_grind || item.grind || '';
                            const itemQty = parseAmount(item.quantity) || 1;
                            const itemSubtotal = itemPrice * itemQty;

                            return (
                              <div key={idx} className="flex justify-between items-start text-slate-900 text-xs leading-snug">
                                <div className="pr-2">
                                  <span className="font-extrabold text-slate-900">{itemQty}x {itemName}</span>
                                  {(itemWeight || itemGrind) && (
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      {itemWeight && (
                                        <span className="text-[9px] font-bold text-[#367F4D] bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
                                          {itemWeight}
                                        </span>
                                      )}
                                      {itemGrind && (
                                        <span className="text-[9px] font-medium text-slate-500">
                                          {itemGrind}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <span className="font-mono font-extrabold shrink-0 text-slate-900 text-xs">
                                  {itemSubtotal > 0 ? formatRp(itemSubtotal) : '-'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-xl p-3 text-center text-[10px] font-bold text-slate-400 border border-slate-200/60">
                        Rincian item tidak tersedia
                      </div>
                    )}
                  </div>

                  {/* Total & Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Total Transaksi</span>
                      <span className="text-base font-black text-slate-900 font-mono">
                        {formatRp(order.total_amount)}
                      </span>
                    </div>

                    {/* Stage Action Buttons */}
                    <div className="space-y-2 pt-0.5">
                      {order.status === 'UNPAID' && (
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => handleUpdateStatus(order.id, 'PAID')}
                            className="bg-[#367F4D] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider h-9.5 border-none shadow-xs"
                          >
                            Konfirmasi Bayar
                          </Button>
                          <Button
                            variant="outline"
                          >
                            Ingatkan WA
                          </Button>
                        </div>
                      )}

                      {order.status === 'PENDING_CASH' && (
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => handleUpdateStatus(order.id, 'PAID')}
                            className="bg-[#367F4D] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider h-9.5 border-none shadow-xs"
                          >
                            Konfirmasi Tunai
                          </Button>
                          <Button
                            onClick={() => handleUpdateStatus(order.id, 'READY_TO_SHIP')}
                            variant="outline"
                            className="border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider h-9.5"
                          >
                            Terbitkan Resi
                          </Button>
                        </div>
                      )}

                      {order.status === 'PAID' && (
                        <Button
                          onClick={() => handleUpdateStatus(order.id, 'ROASTING')}
                          className="w-full bg-[#367F4D] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider h-9.5 border-none shadow-xs"
                        >
                          Mulai Proses Roasting
                        </Button>
                      )}

                      {order.status === 'ROASTING' && (
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => { setSelectedOrder(order); setIsQCModalOpen(true); }}
                            variant="outline"
                            className="border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl text-xs font-bold uppercase tracking-wider h-9.5 shadow-xs"
                          >
                            <Beaker size={13} className="mr-1.5 text-purple-700" /> Input QC Rasa
                          </Button>
                          <Button
                            onClick={() => handleUpdateStatus(order.id, 'READY_TO_SHIP')}
                            className="bg-[#367F4D] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider h-9.5 border-none shadow-xs"
                          >
                            Siap Kirim
                          </Button>
                        </div>
                      )}

                      {order.status === 'READY_TO_SHIP' && (
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => { setSelectedOrder(order); setIsAWBModalOpen(true); }}
                            className="bg-[#367F4D] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider h-9.5 border-none shadow-xs"
                          >
                            Kirim / Input Resi
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleBatchPrint([order.id])}
                            className="border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl text-xs font-bold uppercase tracking-wider h-9.5 shadow-xs"
                          >
                            <Printer size={13} className="mr-1.5 text-blue-700" /> Cetak Label
                          </Button>
                        </div>
                      )}

                      {order.status === 'SHIPPED' && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (order.shipping_awb) window.open(`https://biteship.com/track/${order.shipping_awb}`, '_blank');
                            else toast.info("Nomor resi internal/lokal.");
                          }}
                          className="w-full border-slate-300 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider h-9.5 shadow-xs"
                        >
                          <Navigation size={13} className="mr-1.5 text-[#367F4D]" /> Lacak Pengiriman ({order.shipping_courier || 'Kurir'})
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* PAGINASI KARTU PESANAN */}
      {filteredOrders.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans shadow-xs">
          <p className="text-slate-500 font-medium">
            Menampilkan <span className="font-extrabold text-slate-800">{startIndex + 1}</span> - <span className="font-extrabold text-slate-800">{Math.min(startIndex + itemsPerPage, filteredOrders.length)}</span> dari <span className="font-extrabold text-slate-800">{filteredOrders.length}</span> pesanan
          </p>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              variant="outline"
              className="h-8.5 px-3 rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-700 disabled:opacity-40 shadow-none"
            >
              Sebelumnya
            </Button>
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all ${
                    pageNum === safePage
                      ? 'bg-[#367F4D] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <Button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              variant="outline"
              className="h-8.5 px-3 rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-700 disabled:opacity-40 shadow-none"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      <AnimatePresence>
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl text-left border border-slate-200"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">Batalkan / Tolak Pesanan</h2>
                <button onClick={() => setIsRejectModalOpen(false)}><X size={18} className="text-slate-400 hover:text-slate-700" /></button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Alasan Pembatalan</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Contoh: Stok Green Bean Gayo habis..."
                  className="w-full h-28 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:bg-white focus:border-[#367F4D] outline-none"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" onClick={() => setIsRejectModalOpen(false)} className="h-10 rounded-xl text-xs font-bold uppercase px-4">
                  Batal
                </Button>
                <Button
                  onClick={() => {
                    handleUpdateStatus(selectedOrder!.id, 'CANCELLED', { rejection_reason: rejectionReason });
                    setIsRejectModalOpen(false);
                  }}
                  disabled={!rejectionReason}
                  className="h-10 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase px-5 border-none"
                >
                  Konfirmasi Pembatalan
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QC SIDE SHEET */}
      <Sheet open={isQCModalOpen} onOpenChange={setIsQCModalOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-6 border-l border-slate-200 shadow-2xl space-y-6">
          <SheetHeader className="text-left space-y-1 pb-4 border-b border-slate-100">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#367F4D] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono w-fit">
              CUPPING & QUALITY CONTROL
            </span>
            <SheetTitle className="text-lg font-extrabold uppercase tracking-wider text-slate-900 pt-2">Input Profil Rasa Batch</SheetTitle>
            <SheetDescription className="text-xs font-medium text-slate-500">
              #{selectedOrder?.id.slice(0, 8).toUpperCase()} — {selectedOrder?.customer_name}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            {[
              { id: 'sweetness', label: 'Sweetness Intensity' },
              { id: 'acidity', label: 'Acidity Brightness' },
              { id: 'body', label: 'Mouthfeel / Body' }
            ].map(sensor => (
              <div key={sensor.id} className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <div className="flex justify-between items-center text-left">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">{sensor.label}</label>
                  <span className="text-xs font-black text-[#367F4D] font-mono bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {(qcData as any)[sensor.id]} / 5.0
                  </span>
                </div>
                <input
                  type="range" min="0" max="5" step="0.1"
                  value={(qcData as any)[sensor.id]}
                  onChange={(e) => setQcData({ ...qcData, [sensor.id]: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 appearance-none cursor-pointer rounded-full accent-[#367F4D]"
                />
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100">
            <Button
              onClick={() => {
                handleUpdateStatus(selectedOrder!.id, 'ROASTING', { qcData });
                setIsQCModalOpen(false);
                toast.success("Data QC disimpan.");
              }}
              className="w-full h-11 bg-[#367F4D] hover:bg-emerald-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs border-none shadow-xs"
            >
              Simpan Profil QC <CheckCircle2 size={16} className="ml-2" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* AWB/RESI SIDE SHEET */}
      <Sheet open={isAWBModalOpen} onOpenChange={setIsAWBModalOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-6 border-l border-slate-200 shadow-2xl space-y-6">
          <SheetHeader className="text-left space-y-1 pb-4 border-b border-slate-100">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#367F4D] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono w-fit">
              LOGISTIK & PENGIRIMAN
            </span>
            <SheetTitle className="text-lg font-extrabold uppercase tracking-wider text-slate-900 pt-2">Input Resi & Kurir</SheetTitle>
            <SheetDescription className="text-xs font-medium text-slate-500">
              #{selectedOrder?.id.slice(0, 8).toUpperCase()} — {selectedOrder?.customer_name}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5">
            <div className="space-y-2 text-left">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Metode Pengiriman</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'mandiri', label: 'Ambil Mandiri' },
                  { id: 'staff', label: 'Kurir Internal' },
                  { id: 'ekspedisi', label: 'Ekspedisi Luar' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setAwbData({ ...awbData, type: t.id })}
                    className={`h-10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      awbData.type === t.id ? 'bg-[#367F4D] text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {awbData.type === 'ekspedisi' && (
              <>
                <div className="space-y-2 text-left">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Nama Kurir / Ekspedisi</label>
                  <Input
                    value={awbData.courier}
                    onChange={(e) => setAwbData({ ...awbData, courier: e.target.value })}
                    placeholder="Contoh: JNE / J&T / Biteship"
                    className="h-10 bg-slate-50 border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#367F4D]"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Nomor Resi (AWB)</label>
                  <Input
                    value={awbData.resi}
                    onChange={(e) => setAwbData({ ...awbData, resi: e.target.value })}
                    placeholder="AWB123456789"
                    className="h-10 bg-slate-50 border-slate-200 rounded-xl text-xs font-mono font-semibold focus:bg-white focus:border-[#367F4D]"
                  />
                </div>
              </>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100">
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
              }}
              className="w-full h-11 bg-[#367F4D] hover:bg-emerald-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs border-none shadow-xs"
            >
              Konfirmasi Kirim Paket <Navigation size={16} className="ml-2" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
