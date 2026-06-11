"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Loader2, Coffee, Save, X, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface CoffeeProduct {
  id: string;
  name: string;
  slug: string;
  notes: string;
  origin: string;
  process: string;
  altitude: string;
  price_retail: number;
  roast_profile: string;
  description: string;
  farm: string;
  image_url: string;
  fermentation: number;
  sweetness: number;
  acidity: number;
  body: number;
  stock_quantity: number;
  pricing_tiers?: { tier_name: string; unit_price: number }[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<CoffeeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CoffeeProduct | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<CoffeeProduct>>({
    name: "",
    price_retail: 0,
    origin: "",
    process: "",
    altitude: "",
    roast_profile: "Filter Roast",
    fermentation: 3,
    sweetness: 3,
    acidity: 3,
    body: 3,
    stock_quantity: 0,
    notes: "",
    description: "",
    image_url: "",
    pricing_tiers: [
      { tier_name: "Bronze", unit_price: 0 },
      { tier_name: "Silver", unit_price: 0 },
      { tier_name: "Gold", unit_price: 0 },
    ]
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (product: CoffeeProduct | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        // Map backend pricing_tiers to form field if it exists
        pricing_tiers: product.pricing_tiers?.length ? product.pricing_tiers : [
          { tier_name: "Bronze", unit_price: 0 },
          { tier_name: "Silver", unit_price: 0 },
          { tier_name: "Gold", unit_price: 0 },
        ]
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        slug: "",
        price_retail: 145000,
        origin: "",
        process: "",
        altitude: "",
        roast_profile: "Filter Roast",
        fermentation: 3,
        sweetness: 3,
        acidity: 3,
        body: 3,
        stock_quantity: 50,
        notes: "",
        description: "",
        image_url: "",
        pricing_tiers: [
          { tier_name: "Bronze", unit_price: 130000 },
          { tier_name: "Silver", unit_price: 120000 },
          { tier_name: "Gold", unit_price: 110000 },
        ]
      });
    }
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Auto-generate slug if missing
      const dataToSave = {
        ...formData,
        slug: formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-'),
        pricingTiers: formData.pricing_tiers // Backend expects pricingTiers camelCase
      };

      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : "/api/products";
      
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (res.ok) {
        toast.success(`Product ${editingProduct ? 'updated' : 'created'} successfully`);
        setIsFormOpen(false);
        fetchProducts();
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Failed to save product");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        fetchProducts();
      }
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.origin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
            Coffee <br/> Inventory.
          </h1>
          <p className="text-sm text-slate-500 font-medium">Manage your artisan selections and B2B pricing.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-64 bg-white border-slate-100 rounded-2xl h-14 font-bold text-xs uppercase tracking-widest"
            />
          </div>
          <Button 
            onClick={() => handleOpenForm()}
            className="bg-slate-900 text-white font-black tracking-[0.2em] px-8 h-14 rounded-2xl hover:bg-fermion-blue transition-all duration-500 uppercase italic shadow-xl shadow-slate-900/10"
          >
            <Plus size={18} className="mr-2" /> Add Product
          </Button>
        </div>
      </div>

      {/* Grid of Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full h-40 flex items-center justify-center">
            <Loader2 className="animate-spin text-fermion-blue" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full h-40 flex items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-200">
             <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No products found in inventory</p>
          </div>
        ) : (
          filteredProducts.map((p) => (
            <motion.div 
              layout
              key={p.id}
              className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col gap-6"
            >
              <div className="relative aspect-[4/3] bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100">
                <img src={p.image_url || "https://placehold.co/800x600/7a9cff/ffffff?text=NO+IMAGE"} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[8px] font-black tracking-widest text-slate-900 shadow-sm uppercase italic">
                   {p.roast_profile}
                </div>
              </div>

              <div className="flex-1 space-y-4 text-left">
                <div className="space-y-1">
                   <h3 className="text-xl font-black tracking-tight text-slate-900 uppercase italic leading-none">{p.name}</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.origin} • {p.process}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Retail Price</p>
                      <p className="text-sm font-mono font-black text-slate-900">Rp {Number(p.price_retail).toLocaleString()}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Stock</p>
                      <p className={`text-sm font-mono font-black ${p.stock_quantity < 10 ? "text-red-500" : "text-slate-900"}`}>{p.stock_quantity} Kg</p>
                   </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-50">
                <Button 
                  variant="outline" 
                  onClick={() => handleOpenForm(p)}
                  className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:border-slate-900 hover:text-slate-900"
                >
                  <Edit2 size={14} className="mr-2" /> Edit
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => handleDelete(p.id)}
                  className="h-12 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50 font-bold text-[10px] uppercase tracking-widest"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* PRODUCT FORM DIALOG */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[3.5rem] p-10">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">
              {editingProduct ? "Edit Product" : "Add New Coffee"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-10">
             {/* Section 1: Basic Info */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                      <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="h-14 bg-slate-50 border-none rounded-2xl font-bold uppercase tracking-tight" placeholder="e.g. KERINCI MOUNTAIN" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes (Tasting Notes)</label>
                      <Input value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="h-14 bg-slate-50 border-none rounded-2xl font-medium" placeholder="honey, lime, jasmine..." />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Origin</label>
                        <Input value={formData.origin} onChange={(e) => setFormData({...formData, origin: e.target.value})} className="h-14 bg-slate-50 border-none rounded-2xl font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Process</label>
                        <Input value={formData.process} onChange={(e) => setFormData({...formData, process: e.target.value})} className="h-14 bg-slate-50 border-none rounded-2xl font-bold uppercase" />
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Retail Price (Rp)</label>
                        <Input type="number" required value={formData.price_retail} onChange={(e) => setFormData({...formData, price_retail: Number(e.target.value)})} className="h-14 bg-slate-50 border-none rounded-2xl font-mono font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock (Kg)</label>
                        <Input type="number" value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: Number(e.target.value)})} className="h-14 bg-slate-50 border-none rounded-2xl font-mono font-bold" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                      <Input value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="h-14 bg-slate-50 border-none rounded-2xl text-xs font-mono" placeholder="https://..." />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Roast Profile</label>
                      <select 
                        value={formData.roast_profile} 
                        onChange={(e) => setFormData({...formData, roast_profile: e.target.value})}
                        className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold uppercase tracking-widest text-xs"
                      >
                         <option value="Filter Roast">Filter Roast</option>
                         <option value="Espresso Roast">Espresso Roast</option>
                         <option value="Omni Roast">Omni Roast</option>
                      </select>
                   </div>
                </div>
             </div>

             {/* Section 2: Sensory Profile */}
             <div className="bg-slate-50 p-10 rounded-[3rem] space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Sensory Character (1-5)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                   {['fermentation', 'sweetness', 'acidity', 'body'].map((feat) => (
                     <div key={feat} className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">{feat}</label>
                        <div className="flex gap-2">
                           {[1,2,3,4,5].map(v => (
                             <button 
                              key={v} 
                              type="button"
                              onClick={() => setFormData({...formData, [feat]: v})}
                              className={`w-6 h-6 rounded-full transition-all ${formData[feat as keyof CoffeeProduct] as number >= v ? "bg-fermion-blue" : "bg-slate-200 hover:bg-slate-300"}`}
                             />
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* Section 3: B2B Tier Pricing */}
             <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 ml-1">B2B Fixed Pricing Tiers</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {formData.pricing_tiers?.map((tier, idx) => (
                     <div key={tier.tier_name} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-fermion-blue">{tier.tier_name} Price</label>
                        <Input 
                          type="number" 
                          value={tier.unit_price} 
                          onChange={(e) => {
                            const newTiers = [...(formData.pricing_tiers || [])];
                            newTiers[idx].unit_price = Number(e.target.value);
                            setFormData({...formData, pricing_tiers: newTiers});
                          }}
                          className="h-12 bg-slate-50 border-none rounded-xl font-mono font-bold" 
                        />
                     </div>
                   ))}
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Narrative Description</label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="min-h-32 bg-slate-50 border-none rounded-3xl p-6 font-medium leading-relaxed" placeholder="Tell the story of this coffee..." />
             </div>

             <DialogFooter className="pt-10 border-t border-slate-50 flex gap-4">
                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="px-8 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]">Cancel</Button>
                <Button disabled={isSaving} className="bg-slate-900 text-white font-black tracking-[0.2em] px-12 h-14 rounded-2xl hover:bg-fermion-blue transition-all duration-500 uppercase italic shadow-2xl shadow-slate-900/20">
                   {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> {editingProduct ? "Update Product" : "Save Product"}</>}
                </Button>
             </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
