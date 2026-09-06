"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DevNoticeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("fermion_dev_notice_dismissed");
    if (isDismissed) return;

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
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-md transition-opacity"
          />

          {/* Premium Roastery Announcement Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-[#FDFBF7] border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl p-6 sm:p-8 overflow-hidden z-10 my-auto"
          >
            {/* Scrapbook Tape Accent */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-28 h-5 bg-white/80 border border-black/5 rotate-[-1deg] backdrop-blur-sm shadow-sm" />

            {/* Close Button X */}
            <button
              type="button"
              aria-label="Tutup pengumuman"
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-950 flex items-center justify-center transition-all z-30 focus:outline-none"
            >
              <X size={16} strokeWidth={2.2} />
            </button>

            <div className="space-y-6 pt-2">
              {/* Logo & Tag */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Image
                    src="/fermion-logo.png"
                    alt="Fermion Roastery"
                    width={90}
                    height={36}
                    style={{ width: "auto", height: "auto" }}
                    className="h-7 w-auto object-contain"
                  />
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#367F4D]/10 border border-[#367F4D]/20 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-[#367F4D]">
                    <Sparkles size={11} />
                    <span>Uji Coba System</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-stone-900 leading-tight">
                  Tahap Pengembangan
                </h3>
              </div>

              {/* Message */}
              <div className="space-y-3 text-stone-600 font-medium text-xs sm:text-sm leading-relaxed border-l-2 border-[#367F4D]/40 pl-4 py-1">
                <p>
                  Selamat datang di situs <strong>Fermion Roastery</strong>. Platform digital kami saat ini masih dalam <strong>tahap pengembangan &amp; pengujian sistem</strong>.
                </p>
                <p className="text-stone-500 italic text-[11px] sm:text-xs">
                  Mohon maaf, fitur pesanan dan transaksi pembayaran online belum dibuka untuk umum saat ini.
                </p>
              </div>

              {/* Footer CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3.5 bg-stone-900 hover:bg-[#367F4D] text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>Lanjut Jelajahi Web</span>
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
