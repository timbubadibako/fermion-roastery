"use client";

import React from "react";
import dynamic from "next/dynamic";
import { HeroV2 } from "@/components/sections/v2/HeroV2";
import { PartnerRibbonV2 } from "@/components/sections/v2/PartnerRibbonV2";

// Dynamic imports for below-the-fold sections
const SeriesV2 = dynamic(() => import("@/components/sections/v2/SeriesV2").then(mod => mod.SeriesV2), { ssr: false });
const TheWayV2 = dynamic(() => import("@/components/sections/v2/TheWayV2").then(mod => mod.TheWayV2), { ssr: false });
const NewReleasesV2 = dynamic(() => import("@/components/sections/v2/RecordsAndShopV2").then(mod => mod.NewReleasesV2), { ssr: false });
const JournalSectionV2 = dynamic(() => import("@/components/sections/v2/JournalSectionV2").then(mod => mod.JournalSectionV2), { ssr: false });
const FAQSection = dynamic(() => import("@/components/sections/v2/FAQSection").then(mod => mod.FAQSection), { ssr: false });
const ContactSection = dynamic(() => import("@/components/sections/v2/ContactSection").then(mod => mod.ContactSection), { ssr: false });
const FooterV2 = dynamic(() => import("@/components/sections/v2/FooterV2").then(mod => mod.FooterV2), { ssr: false });

export default function LandingPageV2() {
  return (
    <main className="relative min-h-screen">
      
      {/* Global Grainy Texture for V2 */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.025]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Client%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Background Ambient Blobs */}
      <div className="fixed top-[-200px] right-[-100px] w-[900px] h-[900px] bg-fermion-wisteria/40 rounded-full blur-[120px] z-[-1]" />
      <div className="fixed bottom-[-100px] left-[-100px] w-[700px] h-[700px] bg-fermion-horizon/30 rounded-full blur-[120px] z-[-1]" />

      {/* Sections */}
      <HeroV2 />
      <PartnerRibbonV2 />
      <SeriesV2 />
      <TheWayV2 />
      <NewReleasesV2 />
      <JournalSectionV2 />
      <FAQSection />
      <ContactSection />
      <FooterV2 />

    </main>
  );
}
