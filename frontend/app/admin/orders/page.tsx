"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Package, 
  ArrowRight, 
  Loader2,
  CheckCircle2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price_retail: number;
  origin: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function AdminOrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => toast.error("Failed to load products"));
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price_retail, quantity: 1 }];
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

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsSaving(true);
    // Logic for internal admin order creation would go here
    setTimeout(() => {
      toast.success("Internal Order Created (Draft)");
      setCart([]);
      setIsSaving(false);
    }, 1500);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-transparent"><Loader2 className="animate-spin text-fermion-french-blue" /></div>;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">Internal <br/> Procurement.</h1>
          <p className="text-sm font-medium text-slate-500">Create manual orders for laboratory testing or events.</p>
        </div>
        <div className="bg-white px-8 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Total</p>
              <p className="text-xl font-black text-slate-900 italic">Rp {total.toLocaleString('id-ID')}</p>
           </div>
           <ShoppingCart className="text-fermion-french-blue" size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Product Selection */}
        <div className="lg:col-span-7 space-y-6">
           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Available Specimens</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-fermion-french-blue transition-all shadow-sm">
                   <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{product.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.origin}</p>
                   </div>
                   <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => addToCart(product)}
                    className="rounded-xl hover:bg-fermion-french-blue hover:text-white transition-all"
                   >
                     <Plus size={18} />
                   </Button>
                </div>
              ))}
           </div>
        </div>

        {/* Dedicated Admin Cart */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-xl flex flex-col h-full sticky top-12">
              <div className="flex items-center justify-between mb-10">
                 <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Procurement Basket</h4>
                 <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full">{cart.length} Items</span>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto max-h-[400px] pr-4 scrollbar-hide">
                 {cart.length === 0 ? (
                   <div className="py-20 text-center space-y-4">
                      <Package className="mx-auto text-slate-100" size={48} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Basket is empty</p>
                   </div>
                 ) : (
                   cart.map(item => (
                     <div key={item.id} className="flex items-center justify-between gap-4 group">
                        <div className="flex-1 space-y-1">
                           <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">{item.name}</p>
                           <p className="text-[10px] font-bold text-slate-400">Rp {item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                           <button onClick={() => updateQty(item.id, -1)} className="text-slate-400 hover:text-slate-900"><Minus size={14} /></button>
                           <span className="text-xs font-black text-slate-900 tabular-nums w-4 text-center">{item.quantity}</span>
                           <button onClick={() => updateQty(item.id, 1)} className="text-slate-400 hover:text-slate-900"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-slate-200 hover:text-red-500 transition-colors">
                           <Trash2 size={16} />
                        </button>
                     </div>
                   ))
                 )}
              </div>

              <div className="pt-10 border-t border-slate-50 space-y-6">
                 <div className="flex justify-between items-center text-slate-900">
                    <span className="text-[10px] font-black uppercase tracking-widest">Net Payable</span>
                    <span className="text-xl font-black italic">Rp {total.toLocaleString()}</span>
                 </div>
                 <Button 
                  disabled={cart.length === 0 || isSubmitting}
                  onClick={handlePlaceOrder}
                  className="w-full bg-slate-900 hover:bg-fermion-french-blue text-white rounded-2xl h-14 font-black uppercase tracking-widest italic shadow-2xl transition-all"
                 >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Finalize Procurement"}
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
