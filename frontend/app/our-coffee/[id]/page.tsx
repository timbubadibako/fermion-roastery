"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Minus, Plus, Heart, Share2, ArrowLeft, ChevronDown, ChevronUp, Coffee, Beaker, MapPin, ShoppingBag, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CoffeeProduct {
  id: number;
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
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i <= level ? "bg-fermion-blue" : "bg-slate-200"}`} 
          />
        ))}
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<CoffeeProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<CoffeeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState("250g");
  const [grind, setGrind] = useState("Whole Beans");
  const [activeTab, setActiveTab] = useState<string | null>("description");

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        // Fetch current product
        const res = await fetch(`http://localhost:3001/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);

        // Fetch all products to filter related
        const allRes = await fetch(`http://localhost:3001/api/products`);
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
  }, [id]);

  const toggleTab = (tab: string) => setActiveTab(activeTab === tab ? null : tab);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-fermion-blue animate-spin" />
        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Grinding details...</p>
      </div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <p className="text-red-500 font-bold uppercase tracking-widest text-xs">Error: {error || 'Product not found'}</p>
    </div>
  );

  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-32 pb-40 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto px-12">
        {/* Back Link */}
        <Link href="/our-coffee" className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-12 uppercase text-left">
          <ArrowLeft size={14} /> Back to selection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start mb-32 relative">
          
          {/* Left Column: Image & Brewing Guide (STICKY) */}
          <div className="lg:sticky lg:top-32 space-y-12 h-fit">
            <div className="relative aspect-[4/5] bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
               <Image src={product.image} alt={product.name} fill className="object-cover" priority />
               <div className="absolute top-8 right-8 w-16 h-16 bg-slate-900 rounded-full flex flex-col items-center justify-center text-white border-2 border-white shadow-xl rotate-12">
                  <span className="text-[8px] font-bold tracking-tighter opacity-70 uppercase">Cup Score</span>
                  <span className="text-xs font-black italic tracking-tighter">85-87</span>
               </div>
            </div>

            {/* Brewing Guide Section */}
            <div className="bg-white/40 backdrop-blur-sm rounded-[2rem] p-8 border border-slate-100 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                  <Coffee size={24} className="text-fermion-blue" />
                </div>
                <div>
                   <h3 className="text-sm font-black tracking-widest uppercase">Brewing Guide</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master your cup</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-800 tracking-widest uppercase italic border-b border-slate-100 pb-2">FOR ESPRESSO</p>
                  <div className="space-y-2 text-[11px] font-bold text-slate-600">
                    <div className="flex justify-between uppercase tracking-tighter"><span>DOSE</span> <span>18 - 20g</span></div>
                    <div className="flex justify-between uppercase tracking-tighter"><span>YIELD</span> <span>32 - 36g</span></div>
                    <div className="flex justify-between uppercase tracking-tighter"><span>TIME</span> <span>22 - 26s</span></div>
                    <div className="flex justify-between uppercase tracking-tighter"><span>RATIO</span> <span>1 : 1.8</span></div>
                    <div className="flex justify-between uppercase tracking-tighter"><span>TEMP</span> <span>90°C - 93°C</span></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-800 tracking-widest uppercase italic border-b border-slate-100 pb-2">WITH MILK</p>
                  <div className="space-y-2 text-[11px] font-bold text-slate-600">
                    <div className="flex justify-between uppercase tracking-tighter"><span>DOSE</span> <span>18 - 20g</span></div>
                    <div className="flex justify-between uppercase tracking-tighter"><span>YIELD</span> <span>27 - 30g</span></div>
                    <div className="flex justify-between uppercase tracking-tighter"><span>TIME</span> <span>20 - 24s</span></div>
                    <div className="flex justify-between uppercase tracking-tighter"><span>RATIO</span> <span>1 : 1.5</span></div>
                    <div className="flex justify-between uppercase tracking-tighter"><span>TEMP</span> <span>90°C - 93°C</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex flex-col space-y-12">
            <div className="space-y-4 text-left">
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                {product.name}
              </h1>
              <p className="text-sm font-bold text-fermion-blue uppercase tracking-widest">
                {product.notes}
              </p>
              <div className="pt-4">
                <span className="text-3xl font-mono font-bold text-slate-800">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-y border-slate-100 py-4 space-y-4">
              {/* Description */}
              <div className="space-y-4">
                <button onClick={() => toggleTab('description')} className="w-full flex items-center justify-between text-xs font-black tracking-[0.2em] uppercase py-2">
                  Description {activeTab === 'description' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                {activeTab === 'description' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300 text-left">
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{product.description}</p>
                    <div className="grid grid-cols-1 gap-3 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <CharacterLevel label="Fermentation" level={product.fermentation} />
                       <CharacterLevel label="Sweetness" level={product.sweetness} />
                       <CharacterLevel label="Acidity" level={product.acidity} />
                       <CharacterLevel label="Body" level={product.body} />
                    </div>
                  </div>
                )}
              </div>
              <Separator className="bg-slate-50" />
              {/* Farm & Producer */}
              <div className="space-y-4">
                <button onClick={() => toggleTab('farm')} className="w-full flex items-center justify-between text-xs font-black tracking-[0.2em] uppercase py-2">
                  The Farm and Producer {activeTab === 'farm' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                {activeTab === 'farm' && (
                  <p className="text-sm text-slate-500 font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 text-left">{product.farm}</p>
                )}
              </div>
              <Separator className="bg-slate-50" />
              {/* Coffee & Process */}
              <div className="space-y-4">
                <button onClick={() => toggleTab('process')} className="w-full flex items-center justify-between text-xs font-black tracking-[0.2em] uppercase py-2">
                  The Coffee and The Process {activeTab === 'process' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                {activeTab === 'process' && (
                  <div className="space-y-2 text-sm text-slate-500 font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 text-left">
                    <p>Origin: {product.origin}</p>
                    <p>Process: {product.process}</p>
                    <p>Altitude: {product.altitude}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Selectors */}
            <div className="space-y-8 text-left">
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-white border-2 border-slate-100 rounded-xl p-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-lg transition-all"><Minus size={14}/></button>
                  <span className="w-10 text-center text-sm font-black">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-lg transition-all"><Plus size={14}/></button>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Weight | <span className="text-slate-900">{weight}</span></p>
                <div className="flex gap-3">
                  {["250g", "500g"].map(w => (
                    <button 
                      key={w} 
                      onClick={() => setWeight(w)} 
                      className={`px-10 py-4 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 ${
                        weight === w 
                          ? "bg-slate-900 text-white shadow-xl translate-y-[-2px]" 
                          : "bg-white border border-slate-200 text-slate-400 hover:border-slate-900 hover:text-slate-900"
                      }`}
                    >
                      {w.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Roast Profile</p>
                <div className="flex items-center gap-3 py-1">
                   <div className="w-2 h-2 rounded-full bg-fermion-blue animate-pulse" />
                   <span className="text-xs font-black text-slate-900 tracking-widest uppercase italic">
                      {product.roast_profile || "Medium Roast"}
                   </span>
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                      (Recommended for best flavor)
                   </span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Grind Size | <span className="text-slate-900">{grind}</span></p>
                <div className="flex flex-wrap gap-3">
                  {["Whole Beans", "Espresso Grind", "Filter Grind"].map(g => (
                    <button 
                      key={g} 
                      onClick={() => setGrind(g)} 
                      className={`px-8 py-4 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 ${
                        grind === g 
                          ? "bg-slate-900 text-white shadow-xl translate-y-[-2px]" 
                          : "bg-white border border-slate-200 text-slate-400 hover:border-slate-900 hover:text-slate-900"
                      }`}
                    >
                      {g.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4 pt-6 border-t border-slate-50 mt-6">
              <button className="w-full h-16 bg-white border-2 border-slate-900 text-slate-900 font-black tracking-[0.15em] hover:bg-slate-900 hover:text-white transition-all duration-500 active:scale-[0.98] rounded-2xl flex items-center justify-center gap-3 uppercase text-center">
                Add to Cart • Rp {(product.price * quantity).toLocaleString('id-ID')}
              </button>
              
              <button className="w-full h-16 bg-slate-900 text-white font-black tracking-[0.2em] hover:bg-fermion-blue transition-all duration-500 active:scale-[0.98] rounded-2xl shadow-2xl shadow-slate-900/20 uppercase italic flex items-center justify-center gap-3 text-center">
                <ShoppingBag size={18} strokeWidth={2.5} />
                Buy It Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-12 border-t border-slate-100 pt-20">
            <div className="flex items-end justify-between text-left">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-fermion-blue tracking-[0.3em] uppercase">Recommendations</p>
                <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">You may also like</h2>
              </div>
              <Link href="/our-coffee" className="text-[10px] font-black tracking-widest text-slate-400 hover:text-slate-900 border-b border-slate-200 pb-1 transition-all uppercase">
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/our-coffee/${p.id}`} className="group space-y-4">
                  <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                    <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[8px] font-black tracking-widest text-slate-900 shadow-sm border border-slate-100">
                       {(p.roast_profile || "Medium").split(' ')[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black tracking-tight text-slate-900 uppercase leading-none">{p.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{p.process}</p>
                    <p className="text-xs font-mono font-bold text-slate-800 pt-2">Rp {p.price.toLocaleString('id-ID')}</p>
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
