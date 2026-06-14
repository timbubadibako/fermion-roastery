"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SiteSettingsPage() {
  const [content, setContent] = useState<any>({
    hero_title: "",
    hero_subtitle: "",
    hero_description: "",
    contact_email: "",
    contact_phone: ""
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        const settingsMap = data.reduce((acc: any, curr: any) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {});
        setContent((prev: any) => ({ ...prev, ...settingsMap }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content)
      });
      if (res.ok) {
        toast.success("Global site settings updated");
      }
    } catch (e) {
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Global Configuration...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="space-y-2 text-left">
        <h1 className="display-font text-6xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">Global <br/> Settings.</h1>
        <p className="text-sm font-medium text-slate-500">Configure global website parameters and localization text.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 rounded-[3.5rem] p-12 shadow-sm relative overflow-hidden"
      >
        <form onSubmit={handleSave} className="space-y-10 relative z-10">
          
          <div className="space-y-6">
             <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <Settings size={18} className="text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Hero Section Content</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Main Heading (H1)</label>
                   <Input 
                     value={content.hero_title || ""} 
                     onChange={e => setContent({...content, hero_title: e.target.value})}
                     placeholder="Scientific Coffee Roastery"
                     className="h-14 bg-slate-50 border-none font-bold rounded-2xl"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sub Heading Banner</label>
                   <Input 
                     value={content.hero_subtitle || ""} 
                     onChange={e => setContent({...content, hero_subtitle: e.target.value})}
                     placeholder="Artisan Precision"
                     className="h-14 bg-slate-50 border-none font-bold rounded-2xl"
                   />
                </div>
                <div className="space-y-2 md:col-span-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Paragraph Description</label>
                   <Textarea 
                     value={content.hero_description || ""} 
                     onChange={e => setContent({...content, hero_description: e.target.value})}
                     placeholder="Precision roasted coffee..."
                     className="min-h-[100px] bg-slate-50 border-none font-bold rounded-2xl resize-none p-4"
                   />
                </div>
             </div>
          </div>

          <div className="space-y-6 pt-6">
             <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <Settings size={18} className="text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Contact Information</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Official Email</label>
                   <Input 
                     type="email"
                     value={content.contact_email || ""} 
                     onChange={e => setContent({...content, contact_email: e.target.value})}
                     placeholder="hello@fermion.com"
                     className="h-14 bg-slate-50 border-none font-bold rounded-2xl"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Support Phone/WA</label>
                   <Input 
                     value={content.contact_phone || ""} 
                     onChange={e => setContent({...content, contact_phone: e.target.value})}
                     placeholder="+62 812..."
                     className="h-14 bg-slate-50 border-none font-bold rounded-2xl"
                   />
                </div>
             </div>
          </div>

          <div className="pt-8 border-t border-slate-50">
             <Button type="submit" disabled={isSaving} className="w-full md:w-auto h-16 px-12 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-[0.2em] italic shadow-xl hover:bg-fermion-french-blue transition-all">
                {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> Deploy Global Settings</>}
             </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
