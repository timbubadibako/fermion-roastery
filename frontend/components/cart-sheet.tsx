"use client";

import React, { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  img: string;
}

export function CartSheet() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { 
      id: 1, 
      name: "Fermion House Blend", 
      price: 125000, 
      quantity: 1, 
      img: "https://placehold.co/200x200/7a9cff/ffffff?text=House+Blend" 
    },
    { 
      id: 2, 
      name: "Sumedang Anaerob", 
      price: 165000, 
      quantity: 2, 
      img: "https://placehold.co/200x200/ff4b4b/ffffff?text=Anaerob" 
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

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="text-slate-800 hover:text-fermion-blue transition-all duration-300 relative group">
          <ShoppingCart size={18} strokeWidth={1.5} />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-fermion-blue text-white text-[6px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white group-hover:scale-110 transition-transform">
              {cartItems.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-white/95 backdrop-blur-xl border-l border-slate-100 flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-slate-50">
          <SheetTitle className="text-xl font-black tracking-tighter uppercase">Your Cart</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-slate-50 p-8 rounded-[3rem]">
                <ShoppingCart size={48} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-medium tracking-tight">Your cart is empty.</p>
              <Button variant="outline" className="rounded-full px-8 border-slate-200">Start Shopping</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <div className="flex gap-4 group">
                    <div className="w-20 h-20 rounded-3xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">{item.name}</h4>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-fermion-blue">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                      
                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center bg-slate-50 rounded-full border border-slate-100 px-1 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white rounded-full transition-colors"
                          >
                            <Minus size={12} className="text-slate-600" />
                          </button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-white rounded-full transition-colors"
                          >
                            <Plus size={12} className="text-slate-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < cartItems.length - 1 && <Separator className="bg-slate-50" />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <SheetFooter className="p-6 bg-slate-50/50 border-t border-slate-100 flex-col gap-4">
            <div className="space-y-1.5 w-full">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="text-slate-800 font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <p className="text-[10px] text-slate-400">Shipping and taxes calculated at checkout.</p>
            </div>
            <Button className="w-full bg-fermion-blue hover:bg-fermion-blue/90 text-white font-bold h-14 rounded-3xl shadow-xl shadow-fermion-blue/20 transition-all active:scale-[0.98]">
              Checkout Now
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
