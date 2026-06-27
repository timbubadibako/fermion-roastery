"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Coffee, 
  MapPin, 
  Tag, 
  Globe, 
  Image as ImageIcon,
  Save,
  X,
  Beaker,
  TrendingUp,
  Boxes
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  slug: string;
  notes: string;
  origin: string;
  process: string;
  altitude: string;
  price_retail: number;
  roast_profile: string;
  description: string;
  farm: string;
  image_url: string;
  fermentation: string;
  sweetness: number;
  acidity: number;
  body: number;
  stock_quantity: number;
  is_active: boolean;
}

export default function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) setProducts(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await apiFetch(`/api/products/${productToDelete}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Produk berhasil dihapus.");
        fetchProducts();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.message || "Gagal menghapus produk.");
      }
    } catch (e) {
      toast.error("Gagal menghapus produk.");
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.origin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
      <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Mengaudit Inventaris...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/5 pb-10">
        <div className="space-y-3 text-left">
          <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">Stok <br/> Kopi.</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Manajemen SKU, profil pemanggangan, dan kontrol stok.</p>
        </div>
        <Link href="/admin/inventory/new">
            <Button className="bg-slate-950 text-white rounded-sm h-14 px-10 gap-3 font-black uppercase tracking-widest italic shadow-xl hover:bg-[#367F4D] transition-all border-none">
            <Plus size={20} /> Tambah Kopi Baru
            </Button>
        </Link>
      </div>

      <div className="bg-white border border-black/5 rounded-sm overflow-hidden shadow-sm">
        <div className="p-8 border-b border-black/5 flex items-center justify-between bg-stone-50/50">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Arsip Produk</h3>
            <div className="flex gap-4">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={14} />
                  <Input 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Cari SKU atau Origin..." 
                    className="pl-12 h-10 w-64 bg-white border-black/10 rounded-sm text-xs font-bold focus:ring-[#367F4D]" 
                  />
               </div>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-8 font-black">Nama & Origin</th>
                <th className="p-8 text-center font-black">Stok (Unit)</th>
                <th className="p-8 font-black">Profil Rasa</th>
                <th className="p-8 font-black">Harga Retail</th>
                <th className="p-8 text-right font-black">Kendali</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredProducts.length === 0 ? (
                <tr><td colSpan={5} className="p-24 text-center text-stone-300 font-bold uppercase tracking-widest text-xs italic">Belum ada produk terdaftar.</td></tr>
              ) : (
                filteredProducts.map((product, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={product.id} 
                    className="hover:bg-stone-50/50 transition-colors group"
                  >
                    <td className="p-8">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-sm bg-stone-100 overflow-hidden flex items-center justify-center border border-black/5">
                             {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : <Coffee size={20} className="text-stone-300" />}
                          </div>
                          <div className="space-y-1">
                             <p className="font-bold uppercase tracking-tight text-slate-900">{product.name}</p>
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><MapPin size={10} /> {product.origin}</p>
                          </div>
                       </div>
                    </td>
                    <td className="p-8 text-center">
                       <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-sm text-[10px] font-black ${product.stock_quantity > 10 ? 'bg-stone-50 text-slate-600' : 'bg-red-50 text-red-500'}`}>
                          <Boxes size={12} /> {product.stock_quantity}
                       </div>
                    </td>
                    <td className="p-8">
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{product.notes}</p>
                          <div className="flex gap-1">
                             <div className="w-20 h-1 bg-stone-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#367F4D]" style={{ width: `${(product.sweetness / 5) * 100}%` }} />
                             </div>
                             <span className="text-[8px] font-black text-[#367F4D]">SWT</span>
                          </div>
                       </div>
                    </td>
                    <td className="p-8 font-mono font-bold text-xs text-slate-600">
                       Rp {Number(product.price_retail).toLocaleString('id-ID')}
                    </td>
                    <td className="p-8 text-right">
                       <div className="flex items-center justify-end gap-3">
                          <Link href={`/admin/inventory/${product.id}`}>
                            <Button className="h-10 w-10 rounded-sm bg-stone-50 text-slate-400 hover:bg-slate-950 hover:text-white transition-all border-none shadow-none"><Edit3 size={16} /></Button>
                          </Link>
                          <Button 
                            onClick={() => { setProductToDelete(product.id); setIsDeleteModalOpen(true); }}
                            className="h-10 w-10 rounded-sm bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all border-none shadow-none"
                          >
                            <Trash2 size={16} />
                          </Button>
                       </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Produk?"
        description="Data produk dan riwayatnya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Permanen"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
}
