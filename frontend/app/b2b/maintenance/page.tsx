"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Settings, 
  Wrench, 
  Clock, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Mountain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store";

export default function MaintenancePage() {
  const { user } = useAuthStore();
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/admin/partners?profileId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setPartner(data.find((p: any) => p.profile_id === user.id));
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
      <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Memeriksa Otorisasi Layanan...</p>
    </div>
  );

  // Requirement: contract_sequence >= 2 to unlock
  const isLocked = !partner || (partner.contract_sequence || 1) < 2;

  return (
    <div className="space-y-12 text-left">
      <div className="space-y-3">
        <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">Layanan <br/> Premium.</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Pemeliharaan tingkat laboratorium dan kalibrasi mesin untuk mitra resmi.</p>
      </div>

      {isLocked ? (
        <div className="bg-slate-900 rounded-sm p-20 text-white flex flex-col items-center justify-center text-center space-y-10 relative overflow-hidden shadow-2xl border border-black">
           <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12"><ShieldCheck size={200} /></div>
           <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
              <Lock size={40} className="text-[#367F4D]" />
           </div>
           <div className="space-y-4 relative z-10 max-w-xl">
              <h2 className="font-display text-4xl italic font-bold tracking-tighter">Otorisasi Level Khusus.</h2>
              <p className="text-slate-400 text-[11px] uppercase tracking-wider leading-relaxed">Manfaat eksklusif ini ditujukan bagi mitra yang berada di **Siklus Kontrak Kedua** atau lebih tinggi. Lanjutkan kemitraan Anda untuk membuka layanan kalibrasi mesin dan perawatan grinder gratis secara berkala.</p>
           </div>
           <div className="grid grid-cols-2 gap-8 w-full max-w-lg relative z-10 pt-10">
              <div className="p-6 bg-white/5 rounded-sm border border-white/10 space-y-2">
                 <Settings size={24} className="mx-auto text-[#367F4D]" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-white">Kalibrasi</p>
                 <span className="text-[8px] font-bold text-slate-500 uppercase">TERKUNCI</span>
              </div>
              <div className="p-6 bg-white/5 rounded-sm border border-white/10 space-y-2">
                 <ShieldCheck size={24} className="mx-auto text-[#367F4D]" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-white">Servis Mesin</p>
                 <span className="text-[8px] font-bold text-slate-500 uppercase">TERKUNCI</span>
              </div>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="bg-white border border-black/5 rounded-sm p-12 space-y-10 shadow-sm relative overflow-hidden">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full w-fit">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Akses Layanan Terbuka</span>
                 </div>
                 <h3 className="font-display text-4xl italic font-bold tracking-tighter text-slate-900 leading-none pt-2">Jadwalkan <br/> Tim Teknisi.</h3>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium">Turunkan tim mekanik kami ke lokasi Anda untuk kalibrasi ekstraksi dan pemeliharaan presisi.</p>
              </div>
              <div className="space-y-4 pt-10 border-t border-black/5">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kuota Tersisa: 2 / 2 Sesi</p>
                 <Button className="w-full h-16 bg-slate-900 hover:bg-[#367F4D] text-white rounded-sm font-black uppercase tracking-widest italic shadow-xl transition-all border-none text-[10px]">Inisiasi Permintaan Servis</Button>
              </div>
           </div>

           <div className="bg-white border border-black/5 rounded-sm p-12 space-y-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Catatan Pemeliharaan</h3>
              <div className="space-y-6">
                 <div className="p-6 bg-stone-50 rounded-sm border border-black/5 flex items-center justify-between">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Jadwal Rekomendasi Berikutnya</p>
                       <p className="font-bold text-slate-900">AGUSTUS 2026</p>
                    </div>
                    <Clock size={20} className="text-slate-300" />
                 </div>
                 <div className="py-20 text-center opacity-40 flex flex-col items-center gap-4">
                    <Mountain size={48} className="text-stone-300" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Belum ada riwayat layanan tercatat.</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
