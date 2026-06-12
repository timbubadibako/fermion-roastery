"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { FermionPlaceholderPanel } from "@/components/ui/fermion-placeholder-panel";

export function WholesaleInvitationSection() {
  return (
    <section className="bg-foreground text-background">
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-fermion-french-blue tracking-[0.4em] uppercase">
                  B2B Partnership
                </p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-[0.85]">
                  Scale Your Coffee Program.
                </h2>
              </div>

              <p className="text-lg font-medium leading-relaxed">
                Access our wholesale platform for tiered pricing, direct sourcing, and custom roast profiles designed for cafes, restaurants, and specialty retailers.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-fermion-french-blue/20 flex items-center justify-center shrink-0">
                    <Zap size={18} className="text-fermion-french-blue" />
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-widest">Minimum 50KG Monthly</p>
                    <p className="text-sm text-background/60 font-medium mt-1">
                      Flexible delivery schedules to suit your operations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-fermion-french-blue/20 flex items-center justify-center shrink-0">
                    <Zap size={18} className="text-fermion-french-blue" />
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-widest">Direct Pricing</p>
                    <p className="text-sm text-background/60 font-medium mt-1">
                      Lock-in rates for 6 months. No broker markups.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-fermion-french-blue/20 flex items-center justify-center shrink-0">
                    <Zap size={18} className="text-fermion-french-blue" />
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-widest">Dedicated Support</p>
                    <p className="text-sm text-background/60 font-medium mt-1">
                      Barista training and custom profile development.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/b2b/register">
                <button className="inline-flex items-center gap-3 px-8 py-4 bg-fermion-french-blue text-white rounded-full font-black tracking-widest text-[10px] uppercase hover:shadow-lg hover:shadow-fermion-french-blue/40 transition-all">
                  Apply for B2B
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>

            {/* Right: Placeholder */}
            <div className="hidden lg:block">
              <FermionPlaceholderPanel
                color="dark"
                text="Wholesale Partnership Image"
                className="aspect-square"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
