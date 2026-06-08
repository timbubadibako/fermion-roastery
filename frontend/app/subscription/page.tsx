"use client";

import React, { useState } from "react";
import { Check, Calendar, Package, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const plans = [
  {
    name: "The Discovery",
    price: 135000,
    priceLabel: "Rp 135.000",
    desc: "A surprise rotating single-origin bag delivered to your door.",
    color: "bg-fermion-blue",
    features: ["Rotating Origins", "Roast Date Guarantee", "Brewing Guide Included"]
  },
  {
    name: "The Signature",
    price: 245000,
    priceLabel: "Rp 245.000",
    desc: "Two bags of our house blends. Perfect for daily espresso lovers.",
    color: "bg-slate-900",
    features: ["Double Pack (500g Total)", "Consistent Profile", "Free Shipping Included"]
  },
  {
    name: "The Collector",
    price: 320000,
    priceLabel: "Rp 320.000",
    desc: "Our most exclusive micro-batches and limited yeast processes.",
    color: "bg-fermion-red",
    features: ["Exclusive Micro-lots", "Early Access to New Batches", "Premium Packaging"]
  }
];

export default function SubscriptionPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (plan: typeof plans[0]) => {
    setLoadingPlan(plan.name);
    try {
      const customerDetails = { email: "subscriber@example.com" }; // Fetch from auth state in real app

      const res = await fetch("http://localhost:3001/api/payments/subscription", {
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
    <div className="bg-[#FDFBF7] min-h-screen pt-32 pb-40">
      <div className="max-w-6xl mx-auto px-12">
        {/* Hero */}
        <div className="text-center space-y-6 mb-24">
           <p className="text-[10px] font-black text-fermion-blue tracking-[0.4em] uppercase">Never Run Out</p>
           <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase italic">
              Freshness, <br/> Delivered Daily.
           </h1>
           <p className="text-slate-500 font-medium max-w-xl mx-auto">
              Automate your morning ritual. Choose your frequency and let us curate the finest micro-batches for your home or office.
           </p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 border-y border-slate-100 py-16">
           <div className="flex flex-col items-center text-center space-y-4">
              <Calendar className="w-10 h-10 text-slate-300" />
              <h3 className="text-xs font-black tracking-widest uppercase">Choose Frequency</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Weekly, bi-weekly, or monthly delivery schedules.</p>
           </div>
           <div className="flex flex-col items-center text-center space-y-4 border-x border-slate-100 px-8">
              <Sparkles className="w-10 h-10 text-slate-300" />
              <h3 className="text-xs font-black tracking-widest uppercase">We Curate</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Our master roaster picks the peak-freshness batch for you.</p>
           </div>
           <div className="flex flex-col items-center text-center space-y-4">
              <Package className="w-10 h-10 text-slate-300" />
              <h3 className="text-xs font-black tracking-widest uppercase">Doorstep Delivery</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Enjoy premium coffee without the hassle of re-ordering.</p>
           </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {plans.map((plan) => (
             <div key={plan.name} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black tracking-tighter uppercase italic">{plan.name}</h3>
                    <p className="text-2xl font-mono font-bold text-slate-800">{plan.priceLabel}<span className="text-xs text-slate-400 font-sans tracking-normal">/month</span></p>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{plan.desc}</p>
                  <ul className="space-y-4 pt-4">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        <Check size={14} className="text-fermion-blue" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPlan === plan.name}
                  className={`mt-10 w-full h-14 rounded-2xl font-black tracking-widest text-[10px] uppercase transition-all duration-500 ${plan.color} text-white group-hover:scale-[1.02]`}
                >
                   {loadingPlan === plan.name ? <Loader2 className="animate-spin" /> : "Subscribe Now"}
                </Button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

