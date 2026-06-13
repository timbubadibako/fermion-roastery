"use client";

import React from "react";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

export default function AccountBlankPage() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl max-w-md w-full text-center space-y-8">
        <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto text-blue-500">
           <User size={40} />
        </div>
        <div className="space-y-2">
           <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">MY ACCOUNT</h1>
           <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-3 py-1 rounded-full w-fit mx-auto border border-blue-100">ROLE: {user?.role || "RETAIL"}</p>
           <p className="text-sm font-medium text-slate-400 mt-4">Welcome, <span className="text-slate-900 font-bold">{user?.full_name || "User"}</span></p>
        </div>
        <div className="pt-4 border-t border-slate-50">
           <Button 
            onClick={handleLogout}
            className="w-full h-14 bg-slate-900 hover:bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all gap-3"
           >
              <LogOut size={18} />
              Logout Session
           </Button>
        </div>
      </div>
    </div>
  );
}
