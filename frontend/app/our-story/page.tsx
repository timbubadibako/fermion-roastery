"use client";

import React from "react";
import Image from "next/image";

export default function StoryPage() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-32">
      <div className="max-w-6xl mx-auto px-12">
        {/* Hero Narrative */}
        <div className="flex flex-col lg:flex-row gap-20 py-24 items-center">
           <div className="flex-1 space-y-10">
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-fermion-blue tracking-[0.4em] uppercase">The Roastery Story</p>
                 <h1 className="text-6xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                    Artisan Spirit. <br/> Micro Roots.
                 </h1>
              </div>
              <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
                 <p>
                    Fermion Roastery started in a small garage in Cirebon with a single mission: to prove that world-class coffee could be roasted with scientific precision in our local community.
                 </p>
                 <p>
                    We don't just roast coffee; we engineer happiness. Every batch is a result of hundreds of sensory tests, cupping sessions, and obsessive temperature profiling.
                 </p>
              </div>
           </div>
           <div className="w-full lg:w-[450px] relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white rotate-3">
              <Image 
                src="https://placehold.co/800x800/0f172a/ffffff?text=OUR+FOUNDER" 
                alt="Fermion Founder" 
                fill 
                className="object-cover"
              />
           </div>
        </div>

        {/* The Philosophy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-[3rem] overflow-hidden mb-32">
           <div className="bg-white p-16 space-y-6">
              <h3 className="text-[10px] font-black text-fermion-blue tracking-[0.4em] uppercase">01 / THE SCIENCE</h3>
              <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">Precision over <br/> Guesswork.</h2>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                 We use data-driven roasting software and laboratory-grade sensors to track the Maillard reaction and development time to the second.
              </p>
           </div>
           <div className="bg-white p-16 space-y-6">
              <h3 className="text-[10px] font-black text-fermion-blue tracking-[0.4em] uppercase">02 / THE SOURCE</h3>
              <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">Direct to <br/> The Farm.</h2>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                 Our beans are sourced directly from processing pioneers in West Java and Central Java, ensuring farmers get a premium above fair trade.
              </p>
           </div>
        </div>

        {/* The Roastery View */}
        <div className="space-y-12 mb-40 text-center">
           <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">Where the magic happens.</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-sm border border-slate-100">
                 <Image src="https://placehold.co/600x800/7a9cff/ffffff?text=The+Probat" alt="Roastery equipment" fill className="object-cover" />
              </div>
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 mt-12 md:mt-24">
                 <Image src="https://placehold.co/600x800/ffd700/0f172a?text=Quality+Check" alt="Quality control" fill className="object-cover" />
              </div>
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-sm border border-slate-100">
                 <Image src="https://placehold.co/600x800/ff4b4b/ffffff?text=Hand+Packing" alt="Hand packaging" fill className="object-cover" />
              </div>
           </div>
        </div>
      </div>

      {/* Footer Quote */}
      <div className="bg-slate-900 py-32 text-center text-white px-12">
         <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-tight">
               "Good coffee, good mood, good day."
            </h2>
            <p className="text-white/40 text-xs font-bold tracking-[0.4em] uppercase">— THE FERMION CREED</p>
         </div>
      </div>
    </div>
  );
}
