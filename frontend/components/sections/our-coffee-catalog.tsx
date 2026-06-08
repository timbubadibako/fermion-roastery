"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, SlidersHorizontal, ArrowUpDown, Grid2X2, Grid3X3, LayoutGrid, SeparatorHorizontal as Separator, Loader2, Sparkles, Flame, Percent } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface CoffeeProduct {
  id: number;
  name: string;
  origin: string;
  process: string;
  altitude: string;
  price: number;
  original_price?: number;
  image: string;
  isLocked?: boolean;
}

export function RetailCatalog() {
  const [products, setProducts] = useState<CoffeeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cols, setCols] = useState<2 | 3 | 4>(3);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: CoffeeProduct) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${product.name} added to cart!`, {
      description: "You can view your items in the cart sidebar.",
      duration: 3000,
    });
  };

  // Helper to determine sticker type based on product data (mock logic for visual flair)
  const getSticker = (product: CoffeeProduct, index: number) => {
    if (product.original_price && product.price < product.original_price) {
      const discount = Math.round((1 - (product.price / product.original_price)) * 100);
      return (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-full shadow-lg transform -rotate-2">
          <Percent size={12} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-widest">{discount}% OFF</span>
        </div>
      );
    }
    if (index === 0) {
      return (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-fermion-blue text-white px-3 py-1.5 rounded-full shadow-lg transform rotate-2">
          <Flame size={12} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-widest">Best Seller</span>
        </div>
      );
    }
    if (index === 2) {
      return (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-full shadow-lg">
          <Sparkles size={12} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-widest">New Harvest</span>
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FDFBF7] pt-40 px-12">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-fermion-blue animate-spin" />
        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Brewing your catalog...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <p className="text-red-500 font-bold uppercase tracking-widest text-xs">Error: {error}</p>
    </div>
  );

  // Dynamic Grid Classes
  const gridClasses = {
    2: "grid-cols-1 md:grid-cols-2 gap-16 md:gap-20",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8",
  };

  const filterCategories = [
    { name: "COUNTRY OF ORIGIN", items: ["Indonesia", "Ethiopia", "Colombia", "Brazil"] },
    { name: "COFFEE DRINK METHOD", items: ["Espresso", "Filter", "Capsule"] },
    { name: "CUP SCORE", items: ["Grade 85-87", "Grade 88+", "90+ Points"] },
    { name: "ROAST PROFILE", items: ["Light", "Light-Medium", "Medium", "Dark"] },
    { name: "COFFEE VARIETY", items: ["Typica", "Sigararutang", "Caturra", "Geisha"] },
    { name: "COFFEE PROCESS", items: ["Washed", "Natural", "Honey", "Anaerobic"] },
  ];

  return (
    <section className="bg-[#FDFBF7] min-h-screen pt-40 pb-40 px-4">
      {/* Intro Narrative */}
      <div className="max-w-6xl mx-auto mb-20 space-y-8 px-12 text-left">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase italic">
          Our Coffee Selection
        </h1>
        <div className="max-w-4xl space-y-6 text-sm md:text-base text-slate-600 leading-relaxed font-medium">
          <p>
            Our coffees are sourced in season and roasted with care to honor the producers' hard work and bring out the flavors, aromatics, and acidities allowing each coffee to tell its own story. Enjoy browsing our extensive selection featuring a broad range of flavor profiles and varieties. Find your perfect coffee among our catalog of different origins and according to your preferred drink method or roast profile.
          </p>
          <p>
            Our espresso roast coffee are recommended if you have an espresso machine or if you are using a Mokha Pot.
          </p>
          <p>
            Meanwhile, our filter roast coffees are recommended for pour-overs, AeroPress, Chemex, and other drip filter device that you have.
          </p>
        </div>
      </div>

      {/* Action Bar (Filter & Sort) */}
      <div className="sticky top-[64px] bg-[#FDFBF7] z-40">
        <div className="max-w-6xl mx-auto border-y border-slate-200 py-4 flex items-center justify-between mb-12 px-12">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-3 text-[10px] font-black tracking-[0.2em] text-slate-900 hover:opacity-70 transition-all uppercase"
            >
              {showFilter ? 'HIDE FILTER' : 'SHOW FILTER'} <SlidersHorizontal size={14} strokeWidth={2.5} />
            </button>
            
            <div className="h-4 w-[1px] bg-slate-200 hidden md:block" />

            <button className="flex items-center gap-3 text-[10px] font-black tracking-[0.2em] text-slate-900 hover:opacity-70 transition-all uppercase group relative text-left">
              PRICE, HIGH TO LOW <ArrowUpDown size={14} strokeWidth={2.5} />
              <div className="absolute top-full left-0 mt-4 w-48 bg-white shadow-2xl rounded-xl p-4 hidden group-hover:block border border-slate-100 animate-in fade-in zoom-in-95 duration-200 z-50">
                <div className="space-y-3">
                    <p className="text-[9px] font-bold text-slate-400 hover:text-slate-900 cursor-pointer uppercase tracking-widest">FEATURED</p>
                    <p className="text-[9px] font-bold text-slate-400 hover:text-slate-900 cursor-pointer uppercase tracking-widest">MOST RELEVANT</p>
                    <p className="text-[9px] font-bold text-slate-400 hover:text-slate-900 cursor-pointer uppercase tracking-widest">BEST SELLING</p>
                    <p className="text-[9px] font-bold text-slate-900 border-b-2 border-slate-900 w-fit uppercase tracking-widest">PRICE, HIGH TO LOW</p>
                    <p className="text-[9px] font-bold text-slate-400 hover:text-slate-900 cursor-pointer uppercase tracking-widest">PRICE, LOW TO HIGH</p>
                </div>
              </div>
            </button>
          </div>

          {/* Layout Switcher (Icons) */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">View</span>
            <div className="flex gap-4">
              <button onClick={() => setCols(2)} className={`transition-all ${cols === 2 ? "text-slate-900 scale-110" : "text-slate-300 hover:text-slate-500"}`}>
                <Grid2X2 size={16} strokeWidth={cols === 2 ? 3 : 2} />
              </button>
              <button onClick={() => setCols(3)} className={`transition-all ${cols === 3 ? "text-slate-900 scale-110" : "text-slate-300 hover:text-slate-500"}`}>
                <Grid3X3 size={16} strokeWidth={cols === 3 ? 3 : 2} />
              </button>
              <button onClick={() => setCols(4)} className={`transition-all ${cols === 4 ? "text-slate-900 scale-110" : "text-slate-300 hover:text-slate-500"}`}>
                <LayoutGrid size={16} strokeWidth={cols === 4 ? 3 : 2} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex px-12">
        {/* Sidebar Filter - Animated */}
        <aside 
          className={`hidden lg:block shrink-0 transition-all duration-500 ease-in-out overflow-hidden ${
            showFilter ? "w-64 opacity-100 mr-12" : "w-0 opacity-0 mr-0"
          }`}
        >
          <div className="w-64 space-y-8 h-[calc(100vh-180px)] overflow-y-auto pr-4 scrollbar-hide">
            {filterCategories.map((cat) => (
              <div key={cat.name} className="space-y-4">
                <h4 className="text-[10px] font-black tracking-[0.2em] text-slate-900 flex items-center justify-between group cursor-pointer uppercase">
                  {cat.name} <Plus size={12} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                </h4>
                <div className="space-y-2 pl-1">
                  {cat.items.map(item => (
                    <label key={item} className="flex items-center gap-3 group cursor-pointer">
                      <div className="w-3.5 h-3.5 border border-slate-300 rounded-sm group-hover:border-slate-900 transition-colors" />
                      <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-900 uppercase tracking-wider">{item}</span>
                    </label>
                  ))}
                </div>
                <div className="h-[1px] bg-slate-100 w-full" />
              </div>
            ))}
          </div>
        </aside>

        {/* Dynamic Product Grid - Resizes smoothly */}
        <div className={`grid ${gridClasses[cols]} flex-1 transition-all duration-500 ease-in-out`}>
          {products.map((product, index) => (
            <Link key={product.id} href={`/our-coffee/${product.id}`} className="group cursor-pointer">
              {/* Image Wrapper */}
              <div className="relative aspect-square bg-[#F4F4F5] rounded-2xl overflow-hidden mb-6">
                
                {/* Interactive Stickers */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                >
                  {getSticker(product, index)}
                </motion.div>

                <Image
                  src={product.image || "https://placehold.co/800x1000/7a9cff/ffffff?text=FERMION+COFFEE"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>

              {/* Metadata Section */}
              <div className="space-y-1 px-1 text-left relative">
                <p className="font-mono text-[9px] font-bold tracking-[0.1em] text-slate-400 uppercase">
                  {product.process} • {product.altitude}
                </p>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                  {product.name}
                </h3>
                <p className="text-sm font-light text-slate-500 italic mb-4">
                  {product.origin}
                </p>
              </div>

              {/* Footer / Pricing */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                <div className="flex flex-col">
                  {product.original_price && product.price < product.original_price ? (
                    <>
                      <span className="font-mono text-[10px] font-bold text-slate-400 line-through">
                        Rp {product.original_price.toLocaleString('id-ID')}
                      </span>
                      <span className="font-mono text-sm font-black text-red-500">
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                    </>
                  ) : (
                    <span className="font-mono text-sm font-bold text-slate-800">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
                <button 
                  onClick={(e) => handleAddToCart(e, product)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-full text-[10px] font-bold tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 uppercase"
                >
                  <Plus size={12} strokeWidth={3} /> Add
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

