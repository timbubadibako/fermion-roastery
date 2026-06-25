"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Fermion App Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-slate-50">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
        <AlertTriangle size={40} />
      </div>
      <h2 className="text-4xl font-display font-black text-slate-900 mb-4">
        Oops! Mesin Roasting Sedang Maintenance.
      </h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed text-sm">
        Kami memohon maaf. Terdapat sedikit gangguan teknis pada sistem kami sehingga halaman ini tidak dapat dimuat. Tim teknisi kami sedang memperbaikinya.
      </p>
      
      <div className="flex gap-4">
        <Button 
          onClick={() => window.location.href = '/'}
          variant="outline" 
          className="rounded-full px-8 h-12 uppercase tracking-widest text-xs font-bold"
        >
          Ke Beranda
        </Button>
        <Button 
          onClick={() => reset()}
          className="bg-[#367F4D] text-white rounded-full px-8 h-12 gap-2 uppercase tracking-widest text-xs font-bold hover:bg-[#2d6a41] shadow-lg"
        >
          <RotateCcw size={14} />
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
