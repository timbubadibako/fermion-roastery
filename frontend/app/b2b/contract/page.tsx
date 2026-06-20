"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Download, Upload, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";

export default function B2BContractPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/b2b/register');
    }
  }, [user, router]);

  const handleDownloadContract = () => {
    if (!user) return;
    window.open(`/api/b2b/contract?profileId=${user.id}`, '_blank');
  };

  const handleUploadContract = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Simulate upload delay
    setTimeout(async () => {
      try {
        const res = await fetch('/api/b2b/upload-contract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId: user?.id })
        });
        if (res.ok) {
          toast.success("Contract uploaded successfully");
          router.push('/account'); // or wherever the portal is
        }
      } catch (e) {
        toast.error("Upload failed");
      } finally {
        setUploading(false);
      }
    }, 2000);
  };

  if (!mounted || !user) return null;

  return (
    <div className="min-h-screen bg-[#F4F0E6] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Polish */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.04]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Main Container: Stacked Paper Effect */}
      <div className="relative w-full max-w-5xl">
        
        {/* Main Card */}
        <div className="relative bg-white border border-black/10 shadow-[10px_10px_0px_rgba(0,0,0,0.05)] rotate-[-1deg] p-10 md:p-16 flex flex-col lg:flex-row gap-16 rounded-sm">
           
           {/* Left Panel - Visual Narrative */}
           <div className="lg:w-1/3 space-y-10" id="tour-contract-header">
              <div className="flex items-center justify-between z-10 relative">
                <h1 className="text-xl font-black italic tracking-tighter text-slate-900">FERMION.</h1>
                <Link href="/b2b/register">
                  <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest hover:text-[#367F4D] transition-all">
                    <ArrowLeft size={12} strokeWidth={2.5} /> BACK
                  </button>
                </Link>
              </div>

              <div className="space-y-4">
                 <h2 className="text-5xl font-cloude italic leading-none tracking-tighter text-slate-900">
                    Contract Protocol.
                 </h2>
                 <p className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                    Legal finalization.
                 </p>
              </div>
           </div>

           {/* Right Panel - Content */}
           <div className="lg:w-2/3">
             <div className="space-y-8">
                <div className="bg-[#FDFBF7] p-12 border border-black/10 shadow-[8px_8px_0px_rgba(0,0,0,0.02)] rounded-none relative text-center overflow-visible">
                   {/* Grid Pattern */}
                   <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #367F4D 1px, transparent 1px), linear-gradient(to bottom, #367F4D 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                   
                   {/* Tape - fixed positioning to overlap */}
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/70 border border-black/5 rotate-[-2deg] z-20 backdrop-blur-sm shadow-sm"></div>
                   
                   <div className="space-y-6 relative z-10">
                     <h2 className="text-4xl font-cloude italic tracking-tighter text-slate-900 leading-none">Contract Protocol.</h2>
                     <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Legal Finalization</p>
                     <p className="text-sm text-stone-600 font-medium leading-relaxed italic">
                       "Your partnership agreement is ready. Please download, sign, and upload to finalize your lab access."
                     </p>
                   </div>

                   <div className="grid grid-cols-1 gap-6 pt-10 relative z-10">
                     <Button 
                       id="tour-contract-download"
                       onClick={handleDownloadContract}
                       className="w-full h-14 bg-white text-stone-900 border border-black/10 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-stone-50 transition-all shadow-[4px_4px_0_rgba(0,0,0,0.02)] hover:shadow-none"
                     >
                        <Download size={14} className="mr-3" /> Download Contract PDF
                     </Button>
                     
                     <div className="relative group" id="tour-contract-upload">
                        <label className="h-32 w-full bg-white border-2 border-dashed border-black/10 rounded-sm flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#367F4D] transition-all group-hover:bg-stone-50">
                           {uploading ? <Loader2 className="animate-spin text-[#367F4D]" size={24} /> : <Upload size={24} className="text-stone-300 group-hover:text-[#367F4D]" />}
                           <div className="text-center">
                              <p className="text-[10px] font-black uppercase tracking-widest text-stone-900">{uploading ? "Uploading..." : "Drop or Click to Upload"}</p>
                              <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mt-1">Accepted Format: PDF Only (Max 5MB)</p>
                           </div>
                           <input type="file" className="hidden" accept="application/pdf" onChange={handleUploadContract} />
                        </label>
                     </div>
                   </div>
                </div>
             </div>
           </div>

           {/* Tape Accent */}
           <div className="absolute -top-4 -right-4 w-20 h-6 bg-white/60 border border-black/5 rotate-[15deg] backdrop-blur-sm z-20 shadow-sm"></div>
        </div>
      </div>
    </div>
  );
}
