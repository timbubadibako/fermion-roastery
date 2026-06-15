"use client";

import React from "react";
import { motion } from "framer-motion";

interface StickerProps {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
  color?: string;
  variant?: "dashed" | "solid";
}

export function Sticker({ 
  children, 
  className = "", 
  rotate = 0, 
  color = "white",
  variant = "dashed" 
}: StickerProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.1, 
        rotate: rotate > 0 ? rotate + 5 : rotate - 5,
        y: -5
      }}
      initial={{ rotate }}
      className={`
        absolute z-50 p-1.5 shadow-lg cursor-pointer
        ${className}
      `}
      style={{ 
        backgroundColor: color,
        boxShadow: "4px 4px 0px rgba(0,0,0,0.15)"
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
