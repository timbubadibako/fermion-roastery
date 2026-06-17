"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus, Plus, Trash2, ArrowLeft, ArrowRight,
  ShoppingBag, MapPin, Loader2,
  Truck, Search, CheckCircle2, User, Phone, Globe, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore, useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { AddressInput } from "@/components/address-input";

export default function CartPage() {
  const { items: allItems, updateQuantity, removeItem, getTotal, clearCart, ensureIds } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ratesLoading, setRatesLoading] = useState(false);

  // Migration: Ensure all existing items have unique IDs
  useEffect(() => {
    ensureIds();
  }, [ensureIds]);

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
              postal_code: data.postal_code || "",
              area_id: data.area_id || ""
            }));
          }
        } catch (e) {
          console.error("Failed to auto-fill address");
        }
      };
      fetchProfile();
    }
  }, [user]);

  const [addresses, setAddresses] = useState<any[]>([]);

  // Fetch presets on load
  useEffect(() => {
    if (user) {
      const fetchAddresses = async () => {
        try {
          const res = await fetch(`/api/auth/profile/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            console.log("Profile data:", data);
            if (data.addresses_json) {
              console.log("Addresses found:", data.addresses_json);
              setAddresses(data.addresses_json);
            } else {
              console.log("No addresses_json found in profile data.");
            }
          }
        } catch (e) { console.error("Failed to fetch addresses", e); }
      };
      fetchAddresses();
    }
  }, [user]);

  const selectAddress = (addr: any) => {
    setShippingData(prev => ({
      ...prev,
      name: addr.name || prev.name,
      phone: addr.phone || prev.phone,
      address: addr.address,
      city: addr.city,
      postal_code: addr.postalCode,
      area_id: addr.area_id
    }));
  };

  // Fetch rates when area_id changes
  useEffect(() => {
    if (items.length > 0 && shippingData.area_id) {
      fetchRates(shippingData.area_id);
    }
  }, [shippingData.area_id, items.length]);

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
            weight: 250
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCouriers(data);
        if (data.length > 0) setSelectedCourier(data[0]);
      }
    } catch (e) {
      toast.error("Gagal mengambil tarif pengiriman.");
    } finally {
      setRatesLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedCourier) {
      toast.error("Pilih metode pengiriman terlebih dahulu.");
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
            name: `${item.name} (250g)`,
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
        toast.success("Pesanan dibuat! Mengalihkan ke pembayaran...");
        
        // Save only the lineItemIds of selected items to localStorage
        const lineItemIdsToRemove = items.map(item => item.lineItemId);
        localStorage.setItem('purchasedLineItemIds', JSON.stringify(lineItemIdsToRemove));
        
        window.location.href = data.invoiceUrl;
      } else {
        const errorRes = await res.json();
        toast.error(errorRes.message || "Gagal membuat invoice.");
      }
    } catch (e) {
      toast.error("Gagal terhubung ke Payment Gateway.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotal(true);
  const shippingFee = selectedCourier?.price || 0;
  const total = subtotal + shippingFee;

  if (!mounted) return null;

  if (items.length === 0 && step === 1) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen pt-40 pb-40 flex flex-col items-center justify-center px-6 text-center relative z-10">
        <div className="w-24 h-24 bg-white border border-black/5 flex items-center justify-center mb-8 shadow-sm">
          <ShoppingBag size={32} className="text-stone-300" />
        </div>
        <h1 className="text-3xl font-cloude tracking-tighter text-slate-900 uppercase italic mb-4">Keranjang Kosong</h1>
        <Link href="/our-coffee">
          <Button className="bg-stone-900 text-white font-black tracking-widest px-10 h-16 rounded-sm uppercase italic hover:bg-[#367F4D]">Lihat Produk</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-40 pb-40 px-6 relative z-10">

      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <div className="max-w-6xl mx-auto md:px-12 relative z-10">
        <div className="flex items-center justify-center gap-4 mb-20">
          <span className={`text-[10px] font-black uppercase tracking-widest ${step === 1 ? "text-slate-900" : "text-stone-400"}`}>01 Review</span>
          <div className="w-12 h-px bg-black/10" />
          <span className={`text-[10px] font-black uppercase tracking-widest ${step === 2 ? "text-slate-900" : "text-stone-400"}`}>02 Shipping</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-2 mb-12">
                <h2 className="text-5xl font-cloude italic tracking-tighter text-slate-900 uppercase leading-none">Daftar Produk<span className="text-[#367F4D]">.</span></h2>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Specimen selection for your next ritual</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-8 space-y-12">
                  <div className="space-y-6">
                    {items.map((item, idx) => (
                      <motion.div
                        key={`${item.id}-${item.weight}-${item.grind}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{ rotate: idx % 2 === 0 ? "0.5deg" : "-0.5deg" }}
                        className="flex gap-6 pb-2 bg-white p-6 shadow-[8px_8px_0px_rgba(0,0,0,0.02)] rounded-sm group border border-black/5 hover:shadow-[12px_12px_0px_rgba(54,127,77,0.05)] transition-all relative overflow-hidden"
                      >
                        {/* Decorative Tape */}
                        {idx === 0 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-stone-100/80 border border-black/5 rotate-[-2deg] z-10 backdrop-blur-sm" />}

                        <div className="w-28 h-32 bg-stone-50 rounded-sm overflow-hidden border border-black/5 flex-shrink-0 relative group-hover:scale-[1.02] transition-transform">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xl font-black uppercase italic tracking-tight text-slate-900 group-hover:text-[#367F4D] transition-colors leading-tight">{item.name}</h4>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[9px] font-black text-white bg-slate-900 px-2 py-0.5 rounded-full uppercase tracking-widest">{item.weight}</span>
                                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest italic">{item.grind}</span>
                              </div>
                            </div>
                            <button onClick={() => removeItem(item.id, item.weight, item.grind)} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-50 text-stone-300 hover:bg-red-50 hover:text-red-500 transition-all border border-black/5"><Trash2 size={14} /></button>
                          </div>
                          <div className="flex justify-between items-end mt-4">
                            <div className="flex items-center bg-stone-50 rounded-full px-2 py-1 border border-black/5">
                              <button onClick={() => updateQuantity(item.id, item.weight, item.grind, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all"><Minus size={12} /></button>
                              <span className="w-10 text-center text-xs font-black font-sans">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.weight, item.grind, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all"><Plus size={12} /></button>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-1 italic">Subtotal Item</p>
                              <p className="text-xl font-bold italic tracking-tighter text-slate-900 font-sans">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-10 border-t border-dashed border-black/10">
                    <Link href="/our-coffee" className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-slate-900 flex items-center gap-3 transition-colors group">
                      <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-white transition-all"><ArrowLeft size={14} /></div> Kembali Belanja
                    </Link>
                    <Button onClick={() => setStep(2)} className="h-16 px-12 bg-stone-900 text-white rounded-sm font-black uppercase tracking-widest italic shadow-xl hover:bg-[#367F4D] transition-all hover:-translate-y-1 active:scale-95">
                      Lanjut ke Pengiriman <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={18} />
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-4 sticky top-32">
                  <div className="bg-white p-10 border border-black/10 shadow-[12px_12px_0px_rgba(0,0,0,0.03)] rounded-sm space-y-10 relative overflow-hidden">
                    {/* Paper Tear Effect Mockup */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-[radial-gradient(circle,transparent_70%,#FAF9F6_72%)] bg-[length:12px_12px]" />

                    <div className="space-y-2">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 italic">Ringkasan Pesanan</h3>
                      <div className="w-10 h-1 bg-[#367F4D]" />
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <span className="text-stone-400 font-black uppercase text-[9px] tracking-[0.2em]">Total Produk</span>
                        <span className="text-slate-400 font-bold text-xs">{items.reduce((acc, i) => acc + i.quantity, 0)} Pcs</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-stone-500 font-black uppercase text-[10px] tracking-[0.2em]">Subtotal</span>
                        <span className="text-slate-900 font-bold italic text-lg font-sans">Rp {subtotal.toLocaleString('id-ID')}</span>
                      </div>

                      <div className="pt-6 border-t border-dashed border-black/10">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 italic">Total</span>
                          <span className="font-bold italic text-slate-900 tracking-tighter font-sans text-2xl">Rp {subtotal.toLocaleString('id-ID')}</span>
                        </div>
                        <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mt-4 text-center italic">*Belum termasuk biaya pengiriman</p>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-stone-50 border border-black/5 rounded-sm flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#367F4D] mt-1 shrink-0 animate-pulse" />
                      <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest leading-relaxed">Pastikan pesanan Anda sudah sesuai sebelum melanjutkan ke pengiriman.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="space-y-2 mb-12">
                <h2 className="text-5xl font-cloude italic tracking-tighter text-slate-900 uppercase leading-none">Info Pengiriman<span className="text-[#367F4D]">.</span></h2>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Where should we dispatch your specimens?</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-8 space-y-12">
                  <div className="space-y-12 bg-white p-10 border border-black/10 shadow-[12px_12px_0px_rgba(0,0,0,0.02)] rounded-sm relative">
                    {/* Tape Element */}
                    <div className="absolute -top-4 right-10 w-24 h-8 bg-white/40 border border-black/5 rotate-[3deg] z-20 backdrop-blur-sm shadow-sm flex items-center justify-center">
                      <div className="w-16 h-px bg-black/5" />
                    </div>

                    {/* Identification Section */}
                    <div className="space-y-10">

                      {/* Address Preset Selector */}
                      <div className="p-6 bg-stone-50 border border-black/5 rounded-sm mb-10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-6">Pilih Alamat Tersimpan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {addresses.length === 0 && <p className="text-[9px] font-bold text-stone-400 italic">Belum ada alamat tersimpan.</p>}
                          {addresses.map((addr, idx) => (
                            <button
                              key={addr.id || idx}
                              type="button"
                              onClick={() => selectAddress(addr)}
                              className="p-4 bg-white border border-black/5 rounded-sm text-left hover:border-[#367F4D] transition-all group"
                            >
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 group-hover:text-[#367F4D]">{addr.label || `Alamat ${idx + 1}`}</p>
                              <p className="text-[8px] font-bold text-stone-400 mt-1 line-clamp-1">{addr.address || "Alamat belum diatur"}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
                          <User size={18} />
                        </div>
                        <div>
                          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">Identitas Penerima</h3>
                          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1 italic">Who is receiving this ritual?</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 ml-1">Nama Lengkap</label>
                          <Input required value={shippingData.name} onChange={e => setShippingData({ ...shippingData, name: e.target.value })} className="h-14 bg-stone-50/50 border border-black/5 font-bold rounded-sm focus:bg-white transition-all shadow-inner" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 ml-1">Nomor WhatsApp</label>
                          <div className="relative">
                            <Input required value={shippingData.phone} onChange={e => setShippingData({ ...shippingData, phone: e.target.value })} placeholder="08..." className="h-14 bg-stone-50/50 border border-black/5 font-bold rounded-sm pl-12 focus:bg-white transition-all shadow-inner" />
                            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-10 pt-6 border-t border-dashed border-black/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#367F4D] text-white flex items-center justify-center shadow-md">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">Alamat Tujuan</h3>
                          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1 italic">The final coordinates</p>
                        </div>
                      </div>
                      <AddressInput
                        value={{
                          address: shippingData.address,
                          city: shippingData.city,
                          postalCode: shippingData.postal_code,
                          area_id: shippingData.area_id
                        }}
                        onChange={(v) => setShippingData({
                          ...shippingData,
                          address: v.address,
                          city: v.city,
                          postal_code: v.postalCode,
                          area_id: v.area_id
                        })}
                      />
                    </div>

                    {/* Courier Section */}
                    <div className="space-y-10 pt-6 border-t border-dashed border-black/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center shadow-inner border border-black/5">
                            <Truck size={18} />
                          </div>
                          <div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">Metode Pengiriman</h3>
                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1 italic">Select your logistics partner</p>
                          </div>
                        </div>
                        {ratesLoading && <Loader2 className="animate-spin text-[#367F4D]" size={16} />}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {couriers.length === 0 && !ratesLoading ? (
                          <div className="col-span-full py-12 px-6 bg-stone-50/50 border border-dashed border-black/10 rounded-sm text-center">
                            <Truck size={32} className="mx-auto text-stone-200 mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-300 italic">
                              {shippingData.area_id ? "Mencari kurir terbaik..." : "Tentukan alamat untuk menghitung ongkos kirim"}
                            </p>
                          </div>
                        ) : (
                          couriers.map((courier, idx) => {
                            const isSelected = selectedCourier?.courier_code === courier.courier_code &&
                              selectedCourier?.courier_service_code === courier.courier_service_code;
                            return (
                              <button
                                key={`${courier.courier_code}-${courier.courier_service_code}`}
                                type="button"
                                onClick={() => setSelectedCourier(courier)}
                                className={`p-6 rounded-sm border transition-all text-left relative group overflow-hidden ${isSelected ? 'border-[#367F4D] bg-[#367F4D]/[0.02] shadow-md -translate-y-1' : 'border-black/5 hover:border-stone-200 bg-white shadow-sm'}`}
                              >
                                {/* Selection Indicator */}
                                <div className={`absolute top-0 right-0 w-12 h-12 transition-transform duration-300 ${isSelected ? 'translate-x-0 translate-y-0' : 'translate-x-full -translate-y-full'}`}>
                                  <div className="absolute top-0 right-0 w-full h-full bg-[#367F4D] rotate-45 translate-x-1/2 -translate-y-1/2" />
                                  <CheckCircle2 size={12} className="absolute top-2 right-2 text-white z-10" />
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-black uppercase italic text-xs text-slate-900 group-hover:text-[#367F4D] transition-colors">{courier.courier_name}</h4>
                                    <p className="text-[8px] font-black text-[#367F4D] uppercase tracking-widest mt-0.5">{courier.courier_service_name}</p>
                                  </div>

                                  <div className="flex justify-between items-end">
                                    <div>
                                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest italic">{courier.duration}</p>
                                      <p className="text-lg font-bold text-slate-900 mt-1 font-sans">Rp {courier.price.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                      <ArrowRight size={14} className="text-[#367F4D]" />
                                    </div>
                                  </div>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-10 border-t border-dashed border-black/10">
                    <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-slate-900 flex items-center gap-3 transition-colors group">
                      <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-white transition-all"><ArrowLeft size={14} /></div> Kembali ke Review
                    </button>
                    <Button onClick={handleCheckout} disabled={loading || !selectedCourier} className="h-16 px-12 bg-stone-900 text-white rounded-sm font-black uppercase tracking-widest italic shadow-xl hover:bg-[#367F4D] transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0">
                      {loading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-3">Bayar Sekarang <ArrowRight size={20} /></span>}
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-4 sticky top-32">
                  <div className="bg-white p-10 border border-black/10 shadow-[12px_12px_0_rgba(0,0,0,0.03)] rounded-sm space-y-10 relative overflow-hidden">
                    {/* Paper Tear Effect Mockup */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-[radial-gradient(circle,transparent_70%,#FAF9F6_72%)] bg-[length:12px_12px]" />

                    <div className="space-y-2">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 italic">Total Pembayaran</h3>
                      <div className="w-10 h-1 bg-[#367F4D]" />
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <span className="text-stone-400 font-black uppercase text-[9px] tracking-[0.2em]">Subtotal Produk</span>
                        <span className="text-slate-900 font-bold italic font-sans text-sm">Rp {subtotal.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-stone-400 font-black uppercase text-[9px] tracking-[0.2em]">Ongkos Kirim</span>
                        <span className={`font-bold italic font-sans text-sm ${selectedCourier ? 'text-slate-900' : 'text-stone-300'}`}>
                          {selectedCourier ? `Rp ${shippingFee.toLocaleString('id-ID')}` : 'MENUNGGU'}
                        </span>
                      </div>

                      <div className="pt-8 border-t border-dashed border-black/10">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-black uppercase tracking-[0.3em] text-slate-900 italic">Total</span>
                          <span className="font-bold italic text-slate-900 tracking-tighter font-sans text-3xl">Rp {total.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="mt-8 flex items-center gap-3 justify-center">
                          <div className="w-10 h-[1px] bg-black/5" />
                          <CreditCard size={14} className="text-stone-300" />
                          <div className="w-10 h-[1px] bg-black/5" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-5 bg-[#367F4D]/[0.03] border border-[#367F4D]/10 rounded-sm">
                      <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest text-center italic leading-relaxed">
                        Pembayaran akan diproses aman melalui <span className="text-slate-900">Xendit Payment Gateway</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
