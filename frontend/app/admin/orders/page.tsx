"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Clock, Search, Truck, Flame, XCircle, FileText, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  weight: string;
  grind: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  total_amount: number;
  shipping_fee: number;
  status: 'UNPAID' | 'PAID' | 'ROASTING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  xendit_invoice_id: string;
  shipping_courier: string | null;
  shipping_awb: string | null;
  created_at: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // States for updating shipping info
  const [activeResiOrderId, setActiveResiOrderId] = useState<string | null>(null);
  const [awbInput, setAwbInput] = useState("");
  const [courierInput, setCourierInput] = useState("JNE REG");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: string, payload: any = {}) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, ...payload }),
      });

      if (res.ok) {
        toast.success(`Order marked as ${newStatus}`);
        if (activeResiOrderId === id) setActiveResiOrderId(null);
        fetchOrders();
      } else {
        toast.error("Failed to update order");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleShipOrder = (id: string) => {
    if (!awbInput) {
      toast.error("Please enter a tracking number (AWB)");
      return;
    }
    updateOrderStatus(id, 'SHIPPED', { shipping_awb: awbInput, shipping_courier: courierInput });
  };

  const filteredOrders = orders.filter(o => 
    o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'UNPAID': return <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5"><Clock size={12}/> UNPAID</span>;
      case 'PAID': return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5"><CheckCircle2 size={12}/> PAID</span>;
      case 'ROASTING': return <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5"><Flame size={12}/> ROASTING</span>;
      case 'READY_TO_SHIP': return <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5"><Package size={12}/> READY TO SHIP</span>;
      case 'SHIPPED': return <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5"><Truck size={12}/> SHIPPED</span>;
      case 'DELIVERED': return <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5"><CheckCircle2 size={12}/> DELIVERED</span>;
      case 'CANCELLED': return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5"><XCircle size={12}/> CANCELLED</span>;
      default: return null;
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-fermion-french-blue" /></div>;

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
            Order <br/> Fulfillment.
          </h1>
          <p className="text-sm text-slate-500 font-medium max-w-xl">
            Process payments, assign to roasting batches, and manage shipping tracking.
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Search orders..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 w-full md:w-80 bg-white border-slate-100 rounded-2xl h-14 font-bold text-xs uppercase tracking-widest"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="h-40 flex items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-200">
             <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <motion.div 
              layout
              key={order.id} 
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
            >
              {/* Top Bar: ID, Date, Status */}
              <div className="flex flex-wrap items-center justify-between p-6 bg-slate-50/50 border-b border-slate-100 gap-4">
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                     <FileText size={16} className="text-slate-400" />
                   </div>
                   <div>
                     <p className="font-mono text-xs font-bold text-slate-900 uppercase">#{order.id.split('-')[0]}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                       {new Date(order.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                     </p>
                   </div>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Main Content */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Customer Details */}
                <div className="md:col-span-4 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer & Shipping</h4>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">{order.customer_name}</p>
                    <p className="text-xs text-slate-500">{order.customer_email} • {order.customer_phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {order.shipping_address}<br/>{order.shipping_city}
                    </p>
                  </div>
                  {order.shipping_awb && (
                    <div className="flex items-center gap-2 text-xs font-bold text-fermion-french-blue bg-fermion-french-blue/5 p-3 rounded-xl w-fit">
                      <Truck size={14} /> {order.shipping_courier} - {order.shipping_awb}
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="md:col-span-5 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order Items</h4>
                  <div className="space-y-3">
                    {order.items && order.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-start text-sm border-b border-slate-50 pb-3">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900">{item.quantity}x {item.name}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.weight} • {item.grind}</p>
                        </div>
                        <p className="font-mono font-bold text-slate-600">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals & Actions */}
                <div className="md:col-span-3 space-y-6 flex flex-col justify-between border-l border-slate-100 pl-8">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Subtotal</span>
                      <span className="font-mono">Rp {(order.total_amount - order.shipping_fee).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Shipping</span>
                      <span className="font-mono">Rp {Number(order.shipping_fee).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-100">
                      <span className="italic">TOTAL</span>
                      <span className="font-mono">Rp {Number(order.total_amount).toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Operational Actions */}
                  <div className="space-y-2 pt-4">
                    {order.status === 'PAID' && (
                      <Button 
                        onClick={() => updateOrderStatus(order.id, 'ROASTING')}
                        disabled={updatingId === order.id}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black tracking-widest uppercase text-[10px] h-12 rounded-xl"
                      >
                        {updatingId === order.id ? <Loader2 className="animate-spin" /> : "Assign to Roast Batch"}
                      </Button>
                    )}

                    {order.status === 'ROASTING' && (
                      <Button 
                        onClick={() => updateOrderStatus(order.id, 'READY_TO_SHIP')}
                        disabled={updatingId === order.id}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black tracking-widest uppercase text-[10px] h-12 rounded-xl"
                      >
                        {updatingId === order.id ? <Loader2 className="animate-spin" /> : "Finish Roast & Package (QC)"}
                      </Button>
                    )}

                    {order.status === 'READY_TO_SHIP' && activeResiOrderId !== order.id && (
                      <Button 
                        onClick={() => {
                          setActiveResiOrderId(order.id);
                          setAwbInput("");
                        }}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black tracking-widest uppercase text-[10px] h-12 rounded-xl"
                      >
                        Handover to Courier (Input AWB)
                      </Button>
                    )}

                    {activeResiOrderId === order.id && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in zoom-in-95">
                        <Input 
                          placeholder="Courier (e.g. JNE REG)" 
                          value={courierInput}
                          onChange={(e) => setCourierInput(e.target.value)}
                          className="h-10 text-xs font-bold bg-white"
                        />
                        <Input 
                          placeholder="AWB / No. Resi" 
                          value={awbInput}
                          onChange={(e) => setAwbInput(e.target.value)}
                          className="h-10 text-xs font-bold font-mono bg-white"
                        />
                        <div className="flex gap-2">
                          <Button variant="ghost" onClick={() => setActiveResiOrderId(null)} className="h-10 flex-1 text-[10px] font-bold uppercase tracking-widest">Cancel</Button>
                          <Button onClick={() => handleShipOrder(order.id)} disabled={updatingId === order.id} className="h-10 flex-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest">
                            {updatingId === order.id ? <Loader2 className="animate-spin" /> : "Ship Order"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {order.status === 'SHIPPED' && (
                      <Button 
                        onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                        disabled={updatingId === order.id}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black tracking-widest uppercase text-[10px] h-12 rounded-xl"
                      >
                        {updatingId === order.id ? <Loader2 className="animate-spin" /> : "Mark as Delivered"}
                      </Button>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
