"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Building2, 
  Coffee, 
  Scale, 
  Calendar,
  Save,
  X,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ManualLedger() {
  const [partners, setPartners] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    partnerId: "",
    productId: "",
    weightKg: "",
    totalPaid: "",
    transactionDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/partners").then(res => res.json()),
      fetch("/api/products").then(res => res.json())
    ]).then(([pData, prodData]) => {
      setPartners(pData.filter((p: any) => p.status === 'approved'));
      setProducts(prodData);
      setLoading(false);
    }).catch(() => {
      toast.error("Gagal memuat data referensi.");
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.partnerId || !formData.productId || !formData.weightKg || !formData.totalPaid) {
      toast.error("Mohon lengkapi semua field wajib.");
      return;
    }

    try {
      const res = await fetch("/api/admin/manual-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Transaksi manual berhasil dicatat ke buku besar.");
        setIsModalOpen(false);
        setFormData({
          partnerId: "",
          productId: "",
          weightKg: "",
          totalPaid: "",
          transactionDate: new Date().toISOString().split('T')[0]
        });
      } else {
        toast.error("Gagal menyimpan transaksi.");
      }
    } catch (e) {
      toast.error("Kesalahan jaringan.");
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
      <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Sinkronisasi Buku Besar...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/5 pb-10">
        <div className="space-y-3 text-left">
          <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">Catatan <br/> Penjualan.</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Pencatatan transaksi manual untuk sinkronisasi volume mitra.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-slate-950 text-white rounded-sm h-14 px-10 gap-3 font-black uppercase tracking-widest italic shadow-xl hover:bg-[#367F4D] transition-all border-none">
           <Plus size={20} /> Tambah Transaksi Manual
        </Button>
      </div>

      <div className="bg-white border border-black/5 rounded-sm overflow-hidden shadow-sm">
         <div className="p-8 border-b border-black/5 flex items-center justify-between bg-stone-50/50">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Riwayat Transaksi</h3>
            <div className="flex gap-4">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={14} />
                  <Input placeholder="Cari catatan..." className="pl-12 h-10 w-64 bg-white border-black/10 rounded-sm text-xs font-bold focus:ring-[#367F4D]" />
               </div>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-black/5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                     <th className="p-8 font-black">Tanggal Transaksi</th>
                     <th className="p-8 font-black">Mitra Cafe</th>
                     <th className="p-8 font-black">Produk SKU</th>
                     <th className="p-8 font-black">Volume Bersih</th>
                     <th className="p-8 text-right font-black">Total Bayar</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-black/5">
                  <tr>
                     <td colSpan={5} className="p-24 text-center text-stone-300 font-bold uppercase tracking-widest text-xs italic">Belum ada riwayat transaksi manual terdeteksi.</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>

      {/* MANUAL ENTRY MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
             <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-sm w-full max-w-2xl p-12 space-y-10 shadow-2xl relative overflow-hidden text-left border border-black/5"
             >
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <span className="status-badge bg-slate-900 text-white uppercase tracking-widest px-3 py-1 rounded-sm text-[8px] font-black border-none">Entry Manual</span>
                      <h2 className="font-display text-4xl italic font-bold tracking-tighter text-slate-900 leading-none mt-4">Catatan Baru.</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rekam transaksi grosir eksternal</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-slate-400"><X size={24} /></button>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Mitra Cafe</label>
                         <select required value={formData.partnerId} onChange={e => setFormData({...formData, partnerId: e.target.value})} className="w-full h-14 bg-stone-50 border border-black/5 rounded-sm px-6 text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-[#367F4D] cursor-pointer">
                            <option value="">Pilih Mitra Resmi</option>
                            {partners.map(p => <option key={p.id} value={p.profile_id}>{p.company_name}</option>)}
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Spesimen (SKU)</label>
                         <select required value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})} className="w-full h-14 bg-stone-50 border border-black/5 rounded-sm px-6 text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-[#367F4D] cursor-pointer">
                            <option value="">Pilih SKU Kopi</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Volume (KG)</label>
                         <div className="relative">
                            <Input required value={formData.weightKg} onChange={e => setFormData({...formData, weightKg: e.target.value})} type="number" step="0.1" placeholder="0.0" className="h-14 bg-stone-50 border-black/10 rounded-sm px-6 pl-14 font-black focus:ring-[#367F4D]" />
                            <Scale className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Total Dibayar (IDR)</label>
                         <div className="relative">
                            <Input required value={formData.totalPaid} onChange={e => setFormData({...formData, totalPaid: e.target.value})} type="number" placeholder="0" className="h-14 bg-stone-50 border-black/10 rounded-sm px-6 pl-14 font-black focus:ring-[#367F4D]" />
                            <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                         </div>
                      </div>
                   </div>

                   <Button type="submit" className="w-full h-16 bg-slate-950 text-white rounded-sm font-black uppercase tracking-[0.3em] italic text-[10px] shadow-2xl hover:bg-[#367F4D] transition-all border-none">
                      Simpan Transaksi Manual <Save size={18} className="ml-2" />
                   </Button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
