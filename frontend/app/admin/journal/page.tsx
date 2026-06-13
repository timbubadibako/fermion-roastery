"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Edit2, Trash2, Loader2, Save, X, Eye, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/store";

interface JournalPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  status: string;
  created_at: string;
}

export default function AdminJournalPage() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<JournalPost>>({
    title: "",
    content: "",
    excerpt: "",
    featured_image: "",
    status: "draft"
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/journal");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      toast.error("Failed to load journal");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = currentPost.id ? "PUT" : "POST";
      const url = currentPost.id ? `/api/journal/${currentPost.id}` : "/api/journal";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentPost, author_id: user?.id }),
      });

      if (res.ok) {
        toast.success(currentPost.id ? "Post updated" : "Post created");
        setIsEditing(false);
        fetchPosts();
      }
    } catch (e) {
      toast.error("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this story?")) return;
    try {
      const res = await fetch(`/api/journal/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Post removed");
        fetchPosts();
      }
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-fermion-french-blue" /></div>;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">Roastery <br/> Journal.</h1>
          <p className="text-sm font-medium text-slate-500">Document the scientific and artisanal journey of every bean.</p>
        </div>
        {!isEditing && (
          <Button onClick={() => {
            setCurrentPost({ title: "", content: "", excerpt: "", featured_image: "", status: "draft" });
            setIsEditing(true);
          }} className="bg-slate-900 text-white rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px]">
            <Plus size={16} className="mr-2" /> Write New Story
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-slate-100 rounded-[3.5rem] p-12 shadow-xl"
          >
            <form onSubmit={handleSave} className="space-y-10">
               <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Story Editor</h4>
                  <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-full"><X size={20} /></Button>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Title</label>
                        <Input 
                          value={currentPost.title} 
                          onChange={e => setCurrentPost({...currentPost, title: e.target.value})}
                          placeholder="The Garut Papandayan Harvest..."
                          className="h-14 rounded-2xl font-bold"
                          required
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Excerpt (Short Summary)</label>
                        <Textarea 
                          value={currentPost.excerpt} 
                          onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})}
                          placeholder="Briefly describe what this story is about..."
                          className="rounded-2xl min-h-[100px]"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Featured Image URL</label>
                        <Input 
                          value={currentPost.featured_image} 
                          onChange={e => setCurrentPost({...currentPost, featured_image: e.target.value})}
                          placeholder="https://images.unsplash.com/..."
                          className="h-14 rounded-2xl"
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Content (Markdown)</label>
                     <Textarea 
                       value={currentPost.content} 
                       onChange={e => setCurrentPost({...currentPost, content: e.target.value})}
                       placeholder="# The Science Behind the Roast..."
                       className="rounded-2xl min-h-[400px] font-mono text-sm p-6"
                       required
                     />
                  </div>
               </div>

               <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <label className="text-[10px] font-black uppercase text-slate-400">Status:</label>
                     <select 
                       value={currentPost.status} 
                       onChange={e => setCurrentPost({...currentPost, status: e.target.value})}
                       className="bg-slate-50 border-none text-xs font-black uppercase tracking-widest rounded-xl px-4 py-2"
                     >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                     </select>
                  </div>
                  <Button type="submit" disabled={isSaving} className="bg-fermion-french-blue text-white rounded-2xl h-14 px-12 font-black uppercase tracking-widest italic shadow-xl shadow-fermion-french-blue/20">
                     {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> Save Story</>}
                  </Button>
               </div>
            </form>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length === 0 ? (
              <div className="col-span-full py-32 text-center bg-white border border-slate-100 rounded-[3.5rem] space-y-4">
                 <BookOpen className="mx-auto text-slate-100" size={64} />
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No stories documented yet.</p>
              </div>
            ) : (
              posts.map(post => (
                <motion.div 
                  key={post.id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden group hover:shadow-xl transition-all flex flex-col shadow-sm"
                >
                  {post.featured_image && (
                    <div className="h-48 bg-slate-100 overflow-hidden">
                       <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                     <div className="space-y-3">
                        <div className="flex items-center justify-between">
                           <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${post.status === 'published' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                              {post.status}
                           </span>
                           <span className="text-[9px] font-bold text-slate-300">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 group-hover:text-fermion-french-blue transition-colors line-clamp-2">{post.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 font-medium">"{post.excerpt}"</p>
                     </div>
                     <div className="pt-4 border-t border-slate-50 flex items-center justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => { setCurrentPost(post); setIsEditing(true); }} className="rounded-xl hover:bg-slate-50"><Edit2 size={16} /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(post.id)} className="rounded-xl hover:bg-red-50 text-red-400"><Trash2 size={16} /></Button>
                     </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
