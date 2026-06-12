"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Loader2, Package, Calendar, Activity, ArrowUpRight, Save, Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Batch {
  id: string;
  product_id: string;
  product_name: string;
  batch_number: string;
  roast_date: string;
  quantity_kg: number;
  notes: string;
  created_at: string;
}

export default function AdminInventoryPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    product_id: "",
    batch_number: "",
    roast_date: new Date().toISOString().split('T')[0],
    quantity_kg: 0,
    notes: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [batchesRes, productsRes] = await Promise.all([
        fetch('/api/admin/batches'), // Need to implement this backend
        fetch('/api/products')
      ]);
      
      if (batchesRes.ok) setBatches(await batchesRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
    } catch (err) {
      console.error("Failed to load inventory", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_id || !formData.batch_number) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch('/api/admin/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("New roast batch recorded!");
        setIsAdding(false);
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to record batch");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-fermion-french-blue" /></div>;

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
            Inventory <br/> & Batches.
          </h1>
          <p className="text-sm text-slate-500 font-medium max-w-xl">
            Track green bean usage, roast dates, and available roasted stock across all products.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Search batches..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-full md:w-64 bg-white border-slate-100 rounded-2xl h-14 font-bold text-xs uppercase tracking-widest"
            />
          </div>
          <Button 
            onClick={() => setIsAdding(!isAdding)}
            className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest italic gap-2 shadow-xl hover:bg-fermion-blue transition-all"
          >
            {isAdding ? <Package size={18} /> : <Plus size={18} />}
            {isAdding ? "View Batches" : "Log New Batch"}
          </Button>
        </div>
      </div>

      {isAdding ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-10"
        >
           <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <Activity size={20} className="text-fermion-lilac" />
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Record New Roasting Session</h4>
           </div>

           <form onSubmit={handleAddBatch} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Product</label>
                    <select 
                      value={formData.product_id}
                      onChange={e => setFormData({...formData, product_id: e.target.value})}
                      className="w-full h-14 rounded-2xl bg-slate-50 border-none px-6 text-sm font-bold appearance-none cursor-pointer"
                    >
                      <option value="">Select Coffee...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Batch #</label>
                    <Input 
                      placeholder="e.g. FR-GAYO-001"
                      value={formData.batch_number}
                      onChange={e => setFormData({...formData, batch_number: e.target.value})}
                      className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Roast Date</label>
                    <Input 
                      type="date"
                      value={formData.roast_date}
                      onChange={e => setFormData({...formData, roast_date: e.target.value})}
                      className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Quantity (Kg)</label>
                    <Input 
                      type="number"
                      step="0.1"
                      value={formData.quantity_kg}
                      onChange={e => setFormData({...formData, quantity_kg: parseFloat(e.target.value)})}
                      className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm"
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Notes / Profile Details</label>
                 <Input 
                   placeholder="1st crack at 9:00, development 1:30..."
                   value={formData.notes}
                   onChange={e => setFormData({...formData, notes: e.target.value})}
                   className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm"
                 />
              </div>
              <Button type="submit" className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest italic flex items-center gap-3 shadow-xl">
                 <Save size={18} /> Confirm Batch Entry
              </Button>
           </form>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
           <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <History size={18} className="text-slate-400" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Recent Batches</h4>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50/50 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                          <th className="px-10 py-6">Batch ID</th>
                          <th className="px-10 py-6">Product</th>
                          <th className="px-10 py-6">Date</th>
                          <th className="px-10 py-6">Weight</th>
                          <th className="px-10 py-6 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {batches.filter(b => b.product_name.toLowerCase().includes(searchQuery.toLowerCase()) || b.batch_number.toLowerCase().includes(searchQuery.toLowerCase())).map((batch) => (
                          <tr key={batch.id} className="group hover:bg-slate-50/50 transition-colors">
                             <td className="px-10 py-6 font-mono text-[10px] font-bold text-slate-400">{batch.batch_number}</td>
                             <td className="px-10 py-6 font-bold text-slate-900 text-sm">{batch.product_name}</td>
                             <td className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {new Date(batch.roast_date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                             </td>
                             <td className="px-10 py-6">
                                <span className="bg-slate-900 text-white px-3 py-1 rounded-lg font-mono text-xs font-black italic">{batch.quantity_kg} Kg</span>
                             </td>
                             <td className="px-10 py-6 text-right">
                                <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-500 transition-colors">
                                   <Trash2 size={16} />
                                </Button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 {batches.length === 0 && (
                   <div className="p-20 text-center text-slate-300 font-black uppercase tracking-widest text-[10px]">No batch records found.</div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
