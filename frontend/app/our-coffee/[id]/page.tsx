"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { 
  Minus, Plus, Heart, Share2, ArrowLeft, ChevronDown, ChevronUp, 
  Coffee, Beaker, MapPin, ShoppingBag, Loader2, Microscope, 
  FlaskConical, Globe2, Quote, Archive, Star
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCartStore, useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { Sticker } from "@/components/ui/sticker";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

interface CoffeeProduct {
  id: string;
  name: string;
  notes: string;
  origin: string;
  process: string;
  altitude: string;
  price: number;
  roast_profile: string;
  fermentation: number; 
  sweetness: number; 
  acidity: number; 
  body: number;
  description: string;
  farm: string;
  image: string;
}

function CharacterLevel({ label, level }: { label: string; level: number }) {
  return (
    <div className="flex items-center justify-between group/level">
      <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] group-hover/level:text-[#367F4D] transition-colors duration-300">{label}</span>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-sm transition-[transform,background-color] duration-500 ${i <= level ? "bg-[#367F4D] rotate-45" : "bg-stone-200"}`} 
          />
        ))}
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [product, setProduct] = useState<CoffeeProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<CoffeeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const t = useI18n();
  const tDetail = t.productDetail;

  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState("250g");
  const [grind, setGrind] = useState("Whole Beans");
  const [activeTab, setActiveTab] = useState<string | null>("description");
  
  const productHeroRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => { setMounted(true); }, []);

  const handleAddToCart = (silent: boolean = false) => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      weight: weight,
      grind: grind
    }, silent);

    if (!silent) {
      toast.success(`${product.name} added to cart!`, {
        description: `${weight} • ${grind}`,
      });
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    handleAddToCart(true); 
    const checkoutPath = user?.role === 'B2B' ? "/b2b/checkout" : "/cart";
    router.push(checkoutPath);
  };

  useEffect(() => {
    if (!mounted) return;
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);

        const allRes = await fetch(`/api/products`);
        if (allRes.ok) {
          const allData = await allRes.json();
          const filtered = allData
            .filter((p: CoffeeProduct) => p.roast_profile === data.roast_profile && p.id !== data.id)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProductAndRelated();
  }, [id, mounted]);

  useEffect(() => {
    if (!mounted || !product) return;
    let ctx = gsap.context(() => {
      gsap.from(".product-reveal", { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out" });
      gsap.from(".product-polaroid", { x: -60, rotation: -5, opacity: 0, duration: 1.5, ease: "back.out(1.2)" });
    }, productHeroRef);
    return () => ctx.revert();
  }, [mounted, product]);

  const toggleTab = (tab: string) => setActiveTab(activeTab === tab ? null : tab);

  if (!mounted || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
      <div className="flex flex-col items-center gap-6">
        <Loader2 className="w-12 h-12 text-[#367F4D] animate-spin" />
        <p className="text-[10px] font-black tracking-[0.5em] text-stone-400 uppercase italic">{tDetail.analyzingBatch}</p>
      </div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
      <div className="bg-white p-12 border border-red-100 shadow-xl rotate-[-1deg] text-center">
         <p className="text-red-500 font-black uppercase tracking-widest text-xs">Error: {error || tDetail.productNotFound}</p>
         <Link href="/our-coffee" className="inline-block mt-8 text-[10px] font-black uppercase tracking-widest border-b-2 border-slate-900 pb-1">{tDetail.returnToArchive}</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FAF9F6] min-h-screen relative overflow-hidden font-sans">
      
      {/* Background Aesthetics */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      <div ref={productHeroRef} className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-48 pb-40 relative z-10">
        
        {/* Navigation */}
        <Link href="/our-coffee" className="inline-flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-stone-400 hover:text-slate-900 transition-colors duration-300 mb-16 uppercase product-reveal will-change-transform">
          <ArrowLeft size={14} strokeWidth={3} /> {tDetail.returnToCatalogue}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start relative">
          
          {/* Left Column: Polaroid & Brewing (STICKY) */}
          <div className="lg:sticky lg:top-32 space-y-16 h-fit">
            <div className="product-polaroid relative will-change-transform">
               {/* Tape Accents */}
               <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-32 h-8 bg-[#367F4D]/10 border border-black/5 rotate-[-2deg] z-30 backdrop-blur-sm shadow-sm opacity-80"></div>
               
               <div className="bg-white p-5 pb-20 border border-black/5 shadow-[20px_20px_0px_rgba(0,0,0,0.02)] relative z-20 rounded-sm">
                  <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden border border-black/5">
                     <Image src={product.image} alt={product.name} fill className="object-cover grayscale-[0.1]" priority />
                  </div>
                  <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
                     <div className="space-y-1">
                        <p className="font-cloude text-[#367F4D] text-3xl opacity-30 italic">#EST-2026</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-stone-300">{tDetail.specimenRecord}</p>
                     </div>
                     <div className="w-16 h-16 bg-[#2A1619] rounded-full flex flex-col items-center justify-center text-white border-4 border-white shadow-xl rotate-12">
                        <span className="text-[8px] font-black tracking-tighter opacity-70 uppercase">{tDetail.score}</span>
                        <span className="text-sm font-black italic">86.5</span>
                     </div>
                  </div>
               </div>
               <Sticker rotate={-12} className="absolute -bottom-6 -left-6 z-40 border border-black/10 shadow-md" color="#F1B941">MICRO-LOT PASS</Sticker>
            </div>

            {/* Brewing Guide - Irregular Roastery Note */}
            <div className="bg-white p-10 border border-black/5 shadow-lg relative overflow-hidden product-reveal will-change-transform"
              style={{ clipPath: "polygon(2% 0%, 98% 1%, 100% 98%, 1% 100%)" }}
            >
              {/* Dot Grid */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
              
              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-[#FAF9F6] border border-black/5 rotate-[-3deg] shadow-sm">
                    <Microscope size={28} className="text-[#367F4D]" />
                  </div>
                  <div>
                     <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-[#367F4D]">{tDetail.extractionProtocol}</h3>
                     <p className="text-2xl font-display font-black italic tracking-tighter text-slate-900 uppercase">{tDetail.brewingGuide}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-black/5 pt-10">
                  <div className="space-y-6">
                    <p className="text-[10px] font-black text-slate-900 tracking-[0.3em] uppercase flex items-center gap-3">
                       <span className="w-2 h-2 bg-[#EBA294] rotate-45" /> {tDetail.forEspresso}
                    </p>
                    <div className="space-y-3 text-[11px] font-black text-stone-500 uppercase tracking-widest">
                      <div className="flex justify-between border-b border-black/[0.03] pb-2"><span>{tDetail.dose}</span> <span className="text-slate-900">18 - 20g</span></div>
                      <div className="flex justify-between border-b border-black/[0.03] pb-2"><span>{tDetail.yield}</span> <span className="text-slate-900">32 - 36g</span></div>
                      <div className="flex justify-between border-b border-black/[0.03] pb-2"><span>{tDetail.time}</span> <span className="text-slate-900">22 - 26s</span></div>
                      <div className="flex justify-between border-b border-black/[0.03] pb-2"><span>{tDetail.ratio}</span> <span className="text-slate-900">1 : 1.8</span></div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-[10px] font-black text-slate-900 tracking-[0.3em] uppercase flex items-center gap-3">
                       <span className="w-2 h-2 bg-[#8CADD8] rotate-45" /> {tDetail.withMilk}
                    </p>
                    <div className="space-y-3 text-[11px] font-black text-stone-500 uppercase tracking-widest">
                      <div className="flex justify-between border-b border-black/[0.03] pb-2"><span>{tDetail.dose}</span> <span className="text-slate-900">18 - 20g</span></div>
                      <div className="flex justify-between border-b border-black/[0.03] pb-2"><span>{tDetail.yield}</span> <span className="text-slate-900">27 - 30g</span></div>
                      <div className="flex justify-between border-b border-black/[0.03] pb-2"><span>{tDetail.time}</span> <span className="text-slate-900">20 - 24s</span></div>
                      <div className="flex justify-between border-b border-black/[0.03] pb-2"><span>{tDetail.ratio}</span> <span className="text-slate-900">1 : 1.5</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Selection */}
          <div className="flex flex-col space-y-16">
            <div className="space-y-6 product-reveal">
              <div className="inline-block px-4 py-1.5 bg-white border border-black/5 rotate-[-1deg] text-[9px] font-black tracking-[0.4em] text-[#367F4D] uppercase shadow-sm">
                 {tDetail.authenticRecord} / {product.origin}
              </div>
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-cloude tracking-tighter text-slate-900 leading-[0.8] italic uppercase">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                 <Beaker size={20} className="text-[#367F4D]" />
                 <p className="text-xl font-display font-black text-[#367F4D] uppercase italic tracking-tight">
                   {product.notes}
                 </p>
              </div>
              <div className="pt-6">
                <span className="text-5xl font-sans font-bold text-slate-900 tracking-tighter">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">{tDetail.valuation} / {weight}</span>
              </div>
            </div>

            {/* Accordions - Scrapbook Style */}
            <div className="border-t border-black/10 pt-10 space-y-8 product-reveal">
              {/* Description */}
              <div className="space-y-6">
                <button onClick={() => toggleTab('description')} className="w-full flex items-center justify-between text-[11px] font-black tracking-[0.4em] uppercase py-2 group">
                   <span className="group-hover:text-[#367F4D] transition-colors">{tDetail.specimenAnalysis}</span> 
                   {activeTab === 'description' ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                </button>
                {activeTab === 'description' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-10 overflow-hidden">
                    <p className="text-lg text-stone-600 font-medium leading-relaxed italic text-balance border-l-4 border-[#EBA294] pl-8">
                       "{product.description}"
                    </p>
                    <div className="grid grid-cols-1 gap-6 bg-white p-10 border border-black/5 shadow-inner rounded-sm rotate-[0.5deg]">
                       <CharacterLevel label={tDetail.fermentation} level={product.fermentation} />
                       <CharacterLevel label={tDetail.sweetness} level={product.sweetness} />
                       <CharacterLevel label={tDetail.acidity} level={product.acidity} />
                       <CharacterLevel label={tDetail.body} level={product.body} />
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="h-[1px] bg-black/[0.05]" />

              {/* Coffee & Process */}
              <div className="space-y-6">
                <button onClick={() => toggleTab('process')} className="w-full flex items-center justify-between text-[11px] font-black tracking-[0.4em] uppercase py-2 group">
                  <span className="group-hover:text-[#367F4D] transition-colors">{tDetail.originsProcessing}</span> 
                  {activeTab === 'process' ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                </button>
                {activeTab === 'process' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-3 gap-8 overflow-hidden pb-4">
                    <div className="space-y-2">
                       <Globe2 size={24} className="text-stone-300 mb-2" />
                       <p className="text-[9px] font-black text-stone-400 uppercase">{tDetail.origin}</p>
                       <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{product.origin}</p>
                    </div>
                    <div className="space-y-2">
                       <FlaskConical size={24} className="text-stone-300 mb-2" />
                       <p className="text-[9px] font-black text-stone-400 uppercase">{tDetail.process}</p>
                       <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{product.process}</p>
                    </div>
                    <div className="space-y-2">
                       <MapPin size={24} className="text-stone-300 mb-2" />
                       <p className="text-[9px] font-black text-stone-400 uppercase">{tDetail.altitude}</p>
                       <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{product.altitude}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Selectors */}
            <div className="space-y-12 pt-10 border-t border-black/10 product-reveal">
              <div className="flex items-center gap-8">
                <div className="flex items-center bg-white border border-black/5 shadow-sm p-1 rounded-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-[#FAF9F6] transition-all"><Minus size={16} strokeWidth={3}/></button>
                  <span className="w-12 text-center text-sm font-black tabular-nums">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-[#FAF9F6] transition-all"><Plus size={16} strokeWidth={3}/></button>
                </div>
                <div className="text-[10px] font-black text-stone-300 uppercase tracking-widest">{tDetail.selectQuantity}</div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-black text-stone-400 tracking-[0.3em] uppercase flex items-center gap-3">
                   <Archive size={14} /> {tDetail.packaging} | <span className="text-slate-900">{weight}</span>
                </p>
                <div className="flex gap-4">
                  {["250g", "500g"].map(w => (
                    <button 
                      key={w} onClick={() => setWeight(w)} 
                      className={`px-12 py-5 rounded-sm text-[10px] font-black tracking-[0.4em] transition-all duration-500 uppercase ${
                        weight === w 
                          ? "bg-slate-900 text-white shadow-xl translate-y-[-4px]" 
                          : "bg-white border border-black/5 text-stone-300 hover:border-slate-900 hover:text-slate-900"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-black text-stone-400 tracking-[0.3em] uppercase flex items-center gap-3">
                   <Coffee size={14} /> {tDetail.preparation} | <span className="text-slate-900">{grind}</span>
                </p>
                <div className="flex flex-wrap gap-4">
                  {["Whole Beans", "Espresso Grind", "Filter Grind"].map(g => (
                    <button 
                      key={g} onClick={() => setGrind(g)} 
                      className={`px-10 py-5 rounded-sm text-[10px] font-black tracking-[0.3em] transition-all duration-500 uppercase ${
                        grind === g 
                          ? "bg-slate-900 text-white shadow-xl translate-y-[-4px]" 
                          : "bg-white border border-black/5 text-stone-300 hover:border-slate-900 hover:text-slate-900"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-6 pt-12 border-t border-black/10 product-reveal">
              <button 
               onClick={() => handleAddToCart(false)}
               className="w-full h-20 bg-white border-2 border-slate-900 text-slate-900 font-black tracking-[0.4em] hover:bg-slate-900 hover:text-white transition-all duration-700 active:scale-[0.98] rounded-sm flex items-center justify-center gap-4 uppercase"
              >
                {tDetail.addToOrder} • Rp {(product.price * quantity).toLocaleString('id-ID')}
              </button>
              <button 
               onClick={handleBuyNow}
               className="w-full h-20 bg-[#2A1619] text-white font-black tracking-[0.5em] hover:bg-[#367F4D] transition-all duration-700 active:scale-[0.98] rounded-sm shadow-2xl uppercase italic flex items-center justify-center gap-4 group"
              >
                <ShoppingBag size={20} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
                {tDetail.initiateCheckout}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products - Scrapbook Stack */}
        {relatedProducts.length > 0 && (
          <div className="mt-60 space-y-20 border-t border-black/5 pt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#367F4D]">
                   <Star size={20} fill="currentColor" />
                   <p className="text-[10px] font-black tracking-[0.4em] uppercase">{tDetail.labSuggestions}</p>
                </div>
                <h2 className="text-6xl font-cloude tracking-tighter text-slate-900 italic leading-none">{tDetail.completeArchive}</h2>
              </div>
              <Link href="/our-coffee" className="inline-block text-[11px] font-black tracking-[0.4em] text-stone-400 hover:text-slate-900 border-b-2 border-black/5 pb-2 transition-all uppercase">
                {tDetail.browseFullCollection}
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {relatedProducts.map((p, idx) => (
                <Link key={p.id} href={`/our-coffee/${p.id}`} 
                   className="group space-y-8 bg-white p-6 border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                   style={{ transform: `rotate(${idx % 2 === 0 ? -1 : 1}deg)` }}
                >
                  <div className="relative aspect-square bg-stone-50 overflow-hidden border border-black/5">
                    <Image src={p.image} alt={p.name} fill className="object-cover transition-all duration-1000 grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 z-10">
                       <div className="px-3 py-1 bg-white border border-black/5 text-[9px] font-black tracking-widest text-slate-900 shadow-sm uppercase italic">
                          {p.roast_profile.split(' ')[0]}
                       </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-display font-black tracking-tighter text-slate-900 uppercase italic leading-none group-hover:text-[#367F4D] transition-colors">{p.name}</h3>
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-black text-stone-300 tracking-[0.3em] uppercase">{p.process}</p>
                       <p className="text-sm font-sans font-bold text-slate-900">Rp {p.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
