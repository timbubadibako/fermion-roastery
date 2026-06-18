"use client";

import React, { memo } from "react";

export interface PartnerCardProps {
  url: string;
  name: string;
  bgColor?: string;
  imageScale?: number; // Optional prop to manually zoom logos with excessive built-in padding
}

export const PartnerCard = memo(function PartnerCard({ url, name, bgColor = 'white', imageScale = 1 }: PartnerCardProps) {
  return (
    <div 
      className="w-56 h-20 flex items-center justify-center border-2 border-dashed border-black/5 rounded-2xl cursor-pointer overflow-hidden transition-all duration-500 hover:scale-105"
      style={{ backgroundColor: bgColor, willChange: "transform" }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <img 
          src={url} 
          alt={name} 
          className="h-full w-full object-contain p-1" 
          style={{ transform: `scale(${imageScale})` }}
          loading="lazy"
        />
      </div>
    </div>
  );
});
