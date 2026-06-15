"use client";

import React, { useState } from "react";
import { Upload, Camera, Loader2, Save, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function B2BProfileSetup({ onComplete, profileId }: { onComplete: () => void, profileId: string }) {
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [billingInfo, setBillingInfo] = useState({ npwp: "", billingAddress: "" });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate upload and get preview URL
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/admin/partners/' + profileId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cafe_logo_url: logo,
          npwp: billingInfo.npwp,
          billing_address: billingInfo.billingAddress
        })
      });

      if (res.ok) {
        toast.success("Profile completed successfully!");
        onComplete();
      }
    } catch (e) {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl"
      >
        <div className="p-12 space-y-10">
           <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-fermion-french-blue/10 rounded-2xl flex items-center justify-center mx-auto text-fermion-french-blue mb-4">
                 <Building2 size={32} />
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Identity <br/> Verification.</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Complete your profile to unlock full dashboard access</p>
           </div>

           <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {/* Logo Upload */}
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cafe Logo (For Showcase & Invoices)</label>
                    <div className="relative group">
                       <div className="aspect-square bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-colors group-hover:bg-slate-100 group-hover:border-fermion-french-blue/30">
                          {logo ? (
                            <img src={logo} alt="Logo" className="w-full h-full object-contain p-4" />
                          ) : (
                            <div className="text-center space-y-2">
                               <Camera className="mx-auto text-slate-300" size={32} />
                               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">PNG / SVG</span>
                            </div>
                          )}
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                       </div>
                       {logo && (
                         <button onClick={() => setLogo(null)} className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-lg text-red-500 hover:scale-110 transition-transform">
                            <X size={14} />
                         </button>
                       )}
                    </div>
                 </div>

                 {/* Billing Info */}
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tax ID (NPWP)</label>
                       <Input 
                        value={billingInfo.npwp} 
                        onChange={e => setBillingInfo({...billingInfo, npwp: e.target.value})}
                        placeholder="00.000.000.0-000.000" 
                        className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Billing Address</label>
                       <Input 
                        value={billingInfo.billingAddress} 
                        onChange={e => setBillingInfo({...billingInfo, billingAddress: e.target.value})}
                        placeholder="Same as cafe address..." 
                        className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                       />
                    </div>
                 </div>
              </div>

              <Button 
                disabled={!logo || loading} 
                className="w-full h-16 bg-slate-900 hover:bg-fermion-french-blue text-white rounded-3xl font-black uppercase tracking-widest italic shadow-xl shadow-slate-900/20"
              >
                 {loading ? <Loader2 className="animate-spin" /> : <><Save className="mr-2" size={18} /> Save & Unlock Dashboard</>}
              </Button>
           </form>
        </div>
      </motion.div>
    </div>
  );
}
