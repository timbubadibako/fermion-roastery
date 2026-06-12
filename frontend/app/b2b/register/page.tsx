"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Coffee, 
  Clock,
  ArrowLeft
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
  const [step, setStep] = useState(user ? 2 : 1); // 1: Account, 2: Cafe Details, 3: Volume, 4: Success
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    cafeName: "",
    cafeAddress: "",
  });

  const [volume, setVolume] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

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
      const response = await fetch('/api/auth/apply-b2b', {
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
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center p-4 md:p-10 relative overflow-hidden font-sans">
      
      {/* Background Polish */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Client%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-fermion-wisteria/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-fermion-horizon/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div 
        className={`w-full max-w-6xl bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 overflow-hidden flex flex-col lg:flex-row shadow-2xl shadow-slate-900/10 transition-all duration-1000 ease-out relative z-10 ${
          mounted ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-10"
        }`}
      >
        
        {/* Left Panel - Visual Narrative */}
        <div className="lg:w-[45%] p-4 md:p-6 flex flex-col relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6 z-10 relative">
            <h1 className="text-xl font-black italic tracking-tighter text-slate-900">FERMION.</h1>
            <Link href="/wholesale">
              <button className="flex items-center gap-2 bg-white/50 backdrop-blur-md hover:bg-white text-slate-600 hover:text-slate-900 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all border border-white/60 shadow-sm hover:shadow-md">
                <ArrowLeft size={12} strokeWidth={2.5} /> Cancel
              </button>
            </Link>
          </div>

          {/* Image Container with Inner Glass */}
          <div className="flex-1 relative rounded-[2rem] overflow-hidden min-h-[300px] lg:min-h-[650px] border border-slate-100/50 shadow-inner group">
            <Image
              src="https://placehold.co/800x1200/0f172a/334155?text=Roastery+Partner"
              alt="Fermion B2B Partnership"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
            
            <Sticker rotate={-10} className="top-8 right-8" variant="solid" color="var(--cartoon-yellow)">
               <span className="p-2 text-slate-900">B2B ONLY</span>
            </Sticker>

            {/* Text Overlay */}
            <div className="absolute bottom-8 left-8 right-8 text-left z-10 space-y-2">
              <div className="inline-block px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[8px] font-black text-white uppercase tracking-widest mb-2">
                 Wholesale Application
              </div>
              <h2 className="text-white text-4xl font-display font-black italic leading-none tracking-tighter shadow-sm">
                Scale your <br /> coffee business.
              </h2>
            </div>
          </div>
        </div>

        {/* Right Panel - Dynamic Steps */}
        <div className="lg:w-[55%] p-6 md:p-12 flex flex-col justify-center bg-white/60 relative">
          <div className="max-w-md mx-auto w-full relative z-10">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: ACCOUNT CREATION / LOGIN */}
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Start Partnership</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Create an account or login to begin.</p>
                  </div>

                  <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 relative">
                     <Sticker rotate={12} className="-top-4 -right-4" color="var(--cartoon-pink)">
                        SECURE
                     </Sticker>
                     <AuthForm onSuccess={handleAuthSuccess} defaultRole="B2B" />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: CAFE DETAILS */}
              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-left space-y-2">
                    <button onClick={() => setStep(1)} className="text-[9px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.3em] mb-2 flex items-center gap-1">
                      <ArrowLeft size={10} /> Back
                    </button>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Cafe Details.</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Step 1 of 2</p>
                  </div>

                  <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 space-y-8">
                    {user && <p className="text-[10px] font-black uppercase tracking-widest text-fermion-french-blue">Logged in as {user.email}</p>}
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                        <Input 
                          placeholder="e.g. The Daily Grind"
                          className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-xs font-bold text-slate-900 focus-visible:ring-2 focus-visible:ring-fermion-french-blue"
                          value={formData.cafeName}
                          onChange={(e) => setFormData({...formData, cafeName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Address</label>
                        <Input 
                          placeholder="Street, City, Province"
                          className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-xs font-bold text-slate-900 focus-visible:ring-2 focus-visible:ring-fermion-french-blue"
                          value={formData.cafeAddress}
                          onChange={(e) => setFormData({...formData, cafeAddress: e.target.value})}
                        />
                      </div>
                    </div>

                    <Button 
                      disabled={!formData.cafeName || !formData.cafeAddress}
                      onClick={handleNextStep}
                      className="w-full h-14 bg-slate-900 text-white font-black tracking-[0.2em] rounded-2xl hover:bg-fermion-french-blue transition-all duration-500 uppercase italic text-[10px] shadow-lg"
                    >
                      Continue <ArrowRight className="ml-2" size={14} />
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
                  className="space-y-8"
                >
                  <div className="text-left space-y-2">
                    <button onClick={() => setStep(2)} className="text-[9px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.3em] mb-2 flex items-center gap-1">
                      <ArrowLeft size={10} /> Back
                    </button>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Volume.</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Final Step</p>
                  </div>

                  <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 space-y-8 relative">
                    <Sticker rotate={-8} className="-top-4 -right-4" variant="solid" color="var(--cartoon-green)">
                       ESTIMATE
                    </Sticker>
                    
                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block text-center">Expected Monthly Volume</label>
                      <div className="grid grid-cols-1 gap-3">
                        {["5-10KG", "10-50KG", "50KG+"].map(v => (
                          <button 
                            key={v} 
                            onClick={() => setVolume(v)}
                            className={`h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border-2 ${volume === v ? "border-fermion-french-blue bg-fermion-french-blue/5 text-fermion-french-blue scale-105 shadow-md" : "border-transparent bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        By submitting, you agree to our B2B partnership terms and conditions.
                      </p>
                    </div>

                    <Button 
                      disabled={!volume || loading}
                      onClick={handleSubmitApplication}
                      className="w-full h-14 bg-slate-900 text-white font-black tracking-[0.2em] rounded-2xl hover:bg-fermion-french-blue transition-all duration-500 uppercase italic text-[10px] shadow-lg"
                    >
                      {loading ? <Loader2 className="animate-spin" size={14} /> : "Submit Application"}
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
                  className="space-y-8"
                >
                  <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/10 via-transparent to-transparent opacity-50" />
                    
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto text-emerald-500 mb-8 shadow-inner">
                      <CheckCircle2 size={40} />
                    </div>
                    
                    <div className="space-y-4 relative z-10">
                      <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Application <br/> Received!</h2>
                      <div className="flex items-center justify-center gap-2 text-fermion-french-blue bg-fermion-french-blue/5 py-2 px-4 rounded-full w-fit mx-auto border border-fermion-french-blue/10">
                        <Clock size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Verification: ~24 Hours</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                        Our team is reviewing your profile. You will be notified once your B2B dashboard is active.
                      </p>
                    </div>

                    <div className="pt-10 mt-8 border-t border-slate-100 space-y-4 relative z-10">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">While you wait...</p>
                      <Link href="/our-coffee" className="block">
                        <Button className="w-full h-14 bg-slate-900 text-white font-black tracking-[0.2em] rounded-2xl hover:bg-fermion-french-blue transition-all duration-500 uppercase italic text-[10px] shadow-lg">
                          Explore Retail Shop <ArrowRight size={14} className="ml-2" />
                        </Button>
                      </Link>
                    </div>
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
