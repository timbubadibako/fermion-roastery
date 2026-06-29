import React from "react";
import { Hero } from "@/components/sections/landing/Hero";
import { PartnerRibbon } from "@/components/sections/landing/PartnerRibbon";
import { Series } from "@/components/sections/landing/Series";
import { TheWay } from "@/components/sections/landing/TheWay";
import { NewReleases } from "@/components/sections/landing/NewReleases";
import { JournalSection } from "@/components/sections/landing/JournalSection";
import { FAQSection } from "@/components/sections/landing/FAQSection";
import { ContactSection } from "@/components/sections/landing/ContactSection";
import { Footer } from "@/components/sections/Footer";

export const revalidate = 300;

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

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${apiBaseUrl}${path}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export default async function LandingPage() {
  const [products, posts, faqs] = await Promise.all([
    fetchJson<LandingProduct[]>("/products"),
    fetchJson<LandingJournalPost[]>("/journal?status=published"),
    fetchJson<LandingFaq[]>("/content/faqs"),
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
      
      {/* Global Grainy Texture for V2 */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.025]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Client%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Background Ambient Blobs */}
      <div className="fixed top-[-200px] right-[-100px] w-[900px] h-[900px] bg-fermion-wisteria/40 rounded-full blur-[120px] z-[-1]" />
      <div className="fixed bottom-[-100px] left-[-100px] w-[700px] h-[700px] bg-fermion-horizon/30 rounded-full blur-[120px] z-[-1]" />

      {/* Sections */}
      <Hero />
      <PartnerRibbon />
      <Series />
      <TheWay />
      <NewReleases initialProducts={newReleaseProducts} />
      <JournalSection initialPosts={journalPosts} />
      <FAQSection initialFaqs={faqItems} />
      <ContactSection />
      <Footer />

    </main>
  );
}
