"use client";

import { useEffect, useState, use } from "react";
import { useCartStore } from "@/lib/store";
import { motion } from "framer-motion";
import Link from "next/link";
import { Printer, Download, ArrowLeft, CreditCard } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function InvoiceTemplate({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ paymentUrl?: string }> }) {
  const unwrappedParams = use(params);
  const unwrappedSearchParams = use(searchParams);
  const { removeItems } = useCartStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear the cart items that were purchased
    const purchasedIds = localStorage.getItem('purchasedLineItemIds');
    if (purchasedIds) {
      try {
        removeItems(JSON.parse(purchasedIds));
        localStorage.removeItem('purchasedLineItemIds');
      } catch (e) {}
    }

    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await apiFetch(`/api/orders/${unwrappedParams.id}`);
      if (res.ok) {
        setOrder(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center">Loading Invoice...</div>;
  if (!order) return <div className="min-h-screen bg-stone-50 flex items-center justify-center">Invoice not found.</div>;

  const dateStr = new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  const due = new Date(order.created_at);
  due.setDate(due.getDate() + 30);
  const dueDateStr = due.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="font-sans text-slate-900 w-full">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Controls */}
        <div className="flex justify-between items-center print:hidden">
           <Link href="/b2b">
             <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
               <ArrowLeft size={16} /> Kembali ke Dashboard
             </button>
           </Link>
           <div className="flex gap-4">
              {unwrappedSearchParams?.paymentUrl && order.status === 'UNPAID' && (
                <a href={unwrappedSearchParams.paymentUrl} className="flex items-center gap-2 px-6 py-3 bg-[#367F4D] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm">
                  <CreditCard size={16} /> Bayar via Xendit
                </a>
              )}
              <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:border-slate-400 transition-all shadow-sm">
                <Printer size={16} /> Cetak
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-periwinkle transition-all shadow-sm">
                <Download size={16} /> Unduh PDF
              </button>
           </div>
        </div>

        {/* INVOICE PAPER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 md:p-20 shadow-2xl rounded-sm border border-slate-100 relative print:shadow-none print:border-none print:p-12"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-100 pb-12">
             <div className="space-y-2">
                <div className="flex items-center gap-3 mb-4">
                   <img src="/fermion-logo.png" alt="Fermion Logo" className="h-14 w-auto opacity-90 object-contain" />
                </div>
                <p className="text-xs text-slate-500 font-medium tracking-wide">
                  Jl. Kesambi No. 202<br/>
                  Cirebon, Jawa Barat 45133<br/>
                  hello@fermionroastery.com
                </p>
             </div>
             <div className="mt-8 md:mt-0 text-left md:text-right space-y-1">
                <h2 className="text-6xl font-display italic font-black tracking-tighter text-slate-200 uppercase leading-none">Invoice.</h2>
                <p className="text-sm font-black text-slate-900 font-mono tracking-widest">{order.id.slice(0, 8).toUpperCase()}</p>
                <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 ${['PAID', 'READY_TO_SHIP', 'ROASTING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {order.status}
                </div>
             </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-b border-slate-100">
             <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ditagihkan Kepada</h3>
                <div className="space-y-1">
                   <p className="text-lg font-bold text-slate-900">{order.customer_name}</p>
                   <p className="text-sm text-slate-500 font-medium">{order.shipping_address}</p>
                   <p className="text-sm text-slate-500 font-medium">{order.shipping_city}</p>
                   <p className="text-sm text-slate-500 font-medium">{order.customer_email}</p>
                   <p className="text-sm text-slate-500 font-medium">{order.customer_phone}</p>
                </div>
             </div>
             
             <div className="space-y-4 md:text-right">
                <div className="space-y-1">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Tanggal Invoice</h3>
                   <p className="text-sm font-black text-slate-900">{dateStr}</p>
                </div>
                <div className="space-y-1 pt-4">
                   {order.payment_method === 'TEMPO' ? (
                     <>
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Jatuh Tempo (Net-30)</h3>
                       <p className="text-sm font-black text-slate-900">{dueDateStr}</p>
                     </>
                   ) : order.payment_method === 'OFFLINE_CASH' ? (
                     <>
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Metode Pembayaran</h3>
                       <p className="text-sm font-black text-slate-900">Tunai (Offline)</p>
                     </>
                   ) : (
                     <>
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Metode Pembayaran</h3>
                       <p className="text-sm font-black text-slate-900">Transfer/E-Wallet</p>
                     </>
                   )}
                </div>
             </div>
          </div>

          {/* Table */}
          <div className="py-12">
             <table className="w-full text-left">
                <thead>
                   <tr className="border-b border-slate-200">
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-1/2">Deskripsi Barang</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Kuantitas</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Harga Satuan</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Total</th>
                   </tr>
                </thead>
                <tbody className="text-sm font-medium">
                   {order.items?.map((item: any) => (
                     <tr key={item.id} className="border-b border-slate-50">
                        <td className="py-6 space-y-1">
                           <p className="font-bold text-slate-900">{item.name}</p>
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest">{item.grind} / {item.weight}</p>
                        </td>
                        <td className="py-6 text-right font-mono">{item.quantity}</td>
                        <td className="py-6 text-right font-mono">Rp {item.price?.toLocaleString('id-ID')}</td>
                        <td className="py-6 text-right font-mono font-bold text-slate-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-6">
             <div className="w-full md:w-1/2 space-y-4">
                <div className="flex justify-between text-sm font-medium text-slate-500">
                   <span>Subtotal</span>
                   <span className="font-mono">Rp {(order.total_amount - order.shipping_fee).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500">
                   <span>Pengiriman</span>
                   <span className="font-mono">Rp {order.shipping_fee?.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-slate-900 pt-4 border-t border-slate-200">
                   <span>Total Tagihan</span>
                   <span className="font-mono">Rp {order.total_amount?.toLocaleString('id-ID')}</span>
                </div>
             </div>
          </div>

          {/* Footer Notes */}
          <div className="mt-20 pt-12 border-t border-slate-100 text-center md:text-left space-y-2">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Instruksi Pembayaran</h3>
             <p className="text-xs text-slate-500 leading-relaxed font-medium">
               {order.payment_method === 'TEMPO' ? (
                 <>Harap lakukan pembayaran sebelum tanggal jatuh tempo. Jika memilih transfer manual, silakan transfer ke rekening BCA 1234567890 a/n Fermion Roastery dan sertakan nomor invoice <strong>{order.id.slice(0,8).toUpperCase()}</strong>.</>
               ) : order.payment_method === 'OFFLINE_CASH' ? (
                 <>Pembayaran tunai (Cash) akan dilakukan secara langsung saat pengambilan atau pengiriman barang oleh kurir Fermion.</>
               ) : (
                 <>Silakan selesaikan pembayaran melalui link Xendit yang telah disediakan agar pesanan Anda segera diproses.</>
               )}
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
