"use client";

import { apiFetch } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { 
  Truck, 
  Search, 
  ExternalLink, 
  Filter, 
  CheckCircle2, 
  Edit3, 
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

export const isValidAwb = (awb?: string | null): boolean => {
  if (!awb) return false;
  const clean = awb.trim().toUpperCase();
  return clean !== "" && clean !== "INTERNAL" && clean !== "MENUNGGU_RESI" && clean !== "MENUNGGU RESI" && clean !== "NULL" && clean !== "UNDEFINED";
};

export default function AdminShippingLab() {
  const [shippedOrders, setShippedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [courierFilter, setCourierFilter] = useState<string | null>(null);
  const [statusTab, setStatusTab] = useState<string>("ALL");

  // Modal States
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState<{ id: string; targetStatus: string; label: string } | null>(null);

  const [editAwbModalOpen, setEditAwbModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [editCourier, setEditCourier] = useState("");
  const [editAwb, setEditAwb] = useState("");
  const [isSavingAwb, setIsSavingAwb] = useState(false);

  useEffect(() => {
    fetchShipped();
  }, []);

  const fetchShipped = async () => {
    try {
      const res = await apiFetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        // Include logistics-relevant orders: READY_TO_SHIP, SHIPPED, DELIVERED
        setShippedOrders(data.filter((o: any) => ['READY_TO_SHIP', 'SHIPPED', 'DELIVERED'].includes(o.status)));
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
        toast.success(`Status pengiriman berhasil diperbarui ke ${status}.`);
        fetchShipped();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.message || "Gagal memperbarui status.");
      }
    } catch (e) {
      toast.error("Gagal memperbarui status.");
    }
  };

  const openConfirmStatusModal = (id: string, targetStatus: string, label: string) => {
    setOrderToConfirm({ id, targetStatus, label });
    setIsConfirmModalOpen(true);
  };

  const confirmStatusChange = () => {
    if (orderToConfirm) {
      handleUpdateStatus(orderToConfirm.id, orderToConfirm.targetStatus);
      setOrderToConfirm(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleOpenEditAwb = (order: any) => {
    setEditingOrder(order);
    setEditCourier(order.shipping_courier || "JNE");
    setEditAwb(order.shipping_awb && order.shipping_awb !== "MENUNGGU_RESI" ? order.shipping_awb : "");
    setEditAwbModalOpen(true);
  };

  const handleSaveAwb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    setIsSavingAwb(true);
    try {
      const res = await apiFetch(`/api/admin/orders/${editingOrder.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          shipping_courier: editCourier,
          shipping_awb: editAwb.trim() || 'INTERNAL'
        })
      });

      if (res.ok) {
        toast.success("Nomor resi & kurir berhasil disimpan.");
        setEditAwbModalOpen(false);
        fetchShipped();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.message || "Gagal memperbarui data resi.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem saat memperbarui resi.");
    } finally {
      setIsSavingAwb(false);
    }
  };

  const handleTrackAwb = (awb?: string | null, courier?: string | null) => {
    if (isValidAwb(awb)) {
      window.open(`https://biteship.com/track/${awb}`, '_blank');
    } else if (awb?.toUpperCase() === 'INTERNAL' || courier?.toUpperCase() === 'INTERNAL') {
      toast.info("Pengiriman ini menggunakan Kurir Internal / Mandiri Fermion Roastery.");
    } else {
      toast.warning("Nomor resi (AWB) belum diinput atau belum diterbitkan oleh pihak kurir.");
    }
  };

  const couriers = Array.from(new Set(shippedOrders.map(o => o.shipping_courier))).filter(Boolean);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, courierFilter, statusTab]);

  const filteredOrders = shippedOrders.filter(order => {
    const matchesSearch =
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.shipping_awb && order.shipping_awb.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCourier = !courierFilter || order.shipping_courier === courierFilter;
    const matchesTab = statusTab === "ALL" || order.status === statusTab;

    return matchesSearch && matchesCourier && matchesTab;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const countByStatus = {
    ALL: shippedOrders.length,
    READY_TO_SHIP: shippedOrders.filter(o => o.status === 'READY_TO_SHIP').length,
    SHIPPED: shippedOrders.filter(o => o.status === 'SHIPPED').length,
    DELIVERED: shippedOrders.filter(o => o.status === 'DELIVERED').length,
  };

  if (loading) return (
    <div className="h-[65vh] flex flex-col items-center justify-center gap-4 text-slate-400 font-sans">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-[#367F4D] rounded-full animate-spin" />
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Memproses Data Logistik Pengiriman...</p>
    </div>
  );

  return (
    <div className="w-full space-y-6 font-sans">
      {/* HEADER TOOLBAR */}
      <div className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#367F4D]/10 text-[#367F4D] rounded-xl">
            <Truck size={20} />
          </div>
          <div>
            <h1 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
              MANAJEMEN PENGIRIMAN & KARGO AKTIF
            </h1>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Pantau ekspedisi, perbarui nomor resi (AWB), dan konfirmasi kedatangan pesanan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari Penerima, ID, Resi..."
              className="pl-9 h-9 w-60 bg-slate-50 border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#367F4D]"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-xl h-9 px-4 gap-2 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors shadow-none">
                <Filter size={14} /> {courierFilter || "Semua Kurir"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 shadow-xl p-1 bg-white font-sans text-xs">
              <DropdownMenuItem onClick={() => setCourierFilter(null)} className="font-bold uppercase py-2 cursor-pointer">Semua Kurir</DropdownMenuItem>
              {couriers.map(c => (
                <DropdownMenuItem key={c} onClick={() => setCourierFilter(c)} className="font-bold uppercase py-2 cursor-pointer text-[#367F4D]">{c}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* STATUS TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: "ALL", label: "Semua Kargo", count: countByStatus.ALL },
          { key: "READY_TO_SHIP", label: "Siap Kirim", count: countByStatus.READY_TO_SHIP },
          { key: "SHIPPED", label: "Dalam Perjalanan", count: countByStatus.SHIPPED },
          { key: "DELIVERED", label: "Sampai Tujuan", count: countByStatus.DELIVERED },
        ].map((tab) => {
          const isActive = statusTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Daftar Pengiriman ({filteredOrders.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 font-bold">ID & Penerima</th>
                <th className="p-4 font-bold">Mitra Kurir</th>
                <th className="p-4 font-bold text-center font-mono">Nomor Resi (AWB)</th>
                <th className="p-4 font-bold text-center">Status Logistik</th>
                <th className="p-4 text-right font-bold">Aksi Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-slate-400 font-bold uppercase text-xs">
                    Tidak ada pengiriman aktif terdeteksi pada kategori ini.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-slate-900 text-xs block uppercase font-mono">#{order.id.slice(0, 8)}</span>
                      <span className="text-[11px] text-slate-600 font-semibold">{order.customer_name}</span>
                      {order.created_at && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          {order.shipping_courier || 'TERMASUK_EXPRESS'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center justify-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200/60">
                        <span className={`font-mono font-bold text-xs ${isValidAwb(order.shipping_awb) ? 'text-[#367F4D]' : 'text-slate-400'}`}>
                          {order.shipping_awb || 'MENUNGGU_RESI'}
                        </span>
                        <button
                          onClick={() => handleOpenEditAwb(order)}
                          className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
                          title="Edit Nomor Resi"
                        >
                          <Edit3 size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {order.status === 'DELIVERED' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 size={12} /> Sampai Tujuan
                        </span>
                      ) : order.status === 'SHIPPED' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                          <Truck size={12} /> Dalam Perjalanan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <Clock size={12} /> Siap Di-pick Up
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isValidAwb(order.shipping_awb) && (
                          <Button
                            variant="outline"
                            onClick={() => handleTrackAwb(order.shipping_awb, order.shipping_courier)}
                            className="h-8 px-2.5 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-[10px] font-bold uppercase tracking-wider shadow-none"
                          >
                            <ExternalLink size={12} className="mr-1 text-[#367F4D]" /> Lacak
                          </Button>
                        )}

                        {order.status === 'READY_TO_SHIP' && (
                          <Button
                            onClick={() => openConfirmStatusModal(order.id, 'SHIPPED', 'Tandai Dalam Perjalanan')}
                            className="h-8 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider border-none shadow-xs"
                          >
                            <Truck size={12} className="mr-1" /> Kirim Paket
                          </Button>
                        )}

                        {order.status === 'SHIPPED' && (
                          <Button
                            onClick={() => openConfirmStatusModal(order.id, 'DELIVERED', 'Konfirmasi Paket Diterima')}
                            className="h-8 px-3 rounded-xl bg-[#367F4D] hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider border-none shadow-xs"
                          >
                            <CheckCircle2 size={12} className="mr-1" /> Tandai Sampai
                          </Button>
                        )}

                        <Button
                          onClick={() => handleOpenEditAwb(order)}
                          variant="outline"
                          className="h-8 px-3 rounded-xl border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider transition-colors shadow-xs"
                          title="Input / Edit Resi"
                        >
                          <Edit3 size={12} className="mr-1" /> Resi
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredOrders.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans">
            <p className="text-slate-500 font-medium">
              Menampilkan <span className="font-extrabold text-slate-800">{startIndex + 1}</span> - <span className="font-extrabold text-slate-800">{Math.min(startIndex + itemsPerPage, filteredOrders.length)}</span> dari <span className="font-extrabold text-slate-800">{filteredOrders.length}</span> pengiriman
            </p>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                variant="outline"
                className="h-8 px-3 rounded-xl border-slate-200 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-700 disabled:opacity-40 shadow-none"
              >
                Sebelumnya
              </Button>
              <span className="text-[11px] font-extrabold text-slate-800 px-2">
                Halaman {safePage} / {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                variant="outline"
                className="h-8 px-3 rounded-xl border-slate-200 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-700 disabled:opacity-40 shadow-none"
              >
                Berikutnya
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmStatusChange}
        title={orderToConfirm?.label || "Konfirmasi Status Pengiriman"}
        description={`Apakah Anda yakin ingin memperbarui status pengiriman pesanan #${orderToConfirm?.id?.slice(0, 8)} menjadi ${orderToConfirm?.targetStatus}?`}
        confirmText="Ya, Lanjutkan"
        cancelText="Batal"
      />

      {/* EDIT AWB MODAL */}
      <Dialog open={editAwbModalOpen} onOpenChange={setEditAwbModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6 bg-white font-sans text-slate-900 border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Truck size={18} className="text-[#367F4D]" /> Edit Logistik Pesanan #{editingOrder?.id?.slice(0, 8)}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Masukkan nama kurir ekspedisi dan nomor resi pengiriman (AWB) untuk penerima <span className="font-semibold text-slate-800">{editingOrder?.customer_name}</span>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAwb} className="space-y-4 my-2">
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                Mitra Kurir
              </label>
              <Input
                value={editCourier}
                onChange={e => setEditCourier(e.target.value)}
                placeholder="Contoh: JNE, SICEPAT, GO-SEND, INTERNAL"
                className="h-10 text-xs font-semibold rounded-xl border-slate-200 focus:border-[#367F4D]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                Nomor Resi (AWB)
              </label>
              <Input
                value={editAwb}
                onChange={e => setEditAwb(e.target.value)}
                placeholder="Contoh: JNE1092837461 (Ketik INTERNAL untuk kurir toko)"
                className="h-10 text-xs font-mono font-bold rounded-xl border-slate-200 focus:border-[#367F4D]"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Kosongkan atau ketik <code className="font-mono text-slate-700 font-bold">INTERNAL</code> jika dikirim langsung oleh kurir toko/mandiri.
              </p>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditAwbModalOpen(false)}
                className="rounded-xl h-10 text-xs font-bold uppercase tracking-wider"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSavingAwb}
                className="bg-[#367F4D] hover:bg-emerald-700 text-white rounded-xl h-10 text-xs font-bold uppercase tracking-wider"
              >
                {isSavingAwb ? "Menyimpan..." : "Simpan Resi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
