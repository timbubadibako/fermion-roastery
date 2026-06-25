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
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { AddressSelection } from "@/components/address-selection";
import { AddressValue } from "@/components/address-input";
import { apiFetch } from "@/lib/api";

export default function B2BCheckoutPage() {
  const t = useI18n();
  const router = useRouter();
  const { user } = useAuthStore();
  const { items: allItems, removeItem, getTotal } = useCartStore();
  
  // Selective Checkout Logic
  const items = allItems.filter(i => i.selected !== false && i.isB2B);

  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
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

  const [paymentType, setPaymentType] = useState<'cash' | 'tempo' | 'cash_offline'>('tempo');

  useEffect(() => {
    if (user) {
      // Fetch partner info
      apiFetch(`/api/admin/partners?profileId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          const p = data.find((p: any) => p.profile_id === user.id);
          setPartner(p);
          if (p) {
             setShippingData({ name: p.company_name, phone: p.phone });
          }
        });
        
      // Fetch profile addresses
      apiFetch(`/api/auth/profile/${user.id}`)
        .then(res => res.json())
        .then(data => {
           if (data.addresses_json?.length > 0) {
              setAddresses(data.addresses_json);
           }
           setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const selectSavedAddress = (addr: any) => {
    setActiveAddressId(addr.id || null);
    setAddress({
      address: addr.address || "",
      city: addr.city || "",
      postalCode: addr.postalCode || addr.postal_code || "",
      area_id: addr.area_id || "",
      district: addr.district || "",
      regency: addr.regency || "",
      province: addr.province || "",
      patokan: addr.patokan || "",
      houseRtRw: addr.houseRtRw || "",
      street: addr.street || "",
      village: addr.village || ""
    } as any);
    setShippingData({
      name: addr.name || addr.recipientName || shippingData.name,
      phone: addr.phone || addr.recipientPhone || shippingData.phone
    });
  };

  const handleCheckout = async () => {
    if (!address.address) {
      toast.error("Silakan lengkapi alamat pengiriman.");
      return;
    }

    setProcessing(true);
    try {
      // MANUAL PAYMENT LOGIC (TEMPO & OFFLINE)
      if (paymentType === 'tempo' || paymentType === 'cash_offline') {
        const res = await fetch("/api/payments/manual-invoice", {
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
              name: shippingData.name || partner?.company_name || user?.full_name,
              email: user?.email,
              phone: shippingData.phone || partner?.phone || "-"
            },
            paymentType,
            metadata: {
              profileId: user?.id,
              shipping: {
                address: address.address,
                city: address.city,
                postal_code: address.postalCode,
                notes: address.patokan
              },
              shippingFee: 0,
              courier: { courier_name: "B2B Free Shipping", price: 0 }
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          toast.success(paymentType === 'tempo' ? t.b2bCheckout.toast.tempoSuccess : t.b2bCheckout.toast.offlineSuccess);
          const lineItemIdsToRemove = items.map(item => item.lineItemId);
          localStorage.setItem('purchasedLineItemIds', JSON.stringify(lineItemIdsToRemove));
          
          router.push(`/b2b/invoice/${data.orderId}`);
        } else {
          const error = await res.json();
          toast.error(error.message || "Gagal membuat pesanan.");
        }
        setProcessing(false);
        return;
      }

      // FULL PAYMENT LOGIC
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
            name: shippingData.name || partner?.company_name || user?.full_name,
            email: user?.email,
            phone: shippingData.phone || partner?.phone || "-"
          },
          metadata: {
            profileId: user?.id,
            shipping: {
              address: address.address,
              city: address.city,
              postal_code: address.postalCode,
              notes: address.patokan
            },
            shippingFee: 0,
            courier: { courier_name: "B2B Free Shipping", price: 0 },
            b2b: true
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(t.b2bCheckout.toast.gatewaySuccess);
        
        // Save only the lineItemIds of selected items to localStorage for consistent cleanup
        const lineItemIdsToRemove = items.map(item => item.lineItemId);
        localStorage.setItem('purchasedLineItemIds', JSON.stringify(lineItemIdsToRemove));
        
        // Redirect to our internal invoice instead of directly to Xendit
        router.push(`/b2b/invoice/${data.orderId}?paymentUrl=${encodeURIComponent(data.invoiceUrl)}`);
      } else {
        const error = await res.json();
        toast.error(error.message || t.b2bCheckout.toast.invoiceFailed);
      }
    } catch (e) {
      toast.error(t.b2bCheckout.toast.gatewayError);
    } finally {
      if (paymentType === 'cash') setProcessing(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">{t.b2bCheckout.loading}</p>
    </div>
  );

  const baseSubtotal = getTotal(true);
  
  const totalVolumeKg = items.reduce((acc, item) => {
    let weight = 0.25; 
    if (item.weight) {
      if (item.weight.toLowerCase().includes('kg')) weight = parseFloat(item.weight);
      else if (item.weight.toLowerCase().includes('g')) weight = parseFloat(item.weight) / 1000;
    }
    return acc + (weight * item.quantity);
  }, 0);

  const volumeDiscount = totalVolumeKg * 10000;
  const subtotal = baseSubtotal - volumeDiscount;
  const shippingFee = 0; // B2B always free shipping
  const grandTotal = subtotal + shippingFee;

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">{t.b2bCheckout.loading}</p>
    </div>
  );

  if (items.length === 0) {
    return (
      <div className="space-y-12 pb-20 text-center pt-20">
         <Package size={48} className="text-slate-200" />
         <h1 className="font-display text-4xl font-black italic">{t.b2bCheckout.emptyState.title}</h1>
         <p className="text-slate-500 font-medium">{t.b2bCheckout.emptyState.subtitle}</p>
         <Link href="/b2b/shop">
            <Button className="bg-slate-900 text-white rounded-2xl h-14 px-8 uppercase font-black tracking-widest text-[10px]">{t.b2bCheckout.emptyState.button}</Button>
         </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="space-y-2 text-left">
        <div className="flex items-center gap-2">
           <span className="px-3 py-1 rounded-sm text-[9px] font-black tracking-widest bg-periwinkle/10 text-periwinkle uppercase border border-periwinkle/20">{t.b2bCheckout.badge}</span>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.b2bCheckout.stepLabel}</span>
        </div>
        <h1 className="font-display text-5xl font-black tracking-tighter uppercase italic text-slate-950 leading-none" dangerouslySetInnerHTML={{ __html: t.b2bCheckout.title }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: DESTINATION */}
        <div className="lg:col-span-7 space-y-8">
           <AddressSelection 
              address={address} 
              setAddress={setAddress}
              shippingData={shippingData}
              setShippingData={setShippingData}
              savedAddresses={addresses}
              onSelectSaved={selectSavedAddress}
              activeAddressId={activeAddressId || undefined}
              contextType='retail'
              emptyStateHref='/b2b/settings'
           />
        </div>

        {/* RIGHT COLUMN: MONOSPACE MATRIX & PAYMENT */}
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-slate-950 text-white rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-periwinkle/10 blur-3xl -mr-32 -mt-32" />
              <div className="space-y-8 relative z-10">
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-6">{t.b2bCheckout.summary.sectionTitle}</h3>
                 
                 <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl border border-white/10">
                    <button 
                       onClick={() => setPaymentType('tempo')}
                       className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${paymentType === 'tempo' ? 'bg-periwinkle text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                       {t.b2bCheckout.payment.net30}
                    </button>
                    <button 
                       onClick={() => setPaymentType('cash_offline')}
                       className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${paymentType === 'cash_offline' ? 'bg-periwinkle text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                       {t.b2bCheckout.payment.cashOffline}
                    </button>
                    <button 
                       onClick={() => setPaymentType('cash')}
                       className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${paymentType === 'cash' ? 'bg-periwinkle text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                       {t.b2bCheckout.payment.gateway}
                    </button>
                 </div>

                 <div className="space-y-4">
                    {items.map(item => (
                       <div key={item.id} className="flex justify-between items-start border-b border-white/10 pb-4">
                          <div className="space-y-1">
                             <p className="font-black uppercase italic text-sm text-slate-200">{item.name}</p>
                             <p className="text-[10px] font-bold text-slate-500 font-mono">{t.b2bCheckout.summary.itemCalculation.replace('{{quantity}}', String(item.quantity)).replace('{{price}}', item.price.toLocaleString('id-ID'))}</p>
                          </div>
                          <p className="font-black font-mono text-white">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                       </div>
                    ))}
                 </div>

                 <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex items-start gap-3">
                    <Info size={16} className="text-periwinkle mt-0.5 shrink-0" />
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
                       {t.b2bCheckout.summary.monthlyAccumulationAlert.split('{{weight}}')[0]}
                       <span className="text-white">{totalVolumeKg}</span>
                       {t.b2bCheckout.summary.monthlyAccumulationAlert.split('{{weight}}')[1]}
                    </p>
                 </div>

                 <div className="space-y-4 pt-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                       <span>{t.b2bCheckout.summary.subtotal}</span>
                       <span className="font-mono text-slate-300">Rp {baseSubtotal.toLocaleString('id-ID')}</span>
                    </div>
                    {volumeDiscount > 0 && (
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-400">
                         <span>Diskon Mitra (Rp 10rb/Kg)</span>
                         <span className="font-mono">-Rp {volumeDiscount.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-black uppercase italic text-white pt-4 border-t border-white/20">
                       <span>{t.b2bCheckout.summary.total}</span>
                       <span className="font-mono text-periwinkle">Rp {grandTotal.toLocaleString('id-ID')}</span>
                    </div>
                 </div>

                 <Button 
                   onClick={handleCheckout}
                   disabled={processing}
                   className="w-full h-16 bg-white text-slate-950 font-black uppercase tracking-[0.2em] italic text-[10px] rounded-2xl hover:bg-periwinkle hover:text-white transition-all shadow-xl"
                 >
                    {processing ? <Loader2 className="animate-spin" /> : (paymentType === 'tempo' ? t.b2bCheckout.payment.btnTempo : paymentType === 'cash_offline' ? t.b2bCheckout.payment.btnOffline : t.b2bCheckout.payment.btnGateway)}
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
