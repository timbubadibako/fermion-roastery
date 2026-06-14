"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, LogOut, Package, MapPin, Settings, 
  Clock, Truck, CheckCircle2, ChevronRight, 
  Coffee, ArrowRight, Loader2, Receipt,
  LayoutDashboard, Navigation, Ban
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

interface Order {
  id: string;
  total_amount: string;
  status: string;
  created_at: string;
  shipping_awb?: string;
  shipping_courier?: string;
  items: any[];
}

export default function RetailAccountPage() {
  const { user, logout, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingHistory, setTrackingHistory] = useState<any[]>([]);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [isTrackingExpanded, setIsTrackingExpanded] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    fullName: user?.full_name || "",
    phone: "",
    address: "",
    city: "",
    postalCode: ""
  });

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
          postalCode: data.postal_code || ""
        });
      }
    } catch (e) {
      console.error("Failed to load profile");
    }
  };

  const fetchTracking = async (id: string) => {
    if (isTrackingExpanded) {
      setIsTrackingExpanded(false);
      return;
    }
    
    setIsTrackingExpanded(true);
    if (trackingHistory.length > 0) return;

    setIsTrackingLoading(true);
    try {
      // Biteship needs waybill_id or order_id
      const res = await fetch(`/api/shipping/trackings/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTrackingHistory(data.history || []);
      }
    } catch (e) {
      console.error("Failed to load tracking history");
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders/my-orders?profileId=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      toast.error("Failed to load your coffee rituals.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/auth";
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/auth/profile/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Profile and address saved successfully");
        setUser(data.profile);
      } else {
        toast.error(data.message || "Failed to save changes");
      }
    } catch (e: any) {
      console.error("Update Profile Error:", e);
      toast.error("Protocol communication failure. Please check your connection.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Preparing your space...</p>
    </div>
  );

  const recentOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-20 px-6 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] bg-fermion-french-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-white border border-slate-200 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest mb-2 shadow-sm">
              Personal Account
            </span>
            <h1 className="display-font text-5xl md:text-6xl font-black italic tracking-tighter text-slate-900 leading-none">
              Your Rituals.
            </h1>
            <p className="text-slate-500 font-medium text-sm">Welcome back, {user?.full_name}. Track and manage your coffee journey.</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="rounded-2xl h-12 px-6 border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all font-black uppercase tracking-widest text-[10px] gap-2 shadow-sm"
          >
            <LogOut size={16} /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="lg:col-span-3 space-y-4 sticky top-32">
            <nav className="flex flex-col gap-2">
              {[
                { id: "overview", label: "Overview", icon: LayoutDashboard },
                { id: "orders", label: "Order History", icon: Package },
                { id: "settings", label: "Profile & Address", icon: Settings }
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      isActive 
                        ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" 
                        : "bg-white text-slate-400 border border-slate-100 hover:border-slate-300 hover:text-slate-600 shadow-sm"
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                )
              })}
            </nav>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mt-8 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Need Help?</h4>
              <p className="text-xs text-slate-500 font-medium">Have questions about your order or our beans?</p>
              <Button variant="outline" className="w-full rounded-xl border-slate-200 text-[9px] font-black uppercase tracking-widest">
                Contact Laboratory
              </Button>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              
              {/* ================= OVERVIEW TAB ================= */}
              {activeTab === "overview" && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* ACTIVE ORDER TRACKER */}
                  <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-slate-100 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                      <Truck size={120} />
                    </div>
                    
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Latest Order Status</h3>
                    
                    {recentOrder ? (
                      <div className="space-y-10 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                          <div>
                            <h4 className="display-font text-3xl font-black italic text-slate-900 tracking-tighter">Order #{recentOrder.id.slice(0, 8).toUpperCase()}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Dipesan pada {new Date(recentOrder.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                          {recentOrder.shipping_awb && (
                            <div className="text-left md:text-right">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nomor Resi ({recentOrder.shipping_courier})</p>
                              <p className="text-sm font-bold text-fermion-french-blue font-mono">{recentOrder.shipping_awb}</p>
                            </div>
                          )}
                        </div>

                        {recentOrder.status === 'CANCELLED' ? (
                          <div className="bg-red-50 border border-red-100 p-8 rounded-[2.5rem] flex items-center gap-6">
                             <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-500/20">
                                <Ban size={20} />
                             </div>
                             <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-red-600 mb-1">Pesanan Dibatalkan</h4>
                                <p className="text-xs text-red-400 font-medium">Alasan: {recentOrder.rejection_reason || "Kendala teknis pada laboratorium."}</p>
                             </div>
                          </div>
                        ) : (
                          <div className="relative pt-4 px-2">
                             <div className="absolute top-8 left-0 w-full h-1 bg-slate-100 rounded-full" />
                             
                             {/* Progress Fill */}
                             <div className={`absolute top-8 left-0 h-1 rounded-full transition-all duration-1000 ${
                               recentOrder.status === 'UNPAID' ? 'w-[10%] bg-amber-400' :
                               recentOrder.status === 'PAID' ? 'w-[30%] bg-fermion-french-blue' : 
                               recentOrder.status === 'READY_TO_SHIP' ? 'w-[50%] bg-fermion-french-blue' : 
                               recentOrder.status === 'ROASTING' ? 'w-[70%] bg-fermion-french-blue' : 
                               ['SHIPPED', 'DELIVERED'].includes(recentOrder.status) ? 'w-[100%] bg-fermion-french-blue' : 'w-0'
                             }`} />

                             <div className="flex justify-between relative z-10">
                                {/* Step 1: Payment */}
                                <div className="flex flex-col items-center gap-3">
                                   <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${
                                     ['UNPAID', 'PAID', 'READY_TO_SHIP', 'ROASTING', 'SHIPPED', 'DELIVERED'].includes(recentOrder.status) ? 'bg-white border-fermion-french-blue shadow-lg' : 'bg-white border-slate-200 text-slate-300'
                                   }`}>
                                      {recentOrder.status === 'UNPAID' ? <Clock size={16} className="text-amber-500 animate-pulse" /> : <CheckCircle2 size={16} className="text-fermion-french-blue" />}
                                   </div>
                                   <p className={`text-[8px] font-black uppercase tracking-widest text-center w-20 ${['UNPAID', 'PAID', 'READY_TO_SHIP', 'ROASTING', 'SHIPPED', 'DELIVERED'].includes(recentOrder.status) ? 'text-slate-900' : 'text-slate-400'}`}>
                                     {recentOrder.status === 'UNPAID' ? 'Menunggu Bayar' : 'Sudah Dibayar'}
                                   </p>
                                </div>

                                {/* Step 2: Processing */}
                                <div className="flex flex-col items-center gap-3">
                                   <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${
                                     ['PAID', 'READY_TO_SHIP', 'ROASTING', 'SHIPPED', 'DELIVERED'].includes(recentOrder.status) ? 'bg-white border-fermion-french-blue shadow-lg' : 'bg-white border-slate-200 text-slate-300'
                                   }`}>
                                      <Package size={16} className={['PAID', 'READY_TO_SHIP', 'ROASTING', 'SHIPPED', 'DELIVERED'].includes(recentOrder.status) ? "text-fermion-french-blue" : ""} />
                                   </div>
                                   <p className={`text-[8px] font-black uppercase tracking-widest text-center w-20 ${['PAID', 'READY_TO_SHIP', 'ROASTING', 'SHIPPED', 'DELIVERED'].includes(recentOrder.status) ? 'text-slate-900' : 'text-slate-400'}`}>Diproses</p>
                                </div>

                                {/* Step 3: Roasting */}
                                <div className="flex flex-col items-center gap-3">
                                   <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${
                                     ['ROASTING', 'SHIPPED', 'DELIVERED'].includes(recentOrder.status) ? 'bg-white border-fermion-french-blue shadow-lg' : 'bg-white border-slate-200 text-slate-300'
                                   }`}>
                                      {recentOrder.status === 'ROASTING' ? <div className="w-4 h-4 border-2 border-fermion-french-blue border-t-transparent rounded-full animate-spin" /> : <Coffee size={16} className={['ROASTING', 'SHIPPED', 'DELIVERED'].includes(recentOrder.status) ? "text-fermion-french-blue" : ""} />}
                                   </div>
                                   <p className={`text-[8px] font-black uppercase tracking-widest text-center w-20 ${['ROASTING', 'SHIPPED', 'DELIVERED'].includes(recentOrder.status) ? 'text-slate-900' : 'text-slate-400'}`}>Dipanggang</p>
                                </div>

                                {/* Step 4: Shipped */}
                                <div className="flex flex-col items-center gap-3">
                                   <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${
                                     ['SHIPPED', 'DELIVERED'].includes(recentOrder.status) ? 'bg-white border-fermion-french-blue shadow-lg' : 'bg-white border-slate-200 text-slate-300'
                                   }`}>
                                      <Truck size={16} className={['SHIPPED', 'DELIVERED'].includes(recentOrder.status) ? "text-fermion-french-blue" : ""} />
                                   </div>
                                   <p className={`text-[8px] font-black uppercase tracking-widest text-center w-20 ${['SHIPPED', 'DELIVERED'].includes(recentOrder.status) ? 'text-slate-900' : 'text-slate-400'}`}>Dikirim</p>
                                </div>
                             </div>
                          </div>
                        )}

                        {recentOrder.status === 'SHIPPED' && (
                          <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                              <Button 
                                onClick={() => fetchTracking(recentOrder.shipping_awb || recentOrder.biteship_order_id || "")}
                                className="flex-1 bg-slate-900 text-white hover:bg-fermion-french-blue rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] italic transition-all"
                              >
                                 {isTrackingExpanded ? "Tutup Detail Paket" : "Pantau Detail Paket"} <Navigation size={14} className="ml-2" />
                              </Button>
                              <Button 
                                variant="outline"
                                className="flex-1 border-slate-200 text-slate-400 hover:text-slate-900 rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] transition-all"
                              >
                                 Konfirmasi Diterima
                              </Button>
                            </div>

                            <AnimatePresence>
                               {isTrackingExpanded && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                  >
                                     <div className="bg-slate-50 rounded-[2.5rem] p-10 space-y-8">
                                        <div className="flex items-center justify-between">
                                           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Riwayat Perjalanan</h4>
                                           <p className="text-[9px] font-bold text-slate-400 uppercase">{recentOrder.shipping_courier}</p>
                                        </div>

                                        {isTrackingLoading ? (
                                           <div className="flex flex-col items-center py-10 gap-4">
                                              <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                              <p className="text-[9px] font-black uppercase text-slate-400">Menghubungi Kurir...</p>
                                           </div>
                                        ) : trackingHistory.length === 0 ? (
                                           <div className="py-10 text-center">
                                              <p className="text-[10px] font-bold text-slate-400 uppercase italic">Data belum tersedia di sistem kurir.</p>
                                           </div>
                                        ) : (
                                           <div className="space-y-8 relative">
                                              <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-200" />
                                              {trackingHistory.map((step, idx) => (
                                                <div key={idx} className="flex gap-8 relative z-10">
                                                   <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm shrink-0 ${idx === 0 ? 'bg-fermion-french-blue' : 'bg-slate-300'}`} />
                                                   <div className="space-y-1">
                                                      <p className={`text-xs font-black uppercase tracking-tight ${idx === 0 ? 'text-slate-900' : 'text-slate-500'}`}>{step.note}</p>
                                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(step.updated_at).toLocaleString('id-ID')}</p>
                                                   </div>
                                                </div>
                                              ))}
                                           </div>
                                        )}
                                     </div>
                                  </motion.div>
                               )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-10 text-center space-y-4">
                        <Package size={48} className="mx-auto text-slate-200" />
                        <p className="text-slate-500 font-medium">You don't have any active orders.</p>
                        <Link href="/our-coffee">
                          <Button className="bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Start Shopping</Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* QUICK STATS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                           <Coffee size={24} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Total Orders</p>
                           <p className="text-3xl font-black italic tracking-tighter text-slate-900">{orders.length}</p>
                        </div>
                     </div>
                     <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                           <Receipt size={24} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Total Spent</p>
                           <p className="text-2xl font-black italic tracking-tighter text-slate-900">
                             Rp {orders.reduce((acc, o) => acc + parseInt(o.total_amount), 0).toLocaleString('id-ID')}
                           </p>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {/* ================= ORDERS HISTORY TAB ================= */}
              {activeTab === "orders" && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden"
                >
                  <div className="p-10 border-b border-slate-50">
                    <h3 className="display-font text-3xl font-black italic tracking-tighter text-slate-900">Order Ledger.</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">Review your past purchases and download invoices.</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <tr>
                          <th className="p-8">Order ID & Date</th>
                          <th className="p-8">Status</th>
                          <th className="p-8">Total Amount</th>
                          <th className="p-8 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.length === 0 ? (
                          <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No order history found.</td></tr>
                        ) : (
                          orders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="p-8">
                                <p className="font-black text-slate-900 uppercase tracking-tight text-sm mb-1">#{order.id.slice(0, 8)}</p>
                                <p className="text-[10px] font-bold text-slate-400">{new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              </td>
                              <td className="p-8">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                  order.status === 'SHIPPED' ? 'bg-emerald-50 text-emerald-600' :
                                  order.status === 'ROASTING' ? 'bg-fermion-french-blue/10 text-fermion-french-blue' :
                                  'bg-slate-100 text-slate-500'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="p-8 font-mono text-xs font-bold text-slate-700">
                                Rp {parseInt(order.total_amount).toLocaleString('id-ID')}
                              </td>
                              <td className="p-8 text-right">
                                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 rounded-xl">
                                  View Details <ChevronRight size={14} className="ml-1" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* ================= SETTINGS TAB ================= */}
              {activeTab === "settings" && (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-slate-100 shadow-xl">
                    <h3 className="display-font text-3xl font-black italic tracking-tighter text-slate-900 mb-2">Profile Details.</h3>
                    <p className="text-xs text-slate-500 font-medium mb-10">Manage your personal information and contact details.</p>
                    
                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                          <Input value={profileData.fullName} onChange={e => setProfileData({...profileData, fullName: e.target.value})} className="h-14 bg-slate-50 border-none rounded-2xl font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                          <Input value={user?.email || ""} disabled className="h-14 bg-slate-50 border-none rounded-2xl font-bold text-slate-400 cursor-not-allowed" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp / Phone Number</label>
                          <Input value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} placeholder="+62..." className="h-14 bg-slate-50 border-none rounded-2xl font-bold" />
                        </div>
                      </div>

                      <div className="pt-8 border-t border-slate-50">
                        <h3 className="display-font text-2xl font-black italic tracking-tighter text-slate-900 mb-6">Default Shipping Address</h3>
                        <div className="grid grid-cols-1 gap-6">
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Street Address</label>
                              <Input value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} placeholder="Jl. Sudirman No..." className="h-14 bg-slate-50 border-none rounded-2xl font-bold" />
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                                <Input value={profileData.city} onChange={e => setProfileData({...profileData, city: e.target.value})} placeholder="Jakarta" className="h-14 bg-slate-50 border-none rounded-2xl font-bold" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Postal Code</label>
                                <Input value={profileData.postalCode} onChange={e => setProfileData({...profileData, postalCode: e.target.value})} placeholder="12345" className="h-14 bg-slate-50 border-none rounded-2xl font-bold font-mono" />
                              </div>
                           </div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full md:w-auto h-14 px-10 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] italic shadow-xl hover:bg-fermion-french-blue transition-all">
                        Save Preferences
                      </Button>
                    </form>
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
