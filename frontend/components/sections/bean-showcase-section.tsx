"use client";

import Link from "next/link";
import { FermionPlaceholderPanel } from "@/components/ui/fermion-placeholder-panel";
import { Coffee } from "lucide-react";

export function BeanShowcaseSection() {
  const beans = [
    {
      name: "Alpine",
      origin: "West Java Highlands",
      profile: "Bright, Citrus, Tea-like",
      price: "$12.99/250g",
      color: "blue" as const,
    },
    {
      name: "Forest",
      origin: "Central Java",
      profile: "Chocolate, Nutty, Full Body",
      price: "$11.99/250g",
      color: "lilac" as const,
    },
    {
      name: "Liberika",
      origin: "Experimental Lot",
      profile: "Bold, Smoky, Rare",
      price: "$16.99/250g",
      color: "coral" as const,
    },
  ];

  return (
    <section className="bg-background">
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-20 space-y-4 text-center">
            <p className="text-[10px] font-black text-fermion-french-blue tracking-[0.4em] uppercase">
              Our Coffee
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-foreground uppercase italic">
              Signature Origins.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
              Each blend represents our commitment to precision roasting and
              direct sourcing from partner farms across Java.
            </p>
          </div>

          {/* Beans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {beans.map((bean) => (
              <Link key={bean.name} href="/our-coffee" className="group">
                <div className="space-y-6">
                  {/* Image Placeholder */}
                  <FermionPlaceholderPanel
                    color={bean.color}
                    text={bean.name}
                    icon={<Coffee className="text-current" />}
                    className="aspect-square group-hover:shadow-lg transition-all duration-300"
                  />

                  {/* Details */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-black tracking-tighter text-foreground uppercase italic">
                        {bean.name}
                      </h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">
                        {bean.origin}
                      </p>
                    </div>

                    <p className="text-sm font-medium text-muted-foreground">
                      {bean.profile}
                    </p>

                    <p className="text-lg font-black text-fermion-french-blue">
                      {bean.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/our-coffee"
              className="inline-flex items-center gap-2 px-8 py-4 bg-fermion-french-blue text-white rounded-full font-black tracking-widest text-[10px] uppercase hover:shadow-lg hover:shadow-fermion-french-blue/40 transition-all"
            >
              Browse All Coffee
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
