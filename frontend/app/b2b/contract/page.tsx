"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Download,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";

export default function ContractPage() {
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
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Memuat Data Kontrak...</p>
    </div>
  );

  return (
    <div className="space-y-12 text-left">
      <div className="space-y-3">
        <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">Dokumen <br/> Perjanjian.</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Tinjau detail kontrak kemitraan dan profil bisnis Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* CONTRACT STATUS */}
        <div className="lg:col-span-8 bg-white border border-black/5 rounded-sm p-12 space-y-10 shadow-sm relative overflow-hidden">
           <div className="flex items-center justify-between relative z-10 border-b border-black/5 pb-8">
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Kontrak</p>
                 <h3 className="font-display text-3xl font-bold italic text-slate-900">#FM-{partner?.id?.slice(0,8).toUpperCase() || 'UNKNOWN'}</h3>
              </div>
              <div className="flex flex-col items-end gap-2">
                 {partner?.status === 'approved' ? (
                   <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full w-fit">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                     <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Mitra Aktif</span>
                   </div>
                 ) : (
                   <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full w-fit">
                     <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                     <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Menunggu Persetujuan</span>
                   </div>
                 )}
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Siklus: #{partner?.contract_sequence || 1}</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="space-y-2">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Target Volume</p>
                 <p className="text-xl font-black italic text-slate-900">{partner?.estimated_volume_kg || '10KG'}</p>
                 <p className="text-[8px] font-bold text-slate-500 uppercase">Per Bulan</p>
              </div>
              <div className="space-y-2">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Masa Berlaku</p>
                 <p className="text-xl font-black italic text-slate-900">MAR 2027</p>
                 <p className="text-[8px] font-bold text-slate-500 uppercase">134 Hari Tersisa</p>
              </div>
              <div className="space-y-2">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Diskon Dasar</p>
                 <p className="text-xl font-black italic text-[#367F4D]">- Rp 10.000</p>
                 <p className="text-[8px] font-bold text-slate-500 uppercase">Per Kilogram</p>
              </div>
           </div>

           <div className="pt-8 relative z-10 border-t border-black/5">
              <Button 
                onClick={() => window.open(`/api/b2b/contract?profileId=${user?.id}`, '_blank')}
                className="w-full md:w-auto h-14 bg-slate-900 text-white rounded-sm font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-[#367F4D] transition-all border-none"
              >
                 <Download size={16} className="mr-2" /> Unduh Dokumen Asli (PDF)
              </Button>
           </div>
        </div>

        {/* BUSINESS PROFILE */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 rounded-sm p-10 text-white shadow-2xl relative overflow-hidden group border border-black">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Building2 size={100} /></div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 relative z-10">Profil Bisnis</h3>
              
              <div className="space-y-6 relative z-10">
                 {partner?.cafe_logo_url ? (
                   <div className="w-24 h-24 bg-white rounded-sm flex items-center justify-center p-2 border border-white/10">
                      <img src={partner.cafe_logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                   </div>
                 ) : (
                   <div className="w-24 h-24 bg-white/5 rounded-sm flex flex-col items-center justify-center text-slate-500 border border-white/10 border-dashed">
                      <Building2 size={24} className="mb-1" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Tanpa Logo</span>
                   </div>
                 )}
                 
                 <div>
                    <h4 className="font-display text-2xl italic font-bold">{partner?.company_name || 'Nama Cafe'}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1.5"><MapPin size={10} /> {partner?.address || 'Alamat belum diatur'}</p>
                 </div>
                 
                 <div className="pt-6 border-t border-white/10 space-y-4">
                    <div>
                       <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">NPWP</p>
                       <p className="text-xs font-mono font-bold text-slate-300 mt-1">{partner?.npwp || 'Tidak Disediakan'}</p>
                    </div>
                    <div>
                       <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Alamat Penagihan</p>
                       <p className="text-xs font-bold text-slate-300 mt-1 truncate">{partner?.billing_address || 'Sama dengan alamat cafe'}</p>
                    </div>
                 </div>

                 <Button className="w-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-slate-900 rounded-sm h-12 text-[9px] font-black uppercase tracking-widest mt-4 shadow-none">
                    Perbarui Informasi
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
