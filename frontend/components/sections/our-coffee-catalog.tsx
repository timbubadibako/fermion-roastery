"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Plus, SlidersHorizontal, ArrowUpDown, 
  Grid2X2, Grid3X3, LayoutGrid, 
  Loader2, Sparkles, Flame, Percent,
  Beaker, Search, Edit3, X
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, useAuthStore } from "@/lib/store";
import { Sticker } from "@/components/ui/sticker";

interface CoffeeProduct {
  id: string;
  name: string;
  origin: string;
  process: string;
  altitude: string;
  price_retail: number;
  original_price?: number;
  image_url: string;
  notes: string;
  is_active: boolean;
}

export function RetailCatalog() {
  const [products, setProducts] = useState<CoffeeProduct[]>([]);
  const [displayProducts, setDisplayProducts] = useState<CoffeeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cols, setCols] = useState<2 | 3 | 4>(3);
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("FEATURED");
  
  const sortContainerRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortContainerRef.current && !sortContainerRef.current.contains(e.target as Node)) {
        setShowSort(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = user 
          ? `/api/products?profileId=${user.id}`
          : '/api/products';
          
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
        setDisplayProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  // Handle Filtering and Sorting
  useEffect(() => {
    let result = [...products];

    // Filter - Placeholder for future categories
    if (activeFilter !== "ALL") {
      // result = result.filter(p => p.category === activeFilter);
    }

    // Sort
    switch (sortBy) {
      case "PRICE_HIGH":
        result.sort((a, b) => Number(b.price_retail) - Number(a.price_retail));
        break;
      case "PRICE_LOW":
        result.sort((a, b) => Number(a.price_retail) - Number(b.price_retail));
        break;
      default:
        break;
    }

    setDisplayProducts(result);
  }, [activeFilter, sortBy, products]);

  const handleAddToCart = (e: React.MouseEvent, product: CoffeeProduct) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price_retail),
      quantity: 1,
      image: product.image_url,
      weight: "250g",
      grind: "Whole Bean"
    });

    toast.success(`${product.name} added to cart!`);
  };

  // Kept empty as per user request
  const filterTags = ["ALL"];

  if (loading) return (
    <div className="min-h-screen bg-[#FAF9F6] pt-40 px-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
        <Loader2 className="w-10 h-10 text-fermion-blue animate-spin" />
        <p className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase italic">Analyzing Specimen Data...</p>
      </div>
    </div>
  );

  return (
    <section className="bg-[#FAF9F6] min-h-screen pt-40 pb-40 px-6 relative overflow-hidden">
      
      {/* Background Aesthetics */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.025]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Client%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      <div className="fixed top-[-200px] right-[-100px] w-[900px] h-[900px] bg-purple-200/30 rounded-full blur-[120px] z-[-1]" />
      <div className="fixed bottom-[-100px] left-[-100px] w-[700px] h-[700px] bg-blue-200/20 rounded-full blur-[120px] z-[-1]" />

      <div className="max-w-7xl mx-auto mb-24 space-y-10 relative z-10 px-4 md:px-10 text-left">
        <div className="inline-block px-4 py-2 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full text-[9px] font-black tracking-[0.4em] text-purple-600 uppercase">
           Lab Specimen Catalogue
        </div>
        <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-slate-900 uppercase italic leading-none">
          Our Coffee <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 not-italic font-sans">Selection.</span>
        </h1>
        <p className="max-w-2xl text-slate-500 font-medium text-lg leading-relaxed">
          From high-altitude micro-lots to mathematically balanced espresso blends. Explore the science of flavor.
        </p>
      </div>

      {/* Action Bar - Pill Style */}
      <div className="sticky top-28 z-40 mb-16 px-4 md:px-10">
        <motion.div layout className="max-w-7xl mx-auto bg-white/40 backdrop-blur-[30px] border border-white/60 rounded-full h-16 flex items-center justify-between px-8 shadow-2xl shadow-slate-900/5 pointer-events-auto">
          <div className="flex items-center gap-10">
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-3 text-[9px] font-black tracking-[0.3em] text-slate-900 hover:text-fermion-blue transition-all uppercase italic"
            >
              {showFilter ? 'Close Filters' : 'Lab Filters'} <SlidersHorizontal size={14} strokeWidth={showFilter ? 2 : 1.5} />
            </button>
            
            <div className="h-6 w-[1px] bg-slate-200/50 hidden md:block" />

            <div className="hidden md:flex items-center gap-8">
               <div className="flex items-center gap-4">
                  <span className="text-[8px] font-black tracking-widest text-slate-400 uppercase">Grid</span>
                  <div className="flex gap-6">
                     {[2, 3, 4].map(n => (
                       <button 
                        key={n}
                        onClick={() => setCols(n as 2|3|4)} 
                        className={`text-[11px] font-black transition-all ${cols === n ? "text-slate-900 scale-125" : "text-slate-300 hover:text-slate-500"}`}
                       >
                         {n}
                       </button>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative" ref={sortContainerRef}>
                <button 
                  onClick={() => setShowSort(!showSort)}
                  className="flex items-center gap-3 text-[9px] font-black tracking-[0.3em] text-slate-900 uppercase"
                >
                  {sortBy.replace('_', ' ')} <ArrowUpDown size={14} strokeWidth={sortBy !== 'FEATURED' ? 2 : 1.5} className={`transition-transform duration-300 ${showSort ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showSort && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.9, rotate: -2 }}
                      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, y: 15, scale: 0.9, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="absolute top-full right-0 mt-4 w-56 bg-white/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] p-6 border border-white/60 z-50 origin-top-right"
                    >
                      <div className="space-y-4">
                          {[
                            { label: "FEATURED", val: "FEATURED" },
                            { label: "PRICE: HIGH TO LOW", val: "PRICE_HIGH" },
                            { label: "PRICE: LOW TO HIGH", val: "PRICE_LOW" }
                          ].map((opt, i) => (
                            <motion.p 
                              key={opt.val}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              onClick={() => {
                                setSortBy(opt.val);
                                setShowSort(false);
                              }}
                              className={`text-[10px] font-black cursor-pointer uppercase tracking-[0.2em] transition-colors ${sortBy === opt.val ? 'text-fermion-blue' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                              {opt.label}
                            </motion.p>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Tag Cloud */}
      <div className="max-w-7xl mx-auto relative z-10 overflow-hidden px-4 md:px-10">
        <AnimatePresence>
          {showFilter && (
            <motion.div 
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 64 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-wrap justify-center gap-3 overflow-hidden"
            >
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 px-10 py-5 rounded-[2rem] text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic flex items-center gap-3">
                 <Search size={14} className="text-slate-300" />
                 Collection filters coming soon
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
        <div className={`grid flex-1 transition-all duration-700 ease-in-out gap-12 ${
          cols === 2 ? "grid-cols-1 md:grid-cols-2 lg:gap-20" : 
          cols === 3 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:gap-16" : 
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10"
        }`}>
          {displayProducts.map((product, index) => (
            <Link key={product.id} href={`/our-coffee/${product.id}`} className="group relative">
              <div className="artisan-glass rounded-[3rem] p-6 pb-10 flex flex-col gap-8 transition-all duration-500 hover:bg-white/40 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
                <div className="relative aspect-[4/5] bg-slate-50/50 rounded-[2.5rem] overflow-hidden border border-white/60">
                  {index === 0 && <Sticker rotate={6} className="top-6 right-6">Best Seller</Sticker>}
                  {index === 2 && <Sticker rotate={-4} color="var(--cartoon-pink)" className="top-6 right-6">New Crop</Sticker>}
                  
                  <Image
                    src={product.image_url || "https://placehold.co/800x1000/e2e8f0/94a3b8?text=FERMION+COFFEE"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  
                  <div className="absolute bottom-6 left-6 right-6">
                     <div className="bg-white/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white shadow-xl flex items-center justify-between transition-transform duration-500 group-hover:-translate-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">✨ {product.notes || 'Curated'}</p>
                        <Beaker size={14} className="text-fermion-blue" />
                     </div>
                  </div>
                </div>

                <div className="space-y-4 px-2">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black tracking-[0.2em] text-fermion-blue uppercase">
                      {product.origin} • {product.process}
                    </p>
                    <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase leading-none">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-900/5 mt-4">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Retail Price</span>
                       <span className="text-xl font-black text-slate-900 italic">
                         Rp {Number(product.price_retail).toLocaleString('id-ID')}
                       </span>
                    </div>
                    
                    {user?.role === 'ADMIN' ? (
                       <button 
                        className="bg-amber-500 text-white p-4 rounded-2xl shadow-lg hover:bg-slate-900 transition-all active:scale-95 group/edit"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/admin/products?edit=${product.id}`;
                        }}
                       >
                         <Edit3 size={16} strokeWidth={1.5} className="group-hover:rotate-12 transition-transform" />
                       </button>
                    ) : (
                       <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="bg-slate-900 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-fermion-blue transition-all active:scale-95 shadow-xl shadow-slate-900/10"
                       >
                         Add to Cart
                       </button>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
