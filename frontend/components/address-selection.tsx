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

    // Ambil panjang karakter patokan secara aman dengan coercion type
    const patokanLength = ((address as any)?.patokan || '').length;

    return (
        <div className="space-y-10">
            {/* Opsi Alamat Tersimpan */}
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
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-[#367F4D]' : 'text-stone-500'}`}>{addr.label || `Alamat ${i + 1}`}</p>
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
                                    <Input required value={shippingData.name} onChange={e => setShippingData({ ...shippingData, name: e.target.value })} className="h-12 bg-stone-50 border-black/5 font-bold rounded-sm px-4 focus:ring-[#367F4D]" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 ml-1">Nomor WhatsApp</label>
                                    <div className="relative">
                                        <Input required value={shippingData.phone} onChange={e => setShippingData({ ...shippingData, phone: e.target.value })} placeholder="08..." className="h-12 bg-stone-50 border-black/5 font-bold rounded-sm px-4 pl-10 focus:ring-[#367F4D]" />
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Address Input Section */}
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

                        {/* 🟢 SEKTOR GRID PECAHAN ALAMAT LOKAL (RT/RW, DUSUN, DESA, PATOKAN) */}
                        <div className="space-y-6 bg-stone-50/50 p-5 border border-black/5 rounded-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                {/* Input 1: RT / RW */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 ml-1">RT / RW</label>
                                    <Input
                                        required
                                        value={(address as any).houseRtRw || ""}
                                        placeholder="Misal: RT 01 / RW 03"
                                        onChange={e => {
                                            const nextValue = { ...address, houseRtRw: e.target.value };
                                            const combined = [e.target.value, (address as any).street, (address as any).village].map(s => s?.trim()).filter(Boolean).join(", ");
                                            setAddress({ ...nextValue, address: combined });
                                        }}
                                        className="h-12 bg-white border-black/10 font-bold rounded-sm px-4"
                                    />
                                </div>

                                {/* Input 2: Blok / Dusun / Kampung / Jalan */}
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 ml-1">Blok / Dusun / Kampung / Jalan</label>
                                    <Input
                                        required
                                        value={(address as any).street || ""}
                                        placeholder="Misal: Dusun Manis Blok Pahing"
                                        onChange={e => {
                                            const nextValue = { ...address, street: e.target.value };
                                            const combined = [(address as any).houseRtRw, e.target.value, (address as any).village].map(s => s?.trim()).filter(Boolean).join(", ");
                                            setAddress({ ...nextValue, address: combined });
                                        }}
                                        className="h-12 bg-white border-black/10 font-bold rounded-sm px-4"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Input 3: Desa / Kelurahan */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-500 ml-1">Desa / Kelurahan</label>
                                    <Input
                                        required
                                        value={(address as any).village || ""}
                                        placeholder="Misal: Gunungsari"
                                        onChange={e => {
                                            const nextValue = { ...address, village: e.target.value };
                                            const combined = [(address as any).houseRtRw, (address as any).street, e.target.value].map(s => s?.trim()).filter(Boolean).join(", ");
                                            setAddress({ ...nextValue, address: combined });
                                        }}
                                        className="h-12 bg-white border-black/10 font-bold rounded-sm px-4"
                                    />
                                </div>

                                {/* Input 4: Patokan Terbatas dengan Live Counter */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-500">Patokan (Opsional)</label>
                                        <span className={`text-[9px] font-bold ${patokanLength >= 100 ? 'text-red-500' : 'text-stone-400'}`}>
                                            {patokanLength}/100
                                        </span>
                                    </div>
                                    <Input
                                        maxLength={100}
                                        value={(address as any).patokan || ""}
                                        placeholder="Misal: Samping Mushola Al-Ikhlas"
                                        onChange={e => setAddress({ ...address, patokan: e.target.value })}
                                        className="h-12 bg-white border-black/10 font-bold rounded-sm px-4"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Komponen Pencarian Kota Resmi */}
                        <div className="pt-4 border-t border-dashed border-black/5">
                            <AddressInput
                                value={address}
                                onChange={(v) => {
                                    setAddress({
                                        ...v,
                                        patokan: v.patokan?.substring(0, 100) || ""
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};