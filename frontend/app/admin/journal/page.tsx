"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Edit3, 
  Plus, 
  Search, 
  Trash2, 
  Calendar, 
  Image as ImageIcon, 
  BookOpen,
  Download,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

const parseCSV = (text: string) => {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const results: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    const row = rawLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || rawLine.split(',');
    if (!row || row.length === 0) continue;

    const obj: any = {};
    headers.forEach((header, idx) => {
      let val = row[idx] ? row[idx].trim() : "";
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      obj[header] = val;
    });

    if (obj.title && (obj.content || obj.excerpt)) {
      results.push(obj);
    }
  }
  return results;
};

export default function JournalCMS() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/journal");
      if (res.ok) setPosts(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setPostToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    try {
      const res = await apiFetch(`/api/journal/${postToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Jurnal berhasil dihapus.");
        fetchPosts();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.message || "Gagal menghapus.");
      }
    } catch (e) {
      toast.error("Gagal menghapus.");
    } finally {
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    }
  };

  const handleDownloadCSVTemplate = () => {
    const csvHeader = "title,category,content,excerpt,status,featured_image\n";
    const sampleRow1 = '"Profil Roasting Gayo Anaerob","Eksperimen","Catatan eksperimen penyangraian gayo anaerob pada suhu 205C...","Profil roasting gayo anaerob 2026","published","https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd"\n';
    const sampleRow2 = '"Panduan Seduh V60 Presisi","Edukasi","Panduan rasio 1:15 untuk kejelasan rasa floral gayo...","Teknik seduh V60 presisi","published","https://images.unsplash.com/photo-1447933601403-0c6688de566e"';

    const csvData = csvHeader + sampleRow1 + sampleRow2;
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template_jurnal_fermion.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Template CSV berhasil diunduh.");
  };

  const handleCSVFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const parsedRows = parseCSV(text);
        if (parsedRows.length === 0) {
          toast.error("File CSV kosong atau format tidak sesuai.");
          return;
        }

        toast.loading(`Mengimpor ${parsedRows.length} artikel jurnal...`, { id: "import-csv" });
        let importedCount = 0;

        for (const row of parsedRows) {
          if (!row.title) continue;
          const payload = {
            title: row.title,
            category: row.category || 'Eksperimen',
            content: row.content || row.excerpt || 'Konten jurnal',
            excerpt: row.excerpt || (row.content ? row.content.slice(0, 120) : ''),
            status: row.status || 'published',
            featured_image: row.featured_image || ''
          };

          const res = await apiFetch("/api/journal", {
            method: 'POST',
            body: JSON.stringify(payload)
          });

          if (res.ok) importedCount++;
        }

        toast.success(`Berhasil mengimpor ${importedCount} artikel jurnal dari CSV!`, { id: "import-csv" });
        fetchPosts();
      } catch (err) {
        toast.error("Gagal mengimpor file CSV.", { id: "import-csv" });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return (
    <div className="h-[65vh] flex flex-col items-center justify-center gap-4 text-slate-400 font-sans">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-[#367F4D] rounded-full animate-spin" />
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Memuat Jurnal...</p>
    </div>
  );

  return (
    <div className="w-full space-y-6 font-sans text-left">
      {/* Action Toolbar Header */}
      <div className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#367F4D]/10 text-[#367F4D] rounded-xl">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span>JURNAL ROASTERY & CMS</span>
              <span className="text-[10px] font-bold text-[#367F4D] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono">
                {posts.length} ARTIKEL
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Kelola publikasi riset sangrai, edukasi, dan cerita eksperimen kopi.
            </p>
          </div>
        </div>

        {/* Buttons & Search */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <Input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari Judul atau Kategori..." 
              className="pl-9 h-9 w-52 bg-slate-50 border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#367F4D]" 
            />
          </div>

          {/* Download CSV Template */}
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadCSVTemplate}
            className="h-9 px-3 text-xs font-bold uppercase tracking-wider rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 gap-1.5 shadow-none"
            title="Download Template CSV Jurnal"
          >
            <Download size={14} className="text-[#367F4D]" /> Template CSV
          </Button>

          {/* Upload CSV Button & Hidden Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCSVFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 px-3 text-xs font-bold uppercase tracking-wider rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 gap-1.5 shadow-none"
            title="Import Bulk Artikel dari CSV"
          >
            <Upload size={14} className="text-[#367F4D]" /> Import CSV
          </Button>

          <Link href="/admin/journal/new">
            <Button className="h-9 bg-[#367F4D] hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl px-4 gap-1.5 border-none shadow-xs">
              <Plus size={15} /> Tulis Artikel
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full py-20 bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs shadow-xs">
            Belum ada jurnal terdaftar pada kategori ini.
          </div>
        ) : (
          paginatedPosts.map((post, i) => (
            <Link key={post.id} href={`/admin/journal/${post.id}`}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs group hover:shadow-md hover:border-[#367F4D]/40 transition-all cursor-pointer h-full flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-full h-44 bg-slate-100 rounded-xl overflow-hidden relative">
                    {post.featured_image ? (
                      <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon size={36} />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                      <span className="bg-slate-900/90 backdrop-blur-sm text-white uppercase text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                        {post.category || 'Eksperimen'}
                      </span>
                      <button 
                        onClick={(e) => handleDelete(e, post.id)} 
                        className="p-1.5 bg-white/90 text-rose-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xs hover:bg-rose-600 hover:text-white"
                        title="Hapus Jurnal"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 px-1">
                    <h3 className="font-extrabold text-base text-slate-900 leading-snug line-clamp-2 group-hover:text-[#367F4D] transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar size={12} /> 
                        {new Date(post.created_at || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <span className="text-slate-300">•</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        post.status === 'published' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {post.status || 'published'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                      {post.excerpt || post.content}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end mt-4">
                  <span className="h-8 px-4 text-xs font-bold uppercase tracking-wider bg-slate-50 text-slate-700 group-hover:bg-[#367F4D] group-hover:text-white transition-all rounded-xl inline-flex items-center gap-1.5">
                    Edit Artikel <Edit3 size={13} />
                  </span>
                </div>
              </motion.div>
            </Link>
          ))
        )}
      </div>

      {/* PAGINATION KARTU JURNAL */}
      {filteredPosts.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans shadow-xs">
          <p className="text-slate-500 font-medium">
            Menampilkan <span className="font-extrabold text-slate-800">{startIndex + 1}</span> - <span className="font-extrabold text-slate-800">{Math.min(startIndex + itemsPerPage, filteredPosts.length)}</span> dari <span className="font-extrabold text-slate-800">{filteredPosts.length}</span> artikel
          </p>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              variant="outline"
              className="h-8.5 px-3 rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-700 disabled:opacity-40 shadow-none"
            >
              Sebelumnya
            </Button>
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all ${
                    pageNum === safePage
                      ? 'bg-[#367F4D] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <Button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              variant="outline"
              className="h-8.5 px-3 rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-700 disabled:opacity-40 shadow-none"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Artikel Jurnal?"
        description="Tindakan ini akan menghapus artikel jurnal ini secara permanen. Tidak dapat dibatalkan."
        confirmText="Hapus Permanen"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
}
