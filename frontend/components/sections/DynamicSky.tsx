"use client";

import React from "react";

export default function DynamicSky() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Tag Style untuk menyuntikkan Keyframes CSS secara instan */}
      <style jsx global>{`
        @keyframes skyCycle {
          0%, 100% { background-position: 0% 0%; }   /* Kondisi Awal */
          25% { background-position: 0% 33%; }  /* Transisi 1 */
          50% { background-position: 0% 66%; }  /* Transisi 2 */
          75% { background-position: 0% 100%; } /* Transisi 3 */
        }
      `}</style>

      {/* Efek gradien bergerak melingkar/linear */}
      <div
        className="absolute inset-0 animate-[skyCycle_30s_ease-in-out_infinite] bg-[length:100%_400%]"
        style={{
          backgroundImage: `linear-gradient(to top, 
            #6c5ac4 35%,   
            #9fcff9 100%
          )`
        }}
      />

      {/* Overlay tipis biar warna langit menyatu lembut dengan foto kopi */}
      <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply" />
    </div>
  );
}