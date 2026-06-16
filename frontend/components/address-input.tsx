"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddressValue {
  address: string;
  city: string;
  postalCode: string;
  area_id: string;
  district?: string;
  province?: string;
  regency?: string;
}

interface AddressInputProps {
  value: AddressValue;
  onChange: (value: AddressValue) => void;
  label?: string;
}

export function AddressInput({ value, onChange, label = "Alamat Pengiriman" }: AddressInputProps) {
  const [areas, setAreas] = useState<any[]>([]);
  const [showAreas, setShowAreas] = useState(false);
  const [areaSearchLoading, setAreaSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Local state for search

  const fetchAreas = async (input: string) => {
    setSearchQuery(input);
    if (input.length < 3) {
      setAreas([]);
      return;
    }
    setAreaSearchLoading(true);
    try {
      const res = await fetch(`/api/shipping/areas?input=${encodeURIComponent(input)}`);
      if (res.ok) {
        const data = await res.json();
        setAreas(data);
        setShowAreas(true);
      }
    } catch (error) {
      console.error("Area search error:", error);
    } finally {
      setAreaSearchLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Detailed Address */}
      <div className="space-y-3">
         <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">Alamat Lengkap</label>
         <div className="relative group">
            <textarea 
               required
               value={value.address}
               onChange={(e) => onChange({ ...value, address: e.target.value })}
               placeholder="Nama jalan, No Rumah, RT/RW, dsb..."
               className="w-full h-28 bg-stone-50/50 border border-black/5 rounded-sm p-5 text-sm font-bold resize-none placeholder:text-stone-300 transition-all focus:bg-white focus:border-stone-200 focus:ring-0 shadow-inner"
            />
            <div className="absolute bottom-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
               <p className="text-[8px] font-black uppercase tracking-widest text-stone-300 italic">Alamat Lengkap</p>
            </div>
         </div>
      </div>

      {/* City/Area Search */}
      <div className="relative">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">Cari Kota atau Kecamatan</label>
        <div className="relative mt-3">
          <Input 
            placeholder="Ketik minimal 3 huruf..." 
            className="h-14 bg-white border border-black/10 font-bold rounded-sm pl-14 shadow-sm focus:border-stone-400 transition-all" 
            value={searchQuery} // Use local state
            onChange={(e) => fetchAreas(e.target.value)}
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          {areaSearchLoading && <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 animate-spin text-[#367F4D]" size={18} />}
        </div>

        <AnimatePresence>
          {showAreas && areas.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10, rotate: -0.5 }} 
              animate={{ opacity: 1, y: 5, rotate: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-[100] w-full mt-2 bg-white border border-black/10 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden max-h-72 overflow-y-auto"
            >
              {areas.map((area, idx) => (
                <button 
                  key={area.id}
                  type="button"
                  onClick={() => {
                    onChange({
                      ...value,
                      city: area.name,
                      area_id: area.id,
                      postalCode: area.postal_code?.toString() || "",
                      district: area.administrative_division_level_3_name,
                      regency: area.administrative_division_level_2_name,
                      province: area.administrative_division_level_1_name
                    });
                    setAreas([]);
                    setShowAreas(false);
                    setSearchQuery(area.name); // Optionally update input with selected
                  }}
                  className="w-full p-5 text-left hover:bg-stone-50 border-b border-black/5 last:border-none transition-colors group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase italic group-hover:text-[#367F4D] transition-colors">{area.name}</p>
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1">
                        {area.administrative_division_level_1_name}, {area.administrative_division_level_2_name}, {area.administrative_division_level_3_name}
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full border border-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                       <CheckCircle2 size={12} className="text-[#367F4D]" />
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* City & Postal Code Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-stone-50/50 border border-dashed border-black/10 rounded-sm">
         <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Kota/Daerah Terpilih</label>
            <div className="h-12 flex items-center px-4 bg-white border border-black/5 font-bold rounded-sm text-slate-900 italic text-sm">
               {value.city || <span className="text-stone-300">Belum dipilih...</span>}
            </div>
         </div>
         <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Kode Pos</label>
            <Input 
              required
              value={value.postalCode}
              onChange={(e) => onChange({ ...value, postalCode: e.target.value })}
              placeholder="12345"
              className="h-12 bg-white border border-black/10 font-bold rounded-sm shadow-sm"
            />
         </div>
      </div>
    </div>
  );
}
