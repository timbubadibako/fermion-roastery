"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore, useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1); // 1: Cart, 2: Shipping, 3: Processing
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const [shippingData, setShippingData] = useState({
    name: user?.full_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    notes: ""
  });

  const mockCouriers = [
    { id: 'jne_reg', name: 'JNE Reguler', price: 25000, est: '2-3 Hari' },
    { id: 'sicepat_best', name: 'SiCepat BEST', price: 35000, est: '1 Hari' },
    { id: 'paxel_same', name: 'Paxel Same Day', price: 45000, est: 'Hari Ini' },
  ];
  
  const [selectedCourier, setSelectedCourier] = useState(mockCouriers[0]);

  const subtotal = getTotal();
  const shippingFee = subtotal > 500000 || subtotal === 0 ? 0 : selectedCourier.price;
  const total = subtotal + shippingFee;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Reverse geocoding using Nominatim (OpenStreetMap)
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await res.json();
          
          if (data && data.address) {
            setShippingData(prev => ({
              ...prev,
              address: data.display_name || prev.address,
              city: data.address.city || data.address.town || data.address.county || prev.city,
              postal_code: data.address.postcode || prev.postal_code
            }));
            toast.success("Location pinned successfully!");
          }
        } catch (error) {
          toast.error("Failed to fetch address from location.");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        toast.error("Unable to retrieve your location.");
        setLocationLoading(false);
      }
    );
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const checkoutItems = items.map(item => ({
        name: `${item.name} (${item.weight})`,
        quantity: item.quantity,
        price: item.price
      }));

      const customerDetails = { 
        email: shippingData.email,
        name: shippingData.name,
        phone: shippingData.phone
      };

      const res = await fetch("http://localhost:3001/api/payments/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: total, 
          items: checkoutItems, 
          customerDetails,
          metadata: { 
            shipping: shippingData,
            profileId: user?.id || null,
            shippingFee: shippingFee
          }
        }),
      });

      const data = await res.json();

      if (res.ok && data.invoiceUrl) {
        window.location.href = data.invoiceUrl;
      } else {
        toast.error(data.message || "Failed to generate checkout invoice");
        setLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Network error during checkout.");
      setLoading(false);
    }
  };

  if (items.length === 0 && step === 1) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen pt-40 pb-40 flex flex-col items-center justify-center px-6 text-center">
         <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
            <ShoppingBag size={32} className="text-slate-200" />
         </div>
         <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic mb-4">Your cart is empty</h1>
         <p className="text-slate-500 mb-10 max-w-xs font-medium">Add some artisan beans to your ritual to get started.</p>
         <Link href="/our-coffee">
           <Button className="bg-slate-900 text-white font-black tracking-widest px-10 h-16 rounded-2xl uppercase italic">Explore Coffee</Button>
         </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-40 pb-40 px-6">
      <div className="max-w-6xl mx-auto md:px-12">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-20">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-slate-900" : "text-slate-300"}`}>
             <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${step >= 1 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200"}`}>1</span>
             <span className="text-[10px] font-black uppercase tracking-widest">Review Cart</span>
          </div>
          <div className="w-12 h-px bg-slate-200" />
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-slate-900" : "text-slate-300"}`}>
             <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${step >= 2 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200"}`}>2</span>
             <span className="text-[10px] font-black uppercase tracking-widest">Shipping</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="cart"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-10"
                >
                  <div className="hidden md:grid grid-cols-12 pb-6 border-b border-slate-100 text-[10px] font-black text-slate-400 tracking-widest uppercase">
                    <div className="col-span-6">Product Details</div>
                    <div className="col-span-2 text-center">Unit Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>

                  {items.map((item) => (
                    <div key={`${item.id}-${item.weight}`} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center group">
                      <div className="col-span-1 md:col-span-6 flex items-center gap-6">
                        <div className="relative w-24 h-24 bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1 text-left">
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.weight} • {item.grind}</p>
                          <button onClick={() => removeItem(item.id)} className="text-[9px] font-bold text-red-400 hover:text-red-600 transition-colors uppercase pt-2 flex items-center gap-1.5"><Trash2 size={10} /> Remove</button>
                        </div>
                      </div>
                      <div className="hidden md:block col-span-2 text-center font-mono text-xs font-bold text-slate-600">Rp {item.price.toLocaleString('id-ID')}</div>
                      <div className="col-span-1 md:col-span-2 flex justify-center">
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-lg"><Minus size={12}/></button>
                          <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-lg"><Plus size={12}/></button>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 text-right font-mono text-sm font-black text-slate-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-10"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Shipping Address</h2>
                    <p className="text-xs text-slate-400 font-medium">Where should we send your fresh roast?</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recipient Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input placeholder="Full Name" className="h-14 pl-12 bg-slate-50 border-none rounded-2xl text-sm font-bold" value={shippingData.name} onChange={(e) => setShippingData({...shippingData, name: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <Input type="email" placeholder="name@example.com" className="h-14 px-6 bg-slate-50 border-none rounded-2xl text-sm font-bold" value={shippingData.email} onChange={(e) => setShippingData({...shippingData, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp / Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input placeholder="+62 ..." className="h-14 pl-12 bg-slate-50 border-none rounded-2xl text-sm font-bold" value={shippingData.phone} onChange={(e) => setShippingData({...shippingData, phone: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City / Regency</label>
                      <Input placeholder="e.g. Jakarta Selatan" className="h-14 px-6 bg-slate-50 border-none rounded-2xl text-sm font-bold" value={shippingData.city} onChange={(e) => setShippingData({...shippingData, city: e.target.value})} />
                    </div>
                    
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Delivery Address</label>
                         <button 
                          onClick={handleGetLocation} 
                          disabled={locationLoading}
                          className="flex items-center gap-1.5 text-[9px] font-bold text-fermion-blue hover:text-slate-900 transition-colors uppercase tracking-widest bg-fermion-blue/10 px-3 py-1.5 rounded-full"
                         >
                           {locationLoading ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
                           Use Current Location
                         </button>
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input placeholder="Street, Building, House No." className="h-14 pl-12 bg-slate-50 border-none rounded-2xl text-sm font-bold" value={shippingData.address} onChange={(e) => setShippingData({...shippingData, address: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Postal Code</label>
                      <Input placeholder="12345" className="h-14 px-6 bg-slate-50 border-none rounded-2xl text-sm font-bold font-mono" value={shippingData.postal_code} onChange={(e) => setShippingData({...shippingData, postal_code: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes / Patokan</label>
                      <Input placeholder="Pagar hitam, sebelah warung..." className="h-14 px-6 bg-slate-50 border-none rounded-2xl text-sm font-bold" value={shippingData.notes} onChange={(e) => setShippingData({...shippingData, notes: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-50">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Courier</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {mockCouriers.map(courier => (
                        <button 
                          key={courier.id}
                          onClick={() => setSelectedCourier(courier)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedCourier.id === courier.id ? 'border-fermion-blue bg-fermion-blue/5' : 'border-slate-100 hover:border-slate-300'}`}
                        >
                          <p className="text-xs font-black uppercase tracking-widest text-slate-900">{courier.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Est: {courier.est}</p>
                          <p className="text-sm font-mono font-bold text-fermion-blue mt-2">Rp {courier.price.toLocaleString('id-ID')}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button onClick={() => setStep(1)} className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em] flex items-center gap-2">← Back to review</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl space-y-8 sticky top-32">
            <h2 className="text-xl font-black tracking-tighter uppercase italic">Order Summary</h2>
            <div className="space-y-4">
               <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="font-mono">Rp {subtotal.toLocaleString('id-ID')}</span>
               </div>
               <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span className="uppercase tracking-widest text-[10px]">Shipping</span>
                  <span className="font-mono">{shippingFee === 0 ? "FREE" : `Rp ${shippingFee.toLocaleString('id-ID')}`}</span>
               </div>
               <Separator className="bg-slate-50" />
               <div className="flex justify-between text-lg font-black text-slate-900 pt-2">
                  <span className="uppercase tracking-tighter italic text-fermion-blue">Grand Total</span>
                  <span className="font-mono">Rp {total.toLocaleString('id-ID')}</span>
               </div>
            </div>

            {step === 1 ? (
              <Button onClick={() => setStep(2)} className="w-full h-16 bg-slate-900 text-white font-black tracking-[0.2em] rounded-2xl hover:bg-fermion-blue transition-all duration-500 shadow-xl uppercase italic group">
                Shipping Details <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button 
                onClick={handleCheckout} 
                disabled={loading || !shippingData.name || !shippingData.email || !shippingData.address || !shippingData.phone}
                className="w-full h-16 bg-fermion-blue text-white font-black tracking-[0.2em] rounded-2xl hover:bg-slate-900 transition-all duration-500 shadow-xl uppercase italic group"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Pay via Xendit <CheckCircle2 size={16} className="ml-2" /></>}
              </Button>
            )}
            
            <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-widest px-4 leading-relaxed">
               Artisan Quality • Direct Sourcing <br/> Secured by Xendit SSL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
