"use client";

import React from "react";

interface PlasterTapeProps {
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  rotate?: number;
  pattern?: "dots" | "cross" | "stripes";
  color?: string;
}

/**
 * High-Craft Patterned Plaster Tape (Plester Luka Motif/Band-Aid)
 * Replaces plain clear tape with an authentic textured, perforated child plaster tape look.
 */
export function PlasterTape({
  className = "",
  style = {},
  width = 72,
  height = 24,
  rotate = -3,
  pattern = "dots",
  color = "#E5C8A6"
}: PlasterTapeProps) {
  return (
    <div
      className={`select-none pointer-events-none drop-shadow-sm ${className}`}
      style={{
        width,
        height,
        ...style
      }}
    >
      <div 
        className="w-full h-full"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <svg
          viewBox="0 0 120 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Perforated Dot Grid Pattern */}
            <pattern id="plaster-dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="1" fill="#000000" fillOpacity="0.12" />
            </pattern>

            {/* Crosshatch Pattern */}
            <pattern id="plaster-cross" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M0 5H10M5 0V10" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.1" />
              <circle cx="5" cy="5" r="1.2" fill="#367F4D" fillOpacity="0.2" />
            </pattern>

            {/* Striped Pattern */}
            <pattern id="plaster-stripes" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M0 8L8 0M-2 2L2 -2M6 10L10 6" stroke="#000000" strokeWidth="1.2" strokeOpacity="0.08" />
            </pattern>

            {/* Soft Inner Shadow Filter */}
            <filter id="plaster-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Outer Serrated Plaster Body */}
          <path
            d="M 6,2 
               L 114,2 
               C 117,2 118,4 118,7 
               L 118,33 
               C 118,36 117,38 114,38 
               L 6,38 
               C 3,38 2,36 2,33 
               L 2,7 
               C 2,4 3,2 6,2 Z"
            fill={color}
            filter="url(#plaster-shadow)"
          />

          {/* Serrated Cut Edges (Left & Right Ends) */}
          <path
            d="M 2,7 L 0,10 L 3,13 L 0,16 L 3,19 L 0,22 L 3,25 L 0,28 L 3,31 L 2,33 Z"
            fill="#D6B48E"
            fillOpacity="0.5"
          />
          <path
            d="M 118,7 L 120,10 L 117,13 L 120,16 L 117,19 L 120,22 L 117,25 L 120,28 L 117,31 L 118,33 Z"
            fill="#D6B48E"
            fillOpacity="0.5"
          />

          {/* Pattern Overlay */}
          <rect
            x="4"
            y="4"
            width="112"
            height="32"
            rx="2"
            fill={`url(#plaster-${pattern})`}
          />

          {/* Center Plaster Pad Box Accent (Medical Band-Aid Pad) */}
          <rect
            x="42"
            y="5"
            width="36"
            height="30"
            rx="1"
            fill="#FFFFFF"
            fillOpacity="0.25"
            stroke="#000000"
            strokeWidth="0.5"
            strokeOpacity="0.08"
            strokeDasharray="2 2"
          />
        </svg>
      </div>
    </div>
  );
}
