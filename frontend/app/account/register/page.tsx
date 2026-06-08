"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { AuthForm } from "@/components/auth-form";

export default function RetailRegisterPage() {
  const router = useRouter();

  const handleAuthSuccess = (profile: any) => {
    // Save to local storage or context if you had one, then redirect
    localStorage.setItem("fermion_user", JSON.stringify(profile));
    router.push("/our-coffee");
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
      <div className="max-w-xl w-full">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-900 mb-4">
              <UserCircle size={32} />
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Retail Account</h2>
            <p className="text-sm text-slate-400 font-medium">Create an account to track your orders and subscriptions.</p>
          </div>

          <AuthForm onSuccess={handleAuthSuccess} defaultRole="RETAIL" />
        </motion.div>

      </div>
    </div>
  );
}
