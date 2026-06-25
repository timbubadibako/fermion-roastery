"use client";

import { apiFetch } from "@/lib/api";
import React, { useState, useEffect } from "react";
import {
   Plus,
   Search,
   Scale,
   Calendar as CalendarIcon,
   Save,
   X,
   CreditCard,
   BookOpen, 
   ChevronRight
} from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
   id: string;
   transaction_date: string;
   partner_name: string;
   product_name: string;
   weight_kg: number;
   total_paid: number;
}

export default function ManualLedger() {
   const [partners, setPartners] = useState<any[]>([]);
   const [products, setProducts] = useState<any[]>([]);
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   const [loading, setLoading] = useState(true);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");

   const [formData, setFormData] = useState({
      partnerId: "",
      productId: "",
      weightKg: "",
      totalPaid: "",
      transactionDate: new Date().toISOString().split('T')[0]
   });

   useEffect(() => {
      fetchLedgerData();
   }, []);

   const fetchLedgerData = async () => {
   try {
      // 🎯 KUNCI UTAMANYA: Ganti semua fetch mentah menjadi apiFetch biar token ADMIN ikut terbang!
      const [pRes, prodRes, ledgerRes] = await Promise.all([
         apiFetch("/api/admin/partners"),
         apiFetch("/api/products"),
         apiFetch("/api/admin/manual-transaction")
      ]);

      // Pastikan response-nya ok sebelum di-parse json biar gak crash internal jika ada fail
      const pData = pRes.ok ? await pRes.json() : [];
      const prodData = prodRes.ok ? await prodRes.json() : [];

      setPartners(pData.filter((p: any) => p.status === 'approved'));
      setProducts(prodData);

      if (ledgerRes.ok) {
         setTransactions(await ledgerRes.json());
      }
   } catch (error) {
      console.error("Ledger fetch error:", error);
      toast.error("Gagal memuat data referensi buku besar.");
   } finally {
      setLoading(false);
   }
};

   const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.partnerId || !formData.productId || !formData.weightKg || !formData.totalPaid || !formData.transactionDate) {
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
            fetchLedgerData(); // Refresh list tabel otomatis
         } else {
            toast.error("Gagal menyimpan transaksi.");
         }
      } catch (e) {
         toast.error("Kesalahan jaringan.");
      }
   };

   const filteredTransactions = transactions.filter(t =>
      t.partner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
   );

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
               <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">Catatan <br /> Penjualan.</h1>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Pencatatan transaksi manual untuk sinkronisasi volume mitra.</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="bg-slate-950 text-white rounded-sm h-14 px-10 gap-3 font-black uppercase tracking-widest italic shadow-xl hover:bg-[#367F4D] transition-all border-none">
               <Plus size={20} /> Tambah Transaksi Manual
            </Button>
         </div>

         {/* DATA TABLE RIWAYAT */}
         <div className="bg-white border border-black/5 rounded-sm overflow-hidden shadow-sm text-left">
            <div className="p-8 border-b border-black/5 flex items-center justify-between bg-stone-50/50">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Riwayat Transaksi Buku Besar</h3>
               <div className="flex gap-4">
                  <div className="relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={14} />
                     <Input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Cari Mitra atau Kopi..."
                        className="pl-12 h-10 w-64 bg-white border-black/10 rounded-sm text-xs font-bold focus:ring-[#367F4D]"
                     />
                  </div>
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-stone-50 border-b border-black/5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="p-8 font-black">Tanggal Transaksi</th>
                        <th className="p-8 font-black">Mitra Cafe</th>
                        <th className="p-8 font-black">Produk SKU</th>
                        <th className="p-8 font-black">Volume Bersih</th>
                        <th className="p-8 text-right font-black">Total Bayar</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                     {filteredTransactions.length === 0 ? (
                        <tr>
                           <td colSpan={5} className="p-24 text-center text-stone-300 font-bold uppercase tracking-widest text-xs italic">Belum ada riwayat transaksi manual terdeteksi.</td>
                        </tr>
                     ) : (
                        filteredTransactions.map((tx) => (
                           <tr key={tx.id} className="hover:bg-stone-50/50 transition-colors">
                              <td className="p-8 font-mono text-xs text-slate-500">{tx.transaction_date}</td>
                              <td className="p-8 font-bold uppercase text-slate-900">{tx.partner_name}</td>
                              <td className="p-8 font-bold text-slate-600 uppercase tracking-wide">{tx.product_name}</td>
                              <td className="p-8 font-mono font-bold text-xs text-[#367F4D]">{tx.weight_kg} KG</td>
                              <td className="p-8 font-mono font-bold text-xs text-right text-slate-900">Rp {tx.total_paid.toLocaleString("id-ID")}</td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* MANUAL ENTRY MODAL */}
         <AnimatePresence>
            {isModalOpen && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm text-left">
                  <motion.div
                     initial={{ opacity: 0, scale: 0.95, y: 10 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95, y: 10 }}
                     className="bg-white rounded-sm w-full max-w-2xl p-12 space-y-10 shadow-2xl relative border border-black/5"
                  >
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <span className="bg-slate-900 text-white uppercase tracking-widest px-3 py-1 rounded-sm text-[8px] font-black">Entry Manual</span>
                           <h2 className="font-display text-4xl italic font-bold tracking-tighter text-slate-900 leading-none mt-4">Catatan Baru.</h2>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rekam transaksi grosir eksternal</p>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-slate-400"><X size={24} /></button>
                     </div>

                     <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">

                           {/* 🟢 REUSABLE MITRA CAFE DROPDOWN STYLE */}
                           <div className="space-y-2 text-left">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Mitra Cafe</label>
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button className="w-full h-14 bg-stone-50 border border-black/10 rounded-sm px-5 text-xs font-bold text-slate-900 hover:bg-stone-100 transition-all justify-between items-center shadow-none outline-none">
                                       <span>
                                          {partners.find(p => p.profile_id === formData.partnerId)?.company_name || "Pilih Mitra Resmi"}
                                       </span>
                                       <ChevronRight size={14} className="text-slate-400 rotate-90" />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="start" className="w-[280px] rounded-sm border border-black/10 shadow-2xl p-1 bg-white max-h-60 overflow-y-auto z-[110]">
                                    {partners.map(p => (
                                       <DropdownMenuItem
                                          key={p.id}
                                          className="text-[11px] font-black uppercase py-3 px-4 cursor-pointer focus:bg-[#367F4D] focus:text-white outline-none"
                                          onClick={() => setFormData({ ...formData, partnerId: p.profile_id })}
                                       >
                                          {p.company_name}
                                       </DropdownMenuItem>
                                    ))}
                                 </DropdownMenuContent>
                              </DropdownMenu>
                           </div>

                           {/* 🟢 REUSABLE SPESIMEN (SKU) DROPDOWN STYLE */}
                           <div className="space-y-2 text-left">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Spesimen (SKU)</label>
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button className="w-full h-14 bg-stone-50 border border-black/10 rounded-sm px-5 text-xs font-bold text-slate-900 hover:bg-stone-100 transition-all justify-between items-center shadow-none outline-none">
                                       <span>
                                          {products.find(p => p.id === formData.productId)?.name || "Pilih SKU Kopi"}
                                       </span>
                                       <ChevronRight size={14} className="text-slate-400 rotate-90" />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="start" className="w-[280px] rounded-sm border border-black/10 shadow-2xl p-1 bg-white max-h-60 overflow-y-auto z-[110]">
                                    {products.map(p => (
                                       <DropdownMenuItem
                                          key={p.id}
                                          className="text-[11px] font-black uppercase py-3 px-4 cursor-pointer focus:bg-[#367F4D] focus:text-white outline-none"
                                          onClick={() => setFormData({ ...formData, productId: p.id })}
                                       >
                                          {p.name}
                                       </DropdownMenuItem>
                                    ))}
                                 </DropdownMenuContent>
                              </DropdownMenu>
                           </div>

                           {/* INPUT TANGGAL TRANSAKSI */}
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Tanggal Transaksi</label>
                              <div className="relative">
                                 <Input
                                    required
                                    type="date"
                                    value={formData.transactionDate}
                                    onChange={e => setFormData({ ...formData, transactionDate: e.target.value })}
                                    className="h-14 bg-stone-50 border-black/10 rounded-sm px-5 pl-14 font-bold text-xs focus:ring-[#367F4D]"
                                 />
                                 <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                              </div>
                           </div>

                           {/* INPUT VOLUME */}
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Volume (KG)</label>
                              <div className="relative">
                                 <Input required value={formData.weightKg} onChange={e => setFormData({ ...formData, weightKg: e.target.value })} type="number" step="0.1" placeholder="0.0" className="h-14 bg-stone-50 border-black/10 rounded-sm px-5 pl-14 font-black text-xs focus:ring-[#367F4D]" />
                                 <Scale className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                              </div>
                           </div>

                           {/* INPUT TOTAL BAYAR */}
                           <div className="space-y-2 col-span-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Total Dibayar (IDR)</label>
                              <div className="relative">
                                 <Input required value={formData.totalPaid} onChange={e => setFormData({ ...formData, totalPaid: e.target.value })} type="number" placeholder="0" className="h-14 bg-stone-50 border-black/10 rounded-sm px-5 pl-14 font-black text-xs focus:ring-[#367F4D]" />
                                 <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                              </div>
                           </div>
                        </div>

                        <Button type="submit" className="w-full h-16 bg-slate-950 text-white rounded-sm font-black uppercase tracking-[0.3em] italic text-[10px] shadow-2xl hover:bg-[#367F4D] transition-all border-none flex items-center justify-center gap-2">
                           Simpan Transaksi Manual <Save size={16} />
                        </Button>
                     </form>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
}