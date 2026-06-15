"use client";

import React, { useState, useEffect } from "react";
import { 
  Scale, 
  Lock, 
  Settings,
  Clock,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";

export default function CalibrationPage() {
  const { user } = useAuthStore();
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/admin/partners?profileId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setPartner(data.find((p: any) => p.profile_id === user.id));
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Checking Service Authorization...</p>
    </div>
  );

  // Requirement: contract_sequence >= 2 to unlock
  const isLocked = !partner || (partner.contract_sequence || 1) < 2;

  return (
    <div className="space-y-12">
      <div className="space-y-2 text-left">
        <h1 className="display-font text-6xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">Flavor <br/> Calibration.</h1>
        <p className="text-sm font-medium text-slate-500">Align your cafe's espresso extraction with our master roaster's profile.</p>
      </div>

      {isLocked ? (
        <div className="bg-slate-950 rounded-[4rem] p-20 text-white flex flex-col items-center justify-center text-center space-y-10 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><Scale size={200} /></div>
           <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
              <Lock size={40} className="text-periwinkle" />
           </div>
           <div className="space-y-4 relative z-10 max-w-xl">
              <h2 className="display-font text-4xl italic font-black">Authorized Protocol Only.</h2>
              <p className="text-slate-400 text-sm leading-relaxed">This exclusive benefit is reserved for partners in their **second contract cycle** or higher. Continue your partnership to unlock free on-site flavor calibration by our Head Roaster.</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="bg-white border border-slate-100 rounded-[3.5rem] p-12 space-y-10 shadow-sm relative overflow-hidden">
              <div className="space-y-4">
                 <span className="status-badge bg-emerald-50 text-emerald-600 uppercase">Status: Protocol_Unlocked</span>
                 <h3 className="display-font text-3xl italic font-black text-slate-900">Request <br/> Calibration.</h3>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium">Schedule a session with our Master Roaster to dial in your espresso machine for perfect extraction.</p>
              </div>
              <div className="space-y-4 pt-10 border-t border-slate-50">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Remaining Quota: 2 / 2</p>
                 <Button className="w-full h-16 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest italic shadow-xl shadow-slate-950/20">Initialize Calibration Request</Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
