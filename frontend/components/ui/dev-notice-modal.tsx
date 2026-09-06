"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
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
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container: Swiss Modernist Scrapbook Note */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md bg-[#FFFDF9] border-2 border-stone-900 shadow-[8px_8px_0px_#1c1917] rounded-none p-6 sm:p-8 z-10 my-auto"
          >
            {/* Minimal Close Button */}
            <button
              type="button"
              aria-label="Tutup pemberitahuan"
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border border-stone-300 hover:border-stone-900 hover:bg-stone-100 text-stone-700 hover:text-stone-950 transition-colors"
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            <div className="space-y-5 pt-1">
              {/* Mono Tag Header */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#367F4D] uppercase bg-[#367F4D]/10 px-2 py-0.5 border border-[#367F4D]/20">
                  SYSTEM NOTICE
                </span>
                <span className="text-[10px] font-mono text-stone-400">/ DEV_MODE</span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-sans font-black uppercase tracking-tight text-stone-950 leading-tight">
                Tahap Uji Coba &amp; Pengembangan
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm font-medium text-stone-700 leading-relaxed border-l-2 border-stone-900 pl-4 py-1">
                Platform web <strong>Fermion Roastery</strong> saat ini dalam tahap sistem uji coba internal. Fitur pesanan dan transaksi online <strong>belum diaktifkan untuk publik</strong>.
              </p>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-3 bg-stone-950 hover:bg-[#367F4D] text-white text-[11px] font-mono font-bold uppercase tracking-[0.2em] transition-all shadow-[4px_4px_0px_#78716c] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                >
                  MENGERTI →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
