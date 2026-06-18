"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Plus, SlidersHorizontal, ArrowUpDown, 
  Loader2, Sparkles, Beaker, Search, Edit3, X, ArrowLeft, ArrowRight, Microscope, FlaskConical, Archive
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, useAuthStore } from "@/lib/store";
import { Sticker } from "@/components/ui/sticker";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  
  const headerRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
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
    if (!mounted || !catalogRef.current) return;
    
    let ctx: gsap.Context;

    const runAnimations = () => {
      ctx = gsap.context(() => {
        // Use global scope (no parent element) for hero text so it can find elements in headerRef
        const heroText = gsap.utils.toArray(".catalog-hero-text");
        if (heroText.length > 0) {
          gsap.from(heroText, { 
            y: 40, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power2.out" 
          });
        }
        
        // Scope grid animations to catalogRef
        if (catalogRef.current) {
          const cards = gsap.utils.toArray(".product-specimen-card", catalogRef.current);
          if (cards.length > 0) {
            gsap.from(cards, {
              y: 30,
              opacity: 0,
              stagger: 0.05,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: catalogRef.current,
                start: "top 90%"
              }
            });
          }
        }
        ScrollTrigger.refresh();
      });
    };

    const timer = setTimeout(runAnimations, 30);
    
    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [mounted, products, currentPage]);

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

  const itemsPerPage = 12;
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

  if (!mounted) return null;

  return (
    <section className="bg-[#FAF9F6] min-h-screen pt-0 pb-40 relative overflow-hidden">
      
      {/* Background Aesthetics - Subtle Paper Grid */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.05]" 
           style={{ 
             backgroundImage: 'linear-gradient(#000 0.5px, transparent 0.5px), linear-gradient(90deg, #000 0.5px, transparent 0.5px)',
             backgroundSize: '40px 40px'
           }} 
      />

      {/* Maroon Header Area (Solid & Irregular Hand-Torn Edge) */}
      <div ref={headerRef} className="bg-[#2A1619] text-white pt-48 pb-32 px-6 relative z-10 will-change-transform"
           style={{ clipPath: "polygon(0 0, 100% 0, 100% 98%, 95% 99%, 90% 98%, 85% 99%, 80% 98%, 75% 99%, 70% 98%, 65% 99%, 60% 98%, 55% 99%, 50% 98%, 45% 99%, 40% 98%, 35% 99%, 30% 98%, 25% 99%, 20% 98%, 15% 99%, 10% 98%, 5% 99%, 0 98%)" }}
      >
        <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-10">
            <div className="relative inline-block catalog-hero-text will-change-transform">
               {/* Paper Badge */}
               <div className="px-5 py-2.5 bg-[#FAF9F6] text-[#2A1619] rotate-[0.5deg] text-[10px] font-sans font-black tracking-[0.4em] uppercase flex items-center gap-3 relative shadow-sm">
                  <Archive size={12} /> Retail Catalogue
               </div>
               {/* Tape - Explicitly on top (z-20) */}
               <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-20 h-5 bg-white/20 border border-white/10 rotate-[-4deg] z-25"></div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-cloude tracking-tighter text-white leading-[0.8] relative catalog-hero-text will-change-transform">
            Our Coffee <br/>
            <span className="font-display italic text-[#EBA294]">Specimens.</span>
            </h1>
            
            <p className="max-w-xl text-stone-300 font-medium text-lg leading-relaxed italic catalog-hero-text will-change-transform">
            Explore our collection of precision-roasted beans, curated from the finest altitudes.
            </p>
        </div>
      </div>

      {/* Action Bar - Solid Paper Strip */}
      <div className="sticky top-20 md:top-28 z-40 mb-12 md:mb-16 px-4 md:px-10">
        <div className="max-w-7xl mx-auto relative group">
          {/* Tape on top */}
          <div className="absolute top-[-10px] left-[15%] w-20 h-5 bg-[#367F4D]/10 border border-white/20 rotate-[-2deg] z-50 transition-transform duration-300 group-hover:rotate-0"></div>
          
          <motion.div className="bg-white border border-black/5 rounded-sm h-14 md:h-16 flex items-center justify-between px-6 md:px-8 shadow-lg shadow-black/[0.02] relative overflow-hidden">
             <div className="flex items-center gap-6 md:gap-10 relative z-10">
                <button 
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center gap-2.5 text-[9px] font-black tracking-[0.2em] text-slate-900 hover:text-[#367F4D] transition-all uppercase"
                >
                  <SlidersHorizontal size={14} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Catalogue Tools</span>
                </button>
                
                <div className="h-6 w-[1px] bg-black/5 hidden md:block" />

                <div className="hidden md:flex items-center gap-6">
                   <div className="flex gap-4">
                      {[2, 3, 4].map(n => (
                        <button 
                         key={n}
                         onClick={() => setCols(n as 2|3|4)} 
                         className={`text-[11px] font-black transition-all ${cols === n ? "text-[#367F4D] scale-110" : "text-stone-300 hover:text-stone-500"}`}
                        >
                          {n}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-6 relative z-10">
                <div className="relative" ref={sortContainerRef}>
                   <button 
                     onClick={() => setShowSort(!showSort)}
                     className="flex items-center gap-2.5 text-[9px] font-black tracking-[0.2em] text-slate-900 uppercase"
                   >
                     <span>{sortBy.replace('_', ' ')}</span>
                     <ArrowUpDown size={14} strokeWidth={2.5} />
                   </button>
                   
                   <AnimatePresence>
                     {showSort && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                         className="absolute top-full right-0 mt-4 w-48 bg-white shadow-xl border border-black/5 rounded-sm p-4 z-50 origin-top-right"
                       >
                         <div className="space-y-4">
                             {["FEATURED", "PRICE_HIGH", "PRICE_LOW"].map((opt) => (
                               <p 
                                 key={opt}
                                 onClick={() => { setSortBy(opt); setShowSort(false); }}
                                 className={`text-[9px] font-black cursor-pointer uppercase tracking-[0.2em] transition-all ${sortBy === opt ? 'text-[#367F4D]' : 'text-stone-400 hover:text-stone-900'}`}
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
      </div>

      {/* Grid Container */}
      <div ref={catalogRef} className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
        {loading ? (
          <div className={`grid gap-8 md:gap-10 ${
            cols === 2 ? "grid-cols-1 md:grid-cols-2" : 
            cols === 3 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : 
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          }`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-stone-100 animate-pulse rounded-sm border border-black/[0.03]"></div>
            ))}
          </div>
        ) : (
          <div className={`grid transition-all duration-500 gap-8 md:gap-10 ${
            cols === 2 ? "grid-cols-1 md:grid-cols-2" : 
            cols === 3 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : 
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          }`}>
            {currentItems.map((product, index) => (
              <Link key={product.id} href={`/our-coffee/${product.id}`} className="group relative flex flex-col product-specimen-card will-change-transform">
                <div className="bg-white p-5 pb-8 flex flex-col gap-6 transition-[transform,shadow] duration-500 shadow-md shadow-black/[0.02] hover:shadow-xl hover:shadow-black/5 border border-black/[0.03] h-full rounded-sm relative">
                  
                  <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden border border-black/[0.03]">
                    {index === 0 && currentPage === 1 && (
                      <Sticker rotate={6} className="absolute top-3 right-3 z-10 border border-black/5 shadow-sm" color="#F1B941">
                         BEST SELLER
                      </Sticker>
                    )}
                    
                    <Image
                      src={product.image_url || "https://placehold.co/800x1000/e2e8f0/94a3b8?text=FERMION+COFFEE"}
                      alt={product.name} 
                      fill 
                      className="object-cover transition-[transform,filter] duration-700 grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    
                    <div className="absolute bottom-3 left-3 right-3">
                       <div className="bg-white/90 px-3 py-2 border border-black/5 shadow-sm flex items-center justify-between">
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-900 truncate pr-2">
                             {product.notes || 'Batch Record'}
                          </p>
                          <Microscope size={12} className="text-[#367F4D]" strokeWidth={3} />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4 px-1 flex-1 flex flex-col">
                    <div className="space-y-2 text-center">
                      <p className="text-[8px] font-black tracking-[0.2em] text-[#367F4D] uppercase">
                        {product.origin}
                      </p>
                      <h3 className="text-xl md:text-2xl font-display font-black uppercase tracking-tighter text-slate-900 leading-tight italic">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex flex-col items-center pt-2 mt-auto gap-6">
                      <div className="text-center">
                         <span className="text-[8px] font-black text-stone-300 uppercase tracking-[0.2em] block mb-1">Rp / 250G</span>
                         <span className="text-xl font-sans font-bold text-slate-900 tabular-nums">
                           Rp {Number(product.price_retail).toLocaleString('id-ID')}
                         </span>
                      </div>
                      
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full bg-slate-900 text-white px-4 py-3.5 rounded-sm text-[9px] font-black uppercase tracking-[0.3em] hover:bg-[#367F4D] transition-colors duration-300 active:scale-95 shadow-lg shadow-black/10 flex justify-center items-center gap-2"
                      >
                        <span>Add to Cart</span>
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* PAGINATION - Clean Style */}
        {totalPages > 1 && (
          <div className="mt-24 flex justify-center pb-20">
             <div className="bg-white border border-black/5 rounded-sm h-16 flex items-center px-4 shadow-lg shadow-black/[0.02] gap-4 relative">
                <button 
                  disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}
                  className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-[#367F4D] disabled:opacity-20"
                >
                  <ArrowLeft size={16} strokeWidth={3} />
                </button>

                <div className="flex items-center px-4 gap-8">
                   {Array.from({ length: totalPages }).map((_, i) => (
                     <button 
                       key={i} onClick={() => setCurrentPage(i + 1)}
                       className={`text-[11px] font-black transition-all ${currentPage === i + 1 ? 'text-[#367F4D] scale-110' : 'text-stone-300 hover:text-stone-600'}`}
                     >
                       {String(i + 1).padStart(2, '0')}
                     </button>
                   ))}
                </div>

                <button 
                  disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}
                  className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-[#367F4D] disabled:opacity-20"
                >
                  <ArrowRight size={16} strokeWidth={3} />
                </button>
             </div>
          </div>
        )}
      </div>
    </section>
  );
}
