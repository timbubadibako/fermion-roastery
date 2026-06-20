"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store";
import { motion } from "framer-motion";
import Link from "next/link";
import { Printer, Download, ArrowLeft, Building2 } from "lucide-react";

export default function InvoiceTemplate({ params }: { params: { id: string } }) {
  const { removeItems } = useCartStore();
  const [date, setDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    // Clear the cart items that were purchased
    const purchasedIds = localStorage.getItem('purchasedLineItemIds');
    if (purchasedIds) {
      try {
        removeItems(JSON.parse(purchasedIds));
        localStorage.removeItem('purchasedLineItemIds');
      } catch (e) {}
    }

    const today = new Date();
    setDate(today.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }));
    
    // Net 30 Due Date
    const due = new Date();
    due.setDate(today.getDate() + 30);
    setDueDate(due.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 py-20 px-6 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Controls */}
        <div className="flex justify-between items-center print:hidden">
           <Link href="/b2b">
             <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
               <ArrowLeft size={16} /> Kembali ke Dashboard
             </button>
           </Link>
           <div className="flex gap-4">
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
          className="bg-white p-12 md:p-20 shadow-2xl rounded-sm border border-slate-100 relative print:shadow-none print:border-none print:p-0"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-100 pb-12">
             <div className="space-y-2">
                <h1 className="text-3xl font-black italic tracking-tighter text-slate-900">FERMION.</h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide">
                  Jl. Siliwangi No. 42<br/>
                  Bandung, Jawa Barat 40131<br/>
                  hello@fermionroastery.com
                </p>
             </div>
             <div className="mt-8 md:mt-0 text-left md:text-right space-y-1">
                <h2 className="text-6xl font-display italic font-black tracking-tighter text-slate-200 uppercase leading-none">Invoice.</h2>
                <p className="text-sm font-black text-slate-900 font-mono tracking-widest">{params.id}</p>
             </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-b border-slate-100">
             <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ditagihkan Kepada</h3>
                <div className="space-y-1">
                   <p className="text-lg font-bold text-slate-900">B2B Partner (Tier Silver)</p>
                   <p className="text-sm text-slate-500 font-medium">Jl. Sudirman No. 1, Jakarta Selatan</p>
                   <p className="text-sm text-slate-500 font-medium">DKI Jakarta, 12190</p>
                </div>
             </div>
             
             <div className="space-y-4 md:text-right">
                <div className="space-y-1">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Tanggal Invoice</h3>
                   <p className="text-sm font-black text-slate-900">{date}</p>
                </div>
                <div className="space-y-1 pt-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Jatuh Tempo (Net-30)</h3>
                   <p className="text-sm font-black text-slate-900">{dueDate}</p>
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
                   <tr className="border-b border-slate-50">
                      <td className="py-6 space-y-1">
                         <p className="font-bold text-slate-900">Sumedang Anaerob (Wholesale)</p>
                         <p className="text-[10px] text-slate-400 uppercase tracking-widest">Beans / 1000g</p>
                      </td>
                      <td className="py-6 text-right font-mono">10</td>
                      <td className="py-6 text-right font-mono">Rp 120.000</td>
                      <td className="py-6 text-right font-mono font-bold text-slate-900">Rp 1.200.000</td>
                   </tr>
                   <tr className="border-b border-slate-50">
                      <td className="py-6 space-y-1">
                         <p className="font-bold text-slate-900">Gayo Natural (Wholesale)</p>
                         <p className="text-[10px] text-slate-400 uppercase tracking-widest">Beans / 1000g</p>
                      </td>
                      <td className="py-6 text-right font-mono">5</td>
                      <td className="py-6 text-right font-mono">Rp 150.000</td>
                      <td className="py-6 text-right font-mono font-bold text-slate-900">Rp 750.000</td>
                   </tr>
                </tbody>
             </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-6">
             <div className="w-full md:w-1/2 space-y-4">
                <div className="flex justify-between text-sm font-medium text-slate-500">
                   <span>Subtotal</span>
                   <span className="font-mono">Rp 1.950.000</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500">
                   <span>Pengiriman (Kargo)</span>
                   <span className="font-mono">Rp 150.000</span>
                </div>
                <div className="flex justify-between text-xl font-black text-slate-900 pt-4 border-t border-slate-200">
                   <span>Total Tagihan</span>
                   <span className="font-mono">Rp 2.100.000</span>
                </div>
             </div>
          </div>

          {/* Footer Notes */}
          <div className="mt-20 pt-12 border-t border-slate-100 text-center md:text-left space-y-2">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Instruksi Pembayaran</h3>
             <p className="text-xs text-slate-500 leading-relaxed font-medium">
               Harap lakukan pembayaran sebelum tanggal jatuh tempo ke rekening BCA 1234567890 a/n Fermion Roastery. 
               Cantumkan nomor invoice <strong>{params.id}</strong> pada berita transfer.
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
