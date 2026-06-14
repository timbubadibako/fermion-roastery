"use client";

import React, { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose,
  SheetOverlay
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore, useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const router = useRouter();
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, toggleSelection, getTotal } = useCartStore();
  const { user } = useAuthStore();

  // Subtotal for SELECTED items only (default to true if undefined)
  const selectedItems = items.filter(i => i.selected !== false);
  const selectedTotal = getTotal(true);
  const selectedCount = selectedItems.reduce((acc, i) => acc + i.quantity, 0);

  const handleCheckout = () => {
    if (selectedCount === 0) {
      toast.error("Please select at least one item to checkout.");
      return;
    }
    setIsOpen(false);
    const checkoutPath = user?.role === 'B2B' ? "/b2b/checkout" : "/cart";
    router.push(checkoutPath);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="text-slate-800 hover:text-fermion-french-blue transition-all duration-300 relative group z-[200]">
          <ShoppingCart size={18} strokeWidth={1.5} />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-fermion-french-blue text-white text-[6px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white group-hover:scale-110 transition-transform">
              {items.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>
      </SheetTrigger>
      
      {/* Explicitly high z-index for Overlay and Content */}
      <SheetContent 
        className="w-full sm:max-w-md bg-white/95 backdrop-blur-xl border-l border-slate-100 flex flex-col p-0 z-[300]"
        overlayClassName="z-[250] bg-slate-950/40"
      >
        <SheetHeader className="p-6 border-b border-slate-50">
          <SheetTitle className="text-xl font-black tracking-tighter uppercase">Your Ritual</SheetTitle>
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
                <React.Fragment key={`${item.id}-${item.weight}-${item.grind}`}>
                  <div className={cn(
                    "flex gap-4 group transition-all",
                    item.selected === false && "opacity-60 grayscale-[0.5]"
                  )}>
                    {/* Selection Toggle - Variant Aware */}
                    <button 
                      onClick={() => toggleSelection(item.id, item.weight, item.grind)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-7 shrink-0",
                        item.selected !== false 
                          ? "bg-fermion-french-blue border-fermion-french-blue text-white shadow-lg shadow-fermion-french-blue/20" 
                          : "border-slate-200 hover:border-slate-400 bg-white"
                      )}
                    >
                      {item.selected !== false && <CheckCircle2 size={12} />}
                    </button>

                    <div className="w-20 h-20 rounded-3xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">{item.name}</h4>
                        <button 
                          onClick={() => removeItem(item.id, item.weight, item.grind)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.weight} • {item.grind}</p>
                      <p className="text-xs font-semibold text-fermion-french-blue">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                      
                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center bg-slate-50 rounded-full border border-slate-100 px-1 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.weight, item.grind, item.quantity - 1)}
                            className="p-1 hover:bg-white rounded-full transition-colors"
                          >
                            <Minus size={12} className="text-slate-600" />
                          </button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.weight, item.grind, item.quantity + 1)}
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
                <span className="text-slate-500 font-medium uppercase tracking-widest text-[9px] font-black">Selected Subtotal ({selectedCount})</span>
                <span className="text-slate-800 font-black italic">Rp {selectedTotal.toLocaleString('id-ID')}</span>
              </div>
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider italic">Proceed to checkout with selected items.</p>
            </div>
            <div className="flex gap-2 w-full">
              <SheetClose asChild>
                <Link href={user?.role === 'B2B' ? '/b2b/checkout' : '/cart'} className="flex-1">
                  <Button variant="outline" className="w-full h-14 rounded-3xl font-bold border-slate-200 uppercase text-[10px] tracking-widest">View Full Cart</Button>
                </Link>
              </SheetClose>
              <Button 
                onClick={handleCheckout}
                disabled={selectedCount === 0}
                className="flex-[1.5] bg-fermion-french-blue hover:bg-fermion-french-blue/90 text-white font-bold h-14 rounded-3xl shadow-xl shadow-fermion-french-blue/20 transition-all active:scale-[0.98] uppercase text-[10px] tracking-widest"
              >
                Checkout
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
