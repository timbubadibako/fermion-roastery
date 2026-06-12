"use client";

import React, { useState } from "react";
import { Mail, Lock, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface AuthFormProps {
  onSuccess: (profile: any) => void;
  defaultRole?: "RETAIL" | "B2B";
}

export function AuthForm({ onSuccess, defaultRole = "RETAIL" }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (mode === "register" && !formData.fullName)) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    console.log(`🔑 Attempting ${mode}...`, { email: formData.email });
    
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

      const data = await response.json();
      console.log(`📡 Backend Response:`, data);

      if (response.ok) {
        // Set security cookie for middleware (expires in 24h)
        document.cookie = `fermion_profile_id=${data.profile.id}; path=/; max-age=86400; SameSite=Lax`;
        toast.success(data.message);
        onSuccess(data.profile); // Pass profile back to parent
      } else {
        toast.error(data.message || `Failed to ${mode}`);
      }
    } catch (error: any) {
      console.error("❌ Auth error:", error);
      toast.error(`Network error: ${error.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 text-center">
      <AnimatePresence mode="wait">
        <motion.form 
          key={mode}
          initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit} 
          className="space-y-4 text-left"
        >
          {mode === "register" && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <Input 
                  required
                  type="text"
                  placeholder="John Doe"
                  className="h-14 pl-14 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <Input 
                required
                type="email"
                placeholder="user@example.com"
                className="h-14 pl-14 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <Input 
                required
                type="password"
                placeholder="••••••••"
                className="h-14 pl-14 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-slate-900 text-white font-black tracking-[0.2em] rounded-2xl hover:bg-fermion-french-blue transition-all duration-500 uppercase italic mt-4"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                <span>Processing...</span>
              </div>
            ) : (mode === "login" ? "Log In" : "Register")}
          </Button>
        </motion.form>
      </AnimatePresence>

      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <button 
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-fermion-french-blue hover:text-slate-900 transition-colors ml-1 underline underline-offset-4"
        >
          {mode === "login" ? "Register" : "Log In"}
        </button>
      </p>
    </div>
  );
}
