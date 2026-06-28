"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FermionPlaceholderPanel } from "@/components/ui/fermion-placeholder-panel";

export function JournalTeaserSection() {
  const recentArticles = [
    {
      title: "Memahami Fermentasi Ragi Alami",
      category: "EDUKASI",
      color: "blue" as const,
    },
    {
      title: "Sourcing di Kendal: Mengenal Para Petani",
      category: "CERITA ASAL",
      color: "coral" as const,
    },
    {
      title: "Cara Menyetel Espresso di Rumah",
      category: "SEDUH",
      color: "lilac" as const,
    },
  ];

  return (
    <section className="bg-background">
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-16 space-y-4">
            <p className="text-[10px] font-black text-fermion-french-blue tracking-[0.4em] uppercase">
              Jurnal Fermion
            </p>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase italic">
                Cerita di Balik
                <br />
                Biji Kopi.
              </h2>
              <Link href="/journal">
                <button className="inline-flex items-center gap-2 px-6 py-3 text-fermion-french-blue font-black tracking-widest text-[10px] uppercase border-b-2 border-fermion-french-blue hover:text-fermion-lilac hover:border-fermion-lilac transition-all">
                  Baca Jurnal
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
                  <h3 className="text-lg font-black tracking-tighter text-foreground uppercase group-hover:text-fermion-french-blue transition-colors">
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
                <p className="text-[10px] font-black text-fermion-french-blue tracking-[0.4em] uppercase">
                  Kisah Roastery
                </p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase italic">
                  Jiwa Artisan.
                  <br />
                  Akar Lokal.
                </h2>
              </div>

              <p className="text-lg font-medium leading-relaxed text-muted-foreground">
                Fermion Roastery berawal dari garasi kecil di Cirebon dengan satu misi: membuktikan bahwa kopi kelas dunia bisa di-roasting dengan presisi ilmiah dari komunitas lokal kami.
              </p>

              <p className="text-lg font-medium leading-relaxed text-muted-foreground">
                Kami tidak sekadar me-roasting kopi; kami merancang pengalaman minum yang lebih konsisten. Setiap batch lahir dari ratusan uji sensori, sesi cupping, dan profiling suhu yang disiplin.
              </p>

              <Link href="/our-story">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-fermion-french-blue text-white rounded-full font-black tracking-widest text-[10px] uppercase hover:shadow-lg hover:shadow-fermion-french-blue/40 transition-all">
                  Baca Kisah Kami
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>

            {/* Right: Placeholder */}
            <div className="hidden lg:block">
              <FermionPlaceholderPanel
                color="lilac"
                text="Visual Kisah Kami"
                className="aspect-square"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
