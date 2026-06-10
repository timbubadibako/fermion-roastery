"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Github, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AuthForm } from "@/components/auth-form";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export default function AuthPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleAuthSuccess = (profile: any) => {
    setUser(profile); // Persist user to store
    
    // Redirect based on role
    if (profile.role === 'ADMIN') {
      router.push("/admin/dashboard");
    } else if (profile.role === 'B2B') {
      router.push("/b2b/dashboard");
    } else {
      router.push("/our-coffee");
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-32 pb-40 flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-10">
        
        {/* Header Content */}
        <div className="text-center space-y-3">
          <p className="text-[10px] font-black text-fermion-blue tracking-[0.4em] uppercase">
            Artisan Coffee Experience
          </p>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
            Fermion Account
          </h1>
          <p className="text-slate-500 text-sm font-medium text-balance">
            Access your curated coffee selections, track orders, and manage wholesale partnerships.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
          <AuthForm onSuccess={handleAuthSuccess} />
        </div>

      </div>
    </div>
  );
}
