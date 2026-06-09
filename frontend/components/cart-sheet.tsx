"use client";

import React, { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { useCartStore } from "@/lib/store";

export function CartSheet() {
  const [loading, setLoading] = useState(false);
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotal } = useCartStore();

  const subtotal = getTotal();

  const handleCheckout = () => {
    setIsOpen(false);
    window.location.href = "/cart";
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>

        <button className="text-slate-800 hover:text-fermion-blue transition-all duration-300 relative group">
          <ShoppingCart size={18} strokeWidth={1.5} />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-fermion-blue text-white text-[6px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white group-hover:scale-110 transition-transform">
              {items.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-white/95 backdrop-blur-xl border-l border-slate-100 flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-slate-50">
          <SheetTitle className="text-xl font-black tracking-tighter uppercase">Your Cart</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-slate-50 p-8 rounded-[3rem]">
                <ShoppingCart size={48} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-medium tracking-tight">Your cart is empty.</p>
              <SheetClose asChild>
                <Link href="/our-coffee">
                  <Button variant="outline" className="rounded-full px-8 border-slate-200 uppercase text-[10px] font-bold tracking-widest">Start Shopping</Button>
                </Link>
              </SheetClose>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item, index) => (
                <React.Fragment key={`${item.id}-${item.weight}`}>
                  <div className="flex gap-4 group">
                    <div className="w-20 h-20 rounded-3xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.weight} • {item.grind}</p>
                      <p className="text-xs font-semibold text-fermion-blue">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                      
                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center bg-slate-50 rounded-full border border-slate-100 px-1 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white rounded-full transition-colors"
                          >
                            <Minus size={12} className="text-slate-600" />
                          </button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white rounded-full transition-colors"
                          >
                            <Plus size={12} className="text-slate-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < items.length - 1 && <Separator className="bg-slate-50" />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="p-6 bg-slate-50/50 border-t border-slate-100 flex-col gap-4">
            <div className="space-y-1.5 w-full">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="text-slate-800 font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <p className="text-[10px] text-slate-400">Shipping calculated at checkout.</p>
            </div>
            <div className="flex gap-2 w-full">
              <SheetClose asChild>
                <Link href="/cart" className="flex-1">
                  <Button variant="outline" className="w-full h-14 rounded-3xl font-bold border-slate-200 uppercase text-[10px] tracking-widest">View Full Cart</Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/cart" className="flex-[1.5]">
                  <Button 
                    className="w-full bg-fermion-blue hover:bg-fermion-blue/90 text-white font-bold h-14 rounded-3xl shadow-xl shadow-fermion-blue/20 transition-all active:scale-[0.98] uppercase text-[10px] tracking-widest"
                  >
                    Checkout
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
