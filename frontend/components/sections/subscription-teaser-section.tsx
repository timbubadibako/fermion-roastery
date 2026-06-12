"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { FermionPlaceholderPanel } from "@/components/ui/fermion-placeholder-panel";

export function SubscriptionTeaserSection() {
  const perks = [
    "Never-ending freshness",
    "Curated by our master roaster",
    "Doorstep delivery",
    "3 tiers to choose from",
  ];

  return (
    <section className="bg-background">
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Placeholder */}
            <div className="hidden lg:block order-2 lg:order-1">
              <FermionPlaceholderPanel
                color="yellow"
                text="Subscription Plans"
                className="aspect-square"
              />
            </div>

            {/* Right: Content */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-fermion-french-blue tracking-[0.4em] uppercase">
                  Freshness Delivered
                </p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase italic">
                  Never Run Out.
                </h2>
              </div>

              <p className="text-lg font-medium leading-relaxed text-muted-foreground">
                Automate your morning ritual with our subscription service. Choose your frequency and let us curate the finest micro-batches for your home or office.
              </p>

              <div className="space-y-3">
                {perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-fermion-french-blue shrink-0" />
                    <p className="font-semibold text-foreground">{perk}</p>
                  </div>
                ))}
              </div>

              <Link href="/subscription">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-fermion-french-blue text-white rounded-full font-black tracking-widest text-[10px] uppercase hover:shadow-lg hover:shadow-fermion-french-blue/40 transition-all">
                  Explore Plans
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
