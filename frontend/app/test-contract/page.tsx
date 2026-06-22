"use client";

import React from "react";

export default function TestContractPage() {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center py-20 px-8 font-mono">
      <div className="bg-white max-w-2xl w-full p-12 shadow-xl border border-stone-200 text-stone-900 text-sm leading-relaxed">
        
        {/* Header */}
        <div className="border-b-2 border-stone-900 pb-6 mb-8 text-center">
          <h1 className="text-4xl font-black tracking-widest mb-2">FERMION.</h1>
          <p className="text-xs tracking-widest text-stone-500">B2B ECOSYSTEM // SYARAT KEMITRAAN V2.0</p>
        </div>

        {/* Info */}
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold underline underline-offset-4 mb-4">PERJANJIAN KERJASAMA: PEMASOK KOPI & LAYANAN</h2>
          <div className="text-xs">
            <p>ID KONTRAK: <span className="font-bold">#CTR-DUMMY123</span></p>
            <p>TANGGAL: <span className="font-bold">{new Date().toLocaleDateString('id-ID')}</span></p>
          </div>
        </div>

        {/* Parties */}
        <div className="mb-8 space-y-4">
          <div>
            <p className="font-bold">ANTARA:</p>
            <p className="ml-4">FERMION ROASTERY (Pihak Pertama)</p>
          </div>
          <div>
            <p className="font-bold">DAN:</p>
            <div className="ml-4">
              <p>PT. CONTOH KAFE SEJAHTERA (Pihak Kedua)</p>
              <p>Perwakilan: Jhon Doe</p>
              <p>Alamat: Jl. Kopi Santai No. 99, Jakarta</p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mb-12 space-y-6">
          <div>
            <h3 className="font-bold mb-2">PASAL 1: KOMITMEN PENGADAAN</h3>
            <ul className="list-none space-y-1 ml-4">
              <li>1.1 Pihak Kedua berkomitmen untuk volume pembelian minimal 20-50KG per bulan.</li>
              <li>1.2 Perjanjian ini berlaku selama periode 6 bulan.</li>
              <li>1.3 Harga Grosir (Grup B2B) otomatis aktif di website setelah kontrak disetujui.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">PASAL 2: LAYANAN & PEMELIHARAAN</h3>
            <ul className="list-none space-y-1 ml-4">
              <li>2.1 Servis mesin espresso & grinder gratis disediakan 2x per periode kontrak.</li>
              <li>2.2 Manfaat servis aktif mulai dari transaksi B2B kedua.</li>
            </ul>
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-16">
          <h3 className="font-bold underline mb-12">TANDA TANGAN:</h3>
          <div className="flex justify-between items-end">
            <div className="text-center">
              <div className="w-48 border-b border-stone-900 mb-2"></div>
              <p>(FERMION ROASTERY)</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b border-stone-900 mb-2"></div>
              <p>(PT. CONTOH KAFE SEJAHTERA)</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
