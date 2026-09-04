"use client";

import React, { memo } from "react";

import Image from "next/image";

export interface PartnerCardProps {
  url: string;
  name: string;
  bgColor?: string;
  imageScale?: number; // Optional prop to manually zoom logos with excessive built-in padding
}

export const PartnerCard = memo(function PartnerCard({ url, name, bgColor = 'white', imageScale = 1 }: PartnerCardProps) {
  return (
    <div 
      className="w-[220px] h-[80px] md:w-[260px] md:h-[100px] flex items-center justify-center border border-black/10 rounded-none cursor-pointer overflow-hidden transition-all duration-300 -mr-px hover:-translate-y-1.5 hover:z-30 hover:shadow-md hover:border-black/20 group shrink-0 relative"
      style={{ backgroundColor: bgColor, willChange: "transform" }}
    >
      <div className="w-full h-full flex items-center justify-center relative p-3 md:p-4">
        <Image 
          src={url} 
          alt={name} 
          fill
          sizes="(max-width: 768px) 220px, 280px"
          className="object-contain p-2 opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
          style={{ transform: `scale(${imageScale})` }}
        />
      </div>
    </div>
  );
});
