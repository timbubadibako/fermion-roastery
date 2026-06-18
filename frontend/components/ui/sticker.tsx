"use client";

import React from "react";
import { motion } from "framer-motion";

interface StickerProps {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
  color?: string;
  variant?: "dashed" | "solid";
  flat?: boolean;
}

export function Sticker({ 
  children, 
  className = "", 
  rotate = 0, 
  color = "white",
  variant = "dashed",
  flat = false
}: StickerProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05, 
        rotate: rotate > 0 ? rotate + 2 : rotate - 2,
        y: flat ? 0 : -2
      }}
      initial={{ rotate }}
      className={`
        absolute z-50 p-1 shadow-lg cursor-pointer
        ${className}
      `}
      style={{ 
        backgroundColor: color,
        boxShadow: flat 
          ? "2px 2px 5px rgba(0,0,0,0.05)" 
          : "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)"
      }}
    >
      <div className={`
        px-3 py-2 flex items-center justify-center text-center
        ${variant === "dashed" ? "border-2 border-dashed border-black/30" : ""}
      `}>
        <div className="text-[9px] font-black uppercase tracking-wider leading-none text-black">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
