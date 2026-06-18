"use client";

import React from "react";
import Link from "next/link";
import { MapPin, User, Phone } from "lucide-react";
import { AddressInput, AddressValue } from "@/components/address-input";
import { Input } from "@/components/ui/input";

interface AddressSelectionProps {
  address: AddressValue;
  setAddress: (addr: AddressValue) => void;
  shippingData?: any;
  setShippingData?: (data: any) => void;
  savedAddresses?: any[]; 
  onSelectSaved?: (addr: any) => void;
  activeAddressId?: string;
  contextType?: 'subscription' | 'retail';
}

export const AddressSelection = ({ address, setAddress, shippingData, setShippingData, savedAddresses = [], onSelectSaved, activeAddressId, contextType = 'subscription' }: AddressSelectionProps) => {
  return (
    <div className="space-y-10">
      {/* Opsi Alamat Tersimpan - Outside Main Form Container to match layout */}
      <div className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Pilih Alamat Tersimpan</h3>

          {savedAddresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {savedAddresses.map((addr, i) => {
                      const isActive = activeAddressId === (addr.id || i.toString());
                      return (
                        <button 
                          key={addr.id || i} 
                          type="button"
                          onClick={() => onSelectSaved?.(addr)}
                          className={`p-5 border rounded-sm cursor-pointer transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.02)] text-left ${isActive ? 'border-[#367F4D] bg-stone-50' : 'border-black/10 bg-white hover:border-[#367F4D]'}`}
                        >
                            <p className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-[#367F4D]' : 'text-stone-500'}`}>{addr.label || `Alamat ${i+1}`}</p>
                            <p className="text-[10px] font-bold text-slate-900 mt-1 line-clamp-1">{addr.address || "Alamat belum diatur"}</p>
                        </button>
                      );
                  })}
              </div>
          ) : (
              <Link href="/account" className="block p-4 border border-dashed border-black/10 bg-stone-50 rounded-sm hover:border-[#367F4D] transition-all">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">
                    {contextType === 'subscription' 
                      ? "Lengkapi alamat pengiriman utama anda untuk kita kirimkan setiap bulannya."
                      : "Lengkapi alamat pengiriman utama anda untuk melanjutkan pesanan."
                    }
                  </p>
              </Link>
          )}
      </div>

      {/* Main Form Container */}
      <div className="bg-white p-8 md:p-12 border border-black/5 shadow-sm relative rounded-sm">
         <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-20 h-5 bg-white/60 border border-black/5 rotate-[-2deg] backdrop-blur-sm shadow-sm z-10" />
         
         <div className="space-y-10 relative z-0">
            
            {/* Optional Identitas Penerima */}
            {shippingData && setShippingData && (
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-md">
                        <User size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold uppercase tracking-widest text-xs text-slate-900">Identitas Penerima</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Who is receiving this order?</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 ml-1">Nama Lengkap</label>
                        <Input required value={shippingData.name} onChange={e => setShippingData({...shippingData, name: e.target.value})} className="h-12 bg-stone-50 border-black/5 font-bold rounded-sm px-4 focus:ring-[#367F4D]" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 ml-1">Nomor WhatsApp</label>
                        <div className="relative">
                            <Input required value={shippingData.phone} onChange={e => setShippingData({...shippingData, phone: e.target.value})} placeholder="08..." className="h-12 bg-stone-50 border-black/5 font-bold rounded-sm px-4 pl-10 focus:ring-[#367F4D]" />
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={14} />
                        </div>
                    </div>
                 </div>
              </div>
            )}

            {/* Address Input */}
            <div className="space-y-6 pt-6 border-t border-dashed border-black/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#367F4D] text-white flex items-center justify-center shadow-md">
                        <MapPin size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold uppercase tracking-widest text-xs text-slate-900">Detail Alamat Pengiriman</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">The final coordinates</p>
                    </div>
                </div>
                <AddressInput value={address} onChange={setAddress} />
            </div>
         </div>
      </div>
    </div>
  );
};
