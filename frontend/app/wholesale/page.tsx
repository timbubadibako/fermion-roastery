"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, TrendingDown, ClipboardCheck, Truck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: <TrendingDown className="w-6 h-6 text-fermion-blue" />,
    title: "Tiered B2B Pricing",
    description: "The more you grow, the less you pay. Dynamic wholesale rates based on your monthly volume commitment."
  },
  {
    icon: <ClipboardCheck className="w-6 h-6 text-fermion-blue" />,
    title: "Automated Invoicing",
    description: "Download tax-ready invoices instantly. No more manual tracking for your accounting team."
  },
  {
    icon: <Truck className="w-6 h-6 text-fermion-blue" />,
    title: "Priority Fulfillment",
    description: "Wholesale partners get first-row access to our roast schedule and faster shipping turnarounds."
  },
  {
    icon: <Zap className="w-6 h-6 text-fermion-blue" />,
    title: "Roast-on-Demand",
    description: "Specify your preferred roast profile for bulk orders to ensure consistency across your menu."
  }
];

export default function WholesalePage() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      {/* Hero Section */}
      <section className="pt-48 pb-32 px-4">
        <div className="max-w-6xl mx-auto px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-fermion-blue tracking-[0.3em] uppercase">Wholesale Program</p>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase italic leading-[0.9]">
                Fuel Your <br/> Business <br/> with Fermion.
              </h1>
            </div>
            <p className="text-lg text-slate-500 max-w-md leading-relaxed font-medium">
              We provide micro-batch precision roasting for high-volume coffee programs. Join our network of quality-focused cafes.
            </p>
            <div className="flex gap-4">
              <Button className="bg-slate-900 text-white font-black tracking-widest px-8 h-14 rounded-2xl hover:bg-fermion-blue transition-all duration-500">
                BECOME A PARTNER
              </Button>
              <Button variant="outline" className="border-slate-200 text-slate-500 font-bold px-8 h-14 rounded-2xl">
                VIEW CATALOG
              </Button>
            </div>
          </div>
          
          <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
            <Image 
              src="https://placehold.co/800x800/7a9cff/ffffff?text=WHOLESALE+ROASTERY" 
              alt="Wholesale Roastery" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/10" />
            {/* Trust Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-[200px] rotate-[-5deg]">
               <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Partner Trust</p>
               <p className="text-2xl font-black tracking-tighter text-slate-900">50+</p>
               <p className="text-[11px] font-bold text-slate-600">Cafes across Indonesia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-32 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-12">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
              Engineered for <br/> Reliable supply.
            </h2>
            <p className="text-slate-500 font-medium">
              From automated tracking to custom roasting, we've built a system that works as hard as your baristas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {benefits.map((benefit, i) => (
              <div key={i} className="group space-y-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 transition-all duration-500 group-hover:bg-fermion-blue group-hover:rotate-6 group-hover:scale-110">
                  {benefit.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-black tracking-widest text-slate-900 uppercase">{benefit.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-40">
        <div className="max-w-6xl mx-auto px-12 flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3 space-y-6">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">How it works.</h2>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">
              Getting premium beans for your shop shouldn't be a hassle. We've simplified the onboarding to 3 easy steps.
            </p>
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { step: "01", title: "Verify Shop", desc: "Search your shop on Google Maps to get instant access." },
               { step: "02", title: "Pick Beans", desc: "Select from our single-origin list or signature blends." },
               { step: "03", title: "Set Schedule", desc: "Choose your weekly supply and let the system handle the rest." }
             ].map((item, i) => (
               <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                  <span className="text-3xl font-black text-slate-100 italic">{item.step}</span>
                  <h3 className="text-sm font-black tracking-widest uppercase">{item.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-40 px-6">
         <div className="max-w-6xl mx-auto bg-fermion-blue rounded-[3rem] p-16 md:p-24 text-center text-white space-y-10 relative overflow-hidden shadow-2xl shadow-fermion-blue/30">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                Ready to brew <br/> happiness?
              </h2>
              <p className="text-white/80 font-bold tracking-widest text-sm uppercase max-w-md mx-auto">
                Join 50+ leading cafes and restaurants already powered by Fermion Roastery.
              </p>
            </div>
            
            <div className="relative z-10 pt-4">
              <Link href="/b2b/register">
                <Button className="bg-white text-fermion-blue font-black tracking-[0.2em] px-12 h-16 rounded-full hover:scale-105 transition-all shadow-xl uppercase">
                  Start Wholesale Now
                </Button>
              </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
