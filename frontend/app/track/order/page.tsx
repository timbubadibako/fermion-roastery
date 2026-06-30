"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Download, Loader2, MapPin, Package } from "lucide-react";
import { OrderTrackingTimeline } from "@/components/order-tracking-timeline";

type PublicOrder = {
  id: string;
  status: string;
  customer_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_courier?: string | null;
  shipping_awb?: string | null;
  total_amount: number;
  created_at: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    weight: string;
    grind: string;
  }>;
  tracking_history: Array<{
    status: string;
    note: string;
    updated_at: string;
  }>;
};

function GuestTrackingContent() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setError("Tracking token tidak ditemukan.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/public/${encodeURIComponent(token)}`);
        const data = await response.json();

        if (response.status === 410) {
          setExpired(true);
          setError(data.message || "Tautan tracking sudah kedaluwarsa.");
          return;
        }

        if (!response.ok) {
          setError(data.message || "Gagal memuat data tracking.");
          return;
        }

        setOrder(data);
      } catch {
        setError("Gagal memuat data tracking.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const handleDownloadInvoice = () => {
    if (!token) return;
    window.open(`/api/orders/public/${encodeURIComponent(token)}/invoice`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-stone-400">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Memuat Tracking</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-white border border-black/5 shadow-sm p-10 text-center space-y-5">
          <AlertTriangle className="w-10 h-10 mx-auto text-amber-500" />
          <h1 className="text-2xl font-display italic font-bold text-slate-900">
            {expired ? "Tracking Ditutup" : "Tracking Tidak Tersedia"}
          </h1>
          <p className="text-sm text-stone-500">{error}</p>
          <Link href="/" className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-[#367F4D]">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] px-6 pt-36 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-stone-400">Guest Order Tracking</p>
          <h1 className="text-5xl font-display italic font-bold tracking-tighter text-slate-900">Status Pesanan.</h1>
          <p className="text-sm text-stone-500">Order ID: {order.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-black/5 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-black/5 pb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Status Saat Ini</p>
                <h2 className="text-2xl font-black italic text-slate-900 mt-2">{order.status}</h2>
              </div>
              <button onClick={handleDownloadInvoice} className="inline-flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm">
                <Download size={14} /> Invoice
              </button>
            </div>

            <div className="rounded-sm border border-black/5 bg-stone-50/50 p-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 text-stone-300" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Alamat Pengiriman</p>
                  <p className="mt-1 text-sm text-slate-900">{order.shipping_address}, {order.shipping_city}</p>
                </div>
              </div>
            </div>

            <OrderTrackingTimeline
              status={order.status}
              shippingCourier={order.shipping_courier}
              shippingAwb={order.shipping_awb}
              trackingHistory={order.tracking_history}
            />
          </div>

          <div className="bg-white border border-black/5 shadow-sm p-6 sm:p-8 space-y-5 h-fit lg:sticky lg:top-32">
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-stone-300" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Ringkasan Item</p>
            </div>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="border-b border-black/5 pb-4 last:border-b-0">
                  <p className="text-sm font-black italic text-slate-900">{item.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mt-1">{item.quantity}x • {item.weight} • {item.grind}</p>
                  <p className="text-sm font-mono text-slate-900 mt-2">Rp {(Number(item.price) * Number(item.quantity)).toLocaleString("id-ID")}</p>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-black/5">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Total</p>
              <p className="text-2xl font-black text-slate-900 mt-2">Rp {Number(order.total_amount).toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GuestTrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-stone-400">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Memuat Tracking</p>
        </div>
      </div>
    }>
      <GuestTrackingContent />
    </Suspense>
  );
}
