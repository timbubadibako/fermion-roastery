"use client";

import React, { useState } from "react";
import { Mail, Lock, Loader2, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

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
      toast.error(authCopy.fillAllFields);
      return;
    }

    if (mode === "register") {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        toast.error(authCopy.passwordRequirement);
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
        let errorMessage = `Failed to ${mode}`;
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

      if (!profile) throw new Error(authCopy.resolveProfileFailure);

      // Establish Supabase client-side session so apiFetch can use the token
      if (data.session?.access_token && data.session?.refresh_token) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

      // Set security cookie for middleware (expires in 24h)
      document.cookie = `fermion_profile_id=${profile.id}; path=/; max-age=86400; SameSite=Lax`;
      toast.success(data.message || (mode === "login" ? authCopy.submitLogin : authCopy.submitRegister));
      onSuccess(profile); 
    } catch (error: unknown) {
      console.error("❌ Auth error:", error);
      toast.error(getErrorMessage(error, authCopy.fallbackError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 text-center">
      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.form 
            key={mode}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onSubmit={handleSubmit} 
            className="space-y-6 text-left absolute w-full"
          >
            {mode === "register" && (
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 bg-white px-2 absolute -top-2 left-2 z-10 border border-black/5 rotate-[-1deg]">{authCopy.fullNameLabel}</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                  <Input 
                    required
                    type="text"
                    placeholder={authCopy.fullNamePlaceholder}
                    className="h-14 pl-14 bg-white border border-black/10 rounded-sm text-sm font-medium focus:border-[#367F4D] transition-colors shadow-sm"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 bg-white px-2 absolute -top-2 left-2 z-10 border border-black/5 rotate-[1deg]">{authCopy.emailLabel}</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <Input 
                  required
                  type="email"
                  placeholder={authCopy.emailPlaceholder}
                  className="h-14 pl-14 bg-white border border-black/10 rounded-sm text-sm font-medium focus:border-[#367F4D] transition-colors shadow-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2 relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 bg-white px-2 absolute -top-2 left-2 z-10 border border-black/5 rotate-[-1deg]">{authCopy.passwordLabel}</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <Input 
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-14 pl-14 pr-12 bg-white border border-black/10 rounded-sm text-sm font-medium focus:border-[#367F4D] transition-colors shadow-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-stone-900 text-white font-black tracking-[0.2em] rounded-sm hover:bg-[#367F4D] transition-all duration-300 uppercase italic mt-2 hover:-translate-y-1 active:scale-95 shadow-md"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  <span>{authCopy.processing}</span>
                </div>
              ) : (mode === "login" ? authCopy.submitLogin : authCopy.submitRegister)}
            </Button>
          </motion.form>
        </AnimatePresence>
      </div>

      {/* OAUTH BUTTONS TEMPORARILY DISABLED 
      <div className="flex gap-4">
        <Button onClick={() => handleOAuth('google')} type="button" variant="outline" className="flex-1 h-12 bg-white border border-black/10 shadow-sm rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-stone-50">
          Google
        </Button>
        <Button onClick={() => handleOAuth('facebook')} type="button" variant="outline" className="flex-1 h-12 bg-white border border-black/10 shadow-sm rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-stone-50">
          Facebook
        </Button>
      </div>
      */}

      {/* Squiggly line */}
      <svg className="w-16 mx-auto opacity-10" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5" stroke="currentColor" fill="transparent" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
        {mode === "login" ? authCopy.loginPrompt : authCopy.registerPrompt}
        <button 
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-[#367F4D] hover:text-stone-900 transition-colors ml-1 underline underline-offset-4"
        >
          {mode === "login" ? authCopy.switchToRegister : authCopy.switchToLogin}
        </button>
      </p>
    </div>
  );
}
