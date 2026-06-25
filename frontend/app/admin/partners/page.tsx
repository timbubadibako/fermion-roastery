"use client";

import { apiFetch } from "@/lib/api"; // atau "../../lib/api" tergantung posisi file
import React, { useState, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  ShieldAlert,
  Loader2,
  ExternalLink,
  MoreVertical,
  ChevronRight,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

interface Partner {
  id: string;
  profile_id: string;
  company_name: string;
  address: string;
  estimated_volume_kg: string;
  status: string;
  tier_name: string;
  email: string;
  full_name: string;
  customer_phone?: string;
}

export default function PartnerManagement() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [partnerToReject, setPartnerToReject] = useState<string | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
  try {
    // 🎯 KUNCI UTAMANYA: Ganti fetch mentah menjadi apiFetch biar token ADMIN nempel otomatis
    const res = await apiFetch("/api/admin/partners");
    if (res.ok) setPartners(await res.json());
  } catch (error) {
    console.error("Fetch partners error:", error);
  } finally {
    setLoading(false);
  }
};

  const handleUpdateStatus = async (id: string, status: string, tier?: string | null) => {
    const payload: any = { status };
    if (tier !== undefined) payload.tier_name = tier;

    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success(`Data mitra telah diperbarui.`);
        fetchPartners();
      }
    } catch (error) {
      toast.error("Gagal memperbarui data mitra.");
    }
  };

  const confirmReject = () => {
    if (partnerToReject) {
      handleUpdateStatus(partnerToReject, 'rejected', null);
      setPartnerToReject(null);
      setIsRejectModalOpen(false);
    }
  };

  const filteredPartners = partners.filter(p =>
    p.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
      <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Mengakses Data Kemitraan...</p>
    </div>
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'onboarding':
      case 'pending':
      case 'awaiting_contract_review':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Menunggu Persetujuan</span>
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Mitra Aktif</span>
          </div>
        );
      case 'flagged':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
            <span className="text-[9px] font-black text-yellow-700 uppercase tracking-widest">Perlu Diperhatikan</span>
          </div>
        );
      case 'suspended':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full">
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Ditangguhkan</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-100 rounded-full">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">Ditolak</span>
          </div>
        );
      default:
        return <span className="text-[10px] font-bold text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 pb-10">
        <div className="space-y-3 text-left">
          <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">Manajemen <br /> Kemitraan.</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Verifikasi kontrak dan kendali siklus bisnis B2B.</p>
        </div>
      </div>

      <div className="bg-white border border-black/5 rounded-sm overflow-hidden shadow-sm">
        <div className="p-8 border-b border-black/5 flex items-center justify-between bg-stone-50/50">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Database Mitra</h3>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={14} />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari Nama Cafe atau Email..."
                className="pl-12 h-10 w-64 bg-white border-black/10 rounded-sm text-xs font-bold focus:ring-[#367F4D]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-black/5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-8 font-black">Detail Entitas</th>
                <th className="p-8 font-black">Dokumen</th>
                <th className="p-8 font-black">Target Volume</th>
                <th className="p-8 font-black">Status Kemitraan</th>
                <th className="p-8 text-right font-black">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredPartners.length === 0 ? (
                <tr><td colSpan={5} className="p-24 text-center text-stone-300 font-bold uppercase tracking-widest text-xs italic">Belum ada catatan kemitraan terdeteksi.</td></tr>
              ) : (
                filteredPartners.map((partner, i) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={partner.id}
                    className="hover:bg-stone-50/50 transition-colors group"
                  >
                    <td className="p-8">
                      <div className="space-y-1">
                        <p className="font-bold uppercase tracking-tight text-slate-900">{partner.company_name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{partner.email}</p>
                      </div>
                    </td>
                    <td className="p-8">
                      <a 
                        href={`/api/b2b/contract?profileId=${partner.profile_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-slate-400 hover:text-[#367F4D] transition-colors group/link"
                      >
                        <FileText size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest border-b border-transparent group-hover/link:border-[#367F4D]">Perjanjian_B2B.pdf</span>
                      </a>
                    </td>
                    <td className="p-8 font-mono font-bold text-xs text-slate-600">
                      {partner.estimated_volume_kg} <span className="text-slate-300 font-medium">KG / BLN</span>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col gap-2 items-start">
                        {getStatusBadge(partner.status)}
                        {partner.status === 'approved' && (
                          <p className="text-[8px] font-black text-[#367F4D] uppercase tracking-[0.2em] ml-3 opacity-60">{partner.tier_name} Level</p>
                        )}
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="h-10 w-10 rounded-sm bg-stone-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all border-none shadow-none outline-none">
                            <MoreVertical size={18} />
                          </Button>
                        </DropdownMenuTrigger>

                        {/* Ganti bagian DropdownMenuContent lu dengan versi yang sudah di-refactor ini: */}
                        <DropdownMenuContent align="end" className="w-56 rounded-sm border border-black/10 shadow-2xl p-1 bg-white">
                          <DropdownMenuItem
                            className="text-[10px] font-black uppercase tracking-widest py-3 cursor-pointer text-[#367F4D] focus:bg-[#367F4D]/5 focus:text-[#367F4D] outline-none"
                            onClick={() => {
                              // Normalisasi otomatis nomor hp 08xxx -> 628xxx
                              let phone = partner.customer_phone?.replace(/\D/g, '') || '';
                              if (phone.startsWith('0')) phone = '62' + phone.slice(1);
                              window.open(`https://wa.me/${phone}`, '_blank');
                            }}
                          >
                            Hubungi WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-black/5" />

                          {/* Mengganti fokus ungu bawaan menjadi slate minimalis sesuai tema */}
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="text-[10px] font-black uppercase tracking-widest py-3 cursor-pointer focus:bg-slate-900 focus:text-white data-[state=open]:bg-slate-900 data-[state=open]:text-white outline-none">
                              Ubah Level (Tier)
                            </DropdownMenuSubTrigger>

                            {/* 🟢 WAJIB tambahkan DropdownMenuPortal di sini agar sub-menu bisa merembes keluar */}
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="rounded-sm border border-black/10 shadow-xl p-1 bg-white min-w-[8rem] z-[60]">
                                <DropdownMenuItem
                                  className="text-[10px] font-black uppercase py-3 cursor-pointer focus:bg-[#367F4D] focus:text-white outline-none"
                                  onClick={() => handleUpdateStatus(partner.id, 'approved', 'Bronze')}
                                >
                                  Bronze
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-[10px] font-black uppercase py-3 cursor-pointer focus:bg-[#367F4D] focus:text-white outline-none"
                                  onClick={() => handleUpdateStatus(partner.id, 'approved', 'Silver')}
                                >
                                  Silver
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-[10px] font-black uppercase py-3 cursor-pointer focus:bg-[#367F4D] focus:text-white outline-none"
                                  onClick={() => handleUpdateStatus(partner.id, 'approved', 'Gold')}
                                >
                                  Gold
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          {/* Memperbaiki teks invisible dengan menambahkan focus:text-slate-950 */}
                          <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest py-3 cursor-pointer focus:bg-stone-100 focus:text-slate-950 outline-none" onClick={() => handleUpdateStatus(partner.id, 'flagged')}>
                            Perlu Perhatian
                          </DropdownMenuItem>

                          {partner.status !== 'suspended' ? (
                            <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest py-3 cursor-pointer focus:bg-stone-100 focus:text-slate-950 outline-none" onClick={() => handleUpdateStatus(partner.id, 'suspended')}>
                              Tangguhkan Mitra
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest py-3 cursor-pointer text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 outline-none" onClick={() => handleUpdateStatus(partner.id, 'approved')}>
                              Aktifkan Kembali
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator className="bg-black/5" />
                          <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest py-3 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 outline-none" onClick={() => {
                            setPartnerToReject(partner.id);
                            setIsRejectModalOpen(true);
                          }}>
                            Tolak Kemitraan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={confirmReject}
        title="Tolak Kemitraan?"
        description="Tindakan ini akan menolak aplikasi cafe ini. Mereka tidak akan memiliki akses ke katalog harga khusus mitra roastery."
        confirmText="Tolak Permanen"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
}
