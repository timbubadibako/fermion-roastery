"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Check, Loader2, ArrowRight, FlaskConical, Beaker, Sprout, Quote, Microscope, PenTool, Star } from "lucide-react";
import { Sticker } from "@/components/ui/sticker";
import { toast } from "sonner";
import { FooterV2 } from "@/components/sections/v2/FooterV2";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuthStore } from "@/lib/store";
import { AddressInput, AddressValue } from "@/components/address-input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: "The Discovery",
    price: 135000,
    priceLabel: "Rp 135.000",
    desc: "A surprise rotating single-origin bag delivered to your door.",
    color: "bg-[#D88C8C] text-white",
    hoverColor: "hover:bg-[#C27A7A]",
    features: ["Rotating Origins", "Roast Date Guarantee", "Brewing Guide Included"],
    icon: <Sprout size={24} className="text-[#D88C8C] mb-4" />
  },
  {
    name: "Master's Choice",
    price: 285000,
    priceLabel: "Rp 285.000",
    desc: "The Head Roaster's personal selection. Two bags of the absolute best beans in our lab right now.",
    color: "bg-[#2A1619] text-white",
    hoverColor: "hover:bg-black",
    features: ["Double Pack (500g Total)", "Unreleased Micro-lots", "Direct Notes from Roaster", "Free Shipping Included"],
    icon: <Star size={24} className="text-[#F1B941] mb-4" />,
    popular: true
  },
  {
    name: "The Collector",
    price: 450000,
    priceLabel: "Rp 450.000",
    desc: "Extremely limited competition-grade beans and experimental yeast processes.",
    color: "bg-[#5C1B1B] text-white",
    hoverColor: "hover:bg-[#4A1616]",
    features: ["Competition Grade Beans", "Early Access to New Batches", "Premium Packaging"],
    icon: <FlaskConical size={24} className="text-[#D88C8C] mb-4" />
  }
];

