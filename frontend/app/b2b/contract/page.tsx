"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Download,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";

export default function ContractPage() {
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
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Contract Data...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="space-y-2 text-left">
        <h1 className="display-font text-6xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">My <br/> Agreement.</h1>
        <p className="text-sm font-medium text-slate-500">Review your partnership contract details and business profile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* CONTRACT STATUS */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[4rem] p-12 space-y-10 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-periwinkle/5 blur-3xl -mr-40 -mt-40 pointer-events-none" />
           
           <div className="flex items-center justify-between relative z-10 border-b border-slate-50 pb-8">
              <div className="space-y-1">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol ID</p>
                 <h3 className="text-3xl font-black italic text-slate-900">#FM-{partner?.id?.slice(0,8).toUpperCase() || 'UNKNOWN'}</h3>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <span className={`status-badge uppercase px-3 py-1 border ${
                   partner?.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                 }`}>{partner?.status || 'Pending'}</span>
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Sequence: #{partner?.contract_sequence || 1}</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="space-y-2">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Target Volume</p>
                 <p className="text-xl font-black italic text-slate-900">{partner?.estimated_volume_kg || '10KG'}</p>
                 <p className="text-[8px] font-bold text-slate-500 uppercase">Per Month</p>
              </div>
              <div className="space-y-2">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Valid Until</p>
                 <p className="text-xl font-black italic text-slate-900">MAR 2027</p>
                 <p className="text-[8px] font-bold text-slate-500 uppercase">134 Days Remaining</p>
              </div>
              <div className="space-y-2">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Base Discount</p>
                 <p className="text-xl font-black italic text-periwinkle">- Rp 10.000</p>
                 <p className="text-[8px] font-bold text-slate-500 uppercase">Per Kilogram</p>
              </div>
           </div>

           <div className="pt-8 relative z-10">
              <Button 
                onClick={() => window.open(`/api/b2b/contract?profileId=${user?.id}`, '_blank')}
                className="w-full md:w-auto h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-periwinkle transition-all"
              >
                 <Download size={16} className="mr-2" /> Download Original PDF
              </Button>
           </div>
        </div>

        {/* BUSINESS PROFILE */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Building2 size={100} /></div>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-8 relative z-10">Business Profile</h3>
              
              <div className="space-y-6 relative z-10">
                 {partner?.cafe_logo_url ? (
                   <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-2">
                      <img src={partner.cafe_logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                   </div>
                 ) : (
                   <div className="w-24 h-24 bg-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-500 border border-white/10 border-dashed">
                      <Building2 size={24} className="mb-1" />
                      <span className="text-[8px] font-black uppercase tracking-widest">No Logo</span>
                   </div>
                 )}
                 
                 <div>
                    <h4 className="display-font text-2xl italic font-black">{partner?.company_name || 'Cafe Name'}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1"><MapPin size={10} /> {partner?.address || 'Address not set'}</p>
                 </div>
                 
                 <div className="pt-6 border-t border-white/10 space-y-4">
                    <div>
                       <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Tax ID (NPWP)</p>
                       <p className="text-xs font-mono font-bold text-slate-300 mt-1">{partner?.npwp || 'Not Provided'}</p>
                    </div>
                    <div>
                       <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Billing Address</p>
                       <p className="text-xs font-bold text-slate-300 mt-1 truncate">{partner?.billing_address || 'Same as cafe'}</p>
                    </div>
                 </div>

                 <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white rounded-xl h-12 text-[9px] font-black uppercase tracking-widest mt-4">
                    Update Information
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
