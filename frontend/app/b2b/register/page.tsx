"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Coffee, 
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { AuthForm } from "@/components/auth-form";
import { useAuthStore } from "@/lib/store";

export default function B2BRegisterPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [step, setStep] = useState(user ? 2 : 1); // 1: Account, 2: Cafe Details, 3: Volume, 4: Success
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    cafeName: "",
    cafeAddress: "",
  });

  const [volume, setVolume] = useState("");

  // Step 1: Account Logic (Handled by AuthForm)
  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setStep(2);
  };

  const handleNextStep = () => {
    setStep(3);
  };

  // Step 3: Submission
  const handleSubmitApplication = async () => {
    if (!user) {
      toast.error("User profile not found. Please log in again.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/apply-b2b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: user.id,
          cafeName: formData.cafeName,
          cafeAddress: formData.cafeAddress,
          volume: volume
        }),
      });

      const data = await response.json();

      if (response.ok) { 
        setStep(4);
        toast.success("Application Submitted Successfully!");
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
      <div className="max-w-xl w-full">
        
        <AnimatePresence mode="wait">
          {/* STEP 1: ACCOUNT CREATION / LOGIN */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-fermion-blue/10 rounded-2xl flex items-center justify-center mx-auto text-fermion-blue mb-4">
                  <Coffee size={32} />
                </div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Start Partnership</h2>
                <p className="text-sm text-slate-400 font-medium">Log in or register your Fermion account to begin.</p>
              </div>

              <AuthForm onSuccess={handleAuthSuccess} defaultRole="B2B" />
            </motion.div>
          )}

          {/* STEP 2: CAFE DETAILS */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl space-y-8"
            >
              <div className="text-left space-y-2">
                <button onClick={() => setStep(1)} className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]">← Back to account</button>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Cafe Details</h2>
                <p className="text-sm text-slate-400 font-medium">Please enter your business information below.</p>
                {user && <p className="text-xs text-fermion-blue mt-2">Logged in as {user.email}</p>}
              </div>

              <div className="space-y-6">
                {/* Search Section - DISABLED / COMING SOON */}
                <div className="relative group opacity-50 cursor-not-allowed">
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-2xl">
                    <span className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-lg">
                      Discovery Coming Soon
                    </span>
                  </div>
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    disabled
                    placeholder="Search Cafe Name..." 
                    className="h-16 pl-14 bg-slate-50 border-none rounded-2xl text-sm font-bold uppercase tracking-widest"
                  />
                  <Button 
                    disabled
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-400 h-12 px-6 rounded-xl text-[10px] font-black tracking-widest uppercase"
                  >
                    SEARCH
                  </Button>
                </div>

                <div className="space-y-6 pt-4">
                  <div className="h-px bg-slate-100 w-full relative">
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      Manual Entry
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cafe / Business Name</label>
                      <Input 
                        placeholder="Enter your cafe name"
                        className="h-16 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-900 focus-visible:ring-2 focus-visible:ring-fermion-blue"
                        value={formData.cafeName}
                        onChange={(e) => setFormData({...formData, cafeName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Address</label>
                      <Input 
                        placeholder="Street, City, Province"
                        className="h-16 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-900 focus-visible:ring-2 focus-visible:ring-fermion-blue"
                        value={formData.cafeAddress}
                        onChange={(e) => setFormData({...formData, cafeAddress: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  disabled={!formData.cafeName || !formData.cafeAddress}
                  onClick={handleNextStep}
                  className="w-full h-16 bg-slate-900 text-white font-black tracking-[0.2em] rounded-2xl hover:bg-fermion-blue transition-all duration-500 uppercase italic"
                >
                  Next Step <ArrowRight className="ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: VOLUME ESTIMATION */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl space-y-8"
            >
              <div className="text-left space-y-2">
                <button onClick={() => setStep(2)} className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]">← Back to search</button>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Estimated Volume</h2>
                <p className="text-sm text-slate-400 font-medium italic">"{formData.cafeName}"</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Berapa KG kopi per bulan?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["5-10KG", "10-50KG", "50KG+"].map(v => (
                      <button 
                        key={v} 
                        onClick={() => setVolume(v)}
                        className={`h-16 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 ${volume === v ? "border-fermion-blue bg-fermion-blue/5 text-fermion-blue" : "border-transparent bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
                    Dengan mendaftar, Anda menyetujui kebijakan kemitraan Fermion Roastery.
                  </p>
                </div>

                <Button 
                  disabled={!volume || loading}
                  onClick={handleSubmitApplication}
                  className="w-full h-16 bg-slate-900 text-white font-black tracking-[0.2em] rounded-2xl hover:bg-fermion-blue transition-all duration-500 uppercase italic"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Submit Application"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS / PENDING STATE */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl space-y-10 text-center"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                <CheckCircle2 size={40} />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Application <br/> Received!</h2>
                <div className="flex items-center justify-center gap-2 text-fermion-blue bg-fermion-blue/5 py-2 px-4 rounded-full w-fit mx-auto">
                  <Clock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verification: ~1 Hour</span>
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                  Terima kasih telah mendaftar, tim kami sedang memproses verifikasi cafe Anda.
                </p>
              </div>

              <div className="pt-4 space-y-4">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sambil menunggu, Anda tetap bisa belanja</p>
                <Link href="/our-coffee">
                  <Button className="w-full h-16 bg-slate-900 text-white font-black tracking-[0.2em] rounded-2xl hover:bg-fermion-blue transition-all duration-500 uppercase italic">
                    Go to Retail Shop <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