export default function SubscriptionPageV2() {
  const { user } = useAuthStore();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [address, setAddress] = useState<AddressValue>({ 
    address: '', 
    city: '', 
    postalCode: '',
    area_id: ''
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const masterRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    let ctx = gsap.context(() => {
      gsap.from(".sub-hero-text", { y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out" });
      gsap.from(".master-polaroid", { x: -100, rotation: -10, opacity: 0, duration: 1.2, ease: "back.out(1.2)", scrollTrigger: { trigger: masterRef.current, start: "top 70%" } });
      gsap.from(".master-quote", { x: 50, opacity: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: masterRef.current, start: "top 70%" } });
      gsap.from(".step-note", { y: 50, rotation: (i) => i % 2 === 0 ? -2 : 2, opacity: 0, stagger: 0.2, duration: 1, ease: "power2.out", scrollTrigger: { trigger: stepsRef.current, start: "top 75%" } });
      gsap.from(".plan-card", { y: 100, rotation: (i) => i === 1 ? 0 : (i === 0 ? -1 : 1), opacity: 0, stagger: 0.2, duration: 1.2, ease: "back.out(1.2)", scrollTrigger: { trigger: pricingRef.current, start: "top 75%" } });
    }, [heroRef, masterRef, stepsRef, pricingRef]);
    return () => ctx.revert();
  }, [mounted]);

  const handleSaveAddress = async () => {
    try {
        const res = await fetch(`/api/auth/profile/${user?.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                address: address.address, 
                city: address.city, 
                postal_code: address.postalCode,
                area_id: address.area_id,
                district: address.district,
                regency: address.regency,
                province: address.province
            })
        });
        if (res.ok) {
            setShowAddressForm(false);
            toast.success("Address saved.");
        } else {
            toast.error("Failed to save address.");
        }
    } catch (e) {
        toast.error("Error saving address.");
    }
  };

  const handleFinalizeSubscribe = async () => {
    if (!selectedPlan) return;
    setLoadingPlan(selectedPlan.name);
    try {
      const res = await fetch("/api/payments/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            amount: selectedPlan.price, 
            planName: selectedPlan.name, 
            interval: 'MONTH', 
            intervalCount: 1,
            shippingAddress: address
        }),
      });
      const data = await res.json();
      if (res.ok && data.invoiceUrl) window.location.href = data.invoiceUrl;
      else { toast.error(data.message || "Error."); setLoadingPlan(null); }
    } catch { toast.error("Error."); setLoadingPlan(null); }
  };

  const handleInitSubscribe = (plan: typeof plans[0]) => {
    if (!user) {
      toast.error("Please login to initialize your ritual.");
      return;
    }
    setSelectedPlan(plan);
  };

  if (!mounted) return null;

  return (
    <div className="bg-[#FAF9F6] min-h-screen relative overflow-hidden font-sans">
      
      {/* Background Aesthetics */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* SECTION 1: HERO (Character: Light Maroon/Rose) */}
      <section ref={heroRef} className="pt-48 pb-24 px-6 relative z-10 text-center bg-[#FDF2F2]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="inline-block px-4 py-1.5 bg-white border border-[#D88C8C]/30 shadow-[4px_4px_0_rgba(216,140,140,0.1)] rotate-[-1deg] text-[10px] font-black tracking-[0.3em] text-[#5C1B1B] uppercase sub-hero-text">
            Exclusive Ritual Club
          </div>
          
          <h1 className="text-7xl md:text-9xl font-cloude tracking-tighter text-[#2A1619] leading-[0.8] sub-hero-text">
            Don't choose. <br /> 
            <span className="font-display italic text-[#D88C8C]">Let the Master decide.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-stone-600 font-medium text-lg md:text-xl leading-relaxed bg-white/40 p-5 border-l-4 border-[#D88C8C]/40 backdrop-blur-sm shadow-sm sub-hero-text">
            Unlock the absolute best of our laboratory. A curated ritual delivered automatically, precisely when your soul needs it most.
          </p>
        </div>
      </section>

      {/* SECTION 2: THE MASTER (Character: Dark Maroon) */}
      <section ref={masterRef} className="py-32 px-6 relative z-20 -mt-20 overflow-hidden bg-[#2A1619] text-white"
        style={{ clipPath: "polygon(0 3%, 10% 0%, 20% 3%, 35% 0%, 50% 3%, 65% 0%, 80% 3%, 90% 0%, 100% 3%, 100% 100%, 0 100%)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24 pt-12">
          <div className="w-full md:w-[45%] master-polaroid relative">
            <div className="bg-white p-4 pb-16 border border-white/10 shadow-[15px_15px_0px_rgba(0,0,0,0.2)] rotate-[-3deg] relative z-20">
               <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 w-24 h-6 bg-[#D88C8C]/40 border border-white/10 rotate-[4deg] z-30 backdrop-blur-sm shadow-sm"></div>
               <div className="relative aspect-[4/5] bg-[#FDF2F2] overflow-hidden border border-black/5">
                  <img src="https://placehold.co/800x1000/2a1619/d88c8c?text=MASTER+ROASTER" alt="Master" className="w-full h-full object-cover filter contrast-125 grayscale" />
               </div>
               <div className="absolute bottom-4 left-6">
                  <p className="font-cloude text-stone-300 text-2xl opacity-40 italic">#LAB-ACCESS</p>
               </div>
            </div>
            <Sticker rotate={12} className="absolute -bottom-6 -right-6 z-30 border border-white/10 shadow-sm" color="#F1B941">SENSORY EXPERT</Sticker>
          </div>

          <div className="w-full md:w-[55%] space-y-10 master-quote">
            <Quote size={60} className="text-[#D88C8C]/10" />
            <h3 className="text-4xl md:text-6xl font-display font-black tracking-tighter italic leading-tight text-[#FDF2F2] relative z-10">
              "I taste over 50 cups a day. The Subscription box is where I put the 2 cups that made me stop and smile."
            </h3>
            <div className="flex items-center gap-6 pt-6 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-widest text-[#D88C8C]">Mr. Yanotama</p>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Head Roaster & Q-Grader</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE FORMULA (Character: Rose Light) */}
      <section ref={stepsRef} className="py-32 px-6 relative z-30 -mt-20 overflow-hidden bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="text-center space-y-4">
             <div className="flex justify-center items-center gap-3 text-[#D88C8C]/60">
                <Microscope size={20} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Ritual Sequence</span>
             </div>
             <h2 className="text-7xl font-cloude tracking-tighter text-[#2A1619] leading-none">The Laboratory Loop.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {[
              { title: "Choose Vibe", desc: "Select the plan that fits your caffeine needs. From discovery to collector." },
              { title: "The Lab Curates", desc: "We pick the best beans roasting that week specifically for you." },
              { title: "Doorstep Magic", desc: "Freshly roasted. Rested precisely. Delivered when it tastes best." }
            ].map((step, i) => (
              <div key={i} className="step-note bg-white p-10 border border-[#D88C8C]/10 shadow-[8px_8px_0px_rgba(216,140,140,0.05)] relative flex flex-col items-center text-center gap-6"
                style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1.5}deg)`, borderRadius: "2px 6px 4px 3px" }}
              >
                <div className="absolute top-[-5px] left-10 w-10 h-3 bg-[#D88C8C]/20 border border-black/5 rotate-[-5deg]"></div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#2A1619] border-b-2 border-[#D88C8C]/30 pb-1">{step.title}</h3>
                <p className="text-xs text-stone-500 font-medium leading-relaxed italic">"{step.desc}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: PRICING (Character: Mixed Scrapbook Maroon) */}
      <section ref={pricingRef} className="py-40 px-6 relative z-40 -mt-20 overflow-hidden bg-[#FAF9F6]"
        style={{ clipPath: "polygon(0 3%, 10% 0%, 20% 3%, 30% 0%, 40% 3%, 50% 0%, 60% 3%, 70% 0%, 80% 3%, 90% 0%, 100% 3%, 100% 100%, 0 100%)" }}
      >
        <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {plans.map((plan, i) => (
            <div key={plan.name} className={`plan-card relative bg-white p-10 border border-black/10 flex flex-col transition-all duration-500 group shadow-[10px_10px_0px_rgba(216,140,140,0.03)] ${plan.popular ? 'border-[#D88C8C]/40 -translate-y-4 lg:z-20' : 'lg:z-10'}`} style={{ transform: `rotate(${i === 1 ? 0 : (i === 0 ? -1 : 1)}deg)` }}>
              <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-20 h-5 bg-[#D88C8C]/20 border border-black/5 rotate-[-2deg] backdrop-blur-sm shadow-sm"></div>
              {plan.popular && <Sticker rotate={-6} className="absolute -top-8 -right-6 z-40 border border-black/5 shadow-sm" color="#F1B941">MASTER'S PICK</Sticker>}
              <div className="flex-1 space-y-8">
                <div className="text-center space-y-4">
                   {plan.icon}
                   <h3 className="text-3xl font-cloude text-[#2A1619]">{plan.name}</h3>
                   <div className="flex items-baseline justify-center gap-1">
                     <span className="text-4xl font-bold text-slate-900 leading-none">{plan.priceLabel}</span>
                     <span className="text-[11px] font-black uppercase text-stone-400">/MO</span>
                   </div>
                </div>
                <svg className="w-12 mx-auto opacity-10" viewBox="0 0 100 10"><path d="M 0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5" stroke="currentColor" fill="transparent" strokeWidth="2" strokeLinecap="round" /></svg>
                <p className="text-sm text-stone-500 font-medium leading-relaxed text-center italic bg-stone-50 p-4 rounded-lg border border-black/5">"{plan.desc}"</p>
                <ul className="space-y-4 pt-4">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-[10px] font-black text-stone-700 uppercase tracking-widest"><Check size={12} strokeWidth={4} className="text-[#D88C8C] mt-0.5" /><span>{f}</span></li>
                  ))}
                </ul>
              </div>
              <button onClick={() => handleInitSubscribe(plan)} className={`mt-10 w-full h-16 rounded-xl font-black tracking-[0.3em] text-[10px] uppercase transition-all duration-300 shadow-sm flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95 ${plan.color} ${plan.hoverColor}`}>
                Initialize Ritual <ArrowRight size={14} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Address Modal/Form Overlay */}
      <AnimatePresence>
        {(showAddressForm || selectedPlan) && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-6"
            >
                <div className="bg-white p-10 border border-black/10 shadow-2xl max-w-lg w-full rounded-sm relative">
                    {/* Tape */}
                    <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-20 h-6 bg-white/60 border border-black/5 rotate-[-2deg] z-20 backdrop-blur-sm shadow-sm"></div>
                    
                    {showAddressForm ? (
                        <div className="space-y-6">
                            <h3 className="text-xl font-cloude">Set Shipping Address</h3>
                            <AddressInput value={address} onChange={setAddress} />
                            <Button onClick={handleSaveAddress} className="w-full rounded-sm font-black uppercase">Confirm Address</Button>
                        </div>
                    ) : selectedPlan && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-cloude">Confirm Subscription</h3>
                            <div className="p-4 bg-stone-50 rounded-sm text-xs space-y-2 border border-black/5">
                                <p>Plan: <strong>{selectedPlan.name}</strong></p>
                                <p>Address: {address.address}, {address.city}</p>
                                <p className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span><del className="mr-2 text-stone-400">Rp 15.000</del> Free</span>
                                </p>
                            </div>
                            <Button 
                                onClick={handleFinalizeSubscribe} 
                                disabled={!!loadingPlan}
                                className="w-full rounded-sm font-black uppercase"
                            >
                                {loadingPlan ? <Loader2 className="animate-spin" /> : "Confirm & Pay"}
                            </Button>
                            <Button variant="ghost" onClick={() => setSelectedPlan(null)} className="w-full">Cancel</Button>
                        </div>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <FooterV2 />
    </div>
  );
}
