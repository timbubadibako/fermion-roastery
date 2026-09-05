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
   ChevronRight,
   BookOpenCheck,
   ChevronDown,
   Building2,
   Coffee
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
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [saving, setSaving] = useState(false);
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
         const [pRes, prodRes, ledgerRes] = await Promise.all([
            apiFetch("/api/admin/partners"),
            apiFetch("/api/products"),
            apiFetch("/api/admin/manual-transaction")
         ]);

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

      setSaving(true);
      try {
         const res = await apiFetch("/api/admin/manual-transaction", {
            method: "POST",
            body: JSON.stringify(formData)
         });
         if (res.ok) {
            toast.success("Transaksi manual berhasil dicatat ke buku besar.");
            setIsFormOpen(false);
            setFormData({
               partnerId: "",
               productId: "",
               weightKg: "",
               totalPaid: "",
               transactionDate: new Date().toISOString().split('T')[0]
            });
            fetchLedgerData();
         } else {
            const data = await res.json().catch(() => null);
            toast.error(data?.message || "Gagal menyimpan transaksi.");
         }
      } catch (e) {
         toast.error("Kesalahan jaringan.");
      } finally {
         setSaving(false);
      }
   };

   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 10;

   useEffect(() => {
      setCurrentPage(1);
   }, [searchQuery]);

   const filteredTransactions = transactions.filter(t =>
      t.partner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
   );

   const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
   const safePage = Math.min(currentPage, totalPages);
   const startIndex = (safePage - 1) * itemsPerPage;
   const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

   if (loading) return (
      <div className="h-[65vh] flex flex-col items-center justify-center gap-4 text-slate-400 font-sans">
         <div className="w-10 h-10 border-4 border-slate-900 border-t-[#367F4D] rounded-full animate-spin" />
         <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sinkronisasi Buku Besar...</p>
      </div>
   );

   return (
      <div className="space-y-6 font-sans text-left">
         {/* HEADER TOOLBAR */}
         <div className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
               <h1 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <BookOpenCheck size={18} className="text-[#367F4D]" />
                  <span>CATATAN PENJUALAN & MANUAL LEDGER B2B</span>
                  <span className="text-[10px] font-bold text-[#367F4D] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono">
                     {transactions.length} TRANSAKSI
                  </span>
               </h1>
            </div>

            <div className="flex items-center gap-2.5 text-xs">
               <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <Input
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                     placeholder="Cari Mitra atau Produk..."
                     className="pl-9 h-9 w-60 bg-slate-50 border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#367F4D]"
                  />
               </div>

               <Button 
                  onClick={() => setIsFormOpen(!isFormOpen)} 
                  className={`h-9 font-bold text-xs uppercase tracking-wider rounded-xl px-4 gap-2 border-none shadow-xs transition-all ${
                     isFormOpen ? 'bg-slate-900 text-white' : 'bg-[#367F4D] hover:bg-emerald-700 text-white'
                  }`}
               >
                  {isFormOpen ? <X size={15} /> : <Plus size={15} />}
                  {isFormOpen ? "Tutup Form" : "Tambah Transaksi Manual"}
               </Button>
            </div>
         </div>

         {/* INLINE FORM CARD FOR MANUAL ENTRY */}
         <AnimatePresence>
            {isFormOpen && (
               <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="overflow-hidden"
               >
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
                     <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                           <Building2 size={16} className="text-[#367F4D]" />
                           <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                              Input Transaksi Manual B2B (Entry Baru)
                           </h3>
                        </div>
                        <button
                           type="button"
                           onClick={() => setIsFormOpen(false)}
                           className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                           <X size={16} />
                        </button>
                     </div>

                     <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                           {/* MITRA CAFE DROPDOWN */}
                           <div className="space-y-1.5 text-left">
                              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Mitra Cafe / PT *</label>
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button type="button" variant="outline" className="w-full h-10 bg-slate-50 border-slate-200 rounded-xl px-3.5 text-xs font-semibold text-slate-900 hover:bg-slate-100 justify-between items-center shadow-none">
                                       <span className="truncate">
                                          {partners.find(p => p.profile_id === formData.partnerId)?.company_name || "Pilih Mitra Resmi"}
                                       </span>
                                       <ChevronDown size={14} className="text-slate-400 shrink-0" />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="start" className="w-64 rounded-xl border border-slate-200 shadow-xl p-1 bg-white max-h-56 overflow-y-auto z-50">
                                    {partners.length === 0 ? (
                                       <DropdownMenuItem className="text-xs font-bold text-slate-400 py-2">Belum ada mitra approved</DropdownMenuItem>
                                    ) : (
                                       partners.map(p => (
                                          <DropdownMenuItem
                                             key={p.id}
                                             className="text-xs font-bold uppercase py-2 px-3 cursor-pointer rounded-lg focus:bg-slate-100"
                                             onClick={() => setFormData({ ...formData, partnerId: p.profile_id })}
                                          >
                                             {p.company_name}
                                          </DropdownMenuItem>
                                       ))
                                    )}
                                 </DropdownMenuContent>
                              </DropdownMenu>
                           </div>

                           {/* SPESIMEN (SKU) DROPDOWN */}
                           <div className="space-y-1.5 text-left">
                              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Spesimen Kopi (SKU) *</label>
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button type="button" variant="outline" className="w-full h-10 bg-slate-50 border-slate-200 rounded-xl px-3.5 text-xs font-semibold text-slate-900 hover:bg-slate-100 justify-between items-center shadow-none">
                                       <span className="truncate">
                                          {products.find(p => p.id === formData.productId)?.name || "Pilih SKU Kopi"}
                                       </span>
                                       <ChevronDown size={14} className="text-slate-400 shrink-0" />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="start" className="w-64 rounded-xl border border-slate-200 shadow-xl p-1 bg-white max-h-56 overflow-y-auto z-50">
                                    {products.map(p => (
                                       <DropdownMenuItem
                                          key={p.id}
                                          className="text-xs font-bold uppercase py-2 px-3 cursor-pointer rounded-lg focus:bg-slate-100"
                                          onClick={() => setFormData({ ...formData, productId: p.id })}
                                       >
                                          {p.name}
                                       </DropdownMenuItem>
                                    ))}
                                 </DropdownMenuContent>
                              </DropdownMenu>
                           </div>

                           {/* INPUT TANGGAL TRANSAKSI */}
                           <div className="space-y-1.5">
                              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Tanggal Transaksi *</label>
                              <div className="relative">
                                 <Input
                                    required
                                    type="date"
                                    value={formData.transactionDate}
                                    onChange={e => setFormData({ ...formData, transactionDate: e.target.value })}
                                    className="h-10 bg-slate-50 border-slate-200 rounded-xl px-3.5 pl-9 font-semibold text-xs focus:bg-white focus:border-[#367F4D]"
                                 />
                                 <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                              </div>
                           </div>

                           {/* INPUT VOLUME */}
                           <div className="space-y-1.5">
                              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Volume Bersih (KG) *</label>
                              <div className="relative">
                                 <Input required value={formData.weightKg} onChange={e => setFormData({ ...formData, weightKg: e.target.value })} type="number" step="0.1" placeholder="0.0" className="h-10 bg-slate-50 border-slate-200 rounded-xl px-3.5 pl-9 font-semibold text-xs focus:bg-white focus:border-[#367F4D]" />
                                 <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                              </div>
                           </div>

                           {/* INPUT TOTAL BAYAR */}
                           <div className="space-y-1.5 md:col-span-2">
                              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Total Dibayar (IDR) *</label>
                              <div className="relative">
                                 <Input required value={formData.totalPaid} onChange={e => setFormData({ ...formData, totalPaid: e.target.value })} type="number" placeholder="0" className="h-10 bg-slate-50 border-slate-200 rounded-xl px-3.5 pl-9 font-mono font-bold text-xs focus:bg-white focus:border-[#367F4D]" />
                                 <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                              </div>
                           </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                           <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsFormOpen(false)}
                              className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-wider px-4"
                           >
                              Batal
                           </Button>
                           <Button
                              type="submit"
                              disabled={saving}
                              className="h-9 bg-[#367F4D] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider px-5 border-none shadow-xs flex items-center gap-2"
                           >
                              <Save size={14} /> {saving ? "Menyimpan..." : "Catat Transaksi Manual"}
                           </Button>
                        </div>
                     </form>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* DATA TABLE RIWAYAT */}
         <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden text-left">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
               <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Riwayat Transaksi Buku Besar</h3>
               <span className="text-xs font-bold text-slate-400 font-mono">{filteredTransactions.length} RECORD</span>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                     <tr className="bg-slate-900 text-slate-200 uppercase tracking-wider text-[10px]">
                        <th className="p-4 font-bold">Tanggal Transaksi</th>
                        <th className="p-4 font-bold">Mitra Cafe</th>
                        <th className="p-4 font-bold">Produk SKU</th>
                        <th className="p-4 font-bold text-center">Volume Bersih</th>
                        <th className="p-4 text-right font-bold">Total Bayar</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                     {filteredTransactions.length === 0 ? (
                        <tr>
                           <td colSpan={5} className="p-16 text-center text-slate-400 font-bold uppercase text-xs">
                              Belum ada riwayat transaksi manual terdeteksi.
                           </td>
                        </tr>
                      ) : (
                        paginatedTransactions.map((tx) => (
                           <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 font-mono text-xs font-semibold text-slate-600">{tx.transaction_date}</td>
                              <td className="p-4 font-extrabold uppercase text-slate-900">{tx.partner_name}</td>
                              <td className="p-4 font-semibold text-slate-700 uppercase">{tx.product_name}</td>
                              <td className="p-4 font-mono font-bold text-xs text-center text-[#367F4D]">{tx.weight_kg} KG</td>
                              <td className="p-4 font-mono font-bold text-xs text-right text-slate-900">Rp {tx.total_paid.toLocaleString("id-ID")}</td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>

            {filteredTransactions.length > 0 && (
               <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans">
                  <p className="text-slate-500 font-medium">
                     Menampilkan <span className="font-extrabold text-slate-800">{startIndex + 1}</span> - <span className="font-extrabold text-slate-800">{Math.min(startIndex + itemsPerPage, filteredTransactions.length)}</span> dari <span className="font-extrabold text-slate-800">{filteredTransactions.length}</span> transaksi
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
      </div>
   );
}
