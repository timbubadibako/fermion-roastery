"use client";

import Link from "next/link";
import { Coffee, Construction } from "lucide-react";

interface UnderConstructionProps {
  title: string;
}

export function UnderConstruction({ title }: UnderConstructionProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 bg-slate-50">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-fermion-blue/20 blur-3xl rounded-full scale-150"></div>
        <div className="relative bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 animate-bounce">
          <Construction className="w-16 h-16 text-fermion-blue" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-fermion-yellow p-3 rounded-2xl shadow-lg border border-white rotate-12">
          <Coffee className="w-6 h-6 text-slate-900" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
        {title}
      </h1>
      <p className="text-lg text-slate-500 max-w-md mb-8">
        We're currently brewing something special for you. This section is under construction and will be ready soon!
      </p>
      
      <Link 
        href="/"
        className="bg-fermion-blue hover:bg-fermion-blue/90 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-fermion-blue/20 transition-all active:scale-95"
      >
        Back to Home
      </Link>
    </div>
  );
}
