"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, ArrowRight, Activity, Globe2, Coffee, Quote } from "lucide-react";
import { Sticker } from "@/components/ui/sticker";
import { FooterV2 } from "@/components/sections/v2/FooterV2";

export default function StoryPageV2() {
  return (
    <div className="bg-[#f8f9fb] min-h-screen relative overflow-hidden font-sans">
      
      {/* Global Aesthetics */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Client%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      <div className="fixed top-[0px] right-[-200px] w-[800px] h-[800px] bg-fermion-wisteria/30 rounded-full blur-[120px] z-[-1] pointer-events-none" />
      <div className="fixed bottom-[-100px] left-[-100px] w-[700px] h-[700px] bg-fermion-horizon/20 rounded-full blur-[120px] z-[-1] pointer-events-none" />

      {/* SECTION 1: THE SCRAPBOOK HERO */}
      <section className="pt-40 pb-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
           
           <div className="flex-1 space-y-10 order-2 lg:order-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-2 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full text-[9px] font-black tracking-[0.4em] text-fermion-french-blue uppercase"
              >
                 The Roastery Mission
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-display font-black tracking-tighter text-slate-900 uppercase italic leading-[0.85]"
              >
                 The Flavor <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-fermion-french-blue to-fermion-lavender font-sans not-italic">Bridge.</span>
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="space-y-6 text-slate-500 font-medium text-lg md:text-xl leading-relaxed max-w-2xl"
              >
                 <p>
                    We exist to connect the hands that grow the coffee to the hands that brew it. Our role is simple but critical: to serve as the flavor bridge between the producer and the coffee drinker.
                 </p>
                 <p>
                    There are good intentions, unique character, and intrinsic values within every single bean. It is our sworn duty to ensure those values remain unbroken from farm to cup.
                 </p>
              </motion.div>
           </div>

           <motion.div 
             initial={{ opacity: 0, scale: 0.9, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: 3 }} transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
             className="w-full lg:w-[500px] relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white/80 backdrop-blur-xl order-1 lg:order-2 group"
           >
              <Image 
                src="https://placehold.co/800x1000/0f172a/ffffff?text=Garage+Days" 
                alt="Fermion Founder" 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <Sticker rotate={-12} className="top-8 left-8" variant="solid" color="var(--cartoon-yellow)">
                 <span className="p-2 text-slate-900">EST. 2018</span>
              </Sticker>
              <Sticker rotate={8} className="bottom-8 right-8" color="var(--cartoon-pink)">
                 Garage Era
              </Sticker>
           </motion.div>

        </div>
      </section>

      {/* SECTION 2: THE PHILOSOPHY (Glass Cards) */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="artisan-glass p-12 md:p-16 rounded-[4rem] space-y-8 group"
              >
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <Globe2 size={28} className="text-emerald-500" />
                 </div>
                 <div>
                    <h3 className="text-[10px] font-black text-fermion-french-blue tracking-[0.4em] uppercase mb-4">01 / THE PRODUCER</h3>
                    <h2 className="text-4xl font-display font-black tracking-tighter text-slate-900 uppercase italic leading-none mb-6">Honoring the <br/> Origin.</h2>
                    <p className="text-slate-500 leading-relaxed font-medium">
                       We source directly from dedicated farmers. Every cherry carries their hard work and a unique terroir that we are sworn to protect and highlight through careful profiling.
                    </p>
                 </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="artisan-glass p-12 md:p-16 rounded-[4rem] space-y-8 group"
              >
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <Activity size={28} className="text-fermion-lavender" />
                 </div>
                 <div>
                    <h3 className="text-[10px] font-black text-fermion-french-blue tracking-[0.4em] uppercase mb-4">02 / THE DRINKER</h3>
                    <h2 className="text-4xl font-display font-black tracking-tighter text-slate-900 uppercase italic leading-none mb-6">Delivering the <br/> Value.</h2>
                    <p className="text-slate-500 leading-relaxed font-medium">
                       Through scientific precision and sensory calibration, we ensure that the original goodness and unique flavor profile reach your morning ritual intact and unbroken.
                    </p>
                 </div>
              </motion.div>

           </div>
        </div>
      </section>

      {/* SECTION 3: ROASTERY GALLERY */}
      <section className="py-32 px-6 relative z-10">
         <div className="max-w-7xl mx-auto space-y-16">
           <div className="text-center">
              <h2 className="text-5xl md:text-6xl font-display font-black tracking-tighter text-slate-900 uppercase italic">Where the magic happens.</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/60 shadow-xl group">
                 <Image src="https://placehold.co/600x800/1e293b/0f172a?text=The+Probat" alt="Roastery equipment" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                 <Sticker rotate={-5} className="bottom-6 left-6" variant="dashed">Machine</Sticker>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/60 shadow-xl mt-12 md:mt-24 group">
                 <Image src="https://placehold.co/600x800/cbd5e1/f8fafc?text=Quality+Check" alt="Quality control" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                 <Sticker rotate={8} className="bottom-6 right-6" variant="solid" color="var(--cartoon-green)"><span className="px-2">QC Pass</span></Sticker>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/60 shadow-xl group">
                 <Image src="https://placehold.co/600x800/f1f5f9/94a3b8?text=Hand+Packing" alt="Hand packaging" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                 <Sticker rotate={-12} className="top-6 left-6" color="var(--cartoon-pink)">Hand Packed</Sticker>
              </motion.div>
           </div>
         </div>
      </section>

      {/* SECTION 4: THE CREED (Footer Quote) */}
      <section className="py-40 px-6 relative z-10 bg-slate-950 mt-20">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fermion-french-blue/20 via-transparent to-transparent opacity-50" />
         <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
            <Quote size={48} className="text-white/20 mx-auto" />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black italic tracking-tighter text-white leading-tight text-balance">
               "Tugas kami adalah sebagai jembatan rasa antara producer dan coffee drinker. Ada hal baik, rasa yang unik dan value yang tidak boleh putus."
            </h2>
            <p className="text-fermion-french-blue text-[10px] font-black tracking-[0.5em] uppercase">
               — The Fermion Manifesto
            </p>
         </div>
      </section>

      <div className="bg-slate-950">
        <FooterV2 />
      </div>
    </div>
  );
}
