"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  Truck,
  CreditCard,
  Building2,
  Phone,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuthStore, useCartStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function B2BCheckoutPage() {
  const { user } = useAuthStore();
  const { items: allItems, removeItem, getTotal } = useCartStore();
  
  // Selective Checkout Logic
  const items = allItems.filter(i => i.selected !== false);

  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  
  const [customAddress, setCustomAddress] = useState({
    address: "",
    city: "",
    postal_code: "",
    notes: ""
  });

  const [couriers, setCouriers] = useState<any[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<any>(null);
  const [ratesLoading, setRatesLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetch(`/api/admin/partners?profileId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setPartner(data.find((p: any) => p.profile_id === user.id));
          setLoading(false);
          // Simulate fetching cargo rates
          mockFetchCargoRates();
        });
    }
  }, [user]);

  const mockFetchCargoRates = () => {
    setRatesLoading(true);
    setTimeout(() => {
      setCouriers([
        { courier_name: "JTR (JNE Trucking)", courier_service_code: "JTR", duration: "3-5 Days", price: 150000 },
        { courier_name: "J&T Cargo", courier_service_code: "CARGO", duration: "2-4 Days", price: 185000 }
      ]);
      setRatesLoading(false);
    }, 1500);
  };

  const handleCheckout = async () => {
    if (!selectedCourier) {
      toast.error("Please select a cargo method.");
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch("/api/payments/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: grandTotal,
          items: items.map(item => ({
            id: item.id,
            name: `${item.name} (${item.weight})`,
            price: item.price,
            quantity: item.quantity,
            grind: item.grind
          })),
          customerDetails: {
            name: partner?.company_name || user?.full_name,
            email: user?.email,
            phone: partner?.phone || "-"
          },
          metadata: {
            profileId: user?.id,
            shipping: {
              address: useDefaultAddress ? partner?.address : customAddress.address,
              city: useDefaultAddress ? partner?.city : customAddress.city,
              postal_code: useDefaultAddress ? partner?.postal_code : customAddress.postal_code,
              notes: customAddress.notes
            },
            shippingFee: shippingFee,
            courier: selectedCourier
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Procurement protocol initiated! Redirecting to payment...");
        
        // Remove only checked out items
        items.forEach(i => removeItem(i.id, i.weight, i.grind));
        
        // Redirect to Xendit
        window.location.href = data.invoiceUrl;
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to generate procurement invoice.");
      }
    } catch (e) {
      toast.error("Communication failure with Payment Gateway.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Initializing Checkout Protocol...</p>
    </div>
  );

  const subtotal = getTotal(true);
  const shippingFee = selectedCourier?.price || 0;
  const grandTotal = subtotal + shippingFee;
  
  const totalVolumeKg = items.reduce((acc, item) => {
    let weight = 0.25; 
    if (item.weight) {
      if (item.weight.toLowerCase().includes('kg')) weight = parseFloat(item.weight);
      else if (item.weight.toLowerCase().includes('g')) weight = parseFloat(item.weight) / 1000;
    }
    return acc + (weight * item.quantity);
  }, 0);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Initializing Checkout Protocol...</p>
    </div>
  );

  if (items.length === 0) {
    return (
      <div className="space-y-12 pb-20 text-center pt-20">
         <Package size={64} className="mx-auto text-slate-200" />
         <h1 className="display-font text-4xl font-black italic">No Specimens Selected.</h1>
         <p className="text-slate-500 font-medium">Please select items from the wholesale catalog before proceeding.</p>
         <Link href="/b2b/shop">
            <Button className="bg-slate-900 text-white rounded-2xl h-14 px-8 uppercase font-black tracking-widest text-[10px]">Return to Catalog</Button>
         </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="space-y-2 text-left">
        <div className="flex items-center gap-2">
           <span className="status-badge bg-periwinkle/10 text-periwinkle uppercase border border-periwinkle/20">Checkout_Protocol</span>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step 2 of 2</span>
        </div>
        <h1 className="display-font text-5xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">Order <br/> Finalization.</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: DESTINATION & CARGO */}
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-white border border-slate-100 rounded-[3rem] p-10 space-y-8 shadow-sm">
              <div className="flex items-center justify-between">
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Logistics Destination</h3>
                 <MapPin size={16} className="text-slate-300" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <button 
                  onClick={() => setUseDefaultAddress(true)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${useDefaultAddress ? 'border-periwinkle bg-periwinkle/5' : 'border-slate-100 hover:border-slate-300'}`}
                 >
                    <div className="flex items-center gap-3 mb-4">
                       <Building2 size={16} className={useDefaultAddress ? "text-periwinkle" : "text-slate-400"} />
                       <span className={`text-[10px] font-black uppercase tracking-widest ${useDefaultAddress ? "text-slate-900" : "text-slate-500"}`}>Default Cafe Address</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 mb-1">{partner?.company_name}</p>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{partner?.address || "Jl. Sudirman No. 1, Jakarta Selatan"}</p>
                 </button>

                 <button 
                  onClick={() => setUseDefaultAddress(false)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all flex flex-col justify-center ${!useDefaultAddress ? 'border-periwinkle bg-periwinkle/5' : 'border-slate-100 hover:border-slate-300'}`}
                 >
                    <div className="flex items-center gap-3 mb-2">
                       <Truck size={16} className={!useDefaultAddress ? "text-periwinkle" : "text-slate-400"} />
                       <span className={`text-[10px] font-black uppercase tracking-widest ${!useDefaultAddress ? "text-slate-900" : "text-slate-500"}`}>Custom Branch / WH</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">Deliver this specific batch to a different location.</p>
                 </button>
              </div>

              <AnimatePresence>
                 {!useDefaultAddress && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4 border-t border-slate-50"
                    >
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Custom Delivery Address</label>
                          <Input placeholder="Full street address..." className="h-12 bg-slate-50 border-none font-bold text-xs rounded-xl" />
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>

           <div className="bg-white border border-slate-100 rounded-[3rem] p-10 space-y-8 shadow-sm">
              <div className="flex items-center justify-between">
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Cargo Selection</h3>
                 {ratesLoading && <Loader2 size={16} className="text-periwinkle animate-spin" />}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {couriers.map(courier => {
                    const isSelected = selectedCourier?.courier_name === courier.courier_name && 
                                     selectedCourier?.courier_service_code === courier.courier_service_code;
                    return (
                      <button 
                        key={`${courier.courier_name}-${courier.courier_service_code}`}
                        onClick={() => setSelectedCourier(courier)}
                        className={`p-6 rounded-2xl border-2 text-left transition-all relative ${isSelected ? 'border-periwinkle bg-periwinkle/5' : 'border-slate-100 hover:border-slate-300'}`}
                      >
                        {isSelected && <CheckCircle2 size={16} className="absolute top-4 right-4 text-periwinkle" />}
                        <h4 className="font-black italic uppercase text-slate-900 mb-1">{courier.courier_name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Est. {courier.duration}</p>
                        <p className="text-sm font-black text-periwinkle font-mono">Rp {courier.price.toLocaleString('id-ID')}</p>
                      </button>
                    );
                 })}
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: MONOSPACE MATRIX & PAYMENT */}
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-slate-950 text-white rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-periwinkle/10 blur-3xl -mr-32 -mt-32" />
              <div className="space-y-8 relative z-10">
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-6">Selected Matrix</h3>
                 
                 <div className="space-y-4">
                    {items.map(item => (
                       <div key={item.id} className="flex justify-between items-start border-b border-white/10 pb-4">
                          <div className="space-y-1">
                             <p className="font-black uppercase italic text-sm text-slate-200">{item.name}</p>
                             <p className="text-[10px] font-bold text-slate-500 font-mono">{item.quantity} UNIT x Rp {item.price.toLocaleString('id-ID')}</p>
                          </div>
                          <p className="font-black font-mono text-white">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                       </div>
                    ))}
                 </div>

                 <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex items-start gap-3">
                    <Info size={16} className="text-periwinkle mt-0.5 shrink-0" />
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
                       This purchase of <span className="text-white">{totalVolumeKg}KG</span> will be added to your monthly accumulation.
                    </p>
                 </div>

                 <div className="space-y-4 pt-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                       <span>Selected Subtotal</span>
                       <span className="font-mono text-slate-300">Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-lg font-black uppercase italic text-white pt-4 border-t border-white/20">
                       <span>Net Settlement</span>
                       <span className="font-mono text-periwinkle">Rp {grandTotal.toLocaleString('id-ID')}</span>
                    </div>
                 </div>

                 <Button 
                   onClick={handleCheckout}
                   disabled={processing || !selectedCourier}
                   className="w-full h-16 bg-white text-slate-950 font-black uppercase tracking-[0.2em] italic text-[10px] rounded-2xl hover:bg-periwinkle hover:text-white transition-all shadow-xl"
                 >
                    {processing ? <Loader2 className="animate-spin" /> : "Finalize & Pay Invoice"}
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
