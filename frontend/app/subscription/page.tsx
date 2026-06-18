"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, Loader2, ArrowRight, FlaskConical, Sprout, Quote, Microscope, Star } from "lucide-react";
import { Sticker } from "@/components/ui/sticker";
import { toast } from "sonner";
import { FooterV2 } from "@/components/sections/v2/FooterV2";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// Visual Mapping (untuk mengembalikan styling lama)
const planVisuals: any = {
  "The Discovery": { icon: <Sprout size={24} className="text-[#F1B941] mb-4" />, color: "bg-[#F1B941] text-white", hoverColor: "hover:bg-[#D9A539]", popular: false },
  "Master's Choice": { icon: <Star size={24} className="text-[#F1B941] mb-4" />, color: "bg-[#7C2D12] text-white", hoverColor: "hover:bg-[#431407]", popular: true },
  "The Collector": { icon: <FlaskConical size={24} className="text-[#F1B941] mb-4" />, color: "bg-[#7C2D12] text-white", hoverColor: "hover:bg-[#431407]", popular: false }
};

export default function SubscriptionPageV2() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);

  console.log("SubscriptionPageV2 Render - plans:", plans);

  const heroRef = useRef<HTMLElement>(null);
  const masterRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);

  useEffect(() => { 
    setMounted(true); 
    fetch('/api/subscription/plans')
      .then(res => res.json())
      .then(data => {
        console.log("DEBUG: Subscription Plans API response:", data);
        setPlans(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    let ctx: gsap.Context;

    const runAnimations = () => {
      ctx = gsap.context(() => {
        const heroText = gsap.utils.toArray(".sub-hero-text");
        if (heroText.length > 0) {
          gsap.from(heroText, { y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out" });
        }

        if (masterRef.current) {
          const polaroid = gsap.utils.toArray(".master-polaroid", masterRef.current);
          if (polaroid.length > 0) {
            gsap.from(polaroid, { x: -100, rotation: -10, opacity: 0, duration: 1.2, ease: "back.out(1.2)", scrollTrigger: { trigger: masterRef.current, start: "top 70%" } });
          }
          const quote = gsap.utils.toArray(".master-quote", masterRef.current);
          if (quote.length > 0) {
            gsap.from(quote, { x: 50, opacity: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: masterRef.current, start: "top 70%" } });
          }
        }

        if (stepsRef.current) {
          const steps = gsap.utils.toArray(".step-note", stepsRef.current);
          if (steps.length > 0) {
            gsap.from(steps, { y: 50, rotation: (i) => i % 2 === 0 ? -2 : 2, opacity: 0, stagger: 0.2, duration: 1, ease: "power2.out", scrollTrigger: { trigger: stepsRef.current, start: "top 75%" } });
          }
        }

        if (pricingRef.current && plans.length > 0) {
          // Temporarily removed GSAP animation for plan-card to isolate rendering issue
          console.log("Pricing cards are rendered via React, skipping GSAP animation for now");
        }
        ScrollTrigger.refresh();
      });
    };

    const timer = setTimeout(runAnimations, 50);
    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [mounted, plans]);

  const handleInitSubscribe = (plan: any) => {
    if (!user) {
      toast.error("Silakan masuk terlebih dahulu untuk memulai langganan.");
      router.push("/auth?redirect=/subscription");
      return;
    }
    
    localStorage.setItem('selectedSubscriptionPlan', JSON.stringify({
      id: plan.id, // Store id
      name: plan.name,
      price: plan.price,
      priceLabel: `Rp ${Number(plan.price).toLocaleString('id-ID')}`
    }));
    
    router.push("/subscription/checkout");
  };

  if (!mounted) return null;

  return (
    <div className="bg-[#FAF9F6] min-h-screen relative overflow-hidden font-sans">
      
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <section ref={heroRef} className="pt-48 pb-24 px-6 relative z-10 text-center bg-[#FFFBEB]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="inline-block px-4 py-1.5 bg-white border border-[#F1B941]/30 shadow-[4px_4px_0_rgba(241,185,65,0.1)] rotate-[-1deg] text-[10px] font-black tracking-[0.3em] text-[#92400E] uppercase sub-hero-text">
            Exclusive Subscription Club
          </div>
          
          <h1 className="text-7xl md:text-9xl font-cloude tracking-tighter text-[#2A1619] leading-[0.8] sub-hero-text">
            Don't choose. <br /> 
            <span className="font-display italic text-[#F1B941]">Let the Master decide.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-stone-600 font-medium text-lg md:text-xl leading-relaxed bg-white/40 p-5 border-l-4 border-[#F1B941]/40 backdrop-blur-sm shadow-sm sub-hero-text">
            Unlock the absolute best of our laboratory. A curated selection delivered automatically, precisely when your soul needs it most.
          </p>
        </div>
      </section>

      <section ref={masterRef} className="py-32 px-6 relative z-20 -mt-20 overflow-hidden bg-[#7C2D12] text-white section-clip-path"
      >
        <style jsx>{`
          .section-clip-path {
            clip-path: none;
          }
          @media (min-width: 768px) {
            .section-clip-path {
              clip-path: polygon(0 3%, 10% 0%, 20% 3%, 35% 0%, 50% 3%, 65% 0%, 80% 3%, 90% 0%, 100% 3%, 100% 100%, 0 100%);
            }
          }
        `}</style>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24 pt-12">
          <div className="w-full md:w-[45%] master-polaroid relative">
            <div className="bg-white p-4 pb-16 border border-white/10 shadow-[15px_15px_0px_rgba(0,0,0,0.2)] rotate-[-3deg] relative z-20">
               <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 w-24 h-6 bg-[#F1B941]/40 border border-white/10 rotate-[4deg] z-30 backdrop-blur-sm shadow-sm"></div>
               <div className="relative aspect-[4/5] bg-[#FFFBEB] overflow-hidden border border-black/5">
                  <img src="https://placehold.co/800x1000/7c2d12/f1b941?text=MASTER+ROASTER" alt="Master" className="w-full h-full object-cover filter contrast-125 grayscale" />
               </div>
               <div className="absolute bottom-4 left-6">
                  <p className="font-cloude text-stone-300 text-2xl opacity-40 italic">#LAB-ACCESS</p>
               </div>
            </div>
            <Sticker rotate={12} className="absolute -bottom-6 -right-6 z-30 border border-white/10 shadow-sm" color="#F1B941">SENSORY EXPERT</Sticker>
          </div>

          <div className="w-full md:w-[55%] space-y-10 master-quote">
            <Quote size={60} className="text-[#F1B941]/10" />
            <h3 className="text-4xl md:text-6xl font-display font-black tracking-tighter italic leading-tight text-[#FFFBEB] relative z-10">
              "I taste over 50 cups a day. The Subscription box is where I put the 2 cups that made me stop and smile."
            </h3>
            <div className="flex items-center gap-6 pt-6 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-widest text-[#F1B941]">Mr. Yanotama</p>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Head Roaster & Q-Grader</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={stepsRef} className="py-32 px-6 relative z-30 -mt-20 overflow-hidden bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="text-center space-y-4">
             <div className="flex justify-center items-center gap-3 text-[#F1B941]/60">
                <Microscope size={20} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Subscription Steps</span>
             </div>
             <h2 className="text-7xl font-cloude tracking-tighter text-[#2A1619] leading-none">The Laboratory Loop.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {[
              { title: "Choose Vibe", desc: "Select the plan that fits your caffeine needs. From discovery to collector." },
              { title: "The Lab Curates", desc: "We pick the best beans roasting that week specifically for you." },
              { title: "Doorstep Magic", desc: "Freshly roasted. Rested precisely. Delivered when it tastes best." }
            ].map((step, i) => (
              <div key={i} className="step-note bg-white p-10 border border-black/10 shadow-lg shadow-black/5 relative flex flex-col items-center text-center gap-6"
                style={{ transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)`, borderRadius: "2px" }}
              >
                <div className="absolute top-[-5px] left-10 w-10 h-3 bg-[#F1B941]/30 border border-black/10 rotate-[-5deg]"></div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#2A1619] border-b-2 border-[#F1B941] pb-1">{step.title}</h3>
                <p className="text-xs text-stone-700 font-medium leading-relaxed italic">"{step.desc}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={pricingRef} className="pt-8 pb-16 px-6 relative z-40 overflow-hidden bg-[#FAF9F6]"
        style={{ clipPath: "polygon(0 3%, 10% 0%, 20% 3%, 30% 0%, 40% 3%, 50% 0%, 60% 3%, 70% 0%, 80% 3%, 90% 0%, 100% 3%, 100% 100%, 0 100%)" }}
      >
        <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 min-h-[400px]">
          {plans.map((plan, i) => {
            // Robust lookup with fallback
            const visual = planVisuals[plan.name] || { 
              icon: <Sprout size={24} className="text-[#F1B941] mb-4"/>, 
              color: "bg-stone-900 text-white", 
              hoverColor: "hover:bg-black", 
              popular: false 
            };
            return (
                <div key={plan.id} className={`plan-card relative bg-white p-10 border border-black/10 flex flex-col transition-all duration-500 group shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-2 ${visual.popular ? 'border-[#F1B941]/40 -translate-y-4 lg:z-20' : 'lg:z-10'}`}>
                  <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-20 h-5 bg-[#F1B941]/30 border border-black/10 backdrop-blur-sm shadow-sm"></div>
                  {visual.popular && <Sticker rotate={0} className="absolute -top-8 -right-4 z-40 border border-black/10 shadow-md" color="#F1B941">MASTER'S PICK</Sticker>}
                  <div className="flex-1 space-y-8">
                    <div className="text-center space-y-4">
                       {visual.icon}
                       <h3 className="text-3xl font-cloude text-[#2A1619]">{plan.name}</h3>
                       <div className="flex items-baseline justify-center gap-1">
                         <span className="text-4xl font-bold text-slate-950 leading-none">Rp {Number(plan.price).toLocaleString('id-ID')}</span>
                         <span className="text-[11px] font-black uppercase text-stone-500">/Bln</span>
                       </div>
                    </div>
                    <svg className="w-12 mx-auto opacity-20" viewBox="0 0 100 10"><path d="M 0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5" stroke="currentColor" fill="transparent" strokeWidth="2" strokeLinecap="round" /></svg>
                    <p className="text-sm text-stone-700 font-medium leading-relaxed text-center italic bg-stone-100 p-4 rounded-sm border border-black/5">"{plan.description}"</p>
                    <ul className="space-y-4 pt-4">
                      {Array.isArray(plan.features) && plan.features.map((f: string) => (
                        <li key={f} className="flex items-start gap-3 text-[10px] font-black text-stone-900 uppercase tracking-widest"><Check size={12} strokeWidth={4} className="text-[#F1B941] mt-0.5" /><span>{f}</span></li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => handleInitSubscribe(plan)} className={`mt-10 w-full h-16 font-black tracking-[0.3em] text-[10px] uppercase transition-all duration-300 shadow-lg flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95 ${visual.color} ${visual.hoverColor}`}>
                    Mulai Langganan <ArrowRight size={14} strokeWidth={3} />
                  </button>
                </div>
            );
          })}
        </div>
      </section>

      <FooterV2 />
    </div>
  );
}
