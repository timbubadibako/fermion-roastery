"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FileText, Download, Upload, CheckCircle2, ArrowRight, Loader2, 
  ArrowLeft, Coffee, Zap, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { AuthForm } from "@/components/auth-form";
import { useAuthStore } from "@/lib/store";
import { Sticker } from "@/components/ui/sticker";

export default function B2BRegisterPageV2() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    cafeName: "",
    cafeAddress: "",
    phone: "",
    volumeEstimate: ""
  });

  useEffect(() => {
    setMounted(true);
    if (user) { setStep(2); }
  }, [user]);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setStep(2);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/b2b/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: user.id, ...formData })
      });
      if (res.ok) {
        setUser({ ...user, b2b_status: 'PENDING' });
        toast.success("Partnership details saved.");
        router.push('/account?tab=b2b_registration');
      } else {
        toast.error("Registration failed");
      }
    } catch (error) { toast.error("Network error"); } finally { setLoading(false); }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F4F0E6] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Polish */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.04]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Main Container: Stacked Paper Effect */}
      <div className="relative w-full max-w-5xl">
        
        {/* Main Card */}
        <div className="relative bg-white border border-black/10 shadow-[10px_10px_0px_rgba(0,0,0,0.05)] rotate-[-1deg] p-10 md:p-16 flex flex-col lg:flex-row gap-16 rounded-sm">
           
           {/* Left Panel - Visual Narrative */}
           <div className="lg:w-1/3 space-y-10" id="tour-b2b-header">
              <div className="flex items-center justify-between z-10 relative">
                <h1 className="text-xl font-black italic tracking-tighter text-slate-900">FERMION.</h1>
                <Link href="/wholesale">
                  <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest hover:text-[#367F4D] transition-all">
                    <ArrowLeft size={12} strokeWidth={2.5} /> BACK
                  </button>
                </Link>
              </div>

              <div className="space-y-4">
                 <h2 className="text-5xl font-cloude italic leading-none tracking-tighter text-slate-900">
                    {step === 1 ? "Partner Access." : "Roastery Profile."}
                 </h2>
                 <p className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                    {step === 1 ? "Secure your credentials." : "Define your needs."}
                 </p>
              </div>
           </div>

           {/* Right Panel - Content */}
           <div className="lg:w-2/3" id="tour-b2b-form">
             <AnimatePresence mode="wait">
              
              {/* STEP 1: AUTH */}
              {step === 1 && (
                <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <div className="bg-white border border-black/10 p-8 shadow-sm">
                     <AuthForm onSuccess={handleAuthSuccess} defaultRole="B2B" initialMode="login" />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: B2B Form */}
              {step === 2 && (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <form onSubmit={handleRegisterSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Cafe / Company Name</label>
                          <Input required value={formData.cafeName} onChange={e => setFormData({...formData, cafeName: e.target.value})} placeholder="e.g. Lab Kopi" className="h-12 rounded-sm bg-stone-50 border border-black/5 font-bold" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">WhatsApp Number</label>
                          <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="08..." className="h-12 rounded-sm bg-stone-50 border border-black/5 font-bold" />
                       </div>
                       <div className="md:col-span-2 space-y-1">
                          <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Full Address</label>
                          <Input required value={formData.cafeAddress} onChange={e => setFormData({...formData, cafeAddress: e.target.value})} placeholder="Street, City..." className="h-12 rounded-sm bg-stone-50 border border-black/5 font-bold" />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       {[
                         { val: "10-20KG", icon: Coffee, title: "Artisan" },
                         { val: "20-50KG", icon: Zap, title: "Growth" },
                         { val: "50KG+", icon: Star, title: "Scale" }
                       ].map((option) => (
                         <div 
                           key={option.val}
                           onClick={() => setFormData({...formData, volumeEstimate: option.val})}
                           className={`p-4 rounded-sm border transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                             formData.volumeEstimate === option.val 
                               ? "bg-slate-900 text-white border-slate-900" 
                               : "bg-white border-black/10 hover:border-[#367F4D]"
                           }`}
                         >
                            <option.icon size={16} />
                            <h4 className="text-[9px] font-black uppercase tracking-widest">{option.title}</h4>
                            <p className="text-[8px] font-bold opacity-60">{option.val}</p>
                         </div>
                       ))}
                    </div>

                    <Button disabled={loading} type="submit" className="w-full h-14 bg-stone-900 text-white rounded-sm font-black uppercase tracking-widest italic hover:bg-[#367F4D] transition-all">
                       {loading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Prepare Partnership <ArrowRight size={14} /></span>}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
           </div>

           {/* Tape Accent */}
           <div className="absolute -top-4 -right-4 w-20 h-6 bg-white/60 border border-black/5 rotate-[15deg] backdrop-blur-sm z-20 shadow-sm"></div>
        </div>
      </div>
    </div>
  );
}
