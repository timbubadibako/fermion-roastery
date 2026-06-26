"use client";

import { apiFetch } from "@/lib/api";
import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Loader2,
  TrendingDown,
  ArrowRight,
  Coffee
} from "lucide-react";
import { CartSheet } from "@/components/cart-sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore, useCartStore } from "@/lib/store";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface Product {
  id: string;
  name: string;
  price_retail: number;
  origin: string;
  notes: string;
  price?: number; // Backend dynamic price
  priceType?: string;
  category?: string;
  sub_category?: string;
}

export default function WholesaleShopPage() {
  const t = useI18n();
  const { user } = useAuthStore();
  const { addItem, items, setIsOpen } = useCartStore(); // All hooks at the top
  const [partner, setPartner] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchPartnerAndProducts();
  }, [user]);

  const fetchPartnerAndProducts = async () => {
    try {
      const [pRes, prodRes] = await Promise.all([
        apiFetch(`/api/admin/partners?profileId=${user?.id}`),
        apiFetch(`/api/products?profileId=${user?.id}`)
      ]);

      if (pRes.ok) {
        const pData = await pRes.json();
        setPartner(pData.find((p: any) => p.profile_id === user?.id));
      }
      if (prodRes.ok) setProducts(await prodRes.json());
    } catch (e) {
      toast.error(t.b2bShop.toast.loadFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    const finalPrice = product.price || Number(product.price_retail);
    addItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      quantity: 1,
      image: "https://placehold.co/800x1000/367f4d/ffffff?text=FERMION+COFFEE",
      weight: "1000g", // B2B Default is 1KG
      grind: "Whole Bean",
      priceType: product.priceType || 'tier',
      original_price: Number(product.price_retail),
      isB2B: true
    });
    toast.success(t.b2bShop.toast.addedToCart.replace('{{name}}', product.name));
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
      <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">{t.b2bShop.loading}</p>
    </div>
  );

  const currentTier = partner?.tier_name || 'Bronze';
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="space-y-12 pb-20 relative text-left">
      {/* FLOATING CART BUTTON */}
      <div className="sticky top-24 z-40 flex justify-end pointer-events-none">
        <div className="pointer-events-auto">
          <Button onClick={() => setIsOpen(true)} className="h-14 px-6 rounded-sm bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-[#367F4D] transition-all flex items-center gap-3 border-none">
            <ShoppingCart size={18} />
            <span>{t.b2bShop.floatingCart.replace('{{count}}', String(totalItems))}</span>
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-end -mt-14">
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full w-fit mb-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
              {t.b2bShop.activeTierPrice.replace('{{tier}}', currentTier)}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none" dangerouslySetInnerHTML={{ __html: t.b2bShop.title }} />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{t.b2bShop.subtitle}</p>
        </div>
      </div>

      {/* VOLUME DISCOUNT BANNER */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm mb-8">
        <div className="p-3 bg-emerald-500 text-white rounded-full shrink-0">
          <TrendingDown size={20} />
        </div>
        <div className="space-y-1">
          <h3 className="font-black uppercase tracking-widest text-emerald-900 text-sm">{t.b2bShop.volumeDiscount.title}</h3>
          <p className="text-emerald-700 text-xs font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: t.b2bShop.volumeDiscount.description.replace('{{tier}}', currentTier) }} />
        </div>
      </div>

      {/* PRODUCT CATALOG GROUPS */}
      <div className="space-y-20">
        {['Espresso', 'Filter'].map((mainCat) => {
          // Group by subcategory using database fields first
          const getSubCat = (p: Product) => {
            if (p.category?.toLowerCase() === 'espresso') {
              if (p.sub_category?.toLowerCase() === 'specialty') return 'Espresso Specialty';
              return 'Espresso Komodity';
            } else if (p.category?.toLowerCase() === 'filter') {
              if (p.sub_category?.toLowerCase() === 'exotic') return 'Filter Exotic';
              return 'Filter Specialty';
            }

            // Fallback if db fields missing
            const n = p.name.toLowerCase();
            if (mainCat === 'Espresso') {
              if (n.includes('specialty')) return 'Espresso Specialty';
              return 'Espresso Komodity';
            } else {
              if (n.includes('exotic')) return 'Filter Exotic';
              return 'Filter Specialty';
            }
          };

          const catProducts = products.filter(p => {
            if (p.category) {
              return p.category.toLowerCase() === mainCat.toLowerCase();
            }
            // Fallback if db fields missing
            const n = p.name.toLowerCase();
            if (mainCat === 'Filter') return n.includes('filter') || n.includes('exotic') || n.includes('v60');
            return !(n.includes('filter') || n.includes('exotic') || n.includes('v60'));
          });

          // Do not hide the entire main category even if it's empty, 
          // the user wants to see the empty state.

          // Grouping subcategories
          const subs = mainCat === 'Espresso'
            ? ['Espresso Komodity', 'Espresso Specialty']
            : ['Filter Specialty', 'Filter Exotic'];

          return (
            <div key={mainCat} className="space-y-12">
              <div className="border-b-2 border-slate-900 pb-4">
                <h2 className="text-4xl font-display font-black italic tracking-tighter text-slate-900 uppercase">{t.b2bShop.categoryTitle.replace('{{category}}', mainCat)}</h2>
              </div>

              {subs.map(subCat => {
                const subProducts = catProducts.filter(p => getSubCat(p) === subCat);

                return (
                  <div key={subCat} className="space-y-6">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">{subCat}</h3>

                    {subProducts.length === 0 ? (
                      <div className="bg-stone-50 border border-dashed border-black/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                        <Coffee className="text-stone-300 mb-4" size={32} />
                        <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Belum Ada Produk</h4>
                        <p className="text-[10px] text-slate-400 mt-2">Koleksi untuk kategori ini sedang disiapkan.</p>
                      </div>
                    ) : (
                      <div className="flex overflow-x-auto gap-6 pb-8 pt-4 px-2 -mx-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {subProducts.map((product, i) => {
                          const wholesalePrice = product.price || product.price_retail;
                          const isDiscounted = wholesalePrice < product.price_retail;
                          // Placeholder image logic based on category
                          const imgUrl = mainCat === 'Espresso'
                            ? "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=800&q=80"
                            : "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80";

                          return (
                            <div key={product.id} className="w-[300px] md:w-[360px] shrink-0 snap-start">
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-2xl border border-black/5 flex flex-col group hover:border-[#367F4D]/30 transition-all shadow-sm hover:shadow-xl overflow-hidden h-full"
                              >
                                <div className="h-48 bg-stone-100 relative overflow-hidden">
                                  <img
                                    src={imgUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                  />
                                  <div className="absolute top-4 left-4">
                                    <span className="text-[8px] font-black bg-white px-3 py-1 rounded-sm border border-black/5 uppercase tracking-widest text-slate-500 shadow-sm">{product.origin || t.b2bShop.originBlend}</span>
                                  </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col justify-between">
                                  <div className="space-y-6">
                                    <div className="space-y-2">
                                      <h3 className="font-display text-3xl font-bold text-slate-900 uppercase italic tracking-tighter leading-tight">{product.name}</h3>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest line-clamp-3 leading-relaxed">"{product.notes}"</p>
                                  </div>

                                  <div className="pt-8 mt-8 border-t border-black/5 flex items-end justify-between">
                                    <div className="space-y-1">
                                      {isDiscounted && (
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest line-through">{t.b2bShop.retailLabel} {Number(product.price_retail).toLocaleString('id-ID')}</p>
                                      )}
                                      <p className="text-2xl font-bold text-slate-900 tracking-tight">
                                        Rp {Number(wholesalePrice).toLocaleString('id-ID')}
                                        <span className="text-[9px] text-slate-400 ml-1 font-black tracking-widest uppercase">{t.b2bShop.unitLabel}</span>
                                      </p>
                                    </div>
                                    <Button
                                      onClick={() => handleAddToCart(product)}
                                      size="icon"
                                      className="w-12 h-12 bg-slate-900 hover:bg-[#367F4D] text-white rounded-lg transition-all border-none shadow-md hover:shadow-xl shrink-0"
                                    >
                                      <Plus size={20} />
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 rounded-sm p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl -mr-32 -mt-32" />
        <div className="space-y-3 relative z-10">
          <h3 className="font-display text-4xl font-bold italic tracking-tighter text-white">{t.b2bShop.checkoutPrompt.title}</h3>
          <p className="text-[11px] text-slate-400 font-medium tracking-wider uppercase leading-relaxed max-w-md">{t.b2bShop.checkoutPrompt.description}</p>
        </div>
        <Link href="/b2b/checkout" className="w-full md:w-auto relative z-10">
          <Button className="w-full h-16 px-10 bg-white text-slate-950 font-black uppercase tracking-widest italic text-[10px] hover:bg-[#367F4D] hover:text-white transition-all shadow-xl group/btn border-none">
            {t.b2bShop.checkoutPrompt.button} <ArrowRight size={18} className="ml-3 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
      <CartSheet hideTrigger={true} />
    </div>
  );
}
