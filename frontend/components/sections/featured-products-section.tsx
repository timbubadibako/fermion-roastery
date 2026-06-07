"use client";

import { FadeImage } from "@/components/fade-image";

const features = [
  {
    title: "Precision Roasting",
    description: "Technology",
    image: "https://placehold.co/800x800/7a9cff/ffffff?text=Micro+Roast",
  },
  {
    title: "Direct Sourcing",
    description: "Ethical",
    image: "https://placehold.co/800x800/ffd700/0f172a?text=Green+Beans",
  },
  {
    title: "Sensory Analysis",
    description: "Quality",
    image: "https://placehold.co/800x800/ff4b4b/ffffff?text=Cupping+Lab",
  },
  {
    title: "Eco-Friendly Packing",
    description: "Sustainability",
    image: "https://placehold.co/800x800/0f172a/ffffff?text=Eco+Bag",
  },
  {
    title: "Artisan Blending",
    description: "Craft",
    image: "https://placehold.co/800x800/7a9cff/ffffff?text=Signature+Blend",
  },
  {
    title: "Freshness Tracking",
    description: "Science",
    image: "https://placehold.co/800x800/ffd700/0f172a?text=Roast+Date",
  },
];

export function FeaturedProductsSection() {
  return (
    <section id="technology" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 text-center md:px-12 md:py-28 lg:px-20 lg:py-32 lg:pb-20">
        <h2 className="text-3xl font-black tracking-tighter text-foreground md:text-4xl lg:text-5xl uppercase italic">
          Science Meets Happiness.
          <br />
          Crafted in Every Bean.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-xs font-bold tracking-widest text-muted-foreground uppercase">
          The Fermion Way
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-4 px-6 pb-20 md:grid-cols-3 md:px-12 lg:px-20">
        {features.map((feature) => (
          <div key={feature.title} className="group">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <FadeImage
                src={feature.image || "/placeholder.svg"}
                alt={feature.title}
                fill
                className="object-cover group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="py-6">
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                {feature.description}
              </p>
              <h3 className="text-foreground text-xl font-semibold">
                {feature.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Link */}
      <div className="flex justify-center px-6 pb-28 md:px-12 lg:px-20">
        
      </div>
    </section>
  );
}
