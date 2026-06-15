"use client";

import React, { useState, useEffect } from "react";
import { Edit3, Plus, Search, Eye, Trash2, Calendar, FileText, CheckCircle2, Loader2, Globe, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { X } from "lucide-react";

export default function JournalCMS() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  
  const initialForm = {
    title: "",
    category: "Eksperimen",
    status: "published",
    content: "",
    excerpt: "",
    featured_image: ""
  };
  const [formData, setFormData] = useState(initialForm);

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

  const openEditor = (post: any = null) => {
    if (post) {
      setEditId(post.id);
      setFormData({
        title: post.title || "",
        category: post.category || "Eksperimen",
        status: post.status || "published",
        content: post.content || "",
        excerpt: post.excerpt || "",
        featured_image: post.featured_image || ""
      });
    } else {
      setEditId(null);
      setFormData(initialForm);
    }
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!editId;
      const url = isEdit ? `/api/journal/${editId}` : "/api/journal";
      const method = isEdit ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success(`Jurnal berhasil ${isEdit ? 'diperbarui' : 'diterbitkan'}.`);
        setIsEditorOpen(false);
        fetchPosts();
      }
    } catch (e) {
      toast.error("Gagal menyimpan jurnal.");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
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
      setPostToDelete(null);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Memuat Jurnal...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-left">
          <h1 className="display-font text-6xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">Jurnal <br/> Kopi.</h1>
          <p className="text-sm font-medium text-slate-500">Dokumentasikan cerita, panen, dan proses roasting untuk dibaca pelanggan.</p>
        </div>
        <Button onClick={() => openEditor()} className="bg-slate-950 text-white rounded-2xl h-16 px-10 gap-3 font-black uppercase tracking-widest italic shadow-2xl hover:bg-periwinkle transition-all">
           <Plus size={20} /> Tulis Cerita Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        {posts.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs italic">Belum ada jurnal yang ditulis.</div>
        ) : (
          posts.map((post, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={post.id} 
              onClick={() => openEditor(post)}
              className="bg-white p-8 rounded-[3rem] border border-slate-100 space-y-6 shadow-sm group hover:shadow-2xl transition-all cursor-pointer flex flex-col"
            >
               <div className="w-full h-40 bg-slate-50 rounded-[2rem] overflow-hidden relative">
                 {post.featured_image ? (
                   <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-300">
                     <ImageIcon size={32} />
                   </div>
                 )}
                 <div className="absolute top-4 left-4 flex justify-between w-[calc(100%-2rem)] items-start">
                    <span className="status-badge bg-white/90 backdrop-blur-sm text-slate-900 uppercase shadow-sm">{post.category || 'Berita'}</span>
                    <button onClick={(e) => handleDelete(e, post.id)} className="p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-500 hover:text-white"><Trash2 size={14} /></button>
                 </div>
               </div>
               
               <div className="space-y-2 flex-1">
                  <h3 className="display-font text-2xl italic font-black text-slate-900 leading-tight line-clamp-2">{post.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={12} /> {new Date(post.created_at).toLocaleDateString('id-ID')}</p>
               </div>
               <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{post.excerpt || post.content}</p>
               
               <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${post.status === 'published' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                     <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{post.status === 'published' ? 'Diterbitkan' : 'Draft'}</span>
                  </div>
                  <Button variant="ghost" className="h-8 px-4 text-[9px] font-black uppercase tracking-widest text-periwinkle hover:bg-periwinkle/10">Edit Cerita <Edit3 size={12} className="ml-1" /></Button>
               </div>
            </motion.div>
          ))
        )}
      </div>

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Cerita?"
        description="Tindakan ini akan menghapus entri ini secara permanen dari arsip roastery. Proses ini tidak dapat dibatalkan."
        confirmText="Hapus Permanen"
        cancelText="Simpan Cerita"
        variant="danger"
      />

      {/* JOURNAL EDITOR MODAL */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
             <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3.5rem] w-full max-w-4xl p-12 space-y-10 shadow-2xl relative text-left my-auto"
             >
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <span className="status-badge bg-periwinkle text-white uppercase tracking-widest px-3 py-1 rounded-full text-[8px] font-black">Mode_Editor</span>
                      <h2 className="display-font text-4xl italic font-black tracking-tighter text-slate-950 leading-none mt-2">{editId ? "Edit Cerita." : "Cerita Baru."}</h2>
                   </div>
                   <button onClick={() => setIsEditorOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2 md:col-span-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Judul Cerita</label>
                         <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Contoh: Eksperimen Natural Proses di Sumedang" className="h-14 bg-slate-50 border-none font-bold rounded-2xl text-lg" />
                      </div>
                      
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Kategori</label>
                         <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-xs font-bold text-slate-900 cursor-pointer">
                            <option value="Eksperimen">Eksperimen Lab</option>
                            <option value="Panen">Laporan Panen</option>
                            <option value="Edukasi">Edukasi Kopi</option>
                            <option value="Berita">Berita Roastery</option>
                         </select>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Link URL Foto (Thumbnail)</label>
                         <Input value={formData.featured_image} onChange={e => setFormData({...formData, featured_image: e.target.value})} placeholder="https://contoh.com/foto.jpg" className="h-14 bg-slate-50 border-none font-bold rounded-2xl" />
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Ringkasan (Excerpt)</label>
                      <textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} placeholder="Tuliskan ringkasan singkat cerita untuk ditampilkan di kartu..." className="w-full h-24 bg-slate-50 border-none rounded-3xl p-6 text-xs font-medium leading-relaxed resize-none" />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Isi Cerita Lengkap</label>
                      <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Tuliskan isi cerita yang mendalam..." className="w-full h-64 bg-slate-50 border-none rounded-3xl p-8 text-sm font-medium leading-relaxed resize-none" />
                   </div>

                   <div className="flex gap-4 pt-4 border-t border-slate-50">
                     <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="h-16 bg-slate-50 border-none rounded-[2rem] px-6 text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer">
                        <option value="published">Terbitkan Langsung</option>
                        <option value="draft">Simpan sbg Draft</option>
                     </select>
                     <Button type="submit" className="flex-1 h-16 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] italic text-[10px] shadow-xl hover:bg-periwinkle transition-all">
                        {editId ? "Simpan Perubahan" : "Simpan & Publikasikan"} <Globe size={18} className="ml-2" />
                     </Button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
