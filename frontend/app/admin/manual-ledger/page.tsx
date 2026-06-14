"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Building2, 
  Coffee, 
  Scale, 
  Calendar,
  Save,
  X,
  CheckCircle2,
  TrendingUp,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ManualLedger() {
  const [partners, setPartners] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    partnerId: "",
    productId: "",
    weightKg: "",
    totalPaid: "",
    transactionDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/partners").then(res => res.json()),
      fetch("/api/products").then(res => res.json())
    ]).then(([pData, prodData]) => {
      setPartners(pData.filter((p: any) => p.status === 'approved'));
      setProducts(prodData);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.partnerId || !formData.productId || !formData.weightKg || !formData.totalPaid) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("/api/admin/manual-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Offline transaction protocol saved to ledger.");
        setIsModalOpen(false);
        setFormData({
          partnerId: "",
          productId: "",
          weightKg: "",
          totalPaid: "",
          transactionDate: new Date().toISOString().split('T')[0]
        });
      } else {
        toast.error("Failed to save transaction");
      }
    } catch (e) {
      toast.error("Network error");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-left">
          <h1 className="display-font text-6xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">Manual <br/> Ledger.</h1>
          <p className="text-sm font-medium text-slate-500">Log offline WhatsApp transactions to sync partner volume and history.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-slate-950 text-white rounded-2xl h-16 px-10 gap-3 font-black uppercase tracking-widest italic shadow-2xl hover:bg-periwinkle transition-all">
           <Plus size={20} /> Record Offline Protocol
        </Button>
      </div>

      <div className="bg-white border border-slate-100 rounded-[3.5rem] overflow-hidden shadow-sm">
         <div className="p-10 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Historical Records</h3>
            <div className="flex gap-4">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <Input placeholder="Search records..." className="pl-12 h-10 w-64 bg-slate-50 border-none rounded-full text-xs font-bold" />
               </div>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                     <th className="p-8">Protocol Date</th>
                     <th className="p-8">Cafe Partner</th>
                     <th className="p-8">Specimen</th>
                     <th className="p-8">Net Volume</th>
                     <th className="p-8 text-right">Settlement</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  <tr>
                     <td colSpan={5} className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs italic">No historical records found.</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>

      {/* MANUAL ENTRY MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
             <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3.5rem] w-full max-w-2xl p-12 space-y-10 shadow-2xl relative overflow-hidden text-left"
             >
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <span className="status-badge bg-slate-900 text-white uppercase tracking-widest">Offline_Sync</span>
                      <h2 className="display-font text-4xl italic font-black tracking-tighter text-slate-950 leading-none mt-2">New Entry.</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Record an external wholesale transaction</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Cafe Partner</label>
                         <select required value={formData.partnerId} onChange={e => setFormData({...formData, partnerId: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-xs font-bold text-slate-900">
                            <option value="">Select Approved Partner</option>
                            {partners.map(p => <option key={p.id} value={p.profile_id}>{p.company_name}</option>)}
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Specimen (SKU)</label>
                         <select required value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-xs font-bold text-slate-900">
                            <option value="">Select Coffee SKU</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Volume (KG)</label>
                         <div className="relative">
                            <Input required value={formData.weightKg} onChange={e => setFormData({...formData, weightKg: e.target.value})} type="number" step="0.1" placeholder="0.0" className="h-14 bg-slate-50 border-none rounded-2xl px-6 pl-14 font-black" />
                            <Coffee className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Net Settlement</label>
                         <div className="relative">
                            <Input required value={formData.totalPaid} onChange={e => setFormData({...formData, totalPaid: e.target.value})} type="number" placeholder="0" className="h-14 bg-slate-50 border-none rounded-2xl px-6 pl-14 font-black" />
                            <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                         </div>
                      </div>
                   </div>

                   <Button type="submit" className="w-full h-16 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] italic text-[10px] shadow-xl hover:bg-periwinkle transition-all">
                      Sync Transaction Protocol <Save size={18} className="ml-2" />
                   </Button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
