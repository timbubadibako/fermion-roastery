"use client";

import React, { useState, useEffect } from "react";
import { 
  Scale, 
  Lock, 
  Settings,
  Clock,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";

export default function CalibrationPage() {
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
        <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">Kalibrasi <br/> Rasa.</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Selaraskan ekstraksi espresso cafe Anda dengan profil master roaster kami.</p>
      </div>

      {isLocked ? (
        <div className="bg-slate-900 rounded-sm p-20 text-white flex flex-col items-center justify-center text-center space-y-10 relative overflow-hidden shadow-2xl border border-black">
           <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12"><Scale size={200} /></div>
           <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
              <Lock size={40} className="text-[#367F4D]" />
           </div>
           <div className="space-y-4 relative z-10 max-w-xl">
              <h2 className="font-display text-4xl italic font-bold tracking-tighter">Otorisasi Level Khusus.</h2>
              <p className="text-slate-400 text-[11px] uppercase tracking-wider leading-relaxed">Manfaat eksklusif ini ditujukan bagi mitra yang berada di **Siklus Kontrak Kedua** atau lebih tinggi. Lanjutkan kemitraan Anda untuk membuka sesi kalibrasi rasa di lokasi oleh Head Roaster kami secara gratis.</p>
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
                 <h3 className="font-display text-4xl italic font-bold tracking-tighter text-slate-900 leading-none pt-2">Jadwalkan <br/> Kalibrasi.</h3>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium">Atur sesi dengan Master Roaster kami untuk melakukan penyesuaian mesin espresso guna mendapatkan ekstraksi yang sempurna.</p>
              </div>
              <div className="space-y-4 pt-10 border-t border-black/5">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kuota Tersisa: 2 / 2 Sesi</p>
                 <Button className="w-full h-16 bg-slate-900 hover:bg-[#367F4D] text-white rounded-sm font-black uppercase tracking-widest italic shadow-xl transition-all border-none text-[10px]">Inisiasi Permintaan Kalibrasi</Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
