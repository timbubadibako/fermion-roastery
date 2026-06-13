"use client";

import React from "react";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Briefcase, LogOut } from "lucide-react";

export default function B2BBlankPage() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl max-w-md w-full text-center space-y-8">
        <div className="w-20 h-20 bg-fermion-french-blue/10 rounded-[2rem] flex items-center justify-center mx-auto text-fermion-french-blue">
           <Briefcase size={40} />
        </div>
        <div className="space-y-2">
           <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">B2B PARTNER HUB</h1>
           <p className="text-sm font-medium text-slate-400">Authenticated as: <span className="text-slate-900">{user?.full_name || "Partner"}</span></p>
        </div>
        <div className="pt-4 border-t border-slate-50">
           <Button 
            onClick={handleLogout}
            className="w-full h-14 bg-slate-900 hover:bg-fermion-french-blue text-white rounded-2xl font-black uppercase tracking-widest transition-all gap-3"
           >
              <LogOut size={18} />
              Logout Session
           </Button>
        </div>
      </div>
    </div>
  );
}
