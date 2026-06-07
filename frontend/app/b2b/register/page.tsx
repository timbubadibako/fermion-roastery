"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Building2, User, Phone, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function B2BRegisterPage() {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsScarching] = useState(false);
  const [selectedShop, setSelectedShop] = useState<any>(null);

  const mockShopResults = [
    { name: "Coffee Theory Cirebon", address: "Jl. Kartini No. 12, Cirebon", rating: 4.8 },
    { name: "The Caffeine Lab", address: "Kuningan, West Java", rating: 4.5 },
    { name: "Brew & Bites", address: "Majalengka City Center", rating: 4.2 },
  ];

  const handleSearch = () => {
    if (!searchQuery) return;
    setIsScarching(true);
    setTimeout(() => {
      setIsScarching(false);
    }, 800);
  };

  const handleComplete = () => {
    toast.success("Registration Submitted!", {
      description: "Our B2B team will review your shop and contact you within 24 hours.",
    });
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-40 pb-40 px-6">
      <div className="max-w-6xl mx-auto px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Left: Info Side */}
          <div className="lg:col-span-5 space-y-12 lg:sticky lg:top-40 h-fit">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-fermion-blue tracking-[0.4em] uppercase text-left">Partnership</p>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic leading-none text-left">
                Apply for <br/> B2B Access.
              </h1>
            </div>
            
            <div className="space-y-8">
               <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                     <Building2 size={18} className="text-fermion-blue" />
                  </div>
                  <div className="space-y-1 text-left">
                     <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Tiered Pricing</h3>
                     <p className="text-[11px] font-medium text-slate-500 leading-relaxed">Unlock exclusive volume-based rates for your coffee program.</p>
                  </div>
               </div>
               <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                     <MapPin size={18} className="text-fermion-blue" />
                  </div>
                  <div className="space-y-1 text-left">
                     <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Direct Sourcing</h3>
                     <p className="text-[11px] font-medium text-slate-500 leading-relaxed">Access seasonal micro-lots before they hit the retail market.</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right: Registration Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-10">
              
              {/* Steps Indicator */}
              <div className="flex gap-2">
                 {[1, 2].map((s) => (
                   <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= s ? "bg-slate-900" : "bg-slate-100"}`} />
                 ))}
              </div>

              {step === 1 ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2 text-left">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Locate Your Shop</h2>
                    <p className="text-xs font-medium text-slate-400">Search your business on Google Maps to sync details.</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="relative">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        placeholder="Search Shop Name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-16 pl-14 bg-slate-50 border-none rounded-2xl text-sm font-bold uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-fermion-blue"
                      />
                      <Button 
                        onClick={handleSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 h-12 px-6 rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-fermion-blue transition-all"
                      >
                        {isSearching ? <Loader2 className="animate-spin" /> : "SEARCH"}
                      </Button>
                    </div>

                    {searchQuery && !isSearching && (
                      <div className="space-y-3 pt-2">
                        {mockShopResults.map((result, i) => (
                          <button 
                            key={i}
                            onClick={() => setSelectedShop(result)}
                            className={`w-full p-6 rounded-2xl border transition-all text-left group ${selectedShop?.name === result.name ? "border-fermion-blue bg-fermion-blue/5 shadow-inner" : "border-slate-100 hover:border-slate-300 bg-white"}`}
                          >
                             <div className="flex justify-between items-center">
                                <div>
                                   <p className="text-sm font-black uppercase tracking-tight text-slate-900">{result.name}</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{result.address}</p>
                                </div>
                                {selectedShop?.name === result.name && <CheckCircle2 className="text-fermion-blue" size={20} />}
                             </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button 
                    disabled={!selectedShop}
                    onClick={() => setStep(2)}
                    className="w-full h-16 bg-slate-900 text-white font-black tracking-[0.2em] rounded-2xl hover:bg-fermion-blue transition-all duration-500 uppercase italic"
                  >
                    Next Step <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <div className="space-y-2">
                    <button onClick={() => setStep(1)} className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]">← Back to search</button>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Business Details</h2>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Confirm your contact information.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Owner Name</label>
                          <div className="relative">
                             <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                             <Input className="h-14 pl-12 bg-slate-50 border-none rounded-2xl text-sm font-bold uppercase" placeholder="Owner" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                          <div className="relative">
                             <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                             <Input className="h-14 pl-12 bg-slate-50 border-none rounded-2xl text-sm font-bold uppercase" placeholder="+62 ..." />
                          </div>
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Coffee Volume</label>
                       <div className="grid grid-cols-3 gap-3">
                          {["< 10KG", "10-50KG", "50KG+"].map(v => (
                            <button key={v} className="h-14 bg-slate-50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                               {v}
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleComplete}
                    className="w-full h-16 bg-slate-900 text-white font-black tracking-[0.2em] rounded-2xl hover:bg-fermion-blue transition-all duration-500 shadow-xl shadow-slate-900/10 uppercase italic"
                  >
                    Submit Application
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
