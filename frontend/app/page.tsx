import React from "react";
import { Hero } from "@/components/sections/landing/Hero";
import { PartnerRibbon } from "@/components/sections/landing/PartnerRibbon";
import { Series } from "@/components/sections/landing/Series";
import { TheWay } from "@/components/sections/landing/TheWay";
import { NewReleases } from "@/components/sections/landing/NewReleases";
import { WholesaleCTASection } from "@/components/sections/landing/WholesaleCTASection";
import { JournalSection } from "@/components/sections/landing/JournalSection";
import { FAQSection } from "@/components/sections/landing/FAQSection";
import { ContactSection } from "@/components/sections/landing/ContactSection";
import { Footer } from "@/components/sections/Footer";
import { getServerApiBaseUrl } from "@/lib/server-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface LandingProduct {
  id: string;
  image_url?: string | null;
  name: string;
  origin?: string | null;
  category?: string | null;
  notes?: string | null;
  price_retail?: number | null;
  is_new_release?: boolean;
}

interface LandingJournalPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featured_image: string;
  published_at: string;
  created_at?: string;
}

interface LandingFaq {
  id: string;
  question_id: string;
  answer_id: string;
  question_en: string;
  answer_en: string;
}

async function fetchJson<T>(apiBaseUrl: string, path: string): Promise<T | null> {
  try {
    const res = await fetch(`${apiBaseUrl}${path}`, { cache: "no-store" });

    if (!res.ok) {
      console.error("Landing data fetch failed", { path, status: res.status });
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error("Landing data fetch error", {
      path,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return null;
  }
}

export default async function LandingPage() {
  const apiBaseUrl = await getServerApiBaseUrl();
  const [products, posts, faqs] = await Promise.all([
    fetchJson<LandingProduct[]>(apiBaseUrl, "/products"),
    fetchJson<LandingJournalPost[]>(apiBaseUrl, "/journal?status=published"),
    fetchJson<LandingFaq[]>(apiBaseUrl, "/content/faqs"),
  ]);

  const newReleaseProducts = Array.isArray(products)
    ? (() => {
        const tagged = products.filter((product) => product.is_new_release === true);
        return (tagged.length > 0 ? tagged : products).slice(0, 3);
      })()
    : [];

  const journalPosts = Array.isArray(posts) ? posts.slice(0, 3) : [];
  const faqItems = Array.isArray(faqs) ? faqs : [];

  return (
    <main className="relative min-h-screen">
      
      {/* Background Ambient Blobs */}

      <div className="fixed top-[-200px] right-[-100px] w-[900px] h-[900px] bg-fermion-wisteria/40 rounded-full blur-[120px] z-[-1]" />
      <div className="fixed bottom-[-100px] left-[-100px] w-[700px] h-[700px] bg-fermion-horizon/30 rounded-full blur-[120px] z-[-1]" />

      {/* Sections */}
      <Hero />
      <PartnerRibbon />
      <Series />
      <TheWay />
      <NewReleases initialProducts={newReleaseProducts} />
      <WholesaleCTASection />
      <JournalSection initialPosts={journalPosts} />
      <FAQSection initialFaqs={faqItems} />
      <ContactSection />
      <Footer />

    </main>
  );
}
