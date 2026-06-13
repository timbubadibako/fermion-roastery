"use client";

import React, { useState, useEffect } from "react";
import { Truck, Loader2, Package, Search, ExternalLink, Edit2, Save, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Order {
  id: string;
  customer_name: string;
  status: string;
  shipping_courier: string;
  shipping_awb: string;
  total_amount: string;
  created_at: string;
}

export default function AdminShippingPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditEditForm] = useState({ awb: "", courier: "" });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        // Filter for orders that are PAID, ROASTING, or SHIPPED
        setOrders(data.filter((o: Order) => ['PAID', 'ROASTING', 'READY_TO_SHIP', 'SHIPPED'].includes(o.status)));
      }
    } catch (e) {
      toast.error("Failed to load shipping queue");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAWB = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          shipping_awb: editForm.awb, 
          shipping_courier: editForm.courier,
          status: editForm.awb ? 'SHIPPED' : undefined
        }),
      });

      if (res.ok) {
        toast.success("Shipping info updated");
        setEditingId(null);
        fetchOrders();
      }
    } catch (e) {
      toast.error("Update failed");
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-fermion-french-blue" /></div>;

  return (
    <div className="space-y-12 pb-20">
      <div className="space-y-2">
        <h1 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">Shipping <br/> Logistics.</h1>
        <p className="text-sm font-medium text-slate-500">Monitor all outgoing shipments and update tracking information.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order / Customer</th>
                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Courier</th>
                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Air Waybill (Resi)</th>
                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No active shipments in queue.</td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="p-6">
                           <div className="space-y-1">
                              <p className="font-bold text-slate-900 uppercase tracking-tight">#{order.id.slice(0, 8)}</p>
                              <p className="text-xs text-slate-500">{order.customer_name}</p>
                           </div>
                        </td>
                        <td className="p-6">
                           {editingId === order.id ? (
                             <Input 
                               value={editForm.courier} 
                               onChange={e => setEditEditForm({...editForm, courier: e.target.value})}
                               placeholder="JNE / J&T"
                               className="h-8 text-[10px] font-bold"
                             />
                           ) : (
                             <span className="text-xs font-black text-slate-600 uppercase">{order.shipping_courier || "—"}</span>
                           )}
                        </td>
                        <td className="p-6">
                           {editingId === order.id ? (
                             <Input 
                               value={editForm.awb} 
                               onChange={e => setEditEditForm({...editForm, awb: e.target.value})}
                               placeholder="AWB123456"
                               className="h-8 text-[10px] font-bold"
                             />
                           ) : (
                             <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-slate-400">{order.shipping_awb || "Not Assigned"}</span>
                                {order.shipping_awb && <ExternalLink size={12} className="text-fermion-french-blue cursor-pointer" />}
                             </div>
                           )}
                        </td>
                        <td className="p-6">
                           <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                             order.status === 'SHIPPED' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-600'
                           }`}>{order.status}</span>
                        </td>
                        <td className="p-6 text-right">
                           {editingId === order.id ? (
                             <div className="flex items-center justify-end gap-2">
                                <Button size="icon" variant="ghost" onClick={() => handleUpdateAWB(order.id)} className="text-emerald-500"><CheckCircle2 size={16} /></Button>
                                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="text-slate-400"><X size={16} /></Button>
                             </div>
                           ) : (
                             <Button size="icon" variant="ghost" onClick={() => {
                               setEditingId(order.id);
                               setEditEditForm({ awb: order.shipping_awb || "", courier: order.shipping_courier || "" });
                             }} className="text-slate-400 hover:text-fermion-french-blue">
                                <Edit2 size={16} />
                             </Button>
                           )}
                        </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
