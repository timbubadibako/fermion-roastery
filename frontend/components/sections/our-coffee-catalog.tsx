"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Plus, SlidersHorizontal, ArrowUpDown, 
  Loader2, Sparkles, Beaker, Search, Edit3, X, ArrowLeft, ArrowRight
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
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cols, setCols] = useState<2 | 3 | 4>(3);
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("FEATURED");
  const [currentPage, setCurrentPage] = useState(1);
  
  const sortContainerRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!mounted) return;

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
  }, [user, mounted]);

  useEffect(() => {
    let result = [...products];
    if (sortBy === "PRICE_HIGH") {
      result.sort((a, b) => Number(b.price_retail) - Number(a.price_retail));
    } else if (sortBy === "PRICE_LOW") {
      result.sort((a, b) => Number(a.price_retail) - Number(b.price_retail));
    }
    setDisplayProducts(result);
    setCurrentPage(1);
  }, [activeFilter, sortBy, products]);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(displayProducts.length / itemsPerPage);
  const currentItems = displayProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (e: React.MouseEvent, product: CoffeeProduct) => {
    e.preventDefault(); e.stopPropagation();
    addItem({
      id: product.id, name: product.name, price: Number(product.price_retail),
      quantity: 1, image: product.image_url, weight: "250g", grind: "Whole Bean"
    });
    toast.success(`${product.name} added to cart!`);
  };

  if (!mounted || loading) return (
    <div className="min-h-screen bg-[#FAF9F6] pt-40 px-12 flex flex-col items-center gap-6">
      <Loader2 className="w-10 h-10 text-[#367F4D] animate-spin" />
      <p className="text-[10px] font-black tracking-[0.5em] text-stone-400 uppercase italic">Loading Specimen...</p>
    </div>
  );

  return (
    <section className="bg-[#FAF9F6] min-h-screen pt-40 pb-40 px-6 relative overflow-hidden">
      
      {/* Background Aesthetics - Scrapbook Lite */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      <div className="max-w-7xl mx-auto mb-20 space-y-8 relative z-10 px-4 md:px-10">
        <div className="inline-block px-4 py-1.5 bg-white border border-black/10 shadow-[4px_4px_0_rgba(0,0,0,0.02)] rotate-[-1deg] text-[10px] font-black tracking-[0.3em] text-[#367F4D] uppercase">
           Retail Catalogue
        </div>
        
        <h1 className="text-7xl md:text-9xl font-cloude tracking-tighter text-slate-900 leading-[0.8] relative">
          Our Coffee <br/>
          <span className="font-display italic text-[#EBA294]">Specimens.</span>
        </h1>
        
        <p className="max-w-2xl text-stone-600 font-medium text-lg leading-relaxed bg-white/40 p-4 border-l-4 border-[#367F4D]/20 backdrop-blur-sm shadow-sm">
          Explore our collection of precision-roasted beans, curated from the finest altitudes.
        </p>
      </div>

      {/* Action Bar - Scrapbook Lite Paper Strip */}
      <div className="sticky top-28 z-40 mb-16 px-4 md:px-10">
        <motion.div layout className="max-w-7xl mx-auto bg-[#FDFBF7] border border-black/5 rounded-xl h-16 flex items-center justify-between px-8 shadow-[8px_8px_0px_rgba(0,0,0,0.02)] pointer-events-auto">
          <div className="flex items-center gap-10">
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-3 text-[10px] font-black tracking-[0.2em] text-slate-900 hover:text-[#367F4D] transition-all uppercase"
            >
              {showFilter ? 'Hide Tools' : 'Catalog Tools'} <SlidersHorizontal size={14} strokeWidth={2.2} />
            </button>
            
            <div className="h-6 w-[1px] bg-black/5 hidden md:block" />

            <div className="hidden md:flex items-center gap-6">
               <span className="text-[9px] font-black tracking-widest text-stone-400 uppercase">Layout</span>
               <div className="flex gap-4">
                  {[2, 3, 4].map(n => (
                    <button 
                     key={n}
                     onClick={() => setCols(n as 2|3|4)} 
                     className={`text-[12px] font-black transition-all ${cols === n ? "text-[#367F4D] scale-125" : "text-stone-300 hover:text-stone-500"}`}
                    >
                      {n}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative" ref={sortContainerRef}>
                <button 
                  onClick={() => setShowSort(!showSort)}
                  className="flex items-center gap-3 text-[10px] font-black tracking-[0.2em] text-slate-900 uppercase"
                >
                  {sortBy.replace('_', ' ')} <ArrowUpDown size={14} strokeWidth={2.2} className={`transition-transform duration-300 ${showSort ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showSort && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-4 w-56 bg-[#FDFBF7] shadow-xl rounded-xl p-6 border border-black/5 z-50 origin-top-right"
                    >
                      <div className="space-y-4">
                          {["FEATURED", "PRICE_HIGH", "PRICE_LOW"].map((opt) => (
                            <p 
                              key={opt}
                              onClick={() => { setSortBy(opt); setShowSort(false); }}
                              className={`text-[10px] font-black cursor-pointer uppercase tracking-[0.2em] transition-colors ${sortBy === opt ? 'text-[#367F4D]' : 'text-stone-400 hover:text-stone-900'}`}
                            >
                              {opt.replace('_', ' ')}
                            </p>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Grid Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
        <div className={`grid flex-1 transition-all duration-700 ease-in-out gap-10 lg:gap-12 ${
          cols === 2 ? "grid-cols-1 md:grid-cols-2" : 
          cols === 3 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : 
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        }`}>
          {currentItems.map((product, index) => (
            <Link key={product.id} href={`/our-coffee/${product.id}`} className="group relative flex flex-col">
              <div className="bg-white border border-black/10 p-6 pb-10 flex flex-col gap-6 transition-all duration-500 hover:border-black/20 hover:shadow-[12px_12px_0px_rgba(0,0,0,0.03)] hover:-translate-y-2 rounded-xl h-full">
                
                <div className="relative aspect-[4/5] bg-stone-50 rounded-lg overflow-hidden border border-black/5">
                  {index === 0 && currentPage === 1 && <Sticker rotate={6} className="top-4 right-4 border border-black/10 shadow-sm" color="#F1B941">Best Seller</Sticker>}
                  
                  <Image
                    src={product.image_url || "https://placehold.co/800x1000/e2e8f0/94a3b8?text=FERMION+COFFEE"}
                    alt={product.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  
                  <div className="absolute bottom-4 left-4 right-4">
                     <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-black/5 shadow-sm flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-900 italic truncate">✨ {product.notes || 'Specimen'}</p>
                        <Beaker size={14} className="text-[#367F4D]" strokeWidth={2.2} />
                     </div>
                  </div>
                </div>

                <div className="space-y-4 px-1 flex-1 flex flex-col">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black tracking-[0.3em] text-[#367F4D] uppercase">
                      {product.origin}
                    </p>
                    <h3 className="text-2xl font-display font-black uppercase tracking-tighter text-slate-900 leading-tight">
                      {product.name}
                    </h3>
                  </div>

                  {/* Squiggly divider */}
                  <svg className="w-12 opacity-10" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5" stroke="currentColor" fill="transparent" strokeWidth="2" strokeLinecap="round" />
                  </svg>

                  <div className="flex items-center justify-between pt-4 mt-auto">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Specimen Price</span>
                       <span className="text-xl font-cloude text-[#367F4D]">
                         Rp {Number(product.price_retail).toLocaleString('id-ID')}
                       </span>
                    </div>
                    
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-stone-900 text-white px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#367F4D] transition-all active:scale-95 shadow-sm hover:-translate-y-1"
                    >
                      Add to Ritual
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* PAGINATION - Scrapbook Style */}
        {totalPages > 1 && (
          <div className="mt-24 flex justify-center pb-20">
             <div className="bg-[#FDFBF7] border border-black/5 rounded-xl h-16 flex items-center px-4 shadow-[6px_6px_0px_rgba(0,0,0,0.02)] gap-2">
                <button 
                  disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-white transition-all disabled:opacity-20"
                >
                  <ArrowLeft size={16} strokeWidth={2.5} />
                </button>

                <div className="flex items-center px-4 gap-6">
                   {Array.from({ length: totalPages }).map((_, i) => (
                     <button 
                       key={i} onClick={() => setCurrentPage(i + 1)}
                       className={`text-[11px] font-black transition-all ${currentPage === i + 1 ? 'text-[#367F4D] scale-125' : 'text-stone-300 hover:text-stone-500'}`}
                     >
                       {String(i + 1).padStart(2, '0')}
                     </button>
                   ))}
                </div>

                <button 
                  disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-white transition-all disabled:opacity-20"
                >
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
             </div>
          </div>
        )}
      </div>
    </section>
  );
}
