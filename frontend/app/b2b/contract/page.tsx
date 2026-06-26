"use client";

import { apiFetch } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Download, Upload, Loader2, FileText, Calendar, TrendingUp, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

export default function B2BContractPage() {
  const router = useRouter();
  const { user, refreshSession } = useAuthStore();
  const t = useI18n();
  const [mounted, setMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [partner, setPartner] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/b2b/register');
    } else {
      fetchPartnerData();
    }
  }, [user, router]);

  const fetchPartnerData = async () => {
    if (!user?.id) return;
    try {
      // 🎯 KUNCI UTAMANYA: Alihkan dari /api/admin/partners ke /api/b2b/partner-status
      const pRes = await apiFetch(`/api/b2b/partner-status?profileId=${user.id}`);
      if (pRes.ok) {
        const pData = await pRes.json();

        // 🎯 PROTEKSI EKSTRA: Pastikan pData berupa Array sebelum memanggil .find() agar anti-crash
        if (Array.isArray(pData)) {
          const p = pData.find((p: any) => p.profile_id === user.id);
          setPartner(p);
        } else if (pData && typeof pData === 'object') {
          setPartner(pData.profile_id === user.id ? pData : null);
        }
      }
    } catch (e) {
      console.error("Gagal mengambil data partner:", e);
    }
  };

  const handleDownloadContract = () => {
    if (!user) return;
    window.open(`/api/b2b/contract?profileId=${user.id}`, '_blank');
  };

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const confirmUpload = async () => {
    if (!selectedFile || !user) return;
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = async () => {
        const base64File = reader.result;

        const res = await fetch('/api/b2b/upload-contract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileId: user.id,
            fileData: base64File,
            fileName: selectedFile.name,
            mimetype: selectedFile.type
          })
        });

        if (res.ok) {
          toast.success(t.b2bContract.toasts.success);
          await refreshSession();
          router.push('/account');
        } else {
          toast.error(t.b2bContract.toasts.error);
        }
        setUploading(false);
        setSelectedFile(null);
      };

      reader.onerror = () => {
        toast.error("Gagal membaca file.");
        setUploading(false);
        setSelectedFile(null);
      };
    } catch (e) {
      toast.error(t.b2bContract.toasts.error);
      setUploading(false);
      setSelectedFile(null);
    }
  };

  if (!mounted || !user) return null;

  const isApproved = user.b2b_status === 'APPROVED' || user.role === 'B2B';
  const tier = partner?.tier_name || 'Bronze';
  const volume = partner?.total_volume_kg || 0;
  // Calculate remaining days roughly
  const expiryDate = partner?.created_at ? new Date(new Date(partner.created_at).setFullYear(new Date(partner.created_at).getFullYear() + 1)) : new Date();
  const daysLeft = Math.max(0, Math.floor((expiryDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)));

  return (
    <div className="space-y-12 pb-20 relative text-left">
      <div className="space-y-3">
        <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">
          Kontrak<span className="text-[#367F4D]">.</span>
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Pusat Legalitas Kemitraan</p>
      </div>

      {isApproved ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Contract Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-black/5 rounded-2xl p-10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 transition-opacity" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <FileText className="text-[#367F4D]" size={24} />
                      <h2 className="text-2xl font-bold tracking-tight text-slate-900">Perjanjian Aktif</h2>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Nomor Kontrak: B2B/FRM/{new Date().getFullYear()}/{user.id.slice(0, 6).toUpperCase()}</p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Signed & Verified</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-black/5">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={12} /> Sisa Waktu</p>
                    <p className="text-xl font-bold text-slate-900">{daysLeft} <span className="text-xs text-slate-500 font-medium">Hari</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Award size={12} /> Tier Saat Ini</p>
                    <p className="text-xl font-bold text-[#367F4D]">{tier}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><TrendingUp size={12} /> Vol. Bulan Ini</p>
                    <p className="text-xl font-bold text-slate-900">{volume} <span className="text-xs text-slate-500 font-medium">Kg</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={12} /> Diperbarui</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">{new Date().toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 border border-black/5 rounded-2xl p-8 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">Aksi Kontrak</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <Button
                  onClick={handleDownloadContract}
                  className="h-12 px-6 bg-white text-slate-900 border border-black/10 hover:bg-slate-100 rounded-lg font-black uppercase tracking-widest text-[10px] shadow-sm transition-all"
                >
                  <Download size={14} className="mr-2" /> Unduh Salinan Kontrak
                </Button>
                <Button
                  variant="outline"
                  className="h-12 px-6 bg-transparent text-slate-500 border-dashed border-black/20 hover:border-black/40 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all"
                >
                  <Upload size={14} className="mr-2" /> Perbarui Dokumen Legal
                </Button>
              </div>
            </div>
          </div>

          {/* Guidelines / Help */}
          <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mb-16" />
            <div className="relative z-10 space-y-6">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <FileText size={20} className="text-[#367F4D]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-bold italic tracking-tighter">Ketentuan Tier</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Volume belanja Anda dihitung setiap bulan kalender. Tingkatkan volume pesanan Anda untuk mendapatkan benefit dan potongan harga yang lebih besar.
                </p>
              </div>
              <ul className="space-y-4 pt-4 border-t border-white/10">
                <li className="flex items-center justify-between text-sm">
                  <span className="text-stone-300">Bronze</span>
                  <span className="font-bold">Rp 10.000 / kg</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-stone-300">Silver</span>
                  <span className="font-bold">Rp 15.000 / kg</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-[#367F4D] font-bold">Gold</span>
                  <span className="font-bold text-[#367F4D]">Rp 20.000 / kg</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* PENDING UPLOAD VIEW (Simplified for Dashboard) */
        <div className="bg-white border border-black/10 shadow-sm p-10 md:p-16 flex flex-col gap-10 rounded-2xl text-center items-center justify-center min-h-[50vh]">
          <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center border border-black/5">
            <FileText className="text-stone-300" size={32} />
          </div>
          <div className="space-y-4 max-w-lg">
            <h2 className="text-3xl font-display font-bold italic tracking-tighter text-slate-900 leading-none">
              {t.b2bContract.card.heading}
            </h2>
            <p className="text-sm text-stone-500 font-medium leading-relaxed">
              {t.b2bContract.card.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <Button
              onClick={handleDownloadContract}
              className="w-full h-16 bg-white text-stone-900 border border-black/10 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-stone-50 transition-all shadow-sm"
            >
              <Download size={18} className="mr-3 text-[#367F4D]" /> {t.b2bContract.card.downloadButton}
            </Button>

            {selectedFile ? (
              <div className="w-full flex flex-col items-center justify-center gap-4 bg-stone-50 border border-stone-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <FileText size={24} className="text-[#367F4D]" />
                  <span className="text-xs font-bold text-stone-700 truncate max-w-[150px]">{selectedFile.name}</span>
                </div>
                <div className="flex w-full gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFile(null)}
                    disabled={uploading}
                    className="flex-1 text-[10px] uppercase font-bold tracking-widest border-stone-300 text-stone-600 hover:bg-stone-100 hover:text-stone-900 bg-white"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={confirmUpload}
                    disabled={uploading}
                    className="flex-1 bg-[#367F4D] hover:bg-[#2A653C] text-white text-[10px] uppercase font-bold tracking-widest"
                  >
                    {uploading ? <Loader2 className="animate-spin" size={14} /> : "Submit"}
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
                  if (file) handleSelectFile({ target: { files: [file] } } as any);
                }}
                className="w-full h-16 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-3 cursor-pointer hover:bg-[#367F4D] transition-all shadow-xl font-black uppercase tracking-widest text-[10px]">
                <Upload size={18} />
                <span className="pointer-events-none">{t.b2bContract.card.upload.idle}</span>
                <input type="file" className="hidden" accept="application/pdf" onChange={handleSelectFile} />
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
