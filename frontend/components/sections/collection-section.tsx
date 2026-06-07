"use client";

import { FadeImage } from "@/components/fade-image";

const accessories = [
  {
    id: 1,
    name: "Fermion V60 Dripper",
    description: "Artisan glass dripper for precision brewing",
    price: "Rp 325k",
    image: "https://placehold.co/600x900/7a9cff/ffffff?text=V60+Dripper",
  },
  {
    id: 2,
    name: "Coffee Server 600ml",
    description: "Heat-resistant borosilicate glass server",
    price: "Rp 245k",
    image: "https://placehold.co/600x900/ffd700/0f172a?text=Glass+Server",
  },
  {
    id: 3,
    name: "Precision Scale",
    description: "Digital scale with 0.1g accuracy and timer",
    price: "Rp 850k",
    image: "https://placehold.co/600x900/ff4b4b/ffffff?text=Digital+Scale",
  },
  {
    id: 4,
    name: "Electric Gooseneck",
    description: "Fast-heating kettle with flow control",
    price: "Rp 1.250k",
    image: "https://placehold.co/600x900/0f172a/ffffff?text=Electric+Kettle",
  },
  {
    id: 5,
    name: "Fermion Tote Bag",
    description: "Organic cotton bag for coffee lovers",
    price: "Rp 85k",
    image: "https://placehold.co/600x900/7a9cff/ffffff?text=Tote+Bag",
  },
  {
    id: 6,
    name: "Canister 250g",
    description: "Air-tight storage for maximum freshness",
    price: "Rp 185k",
    image: "https://placehold.co/600x900/ffd700/0f172a?text=Canister",
  },
];

export function CollectionSection() {
  return (
    <section id="accessories" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 md:px-12 lg:px-20 md:py-10">
        <h2 className="text-3xl font-black tracking-tighter text-foreground md:text-4xl uppercase italic">
          Brewing Essentials
        </h2>
      </div>

      {/* Accessories Grid/Carousel */}
      <div className="pb-24">
        {/* Mobile: Horizontal Carousel */}
        <div className="flex gap-6 overflow-x-auto px-6 pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
          {accessories.map((accessory) => (
            <div key={accessory.id} className="group flex-shrink-0 w-[75vw] snap-center">
              {/* Image */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={accessory.image || "/placeholder.svg"}
                  alt={accessory.name}
                  fill
                  className="object-cover group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium leading-snug text-foreground">
                      {accessory.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {accessory.description}
                    </p>
                  </div>
                  <span className="text-lg font-medium text-foreground">
                    {accessory.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 md:px-12 lg:px-20">
          {accessories.map((accessory) => (
            <div key={accessory.id} className="group">
              {/* Image */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={accessory.image || "/placeholder.svg"}
                  alt={accessory.name}
                  fill
                  className="object-cover group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium leading-snug text-foreground">
                      {accessory.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {accessory.description}
                    </p>
                  </div>
                  <span className="font-medium text-foreground text-2xl">
                    {accessory.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
