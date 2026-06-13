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
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";

interface Product {
  id: string;
  name: string;
  price_retail: number;
  origin: string;
  notes: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function B2BOrderPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tier configuration (As per user requirement)
  // Silver reached at 15kg, discount 10k IDR/kg
  const currentTier = user?.tier_name || 'Bronze';
  const getDiscountPerKg = (tier: string) => {
    if (tier === 'Silver') return 10000;
    if (tier === 'Gold') return 15000; // Placeholder
    return 0; // Bronze
  };

  const TIER_DISCOUNT = getDiscountPerKg(currentTier);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => toast.error("Failed to load wholesale catalog"));
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      // Fixed discount subtraction per unit (assuming 1 unit = 1kg or similar)
      const wholesalePrice = Math.max(0, Number(product.price_retail) - TIER_DISCOUNT);
      return [...prev, { id: product.id, name: product.name, price: wholesalePrice, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const retailTotal = cart.reduce((acc, item) => {
      const p = products.find(p => p.id === item.id);
      return acc + ((p?.price_retail || 0) * item.quantity);
  }, 0);
  const savings = retailTotal - total;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    // Logic for B2B order creation (contract-linked) would go here
    setTimeout(() => {
      toast.success("Bulk Order Placed Successfully");
      setCart([]);
      setIsSubmitting(false);
    }, 1500);
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center bg-transparent"><Loader2 className="animate-spin text-fermion-french-blue" /></div>;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-100 mb-2">
             <TrendingDown size={14} />
             <span className="text-[10px] font-black uppercase tracking-widest">
                Tier: {currentTier} Active ({TIER_DISCOUNT.toLocaleString()} IDR/kg Discount)
             </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">Bulk <br/> Procurement.</h1>
          <p className="text-sm font-medium text-slate-500">Order premium specimens at your locked-in partner rates.</p>
        </div>
        <div className="bg-slate-900 px-8 py-6 rounded-[2rem] text-white shadow-2xl flex items-center gap-6">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Subtotal</p>
              <p className="text-2xl font-black italic">Rp {total.toLocaleString('id-ID')}</p>
              {savings > 0 && <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-1">You save Rp {savings.toLocaleString()}</p>}
           </div>
           <ShoppingCart className="text-fermion-french-blue" size={28} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Wholesale Catalog */}
        <div className="lg:col-span-7 space-y-8">
           <div className="flex items-center justify-between px-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Partner Catalog</h4>
              <div className="flex items-center gap-2 text-slate-400">
                 <Info size={14} />
                 <span className="text-[9px] font-bold uppercase tracking-widest">
                    Prices reflect your {currentTier} tier benefits
                 </span>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map(product => {
                const wholesalePrice = Math.max(0, Number(product.price_retail) - TIER_DISCOUNT);
                return (
                  <div key={product.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between group hover:border-fermion-french-blue transition-all shadow-sm hover:shadow-xl">
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-fermion-french-blue uppercase tracking-widest">{product.origin}</p>
                          <p className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight">{product.name}</p>
                       </div>
                       <p className="text-xs text-slate-400 font-medium line-clamp-2 italic">"{product.notes}"</p>
                       <div className="pt-4 border-t border-slate-50 flex items-end justify-between">
                          <div className="space-y-0.5">
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest line-through">Rp {Number(product.price_retail).toLocaleString()}</p>
                             <p className="text-lg font-black text-slate-900">Rp {wholesalePrice.toLocaleString()}<span className="text-[10px] text-slate-400 ml-1">/ unit</span></p>
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => addToCart(product)}
                            className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-fermion-french-blue hover:text-white transition-all"
                          >
                            <Plus size={20} />
                          </Button>
                       </div>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Dedicated B2B Cart */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-white border border-slate-100 rounded-[3.5rem] p-12 shadow-xl flex flex-col h-full sticky top-12">
              <div className="flex items-center justify-between mb-12">
                 <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Procurement Basket</h4>
                 <span className="text-[10px] font-black bg-slate-100 px-4 py-1.5 rounded-full uppercase tracking-widest text-slate-500">{cart.length} Products</span>
              </div>

              <div className="flex-1 space-y-8 overflow-y-auto max-h-[450px] pr-4 scrollbar-hide">
                 {cart.length === 0 ? (
                   <div className="py-24 text-center space-y-6">
                      <Package className="mx-auto text-slate-100" size={64} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Your basket is empty</p>
                   </div>
                 ) : (
                   cart.map(item => (
                     <div key={item.id} className="flex items-center justify-between gap-6 group">
                        <div className="flex-1 space-y-1">
                           <p className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">{item.name}</p>
                           <div className="flex items-center gap-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Unit: Rp {item.price.toLocaleString()}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                           <button onClick={() => updateQty(item.id, -1)} className="text-slate-400 hover:text-slate-900 transition-colors"><Minus size={14} /></button>
                           <span className="text-xs font-black text-slate-900 tabular-nums w-6 text-center">{item.quantity}</span>
                           <button onClick={() => updateQty(item.id, 1)} className="text-slate-400 hover:text-slate-900 transition-colors"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-slate-200 hover:text-red-500 transition-all">
                           <Trash2 size={18} />
                        </button>
                     </div>
                   ))
                 )}
              </div>

              <div className="pt-12 border-t border-slate-100 space-y-8 mt-auto">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-slate-400">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Retail Value</span>
                        <span className="text-xs font-bold line-through">Rp {retailTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-900">
                        <span className="text-[10px] font-black uppercase tracking-widest">Partner Total</span>
                        <span className="text-2xl font-black italic">Rp {total.toLocaleString()}</span>
                    </div>
                 </div>
                 <Button 
                  disabled={cart.length === 0 || isSubmitting}
                  onClick={handlePlaceOrder}
                  className="w-full bg-slate-950 hover:bg-fermion-french-blue text-white rounded-[2rem] h-16 font-black uppercase tracking-widest italic shadow-2xl transition-all active:scale-95"
                 >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Place Bulk Order"}
                 </Button>
                 <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">Orders are roasted-to-order. Estimated dispatch: 48h</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
