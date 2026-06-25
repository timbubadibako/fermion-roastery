"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Globe, 
  Image as ImageIcon,
  X,
  Loader2,
  Calendar,
  BookOpen,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function JournalFormPage() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params.id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<"id" | "en">("id");

  const [formData, setFormData] = useState({
    title: "",
    title_en: "",
    category: "Eksperimen",
    status: "published",
    content: "",
    content_en: "",
    excerpt: "",
    excerpt_en: "",
    featured_image: ""
  });

  useEffect(() => {
    if (isEdit) {
      fetch(`/api/journal/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setFormData(data);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Gagal memuat data blog.");
          router.push("/admin/journal");
        });
    }
  }, [isEdit, params.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isEdit ? `/api/journal/${params.id}` : "/api/journal";
      const method = isEdit ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success(`Tulisan berhasil ${isEdit ? 'diperbarui' : 'disimpan'}.`);
        router.push("/admin/journal");
      } else {
        toast.error("Gagal menyimpan tulisan.");
      }
    } catch (e) {
      toast.error("Kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
      <Loader2 size={40} className="animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Membuka Arsip Blog...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 text-left">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/5 pb-10">
        <div className="space-y-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} /> Kembali ke Daftar Blog
          </button>
          <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">
            {isEdit ? "Edit \nTulisan." : "Tulis \nBaru."}
          </h1>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
            <Select 
                value={formData.status} 
                onValueChange={(val) => setFormData({...formData, status: val})}
            >
                <SelectTrigger className="h-14 bg-stone-100 border-none rounded-sm px-8 text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none focus:ring-1 focus:ring-[#367F4D] w-[180px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-sm border-black/5 shadow-2xl bg-white p-1">
                    <SelectItem value="published" className="text-[10px] font-bold uppercase py-3 cursor-pointer focus:bg-stone-50 focus:text-slate-900 outline-none">Tampilkan</SelectItem>
                    <SelectItem value="draft" className="text-[10px] font-bold uppercase py-3 cursor-pointer focus:bg-stone-50 focus:text-slate-900 outline-none">Simpan Draft</SelectItem>
                </SelectContent>
            </Select>

            <Button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-[#367F4D] text-white rounded-sm h-14 px-10 gap-3 font-black uppercase tracking-widest italic shadow-xl hover:bg-[#2d6a41] transition-all border-none"
            >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {isEdit ? "Simpan Perubahan" : "Simpan Tulisan"}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* MAIN EDITOR AREA */}
        <div className="lg:col-span-3 space-y-10">
            <div className="bg-white border border-black/5 rounded-sm p-10 space-y-10 shadow-sm">
                
                {/* Language Toggle */}
                <div className="flex border-b border-black/5 pb-6 gap-4">
                  <Button 
                    variant={activeLang === 'id' ? 'default' : 'outline'}
                    className={activeLang === 'id' ? 'bg-[#367F4D] text-white hover:bg-[#2d6a41]' : 'text-stone-500'}
                    onClick={() => setActiveLang('id')}
                  >
                    Indonesian (ID)
                  </Button>
                  <Button 
                    variant={activeLang === 'en' ? 'default' : 'outline'}
                    className={activeLang === 'en' ? 'bg-[#367F4D] text-white hover:bg-[#2d6a41]' : 'text-stone-500'}
                    onClick={() => setActiveLang('en')}
                  >
                    English (EN)
                  </Button>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                      Judul Utama {activeLang === 'en' ? '(EN)' : '(ID)'}
                    </label>
                    <Input 
                      required={activeLang === 'id'} 
                      value={activeLang === 'en' ? (formData.title_en || '') : formData.title} 
                      onChange={e => setFormData(activeLang === 'en' ? {...formData, title_en: e.target.value} : {...formData, title: e.target.value})} 
                      placeholder={activeLang === 'en' ? "e.g. Tales from the Farm: Gayo Harvest" : "e.g. Cerita dari Kebun: Panen Gayo Tahun Ini"} 
                      className="h-16 bg-stone-50 border-black/5 font-bold rounded-sm text-2xl px-6 focus-visible:ring-[#367F4D]" 
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                      Ringkasan Singkat {activeLang === 'en' ? '(EN)' : '(ID)'}
                    </label>
                    <textarea 
                        value={activeLang === 'en' ? (formData.excerpt_en || '') : formData.excerpt} 
                        onChange={e => setFormData(activeLang === 'en' ? {...formData, excerpt_en: e.target.value} : {...formData, excerpt: e.target.value})} 
                        placeholder={activeLang === 'en' ? "Write 1-2 introductory sentences..." : "Tuliskan 1-2 kalimat pengantar untuk pembaca..."} 
                        className="w-full h-32 bg-stone-50 border border-black/5 rounded-sm p-6 text-sm font-medium leading-relaxed resize-none outline-none focus:ring-1 focus:ring-[#367F4D] uppercase tracking-wider opacity-70" 
                    />
                </div>

                <div className="space-y-3 pt-6 border-t border-black/5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                      Isi Tulisan {activeLang === 'en' ? '(EN)' : '(ID)'}
                    </label>
                    <textarea 
                        required={activeLang === 'id'} 
                        value={activeLang === 'en' ? (formData.content_en || '') : formData.content} 
                        onChange={e => setFormData(activeLang === 'en' ? {...formData, content_en: e.target.value} : {...formData, content: e.target.value})} 
                        placeholder={activeLang === 'en' ? "Write your blog content here..." : "Tuangkan isi tulisan blog Anda di sini..."} 
                        className="w-full h-[600px] bg-stone-50 border border-black/5 rounded-sm p-10 text-base font-medium leading-relaxed resize-none outline-none focus:ring-1 focus:ring-[#367F4D]" 
                    />
                </div>
            </div>
        </div>

        {/* SIDEBAR SETTINGS */}
        <div className="space-y-10">
            <div className="bg-white border border-black/5 rounded-sm p-10 space-y-8 shadow-sm">
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Kategori Blog</label>
                    <Select 
                        value={formData.category} 
                        onValueChange={(val) => setFormData({...formData, category: val})}
                    >
                        <SelectTrigger className="w-full h-14 bg-stone-50 border border-black/5 rounded-sm px-6 text-[10px] font-black uppercase tracking-widest text-slate-900 outline-none focus:ring-1 focus:ring-[#367F4D]">
                            <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent className="rounded-sm border-black/5 shadow-2xl bg-white p-1">
                            <SelectItem value="Eksperimen" className="text-[10px] font-bold uppercase py-3 cursor-pointer focus:bg-stone-50 focus:text-[#367F4D] outline-none">Eksperimen Roastery</SelectItem>
                            <SelectItem value="Panen" className="text-[10px] font-bold uppercase py-3 cursor-pointer focus:bg-stone-50 focus:text-[#367F4D] outline-none">Laporan Panen</SelectItem>
                            <SelectItem value="Edukasi" className="text-[10px] font-bold uppercase py-3 cursor-pointer focus:bg-stone-50 focus:text-[#367F4D] outline-none">Edukasi Kopi</SelectItem>
                            <SelectItem value="Berita" className="text-[10px] font-bold uppercase py-3 cursor-pointer focus:bg-stone-50 focus:text-[#367F4D] outline-none">Berita Roastery</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4 pt-6 border-t border-black/5 text-left">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Gambar Utama (URL)</label>
                    <div className="aspect-[3/2] bg-stone-50 rounded-sm border-2 border-dashed border-black/10 overflow-hidden flex flex-col items-center justify-center gap-4 group hover:border-[#367F4D]/40 transition-all cursor-pointer relative">
                        {formData.featured_image ? (
                            <>
                                <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => setFormData({...formData, featured_image: ""})}
                                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-sm text-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <ImageIcon size={24} className="text-stone-300 group-hover:text-[#367F4D] transition-colors" />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Klik atau Drop Gambar</p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Minimal 1200x800px</p>
                                </div>
                            </>
                        )}
                    </div>
                    <Input value={formData.featured_image} onChange={e => setFormData({...formData, featured_image: e.target.value})} placeholder="https://..." className="h-12 bg-stone-50 border-black/5 font-bold rounded-sm px-4 text-[10px] focus-visible:ring-[#367F4D]" />
                </div>

                {isEdit && (
                    <div className="pt-6 border-t border-black/5 space-y-1 text-left">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={12} /> Ditulis Pada: {new Date().toLocaleDateString('id-ID')}
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-slate-900 text-white rounded-sm p-10 space-y-6 shadow-2xl text-left">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-[#367F4D]"><BookOpen size={16} /></div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Info Blog</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium uppercase tracking-wider">Gunakan bahasa yang menginspirasi penikmat kopi Anda. Cerita yang bagus meningkatkan nilai artisan produk.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
