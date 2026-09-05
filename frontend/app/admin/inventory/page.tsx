"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Coffee, 
  Save,
  Boxes,
  RefreshCw,
  FileSpreadsheet,
  Download,
  Upload,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { downloadCsvTemplate, parseCsvProducts } from "@/lib/csvHelper";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  slug: string;
  notes?: string;
  origin: string;
  process: string;
  altitude: string;
  price_retail: number;
  roast_profile: string;
  description: string;
  farm: string;
  image_url: string;
  fermentation?: string;
  sweetness?: number;
  acidity?: number;
  body?: number;
  stock_quantity: number;
  is_active: boolean;
  b2b_discount_enabled?: boolean;
  is_new_release?: boolean;
  category?: string;
}

export default function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Bulk Import CSV State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedPreviewProducts, setImportedPreviewProducts] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const csvFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        const res = await fetch("/api/products");
        if (res.ok) {
          const apiData = await res.json();
          if (Array.isArray(apiData)) setProducts(apiData);
        }
      } else {
        setProducts(data);
      }
    } catch (e) {
      toast.error("Gagal memuat katalog produk.");
    } finally {
      setLoading(false);
    }
  };

  const handleInlineUpdate = async (id: string, field: keyof Product, value: any) => {
    setUpdatingId(id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));

    try {
      const { error } = await supabase
        .from('products')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        const res = await apiFetch(`/api/products/${id}`, {
          method: "PUT",
          body: JSON.stringify({ [field]: value })
        });
        if (!res.ok) throw new Error("Gagal mengupdate produk.");
      }

      toast.success(`Produk diperbarui: ${field}`);
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan perubahan.");
      fetchProducts();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBulkToggleActive = async (status: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      const { error } = await supabase
        .from('products')
        .update({ is_active: status })
        .in('id', selectedIds);

      if (error) {
        await Promise.all(selectedIds.map(id => 
          apiFetch(`/api/products/${id}`, {
            method: "PUT",
            body: JSON.stringify({ is_active: status })
          })
        ));
      }

      toast.success(`${selectedIds.length} produk di-${status ? 'aktifkan' : 'nonaktifkan'}`);
      setSelectedIds([]);
      fetchProducts();
    } catch (e) {
      toast.error("Gagal memperbarui status bulk.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await apiFetch(`/api/products/${productToDelete}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Produk berhasil dihapus.");
        fetchProducts();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.message || "Gagal menghapus produk.");
      }
    } catch (e) {
      toast.error("Gagal menghapus produk.");
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  // CSV File Handler
  const handleCsvFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCsvProducts(text);
      if (parsed.length === 0) {
        toast.error("Format CSV tidak valid atau baris data kosong.");
        return;
      }
      setImportedPreviewProducts(parsed);
      toast.success(`Ditemukan ${parsed.length} baris produk dalam CSV!`);
    };
    reader.readAsText(file);
  };

  const handleExecuteBulkImport = async () => {
    if (importedPreviewProducts.length === 0) return;
    setIsImporting(true);

    try {
      let successCount = 0;
      for (const prod of importedPreviewProducts) {
        const { error } = await supabase.from('products').insert([prod]);
        if (error) {
          await apiFetch('/api/products', {
            method: 'POST',
            body: JSON.stringify(prod)
          }).catch(() => null);
        }
        successCount++;
      }

      toast.success(`Berhasil mengimpor ${successCount} produk baru ke katalog!`);
      setIsImportModalOpen(false);
      setImportedPreviewProducts([]);
      fetchProducts();
    } catch (err) {
      toast.error("Terjadi kendala saat mengimpor produk.");
    } finally {
      setIsImporting(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.origin && p.origin.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.process && p.process.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.roast_profile && p.roast_profile.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (categoryFilter === "filter") return p.category === "filter";
    if (categoryFilter === "espresso") return p.category === "espresso";
    if (categoryFilter === "low_stock") return (p.stock_quantity || 0) <= 15;
    if (categoryFilter === "inactive") return !p.is_active;

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  if (loading && products.length === 0) return (
    <div className="h-[65vh] flex flex-col items-center justify-center gap-4 text-slate-400 font-sans">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-[#367F4D] rounded-full animate-spin" />
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mengakses Database Supabase...</p>
    </div>
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Action Toolbar Header */}
      <div className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <span>KATALOG PRODUK & STOK KOPI</span>
            <span className="text-[10px] font-bold text-[#367F4D] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono">
              {products.length} SKU
            </span>
          </h1>
        </div>

        {/* Buttons & Search */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl border border-slate-800 animate-in fade-in">
              <span className="text-xs font-bold text-amber-400">{selectedIds.length} TERPILIH:</span>
              <button 
                onClick={() => handleBulkToggleActive(true)}
                className="px-2.5 py-1 bg-[#367F4D] hover:bg-emerald-600 rounded-lg text-[10px] font-bold uppercase transition-colors"
              >
                AKTIFKAN
              </button>
              <button 
                onClick={() => handleBulkToggleActive(false)}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-[10px] font-bold uppercase transition-colors"
              >
                NONAKTIFKAN
              </button>
            </div>
          )}

          <Button 
            onClick={downloadCsvTemplate}
            variant="outline"
            className="h-9 border-slate-200 hover:bg-stone-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl px-3.5 gap-2 shadow-xs"
          >
            <Download size={14} className="text-[#367F4D]" /> Template CSV
          </Button>

          <Button 
            onClick={() => setIsImportModalOpen(true)}
            variant="outline"
            className="h-9 border-slate-200 hover:bg-stone-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl px-3.5 gap-2 shadow-xs"
          >
            <FileSpreadsheet size={14} className="text-emerald-600" /> Bulk Import CSV
          </Button>

          <Link href="/admin/inventory/new">
            <Button className="h-9 bg-[#367F4D] hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl px-4 gap-2 border-none shadow-xs">
              <Plus size={15} /> Tambah Kopi Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: `SEMUA (${products.length})` },
            { id: "filter", label: `FILTER COFFEE` },
            { id: "espresso", label: `ESPRESSO` },
            { id: "low_stock", label: `STOK MENIPIS (<15)` },
            { id: "inactive", label: `DRAFT / NONAKTIF` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors ${
                categoryFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative self-stretch md:self-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <Input 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari Nama, SKU, Origin, Proses..." 
            className="pl-9 h-10 w-full md:w-64 bg-slate-50 border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#367F4D]" 
          />
        </div>
      </div>

      {/* High-Density Inline Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4 w-10 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length > 0 && selectedIds.length === filteredProducts.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded cursor-pointer accent-[#367F4D]"
                  />
                </th>
                <th className="p-4">Produk & Origin</th>
                <th className="p-4">Kategori</th>
                <th className="p-4 text-right">Harga Retail (Rp)</th>
                <th className="p-4 text-center">Stok (Pack/Kg)</th>
                <th className="p-4 text-center">Diskon B2B</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-16 text-center text-slate-400 font-bold uppercase text-xs">
                    <div className="space-y-3">
                      <p>Tidak ada produk ditemukan.</p>
                      <div className="flex justify-center gap-3">
                        <Link href="/admin/inventory/new">
                          <Button className="h-9 bg-[#367F4D] text-white text-xs font-bold rounded-xl px-4">
                            <Plus size={14} className="mr-2" /> Tambah Produk Pertama
                          </Button>
                        </Link>
                        <Button onClick={() => setIsImportModalOpen(true)} variant="outline" className="h-9 text-xs font-bold rounded-xl px-4">
                          <FileSpreadsheet size={14} className="mr-2" /> Import via CSV
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  return (
                    <tr 
                      key={product.id}
                      className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-amber-50/40' : ''}`}
                    >
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleSelect(product.id)}
                          className="rounded cursor-pointer accent-[#367F4D]"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <Coffee size={18} className="text-slate-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 text-xs block uppercase leading-tight">{product.name}</span>
                            <span className="text-[10px] text-slate-500 font-medium">{product.origin || "Indonesia"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-emerald-50 text-[#367F4D] border border-emerald-200 font-bold text-[10px] rounded-lg uppercase">
                          {product.category || 'Specialty'}
                        </span>
                      </td>
                      
                      {/* Inline Price Edit */}
                      <td className="p-4 text-right">
                        <input 
                          type="number"
                          defaultValue={product.price_retail}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            if (val !== product.price_retail) handleInlineUpdate(product.id, 'price_retail', val);
                          }}
                          className="w-24 px-2.5 py-1 bg-slate-50 border border-slate-200 focus:border-[#367F4D] focus:bg-white text-right font-bold text-slate-900 rounded-lg outline-none transition-all font-mono"
                        />
                      </td>

                      {/* Inline Stock Edit */}
                      <td className="p-4 text-center">
                        <input 
                          type="number"
                          defaultValue={product.stock_quantity}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            if (val !== product.stock_quantity) handleInlineUpdate(product.id, 'stock_quantity', val);
                          }}
                          className="w-20 px-2.5 py-1 bg-slate-50 border border-slate-200 focus:border-[#367F4D] focus:bg-white text-center font-extrabold text-slate-900 rounded-lg outline-none transition-all font-mono"
                        />
                      </td>

                      {/* Inline B2B Discount Toggle */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleInlineUpdate(product.id, 'b2b_discount_enabled', !product.b2b_discount_enabled)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                            product.b2b_discount_enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {product.b2b_discount_enabled ? 'Diskon B2B' : 'Normal'}
                        </button>
                      </td>

                      {/* Inline Active Toggle */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleInlineUpdate(product.id, 'is_active', !product.is_active)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                            product.is_active ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {product.is_active ? 'Aktif' : 'Draft'}
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/inventory/${product.id}`}>
                            <Button className="h-8 w-8 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition-all p-0 border-none shadow-none">
                              <Edit3 size={14} />
                            </Button>
                          </Link>
                          <Button 
                            onClick={() => { setProductToDelete(product.id); setIsDeleteModalOpen(true); }}
                            className="h-8 w-8 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all p-0 border-none shadow-none"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        {filteredProducts.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans">
            <p className="text-slate-500 font-medium">
              Menampilkan <span className="font-extrabold text-slate-800">{startIndex + 1}</span> - <span className="font-extrabold text-slate-800">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span> dari <span className="font-extrabold text-slate-800">{filteredProducts.length}</span> produk
            </p>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                variant="outline"
                className="h-8 px-3 rounded-xl border-slate-200 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-700 disabled:opacity-40 shadow-none"
              >
                Sebelumnya
              </Button>
              <span className="text-[11px] font-extrabold text-slate-800 px-2">
                Halaman {safePage} / {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                variant="outline"
                className="h-8 px-3 rounded-xl border-slate-200 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-700 disabled:opacity-40 shadow-none"
              >
                Berikutnya
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* BULK IMPORT CSV MODAL */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-2xl p-8 space-y-6 shadow-2xl text-left border border-slate-200 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Bulk Import Produk via CSV</h2>
                  <p className="text-xs font-medium text-slate-500 mt-1">Unggah berkas CSV untuk mendaftarkan banyak SKU kopi secara otomatis.</p>
                </div>
                <button onClick={() => { setIsImportModalOpen(false); setImportedPreviewProducts([]); }}><X size={20} className="text-slate-400 hover:text-slate-900" /></button>
              </div>

              {/* Upload Dropzone */}
              <div className="space-y-4">
                <div 
                  onClick={() => csvFileInputRef.current?.click()}
                  className="aspect-[4/1] bg-stone-50 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#367F4D] transition-colors cursor-pointer flex flex-col items-center justify-center p-6 text-center group"
                >
                  <input 
                    type="file"
                    ref={csvFileInputRef}
                    accept=".csv"
                    onChange={handleCsvFileSelected}
                    className="hidden"
                  />
                  <FileSpreadsheet size={32} className="text-slate-400 group-hover:text-[#367F4D] transition-colors mb-2" />
                  <p className="text-xs font-bold uppercase text-slate-700">Klik atau Lepaskan Berkas CSV Di Sini</p>
                  <p className="text-[10px] text-slate-400 font-medium">Format: CSV dengan separator koma (UTF-8)</p>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-600">Belum punya format CSV yang sesuai?</span>
                  <Button onClick={downloadCsvTemplate} variant="outline" className="h-8 text-[10px] font-bold uppercase rounded-lg">
                    <Download size={12} className="mr-1.5 text-[#367F4D]" /> Unduh Template CSV
                  </Button>
                </div>
              </div>

              {/* Parsed Preview Table */}
              {importedPreviewProducts.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-extrabold uppercase text-slate-900">
                      Preview Data Terdeteksi ({importedPreviewProducts.length} Produk):
                    </h4>
                  </div>
                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl bg-stone-50 p-2">
                    <table className="w-full text-left text-[11px] font-mono">
                      <thead className="text-slate-500 uppercase border-b border-slate-200">
                        <tr>
                          <th className="p-2">Nama</th>
                          <th className="p-2">Kategori</th>
                          <th className="p-2 text-right">Harga</th>
                          <th className="p-2 text-center">Stok</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {importedPreviewProducts.map((p, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-bold text-slate-900">{p.name}</td>
                            <td className="p-2 uppercase">{p.category}</td>
                            <td className="p-2 text-right font-bold">Rp {p.price_retail?.toLocaleString('id-ID')}</td>
                            <td className="p-2 text-center font-bold">{p.stock_quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button 
                  variant="outline"
                  onClick={() => { setIsImportModalOpen(false); setImportedPreviewProducts([]); }}
                  className="h-11 rounded-xl text-xs font-bold uppercase px-6"
                >
                  Batal
                </Button>
                <Button 
                  onClick={handleExecuteBulkImport}
                  disabled={importedPreviewProducts.length === 0 || isImporting}
                  className="h-11 bg-[#367F4D] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase px-8 border-none"
                >
                  {isImporting ? <Loader2 className="animate-spin mr-2" size={16} /> : <CheckCircle2 className="mr-2" size={16} />}
                  Impor {importedPreviewProducts.length} Produk Sekarang
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Produk?"
        description="Data produk dan riwayatnya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Permanen"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
}
