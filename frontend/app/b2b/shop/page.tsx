"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, 
  Plus, 
  Loader2,
  TrendingDown,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore, useCartStore } from "@/lib/store";
import Link from "next/link";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price_retail: number;
  origin: string;
  notes: string;
  price?: number; // Backend dynamic price
  priceType?: string;
}

export default function WholesaleShopPage() {
  const { user } = useAuthStore();
  const { addItem, items } = useCartStore(); // All hooks at the top
  const [partner, setPartner] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchPartnerAndProducts();
  }, [user]);

  const fetchPartnerAndProducts = async () => {
    try {
      const [pRes, prodRes] = await Promise.all([
        fetch(`/api/admin/partners?profileId=${user?.id}`),
        fetch(`/api/products?profileId=${user?.id}`)
      ]);
      
      if (pRes.ok) {
        const pData = await pRes.json();
        setPartner(pData.find((p: any) => p.profile_id === user?.id));
      }
      if (prodRes.ok) setProducts(await prodRes.json());
    } catch (e) {
      toast.error("Gagal memuat katalog grosir.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    const finalPrice = product.price || Number(product.price_retail);
    addItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      quantity: 1,
      image: "https://placehold.co/800x1000/367f4d/ffffff?text=FERMION+COFFEE",
      weight: "250g", // Default or you can adjust
      grind: "Whole Bean",
      priceType: product.priceType || 'tier',
      original_price: Number(product.price_retail)
    });
    toast.success(`${product.name} dimasukkan ke keranjang grosir`);
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
      <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Memuat Katalog Grosir...</p>
    </div>
  );

  const currentTier = partner?.tier_name || 'Bronze';
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="space-y-12 pb-20 relative text-left">
      {/* FLOATING CART BUTTON */}
      <div className="sticky top-24 z-40 flex justify-end pointer-events-none">
        <div className="pointer-events-auto">
          <Link href="/b2b/checkout">
            <Button className="h-14 px-6 rounded-sm bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-[#367F4D] transition-all flex items-center gap-3 border-none">
              <ShoppingCart size={18} />
              <span>Keranjang ({totalItems})</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-end -mt-14">
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full w-fit mb-2">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
             <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                Harga Level {currentTier} Aktif
             </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">Belanja <br/> Grosir.</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Katalog produk khusus dengan harga kemitraan aktif.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {products.map((product, i) => {
          const wholesalePrice = product.price || product.price_retail;
          const isDiscounted = wholesalePrice < product.price_retail;

          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={product.id} 
              className="bg-white p-8 rounded-sm border border-black/5 flex flex-col justify-between group hover:border-[#367F4D]/30 transition-all shadow-sm hover:shadow-xl"
            >
              <div className="space-y-6">
                 <div className="space-y-2">
                    <span className="text-[8px] font-black bg-stone-100 px-3 py-1 rounded-sm border border-black/5 uppercase tracking-widest text-slate-500">{product.origin}</span>
                    <h3 className="font-display text-3xl font-bold text-slate-900 uppercase italic tracking-tighter leading-tight">{product.name}</h3>
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest line-clamp-3">"{product.notes}"</p>
              </div>
              
              <div className="pt-8 mt-8 border-t border-black/5 flex items-end justify-between">
                 <div className="space-y-1">
                    {isDiscounted && (
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest line-through">Retail: Rp {Number(product.price_retail).toLocaleString('id-ID')}</p>
                    )}
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">
                      Rp {Number(wholesalePrice).toLocaleString('id-ID')}
                      <span className="text-[9px] text-slate-400 ml-1 font-black tracking-widest uppercase">/ Unit</span>
                    </p>
                 </div>
                 <Button 
                   onClick={() => handleAddToCart(product)}
                   size="icon"
                   className="w-12 h-12 bg-stone-50 hover:bg-[#367F4D] text-slate-400 hover:text-white rounded-sm transition-all border-none shadow-none"
                 >
                    <Plus size={20} />
                 </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-slate-900 rounded-sm p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl -mr-32 -mt-32" />
         <div className="space-y-3 relative z-10">
            <h3 className="font-display text-4xl font-bold italic tracking-tighter text-white">Selesai Memilih?</h3>
            <p className="text-[11px] text-slate-400 font-medium tracking-wider uppercase leading-relaxed max-w-md">Tinjau kembali pesanan Anda dan lanjutkan ke proses pengiriman untuk mengamankan batch roastery minggu ini.</p>
         </div>
         <Link href="/b2b/checkout" className="w-full md:w-auto relative z-10">
            <Button className="w-full h-16 px-10 bg-white text-slate-950 font-black uppercase tracking-widest italic text-[10px] hover:bg-[#367F4D] hover:text-white transition-all shadow-xl group/btn border-none">
               Proses Pesanan <ArrowRight size={18} className="ml-3 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
         </Link>
      </div>
    </div>
  );
}
