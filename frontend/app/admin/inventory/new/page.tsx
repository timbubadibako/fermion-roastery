"use client";

import React, { useState, useEffect } from "react";
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
  X
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

export default function ProductFormPage() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params.id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [journalPosts, setJournalPosts] = useState<any[]>([]);

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
    sweetness: 4.0,
    acidity: 4.0,
    body: 4.0,
    stock_quantity: 0,
    is_active: true,
    linked_journal_id: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Journal Posts for selection
        const journalRes = await fetch("/api/journal");
        if (journalRes.ok) setJournalPosts(await journalRes.json());

        if (isEdit) {
          const productRes = await fetch(`/api/products/${params.id}`);
          if (productRes.ok) {
            const data = await productRes.json();
            setFormData(data);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isEdit ? `/api/products/${params.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(`Produk berhasil ${isEdit ? "diperbarui" : "ditambahkan"}.`);
        router.push("/admin/inventory");
      } else {
        toast.error("Gagal menyimpan produk.");
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
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Menyusun Spesifikasi...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 text-left">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/5 pb-10">
        <div className="space-y-4">
          <button 
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
                    <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Sumedang Anaerob" className="h-14 bg-stone-50 border-black/5 font-bold rounded-sm px-6 focus-visible:ring-[#367F4D]" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Slug URL</label>
                    <Input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="e.g. sumedang-anaerob" className="h-14 bg-stone-50 border-black/5 font-bold rounded-sm px-6 focus-visible:ring-[#367F4D]" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Deskripsi Naratif</label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Ceritakan tentang profil, sejarah, atau keunikan kopi ini..." 
                  className="min-h-[200px] bg-stone-50 border-black/5 rounded-sm p-6 text-sm font-medium leading-relaxed focus-visible:ring-[#367F4D]" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Origin (Wilayah)</label>
                    <div className="relative">
                        <Input value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} placeholder="West Java, Indonesia" className="h-14 bg-stone-50 border-black/5 font-bold rounded-sm px-6 pl-14 focus-visible:ring-[#367F4D]" />
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Kebun / Farm</label>
                    <Input value={formData.farm} onChange={e => setFormData({...formData, farm: e.target.value})} placeholder="Manglayang Farm" className="h-14 bg-stone-50 border-black/5 font-bold rounded-sm px-6 focus-visible:ring-[#367F4D]" />
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
                ].map(sensor => (
                  <div key={sensor.id} className="space-y-4">
                    <div className="flex justify-between items-end">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{sensor.label}</label>
                        <span className="text-xl font-black italic text-[#367F4D]">{(formData as any)[sensor.id]}/5.0</span>
                    </div>
                    <input 
                      type="range" min="0" max="5" step="0.1" 
                      value={(formData as any)[sensor.id]}
                      onChange={(e) => setFormData({...formData, [sensor.id]: parseFloat(e.target.value)})}
                      className="w-full h-1.5 bg-stone-100 appearance-none cursor-pointer rounded-full accent-[#367F4D]" 
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Proses Pasca Panen</label>
                    <Input value={formData.process} onChange={e => setFormData({...formData, process: e.target.value})} placeholder="e.g. Natural, Washed" className="h-14 bg-stone-50 border-black/5 font-bold rounded-sm px-6 focus-visible:ring-[#367F4D]" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Ketinggian (MASL)</label>
                    <Input value={formData.altitude} onChange={e => setFormData({...formData, altitude: e.target.value})} placeholder="e.g. 1400 - 1600" className="h-14 bg-stone-50 border-black/5 font-bold rounded-sm px-6 focus-visible:ring-[#367F4D]" />
                </div>
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Stats */}
        <div className="space-y-10 text-left">
           {/* Inventory & Price */}
           <div className="bg-slate-900 text-white rounded-sm p-10 space-y-10 shadow-2xl">
              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Harga Retail (IDR)</label>
                    <div className="relative">
                        <Input type="number" required value={formData.price_retail} onChange={e => setFormData({...formData, price_retail: parseFloat(e.target.value)})} className="h-16 bg-white/5 border-white/10 text-2xl font-bold rounded-sm px-6 focus-visible:ring-[#367F4D]" />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 font-black tracking-tighter italic">PER_UNIT</span>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Stok Inventaris (Unit)</label>
                    <div className="relative">
                        <Input type="number" required value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: parseInt(e.target.value)})} className="h-16 bg-white/5 border-white/10 text-2xl font-bold rounded-sm px-6 focus-visible:ring-[#367F4D]" />
                        <Boxes className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20" size={24} />
                    </div>
                 </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Profil Pemanggangan</label>
                <Select 
                    value={formData.roast_profile} 
                    onValueChange={(val) => setFormData({...formData, roast_profile: val})}
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

           {/* Media & Metadata */}
           <div className="bg-white border border-black/5 rounded-sm p-10 space-y-8 shadow-sm text-left">
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Media Produk (URL)</label>
                 <div className="aspect-[4/5] bg-stone-50 rounded-sm border-2 border-dashed border-black/10 overflow-hidden flex flex-col items-center justify-center gap-4 group hover:border-[#367F4D]/40 transition-all cursor-pointer relative">
                    {formData.image_url ? (
                      <>
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            onClick={() => setFormData({...formData, image_url: ""})}
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
                 <Input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://cloud.fermion.com/prod-01.jpg" className="h-12 bg-stone-50 border-black/5 font-bold rounded-sm px-4 text-[10px] focus-visible:ring-[#367F4D]" />
              </div>

              {/* Journal Linking */}
              <div className="space-y-4 pt-6 border-t border-black/5">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                    <LinkIcon size={12} /> Hubungkan Jurnal (Opsional)
                 </label>
                 <Select 
                    value={formData.linked_journal_id || "none"} 
                    onValueChange={(val) => setFormData({...formData, linked_journal_id: val === "none" ? "" : val})}
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

              <div className="pt-6 border-t border-black/5 flex items-center justify-between">
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Status Aktif</p>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Tampilkan di katalog utama</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.is_active} 
                  onChange={e => setFormData({...formData, is_active: e.target.checked})}
                  className="w-10 h-6 appearance-none bg-stone-100 rounded-full checked:bg-[#367F4D] relative cursor-pointer transition-all after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-1 after:left-1 checked:after:left-5 after:transition-all shadow-inner"
                />
              </div>
           </div>
        </div>
      </form>
    </div>
  );
}
