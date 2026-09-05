"use client";

import React, { useState } from "react";
import { Mail, Lock, Loader2, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import { debugError } from "@/lib/debug";

interface AuthFormProps {
  onSuccess: (profile: AuthProfile) => void;
  defaultRole?: "RETAIL" | "B2B";
  initialMode?: "login" | "register";
}

type AuthProfile = {
  id: string;
  email?: string;
  full_name?: string;
  role?: string;
  [key: string]: unknown;
};

type AuthResponse = {
  message?: string;
  profile?: AuthProfile;
  session?: {
    access_token?: string;
    refresh_token?: string;
  };
};

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export function AuthForm({ onSuccess, defaultRole = "RETAIL", initialMode = "login" }: AuthFormProps) {
  const t = useI18n();
  const authCopy = t.auth;
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (mode === "register" && !formData.fullName)) {
      toast.error(authCopy.fillAllFields || "Mohon isi semua bidang yang diperlukan.");
      return;
    }

    if (mode === "register") {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        toast.error(authCopy.passwordRequirement || "Kata sandi minimal 8 karakter dengan kombinasi huruf dan angka.");
        return;
      }
    }

    setLoading(true);
    
    try {
      const endpoint = mode === "register" ? '/api/auth/register' : '/api/auth/login';
      const body = mode === "register" 
        ? { ...formData, role: defaultRole }
        : { email: formData.email, password: formData.password };

      const response = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = mode === "register" ? authCopy.registerFailure : authCopy.loginFailure;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json() as AuthResponse;
      const profile = data.profile;

      if (!profile) throw new Error(authCopy.resolveProfileFailure || "Gagal memproses profil pengguna.");

      if (data.session?.access_token && data.session?.refresh_token) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

      document.cookie = `fermion_profile_id=${profile.id}; path=/; max-age=86400; SameSite=Lax`;
      toast.success(data.message || (mode === "login" ? authCopy.submitLogin : authCopy.submitRegister));
      onSuccess(profile); 
    } catch (error: unknown) {
      debugError("Auth error:", error);
      toast.error(getErrorMessage(error, authCopy.fallbackError || "Terjadi kesalahan otentikasi."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-5 text-left font-sans">
      
      {/* Tab Switcher */}
      <div className="grid grid-cols-2 bg-[#111827] p-1 rounded-xl border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`py-2 px-3 font-bold uppercase tracking-wider rounded-lg transition-all ${
            mode === "login"
              ? "bg-[#367F4D] text-white shadow-xs"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Masuk
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`py-2 px-3 font-bold uppercase tracking-wider rounded-lg transition-all ${
            mode === "register"
              ? "bg-[#367F4D] text-white shadow-xs"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Daftar Akun
        </button>
      </div>

      {defaultRole === "B2B" && (
        <div className="p-3 bg-[#111827] border border-slate-800 rounded-xl text-xs font-semibold text-slate-300">
          Pendaftaran khusus Mitra Cafe & Kemitraan B2B
        </div>
      )}

      {/* Form Fields with Smooth Transition */}
      <AnimatePresence mode="wait">
        <motion.form
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input 
                  required
                  type="text"
                  placeholder="Nama Lengkap Anda"
                  className="h-11 pl-10 bg-[#111827] border-slate-800 rounded-xl text-xs font-medium text-slate-100 placeholder-slate-500 focus:border-[#367F4D] focus:ring-1 focus:ring-[#367F4D]"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                required
                type="email"
                placeholder="nama@email.com"
                className="h-11 pl-10 bg-[#111827] border-slate-800 rounded-xl text-xs font-medium text-slate-100 placeholder-slate-500 focus:border-[#367F4D] focus:ring-1 focus:ring-[#367F4D]"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                required
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-11 pl-10 pr-10 bg-[#111827] border-slate-800 rounded-xl text-xs font-medium text-slate-100 placeholder-slate-500 focus:border-[#367F4D] focus:ring-1 focus:ring-[#367F4D]"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {mode === "register" && (
              <p className="text-[10px] text-slate-500 font-medium pt-0.5">
                Minimal 8 karakter, kombinasi huruf dan angka.
              </p>
            )}
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#367F4D] hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors border-none shadow-sm mt-2"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                <span>Memproses...</span>
              </div>
            ) : (mode === "login" ? "Masuk ke Akun" : "Daftar Akun Baru")}
          </Button>
        </motion.form>
      </AnimatePresence>

      {/* Switcher Text Prompt */}
      <div className="pt-2 text-center text-xs text-slate-400">
        <span>{mode === "login" ? "Belum memiliki akun?" : "Sudah memiliki akun?"}</span>
        <button 
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-[#367F4D] hover:text-emerald-400 font-bold ml-1.5 underline underline-offset-4 transition-colors"
        >
          {mode === "login" ? "Daftar Sekarang" : "Masuk Sekarang"}
        </button>
      </div>
    </div>
  );
}
