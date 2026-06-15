"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "./button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "info";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "info"
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[3rem] w-full max-w-md p-10 space-y-8 shadow-2xl relative overflow-hidden text-left"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-periwinkle'}`}>
                  {variant === 'danger' ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                </div>
                <h2 className="display-font text-3xl italic font-black text-slate-950 leading-none">{title}</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              {description}
            </p>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border-slate-100"
              >
                {cancelText}
              </Button>
              <Button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest italic text-[10px] shadow-xl transition-all ${
                  variant === 'danger' 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                    : 'bg-slate-950 hover:bg-periwinkle text-white shadow-slate-950/20'
                }`}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
