"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Minus, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  User, 
  Loader2,
  CheckCircle2,
  MapPinIcon,
  Navigation,
  Globe,
  Truck,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore, useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items: allItems, updateQuantity, removeItem, toggleSelection, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [areaSearchLoading, setAreaSearchLoading] = useState(false);
  
  const items = allItems.filter(i => i.selected !== false);

  const [shippingData, setShippingData] = useState({
    name: user?.full_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    notes: "",
    area_id: ""
  });

  const [areas, setAreas] = useState<any[]>([]);
  const [showAreas, setShowAreas] = useState(false);
  const [couriers, setCouriers] = useState<any[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter(); 

  useEffect(() => {
    setMounted(true);
    if (user?.role === 'B2B') {
      router.replace('/b2b/checkout');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const res = await fetch(`/api/auth/profile/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setShippingData(prev => ({
              ...prev,
              name: data.full_name || prev.name,
              email: data.email || prev.email,
              phone: data.phone || "",
              address: data.address || "",
              city: data.city || "",
              postal_code: data.postal_code || ""
            }));
          }
        } catch (e) {
          console.error("Failed to auto-fill address");
        }
      };
      fetchProfile();
    }
  }, [user]);

  // Fetch rates when area_id changes
  useEffect(() => {
    if (items.length > 0 && shippingData.area_id) {
      fetchRates(shippingData.area_id);
    }
  }, [shippingData.area_id, items.length]);

  const fetchAreas = async (input: string) => {
    if (input.length < 3) {
      setAreas([]);
      return;
    }
    setAreaSearchLoading(true);
    try {
      const res = await fetch(`/api/shipping/areas?input=${encodeURIComponent(input)}`);
      if (res.ok) {
        const data = await res.json();
        setAreas(data);
        setShowAreas(true);
      }
    } catch (error) {
      console.error("Area search error:", error);
    } finally {
      setAreaSearchLoading(false);
    }
  };

  const fetchRates = async (areaId: string) => {
    setRatesLoading(true);
    try {
      const res = await fetch("/api/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination_area_id: areaId,
          items: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            weight: 250 // Assumption
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCouriers(data);
        if (data.length > 0) setSelectedCourier(data[0]);
      }
    } catch (e) {
      toast.error("Failed to fetch shipping rates from Biteship.");
    } finally {
      setRatesLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedCourier) {
      toast.error("Please select a shipping method.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/payments/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          items: items.map(item => ({
            id: item.id,
            name: `${item.name} (${item.weight})`,
            price: item.price,
            quantity: item.quantity,
            grind: item.grind
          })),
          customerDetails: {
            name: shippingData.name,
            email: shippingData.email,
            phone: shippingData.phone
          },
          metadata: {
            profileId: user?.id,
            shipping: {
              address: shippingData.address,
              city: shippingData.city,
              postal_code: shippingData.postal_code,
              area_id: shippingData.area_id,
              notes: shippingData.notes
            },
            shippingFee: shippingFee,
            courier: selectedCourier
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Order protocol initiated! Redirecting to payment...");
        
        // Remove only checked out items
        items.forEach(i => removeItem(i.id, i.weight, i.grind));
        
        // Redirect to Xendit
        window.location.href = data.invoiceUrl;
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to generate payment invoice.");
      }
    } catch (e) {
      toast.error("Communication failure with Payment Gateway.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotal(true);
  const shippingFee = selectedCourier?.price || 0;
  const total = subtotal + shippingFee;

  if (mounted && items.length === 0 && step === 1) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen pt-40 pb-40 flex flex-col items-center justify-center px-6 text-center relative z-10">
         <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
            <ShoppingBag size={32} className="text-slate-200" />
         </div>
         <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic mb-4">No Items Selected</h1>
         <p className="text-slate-500 mb-10 max-w-xs font-medium">Please select items from your ritual cart to proceed with the checkout protocol.</p>
         <Link href="/our-coffee">
           <Button className="bg-slate-900 text-white font-black tracking-widest px-10 h-16 rounded-2xl uppercase italic">Explore Coffee</Button>
         </Link>
      </div>
    );
  }

  if (!mounted) return null;

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-40 pb-40 px-6 relative z-10">
      {user?.role === 'ADMIN' && (
        <div className="max-w-6xl mx-auto mb-10 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-center text-amber-700 text-[10px] font-black uppercase tracking-widest text-center shadow-sm">
          Warning: You are logged in as Admin. This checkout will be simulated and will not deduct live inventory unless recorded in the Manual Ledger.
        </div>
      )}
      
      <div className="max-w-6xl mx-auto md:px-12">
        <div className="flex items-center justify-center gap-4 mb-20">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-slate-900" : "text-slate-300"}`}>
             <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${step >= 1 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200"}`}>1</div>
             <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Review Ritual</span>
          </div>
          <div className="w-12 h-px bg-slate-100" />
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-slate-900" : "text-slate-300"}`}>
             <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${step >= 2 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200"}`}>2</div>
             <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Dispatch Info</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8 space-y-10">
                <h2 className="display-font text-4xl font-black italic tracking-tighter text-slate-900 uppercase">Selected Specimens.</h2>
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.weight}-${item.grind}`} className="flex gap-6 pb-8 border-b border-slate-100 group">
                      <div className="w-24 h-24 bg-white rounded-3xl overflow-hidden border border-slate-50 flex-shrink-0 group-hover:shadow-lg transition-all">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                         <div className="flex justify-between items-start">
                            <div>
                               <h4 className="text-lg font-black uppercase italic tracking-tight text-slate-900">{item.name}</h4>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.weight} • {item.grind}</p>
                            </div>
                            <button onClick={() => removeItem(item.id, item.weight, item.grind)} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                         </div>
                         <div className="flex justify-between items-end">
                            <div className="flex items-center bg-white border border-slate-100 rounded-full px-1.5 py-1">
                               <button onClick={() => updateQuantity(item.id, item.weight, item.grind, item.quantity - 1)} className="p-1 hover:bg-slate-50 rounded-full"><Minus size={14}/></button>
                               <span className="w-10 text-center text-sm font-black italic">{item.quantity}</span>
                               <button onClick={() => updateQuantity(item.id, item.weight, item.grind, item.quantity + 1)} className="p-1 hover:bg-slate-50 rounded-full"><Plus size={14}/></button>
                            </div>
                            <p className="text-lg font-black italic tracking-tight text-slate-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-10">
                  <Link href="/our-coffee" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-2">
                    <ArrowLeft size={14}/> Back to Selection
                  </Link>
                  <Button onClick={() => setStep(2)} className="h-16 px-12 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest italic shadow-2xl hover:bg-fermion-french-blue transition-all">
                    Continue to Dispatch <ArrowRight className="ml-2" size={16}/>
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8 sticky top-32">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ledger Summary</h3>
                   <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-500 font-medium">Specimen Subtotal</span>
                         <span className="text-slate-900 font-black italic tracking-tight">Rp {subtotal.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-500 font-medium">Logistics Protocol</span>
                         <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">TBD</span>
                      </div>
                      <Separator className="bg-slate-50" />
                      <div className="flex justify-between text-xl pt-2">
                         <span className="display-font font-black italic text-slate-900 uppercase">Total</span>
                         <span className="font-black italic text-slate-900 tracking-tighter">Rp {subtotal.toLocaleString('id-ID')}</span>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8 space-y-12">
                 <h2 className="display-font text-4xl font-black italic tracking-tighter text-slate-900 uppercase">Dispatch Info.</h2>
                 
                 <div className="space-y-10">
                    {/* Identification */}
                    <div className="space-y-6">
                       <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                          <User size={18} className="text-slate-400" />
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Identification</h3>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                             <Input required value={shippingData.name} onChange={e => setShippingData({...shippingData, name: e.target.value})} className="h-14 bg-white border-slate-100 font-bold rounded-2xl" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">WhatsApp Number</label>
                             <Input required value={shippingData.phone} onChange={e => setShippingData({...shippingData, phone: e.target.value})} placeholder="0812..." className="h-14 bg-white border-slate-100 font-bold rounded-2xl" />
                          </div>
                       </div>
                    </div>

                    {/* Logistics Destination */}
                    <div className="space-y-6">
                       <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                          <MapPin size={18} className="text-slate-400" />
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Logistics Destination</h3>
                       </div>
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Full street address</label>
                             <textarea required value={shippingData.address} onChange={e => setShippingData({...shippingData, address: e.target.value})} className="w-full h-24 bg-white border border-slate-100 rounded-2xl p-4 text-sm font-bold resize-none" placeholder="Jl. Sudirman No..." />
                          </div>

                          <div className="relative">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Search City or Area (Biteship)</label>
                            <div className="relative">
                              <Input 
                                placeholder="Ketik minimal 3 huruf..." 
                                className="h-14 bg-white border-slate-100 font-bold rounded-2xl pl-12" 
                                onChange={(e) => fetchAreas(e.target.value)}
                              />
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              {areaSearchLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-periwinkle" size={18} />}
                            </div>

                            <AnimatePresence>
                              {showAreas && areas.length > 0 && (
                                <motion.div 
                                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                  className="absolute z-[100] w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto no-scrollbar"
                                >
                                  {areas.map(area => (
                                    <button 
                                      key={area.id}
                                      onClick={() => {
                                        setShippingData({...shippingData, city: area.name, area_id: area.id, postal_code: area.postal_code?.toString() || ""});
                                        setAreas([]);
                                        setShowAreas(false);
                                      }}
                                      className="w-full p-4 text-left hover:bg-slate-50 border-b border-slate-50 last:border-none transition-colors"
                                    >
                                      <p className="text-xs font-black text-slate-900 uppercase italic">{area.name}</p>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{area.administrative_division_level_1_name}, {area.administrative_division_level_2_name}</p>
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Selected City</label>
                                <Input disabled value={shippingData.city} className="h-14 bg-slate-50 border-none font-bold rounded-2xl text-slate-400" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Postal Code</label>
                                <Input required value={shippingData.postal_code} onChange={e => setShippingData({...shippingData, postal_code: e.target.value})} placeholder="12345" className="h-14 bg-white border-slate-100 font-bold rounded-2xl font-mono" />
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Cargo Selection */}
                    <div className="space-y-6">
                       <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                          <Truck size={18} className="text-slate-400" />
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Cargo Selection</h3>
                          {ratesLoading && <Loader2 className="animate-spin text-periwinkle" size={14} />}
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {couriers.length === 0 && !ratesLoading ? (
                             <p className="col-span-2 text-[10px] font-black uppercase text-slate-300 italic p-10 bg-white border border-dashed border-slate-100 rounded-3xl text-center">
                               Select a city to calculate laboratory logistics
                             </p>
                          ) : (
                            couriers.map(courier => {
                              const isSelected = selectedCourier?.courier_code === courier.courier_code && 
                                               selectedCourier?.courier_service_code === courier.courier_service_code;
                              return (
                                <button 
                                  key={`${courier.courier_code}-${courier.courier_service_code}`}
                                  onClick={() => setSelectedCourier(courier)}
                                  className={`p-6 rounded-2xl border-2 text-left transition-all ${isSelected ? 'border-fermion-french-blue bg-blue-50/30' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                                >
                                   <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-black uppercase italic text-sm text-slate-900">{courier.courier_name} {courier.courier_service_name}</h4>
                                      {isSelected && <CheckCircle2 size={16} className="text-fermion-french-blue" />}
                                   </div>
                                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{courier.duration}</p>
                                   <p className="text-sm font-black text-slate-900 mt-2">Rp {courier.price.toLocaleString('id-ID')}</p>
                                </button>
                              );
                            })
                          )}
                       </div>
                    </div>
                 </div>

                 <div className="flex justify-between items-center pt-10">
                    <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-2">
                       <ArrowLeft size={14}/> Back to Ritual
                    </button>
                    <Button onClick={handleCheckout} disabled={loading || !selectedCourier} className="h-16 px-12 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest italic shadow-2xl hover:bg-fermion-french-blue transition-all">
                       {loading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Finalize Protocol <ArrowRight size={16}/></span>}
                    </Button>
                 </div>
              </div>

              <div className="lg:col-span-4">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8 sticky top-32">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Order Settlement</h3>
                   <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-500 font-medium">Specimens</span>
                         <span className="text-slate-900 font-black italic">Rp {subtotal.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-500 font-medium">Logistics</span>
                         <span className="text-slate-900 font-black italic">{selectedCourier ? `Rp ${shippingFee.toLocaleString('id-ID')}` : 'PENDING'}</span>
                      </div>
                      <Separator className="bg-slate-50" />
                      <div className="flex justify-between text-xl pt-2">
                         <span className="display-font font-black italic text-slate-900 uppercase">Total</span>
                         <span className="font-black italic text-slate-900 tracking-tighter">Rp {total.toLocaleString('id-ID')}</span>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-32 text-center space-y-8">
               <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
                  <CheckCircle2 size={40} />
               </div>
               <div className="space-y-4">
                  <h2 className="display-font text-5xl font-black italic tracking-tighter text-slate-900">Success.</h2>
                  <p className="text-slate-500 font-medium max-w-md">Your coffee specimens have been registered for roasting. You will receive a notification once the ritual begins.</p>
               </div>
               <Link href="/account">
                  <Button className="bg-slate-900 text-white font-black uppercase tracking-widest px-10 h-16 rounded-2xl italic">View My Rituals</Button>
               </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
