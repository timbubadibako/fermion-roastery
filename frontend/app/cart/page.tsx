"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  img: string;
  weight: string;
  grind: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { 
      id: 1, 
      name: "Fermion House Blend", 
      price: 125000, 
      quantity: 1, 
      img: "https://placehold.co/200x200/7a9cff/ffffff?text=House+Blend",
      weight: "250g",
      grind: "Whole Beans"
    },
    { 
      id: 2, 
      name: "Sumedang Anaerob", 
      price: 165000, 
      quantity: 2, 
      img: "https://placehold.co/200x200/ff4b4b/ffffff?text=Anaerob",
      weight: "250g",
      grind: "Espresso"
    },
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items => items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 500000 ? 0 : 35000;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#FDFBF7] min-h-screen pt-40 pb-40 flex flex-col items-center justify-center px-6 text-center">
         <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
            <ShoppingBag size={32} className="text-slate-200" />
         </div>
         <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic mb-4">Your cart is empty</h1>
         <p className="text-slate-500 mb-10 max-w-xs font-medium">Looks like you haven't added any coffee to your ritual yet.</p>
         <Link href="/our-coffee">
           <Button className="bg-slate-900 text-white font-black tracking-widest px-10 h-14 rounded-2xl uppercase">Start Shopping</Button>
         </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-40 pb-40 px-6">
      <div className="max-w-6xl mx-auto px-12">
        <div className="flex items-end justify-between mb-16">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-fermion-blue tracking-[0.4em] uppercase">Your Selection</p>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic">Shopping Cart</h1>
          </div>
          <Link href="/our-coffee" className="text-[10px] font-black tracking-widest text-slate-400 hover:text-slate-900 border-b border-slate-200 pb-1 transition-all uppercase">
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-10">
            <div className="hidden md:grid grid-cols-12 pb-6 border-b border-slate-100 text-[10px] font-black text-slate-400 tracking-widest uppercase">
               <div className="col-span-6">Product</div>
               <div className="col-span-2 text-center">Price</div>
               <div className="col-span-2 text-center">Quantity</div>
               <div className="col-span-2 text-right">Total</div>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center group">
                {/* Product Info */}
                <div className="col-span-1 md:col-span-6 flex items-center gap-6">
                  <div className="relative w-24 h-24 bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                    <Image src={item.img} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-1 text-left">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.weight} • {item.grind}</p>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-[9px] font-bold text-red-400 hover:text-red-600 transition-colors uppercase pt-2 flex items-center gap-1.5"
                    >
                      <Trash2 size={10} /> Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="hidden md:block col-span-2 text-center font-mono text-xs font-bold text-slate-600">
                  Rp {item.price.toLocaleString('id-ID')}
                </div>

                {/* Quantity Controls */}
                <div className="col-span-1 md:col-span-2 flex justify-center">
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-lg"><Minus size={12}/></button>
                    <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-lg"><Plus size={12}/></button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="col-span-1 md:col-span-2 text-right font-mono text-sm font-black text-slate-900">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/30 space-y-8 sticky top-32">
            <h2 className="text-xl font-black tracking-tighter uppercase italic">Summary</h2>
            
            <div className="space-y-4">
               <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="font-mono">Rp {subtotal.toLocaleString('id-ID')}</span>
               </div>
               <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span className="uppercase tracking-widest text-[10px]">Shipping</span>
                  <span className="font-mono">{shipping === 0 ? "FREE" : `Rp ${shipping.toLocaleString('id-ID')}`}</span>
               </div>
               <Separator className="bg-slate-50" />
               <div className="flex justify-between text-lg font-black text-slate-900 pt-2">
                  <span className="uppercase tracking-tighter italic">Total</span>
                  <span className="font-mono">Rp {total.toLocaleString('id-ID')}</span>
               </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full h-16 bg-slate-900 text-white font-black tracking-[0.2em] rounded-2xl hover:bg-fermion-blue transition-all duration-500 shadow-xl uppercase italic group">
                Checkout <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest px-4 leading-relaxed">
                Taxes and duties included. <br/> Secure SSL encrypted payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
