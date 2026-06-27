"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Coffee,
  MapPin,
  Tag,
  Image as ImageIcon,
  Beaker,
  Boxes,
  Loader2,
  FileText,
  Link as LinkIcon,
  ChevronDown,
  X,
  Plus,
  Trash2,
  Sparkles
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
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";

interface VariantItem {
  id?: string;
  weight: string;
  price: number;
  stock_quantity: number;
}

const textValue = (value: unknown) => value == null ? "" : String(value);
const numberValue = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeVariants = (variants: unknown): VariantItem[] => {
  if (!Array.isArray(variants)) return [];

  return variants.map((variant) => {
    const item = variant as Partial<VariantItem>;

    return {
      id: item.id,
      weight: textValue(item.weight),
      price: numberValue(item.price),
      stock_quantity: numberValue(item.stock_quantity)
    };
  });
};

export default function ProductFormPage() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params.id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [journalPosts, setJournalPosts] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    notes: "",
    origin: "",
    process: "",
    altitude: "",
    price_retail: 0,
    roast_profile: "Light to Medium",
    description: "",
    farm: "",
    image_url: "",
    fermentation: "",
    sweetness: 3, // Menggunakan angka murni 3 agar slider aman
    acidity: 3,
    body: 3,
    stock_quantity: 0,
    category: "filter",
    sub_category: "filter_specialty",
    b2b_discount_enabled: true,
    is_active: true,
    linked_journal_id: "",

    // 🟢 Flag Marketing Baru
    is_new_release: false,
    is_promoted: false,
    search_upsell_headline: "",

    // 🟢 Wadah Varian Berat Dinamis
    variants: [] as VariantItem[]
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append("image", file);

    setUploading(true);
    try {
      const res = await apiFetch("/api/products/upload", {
        method: "POST",
        body: uploadData,
      });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, image_url: data.url }));
        toast.success("Gambar berhasil diunggah.");
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.message || "Gagal mengunggah gambar.");
      }
    } catch (err) {
      toast.error("Kesalahan mengunggah gambar.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const journalRes = await fetch("/api/journal");
        if (journalRes.ok) setJournalPosts(await journalRes.json());

        if (isEdit) {
          const productRes = await fetch(`/api/products/${params.id}`);
          if (productRes.ok) {
            const data = await productRes.json();
            // 🟢 Hidrasi data varian jika berpindah ke mode edit produk
            setFormData({
              ...data,
              name: textValue(data.name),
              slug: textValue(data.slug),
              notes: textValue(data.notes),
              origin: textValue(data.origin),
              process: textValue(data.process),
              altitude: textValue(data.altitude),
              price_retail: numberValue(data.price_retail),
              roast_profile: textValue(data.roast_profile) || "Light to Medium",
              description: textValue(data.description),
              farm: textValue(data.farm),
              image_url: textValue(data.image_url),
              fermentation: textValue(data.fermentation),
              sweetness: numberValue(data.sweetness, 3),
              acidity: numberValue(data.acidity, 3),
              body: numberValue(data.body, 3),
              stock_quantity: numberValue(data.stock_quantity),
              category: textValue(data.category) || "filter",
              sub_category: textValue(data.sub_category) || "filter_specialty",
              b2b_discount_enabled: data.b2b_discount_enabled ?? true,
              is_active: data.is_active ?? true,
              linked_journal_id: textValue(data.linked_journal_id),
              is_new_release: data.is_new_release ?? false,
              is_promoted: data.is_promoted ?? false,
              search_upsell_headline: textValue(data.search_upsell_headline),
              variants: normalizeVariants(data.product_variants || data.variants)
            });
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Gagal memuat data referensi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEdit, params.id]);

  // 🟢 Handler Varian Berat
  const handleVariantChange = (index: number, field: keyof VariantItem, value: any) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  const addVariantRow = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { weight: "", price: 0, stock_quantity: 0 }]
    }));
  };

  const removeVariantRow = (index: number) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isEdit ? `/api/products/${params.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(`Produk berhasil ${isEdit ? "diperbarui" : "ditambahkan"}.`);
        router.push("/admin/inventory");
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.message || "Gagal menyimpan produk.");
      }
    } catch (e) {
      toast.error("Kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
      <Loader2 size={40} className="animate-spin text-stone-900" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Menyusun Spesifikasi...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 text-left">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/5 pb-10">
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} /> Kembali ke Inventaris
          </button>
          <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">
            {isEdit ? "Edit \nSpesifikasi." : "Produk \nBaru."}
          </h1>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#367F4D] text-white rounded-sm h-14 px-10 gap-3 font-black uppercase tracking-widest italic shadow-xl hover:bg-[#2d6a41] transition-all border-none"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isEdit ? "Simpan Perubahan" : "Daftarkan Produk"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN: Main Info */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white border border-black/5 rounded-sm p-10 space-y-10 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nama SKU Produk</label>
                <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Sumedang Anaerob" className="h-14 bg-stone-50 border-black/5 font-bold rounded-sm px-6 focus-visible:ring-[#367F4D]" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Slug URL</label>
                <Input required value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="e.g. sumedang-anaerob" className="h-14 bg-stone-50 border-black/5 font-bold rounded-sm px-6 focus-visible:ring-[#367F4D]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Kategori Utama</label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => {
                    setFormData({
                      ...formData,
                      category: val,
                      sub_category: val === "filter" ? "filter_specialty" : "espresso_commercial"
                    })
                  }}
                >
                  <SelectTrigger className="w-full h-14 bg-stone-50 border-black/5 rounded-sm px-6 text-xs font-bold text-slate-900 focus:ring-[#367F4D]">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm border-black/5 shadow-2xl bg-white p-1">
                    <SelectItem value="filter" className="text-[10px] font-bold uppercase py-3 focus:bg-stone-50 focus:text-[#367F4D] outline-none">Filter Coffee</SelectItem>
                    <SelectItem value="espresso" className="text-[10px] font-bold uppercase py-3 focus:bg-stone-50 focus:text-[#367F4D] outline-none">Espresso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Sub Kategori</label>
                <Select
                  value={formData.sub_category}
                  onValueChange={(val) => setFormData({ ...formData, sub_category: val })}
                >
                  <SelectTrigger className="w-full h-14 bg-stone-50 border-black/5 rounded-sm px-6 text-xs font-bold text-slate-900 focus:ring-[#367F4D]">
                    <SelectValue placeholder="Pilih Sub Kategori" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm border-black/5 shadow-2xl bg-white p-1">
                    {formData.category === "filter" ? (
                      <>
                        <SelectItem value="filter_specialty" className="text-[10px] font-bold uppercase py-3 focus:bg-stone-50 focus:text-[#367F4D] outline-none">Filter Specialty</SelectItem>
                        <SelectItem value="filter_exotic" className="text-[10px] font-bold uppercase py-3 focus:bg-stone-50 focus:text-[#367F4D] outline-none">Filter Exotic</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="espresso_commodity" className="text-[10px] font-bold uppercase py-3 focus:bg-stone-50 focus:text-[#367F4D] outline-none">Espresso Komoditi</SelectItem>
                        <SelectItem value="espresso_commercial" className="text-[10px] font-bold uppercase py-3 focus:bg-stone-50 focus:text-[#367F4D] outline-none">Espresso Aja</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Deskripsi Naratif</label>
              <Textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ceritakan tentang profil, sejarah, atau keunikan kopi ini..."
                className="min-h-[200px] bg-stone-50 border-black/5 rounded-sm p-6 text-sm font-medium leading-relaxed focus-visible:ring-[#367F4D]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Origin (Wilayah)</label>
                <div className="relative">
                  <Input value={formData.origin} onChange={e => setFormData({ ...formData, origin: e.target.value })} placeholder="West Java, Indonesia" className="h-14 bg-stone-50 border-black/5 font-bold rounded-sm px-6 pl-14 focus-visible:ring-[#367F4D]" />
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Kebun / Farm</label>
                <Input value={formData.farm} onChange={e => setFormData({ ...formData, farm: e.target.value })} placeholder="Manglayang Farm" className="h-14 bg-stone-50 border-black/5 font-bold rounded-sm px-6 focus-visible:ring-[#367F4D]" />
              </div>
            </div>
          </div>

          {/* Profil Rasa Section */}
          <div className="bg-white border border-black/5 rounded-sm p-10 space-y-10 shadow-sm">
            <div className="flex items-center gap-3 border-b border-black/5 pb-6">
              <Beaker size={18} className="text-[#367F4D]" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Analisa Profil Rasa</h3>
            </div>

            <div className="space-y-10">
              {[
                { id: 'sweetness', label: 'Sweetness Intensity' },
                { id: 'acidity', label: 'Acidity Brightness' },
                { id: 'body', label: 'Mouthfeel / Body' }
              ].map(sensor => {
                const sensorKey = sensor.id as keyof typeof formData;
                const sensorValue = (formData[sensorKey] as number) || 0;

                return (
                  <div key={sensor.id} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{sensor.label}</label>
                      {/* 🟢 AMAN: Ditambahkan pengecekan toFixed pangkas eror runtime */}
                      <span className="text-xl font-black italic text-[#367F4D]">{sensorValue.toFixed(1)}/5.0</span>
                    </div>
                    <input
                      type="range" min="0" max="5" step="0.1"
                      value={sensorValue}
                      onChange={(e) => setFormData({ ...formData, [sensor.id]: parseFloat(e.target.value) || 0 })}
                      className="w-full h-1.5 bg-stone-100 appearance-none cursor-pointer rounded-full accent-[#367F4D]"
                    />
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Proses Pasca Panen</label>
                <Input value={formData.process} onChange={e => setFormData({ ...formData, process: e.target.value })} placeholder="e.g. Natural, Washed" className="h-14 bg-stone-50 border-black/5 font-bold rounded-sm px-6 focus-visible:ring-[#367F4D]" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Ketinggian (MASL)</label>
                <Input value={formData.altitude} onChange={e => setFormData({ ...formData, altitude: e.target.value })} placeholder="e.g. 1400 - 1600" className="h-14 bg-stone-50 border-black/5 font-bold rounded-sm px-6 focus-visible:ring-[#367F4D]" />
              </div>
            </div>
          </div>

          {/* 🟢 MANAJEMEN VARIAN BERAT DINAMIS */}
          <div className="bg-white border border-black/5 rounded-sm p-10 space-y-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-black/5 pb-6">
              <div className="flex items-center gap-3">
                <Boxes size={18} className="text-[#367F4D]" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Spesifikasi Varian Ukuran Kemasan</h3>
              </div>
              {/* Tombol Tambah Varian Melengkung Indah (rounded-sm) */}
              <button
                type="button"
                onClick={addVariantRow}
                className="flex items-center gap-2 bg-[#367F4D] text-white px-4 py-2 text-[9px] font-black tracking-widest uppercase rounded-sm hover:bg-emerald-800 transition-colors"
              >
                <Plus size={12} strokeWidth={3} /> Tambah Varian
              </button>
            </div>

            {formData.variants.length === 0 ? (
              <div className="p-8 border border-dashed border-stone-200 text-center text-[10px] font-bold text-stone-400 uppercase tracking-wider bg-stone-50/50 rounded-sm">
                Kosong (Default sistem otomatis mendaftarkan ukuran kemasan 150gr & 250gr saat disimpan). Harga transaksi tetap mengikuti harga varian.
              </div>
            ) : (
              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-stone-50/60 border border-black/5 relative group rounded-sm">
                    <div className="space-y-2">
                      <label className="block text-[8px] font-black tracking-widest text-stone-500 uppercase">Berat Kemasan</label>
                      <Input
                        required
                        placeholder="e.g. 150g atau 250g"
                        value={variant.weight}
                        onChange={e => handleVariantChange(index, "weight", e.target.value)}
                        className="h-10 bg-white border-black/10 rounded-sm font-bold text-xs focus-visible:ring-[#367F4D]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[8px] font-black tracking-widest text-stone-500 uppercase">Harga Retail Varian (IDR)</label>
                      <Input
                        required
                        type="number"
                        placeholder="0"
                        value={variant.price || ""}
                        onChange={e => handleVariantChange(index, "price", parseFloat(e.target.value) || 0)}
                        className="h-10 bg-white border-black/10 rounded-sm font-mono text-xs focus-visible:ring-[#367F4D]"
                      />
                    </div>
                    <div className="space-y-2 relative pr-10">
                      <label className="block text-[8px] font-black tracking-widest text-stone-500 uppercase">Stok Varian</label>
                      <Input
                        required
                        type="number"
                        placeholder="0"
                        value={variant.stock_quantity || ""}
                        onChange={e => handleVariantChange(index, "stock_quantity", parseInt(e.target.value) || 0)}
                        className="h-10 bg-white border-black/10 rounded-sm font-mono text-xs focus-visible:ring-[#367F4D]"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariantRow(index)}
                        className="absolute right-0 bottom-1 p-2 text-red-500 hover:bg-red-50 rounded-sm transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Stats & Campaign Panel */}
        <div className="space-y-10 text-left">
          {/* Inventory & Price */}
          <div className="bg-slate-900 text-white rounded-sm p-10 space-y-10 shadow-2xl">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Harga Display / Mulai Dari (IDR)</label>
                <div className="relative">
                  {/* AMAN: Menggunakan fallback OR string kosong menghalau eror NaN */}
                  <Input type="number" required value={formData.price_retail || ""} onChange={e => setFormData({ ...formData, price_retail: parseFloat(e.target.value) || 0 })} className="h-16 bg-white/5 border-white/10 text-2xl font-bold rounded-sm px-6 focus-visible:ring-[#367F4D]" />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 font-black tracking-tighter italic">DISPLAY</span>
                </div>
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500 leading-relaxed">Dipakai untuk katalog dan fallback. Harga transaksi utama tetap dari baris varian.</p>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Stok Inventaris (Unit)</label>
                <div className="relative">
                  {/* AMAN: Menggunakan fallback OR string kosong menghalau eror NaN */}
                  <Input type="number" required value={formData.stock_quantity || ""} onChange={e => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })} className="h-16 bg-white/5 border-white/10 text-2xl font-bold rounded-sm px-6 focus-visible:ring-[#367F4D]" />
                  <Boxes className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20" size={24} />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Profil Pemanggangan</label>
              <Select
                value={formData.roast_profile}
                onValueChange={(val) => setFormData({ ...formData, roast_profile: val })}
              >
                <SelectTrigger className="w-full h-14 bg-white/5 border-white/10 rounded-sm px-6 text-xs font-bold text-white outline-none focus:ring-[#367F4D]">
                  <SelectValue placeholder="Pilih Profil" />
                </SelectTrigger>
                <SelectContent className="rounded-sm border-black/5 shadow-2xl bg-white p-1">
                  <SelectItem value="Light" className="text-[10px] font-bold uppercase py-3 focus:bg-stone-50 focus:text-[#367F4D] outline-none">Light Roast</SelectItem>
                  <SelectItem value="Light to Medium" className="text-[10px] font-bold uppercase py-3 focus:bg-stone-50 focus:text-[#367F4D] outline-none">Light to Medium</SelectItem>
                  <SelectItem value="Medium" className="text-[10px] font-bold uppercase py-3 focus:bg-stone-50 focus:text-[#367F4D] outline-none">Medium Roast</SelectItem>
                  <SelectItem value="Medium to Dark" className="text-[10px] font-bold uppercase py-3 focus:bg-stone-50 focus:text-[#367F4D] outline-none">Medium to Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 🟢 DISCOVERY & MARKETING CAMPAIGN PANEL (Bulat Kapsul / rounded-full Luar-Dalam) */}
          <div className="bg-white border border-black/5 rounded-sm p-10 space-y-6 shadow-sm text-left">
            <div className="flex items-center gap-2.5 border-b border-black/5 pb-4">
              <Sparkles size={16} className="text-[#367F4D]" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Campaign & Discovery Engine</h4>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-900">Aktifkan Diskon B2B</p>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">Matikan untuk exotic/nano lot agar margin aman</p>
              </div>
              <input
                type="checkbox"
                checked={formData.b2b_discount_enabled}
                onChange={e => setFormData({ ...formData, b2b_discount_enabled: e.target.checked })}
                className="w-10 h-6 appearance-none bg-stone-100 rounded-full checked:bg-[#367F4D] relative cursor-pointer transition-all after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-1 after:left-1 checked:after:left-5 after:transition-all shadow-inner border border-black/5"
              />
            </div>

            {/* New Release Badge Custom Control */}
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-900">New Release Badge</p>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">Injeksi Banner "Just Roasted"</p>
              </div>
              <input
                type="checkbox"
                checked={formData.is_new_release}
                onChange={e => setFormData({ ...formData, is_new_release: e.target.checked })}
                className="w-10 h-6 appearance-none bg-stone-100 rounded-full checked:bg-[#367F4D] relative cursor-pointer transition-all after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-1 after:left-1 checked:after:left-5 after:transition-all shadow-inner border border-black/5"
              />
            </div>

            {/* Pre-Search Upsell Control */}
            <div className="flex items-center justify-between py-2 border-t border-black/5">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-900">Promoted Search Upsell</p>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">Rekomendasikan sebelum user mencari</p>
              </div>
              <input
                type="checkbox"
                checked={formData.is_promoted}
                onChange={e => setFormData({ ...formData, is_promoted: e.target.checked })}
                className="w-10 h-6 appearance-none bg-stone-100 rounded-full checked:bg-[#367F4D] relative cursor-pointer transition-all after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-1 after:left-1 checked:after:left-5 after:transition-all shadow-inner border border-black/5"
              />
            </div>

            {/* Input Teks Headline Promosi */}
            <AnimatePresence>
              {formData.is_promoted && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-2 pt-2 border-t border-dashed border-black/10"
                >
                  <label className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">Headline Promosi (Search Bar Clip)</label>
                  <Input
                    value={formData.search_upsell_headline || ""}
                    onChange={e => setFormData({ ...formData, search_upsell_headline: e.target.value })}
                    placeholder="e.g. Profil anaerob paling manis bulan ini."
                    className="h-10 bg-stone-50 border-black/10 font-medium rounded-sm text-xs focus-visible:ring-[#367F4D]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Media & Metadata */}
          <div className="bg-white border border-black/5 rounded-sm p-10 space-y-8 shadow-sm text-left">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Media Produk (URL)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[4/5] bg-stone-50 rounded-sm border-2 border-dashed border-black/10 overflow-hidden flex flex-col items-center justify-center gap-4 group hover:border-[#367F4D]/40 transition-all cursor-pointer relative"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={30} className="animate-spin text-[#367F4D]" />
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Uploading...</p>
                  </div>
                ) : formData.image_url ? (
                  <>
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, image_url: "" });
                      }}
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
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Minimal 800x1000px</p>
                    </div>
                  </>
                )}
              </div>
              <Input value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://cloud.fermion.com/prod-01.jpg" className="h-12 bg-stone-50 border-black/5 font-bold rounded-sm px-4 text-[10px] focus-visible:ring-[#367F4D]" />
            </div>

            {/* Journal Linking */}
            <div className="space-y-4 pt-6 border-t border-black/5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                <LinkIcon size={12} /> Hubungkan Jurnal (Opsional)
              </label>
              <Select
                value={formData.linked_journal_id || "none"}
                onValueChange={(val) => setFormData({ ...formData, linked_journal_id: val === "none" ? "" : val })}
              >
                <SelectTrigger className="w-full h-12 bg-stone-50 border-black/5 rounded-sm px-4 text-[10px] font-bold focus:ring-[#367F4D]">
                  <SelectValue placeholder="Pilih Cerita Kopi" />
                </SelectTrigger>
                <SelectContent className="rounded-sm border-black/5 shadow-2xl bg-white p-1">
                  <SelectItem value="none" className="text-[10px] font-bold uppercase py-3 focus:bg-stone-50">Tanpa Tautan</SelectItem>
                  {journalPosts.map(post => (
                    <SelectItem key={post.id} value={post.id} className="text-[10px] font-bold uppercase py-3 focus:bg-stone-50 focus:text-[#367F4D] outline-none">
                      {post.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">Produk ini akan menampilkan tautan "Baca Cerita" di halaman retail.</p>
            </div>

            {/* Status Aktif Custom Control */}
            <div className="pt-6 border-t border-black/5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Status Aktif</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Tampilkan di katalog utama</p>
              </div>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-10 h-6 appearance-none bg-stone-100 rounded-full checked:bg-[#367F4D] relative cursor-pointer transition-all after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-1 after:left-1 checked:after:left-5 after:transition-all shadow-inner border border-black/5"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
