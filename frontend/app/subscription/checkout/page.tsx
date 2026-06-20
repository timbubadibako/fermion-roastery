"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Loader2, 
  CreditCard,
  CheckCircle2,
  MapPin,
  User,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddressSelection } from "@/components/address-selection";
import { Header } from "@/components/header";
import { FooterV2 } from "@/components/sections/v2/FooterV2";
import { AddressValue } from "@/components/address-input";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function SubscriptionCheckoutPage() {
  const router = useRouter();
  const t = useI18n();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [activeAddressId, setActiveAddressId] = useState<string | null>(null);
  
  const [address, setAddress] = useState<AddressValue>({
    address: "",
    city: "",
    postalCode: "",
    area_id: "",
    district: "",
    regency: "",
    province: "",
    patokan: ""
  });

  const [shippingData, setShippingData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    // Wait for auth hydration (small delay to let Zustand sync with localStorage)
    const timer = setTimeout(() => {
        setAuthReady(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      router.push("/auth?redirect=/subscription/checkout");
      return;
    }

    const savedPlan = localStorage.getItem('selectedSubscriptionPlan');
    if (savedPlan) {
      setPlan(JSON.parse(savedPlan));
    } else {
      toast.error(t.subscriptionCheckout.toast.noPlanSelected);
      router.push("/subscription");
      return;
    }

    fetchUserProfile();
  }, [user, router, authReady]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`/api/auth/profile/${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        console.log("Raw profile data:", data); // Debugging
        
        setShippingData({
            name: data.full_name || "",
            phone: data.phone || ""
        });

        if (data.address || data.city) {
          setAddress({
            address: data.address || "",
            city: data.city || "",
            postalCode: data.postal_code || "",
            area_id: data.area_id || "",
            district: data.district || "",
            regency: data.regency || "",
            province: data.province || "",
            patokan: data.patokan || ""
          });
        }
        if (data.addresses_json) {
            console.log("Found addresses_json:", data.addresses_json);
            const parsedAddresses = typeof data.addresses_json === 'string' ? JSON.parse(data.addresses_json) : data.addresses_json;
            console.log("Parsed addresses:", parsedAddresses);
            setAddresses(parsedAddresses);
        } else {
            console.log("No addresses_json found in profile data");
        }
      }
    } catch (e) {
      console.error("Failed to load profile:", e);
    } finally {
      setLoading(false);
    }
  };

  const selectSavedAddress = (addr: any) => {
    setActiveAddressId(addr.id || null);
    setAddress({
        address: addr.address || "",
        city: addr.city || "",
        postalCode: addr.postal_code || addr.postalCode || "",
        area_id: addr.area_id || addr.areaId || "",
        district: addr.district || "",
        regency: addr.regency || "",
        province: addr.province || "",
        patokan: addr.patokan || ""
    });
    toast.success(t.subscriptionCheckout.toast.savedAddressLoaded);
  };

  const handleCheckout = async () => {
    if (!address.area_id || !address.address || !shippingData.name) {
      toast.error(t.subscriptionCheckout.toast.completeAddressAndIdentity);
      return;
    }

    setProcessing(true);
    try {
      await fetch(`/api/auth/profile/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            fullName: shippingData.name,
            phone: shippingData.phone,
            address: address.address, 
            city: address.city, 
            postalCode: address.postalCode,
            areaId: address.area_id,
            district: address.district,
            regency: address.regency,
            province: address.province,
            patokan: address.patokan
        })
      });

      const res = await fetch("/api/payments/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            amount: plan.price, 
            planName: plan.name, 
            planId: plan.id,
            profileId: user?.id,
            interval: 'MONTH', 
            intervalCount: 1,
            shippingAddress: { ...address, name: shippingData.name, phone: shippingData.phone },
            customerDetails: { name: shippingData.name, phone: shippingData.phone, email: user?.email }
        }),
      });
      
      const data = await res.json();
      if (res.ok && data.invoiceUrl) {
        localStorage.removeItem('selectedSubscriptionPlan');
        window.location.href = data.invoiceUrl;
      } else { 
        toast.error(data.message || t.subscriptionCheckout.toast.invoiceFailed); 
        setProcessing(false); 
      }
    } catch (e) { 
      toast.error(t.subscriptionCheckout.toast.networkError); 
      setProcessing(false); 
    }
  };

  if (loading || !plan) return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-4 text-stone-400 font-sans">
      <Loader2 size={40} className="animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">{t.subscriptionCheckout.loading}</p>
    </div>
  );

  return (
    <div className="bg-[#FAF9F6] min-h-screen relative overflow-hidden font-sans flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      <Header />

      <main className="flex-grow pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="space-y-2">
            <h1 className="text-6xl md:text-6xl font-display italic tracking-tighter text-[#2A1619] leading-none uppercase font-bold">{t.subscriptionCheckout.title}</h1>
            <p className="text-xs text-stone-500 font-black uppercase tracking-widest italic">{t.subscriptionCheckout.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            <div id="tour-subcheck-address" className="lg:col-span-8 space-y-10">
               <AddressSelection 
                  address={address} 
                  setAddress={setAddress}
                  shippingData={shippingData}
                  setShippingData={setShippingData}
                  savedAddresses={addresses}
                  onSelectSaved={selectSavedAddress}
                  activeAddressId={activeAddressId || undefined}
                  contextType='subscription'
               />

               <div id="tour-subcheck-priority" className="bg-stone-50 border border-black/5 p-8 rounded-sm flex gap-4 items-start shadow-inner">
                  <CheckCircle2 className="text-[#367F4D] shrink-0 mt-0.5" size={20} />
                  <div className="space-y-1">
                     <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">{t.subscriptionCheckout.priorityShipping.title}</p>
                     <p className="text-[10px] font-bold text-stone-500 leading-relaxed italic">{t.subscriptionCheckout.priorityShipping.description}</p>
                  </div>
               </div>
            </div>

            <div id="tour-subcheck-summary" className="lg:col-span-4 sticky top-32">
                  <div className="bg-white p-10 border border-black/10 shadow-[12px_12px_0_rgba(0,0,0,0.03)] rounded-sm space-y-10 relative overflow-hidden">
                    {/* Paper Tear Effect Mockup */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-[radial-gradient(circle,transparent_70%,#FAF9F6_72%)] bg-[length:12px_12px]" />

                    <div className="space-y-2">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 italic">{t.subscriptionCheckout.summary.sectionTitle}</h3>
                      <div className="w-10 h-1 bg-[#367F4D]" />
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{t.subscriptionCheckout.summary.planLabel} <br/><span className="italic font-display text-sm text-slate-900">{plan.name}</span></p>
                        <span className="font-bold text-sm text-slate-900">{plan.priceLabel}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-stone-400 font-black uppercase text-[9px] tracking-[0.2em]">{t.subscriptionCheckout.summary.shippingLabel}</span>
                        <span className="font-bold italic font-sans text-sm text-emerald-500">{t.subscriptionCheckout.summary.freeShipping}</span>
                      </div>

                      <div className="pt-8 border-t border-dashed border-black/10">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-black uppercase tracking-[0.3em] text-slate-900 italic">{t.subscriptionCheckout.summary.total}</span>
                          <span className="font-bold italic text-slate-900 tracking-tighter font-sans text-3xl">
                            {plan.priceLabel}
                          </span>
                        </div>
                        <div className="mt-8 flex items-center gap-3 justify-center">
                          <div className="w-10 h-[1px] bg-black/5" />
                          <CreditCard size={14} className="text-stone-300" />
                          <div className="w-10 h-[1px] bg-black/5" />
                        </div>
                      </div>

                      <Button 
                        id="tour-subcheck-pay"
                        onClick={handleCheckout} 
                        disabled={processing || !address.area_id}
                        className="w-full h-16 bg-stone-900 text-white rounded-sm font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-[#367F4D] transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                      >
                        {processing ? (
                            <><Loader2 className="animate-spin mr-2" size={16} /> {t.subscriptionCheckout.payment.processing}</>
                        ) : (
                            <span className="flex items-center gap-3">{t.subscriptionCheckout.payment.confirmAndPay} <CreditCard size={16} /></span>
                        )}
                      </Button>
                    </div>

                    <div className="mt-6 p-5 bg-[#367F4D]/[0.03] border border-[#367F4D]/10 rounded-sm">
                      <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest text-center italic leading-relaxed">
                        {t.subscriptionCheckout.payment.termsAlert.prefix}
                        <span className="text-slate-900">{t.subscriptionCheckout.payment.termsAlert.processor}</span>
                        {t.subscriptionCheckout.payment.termsAlert.suffix}
                      </p>
                    </div>
                  </div>
            </div>
          </div>
        </div>
      </main>
      <FooterV2 />
    </div>
  );
}
