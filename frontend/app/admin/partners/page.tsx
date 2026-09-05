"use client";

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
  Search,
  Building2,
  Bell,
  Check,
  Award,
  CreditCard,
  Ban
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
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { apiFetch } from "@/lib/api";
import { supabase } from "@/lib/supabase";

interface Partner {
  id: string;
  profile_id: string;
  company_name: string;
  address: string;
  estimated_volume_kg: string;
  status: string;
  tier_name: string;
  email: string;
  full_name?: string;
  customer_phone?: string;
  created_at?: string;
}

export default function PartnerManagement() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [partnerToReject, setPartnerToReject] = useState<string | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      
      // 1. Primary Fetch via Express Backend Admin Endpoint (with auth token & service role)
      const res = await apiFetch("/api/admin/partners");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPartners(data);
          return;
        }
      }

      // 2. Fallback via Supabase Client
      const { data: sData, error } = await supabase
        .from('b2b_partners')
        .select(`
          *,
          profiles:profile_id (email, full_name, phone)
        `)
        .order('created_at', { ascending: false });

      if (sData && sData.length > 0) {
        const mapped = sData.map((item: any) => ({
          ...item,
          email: item.profiles?.email || 'N/A',
          full_name: item.profiles?.full_name || item.company_name,
          customer_phone: item.profiles?.phone || ''
        }));
        setPartners(mapped);
      } else {
        setPartners([]);
      }
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
      // Optimistic UI update
      setPartners(prev => prev.map(p => p.id === id ? { ...p, status, tier_name: tier || p.tier_name } : p));

      const res = await apiFetch(`/api/admin/partners/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(`Status mitra berhasil diperbarui ke ${status.toUpperCase()} (${tier || 'Standard'})`);
        fetchPartners();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.message || "Gagal memperbarui data mitra.");
        fetchPartners();
      }
    } catch (error) {
      toast.error("Gagal memperbarui data mitra.");
      fetchPartners();
    }
  };

  const confirmReject = () => {
    if (partnerToReject) {
      handleUpdateStatus(partnerToReject, 'rejected', null);
      setPartnerToReject(null);
      setIsRejectModalOpen(false);
    }
  };

  const handleDownloadContract = async (profileId: string, companyName: string) => {
    try {
      const res = await apiFetch(`/api/b2b/contract?profileId=${profileId}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const win = window.open(url, '_blank');
        if (!win) {
          const a = document.createElement('a');
          a.href = url;
          a.download = `Perjanjian_B2B_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
          a.click();
        }
      } else {
        toast.error("Gagal mengunduh PDF Perjanjian.");
      }
    } catch (err) {
      toast.error("Gagal mengunduh PDF Perjanjian.");
    }
  };

  const pendingPartners = partners.filter(p => p.status === 'pending' || p.status === 'onboarding' || p.status === 'awaiting_contract_review');
  const activePartners = partners.filter(p => p.status === 'approved' || p.status === 'active');
  const rejectedPartners = partners.filter(p => p.status === 'rejected' || p.status === 'suspended');

  const filteredPartners = partners.filter(p => {
    const matchesSearch =
      (p.company_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (p.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (p.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    if (activeTab === 'pending') return matchesSearch && (p.status === 'pending' || p.status === 'onboarding' || p.status === 'awaiting_contract_review');
    if (activeTab === 'approved') return matchesSearch && (p.status === 'approved' || p.status === 'active');
    if (activeTab === 'rejected') return matchesSearch && (p.status === 'rejected' || p.status === 'suspended');
    return matchesSearch;
  });

  if (loading && partners.length === 0) return (
    <div className="h-[65vh] flex flex-col items-center justify-center gap-4 text-slate-400 font-sans">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-[#367F4D] rounded-full animate-spin" />
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mengakses Data Kemitraan B2B...</p>
    </div>
  );

  return (
    <div className="w-full space-y-6 font-sans text-left">
      {/* Top Action Toolbar */}
      <div className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#367F4D]/10 text-[#367F4D] rounded-xl">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span>KEMITRAAN B2B & PENGATURAN TIER CAFE</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Kelola verifikasi pengajuan mitra cafe, tingkat tier, dan dokumen perjanjian.
            </p>
          </div>
        </div>

        {/* Filter Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeTab === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Semua Mitra</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {partners.length}
            </span>
          </button>
          
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeTab === 'pending' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Bell size={13} className="animate-pulse" />
            <span>Pending</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'pending' ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-200 text-amber-900'}`}>
              {pendingPartners.length}
            </span>
          </button>

          <button 
            onClick={() => setActiveTab('approved')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeTab === 'approved' ? 'bg-[#367F4D] text-white shadow-xs' : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 size={13} />
            <span>Approved</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'approved' ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-900'}`}>
              {activePartners.length}
            </span>
          </button>

          <button 
            onClick={() => setActiveTab('rejected')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeTab === 'rejected' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <XCircle size={13} />
            <span>Rejected</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'rejected' ? 'bg-white/20 text-white' : 'bg-rose-200 text-rose-900'}`}>
              {rejectedPartners.length}
            </span>
          </button>

          <div className="relative ml-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari Nama Cafe / Email..."
              className="pl-9 h-9 w-52 bg-slate-50 border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#367F4D]"
            />
          </div>
        </div>
      </div>

      {/* Pending Application Queue Banner */}
      {pendingPartners.length > 0 && (
        <div className="bg-amber-50/80 border-2 border-amber-300 p-4 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <div className="flex items-center gap-2 text-amber-950 font-extrabold text-xs">
              <Bell size={16} className="text-amber-600 animate-bounce" />
              <span>PENDAFTARAN B2B BARU MEMBUTUHKAN VERIFIKASI SECEPATNYA ({pendingPartners.length} PENDING):</span>
            </div>
            <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">AKSI CEPAT 1-KLIK</span>
          </div>

          <div className="space-y-3">
            {pendingPartners.map(p => (
              <div key={p.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-3.5 border border-amber-200 rounded-xl text-xs text-slate-800 items-center shadow-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">NAMA CAFE / PT</span>
                  <span className="font-extrabold text-sm text-slate-900 block">{p.company_name}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{p.email}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">ESTIMASI KEBUTUHAN</span>
                  <span className="font-mono font-extrabold text-[#367F4D]">{p.estimated_volume_kg || '50'} KG / BULAN</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">ALAMAT & LOKASI</span>
                  <span className="text-[11px] text-slate-700 truncate block font-medium">{p.address || "Indonesia"}</span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-3.5 py-2 bg-[#367F4D] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs">
                        <Check size={14} />
                        <span>APPROVE & SET TIER</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white border border-slate-200 shadow-xl p-1 font-sans text-xs rounded-xl">
                      <DropdownMenuItem onClick={() => handleUpdateStatus(p.id, 'approved', 'Bronze')} className="cursor-pointer font-bold py-2">
                        Approve (Tier Bronze)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(p.id, 'approved', 'Silver')} className="cursor-pointer font-bold py-2">
                        Approve (Tier Silver)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(p.id, 'approved', 'Gold')} className="cursor-pointer font-bold py-2 text-amber-600">
                        Approve (Tier Gold)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <button 
                    onClick={() => { setPartnerToReject(p.id); setIsRejectModalOpen(true); }}
                    className="px-3 py-2 bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
                  >
                    TOLAK
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partners Directory Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Direktori Mitra Kemitraan ({filteredPartners.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 font-bold">Nama Cafe / Perusahaan</th>
                <th className="p-4 font-bold">Dokumen Perjanjian</th>
                <th className="p-4 font-bold text-center font-mono">Estimasi Volume</th>
                <th className="p-4 font-bold text-center">Tier Kemitraan</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 text-right font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-slate-400 font-bold uppercase text-xs">
                    Tidak ada catatan mitra terdaftar pada kategori ini.
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <span className="font-extrabold text-slate-900 text-xs block uppercase leading-tight">{partner.company_name}</span>
                      <span className="text-[11px] text-slate-500 font-medium">{partner.email}</span>
                    </td>
                    <td className="p-4">
                      <button 
                        type="button"
                        onClick={() => handleDownloadContract(partner.profile_id, partner.company_name)}
                        className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#367F4D] font-bold text-xs transition-colors cursor-pointer bg-transparent border-none p-0"
                      >
                        <FileText size={14} className="text-[#367F4D]" />
                        <span className="underline">Perjanjian_B2B.pdf</span>
                      </button>
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-slate-900 text-xs">
                      {partner.estimated_volume_kg || "50"} <span className="text-slate-400 font-medium">KG / BLN</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 font-bold text-[10px] rounded-full border uppercase ${
                        partner.tier_name === 'Gold' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                        partner.tier_name === 'Silver' ? 'bg-slate-100 text-slate-900 border-slate-300' :
                        'bg-orange-50 text-orange-900 border-orange-200'
                      }`}>
                        {partner.tier_name || 'Bronze'} Tier
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 font-bold text-[10px] rounded-full uppercase inline-flex items-center gap-1 ${
                        partner.status === 'approved' || partner.status === 'active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        partner.status === 'rejected' || partner.status === 'suspended' ? 'bg-rose-50 text-rose-800 border border-rose-200' : 
                        'bg-amber-50 text-amber-900 border border-amber-200'
                      }`}>
                        {partner.status === 'approved' ? (
                          <><CheckCircle2 size={12} /> Approved</>
                        ) : partner.status === 'rejected' ? (
                          <><XCircle size={12} /> Rejected</>
                        ) : (
                          <><Clock size={12} /> Pending</>
                        )}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="h-8 w-8 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition-all border-none p-0 shadow-none">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-52 bg-white border border-slate-200 shadow-xl p-1 font-sans text-xs rounded-xl">
                          <DropdownMenuItem
                            className="text-xs font-bold uppercase py-2 cursor-pointer text-[#367F4D]"
                            onClick={() => {
                              let phone = partner.customer_phone?.replace(/\D/g, '') || '';
                              if (phone.startsWith('0')) phone = '62' + phone.slice(1);
                              if (!phone) {
                                toast.info(`Email mitra: ${partner.email}`);
                              } else {
                                window.open(`https://wa.me/${phone}`, '_blank');
                              }
                            }}
                          >
                            Hubungi via WhatsApp / Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="text-xs font-bold uppercase py-2 cursor-pointer">
                              Set Level (Tier)
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="bg-white border border-slate-200 shadow-xl p-1 min-w-[9rem] font-sans text-xs rounded-xl">
                                <DropdownMenuItem className="text-xs font-bold uppercase py-2 cursor-pointer" onClick={() => handleUpdateStatus(partner.id, 'approved', 'Bronze')}>
                                  Bronze Tier
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs font-bold uppercase py-2 cursor-pointer" onClick={() => handleUpdateStatus(partner.id, 'approved', 'Silver')}>
                                  Silver Tier
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs font-bold uppercase py-2 cursor-pointer text-amber-600" onClick={() => handleUpdateStatus(partner.id, 'approved', 'Gold')}>
                                  Gold Tier
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          <DropdownMenuSeparator className="bg-slate-100" />
                          {partner.status !== 'approved' && (
                            <DropdownMenuItem
                              className="text-xs font-bold uppercase py-2 cursor-pointer text-emerald-700"
                              onClick={() => handleUpdateStatus(partner.id, 'approved', partner.tier_name || 'Bronze')}
                            >
                              Setuju / Approve
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-xs font-bold uppercase py-2 cursor-pointer text-rose-600"
                            onClick={() => {
                              setPartnerToReject(partner.id);
                              setIsRejectModalOpen(true);
                            }}
                          >
                            Tolak / Bekukan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
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
        title="Tolak Kemitraan B2B?"
        description="Tindakan ini akan membatalkan status terverifikasi cafe ini."
        confirmText="Tolak Kemitraan"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
}
