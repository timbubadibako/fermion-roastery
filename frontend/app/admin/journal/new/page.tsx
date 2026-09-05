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
  Upload,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export default function JournalFormPage() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params?.id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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
    if (isEdit && params?.id) {
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
  }, [isEdit, params?.id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('journal-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('journal-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, featured_image: publicUrlData.publicUrl }));
      toast.success("Gambar artikel berhasil diupload ke Supabase Storage!");
    } catch (err: any) {
      toast.error("Upload gagal: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isEdit ? `/api/journal/${params.id}` : "/api/journal";
      const method = isEdit ? "PUT" : "POST";
      
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success(`Tulisan berhasil ${isEdit ? 'diperbarui' : 'disimpan'}.`);
        router.push("/admin/journal");
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.message || "Gagal menyimpan tulisan.");
      }
    } catch (e) {
      toast.error("Kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400 font-mono">
      <Loader2 size={36} className="animate-spin text-[#367F4D]" />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Membuka Form Journal Studio...</p>
    </div>
  );

  return (
    <div className="w-full space-y-6 pb-24 text-left font-mono">
      {/* HEADER */}
      <div className="bg-white border border-stone-300 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} /> Kembali ke Daftar Journal
          </button>
          <h1 className="text-base font-black uppercase text-slate-900 flex items-center gap-2">
            <span>{isEdit ? "EDIT ARTIKEL JURNAL" : "TULIS ARTIKEL BARU"}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Select 
            value={formData.status} 
            onValueChange={(val) => setFormData({...formData, status: val})}
          >
            <SelectTrigger className="h-9 bg-stone-50 border-stone-300 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-900 outline-none w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-stone-200 shadow-xl bg-white p-1 font-mono">
              <SelectItem value="published" className="text-[10px] font-bold uppercase py-2 cursor-pointer text-[#367F4D]">Published</SelectItem>
              <SelectItem value="draft" className="text-[10px] font-bold uppercase py-2 cursor-pointer">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/journal")}
            className="h-9 px-4 text-[10px] font-bold uppercase tracking-wider border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-all rounded-xl shadow-xs"
          >
            Batal
          </Button>

          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[#367F4D] text-white rounded-xl h-9 px-6 gap-2 text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all border-none shadow-xs"
          >
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            {isEdit ? "Simpan Perubahan" : "Publish Artikel"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAIN EDITOR AREA */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-stone-300 rounded-2xl p-6 space-y-6 shadow-xs">
            {/* Language Selector */}
            <div className="flex border-b border-stone-200 pb-4 gap-2">
              <Button 
                type="button"
                variant={activeLang === 'id' ? 'default' : 'outline'}
                className={`h-8 text-[10px] font-bold uppercase rounded-lg ${activeLang === 'id' ? 'bg-[#367F4D] text-white' : 'text-stone-600'}`}
                onClick={() => setActiveLang('id')}
              >
                Versi Bahasa Indonesia (ID)
              </Button>
              <Button 
                type="button"
                variant={activeLang === 'en' ? 'default' : 'outline'}
                className={`h-8 text-[10px] font-bold uppercase rounded-lg ${activeLang === 'en' ? 'bg-[#367F4D] text-white' : 'text-stone-600'}`}
                onClick={() => setActiveLang('en')}
              >
                Versi English (EN)
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Judul Utama {activeLang === 'en' ? '(EN)' : '(ID)'}
              </label>
              <Input 
                required={activeLang === 'id'} 
                value={activeLang === 'en' ? (formData.title_en || '') : formData.title} 
                onChange={e => setFormData(activeLang === 'en' ? {...formData, title_en: e.target.value} : {...formData, title: e.target.value})} 
                placeholder={activeLang === 'en' ? "Title..." : "Judul artikel..."} 
                className="h-12 bg-stone-50 border-stone-300 font-bold rounded-xl text-base px-4 focus:bg-white focus:border-[#367F4D]" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Ringkasan / Abstract {activeLang === 'en' ? '(EN)' : '(ID)'}
              </label>
              <textarea 
                value={activeLang === 'en' ? (formData.excerpt_en || '') : formData.excerpt} 
                onChange={e => setFormData(activeLang === 'en' ? {...formData, excerpt_en: e.target.value} : {...formData, excerpt: e.target.value})} 
                placeholder="Tulis ringkasan singkat 1-2 kalimat..." 
                className="w-full h-24 bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs font-medium leading-relaxed resize-none outline-none focus:bg-white focus:border-[#367F4D]" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Isi Artikel (Format Markdown Supported) {activeLang === 'en' ? '(EN)' : '(ID)'}
              </label>
              <textarea 
                required={activeLang === 'id'} 
                value={activeLang === 'en' ? (formData.content_en || '') : formData.content} 
                onChange={e => setFormData(activeLang === 'en' ? {...formData, content_en: e.target.value} : {...formData, content: e.target.value})} 
                placeholder="Tuangkan isi jurnal eksperimen di sini..." 
                className="w-full h-[500px] bg-stone-50 border border-stone-300 rounded-xl p-4 text-xs font-mono leading-relaxed outline-none focus:bg-white focus:border-[#367F4D]" 
              />
            </div>
          </div>
        </div>

        {/* SIDEBAR METADATA & IMAGE UPLOAD */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-stone-300 rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Kategori Artikel</label>
              <Select 
                value={formData.category} 
                onValueChange={(val) => setFormData({...formData, category: val})}
              >
                <SelectTrigger className="w-full h-10 bg-stone-50 border-stone-300 rounded-xl text-[11px] font-bold uppercase text-slate-900 outline-none">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-stone-200 shadow-xl bg-white p-1 font-mono">
                  <SelectItem value="Eksperimen" className="text-[10px] font-bold uppercase py-2 cursor-pointer">Eksperimen Roastery</SelectItem>
                  <SelectItem value="Panen" className="text-[10px] font-bold uppercase py-2 cursor-pointer">Laporan Panen</SelectItem>
                  <SelectItem value="Edukasi" className="text-[10px] font-bold uppercase py-2 cursor-pointer">Edukasi Kopi</SelectItem>
                  <SelectItem value="Berita" className="text-[10px] font-bold uppercase py-2 cursor-pointer">Berita Roastery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Direct Supabase Image Upload Container */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Gambar Sampul (Cover)</label>
              
              <div className="aspect-[16/9] bg-stone-50 rounded-xl border-2 border-dashed border-stone-300 overflow-hidden flex flex-col items-center justify-center gap-2 relative group hover:border-[#367F4D]">
                {formData.featured_image ? (
                  <>
                    <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, featured_image: ""})}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg text-red-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                    {uploadingImage ? (
                      <Loader2 size={24} className="animate-spin text-[#367F4D]" />
                    ) : (
                      <>
                        <Upload size={24} className="text-stone-400 mb-1 group-hover:text-[#367F4D] transition-colors" />
                        <span className="text-[10px] font-bold uppercase text-stone-700">Upload Gambar ke Supabase</span>
                        <span className="text-[8px] text-stone-400 uppercase">PNG, JPG, WEBP MAX 10MB</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                  </label>
                )}
              </div>

              <Input 
                value={formData.featured_image} 
                onChange={e => setFormData({...formData, featured_image: e.target.value})} 
                placeholder="Atau masukan URL Gambar (https://...)" 
                className="h-9 bg-stone-50 border-stone-300 text-[10px] font-mono" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
