"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import {
  User, LogOut, Package, Settings,
  Clock, Truck, CheckCircle2, ChevronRight,
  Coffee, ArrowRight, Loader2, Receipt,
  LayoutDashboard, Ban, MapPin, Phone, Crosshair, Sparkles,
  Download, Upload, FileText, AlertTriangle
} from "lucide-react";
import { AddressInput } from "@/components/address-input";
import { apiFetch } from "@/lib/api";

interface Order {
  id: string;
  total_amount: string;
  status: string;
  created_at: string;
  shipping_awb?: string;
  shipping_courier?: string;
  items: any[];
}

interface AddressDetail {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  patokan: string;
  city: string;
  district: string;
  province: string;
  regency: string;
  postalCode: string;
  area_id: string;
  isPrimary: boolean;
}

function AccountContent() {
  const t = useI18n();
  const { user, logout, setUser, refreshSession } = useAuthStore();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("settings");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [selectedContractFile, setSelectedContractFile] = useState<File | null>(null);
  const [isContractUploading, setIsContractUploading] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.full_name || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    area_id: "",
    patokan: "",
    district: "",
    province: "",
    regency: ""
  });

  const [addresses, setAddresses] = useState<AddressDetail[]>([
    { id: 'primary', label: 'Alamat Utama', name: '', phone: '', address: '', patokan: '', city: '', district: '', province: '', regency: '', postalCode: '', area_id: '', isPrimary: true },
    { id: '2', label: 'Alamat 2', name: '', phone: '', address: '', patokan: '', city: '', district: '', province: '', regency: '', postalCode: '', area_id: '', isPrimary: false },
    { id: '3', label: 'Alamat 3', name: '', phone: '', address: '', patokan: '', city: '', district: '', province: '', regency: '', postalCode: '', area_id: '', isPrimary: false }
  ]);

  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchProfile();
      fetchSubscription();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await apiFetch(`/api/auth/profile/${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setProfileData({
          fullName: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          postalCode: data.postal_code || "",
          area_id: data.area_id || "",
          patokan: data.patokan || "",
          district: data.district || "",
          province: data.province || "",
          regency: data.regency || ""
        });

        if (data.addresses_json && Array.isArray(data.addresses_json)) {
          const savedAddresses = data.addresses_json;
          setAddresses(prev => {
            const newAddrs = [...prev];
            savedAddresses.forEach((saved: any, idx: number) => {
              if (idx < 3) newAddrs[idx] = { ...newAddrs[idx], ...saved };
            });
            return newAddrs;
          });
        }
      }
    } catch (e) { console.error("Failed to load profile"); }
  };

  const fetchSubscription = async () => {
    try {
      const res = await apiFetch(`/api/subscription/active/${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch (e) { console.error("Failed to load subscription"); }
  };

  const confirmContractUpload = async () => {
    if (!selectedContractFile || !user) return;
    setIsContractUploading(true);
    toast.loading(t.account.messages.uploadingContract, { id: "upload-contract" });

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedContractFile);
      reader.onload = async () => {
        const base64File = reader.result;

        const res = await fetch('/api/b2b/upload-contract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            profileId: user.id, 
            fileData: base64File, 
            fileName: selectedContractFile.name, 
            mimetype: selectedContractFile.type 
          })
        });
        
        if (res.ok) {
          toast.success(t.account.messages.contractUploadSuccess, { id: "upload-contract" });
          refreshSession(); // Refresh status quietly without reloading
        } else {
          toast.error("Gagal mengunggah dokumen.", { id: "upload-contract" });
        }
        setIsContractUploading(false);
        setSelectedContractFile(null);
      };

      reader.onerror = () => {
        toast.error("Gagal membaca file.", { id: "upload-contract" });
        setIsContractUploading(false);
        setSelectedContractFile(null);
      };
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.", { id: "upload-contract" });
      setIsContractUploading(false);
      setSelectedContractFile(null);
    }
  };

  const cancelSubscription = async () => {
    if (!subscription) return;
    try {
      const res = await apiFetch(`/api/subscription/cancel/${subscription.id}`, { method: 'POST' });
      if (res.ok) {
        toast.success(t.account.messages.subscriptionCancelSuccess);
        fetchSubscription();
      } else {
        toast.error(t.account.messages.subscriptionCancelFailure);
      }
    } catch (e) { toast.error(t.account.messages.networkError); }
  };

  const fetchOrders = async () => {
    try {
      const res = await apiFetch(`/api/orders/my-orders?profileId=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) { toast.error(t.account.messages.ordersLoadFailure); } finally { setLoading(false); }
  };

  const fetchTracking = (order: Order) => {
    if (activeTrackingId === order.id) {
      setActiveTrackingId(null);
      return;
    }

    setActiveTrackingId(order.id);

    if (order.shipping_awb) {
      setIsTrackingLoading(true);
      setTimeout(() => setIsTrackingLoading(false), 800);
    }
  };

  const handleLogout = () => { logout(); window.location.href = "/auth"; };

  const saveAllSettings = async () => {
    // 1. Ambil data alamat utama dari state ketikan user
    const primaryAddress = addresses.find(a => a.isPrimary) || addresses[0];

    // 2. 🟢 GABUNGKAN PECAHAN MENJADI SATU STRING UTUH UNTUK BITESHIP & KOLOM FLAT
    // Ambil data pecahan dengan safe-casting
    const houseRtRw = (primaryAddress as any)?.houseRtRw || '';
    const street = (primaryAddress as any)?.street || '';
    const village = (primaryAddress as any)?.village || '';

    // Gabungkan komponen alamat yang ada menggunakan koma. Jika kosong, fallback ke string address bawaan
    const combinedAddress = [houseRtRw, street, village]
      .map(str => str.trim())
      .filter(Boolean)
      .join(', ') || primaryAddress?.address || '';

    // 3. Amankan string patokan (maksimal 100 karakter)
    const safePatokan = (primaryAddress as any)?.patokan?.substring(0, 100) || '';

    // 4. Bersihkan seluruh list alamat di dalam array JSON book agar sinkron
    const sanitizedAddresses = addresses.map(addr => {
      const addrHouse = (addr as any)?.houseRtRw || '';
      const addrStreet = (addr as any)?.street || '';
      const addrVillage = (addr as any)?.village || '';

      return {
        ...addr,
        // Pastikan di dalam JSON Book, properti 'address' juga ikut ter-update hasil gabungannya
        address: [addrHouse, addrStreet, addrVillage].map(str => str.trim()).filter(Boolean).join(', ') || addr.address || '',
        patokan: (addr as any)?.patokan?.substring(0, 100) || ''
      };
    });

    // 5. Susun payload untuk dialirkan ke backend
    const updatedPayload = {
      ...profileData,
      fullName: profileData.fullName,
      phone: profileData.phone,

      // 🟢 Kolom flat address sekarang berisi alamat lengkap pecahan, bukan lagi string "Jalan raya"
      address: combinedAddress,
      city: primaryAddress?.city || '',
      postalCode: primaryAddress?.postalCode || '',
      areaId: primaryAddress?.area_id || '',
      district: primaryAddress?.district || '',
      regency: primaryAddress?.regency || '',
      province: primaryAddress?.province || '',
      patokan: safePatokan,

      // Kirim state JSON book yang sudah rapi
      addresses: sanitizedAddresses
    };

    try {
      const res = await apiFetch(`/api/auth/profile/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(t.account.messages.profileSaveSuccess);
        setUser(data.profile);

        // Opsional: Refresh profile data local state agar sinkron pasca-save
        if (data.addresses_json) {
          setAddresses(data.addresses_json);
        }
      } else {
        toast.error(t.account.messages.profileSaveFailure);
      }
    } catch (e) {
      toast.error(t.account.messages.serverConnectionFailure);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error(t.account.messages.geolocationUnsupported);
      return;
    }

    toast.loading(t.account.messages.detectingLocation);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;

        // 1. Tembak API OpenStreetMap gratis buat nerjemahin koordinat GPS ke Alamat Manusiawi
        const resGeo = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
          { headers: { "User-Agent": "FermionRoasteryApp" } } // Syarat wajib OSM
        );
        const geoData = await resGeo.json();

        toast.dismiss();

        // Susun alamat lengkap dari data jalan, RT/RW, desa/kelurahan yang didapat
        const details = geoData.address;
        const alamatManusiawi = [
          details.road || details.suburb || '',                      // Nama Jalan / Gang
          details.neighbourhood ? `RT/RW: ${details.neighbourhood}` : '', // RT/RW jika ada
          details.village || details.city_district || '',            // Desa / Kelurahan
        ].filter(Boolean).join(", ");

        const activeId = editingAddressId || addresses.find(a => a.isPrimary)?.id || addresses[0]?.id;

        if (activeId) {
          setAddresses(prev => prev.map(addr => addr.id === activeId ? {
            ...addr,
            // 🟢 Sekarang isinya nama jalan, desa, dll, plus koordinat di ujungnya buat akurasi kurir
            address: `${alamatManusiawi} [GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}]`,

            // Kolom flat lainnya biarkan kosong/lama agar user tetep milih di search selector demi area_id Biteship
            city: addr.city || '',
            district: addr.district || '',
            province: addr.province || '',
            regency: addr.regency || '',
            postalCode: details.postcode || addr.postalCode || '',
            area_id: addr.area_id || ''
          } : addr));

          toast.success(t.account.messages.locationDetected);
        }
      } catch (err) {
        toast.dismiss();
        toast.error(t.account.messages.locationGeocodeFailure);
      }
    }, () => {
      toast.dismiss();
      toast.error(t.account.messages.locationAccessDenied);
    });
  };

  const updateAddressField = (id: string, field: keyof AddressDetail, value: string) => {
    setAddresses(prev => prev.map(addr => addr.id === id ? { ...addr, [field]: value } : addr));
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 italic">{t.account.loading.accessingHub}</p>
    </div>
  );

  const recentOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-6 font-sans relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.02]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/5 pb-10">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">{t.account.header.title}<span className="text-[#367F4D]">.</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">{t.account.header.scientistLabel} {user?.full_name}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-red-500 transition-colors">
            <LogOut size={14} /> {t.account.header.logoutButton}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-12">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="bg-white p-10 border border-black/5 shadow-sm rounded-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10 space-y-6">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 italic flex items-center gap-2">
                        <Clock size={14} className="text-[#367F4D]" /> {t.account.overview.latestOrderStatus}
                      </h3>
                      {recentOrder ? (
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                          <div className="space-y-2">
                            <h4 className="text-2xl font-bold tracking-tight text-slate-900">{t.account.overview.orderLabel}{recentOrder.id.slice(0, 8).toUpperCase()}</h4>
                            <div className="flex items-center gap-3">
                              <div className="px-3 py-1 bg-stone-900 text-white text-[8px] font-black uppercase tracking-widest rounded-full">{recentOrder.status}</div>
                              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{new Date(recentOrder.created_at).toLocaleDateString('id-ID')}</p>
                            </div>
                          </div>
                          <Button onClick={() => setActiveTab("orders")} className="h-12 bg-white border border-black/10 text-slate-900 font-black uppercase tracking-widest text-[9px] hover:bg-stone-50 rounded-sm italic shadow-sm px-8">{t.account.overview.viewDetailsButton} <ArrowRight size={14} className="ml-2" /></Button>
                        </div>
                      ) : (
                        <div className="py-8 text-center bg-stone-50 border border-dashed border-black/10 rounded-sm">
                          <Coffee size={24} className="mx-auto text-stone-200 mb-2" />
                          <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">{t.account.overview.noActiveOrders}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 border border-black/5 rounded-sm shadow-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2"><Receipt size={14} /> {t.account.overview.totalPurchaseTitle}</h4>
                      <div className="text-4xl font-bold tracking-tight text-slate-900">{orders.length} <span className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400 ml-2">{t.account.overview.ordersCountLabel}</span></div>
                    </div>
                    <div className="bg-white p-8 border border-black/5 rounded-sm shadow-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2"><Sparkles size={14} /> {t.account.overview.subscriptionTitle}</h4>
                      <div className="text-xl font-bold tracking-tight text-slate-900">{subscription ? subscription.plan_name : t.account.overview.noActivePlan}</div>
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-2">{subscription ? `${t.account.overview.activeSince} ${new Date(subscription.created_at).toLocaleDateString('id-ID')}` : t.account.overview.notSubscribed}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "subscription" && (
                <motion.div key="subscription" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="bg-white p-10 border border-black/5 rounded-sm shadow-sm space-y-8">
                    <h3 className="text-3xl font-display italic font-bold tracking-tighter text-slate-900">{t.account.subscription.title}<span className="text-[#367F4D]">.</span></h3>
                    {subscription ? (
                      <div className="p-8 bg-stone-50 border border-black/5 rounded-sm space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 italic">{t.account.subscription.activePlanLabel}</span>
                          <span className="px-3 py-1 bg-[#367F4D] text-white text-[9px] font-black uppercase rounded-full">{t.account.subscription.activeBadge}</span>
                        </div>
                        <div className="text-4xl font-display font-black italic text-slate-900">{subscription.plan_name}</div>
                        <Button onClick={cancelSubscription} variant="destructive" className="bg-red-900 text-white font-black uppercase tracking-widest text-[9px] rounded-sm h-12 px-8">
                          <Ban size={14} className="mr-2" /> {t.account.subscription.cancelButton}
                        </Button>
                      </div>
                    ) : (
                      <div className="py-20 text-center bg-stone-50 border border-dashed border-black/10 rounded-sm">
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest italic mb-6">{t.account.subscription.noSubscription}</p>
                        <Link href="/subscription">
                          <Button className="bg-slate-900 text-white font-black uppercase tracking-widest italic rounded-sm h-12 px-8">{t.account.subscription.startSubscriptionButton}</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ORDERS */}
              {activeTab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div className="bg-white p-10 border border-black/5 rounded-sm shadow-sm space-y-10">
                    <div className="flex justify-between items-center border-b border-black/5 pb-6">
                      <h3 className="text-3xl font-display italic font-bold tracking-tighter text-slate-900">{t.account.orders.title}<span className="text-[#367F4D]">.</span></h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-300">{orders.length} {t.account.orders.countLabel}</span>
                    </div>

                    {orders.length === 0 ? (
                      <div className="py-20 text-center space-y-6">
                        <Package size={48} className="mx-auto text-stone-100" />
                        <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest italic">{t.account.orders.emptyHistory}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map(order => (
                          <div key={order.id} className="border border-black/5 rounded-sm overflow-hidden bg-white hover:border-black/10 transition-all">
                            <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                              <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                  <h4 className="text-sm font-black uppercase italic text-slate-900 tracking-tight">#{order.id.slice(0, 8).toUpperCase()}</h4>
                                  <div className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.2em] rounded-full border ${order.status === 'PAID' ? 'bg-green-50 text-green-600 border-green-200' :
                                    order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                      order.status === 'DELIVERED' ? 'bg-slate-900 text-white border-slate-900' :
                                        'bg-stone-50 text-stone-400 border-stone-200'
                                    }`}>
                                    {order.status}
                                  </div>
                                </div>
                                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                              </div>
                              <div className="flex items-center gap-10">
                                <div className="text-right">
                                  <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest mb-1 italic">{t.account.orders.totalHeader}</p>
                                  <p className="text-sm font-bold font-sans text-slate-900">Rp {Number(order.total_amount).toLocaleString('id-ID')}</p>
                                </div>
                                <button onClick={() => fetchTracking(order)} className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-stone-50 transition-all text-stone-400 hover:text-slate-900 shadow-sm">
                                  <ChevronRight size={18} className={`transition-transform ${activeTrackingId === order.id ? 'rotate-90' : ''}`} />
                                </button>
                              </div>
                            </div>

                            {/* Expanded Tracking Detail */}
                            <AnimatePresence>
                              {activeTrackingId === order.id && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-black/5 bg-stone-50/50 overflow-hidden">
                                  <div className="p-8 space-y-8">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                        <Truck size={18} className="text-[#367F4D]" />
                                        <div>
                                          <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">{t.account.tracking.courierAndAwb}</p>
                                          <p className="text-xs font-bold text-slate-900 uppercase">{order.shipping_courier || t.account.tracking.pending} • {order.shipping_awb || t.account.tracking.awaitingAwb}</p>
                                        </div>
                                      </div>
                                      {isTrackingLoading && <Loader2 size={14} className="animate-spin text-stone-300" />}
                                    </div>

                                    {/* Status Timeline */}
                                    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-stone-200">
                                      <div className="relative flex items-start gap-4">
                                        <div className={`w-[11px] h-[11px] rounded-full mt-1.5 z-10 border-2 border-white shadow-sm ${['PAID', 'ROASTING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-[#367F4D]' : 'bg-stone-200'}`} />
                                        <div>
                                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-tight">{t.account.tracking.status.confirmed.title}</p>
                                          <p className="text-[8px] font-bold text-stone-400 uppercase mt-0.5">{t.account.tracking.status.confirmed.desc}</p>
                                        </div>
                                      </div>
                                      <div className="relative flex items-start gap-4">
                                        <div className={`w-[11px] h-[11px] rounded-full mt-1.5 z-10 border-2 border-white shadow-sm ${['ROASTING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-[#367F4D]' : 'bg-stone-200'}`} />
                                        <div>
                                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-tight">{t.account.tracking.status.roasting.title}</p>
                                          <p className="text-[8px] font-bold text-stone-400 uppercase mt-0.5">{t.account.tracking.status.roasting.desc}</p>
                                        </div>
                                      </div>
                                      <div className="relative flex items-start gap-4">
                                        <div className={`w-[11px] h-[11px] rounded-full mt-1.5 z-10 border-2 border-white shadow-sm ${['SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-[#367F4D]' : 'bg-stone-200'}`} />
                                        <div>
                                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-tight">{t.account.tracking.status.shipped.title}</p>
                                          <p className="text-[8px] font-bold text-stone-400 uppercase mt-0.5">{t.account.tracking.status.shipped.desc}</p>
                                        </div>
                                      </div>
                                      <div className="relative flex items-start gap-4">
                                        <div className={`w-[11px] h-[11px] rounded-full mt-1.5 z-10 border-2 border-white shadow-sm ${order.status === 'DELIVERED' ? 'bg-[#367F4D]' : 'bg-stone-200'}`} />
                                        <div>
                                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-tight">{t.account.tracking.status.delivered.title}</p>
                                          <p className="text-[8px] font-bold text-stone-400 uppercase mt-0.5">{t.account.tracking.status.delivered.desc}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="bg-white p-10 border border-black/5 rounded-sm shadow-sm space-y-12">
                    <div className="flex justify-between items-center border-b border-black/5 pb-6">
                      <h3 className="text-3xl font-display italic font-bold tracking-tighter text-slate-900">{t.account.settings.title}</h3>
                      <div className="w-10 h-10 rounded-full bg-stone-50 border border-black/5 flex items-center justify-center text-stone-300">
                        <Settings size={16} />
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
                          <User size={14} />
                        </div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">{t.account.settings.researcherIdentity}</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">{t.account.settings.fullNameLabel}</label>
                          <Input value={profileData.fullName} onChange={e => setProfileData({ ...profileData, fullName: e.target.value })} className="h-12 bg-stone-50/50 border border-black/5 font-bold rounded-sm shadow-inner" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">{t.account.settings.whatsappNumberLabel}</label>
                          <div className="relative">
                            <Input value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} placeholder={t.account.settings.whatsappPlaceholder} className="h-12 bg-stone-50/50 border border-black/5 font-bold rounded-sm pl-12 shadow-inner" />
                            <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8 pt-10 border-t border-dashed border-black/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#367F4D] text-white flex items-center justify-center shadow-md">
                            <MapPin size={14} />
                          </div>
                          <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">{t.account.settings.addressBookTitle}</h4>
                        </div>
                        {/* <Button onClick={useCurrentLocation} variant="outline" className="h-10 text-[9px] font-black uppercase tracking-widest border-black/10 hover:bg-stone-50 gap-2 shadow-sm rounded-sm">
                          <Crosshair size={12} /> {t.account.settings.useCurrentLocation}
                        </Button> */}
                      </div>

                      <div className="flex gap-2 p-1 bg-stone-50 rounded-sm border border-black/5">
                        {addresses.map(addr => {
                          const localizedLabel = addr.id === 'primary' 
                            ? t.account.settings.addresses.primaryLabel 
                            : addr.id === '2' 
                              ? t.account.settings.addresses.address2Label 
                              : t.account.settings.addresses.address3Label;
                          return (
                            <button
                              key={addr.id}
                              onClick={() => setEditingAddressId(addr.id)}
                              className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all rounded-sm ${(editingAddressId === addr.id || (!editingAddressId && addr.isPrimary))
                                ? 'bg-white shadow-sm text-slate-900 border border-black/5'
                                : 'text-stone-400 hover:text-stone-600'
                                }`}
                            >
                              {localizedLabel} {addr.isPrimary && "★"}
                            </button>
                          );
                        })}
                      </div>

                      {addresses.filter(a => editingAddressId ? a.id === editingAddressId : a.isPrimary).map(addr => (
                        <motion.div key={addr.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 p-8 border border-dashed border-black/10 rounded-sm">

                          {/* 1. GRID IDENTITAS PENERIMA */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* INPUT NAMA PENERIMA */}
                            <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">{t.account.settings.recipientNameLabel}</label>
                              <Input
                                value={addr.name ?? ""}
                                placeholder={profileData.fullName}
                                onChange={e => updateAddressField(addr.id, 'name', e.target.value)}
                                className="h-12 bg-white border border-black/10 font-bold rounded-sm"
                              />
                            </div>

                            {/* INPUT NOMOR TELPON PENERIMA */}
                            <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">{t.account.settings.recipientPhoneLabel}</label>
                              <Input
                                value={addr.phone ?? ""}
                                placeholder={profileData.phone}
                                onChange={e => updateAddressField(addr.id, 'phone', e.target.value)}
                                className="h-12 bg-white border border-black/10 font-bold rounded-sm"
                              />
                            </div>
                          </div>

                          {/* 🟢 2. SEKTOR BARU: GRID INPUT PECAHAN ALAMAT LENGKAP */}
                          {/* 🟢 SEKTOR PECAHAN ALAMAT YANG SUDAH DISESUAIKAN LOKAL */}
                          <div className="space-y-6 pt-6 border-t border-dashed border-black/5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                              {/* Input 1: RT / RW */}
                              <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">{t.account.settings.rtRwLabel}</label>
                                <Input
                                  value={(addr as any).houseRtRw || ""}
                                  placeholder={t.account.settings.rtRwPlaceholder}
                                  onChange={e => updateAddressField(addr.id, 'houseRtRw' as any, e.target.value)}
                                  className="h-12 bg-white border border-black/10 font-bold rounded-sm"
                                />
                              </div>

                              {/* Input 2: Blok / Dusun / Jalan */}
                              <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">{t.account.settings.streetAddressLabel}</label>
                                <Input
                                  value={(addr as any).street || ""}
                                  placeholder={t.account.settings.streetAddressPlaceholder}
                                  onChange={e => updateAddressField(addr.id, 'street' as any, e.target.value)}
                                  className="h-12 bg-white border border-black/10 font-bold rounded-sm"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Input 3: Desa / Kelurahan */}
                              <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">{t.account.settings.villageLabel}</label>
                                <Input
                                  value={(addr as any).village || ""}
                                  placeholder={t.account.settings.villagePlaceholder}
                                  onChange={e => updateAddressField(addr.id, 'village' as any, e.target.value)}
                                  className="h-12 bg-white border border-black/10 font-bold rounded-sm"
                                />
                              </div>

                              {/* Input 4: Patokan */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                  <label className="text-[9px] font-black uppercase tracking-widest text-stone-400">{t.account.settings.landmarkLabel}</label>
                                  <span className={`text-[9px] font-bold ${(((addr as any).patokan || '').length >= 100) ? 'text-red-500' : 'text-stone-400'}`}>
                                    {((addr as any).patokan || '').length}/100
                                  </span>
                                </div>
                                <Input
                                  maxLength={100}
                                  value={(addr as any).patokan || ""}
                                  placeholder={t.account.settings.landmarkPlaceholder}
                                  onChange={e => updateAddressField(addr.id, 'patokan', e.target.value)}
                                  className="h-12 bg-white border border-black/10 font-bold rounded-sm"
                                />
                              </div>
                            </div>
                          </div>

                          {/* 3. KOMPONEN PENCARIAN WILAYAH ADMISTRASI (CITY & POSTAL CODE) */}
                          <div className="pt-6 border-t border-dashed border-black/5">
                            <AddressInput
                              label={t.account.settings.districtCitySearchLabel}
                              value={{
                                address: addr.address,
                                city: addr.city,
                                postalCode: addr.postalCode,
                                area_id: addr.area_id,
                                district: addr.district,
                                province: addr.province,
                                regency: addr.regency,
                                patokan: addr.patokan
                              }}
                              onChange={(v) => {
                                updateAddressField(addr.id, 'address', v.address);
                                updateAddressField(addr.id, 'city', v.city);
                                updateAddressField(addr.id, 'postalCode', v.postalCode);
                                updateAddressField(addr.id, 'area_id', v.area_id);
                                updateAddressField(addr.id, 'district', v.district || '');
                                updateAddressField(addr.id, 'province', v.province || '');
                                updateAddressField(addr.id, 'regency', v.regency || '');
                                updateAddressField(addr.id, 'patokan', v.patokan || '');
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}

                      <div className="pt-10 flex justify-center">
                        <Button onClick={saveAllSettings} className="h-16 px-12 bg-stone-900 text-white rounded-sm font-black uppercase tracking-widest italic shadow-2xl hover:bg-[#367F4D] transition-all hover:-translate-y-1 active:scale-95 text-[11px]">
                          {t.account.settings.saveButton}
                        </Button>
                      </div>
                    </div> {/* Penutup space-y-8 di bawah judul */}
                  </div> {/* Penutup bg-white p-10 */}
                </motion.div>
              )}
              {activeTab === "b2b_registration" && (user?.b2b_status === 'PENDING' || user?.role === 'B2B') && (
                <motion.div key="b2b_registration" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="bg-white p-10 border border-black/5 shadow-sm rounded-sm">
                    {/* Status Badge */}
                    {user?.b2b_status?.toUpperCase() === 'PENDING' && (
                       <div className="flex items-center gap-4 bg-amber-50 border border-amber-100 p-4 rounded-xl mb-8">
                          <Clock className="text-amber-500" size={24} />
                          <div>
                             <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest">{t.account.b2b.pendingStatusTitle}</h4>
                             <p className="text-xs font-medium text-amber-700">{t.account.b2b.pendingStatusDesc}</p>
                          </div>
                       </div>
                    )}

                    {user?.b2b_status?.toUpperCase() === 'FLAGGED' && (
                       <div className="flex items-center gap-4 bg-orange-50 border border-orange-200 p-4 rounded-xl mb-8">
                          <AlertTriangle className="text-orange-500" size={24} />
                          <div>
                             <h4 className="text-sm font-black text-orange-900 uppercase tracking-widest">Dokumen Perlu Perhatian</h4>
                             <p className="text-xs font-medium text-orange-800">Kami menemukan kendala pada dokumen kontrak Anda (misal: buram, salah tanda tangan). Silakan perbaiki dan unggah ulang.</p>
                          </div>
                       </div>
                    )}

                    {user?.b2b_status?.toUpperCase() === 'SUSPENDED' && (
                       <div className="flex items-center gap-4 bg-red-50 border border-red-200 p-4 rounded-xl mb-8">
                          <Ban className="text-red-500" size={24} />
                          <div>
                             <h4 className="text-sm font-black text-red-900 uppercase tracking-widest">Akun Ditangguhkan</h4>
                             <p className="text-xs font-medium text-red-800">Akses B2B Anda sedang ditangguhkan sementara waktu. Silakan hubungi admin untuk informasi lebih lanjut.</p>
                          </div>
                       </div>
                    )}

                    {/* Documents - Scrapbook Style from /b2b/contract */}
                    <div className="bg-[#FDFBF7] p-8 md:p-12 border border-black/10 shadow-[8px_8px_0px_rgba(0,0,0,0.02)] rounded-none relative text-center overflow-visible mt-4">
                            {/* Grid Pattern */}
                            <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #367F4D 1px, transparent 1px), linear-gradient(to bottom, #367F4D 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            
                            {/* Tape */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/70 border border-black/5 rotate-[-2deg] z-20 backdrop-blur-sm shadow-sm"></div>
                            
                            <div className="space-y-3 relative z-10">
                              <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900 leading-none">{t.account.b2b.contractProtocolTitle}</h2>
                              <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">{t.account.b2b.legalFinalizationLabel}</p>
                              <p className="text-sm text-stone-600 font-medium leading-relaxed">
                                {t.account.b2b.partnershipAgreementText}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 pt-10 relative z-10">
                              <Button 
                                onClick={() => window.open(`/api/b2b/contract?profileId=${user.id}`, '_blank')}
                                className="w-full h-14 bg-white text-stone-900 border border-black/10 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-stone-50 transition-all shadow-[4px_4px_0_rgba(0,0,0,0.02)] hover:shadow-none"
                              >
                                 <Download size={14} className="mr-3" /> {t.account.b2b.downloadButton}
                              </Button>
                              
                              <div className="relative group">
                                {selectedContractFile ? (
                                  <div className="w-full flex flex-col items-center justify-center gap-4 bg-stone-50 border border-stone-200 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                      <FileText size={24} className="text-[#367F4D]" />
                                      <span className="text-xs font-bold text-stone-700 truncate max-w-[150px]">{selectedContractFile.name}</span>
                                    </div>
                                    <div className="flex w-full gap-3">
                                      <Button 
                                        variant="outline"
                                        onClick={() => setSelectedContractFile(null)}
                                        disabled={isContractUploading}
                                        className="flex-1 text-[10px] uppercase font-bold tracking-widest border-stone-300 text-stone-600 hover:bg-stone-100 hover:text-stone-900 bg-white"
                                      >
                                        Batal
                                      </Button>
                                      <Button 
                                        onClick={confirmContractUpload}
                                        disabled={isContractUploading}
                                        className="flex-1 bg-[#367F4D] hover:bg-[#2A653C] text-white text-[10px] uppercase font-bold tracking-widest"
                                      >
                                        {isContractUploading ? <Loader2 className="animate-spin" size={14} /> : "Submit"}
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                     <label 
                                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                        onDrop={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          const file = e.dataTransfer.files?.[0];
                                          if (!file || !user) return;
                                          setSelectedContractFile(file);
                                        }}
                                        className="h-32 w-full bg-white border-2 border-dashed border-black/10 rounded-sm flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#367F4D] transition-all group-hover:bg-stone-50">
                                        <Upload size={24} className="text-stone-300 group-hover:text-[#367F4D]" />
                                        <div className="text-center pointer-events-none">
                                           <p className="text-[10px] font-black uppercase tracking-widest text-stone-900">{t.account.b2b.uploadDropzoneTitle}</p>
                                           <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mt-1">{t.account.b2b.uploadDropzoneFormat}</p>
                                        </div>
                                        <input type="file" className="hidden" accept="application/pdf" onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (!file || !user) return;
                                          setSelectedContractFile(file);
                                        }} />
                                     </label>
                                )}
                              </div>
                            </div>
                         </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function B2BSettingsPage() {
  const t = useI18n();
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 italic">{t.account.loading.initializing}</p>
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
