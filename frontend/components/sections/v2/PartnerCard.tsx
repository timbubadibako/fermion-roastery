"use client";

import React from "react";

interface PartnerCardProps {
  url: string;
  name: string;
  bgColor?: string;
}

export function PartnerCard({ url, name, bgColor = 'white' }: PartnerCardProps) {
  return (
    <div 
      className="w-56 h-20 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer overflow-hidden transition-all duration-500 hover:scale-105"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full h-full flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-opacity duration-500">
        <img 
          src={url} 
          alt={name} 
          className="h-full w-full object-contain p-1" 
        />
      </div>
    </div>
  );
}
