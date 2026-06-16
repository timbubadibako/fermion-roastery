"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Sticker } from "@/components/ui/sticker";
import {
  User, LogOut, Package, Settings,
  Clock, Truck, CheckCircle2, ChevronRight,
  Coffee, ArrowRight, Loader2, Receipt,
  LayoutDashboard, Navigation, Ban, Search,
  MapPin, Phone, Info, Globe, Crosshair
} from "lucide-react";
import { AddressInput } from "@/components/address-input";


interface Order {
  id: string;
  total_amount: string;
  status: string;
  created_at: string;
  shipping_awb?: string;
  shipping_courier?: string;
  biteship_order_id?: string;
  rejection_reason?: string;
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

export default function RetailAccountPage() {
  const { user, logout, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingHistory, setTrackingHistory] = useState<any[]>([]);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);

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
    { id: 'primary', label: 'Alamat Utama', name: '', phone: '', address: '', patokan: '', city: '', district: '', province: '', postalCode: '', area_id: '', isPrimary: true },
    { id: '2', label: 'Alamat 2', name: '', phone: '', address: '', patokan: '', city: '', district: '', province: '', postalCode: '', area_id: '', isPrimary: false },
    { id: '3', label: 'Alamat 3', name: '', phone: '', address: '', patokan: '', city: '', district: '', province: '', postalCode: '', area_id: '', isPrimary: false }
  ]);

  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/auth/profile/${user?.id}`);
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

  const fetchTracking = async (order: Order) => {
    if (activeTrackingId === order.id) { setActiveTrackingId(null); return; }
    setActiveTrackingId(order.id);
    setIsTrackingLoading(true);
    try {
      // Logic for fetching tracking from biteship or internal API
      const res = await fetch(`/api/shipping/trackings/${order.shipping_awb || order.id}`);
      if (res.ok) {
        const data = await res.json();
        setTrackingHistory(data.history || []);
      }
    } catch (e) { console.error("Tracking error"); } finally { setIsTrackingLoading(false); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders/my-orders?profileId=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) { toast.error("Gagal memuat daftar pesanan."); } finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); window.location.href = "/auth"; };

  const saveAllSettings = async () => {
    try {
      const res = await fetch(`/api/auth/profile/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profileData,
          addresses: addresses
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Pengaturan profil dan alamat tersimpan.");
        setUser(data.profile);
      } else {
        toast.error("Gagal menyimpan perubahan.");
      }
    } catch (e) { toast.error("Gagal terhubung ke server."); }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation tidak didukung browser.");
      return;
    }
    toast.loading("Mendeteksi lokasi...");
    navigator.geolocation.getCurrentPosition((pos) => {
      // Mock reverse geocode
      setTimeout(() => {
        toast.dismiss();
        setProfileData(prev => ({
          ...prev,
          address: `Sekitar Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`,
          city: "Cirebon",
          district: "Kesambi",
          province: "Jawa Barat",
          postalCode: "45131"
        }));
        toast.success("Lokasi terdeteksi! Silakan lengkapi detailnya.");
      }, 1000);
    }, () => {
      toast.dismiss();
      toast.error("Akses lokasi ditolak.");
    });
  };

  const updateAddressField = (id: string, field: keyof AddressDetail, value: string) => {
    setAddresses(prev => prev.map(addr => addr.id === id ? { ...addr, [field]: value } : addr));
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 italic">Accessing Laboratory Hub...</p>
    </div>
  );

  const recentOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-6 font-sans relative overflow-hidden">

      {/* Subtle Background Texture */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.02]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">

        {/* Simplified Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/5 pb-10">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl font-cloude italic tracking-tighter text-slate-900 leading-none">Account Hub<span className="text-[#367F4D]">.</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Scientist: {user?.full_name}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-red-500 transition-colors">
            <LogOut size={14} /> Keluar dari Sistem
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Navigation Sidebar (Professional Minimal) */}
          <div className="lg:col-span-3 space-y-1">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "orders", label: "Order Records", icon: Package },
              { id: "settings", label: "Lab Settings", icon: Settings }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${isActive
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-transparent text-stone-400 hover:text-slate-600"
                    }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">

              {/* OVERVIEW */}
              {activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="bg-white p-10 border border-black/5 shadow-sm rounded-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10 space-y-6">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 italic flex items-center gap-2">
                        <Clock size={14} className="text-[#367F4D]" /> Status Pesanan Terakhir
                      </h3>
                      {recentOrder ? (
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                          <div className="space-y-2">
                            <h4 className="text-2xl font-bold tracking-tight text-slate-900">Order #{recentOrder.id.slice(0, 8).toUpperCase()}</h4>
                            <div className="flex items-center gap-3">
                              <div className="px-3 py-1 bg-stone-900 text-white text-[8px] font-black uppercase tracking-widest rounded-full">{recentOrder.status}</div>
                              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{new Date(recentOrder.created_at).toLocaleDateString('id-ID')}</p>
                            </div>
                          </div>
                          <Link href="/account?tab=orders" onClick={() => setActiveTab("orders")}>
                            <Button className="h-12 bg-white border border-black/10 text-slate-900 font-black uppercase tracking-widest text-[9px] hover:bg-stone-50 rounded-sm italic shadow-sm px-8">Lihat Detail <ArrowRight size={14} className="ml-2" /></Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="py-8 text-center bg-stone-50 border border-dashed border-black/10 rounded-sm">
                          <Coffee size={24} className="mx-auto text-stone-200 mb-2" />
                          <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Belum ada ritual aktif.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 border border-black/5 rounded-sm shadow-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2"><Receipt size={14} /> Total Pembelian</h4>
                      <div className="text-4xl font-bold tracking-tight text-slate-900">{orders.length} <span className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400 ml-2">Pesanan</span></div>
                    </div>
                    <div className="bg-white p-8 border border-black/5 rounded-sm shadow-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2"><User size={14} /> Keanggotaan</h4>
                      <div className="text-xl font-bold tracking-tight text-slate-900">Retail Ritualist</div>
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-2">Since {new Date(user?.created_at || Date.now()).getFullYear()}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ORDERS */}
              {activeTab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div className="bg-white p-10 border border-black/5 rounded-sm shadow-sm space-y-10">
                    <div className="flex justify-between items-center border-b border-black/5 pb-6">
                      <h3 className="text-3xl font-cloude italic tracking-tighter text-slate-900">Lab Records<span className="text-[#367F4D]">.</span></h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-300">{orders.length} Pesanan</span>
                    </div>

                    {orders.length === 0 ? (
                      <div className="py-20 text-center space-y-6">
                        <Package size={48} className="mx-auto text-stone-100" />
                        <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest italic">Arsip pesanan tidak ditemukan.</p>
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
                                  <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest mb-1 italic">Total</p>
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
                                          <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Kurir & Resi</p>
                                          <p className="text-xs font-bold text-slate-900 uppercase">{order.shipping_courier || 'Pending'} • {order.shipping_awb || 'Menunggu Resi'}</p>
                                        </div>
                                      </div>
                                      {isTrackingLoading && <Loader2 size={14} className="animate-spin text-stone-300" />}
                                    </div>

                                    {/* Status Timeline */}
                                    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-stone-200">
                                      <div className="relative flex items-start gap-4">
                                        <div className={`w-[11px] h-[11px] rounded-full mt-1.5 z-10 border-2 border-white shadow-sm ${['PAID', 'ROASTING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-[#367F4D]' : 'bg-stone-200'}`} />
                                        <div>
                                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-tight">Confirmed</p>
                                          <p className="text-[8px] font-bold text-stone-400 uppercase mt-0.5">Order verified and paid.</p>
                                        </div>
                                      </div>
                                      <div className="relative flex items-start gap-4">
                                        <div className={`w-[11px] h-[11px] rounded-full mt-1.5 z-10 border-2 border-white shadow-sm ${['ROASTING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-[#367F4D]' : 'bg-stone-200'}`} />
                                        <div>
                                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-tight">Roasting</p>
                                          <p className="text-[8px] font-bold text-stone-400 uppercase mt-0.5">Beans are being precision roasted.</p>
                                        </div>
                                      </div>
                                      <div className="relative flex items-start gap-4">
                                        <div className={`w-[11px] h-[11px] rounded-full mt-1.5 z-10 border-2 border-white shadow-sm ${['SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-[#367F4D]' : 'bg-stone-200'}`} />
                                        <div>
                                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-tight">Shipped</p>
                                          <p className="text-[8px] font-bold text-stone-400 uppercase mt-0.5">On the way to your laboratory.</p>
                                        </div>
                                      </div>
                                      <div className="relative flex items-start gap-4">
                                        <div className={`w-[11px] h-[11px] rounded-full mt-1.5 z-10 border-2 border-white shadow-sm ${order.status === 'DELIVERED' ? 'bg-[#367F4D]' : 'bg-stone-200'}`} />
                                        <div>
                                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-tight">Delivered</p>
                                          <p className="text-[8px] font-bold text-stone-400 uppercase mt-0.5">Successfully dispatched.</p>
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

              {/* SETTINGS */}
              {activeTab === "settings" && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="bg-white p-10 border border-black/5 rounded-sm shadow-sm space-y-12">
                    <div className="flex justify-between items-center border-b border-black/5 pb-6">
                      <h3 className="text-3xl font-bold tracking-tight text-slate-900">Lab Settings</h3>
                      <div className="w-10 h-10 rounded-full bg-stone-50 border border-black/5 flex items-center justify-center text-stone-300">
                        <Settings size={16} />
                      </div>
                    </div>

                    {/* Profile Identity */}
                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
                          <User size={14} />
                        </div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">Identitas Peneliti</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Nama Lengkap</label>
                          <Input value={profileData.fullName} onChange={e => setProfileData({ ...profileData, fullName: e.target.value })} className="h-12 bg-stone-50/50 border border-black/5 font-bold rounded-sm shadow-inner" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Nomor Kontak WhatsApp</label>
                          <div className="relative">
                            <Input value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} placeholder="08..." className="h-12 bg-stone-50/50 border border-black/5 font-bold rounded-sm pl-12 shadow-inner" />
                            <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Multi-Address Management */}
                    <div className="space-y-8 pt-10 border-t border-dashed border-black/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#367F4D] text-white flex items-center justify-center shadow-md">
                            <MapPin size={14} />
                          </div>
                          <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">Buku Alamat Pengiriman</h4>
                        </div>
                        <Button onClick={useCurrentLocation} variant="outline" className="h-10 text-[9px] font-black uppercase tracking-widest border-black/10 hover:bg-stone-50 gap-2 shadow-sm rounded-sm">
                          <Crosshair size={12} /> Gunakan Lokasi Saat Ini
                        </Button>
                      </div>

                      {/* Address Tabs */}
                      <div className="flex gap-2 p-1 bg-stone-50 rounded-sm border border-black/5">
                        {addresses.map(addr => (
                          <button
                            key={addr.id}
                            onClick={() => setEditingAddressId(addr.id)}
                            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all rounded-sm ${(editingAddressId === addr.id || (!editingAddressId && addr.isPrimary))
                              ? 'bg-white shadow-sm text-slate-900 border border-black/5'
                              : 'text-stone-400 hover:text-stone-600'
                              }`}
                          >
                            {addr.label} {addr.isPrimary && "★"}
                          </button>
                        ))}
                      </div>

                      {/* Address Form (Filtered by Active Tab) */}
                      {addresses.filter(a => editingAddressId ? a.id === editingAddressId : a.isPrimary).map(addr => (
                        <motion.div key={addr.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 p-8 border border-dashed border-black/10 rounded-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Nama Penerima</label>
                              <Input value={addr.name || profileData.fullName} onChange={e => updateAddressField(addr.id, 'name', e.target.value)} className="h-12 bg-white border border-black/10 font-bold rounded-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Nomor Telpon Penerima</label>
                              <Input value={addr.phone || profileData.phone} onChange={e => updateAddressField(addr.id, 'phone', e.target.value)} className="h-12 bg-white border border-black/10 font-bold rounded-sm" />
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Patokan / Detail Tambahan</label>
                              <Input value={addr.patokan} onChange={e => updateAddressField(addr.id, 'patokan', e.target.value)} placeholder="Contoh: Pagar Merah, Depan Indomaret..." className="h-12 bg-white border border-black/10 font-bold rounded-sm" />
                            </div>

                            {/* Integrated Biteship Area Search */}
                            <div className="pt-4">
                              <AddressInput
                                label="Cari Kecamatan / Kota"
                                value={{
                                  address: addr.address,
                                  city: addr.city,
                                  postalCode: addr.postalCode,
                                  area_id: addr.area_id,
                                  district: addr.district,
                                  province: addr.province,
                                  regency: addr.regency
                                }}
                                onChange={(v) => {
                                  updateAddressField(addr.id, 'address', v.address);
                                  updateAddressField(addr.id, 'city', v.city);
                                  updateAddressField(addr.id, 'postalCode', v.postalCode);
                                  updateAddressField(addr.id, 'area_id', v.area_id);
                                  updateAddressField(addr.id, 'district', v.district || '');
                                  updateAddressField(addr.id, 'province', v.province || '');
                                  updateAddressField(addr.id, 'regency', v.regency || '');
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Action Footer */}
                    <div className="pt-10 flex justify-center">
                      <Button onClick={saveAllSettings} className="h-16 px-12 bg-stone-900 text-white rounded-sm font-black uppercase tracking-widest italic shadow-2xl hover:bg-[#367F4D] transition-all hover:-translate-y-1 active:scale-95 text-[11px]">
                        Konfirmasi & Simpan Semua Perubahan
                      </Button>
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
