"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F4F0E6] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Polish */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.04]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Main Container: Stacked Paper Effect */}
      <div className="relative w-full max-w-md">
        
        {/* Main Card */}
        <div className="relative bg-white border border-black/10 shadow-[10px_10px_0px_rgba(0,0,0,0.05)] rotate-[-1deg] p-10 flex flex-col rounded-sm">
           
           {/* Header */}
           <div className="flex items-center justify-between mb-10 z-10 relative">
             <h1 className="text-xl font-black italic tracking-tighter text-slate-900">FERMION.</h1>
             <Link href="/">
               <button className="flex items-center gap-2 bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all border border-black/5">
                 <ArrowLeft size={12} strokeWidth={2.5} /> Hub
               </button>
             </Link>
           </div>

           {/* Auth Form Component */}
           <div className="relative z-10">
             <AuthForm onSuccess={handleAuthSuccess} />
           </div>

           {/* Tape Accent - Single piece at top */}
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/70 border border-black/5 rotate-[-2deg] backdrop-blur-sm z-20 shadow-sm"></div>
        </div>
      </div>
    </div>
  );
}
