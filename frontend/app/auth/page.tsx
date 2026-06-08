"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Github, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-32 pb-40 flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-10">
        
        {/* Header Content */}
        <div className="text-center space-y-3">
          <p className="text-[10px] font-black text-fermion-blue tracking-[0.4em] uppercase">
            {mode === "login" ? "Welcome Back" : "Join the Club"}
          </p>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
            {mode === "login" ? "Fermion Account" : "Create Account"}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {mode === "login" 
              ? "Access your curated coffee selections and orders." 
              : "Start your artisan coffee journey with Fermion Roastery."}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
          
          {/* Social Logins */}
          <div className="space-y-4">
            <button className="w-full h-14 flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all duration-300 group">
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c1.08-1 2.21-2.5 2.21-5.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              <span className="text-xs font-bold text-slate-700 tracking-widest uppercase">Continue with Google</span>
            </button>
            <button className="w-full h-14 flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all duration-300 group">
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
              <span className="text-xs font-bold text-slate-700 tracking-widest uppercase">Continue with Facebook</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative px-4 bg-white text-[10px] font-bold text-slate-300 uppercase tracking-widest">OR</span>
          </div>

          {/* Email Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {mode === "register" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                   <Input 
                    type="text" 
                    placeholder="Enter your name" 
                    className="h-14 pl-12 bg-slate-50 border-none rounded-2xl text-sm font-medium focus-visible:ring-2 focus-visible:ring-fermion-blue"
                   />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                 <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="h-14 pl-12 bg-slate-50 border-none rounded-2xl text-sm font-medium focus-visible:ring-2 focus-visible:ring-fermion-blue"
                 />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                {mode === "login" && (
                  <Link href="#" className="text-[10px] font-bold text-fermion-blue hover:underline">Forgot?</Link>
                )}
              </div>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                 <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="h-14 pl-12 bg-slate-50 border-none rounded-2xl text-sm font-medium focus-visible:ring-2 focus-visible:ring-fermion-blue"
                 />
              </div>
            </div>

            <Button className="w-full h-16 bg-slate-900 text-white font-black tracking-[0.2em] rounded-2xl hover:bg-fermion-blue transition-all duration-500 shadow-xl shadow-slate-900/10 uppercase italic">
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </div>

        {/* Footer Toggle */}
        <div className="text-center">
          <button 
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
          >
            {mode === "login" 
              ? "Don't have an account? Create one" 
              : "Already have an account? Sign in"}
          </button>
        </div>

      </div>
    </div>
  );
}
