import React from 'react';

interface B2BProgressBarProps {
  currentKg: number;
  targetKg: number;
}

export function B2BProgressBar({ currentKg, targetKg }: B2BProgressBarProps) {
  const percentage = Math.min((currentKg / targetKg) * 100, 100);
  const isEligible = currentKg >= targetKg;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Volume Bulan Ini</h3>
          <p className="text-3xl font-black text-slate-900 mt-1">{currentKg} <span className="text-lg font-medium text-slate-400">/ {targetKg} kg</span></p>
        </div>
        {isEligible && (
          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Target Tercapai
          </span>
        )}
      </div>

      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out rounded-full ${isEligible ? 'bg-[var(--color-fermion-sea-green)]' : 'bg-[var(--color-fermion-french-blue)]'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {!isEligible && (
        <p className="text-sm text-slate-500 mt-4 text-center">
          Kurang <span className="font-bold text-slate-700">{targetKg - currentKg}kg</span> lagi untuk membuka tier Silver bulan depan.
        </p>
      )}
    </div>
  );
}
