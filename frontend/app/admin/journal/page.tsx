"use client";

import React, { useState, useEffect } from "react";
import { Edit3, Plus, Search, Eye, Trash2, Calendar, FileText, CheckCircle2, Loader2, Globe, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import Link from "next/link";

export default function JournalCMS() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

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
      const res = await fetch(`/api/journal/${postToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Jurnal berhasil dihapus.");
        fetchPosts();
      }
    } catch (e) {
      toast.error("Gagal menghapus.");
    } finally {
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
      <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Memuat Jurnal...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/5 pb-10">
        <div className="space-y-3 text-left">
          <h1 className="text-5xl md:text-7xl font-fraunces italic font-bold tracking-tighter text-slate-900 leading-none">Jurnal <br/> Roastery.</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Dokumentasikan eksperimen, panen, dan riset pemanggangan.</p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={14} />
                <Input 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Cari Judul atau Kategori..." 
                    className="pl-12 h-12 w-64 bg-white border-black/10 rounded-sm text-xs font-bold focus:ring-[#367F4D]" 
                />
            </div>
            <Link href="/admin/journal/new">
                <Button className="bg-slate-950 text-white rounded-sm h-12 px-10 gap-3 font-black uppercase tracking-widest italic shadow-xl hover:bg-[#367F4D] transition-all border-none">
                <Plus size={20} /> Tulis Cerita Baru
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full py-24 text-center text-stone-300 font-bold uppercase tracking-widest text-xs italic">Belum ada jurnal terdaftar.</div>
        ) : (
          filteredPosts.map((post, i) => (
            <Link key={post.id} href={`/admin/journal/${post.id}`}>
                <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-sm border border-black/5 space-y-6 shadow-sm group hover:shadow-xl hover:border-[#367F4D]/20 transition-all cursor-pointer h-full flex flex-col"
                >
                <div className="w-full h-44 bg-stone-50 rounded-sm overflow-hidden relative">
                    {post.featured_image ? (
                    <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-200">
                        <ImageIcon size={40} />
                    </div>
                    )}
                    <div className="absolute top-4 left-4 flex justify-between w-[calc(100%-2rem)] items-start">
                        <span className="status-badge bg-white/95 backdrop-blur-sm text-slate-900 uppercase shadow-md text-[8px] font-black px-3 py-1.5 rounded-sm border border-black/5">{post.category || 'Berita'}</span>
                        <button 
                            onClick={(e) => handleDelete(e, post.id)} 
                            className="p-2.5 bg-red-50 text-red-500 rounded-sm opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-red-500 hover:text-white border-none"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
                
                <div className="space-y-3 flex-1 px-1">
                    <h3 className="font-fraunces text-2xl italic font-bold text-slate-900 leading-tight line-clamp-2">{post.title}</h3>
                    <div className="flex items-center gap-3">
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={12} /> {new Date(post.created_at).toLocaleDateString('id-ID')}</p>
                        <div className={`w-1.5 h-1.5 rounded-full ${post.status === 'published' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                    </div>
                </div>
                
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed px-1 font-medium uppercase tracking-wide opacity-80">{post.excerpt || post.content}</p>
                
                <div className="pt-6 border-t border-black/5 flex items-center justify-end mt-auto">
                    <Button className="h-10 px-6 text-[9px] font-black uppercase tracking-widest bg-stone-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all rounded-sm border-none shadow-none">Edit Cerita <Edit3 size={14} className="ml-2" /></Button>
                </div>
                </motion.div>
            </Link>
          ))
        )}
      </div>

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Jurnal?"
        description="Tindakan ini akan menghapus cerita ini secara permanen dari arsip Roastery. Tidak dapat dibatalkan."
        confirmText="Hapus Permanen"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
}
