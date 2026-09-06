"use client";

import React, { useState, useEffect } from "react";
import { X, ShieldAlert, AlertTriangle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DevNoticeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Cek apakah notifikasi sudah pernah ditutup dalam sesi browser ini
    const isDismissed = sessionStorage.getItem("fermion_dev_notice_dismissed");
    if (isDismissed) return;

    // Delay 3.5 detik sebelum menampilkan popup
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("fermion_dev_notice_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-md transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15, rotate: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg bg-[#FAF9F6] border border-black/15 shadow-[12px_16px_0px_rgba(0,0,0,0.15)] rounded-2xl p-6 sm:p-8 overflow-hidden z-10 my-auto"
          >
            {/* Scrapbook Tape Accent */}
            <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-200/60 border border-black/10 rotate-[-1deg] backdrop-blur-sm z-20 shadow-sm" />

            {/* Close Button X */}
            <button
              type="button"
              aria-label="Tutup pemberitahuan"
              onClick={handleClose}
              className="absolute top-4 right-4 p-2.5 rounded-full text-stone-400 hover:text-stone-950 hover:bg-stone-200/60 transition-colors z-30 focus:outline-none"
            >
              <X size={20} strokeWidth={2.2} />
            </button>

            <div className="space-y-6 text-stone-900 pt-2">
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-black/10 pb-4 pr-8">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <ShieldAlert size={22} strokeWidth={2} />
                </div>
                <div>
                  <div className="inline-block text-[9px] font-black uppercase tracking-[0.25em] text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-sm border border-amber-300/40">
                    Pengumuman Sistem
                  </div>
                  <h3 className="text-base font-display font-black uppercase tracking-tight text-stone-900 mt-0.5">
                    Tahap Pengembangan
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-3.5 text-stone-700">
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  Selamat datang di <strong>Fermion Roastery</strong>. Platform web ini saat ini masih dalam <strong>tahap pengembangan &amp; pengujian sistem</strong>.
                </p>
                <div className="p-4 bg-amber-500/10 border-l-4 border-amber-600 rounded-r-lg text-xs font-semibold text-amber-950 leading-relaxed space-y-1">
                  <p className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider text-amber-800">
                    <AlertTriangle size={14} className="flex-shrink-0" /> Status Pembelian
                  </p>
                  <p>
                    Fitur transaksi dan pembelian produk saat ini <strong>belum dibuka untuk publik</strong>.
                  </p>
                </div>
                <p className="text-[11px] text-stone-500 italic">
                  Untuk informasi lebih lanjut mengenai kemitraan atau katalog produk, silakan jelajahi platform kami.
                </p>
              </div>

              {/* Footer CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-3 bg-stone-900 hover:bg-[#367F4D] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>Saya Mengerti</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
