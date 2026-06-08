"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FermionPlaceholderPanel } from "@/components/ui/fermion-placeholder-panel";

export function JournalTeaserSection() {
  const recentArticles = [
    {
      title: "Understanding Natural Yeast Fermentation",
      category: "EDUCATION",
      color: "blue" as const,
    },
    {
      title: "Sourcing in Kendal: Meet the Farmers",
      category: "ORIGIN STORY",
      color: "coral" as const,
    },
    {
      title: "How to Dial Your Espresso at Home",
      category: "BREWING",
      color: "lilac" as const,
    },
  ];

  return (
    <section className="bg-background">
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-16 space-y-4">
            <p className="text-[10px] font-black text-fermion-blue tracking-[0.4em] uppercase">
              The Fermion Journal
            </p>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase italic">
                Stories Behind
                <br />
                The Beans.
              </h2>
              <Link href="/journal">
                <button className="inline-flex items-center gap-2 px-6 py-3 text-fermion-blue font-black tracking-widest text-[10px] uppercase border-b-2 border-fermion-blue hover:text-fermion-lilac hover:border-fermion-lilac transition-all">
                  Read Journal
                  <ArrowRight size={14} />
                </button>
              </Link>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
              <Link key={article.title} href="/journal" className="group">
                <div className="space-y-4">
                  <FermionPlaceholderPanel
                    color={article.color}
                    text={article.category}
                    className="aspect-video group-hover:shadow-lg transition-all duration-300"
                  />
                  <h3 className="text-lg font-black tracking-tighter text-foreground uppercase group-hover:text-fermion-blue transition-colors">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function OurStoryTeaserSection() {
  return (
    <section className="bg-background">
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-fermion-blue tracking-[0.4em] uppercase">
                  The Roastery Story
                </p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase italic">
                  Artisan Spirit.
                  <br />
                  Micro Roots.
                </h2>
              </div>

              <p className="text-lg font-medium leading-relaxed text-muted-foreground">
                Fermion Roastery started in a small garage in Cirebon with a single mission: to prove that world-class coffee could be roasted with scientific precision in our local community.
              </p>

              <p className="text-lg font-medium leading-relaxed text-muted-foreground">
                We don't just roast coffee; we engineer happiness. Every batch is a result of hundreds of sensory tests, cupping sessions, and obsessive temperature profiling.
              </p>

              <Link href="/our-story">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-fermion-blue text-white rounded-full font-black tracking-widest text-[10px] uppercase hover:shadow-lg hover:shadow-fermion-blue/40 transition-all">
                  Learn Our Story
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>

            {/* Right: Placeholder */}
            <div className="hidden lg:block">
              <FermionPlaceholderPanel
                color="lilac"
                text="Our Story Image"
                className="aspect-square"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
