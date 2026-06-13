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
  AlertCircle
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
  const [step, setStep] = useState(1); // 1: Auth, 2: Registration Form, 3: Contract Onboarding
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

  useEffect(() => {
    setMounted(true);
  }, []);

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
    // Simulation for prototype
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
                {step < 3 ? "Professional \n Wholesale." : "Self-Service \n Onboarding."}
              </h2>
              <p className="text-slate-400 text-xs font-medium max-w-xs leading-relaxed">
                Scale your coffee business with scientific precision and artisan support.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:w-[60%] p-6 md:p-12 flex flex-col justify-center bg-white/60 relative">
          <div className="max-w-md mx-auto w-full relative z-10">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: AUTH */}
              {step === 1 && (
                <motion.div key="auth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Partner Access.</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Secure your business credentials</p>
                  </div>
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                     <AuthForm onSuccess={handleAuthSuccess} defaultRole="B2B" initialMode="login" />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: FORM */}
              {step === 2 && (
                <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Cafe Details.</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Enter business entity information</p>
                  </div>
                  <form onSubmit={handleRegisterSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Cafe / Company Name</label>
                          <Input required value={formData.cafeName} onChange={e => setFormData({...formData, cafeName: e.target.value})} placeholder="e.g. Lab Kopi Senayan" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                          <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="0812..." className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Address</label>
                          <Input required value={formData.cafeAddress} onChange={e => setFormData({...formData, cafeAddress: e.target.value})} placeholder="Street, City, Province" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Volume Est.</label>
                          <select required value={formData.volumeEstimate} onChange={e => setFormData({...formData, volumeEstimate: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-xs font-bold text-slate-900">
                             <option value="">Select Estimate</option>
                             <option value="10-20KG">10-20 KG</option>
                             <option value="20-50KG">20-50 KG</option>
                             <option value="50KG+">50 KG+</option>
                          </select>
                       </div>
                    </div>
                    <Button disabled={loading} type="submit" className="w-full h-14 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest italic shadow-xl shadow-slate-900/10">
                       {loading ? <Loader2 className="animate-spin" /> : "Save & Continue"}
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* STEP 3: CONTRACT ONBOARDING */}
              {step === 3 && (
                <motion.div key="onboarding" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
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
                        {/* AWAITING REVIEW STATE */}
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
