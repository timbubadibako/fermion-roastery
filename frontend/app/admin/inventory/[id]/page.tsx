"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  MapPin,
  Image as ImageIcon,
  Beaker,
  Boxes,
  Loader2,
  Link as LinkIcon,
  ChevronDown,
  X,
  Plus,
  Trash2,
  Sparkles,
  FileSpreadsheet,
  Package,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { downloadCsvTemplate } from "@/lib/csvHelper";

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
const parseNumericInput = (value: string) => Number(value.replace(/\D/g, "")) || 0;
const formatNumberInput = (value: number) => value ? value.toLocaleString("id-ID") : "";
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

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

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params.id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [journalPosts, setJournalPosts] = useState<any[]>([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    notes: "",
    origin: "",
    process: "",
    altitude: "",
    price_retail: 0,
    stock_quantity: 0,
    roast_profile: "Light to Medium",
    description: "",
    farm: "",
    image_url: "",
    category: "filter",
    sub_category: "filter_specialty",
    linked_journal_id: "",
    b2b_discount_enabled: true,
    is_active: true,
    fermentation: 3,
    sweetness: 3,
    acidity: 3,
    body: 3,
    is_new_release: false,
    is_promoted: false,
    search_upsell_headline: "",
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
        setFormData(prev => ({ ...prev, image_url: data.storagePath || data.url }));
        setImagePreviewUrl(data.previewUrl || data.url || "");
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
              image_url: textValue(data.image_url_storage_path || data.image_url),
              fermentation: numberValue(data.fermentation, 3),
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
            setImagePreviewUrl(textValue(data.image_url));
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
    const normalizedSlug = slugify(formData.slug || formData.name);
    if (normalizedSlug.length < 3) {
      toast.error("Slug produk minimal 3 karakter.");
      return;
    }

    const payload = {
      ...formData,
      slug: normalizedSlug,
    };

    setSaving(true);
    try {
      const url = isEdit ? `/api/products/${params.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(`Produk berhasil ${isEdit ? "diperbarui" : "ditambahkan"}.`);
        router.push("/admin/inventory");
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || data?.message || "Gagal menyimpan produk.");
      }
    } catch (e) {
      toast.error("Kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400 font-sans">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-[#367F4D] rounded-full animate-spin" />
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Memuat Spesifikasi Produk...</p>
    </div>
  );

  return (
    <div className="space-y-6 font-sans text-left w-full pb-16">
      {/* HEADER TOOLBAR CARD */}
      <div className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
            title="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span>{isEdit ? "EDIT SPESIFIKASI PRODUK" : "TAMBAH KOPI BARU"}</span>
              <span className="text-[10px] font-bold text-[#367F4D] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono">
                {formData.category.toUpperCase()}
              </span>
            </h1>
            <p className="text-xs font-medium text-slate-500">
              {isEdit ? `ID: ${params.id}` : "Kelola rincian SKU, profil rasa, varian kemasan, dan harga."}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {!isEdit && (
            <Button
              type="button"
              variant="outline"
              onClick={downloadCsvTemplate}
              className="h-9 border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl px-3.5 gap-2 shadow-xs"
            >
              <FileSpreadsheet size={14} className="text-[#367F4D]" /> Template CSV
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="h-9 border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl px-4 shadow-xs"
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-9 bg-[#367F4D] hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl px-5 gap-2 border-none shadow-xs"
          >
            {saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
            {isEdit ? "Simpan Perubahan" : "Daftarkan Produk"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Main Info & Flavor & Variants */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Informasi Dasar Produk */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Package size={16} className="text-[#367F4D]" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Informasi Dasar Produk</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Nama SKU Produk *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value, slug: formData.slug ? formData.slug : slugify(e.target.value) })}
                  placeholder="Contoh: Sumedang Anaerob Natural"
                  className="h-10 bg-slate-50 border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#367F4D]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Slug URL *</label>
                <Input
                  required
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: slugify(e.target.value) })}
                  placeholder="sumedang-anaerob-natural"
                  className="h-10 bg-slate-50 border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#367F4D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* KATEGORI UTAMA */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Kategori Utama</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" className="w-full h-10 bg-slate-50 border-slate-200 rounded-xl px-3.5 text-xs font-semibold text-slate-900 hover:bg-slate-100 justify-between items-center shadow-none">
                      <span>{formData.category === "filter" ? "Filter Coffee" : "Espresso"}</span>
                      <ChevronDown size={14} className="text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 rounded-xl border border-slate-200 shadow-xl p-1 bg-white z-50">
                    <DropdownMenuItem
                      className="text-xs font-bold py-2 px-3 cursor-pointer rounded-lg focus:bg-slate-100 focus:text-slate-900"
                      onClick={() => setFormData({ ...formData, category: "filter", sub_category: "filter_specialty" })}
                    >
                      Filter Coffee
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs font-bold py-2 px-3 cursor-pointer rounded-lg focus:bg-slate-100 focus:text-slate-900"
                      onClick={() => setFormData({ ...formData, category: "espresso", sub_category: "espresso_commercial" })}
                    >
                      Espresso
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* SUB KATEGORI */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Sub Kategori</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" className="w-full h-10 bg-slate-50 border-slate-200 rounded-xl px-3.5 text-xs font-semibold text-slate-900 hover:bg-slate-100 justify-between items-center shadow-none">
                      <span className="capitalize">
                        {formData.sub_category === "espresso_commercial" ? "Espresso Aja" : formData.sub_category === "espresso_commodity" ? "Espresso Komoditi" : formData.sub_category.replace('_', ' ')}
                      </span>
                      <ChevronDown size={14} className="text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 rounded-xl border border-slate-200 shadow-xl p-1 bg-white z-50">
                    {formData.category === "filter" ? (
                      <>
                        <DropdownMenuItem className="text-xs font-bold py-2 px-3 cursor-pointer rounded-lg focus:bg-slate-100" onClick={() => setFormData({ ...formData, sub_category: "filter_specialty" })}>Filter Specialty</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs font-bold py-2 px-3 cursor-pointer rounded-lg focus:bg-slate-100" onClick={() => setFormData({ ...formData, sub_category: "filter_exotic" })}>Filter Exotic</DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem className="text-xs font-bold py-2 px-3 cursor-pointer rounded-lg focus:bg-slate-100" onClick={() => setFormData({ ...formData, sub_category: "espresso_commodity" })}>Espresso Komoditi</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs font-bold py-2 px-3 cursor-pointer rounded-lg focus:bg-slate-100" onClick={() => setFormData({ ...formData, sub_category: "espresso_commercial" })}>Espresso Aja</DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Deskripsi Naratif Produk</label>
              <Textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ceritakan tentang profil rasa, asal kebun, atau rekomendasi penyeduhan..."
                className="min-h-[120px] bg-slate-50 border-slate-200 rounded-xl p-3.5 text-xs font-medium focus:bg-white focus:border-[#367F4D]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Origin / Wilayah</label>
                <div className="relative">
                  <Input value={formData.origin} onChange={e => setFormData({ ...formData, origin: e.target.value })} placeholder="Sumedang, Jawa Barat" className="h-10 bg-slate-50 border-slate-200 rounded-xl text-xs font-semibold pl-9 focus:bg-white focus:border-[#367F4D]" />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Kebun / Produsen</label>
                <Input value={formData.farm} onChange={e => setFormData({ ...formData, farm: e.target.value })} placeholder="Kebun Manglayang" className="h-10 bg-slate-50 border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#367F4D]" />
              </div>
            </div>
          </div>

          {/* Card 2: Profil Rasa Section */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Beaker size={16} className="text-[#367F4D]" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Analisa Profil Rasa (Cupping)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'fermentation', label: 'Intensitas Fermentasi' },
                { id: 'sweetness', label: 'Intensitas Sweetness' },
                { id: 'acidity', label: 'Brightness Acidity' },
                { id: 'body', label: 'Mouthfeel / Body' }
              ].map(sensor => {
                const sensorKey = sensor.id as keyof typeof formData;
                const sensorValue = (formData[sensorKey] as number) || 0;

                return (
                  <div key={sensor.id} className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">{sensor.label}</label>
                      <span className="text-xs font-black text-[#367F4D] font-mono bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        {sensorValue.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <input
                      type="range" min="0" max="5" step="0.1"
                      value={sensorValue}
                      onChange={(e) => setFormData({ ...formData, [sensor.id]: parseFloat(e.target.value) || 0 })}
                      className="w-full h-1.5 bg-slate-200 appearance-none cursor-pointer rounded-full accent-[#367F4D]"
                    />
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Proses Pasca Panen</label>
                <Input value={formData.process} onChange={e => setFormData({ ...formData, process: e.target.value })} placeholder="Anaerob Natural, Full Washed, Honey" className="h-10 bg-slate-50 border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#367F4D]" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Ketinggian (MASL)</label>
                <Input value={formData.altitude} onChange={e => setFormData({ ...formData, altitude: e.target.value })} placeholder="1400 - 1600 mdpl" className="h-10 bg-slate-50 border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#367F4D]" />
              </div>
            </div>
          </div>

          {/* Card 3: Varian Ukuran Kemasan */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Boxes size={16} className="text-[#367F4D]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Varian Ukuran Kemasan</h3>
              </div>
              <button
                type="button"
                onClick={addVariantRow}
                className="flex items-center gap-1.5 bg-[#367F4D] text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xl hover:bg-emerald-700 transition-colors"
              >
                <Plus size={13} strokeWidth={2.5} /> Tambah Varian
              </button>
            </div>

            {formData.variants.length === 0 ? (
              <div className="p-6 border border-dashed border-slate-200 text-center text-xs font-semibold text-slate-400 rounded-xl bg-slate-50">
                Belum ada varian custom. Sistem akan otomatis mendaftarkan varian default (150g & 250g).
              </div>
            ) : (
              <div className="space-y-3">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase">Ukuran / Berat</label>
                      <Input
                        required
                        placeholder="150g, 250g, 1kg"
                        value={variant.weight}
                        onChange={e => handleVariantChange(index, "weight", e.target.value)}
                        className="h-9 bg-white border-slate-200 rounded-lg font-semibold text-xs focus:border-[#367F4D]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase">Harga Retail (Rp)</label>
                      <Input
                        required
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={formatNumberInput(variant.price)}
                        onChange={e => handleVariantChange(index, "price", parseNumericInput(e.target.value))}
                        className="h-9 bg-white border-slate-200 rounded-lg font-mono font-bold text-xs focus:border-[#367F4D]"
                      />
                    </div>
                    <div className="space-y-1 relative pr-9">
                      <label className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase">Stok Pack</label>
                      <Input
                        required
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={formatNumberInput(variant.stock_quantity)}
                        onChange={e => handleVariantChange(index, "stock_quantity", parseNumericInput(e.target.value))}
                        className="h-9 bg-white border-slate-200 rounded-lg font-mono font-bold text-xs focus:border-[#367F4D]"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariantRow(index)}
                        className="absolute right-0 bottom-0.5 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Varian"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Display Price, Marketing, Media & Status */}
        <div className="space-y-6 text-left">
          {/* Card 1: Display Price & Inventory Overview */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <DollarSign size={16} className="text-[#367F4D]" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Harga Display & Stok Total</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Harga Display Catalog (Rp) *</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formatNumberInput(formData.price_retail)}
                  onChange={e => setFormData({ ...formData, price_retail: parseNumericInput(e.target.value) })}
                  className="h-11 bg-slate-50 border-slate-200 text-lg font-mono font-bold rounded-xl px-3.5 focus:bg-white focus:border-[#367F4D] text-slate-900"
                />
                <p className="text-[10px] font-medium text-slate-400">Harga "Mulai Dari" yang muncul di halaman depan.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Total Stok Inventaris *</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formatNumberInput(formData.stock_quantity)}
                  onChange={e => setFormData({ ...formData, stock_quantity: parseNumericInput(e.target.value) })}
                  className="h-11 bg-slate-50 border-slate-200 text-lg font-mono font-bold rounded-xl px-3.5 focus:bg-white focus:border-[#367F4D] text-slate-900"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Profil Pemanggangan</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" className="w-full h-10 bg-slate-50 border-slate-200 rounded-xl px-3.5 text-xs font-semibold text-slate-900 hover:bg-slate-100 justify-between items-center shadow-none">
                      <span>{formData.roast_profile}</span>
                      <ChevronDown size={14} className="text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 rounded-xl border border-slate-200 shadow-xl p-1 bg-white z-50">
                    <DropdownMenuItem className="text-xs font-bold py-2 px-3 cursor-pointer rounded-lg focus:bg-slate-100" onClick={() => setFormData({ ...formData, roast_profile: "Light" })}>Light Roast</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs font-bold py-2 px-3 cursor-pointer rounded-lg focus:bg-slate-100" onClick={() => setFormData({ ...formData, roast_profile: "Light to Medium" })}>Light to Medium</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs font-bold py-2 px-3 cursor-pointer rounded-lg focus:bg-slate-100" onClick={() => setFormData({ ...formData, roast_profile: "Medium" })}>Medium Roast</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs font-bold py-2 px-3 cursor-pointer rounded-lg focus:bg-slate-100" onClick={() => setFormData({ ...formData, roast_profile: "Medium to Dark" })}>Medium to Dark</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Card 2: Marketing & Discovery Panel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles size={16} className="text-[#367F4D]" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Campaign & Discovery</h3>
            </div>

            <div className="space-y-3 divide-y divide-slate-100 text-xs">
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="font-bold text-slate-900">Diskon B2B / Mitra</p>
                  <p className="text-[10px] text-slate-400 font-medium">Aktifkan potongan khusus partner</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.b2b_discount_enabled}
                  onChange={e => setFormData({ ...formData, b2b_discount_enabled: e.target.checked })}
                  className="w-9 h-5 appearance-none bg-slate-200 rounded-full checked:bg-[#367F4D] relative cursor-pointer transition-all after:content-[''] after:absolute after:w-3.5 after:h-3.5 after:bg-white after:rounded-full after:top-0.75 after:left-0.75 checked:after:left-4.75 after:transition-all shadow-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-bold text-slate-900">Badge New Release</p>
                  <p className="text-[10px] text-slate-400 font-medium">Tampilkan pita "Just Roasted"</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_new_release}
                  onChange={e => setFormData({ ...formData, is_new_release: e.target.checked })}
                  className="w-9 h-5 appearance-none bg-slate-200 rounded-full checked:bg-[#367F4D] relative cursor-pointer transition-all after:content-[''] after:absolute after:w-3.5 after:h-3.5 after:bg-white after:rounded-full after:top-0.75 after:left-0.75 checked:after:left-4.75 after:transition-all shadow-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-bold text-slate-900">Promoted Search</p>
                  <p className="text-[10px] text-slate-400 font-medium">Rekomendasi teratas saat cari</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_promoted}
                  onChange={e => setFormData({ ...formData, is_promoted: e.target.checked })}
                  className="w-9 h-5 appearance-none bg-slate-200 rounded-full checked:bg-[#367F4D] relative cursor-pointer transition-all after:content-[''] after:absolute after:w-3.5 after:h-3.5 after:bg-white after:rounded-full after:top-0.75 after:left-0.75 checked:after:left-4.75 after:transition-all shadow-xs"
                />
              </div>

              {formData.is_promoted && (
                <div className="pt-3 space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">Headline Promosi</label>
                  <Input
                    value={formData.search_upsell_headline}
                    onChange={e => setFormData({ ...formData, search_upsell_headline: e.target.value })}
                    placeholder="Profil anaerob paling manis bulan ini."
                    className="h-9 bg-slate-50 border-slate-200 font-medium rounded-xl text-xs focus:border-[#367F4D]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Media & Metadata */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ImageIcon size={16} className="text-[#367F4D]" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Foto & Status Publikasi</h3>
            </div>

            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[4/3] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center gap-2 hover:border-[#367F4D] transition-all cursor-pointer relative group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-[#367F4D]" />
                    <p className="text-[10px] font-bold text-slate-400">Mengunggah...</p>
                  </div>
                ) : (imagePreviewUrl || formData.image_url) ? (
                  <>
                    <img src={imagePreviewUrl || formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, image_url: "" });
                        setImagePreviewUrl("");
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg text-red-500 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform border border-slate-200">
                      <ImageIcon size={18} className="text-slate-400 group-hover:text-[#367F4D] transition-colors" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Unggah Berkas Foto</p>
                  </>
                )}
              </div>
              <Input
                value={formData.image_url}
                onChange={e => {
                  const value = e.target.value;
                  setFormData({ ...formData, image_url: value });
                  setImagePreviewUrl(value);
                }}
                placeholder="Path internal atau URL gambar"
                className="h-9 bg-slate-50 border-slate-200 font-mono text-[10px] rounded-xl focus:border-[#367F4D]"
              />

              {/* Hubungkan Jurnal */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <LinkIcon size={12} /> Hubungkan Jurnal (Opsional)
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" className="w-full h-9 bg-slate-50 border-slate-200 rounded-xl px-3 text-xs font-semibold text-slate-900 hover:bg-slate-100 justify-between items-center shadow-none">
                      <span className="truncate">
                        {journalPosts.find(post => post.id === formData.linked_journal_id)?.title || "Tanpa Tautan"}
                      </span>
                      <ChevronDown size={14} className="text-slate-400 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 rounded-xl border border-slate-200 shadow-xl p-1 bg-white max-h-56 overflow-y-auto z-50">
                    <DropdownMenuItem className="text-xs font-bold py-2 px-3 cursor-pointer rounded-lg focus:bg-slate-100" onClick={() => setFormData({ ...formData, linked_journal_id: "" })}>Tanpa Tautan</DropdownMenuItem>
                    {journalPosts.map(post => (
                      <DropdownMenuItem key={post.id} className="text-xs font-bold py-2 px-3 cursor-pointer rounded-lg focus:bg-slate-100" onClick={() => setFormData({ ...formData, linked_journal_id: post.id })}>
                        {post.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Status Aktif */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Status Aktif Katalog</p>
                  <p className="text-[10px] text-slate-400 font-medium">Tampilkan di etalase pembeli</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-9 h-5 appearance-none bg-slate-200 rounded-full checked:bg-[#367F4D] relative cursor-pointer transition-all after:content-[''] after:absolute after:w-3.5 after:h-3.5 after:bg-white after:rounded-full after:top-0.75 after:left-0.75 checked:after:left-4.75 after:transition-all shadow-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
