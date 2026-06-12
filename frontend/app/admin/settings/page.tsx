"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Image as ImageIcon, Layout, Type, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    hero_title: "",
    hero_subtitle: "",
    hero_description: "",
    instagram_url: "",
    whatsapp_number: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        // Merge with defaults if empty
        setContent(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (err) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      
      if (res.ok) {
        toast.success("Landing page content updated!");
      } else {
        toast.error("Failed to save changes");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-fermion-french-blue" />
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="space-y-2">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
          Site <br/> Configuration.
        </h1>
        <p className="text-sm text-slate-500 font-medium max-w-sm">
          Manage the public facing content and global roastery settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          
          {/* Hero Section Editor */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8"
          >
            <div className="flex items-center gap-3">
               <Layout size={18} className="text-fermion-french-blue" />
               <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Hero Section</h4>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Badge Title</label>
                <Input 
                  value={content.hero_subtitle}
                  onChange={e => setContent({...content, hero_subtitle: e.target.value})}
                  className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Main Headline</label>
                <Input 
                  value={content.hero_title}
                  onChange={e => setContent({...content, hero_title: e.target.value})}
                  className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description Paragraph</label>
                <Textarea 
                  value={content.hero_description}
                  onChange={e => setContent({...content, hero_description: e.target.value})}
                  className="rounded-2xl bg-slate-50 border-none font-bold text-sm min-h-[100px]"
                />
              </div>
            </div>
          </motion.div>

          {/* Social & Contact */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8"
          >
            <div className="flex items-center gap-3">
               <MessageSquare size={18} className="text-fermion-lilac" />
               <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Social & Contact</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Instagram URL</label>
                <Input 
                  value={content.instagram_url}
                  onChange={e => setContent({...content, instagram_url: e.target.value})}
                  className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">WhatsApp Number</label>
                <Input 
                  value={content.whatsapp_number}
                  onChange={e => setContent({...content, whatsapp_number: e.target.value})}
                  className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm"
                />
              </div>
            </div>
          </motion.div>

          <div className="flex justify-end pt-4">
             <Button 
              onClick={handleSave}
              disabled={saving}
              className="bg-slate-900 text-white px-12 h-16 rounded-2xl font-black uppercase tracking-widest italic flex items-center gap-3 shadow-xl hover:scale-105 transition-transform"
             >
               {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
               Save Changes
             </Button>
          </div>

        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 space-y-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Quick Actions</h4>
              <div className="space-y-3">
                 <Button variant="outline" className="w-full h-12 rounded-xl justify-start gap-3 border-slate-200 text-[10px] font-black uppercase tracking-widest">
                    <ImageIcon size={14} /> Clear Image Cache
                 </Button>
                 <Button variant="outline" className="w-full h-12 rounded-xl justify-start gap-3 border-slate-200 text-[10px] font-black uppercase tracking-widest">
                    <Type size={14} /> Rebuild SEO Sitemap
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
