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
import { ShoppingCart, Minus, Plus, Trash2, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore, useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CartSheet({ isScrolled = true }: { isScrolled?: boolean }) {
  const router = useRouter();
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, toggleSelection, getTotal, ensureIds } = useCartStore();
  const { user } = useAuthStore();

  // Migration: Ensure all existing items have unique IDs
  React.useEffect(() => {
    ensureIds();
  }, [ensureIds]);

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
        <button className={`${isScrolled ? 'text-stone-900' : 'text-stone-400'} hover:text-[#367F4D] transition-all duration-300 relative group z-[200]`}>
          <ShoppingCart size={18} strokeWidth={2.2} />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#367F4D] text-white text-[7px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white group-hover:scale-110 transition-transform">
              {items.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>
      </SheetTrigger>
      
      <SheetContent 
        className="w-full sm:max-w-md bg-[#FDFBF7] border-l border-black/5 flex flex-col p-0 z-[300]"
        overlayClassName="z-[250] bg-black/10 backdrop-blur-[2px]"
      >
        <div className="absolute top-[-10px] left-[-10px] w-12 h-4 bg-white/60 border border-black/5 rotate-[-15deg] z-50 backdrop-blur-sm shadow-sm"></div>

        <SheetHeader className="p-8 border-b border-black/5">
          <SheetTitle className="text-[10px] font-black tracking-[0.4em] uppercase text-stone-400 italic">Current Selection</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-16 h-16 border border-black/5 rounded-sm flex items-center justify-center">
                <ShoppingCart size={24} className="text-stone-300" />
              </div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest italic">Cart is empty.</p>
              <SheetClose asChild>
                <Link href="/our-coffee">
                  <Button variant="ghost" className="rounded-sm border border-black/10 uppercase text-[9px] font-black tracking-widest">Explore Specimens</Button>
                </Link>
              </SheetClose>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                  <div key={item.lineItemId} className={cn("flex gap-4 p-4 bg-white border border-black/5 shadow-sm rounded-sm transition-all", item.selected === false && "opacity-50 grayscale")}>
                    
                    <button 
                      onClick={() => toggleSelection(item.lineItemId)}
                      className={cn(
                        "w-5 h-5 rounded-sm border border-black/10 flex items-center justify-center transition-all mt-1",
                        item.selected !== false ? "bg-[#367F4D] text-white" : "bg-white"
                      )}
                    >
                      {item.selected !== false && <Check size={10} />}
                    </button>

                    <div className="w-16 h-20 bg-stone-50 overflow-hidden border border-black/5 rounded-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 leading-tight">{item.name}</h4>
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{item.weight} • {item.grind}</p>
                      <p className="text-[11px] font-bold text-stone-900">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                      
                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center border border-black/5 rounded-sm px-1 py-0.5">
                          <button onClick={() => updateQuantity(item.lineItemId, item.quantity - 1)} className="p-1 hover:bg-stone-50"><Minus size={10} /></button>
                          <span className="text-[10px] font-black w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.lineItemId, item.quantity + 1)} className="p-1 hover:bg-stone-50"><Plus size={10} /></button>
                        </div>
                        <button onClick={() => removeItem(item.lineItemId)} className="text-stone-300 hover:text-red-500 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="p-8 bg-white border-t border-black/5 flex-col gap-4">
            <div className="flex justify-between items-center w-full">
               <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">Subtotal ({selectedCount})</span>
               <span className="text-xl font-bold text-slate-900">Rp {selectedTotal.toLocaleString('id-ID')}</span>
            </div>
            
            <Button 
              id="tour-checkout-btn"
              onClick={handleCheckout}
              disabled={selectedCount === 0}
              className="w-full h-14 bg-stone-900 text-white font-black uppercase tracking-widest text-[10px] rounded-sm transition-all hover:bg-[#367F4D] hover:-translate-y-1 active:scale-95"
            >
              Confirm Checkout
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
