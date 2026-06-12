"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Save, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface FAQ {
  id: string;
  question_id: string;
  answer_id: string;
  question_en: string;
  answer_en: string;
  sort_order: number;
}

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<FAQ>>({
    question_id: "",
    answer_id: "",
    question_en: "",
    answer_en: "",
    sort_order: 0,
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/content/faqs");
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      }
    } catch (err) {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (faq: FAQ | null = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData(faq);
    } else {
      setEditingFaq(null);
      setFormData({
        question_id: "",
        answer_id: "",
        question_en: "",
        answer_en: "",
        sort_order: faqs.length,
      });
    }
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingFaq ? `/api/content/faqs/${editingFaq.id}` : "/api/content/faqs";
      const method = editingFaq ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(`FAQ ${editingFaq ? 'updated' : 'created'} successfully`);
        setIsFormOpen(false);
        fetchFaqs();
      } else {
        toast.error("Failed to save FAQ");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/content/faqs/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("FAQ deleted");
        fetchFaqs();
      }
    } catch (err) {
      toast.error("Failed to delete FAQ");
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
            FAQ <br/> Management.
          </h1>
          <p className="text-sm text-slate-500 font-medium max-w-xl">
            Control the knowledge base displayed on the landing page for both local and international customers.
          </p>
        </div>
        
        <Button 
          onClick={() => handleOpenForm()}
          className="bg-slate-900 text-white font-black tracking-[0.2em] px-8 h-14 rounded-2xl hover:bg-fermion-french-blue transition-all duration-500 uppercase italic shadow-xl shadow-slate-900/10"
        >
          <Plus size={18} className="mr-2" /> Add FAQ
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <Loader2 className="animate-spin text-fermion-french-blue" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="h-40 flex items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-200">
             <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No FAQs found</p>
          </div>
        ) : (
          faqs.map((faq, idx) => (
            <motion.div 
              layout
              key={faq.id}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-8 group"
            >
              <div className="text-slate-200 group-hover:text-slate-400 transition-colors">
                 <GripVertical size={24} />
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bahasa Indonesia</p>
                    <p className="font-bold text-slate-900">{faq.question_id}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 italic">{faq.answer_id}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">English</p>
                    <p className="font-bold text-slate-900">{faq.question_en}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 italic">{faq.answer_en}</p>
                 </div>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => handleOpenForm(faq)} className="w-10 h-10 p-0 rounded-xl hover:bg-slate-50"><Edit2 size={16} /></Button>
                <Button variant="ghost" onClick={() => handleDelete(faq.id)} className="w-10 h-10 p-0 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-500"><Trash2 size={16} /></Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl bg-white rounded-[3.5rem] p-10">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">
              {editingFaq ? "Edit FAQ" : "New FAQ Entry"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* ID Version */}
                <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-fermion-french-blue uppercase tracking-[0.3em]">Bahasa Indonesia</h4>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pertanyaan</label>
                      <Input required value={formData.question_id} onChange={(e) => setFormData({...formData, question_id: e.target.value})} className="h-14 bg-slate-50 border-none rounded-2xl font-bold" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jawaban</label>
                      <Textarea required rows={4} value={formData.answer_id} onChange={(e) => setFormData({...formData, answer_id: e.target.value})} className="bg-slate-50 border-none rounded-3xl p-6 font-medium italic" />
                   </div>
                </div>

                {/* EN Version */}
                <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-fermion-lavender uppercase tracking-[0.3em]">English Version</h4>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question</label>
                      <Input required value={formData.question_en} onChange={(e) => setFormData({...formData, question_en: e.target.value})} className="h-14 bg-slate-50 border-none rounded-2xl font-bold" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Answer</label>
                      <Textarea required rows={4} value={formData.answer_en} onChange={(e) => setFormData({...formData, answer_en: e.target.value})} className="bg-slate-50 border-none rounded-3xl p-6 font-medium italic" />
                   </div>
                </div>
             </div>

             <div className="space-y-2 w-32">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort Order</label>
                <Input type="number" value={formData.sort_order} onChange={(e) => setFormData({...formData, sort_order: Number(e.target.value)})} className="h-12 bg-slate-50 border-none rounded-xl font-bold text-center" />
             </div>

             <DialogFooter className="pt-10 border-t border-slate-50">
                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="px-8 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]">Cancel</Button>
                <Button disabled={isSaving} className="bg-slate-900 text-white font-black tracking-[0.2em] px-12 h-14 rounded-2xl hover:bg-fermion-french-blue transition-all duration-500 uppercase italic shadow-2xl">
                   {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> Save FAQ</>}
                </Button>
             </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
