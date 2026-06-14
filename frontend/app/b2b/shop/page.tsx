"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Package, 
  Loader2,
  TrendingDown,
  Info,
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
      toast.error("Failed to load wholesale catalog");
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
      image: "https://placehold.co/800x1000/7a9cff/ffffff?text=FERMION+COFFEE",
      weight: "250g", // Default or you can adjust
      grind: "Whole Bean",
      priceType: product.priceType || 'tier',
      original_price: Number(product.price_retail)
    });
    toast.success(`${product.name} added to procurement basket`);
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Catalog...</p>
    </div>
  );

  const currentTier = partner?.tier_name || 'Bronze';
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="space-y-12 pb-20 relative">
      {/* FLOATING CART BUTTON */}
      <div className="sticky top-24 z-40 flex justify-end pointer-events-none">
        <div className="pointer-events-auto">
          <Link href="/b2b/checkout">
            <Button className="h-14 px-6 rounded-full bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-periwinkle transition-all flex items-center gap-3">
              <ShoppingCart size={18} />
              <span>Basket ({totalItems})</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-end -mt-14">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-100 mb-2">
             <TrendingDown size={14} />
             <span className="text-[10px] font-black uppercase tracking-widest">
                Tier: {currentTier} Pricing Active
             </span>
          </div>
          <h1 className="display-font text-6xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">Wholesale <br/> Laboratory.</h1>
          <p className="text-sm font-medium text-slate-500">Secure your next batch of laboratory-grade specimens at your locked-in partner rates.</p>
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
              className="bg-white p-10 rounded-[3rem] border border-slate-100 flex flex-col justify-between group hover:border-fermion-french-blue transition-all shadow-sm hover:shadow-2xl"
            >
              <div className="space-y-6">
                 <div className="space-y-2">
                    <span className="text-[8px] font-black bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest text-slate-500">{product.origin}</span>
                    <h3 className="display-font text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight">{product.name}</h3>
                 </div>
                 <p className="text-xs text-slate-400 font-medium line-clamp-3 italic">"{product.notes}"</p>
              </div>
              
              <div className="pt-8 mt-8 border-t border-slate-50 flex items-end justify-between">
                 <div className="space-y-1">
                    {isDiscounted && (
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest line-through">Retail: Rp {Number(product.price_retail).toLocaleString('id-ID')}</p>
                    )}
                    <p className="text-2xl font-black text-slate-900 italic tracking-tighter">
                      Rp {Number(wholesalePrice).toLocaleString('id-ID')}
                      <span className="text-[10px] text-slate-400 ml-1 not-italic tracking-widest uppercase">/ unit</span>
                    </p>
                 </div>
                 <Button 
                   onClick={() => handleAddToCart(product)}
                   size="icon"
                   className="w-12 h-12 bg-slate-100 hover:bg-slate-900 text-slate-600 hover:text-white rounded-2xl transition-all"
                 >
                    <Plus size={20} />
                 </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-slate-950 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-periwinkle/20 blur-3xl -mr-32 -mt-32" />
         <div className="space-y-2 relative z-10">
            <h3 className="display-font text-3xl font-black italic">Ready to Checkout?</h3>
            <p className="text-slate-400 text-sm">Review your selected items and finalize your wholesale procurement.</p>
         </div>
         <Link href="/b2b/checkout" className="w-full md:w-auto relative z-10">
            <Button className="w-full h-16 px-10 bg-white text-slate-950 font-black uppercase tracking-widest italic rounded-2xl hover:bg-periwinkle hover:text-white transition-all shadow-xl group/btn">
               Proceed to Protocol <ArrowRight size={18} className="ml-3 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
         </Link>
      </div>
    </div>
  );
}
