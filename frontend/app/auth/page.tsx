"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Sticker } from "@/components/ui/sticker";

export default function AuthPageV2() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuthSuccess = (profile: any) => {
    setUser(profile);
    if (profile.role === 'ADMIN') {
      router.push("/admin/dashboard");
    } else if (profile.role === 'B2B') {
      router.push("/b2b/dashboard");
    } else {
      router.push("/our-coffee");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center p-4 md:p-10 relative overflow-hidden font-sans">
      
      {/* Background Polish */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Client%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div 
        className={`w-full max-w-5xl bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 overflow-hidden flex flex-col lg:flex-row shadow-2xl shadow-slate-900/10 transition-all duration-1000 ease-out relative z-10 ${
          mounted ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-10"
        }`}
      >
        
        {/* Left Panel - Visual Narrative */}
        <div className="lg:w-1/2 p-4 md:p-6 flex flex-col relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6 z-10 relative">
            <h1 className="text-xl font-black italic tracking-tighter text-slate-900">FERMION.</h1>
            <Link href="/">
              <button className="flex items-center gap-2 bg-white/50 backdrop-blur-md hover:bg-white text-slate-600 hover:text-slate-900 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all border border-white/60 shadow-sm hover:shadow-md">
                <ArrowLeft size={12} strokeWidth={2.5} /> Back to Hub
              </button>
            </Link>
          </div>

          {/* Image Container with Inner Glass */}
          <div className="flex-1 relative rounded-[2rem] overflow-hidden min-h-[300px] lg:min-h-[600px] border border-slate-100/50 shadow-inner group">
            <Image
              src="https://placehold.co/800x1200/e2e8f0/94a3b8?text=Fermion+Roastery"
              alt="Fermion Roastery Experience"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            
            <Sticker rotate={-10} className="top-8 right-8" variant="solid" color="var(--cartoon-yellow)">
               <span className="p-2">ACCESS</span>
            </Sticker>

            {/* Text Overlay */}
            <div className="absolute bottom-8 left-8 right-8 text-left z-10 space-y-2">
              <div className="inline-block px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-[8px] font-black text-white uppercase tracking-widest mb-2">
                 Scientific Coffee
              </div>
              <h2 className="text-white text-3xl font-display font-black italic leading-tight tracking-tighter shadow-sm">
                Unlock your <br /> morning ritual.
              </h2>
            </div>
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white/60 relative">
           {/* Form Content */}
           <div className="max-w-sm mx-auto w-full space-y-8 relative z-10">
              <div className="text-center space-y-2">
                 <h2 className="text-3xl font-black italic tracking-tighter text-slate-900">Welcome Back.</h2>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enter the laboratory</p>
              </div>
              
              {/* Injecting the shared AuthForm component */}
              <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 relative group">
                 <Sticker rotate={15} className="-top-4 -right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    SECURE
                 </Sticker>
                 <AuthForm onSuccess={handleAuthSuccess} />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

