"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  FileText, 
  Download, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Clock,
  ArrowLeft,
  Mountain,
  Coffee,
  Zap,
  Star
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

  const [onboardingStatus, setOnboardingStatus] = useState<string | null>(null);

  // Logic 1: Skip Auth if logged in
  useEffect(() => {
    setMounted(true);
    if (user) {
      setStep(2);
    }
  }, [user]);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setStep(2);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.volumeEstimate) {
      toast.error("Please select your monthly volume goal.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/b2b/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: user.id,
          ...formData
        })
      });

      if (res.ok) {
        toast.success("Application data saved.");
        setOnboardingStatus('onboarding');
        setStep(3);
      } else {
        const data = await res.json();
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadContract = () => {
    if (!user) return;
    window.open(`/api/b2b/contract?profileId=${user.id}`, '_blank');
  };

  const handleUploadContract = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file");
      return;
    }

    setUploading(true);
    setTimeout(async () => {
      try {
        const res = await fetch('/api/b2b/upload-contract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId: user?.id })
        });
        if (res.ok) {
          setOnboardingStatus('awaiting_contract_review');
          toast.success("Contract uploaded successfully");
        }
      } catch (e) {
        toast.error("Upload failed");
      } finally {
        setUploading(false);
      }
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center p-4 md:p-10 relative overflow-hidden font-sans">
      
      {/* Background Polish */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Client%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      <div className="w-full max-w-6xl bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 overflow-hidden flex flex-col lg:flex-row shadow-2xl shadow-slate-900/10 relative z-10">
        
        {/* Left Panel */}
        <div className="lg:w-[40%] p-4 md:p-6 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 z-10 relative">
            <h1 className="text-xl font-black italic tracking-tighter text-slate-900">FERMION.</h1>
            <Link href="/wholesale">
              <button className="flex items-center gap-2 bg-white/50 backdrop-blur-md hover:bg-white text-slate-600 hover:text-slate-900 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all border border-white/60 shadow-sm">
                <ArrowLeft size={12} strokeWidth={2.5} /> Cancel
              </button>
            </Link>
          </div>

          <div className="flex-1 relative rounded-[2rem] overflow-hidden min-h-[300px] border border-slate-100/50 group">
            <Image
              src="https://placehold.co/800x1200/101828/ffffff?text=B2B+Partner+Hub"
              alt="Fermion B2B"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8 text-left z-10 space-y-4">
              <Sticker rotate={-10} variant="solid" color="var(--color-fermion-french-blue)">
                 <span className="p-2 text-white text-[10px]">ECOSYSTEM</span>
              </Sticker>
              <h2 className="text-white text-4xl font-black italic leading-none tracking-tighter">
                {step === 1 ? "Partner \n Access." : step === 2 ? "The Coffee \n Story." : "Secure \n Contract."}
              </h2>
              <p className="text-slate-400 text-xs font-medium max-w-xs leading-relaxed">
                {step === 1 ? "Secure your business credentials to enter our professional hub." : 
                 step === 2 ? "Tell us about your business goals and specific laboratory needs." :
                 "Finalize your official partnership agreement with Fermion Roastery."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:w-[60%] p-6 md:p-12 flex flex-col justify-center bg-white/60 relative">
          <div className="max-w-2xl mx-auto w-full relative z-10">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: AUTH (Only if not logged in) */}
              {step === 1 && (
                <motion.div key="auth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 max-w-md mx-auto">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Authentication.</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Secure your business credentials</p>
                  </div>
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                     <AuthForm onSuccess={handleAuthSuccess} defaultRole="B2B" initialMode="login" />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: BUSINESS FORM + STORYTELLING VOLUME */}
              {step === 2 && (
                <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Business Profile.</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Crafting your partnership identity</p>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-12">
                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Cafe / Company Name</label>
                          <Input required value={formData.cafeName} onChange={e => setFormData({...formData, cafeName: e.target.value})} placeholder="e.g. Lab Kopi Senayan" className="h-14 rounded-2xl bg-white border-none font-bold shadow-sm" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                          <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="0812..." className="h-14 rounded-2xl bg-white border-none font-bold shadow-sm" />
                       </div>
                       <div className="md:col-span-2 space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Address</label>
                          <Input required value={formData.cafeAddress} onChange={e => setFormData({...formData, cafeAddress: e.target.value})} placeholder="Street, City, Province" className="h-14 rounded-2xl bg-white border-none font-bold shadow-sm" />
                       </div>
                    </div>

                    {/* Story-driven Volume Selection */}
                    <div className="space-y-6">
                       <div className="text-left space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Beans Goal</label>
                          <p className="text-xs text-slate-500 font-medium italic">What level of throughput are you aiming for?</p>
                       </div>

                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          {[
                            { val: "10-20KG", icon: Coffee, title: "Artisan Startup", desc: "For new cafes or niche micro-lots." },
                            { val: "20-50KG", icon: Zap, title: "Growth Hub", desc: "For high-traffic, established shops." },
                            { val: "50KG+", icon: Star, title: "Scale Master", desc: "Wholesale distribution and big networks." }
                          ].map((option) => (
                            <div 
                              key={option.val}
                              onClick={() => setFormData({...formData, volumeEstimate: option.val})}
                              className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group flex flex-col items-center text-center space-y-4 ${
                                formData.volumeEstimate === option.val 
                                  ? "bg-slate-900 border-slate-900 text-white shadow-2xl scale-105" 
                                  : "bg-white border-slate-100 hover:border-slate-200 text-slate-600"
                              }`}
                            >
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                                 formData.volumeEstimate === option.val ? "bg-white/10 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                               }`}>
                                  <option.icon size={20} />
                               </div>
                               <div className="space-y-1">
                                  <h4 className="text-xs font-black uppercase tracking-widest">{option.title}</h4>
                                  <p className={`text-[10px] font-bold ${formData.volumeEstimate === option.val ? "text-slate-400" : "text-slate-300"}`}>{option.val}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <Button disabled={loading} type="submit" className="w-full h-16 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-widest italic shadow-2xl hover:bg-fermion-french-blue transition-all">
                       {loading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-3">Prepare Partnership <ArrowRight size={18} /></span>}
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* STEP 3: CONTRACT ONBOARDING */}
              {step === 3 && (
                <motion.div key="onboarding" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 max-w-md mx-auto">
                  <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl text-center space-y-10 relative overflow-hidden">
                    
                    {onboardingStatus === 'onboarding' ? (
                      <>
                        <div className="space-y-4">
                           <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Action <br/> Required.</h2>
                           <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">Please download, sign, and upload your partnership contract to activate wholesale pricing.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                           <Button onClick={handleDownloadContract} className="h-16 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-sm">
                              <Download className="mr-2" size={16} /> 1. Download Contract
                           </Button>
                           
                           <div className="relative">
                              <input 
                                type="file" 
                                accept=".pdf" 
                                onChange={handleUploadContract} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                disabled={uploading}
                              />
                              <Button disabled={uploading} className="w-full h-16 bg-slate-900 hover:bg-fermion-french-blue text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl">
                                 {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Upload className="mr-2" size={16} /> 2. Upload Signed PDF</>}
                              </Button>
                           </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="py-8 relative">
                           <motion.div 
                             animate={{ y: [0, -10, 0] }} 
                             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                             className="w-24 h-24 bg-fermion-french-blue/5 rounded-full flex items-center justify-center mx-auto text-fermion-french-blue mb-6 border border-fermion-french-blue/10"
                           >
                              <Mountain size={48} strokeWidth={1.5} />
                           </motion.div>
                           <Sticker rotate={-8} color="var(--cartoon-yellow)" className="top-0 right-1/4">REVIEWING</Sticker>
                        </div>
                        
                        <div className="space-y-4">
                           <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Verifying <br/> Contract.</h2>
                           <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                              "Si Gunung" is currently reviewing your documents. You'll receive a WhatsApp notification once approved.
                           </p>
                        </div>

                        <div className="pt-10 border-t border-slate-50 flex items-center justify-center gap-2 text-slate-400">
                           <Clock size={14} />
                           <span className="text-[9px] font-black uppercase tracking-widest">Est. Time: 2-4 Hours</span>
                        </div>
                      </>
                    )}

                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-slate-50 rounded-full blur-3xl opacity-50" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
