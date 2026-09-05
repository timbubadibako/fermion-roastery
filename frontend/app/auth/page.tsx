"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Globe } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { useAuthStore, useLangStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

export default function AuthPageV2() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const { language, toggleLanguage } = useLangStore();
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Left Panel Stagger Reveal
      gsap.fromTo(
        ".auth-gsap-left",
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.9, ease: "power3.out" }
      );

      // Right Photo Block Reveal
      gsap.fromTo(
        ".auth-gsap-photo",
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.3, ease: "power2.out" }
      );

      gsap.fromTo(
        ".auth-gsap-caption",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

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
    <div ref={containerRef} className="min-h-screen bg-[#0B101D] text-slate-100 font-sans flex flex-col lg:flex-row overflow-hidden">
      
      {/* LEFT PANEL: AUTH FORM */}
      <div className="flex-1 lg:max-w-xl xl:max-w-2xl flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-[#0B101D] border-r border-slate-800/80">
        
        {/* Top Header Toolbar */}
        <div className="auth-gsap-left flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/fermion-logo.png"
              alt="Fermion Roastery Logo"
              width={120}
              height={40}
              className="h-8.5 w-auto object-contain"
              priority
            />
            <span className="text-[10px] text-slate-400 font-mono font-medium block border-l border-slate-700/80 pl-3">
              {language === 'id' ? 'Portal Resmi' : 'Official Portal'}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 bg-[#111827] hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-xl transition-colors border border-slate-800"
              title="Ganti Bahasa / Switch Language"
            >
              <Globe size={14} className="text-[#367F4D]" />
              <span className="font-mono text-[11px] font-extrabold text-white">
                {language.toUpperCase()}
              </span>
            </button>

            {/* Back to Home Link */}
            <Link href="/">
              <button className="flex items-center gap-1.5 bg-[#111827] hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-colors border border-slate-800">
                <ArrowLeft size={14} /> {language === 'id' ? 'Beranda' : 'Home'}
              </button>
            </Link>
          </div>
        </div>

        {/* Auth Form Card Container */}
        <div className="auth-gsap-left my-auto py-4 space-y-6 max-w-md mx-auto w-full text-left">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase font-mono">
              {language === 'id' ? 'Masuk atau Daftar Akun' : 'Sign In or Register'}
            </h1>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              {language === 'id'
                ? 'Masuk akun untuk berbelanja specialty coffee retail, melacak pesanan, berlangganan rutin, atau kemitraan B2B.'
                : 'Sign in to order specialty coffee retail, track shipments, manage subscriptions, or access B2B wholesale.'}
            </p>
          </div>

          <div className="bg-[#111827] border border-slate-800/90 p-6 sm:p-8 rounded-2xl shadow-xl">
            <AuthForm onSuccess={handleAuthSuccess} />
          </div>
        </div>

        {/* Footer info */}
        <div className="auth-gsap-left text-xs text-slate-500 font-medium pt-6 flex justify-between items-center border-t border-slate-800/60">
          <span>Fermion Roastery &copy; {new Date().getFullYear()}</span>
          <span className="text-[11px] font-mono text-slate-400">Cirebon, Indonesia</span>
        </div>
      </div>

      {/* RIGHT PANEL: PHOTO BLOCK (UNSPLASH HERO PHOTO) */}
      <div className="hidden lg:flex flex-1 relative bg-slate-950 items-end p-12 overflow-hidden border-l border-slate-800/60">
        <div 
          className="auth-gsap-photo absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1600&auto=format&fit=crop')` }}
        />
        
        {/* Clean Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B101D] via-[#0B101D]/40 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Content Caption Overlay */}
        <div className="auth-gsap-caption relative z-10 max-w-lg space-y-2 text-left">
          <p className="text-xs font-mono font-bold tracking-widest text-[#367F4D] uppercase">
            Specialty Coffee &bull; Cirebon
          </p>
          <h2 className="text-2xl font-extrabold text-white tracking-tight uppercase font-mono">
            {language === 'id' 
              ? 'Platform Penjualan Retail & Wholesale Direct Brand' 
              : 'Direct Brand Retail & Wholesale Coffee Platform'}
          </h2>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            {language === 'id'
              ? 'Nikmati kemudahan belanja biji kopi specialty fresh-roast langsung dari brand roastery mandiri untuk kebutuhan personal (B2C) maupun kafe (B2B).'
              : 'Enjoy direct specialty coffee orders for personal home brewing (B2C) and cafe partnerships (B2B) with fresh roasts delivered straight to you.'}
          </p>
        </div>
      </div>
    </div>
  );
}
