"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Calendar, Package, Sparkles, Loader2, ArrowRight, FlaskConical, Beaker, Sprout, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sticker } from "@/components/ui/sticker";
import { toast } from "sonner";
import { FooterV2 } from "@/components/sections/v2/FooterV2";

const plans = [
  {
    name: "The Discovery",
    price: 135000,
    priceLabel: "Rp 135.000",
    desc: "A surprise rotating single-origin bag delivered to your door.",
    color: "bg-fermion-french-blue text-white",
    hoverColor: "hover:bg-blue-600",
    features: ["Rotating Origins", "Roast Date Guarantee", "Brewing Guide Included"],
    icon: <Sprout size={24} className="text-slate-400 mb-6" />
  },
  {
    name: "Master's Choice", // Renamed and elevated
    price: 285000,
    priceLabel: "Rp 285.000",
    desc: "The Head Roaster's personal selection. Two bags of the absolute best beans in our lab right now.",
    color: "bg-slate-900 text-white",
    hoverColor: "hover:bg-slate-800",
    features: ["Double Pack (500g Total)", "Unreleased Micro-lots", "Direct Notes from Roaster", "Free Shipping Included"],
    icon: <Beaker size={24} className="text-slate-400 mb-6" />,
    popular: true
  },
  {
    name: "The Collector",
    price: 450000,
    priceLabel: "Rp 450.000",
    desc: "Extremely limited competition-grade beans and experimental yeast processes.",
    color: "bg-amber-500 text-white",
    hoverColor: "hover:bg-amber-600",
    features: ["Competition Grade Beans", "Early Access to New Batches", "Premium Packaging"],
    icon: <FlaskConical size={24} className="text-slate-400 mb-6" />
  }
];

export default function SubscriptionPageV2() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubscribe = async (plan: typeof plans[0]) => {
    setLoadingPlan(plan.name);
    try {
      const customerDetails = { email: "subscriber@example.com" };

      const res = await fetch("/api/payments/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.price,
          planName: plan.name,
          customerDetails,
          interval: 'MONTH',
          intervalCount: 1
        }),
      });

      const data = await res.json();

      if (res.ok && data.invoiceUrl) {
        toast.success("Redirecting to secure payment gateway...");
        window.location.href = data.invoiceUrl;
      } else {
        toast.error(data.message || "Failed to initialize subscription.");
        setLoadingPlan(null);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Network error during subscription setup.");
      setLoadingPlan(null);
    }
  };

  return (
    <div className="bg-[#f8f9fb] min-h-screen relative overflow-hidden font-sans">

      {/* Global Aesthetics */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Client%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      <div className="fixed top-[-200px] left-[-100px] w-[900px] h-[900px] bg-fermion-wisteria/30 rounded-full blur-[120px] z-[-1] pointer-events-none" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[700px] h-[700px] bg-fermion-horizon/20 rounded-full blur-[120px] z-[-1] pointer-events-none" />

      {/* SECTION 1: HERO NARRATIVE */}
      <section className="pt-40 pb-20 px-6 relative z-10 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full text-[9px] font-black tracking-[0.4em] text-fermion-lavender uppercase"
          >
            Fermion Subscriptions
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-black tracking-tighter text-slate-900 uppercase italic leading-[0.85]"
          >
            Don't choose. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-fermion-lavender to-fermion-horizon font-sans not-italic">Let the Master decide.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-slate-500 font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Stop worrying about running out of coffee. Join our exclusive club and get the absolute best of our laboratory delivered to your doorstep, automatically.
          </motion.p>
        </div>
      </section>

      {/* SECTION 2: THE MASTER ROASTER NARRATIVE */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto bg-slate-950 rounded-[4rem] border border-slate-800 p-8 md:p-16 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-fermion-french-blue/20 via-transparent to-transparent opacity-50" />

          {/* Visual */}
          <div className="w-full md:w-[45%] relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-slate-800">
            <Image
              src="https://placehold.co/800x1000/1e293b/0f172a?text=Master+Roaster"
              alt="Head Roaster"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <Sticker rotate={12} className="bottom-8 left-8" variant="dashed" color="var(--cartoon-yellow)">
              <span className="p-2 block">HEAD<br />ROASTER</span>
            </Sticker>
          </div>

          {/* Narrative */}
          <div className="w-full md:w-[55%] space-y-8 relative z-10 text-white">
            <Quote size={40} className="text-fermion-french-blue/50" />
            <h3 className="text-4xl md:text-5xl font-display font-black tracking-tighter italic leading-tight">
              "I taste over 50 cups a day. The Subscription box is where I put the 2 cups that made me stop and smile."
            </h3>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-fermion-french-blue">Mr. Yanotama</p>
              <p className="text-xs text-slate-400 font-medium">Head Roaster & Q-Grader, Fermion</p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-800">
              <div>
                <p className="text-3xl font-black italic">100%</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Quality Control</p>
              </div>
              <div>
                <p className="text-3xl font-black italic text-emerald-400">Exclusive</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Unreleased Batches</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black italic tracking-tighter text-slate-900">The Formula.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Calendar size={24} className="text-fermion-french-blue" />, title: "1. Choose Your Vibe", desc: "Select the plan that fits your caffeine needs. From casual discovery to hardcore collector." },
              { icon: <Sparkles size={24} className="text-fermion-lavender" />, title: "2. The Lab Curates", desc: "Arif and the team will pick the best beans roasting that week specifically for you." },
              { icon: <Package size={24} className="text-emerald-500" />, title: "3. Doorstep Magic", desc: "Freshly roasted. Rested precisely. Delivered to you right when it tastes best." }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/60 shadow-xl flex flex-col items-center text-center space-y-6 group hover:bg-white/60 transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: PRICING FORMULAS */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 200, damping: 20 }}
                className={`relative bg-white/60 backdrop-blur-3xl rounded-[3rem] p-10 border flex flex-col transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl ${plan.popular ? 'border-fermion-french-blue shadow-xl shadow-fermion-french-blue/10 scale-105 lg:z-20 bg-white/90' : 'border-white/60 shadow-lg lg:z-10'}`}
              >
                {plan.popular && (
                  <Sticker rotate={-6} className="-top-4 -right-4" color="var(--cartoon-pink)" variant="solid">
                    MASTER'S PICK
                  </Sticker>
                )}

                <div className="flex-1 space-y-8">
                  <div className="text-center border-b border-slate-100 pb-8 relative">
                    {plan.icon}
                    <h3 className="text-3xl font-black tracking-tighter uppercase italic text-slate-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-display font-black italic text-slate-900 leading-none">{plan.priceLabel}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">/mo</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 font-medium leading-relaxed text-center italic">
                    "{plan.desc}"
                  </p>

                  <ul className="space-y-4 pt-4">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-3 text-[11px] font-bold text-slate-700 uppercase tracking-widest leading-snug">
                        <Check size={16} strokeWidth={3} className="text-fermion-french-blue shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPlan === plan.name}
                  className={`mt-10 w-full h-16 rounded-[2rem] font-black tracking-[0.2em] text-[10px] uppercase transition-all duration-500 shadow-xl flex items-center justify-center gap-2 ${plan.color} ${plan.hoverColor}`}
                >
                  {loadingPlan === plan.name ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>Subscribe <ArrowRight size={14} /></>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FooterV2 />
    </div>
  );
}
