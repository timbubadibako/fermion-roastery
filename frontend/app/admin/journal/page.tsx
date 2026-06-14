"use client";

import React, { useState, useEffect } from "react";
import { Edit3, Plus, Search, Eye, Trash2, Calendar, FileText, CheckCircle2, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function JournalCMS() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Experiment",
    status: "published",
    content: ""
  });

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/journal", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Story published to the field.");
        setIsEditorOpen(false);
        fetchPosts();
      }
    } catch (e) {
      toast.error("Failed to publish story.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;
    try {
      const res = await fetch(`/api/journal/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Story removed from journal.");
        fetchPosts();
      }
    } catch (e) {
      toast.error("Delete failed.");
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Opening Journal Archives...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-left">
          <h1 className="display-font text-6xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">Roastery <br/> Journal.</h1>
          <p className="text-sm font-medium text-slate-500">Document the scientific and artisanal journey of every bean.</p>
        </div>
        <Button onClick={() => setIsEditorOpen(true)} className="bg-slate-950 text-white rounded-2xl h-16 px-10 gap-3 font-black uppercase tracking-widest italic shadow-2xl hover:bg-periwinkle transition-all">
           <Plus size={20} /> Write New Story
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        {posts.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs italic">No entries in the lab journal.</div>
        ) : (
          posts.map((post, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={post.id} 
              className="bg-white p-10 rounded-[3rem] border border-slate-100 space-y-6 shadow-sm group hover:shadow-2xl transition-all"
            >
               <div className="flex justify-between items-start">
                  <span className="status-badge bg-slate-50 text-slate-500 uppercase">{post.category}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => handleDelete(post.id)} className="p-2 bg-red-50 text-red-500 rounded-lg"><Trash2 size={14} /></button>
                  </div>
               </div>
               <div className="space-y-2">
                  <h3 className="display-font text-2xl italic font-black text-slate-900 leading-tight">{post.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={12} /> {new Date(post.created_at).toLocaleDateString()}</p>
               </div>
               <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{post.content}</p>
               <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${post.status === 'published' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                     <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{post.status}</span>
                  </div>
                  <Button variant="ghost" className="h-8 px-4 text-[9px] font-black uppercase tracking-widest text-periwinkle hover:bg-periwinkle/10">Preview <Eye size={12} className="ml-1" /></Button>
               </div>
            </motion.div>
          ))
        )}
      </div>

      {/* JOURNAL EDITOR MODAL */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
             <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3.5rem] w-full max-w-4xl p-12 space-y-10 shadow-2xl relative overflow-hidden text-left"
             >
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <span className="status-badge bg-periwinkle text-white uppercase tracking-widest px-3 py-1 rounded-full text-[8px] font-black">Archive_Protocol</span>
                      <h2 className="display-font text-4xl italic font-black tracking-tighter text-slate-950 leading-none mt-2">New Story.</h2>
                   </div>
                   <button onClick={() => setIsEditorOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Story Title</label>
                         <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. The Science of Anaerob Natural" className="h-14 bg-slate-50 border-none font-bold rounded-2xl" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Category</label>
                         <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-xs font-bold text-slate-900">
                            <option value="Experiment">Lab Experiment</option>
                            <option value="Harvest">Harvest Report</option>
                            <option value="Roast">Roast Profile</option>
                            <option value="Origin">Origin Story</option>
                         </select>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Laboratory Narrative (Content)</label>
                      <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Document the findings..." className="w-full h-48 bg-slate-50 border-none rounded-3xl p-8 text-sm font-medium leading-relaxed resize-none" />
                   </div>

                   <Button type="submit" className="w-full h-16 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] italic text-[10px] shadow-xl hover:bg-periwinkle transition-all">
                      Broadcast Story to Laboratory <Globe size={18} className="ml-2" />
                   </Button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { X } from "lucide-react";
