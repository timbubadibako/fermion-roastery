"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Sparkles, Coffee, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sticker } from "./sticker";

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
          {/* Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm transition-opacity"
          />

          {/* Ad Popup Poster Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 25, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15, rotate: 2 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="relative w-full max-w-sm sm:max-w-md bg-[#FDFBF7] border border-black/10 shadow-[16px_20px_0px_rgba(0,0,0,0.25)] rounded-2xl overflow-hidden z-10 my-auto"
          >
            {/* Top Tape Accent */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-32 h-6 bg-white/70 border border-black/10 rotate-[-2deg] z-30 backdrop-blur-sm shadow-sm" />

            {/* Floating Sticker */}
            <Sticker rotate={8} className="-top-2 -right-2 z-40 border border-black/10 shadow-md" color="#F1B941">
              DEVELOPMENT PHASE
            </Sticker>

            {/* Close Button "X" */}
            <button
              type="button"
              aria-label="Tutup iklan"
              onClick={handleClose}
              className="absolute top-3 left-3 w-9 h-9 rounded-full bg-stone-900/80 text-white hover:bg-stone-900 hover:scale-110 flex items-center justify-center transition-all z-40 shadow-md border border-white/20"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Poster Header Image Banner */}
            <div className="relative aspect-[16/9] w-full bg-[#1A2B40] overflow-hidden">
              <Image
                src="https://placehold.co/800x450/1a2b40/f1b941?text=FERMION+ROASTERY"
                alt="Fermion Roastery Announcement"
                fill
                className="object-cover filter contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex items-end p-5">
                <div className="flex items-center gap-2 text-white">
                  <Coffee size={18} className="text-[#F1B941]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-200">Official Announcement</span>
                </div>
              </div>
            </div>

            {/* Ad Content */}
            <div className="p-6 sm:p-7 space-y-4 text-stone-900">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#367F4D] text-[10px] font-black uppercase tracking-[0.25em]">
                  <Sparkles size={14} />
                  <span>Platform Notice</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-stone-900 italic leading-tight">
                  Halo Coffee Enthusiast!
                </h3>
              </div>

              <p className="text-xs sm:text-sm font-medium text-stone-600 leading-relaxed">
                Terima kasih telah berkunjung. Situs web <strong>Fermion Roastery</strong> saat ini masih dalam <strong>tahap pengembangan &amp; penyempurnaan sistem</strong>. 
              </p>

              <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-semibold text-amber-900 leading-relaxed">
                ⚡ Fitur keranjang &amp; pembelian online belum dibuka untuk umum saat ini.
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3.5 bg-stone-900 hover:bg-[#367F4D] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group"
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
