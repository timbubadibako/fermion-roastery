"use client";

import { apiFetch } from "@/lib/api";
import React, { useState, useEffect } from "react";
import {
   Package,
   TrendingUp,
   Calendar,
   CreditCard,
   ArrowUpRight,
   ShieldCheck,
   History,
   Coffee,
   Info,
   CheckCircle2,
   Lock,
   ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";

export default function B2BOverview() {
   const { user } = useAuthStore();
   const [partner, setPartner] = useState<any>(null);
   const [stats, setStats] = useState({ volume: 0, savings: 0 });
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (user) fetchData();
   }, [user]);

   const fetchData = async () => {
      try {
         // 🎯 REFACTOR ENDPOINT: Alihkan dari /api/admin/... ke jalur /api/b2b/... atau jalur yang lolos dari verifyAdmin
         // Jika di backend lu endpoint-nya adalah /api/b2b/partner-status:
         const [pRes, oRes] = await Promise.all([
            apiFetch(`/api/b2b/partner-status?profileId=${user?.id}`), // 💡 Sesuaikan dengan endpoint B2B profile di backend lu, JANGAN pakai /api/admin/
            apiFetch(`/api/orders/my-orders?profileId=${user?.id}`)
         ]);

         if (pRes.ok) {
            const data = await pRes.json();
            // Handle jika data yang dikembalikan berupa array atau object tunggal
            if (Array.isArray(data)) {
               setPartner(data.find((p: any) => p.profile_id === user?.id));
            } else {
               setPartner(data);
            }
         }

         if (oRes.ok) {
            const orders = await oRes.json();
            const vol = orders.filter((o: any) => ['PAID', 'SHIPPED', 'DELIVERED'].includes(o.status))
               .reduce((acc: number, o: any) => acc + (parseFloat(o.total_amount) / 120000), 0); // Simulated KG logic
            setStats({ volume: vol, savings: vol * 10000 });
         }
      } catch (error) {
         console.error("B2B dashboard fetch error:", error);
      } finally {
         setLoading(false);
      }
   };

   if (loading) return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
         <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
         <p className="text-[10px] font-black uppercase tracking-[0.3em]">Menyinkronkan Data Mitra...</p>
      </div>
   );

   const silverThreshold = 15;
   const progress = Math.min(100, Math.round((stats.volume / silverThreshold) * 100));

   return (
      <div className="space-y-12 text-left">
         {/* HEADER */}
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 pb-10">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#367F4D]/5 border border-[#367F4D]/10 rounded-full">
                     <div className="w-1.5 h-1.5 bg-[#367F4D] rounded-full" />
                     <span className="text-[9px] font-black text-[#367F4D] uppercase tracking-widest">Mitra Bisnis Resmi</span>
                  </div>
                  <span className="bg-stone-100 text-slate-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-black/5">Level: {partner?.tier_name || 'Bronze'}</span>
               </div>
               <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">Pusat <br /> Kemitraan.</h1>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 leading-relaxed">Selamat datang kembali, {user?.full_name?.split(' ')[0]}. Ringkasan aktivitas grosir Anda.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* PROGRESS RING CARD */}
            <div className="lg:col-span-4 bg-white border border-black/5 rounded-sm p-12 flex flex-col items-center justify-center text-center space-y-10 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
               <div className="relative w-56 h-56 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90">
                     <circle cx="112" cy="112" r="100" stroke="#f8fafc" strokeWidth="12" fill="transparent" />
                     <motion.circle
                        cx="112" cy="112" r="100"
                        stroke="#367F4D"
                        strokeWidth={12}
                        fill="transparent"
                        strokeDasharray="628"
                        initial={{ strokeDashoffset: 628 }}
                        animate={{ strokeDashoffset: 628 - (progress / 100 * 628) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                     />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                     <p className="text-6xl font-black italic tracking-tighter text-slate-900 leading-none">{stats.volume.toFixed(1)}</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">/ 15.0 KG</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <h4 className="font-bold uppercase tracking-tight text-sm text-slate-900">Progres Level Silver</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed px-4">
                     {stats.volume >= 15
                        ? "Target tercapai. Upgrade level tersedia pada siklus berikutnya."
                        : `Kurang ${(15 - stats.volume).toFixed(1)}kg lagi untuk mengunci diskon Rp 15.000/kg bulan depan.`}
                  </p>
               </div>
            </div>

            {/* SHOP GATEWAY & STATS */}
            <div className="lg:col-span-8 space-y-10">
               <div className="p-12 rounded-sm bg-slate-900 text-white flex items-center justify-between relative overflow-hidden group shadow-2xl border border-black">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-3xl -mr-40 -mt-40" />
                  <div className="space-y-8 relative z-10 flex-1">
                     <div className="space-y-3">
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] bg-white text-slate-950 px-3 py-1 rounded-sm">COMMERCIAL_GATEWAY</span>
                        <h3 className="font-display text-5xl italic font-bold tracking-tighter leading-none">Katalog <br /> Grosir.</h3>
                     </div>
                     <p className="text-[11px] text-slate-400 font-medium tracking-wider uppercase leading-relaxed max-w-sm">Amankan batch kopi berikutnya dengan harga khusus mitra yang telah dikunci.</p>
                     <Link href="/b2b/shop" className="block">
                        <Button className="bg-white text-slate-950 px-10 h-14 rounded-sm font-black uppercase tracking-widest italic text-[10px] hover:bg-[#367F4D] hover:text-white transition-all shadow-xl border-none">
                           Masuk Toko <ArrowRight className="ml-2" size={16} />
                        </Button>
                     </Link>
                  </div>
                  <div className="w-48 h-48 bg-white/5 rounded-sm rotate-12 flex items-center justify-center opacity-30 group-hover:rotate-0 transition-transform duration-700 pointer-events-none border border-white/5">
                     <Coffee size={80} strokeWidth={1} />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  <div className="bg-white border border-black/5 p-10 rounded-sm space-y-4 shadow-sm group hover:shadow-xl transition-all duration-300">
                     <div className="flex justify-between items-start">
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest italic leading-none">Total Penghematan</p>
                        <TrendingUp size={14} className="text-[#367F4D]" />
                     </div>
                     <h4 className="text-4xl font-bold tracking-tight text-slate-900">Rp {stats.savings.toLocaleString('id-ID')}</h4>
                     <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Kalkulasi vs Harga Retail</p>
                  </div>
                  <div className="bg-white border border-black/5 p-10 rounded-sm space-y-4 shadow-sm group hover:shadow-xl transition-all duration-300">
                     <div className="flex justify-between items-start">
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest italic leading-none">Kontrak Berjalan</p>
                        <Calendar size={14} className="text-[#367F4D]" />
                     </div>
                     <h4 className="text-4xl font-bold tracking-tight text-slate-900">134 <span className="text-lg text-slate-300 font-medium">HARI</span></h4>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kemitraan Aktif</span>
                     </div>
                  </div>
               </div>
            </div>

         </div>

         {/* MAINTENANCE & SERVICE CARD */}
         <div className="bg-slate-950 p-12 rounded-sm text-white flex items-center justify-between relative overflow-hidden grayscale opacity-50 group border border-black shadow-2xl">
            <div className="space-y-6 relative z-10">
               <div className="flex items-center gap-4 text-left">
                  <div className="w-14 h-14 bg-white/10 rounded-sm flex items-center justify-center text-white"><ShieldCheck size={28} /></div>
                  <h3 className="font-display text-4xl italic font-bold tracking-tighter text-white">Layanan <br /> Premium Fermion.</h3>
               </div>
               <p className="text-[11px] text-slate-400 font-medium tracking-wider uppercase leading-relaxed max-w-xl text-left">Kalibrasi mesin espresso & grinder gratis setiap 2 bulan. Memastikan peralatan Anda setara dengan standar pemanggangan kami.</p>
            </div>
            <div className="text-right space-y-3 relative z-10">
               <div className="flex items-center justify-end gap-2 text-white">
                  <Lock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Fitur Terkunci</span>
               </div>
               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Aktif otomatis pada urutan kontrak #2</p>
            </div>
            <div className="absolute bottom-0 right-0 p-12 opacity-5"><ShieldCheck size={200} /></div>
         </div>
      </div>
   );
}
