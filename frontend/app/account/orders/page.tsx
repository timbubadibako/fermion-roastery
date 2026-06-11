"use client";

import React, { useState, useEffect } from "react";
import { useCartStore, useAuthStore } from "@/lib/store";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Flame, 
  ChevronRight, 
  Package,
  Calendar,
  CreditCard,
  MapPin,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  LogOut,
  User,
  Settings,
  ShieldCheck,
  CreditCard as PaymentIcon
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  xendit_invoice_id: string;
  status: 'UNPAID' | 'PAID' | 'ROASTING' | 'READY_TO_SHIP' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total_amount: number;
  created_at: string;
  shipping_courier: string | null;
  shipping_awb: string | null;
  items: any[];
}

export default function ProfileAndOrdersPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders/my-orders?profileId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      toast.error("Failed to fetch order history");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'UNPAID': return <CreditCard size={14} />;
      case 'PAID': return <CheckCircle2 size={14} />;
      case 'ROASTING': return <Flame size={14} />;
      case 'READY_TO_SHIP': return <Package size={14} />;
      case 'SHIPPED': return <Truck size={14} />;
      case 'DELIVERED': return <Package size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'UNPAID': return "Waiting Payment";
      case 'PAID': return "Confirmed";
      case 'ROASTING': return "Roasting Batch";
      case 'READY_TO_SHIP': return "QC & Packaging";
      case 'SHIPPED': return "In Transit";
      case 'DELIVERED': return "Delivered";
      default: return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4 font-sans">
          <ShieldCheck className="mx-auto text-fermion-blue" size={48} />
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Login Required</h2>
          <p className="text-slate-500">Please log in to view your account settings.</p>
          <Link href="/auth">
            <Button className="bg-slate-900 text-white rounded-xl px-8">Login Now</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-20 -mt-20" />
           
           <div className="relative z-10 w-24 h-24 bg-fermion-blue rounded-3xl flex items-center justify-center text-white text-3xl font-black italic shadow-xl shadow-fermion-blue/20">
              {user.full_name?.charAt(0) || 'U'}
           </div>

           <div className="relative z-10 flex-1 text-center md:text-left space-y-2">
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">{user.full_name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                 <p className="text-sm font-medium text-slate-400 flex items-center gap-1.5"><User size={14}/> {user.email}</p>
                 <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{user.role} Account</span>
              </div>
           </div>

           <div className="relative z-10 flex gap-3">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <LogOut size={16} /> Logout
              </button>
           </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1 bg-slate-200/50 rounded-2xl w-fit">
           <button 
              onClick={() => setActiveTab('orders')}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'orders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
              Order History
           </button>
           <button 
              onClick={() => setActiveTab('profile')}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'profile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
              Account Settings
           </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'orders' ? (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start"
            >
              {/* Order List */}
              <div className="md:col-span-5 space-y-4">
                {loading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-3xl animate-pulse" />)
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-sm space-y-4">
                    <Package size={48} className="mx-auto text-slate-100" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No orders yet</p>
                    <Link href="/our-coffee">
                       <Button variant="link" className="text-fermion-blue font-bold">Start Shopping →</Button>
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <button 
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`w-full bg-white p-6 rounded-[2rem] border transition-all text-left group flex items-center justify-between ${selectedOrder?.id === order.id ? 'border-fermion-blue shadow-lg shadow-fermion-blue/5' : 'border-slate-100 hover:border-slate-300 shadow-sm'}`}
                    >
                      <div className="space-y-1">
                        <p className="font-mono text-[10px] font-bold text-slate-400">#{order.id.split('-')[0].toUpperCase()}</p>
                        <p className="text-sm font-black text-slate-900 uppercase italic">
                          {order.items[0]?.name} {order.items.length > 1 ? `+${order.items.length - 1}` : ''}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                           <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${['PAID','ROASTING','READY_TO_SHIP','SHIPPED'].includes(order.status) ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}`}>
                             {getStatusIcon(order.status)} {getStatusLabel(order.status)}
                           </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className={`text-slate-300 transition-transform group-hover:translate-x-1 ${selectedOrder?.id === order.id ? 'text-fermion-blue' : ''}`} />
                    </button>
                  ))
                )}
              </div>

              {/* Timeline View */}
              <div className="md:col-span-7">
                {selectedOrder ? (
                  <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl space-y-10">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <h2 className="text-2xl font-black uppercase italic tracking-tighter">Live Tracking</h2>
                         <div className="flex flex-col gap-1 mt-1">
                            <p className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID: #{selectedOrder.id.split('-')[0].toUpperCase()}</p>
                            <div 
                               onClick={() => {
                                 navigator.clipboard.writeText(selectedOrder.xendit_invoice_id);
                                 toast.success("Invoice ID copied to clipboard!");
                               }}
                               className="bg-slate-50 p-2 rounded-lg border border-slate-100 group relative cursor-copy hover:bg-slate-100 transition-colors"
                            >
                               <p className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Xendit Invoice ID:</p>
                               <p className="font-mono text-[10px] font-black text-fermion-blue break-all">{selectedOrder.xendit_invoice_id}</p>
                               <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[8px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">Click to Copy</span>
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-lg font-black text-slate-900 leading-none">Rp {Number(selectedOrder.total_amount).toLocaleString('id-ID')}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Amount</p>
                      </div>
                    </div>

                    <div className="relative pl-8 space-y-12">
                      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />
                      
                      <TimelineStep 
                        active={['PAID', 'ROASTING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED'].includes(selectedOrder.status)} 
                        current={selectedOrder.status === 'PAID'}
                        icon={<CheckCircle2 size={12}/>}
                        label="Payment Confirmed"
                        description="Order received and added to our fulfillment queue."
                      />

                      <TimelineStep 
                        active={['ROASTING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED'].includes(selectedOrder.status)} 
                        current={selectedOrder.status === 'ROASTING'}
                        icon={<Flame size={12}/>}
                        label="Master Roasting"
                        description="Our roasters are currently processing your artisan coffee beans."
                      />

                      <TimelineStep 
                        active={['READY_TO_SHIP', 'SHIPPED', 'DELIVERED'].includes(selectedOrder.status)} 
                        current={selectedOrder.status === 'READY_TO_SHIP'}
                        icon={<Package size={12}/>}
                        label="QC & Packaging"
                        description="Quality control passed. Package is sealed and ready for pickup."
                      />

                      <TimelineStep 
                        active={['SHIPPED', 'DELIVERED'].includes(selectedOrder.status)} 
                        current={selectedOrder.status === 'SHIPPED'}
                        icon={<Truck size={12}/>}
                        label="Handed to Courier"
                        description={
                          selectedOrder.shipping_awb ? (
                            <div className="space-y-3 mt-2">
                              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="bg-white p-1.5 rounded-lg border border-slate-100">
                                  <Package size={14} className="text-fermion-blue" />
                                </div>
                                <div>
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{selectedOrder.shipping_courier || 'Courier'}</p>
                                  <p className="text-xs font-mono font-bold text-slate-900">{selectedOrder.shipping_awb}</p>
                                </div>
                              </div>
                              <a 
                                href={`https://track.biteship.com?waybill_id=${selectedOrder.shipping_awb}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-fermion-blue hover:text-blue-700 transition-colors"
                              >
                                Lacak via Biteship <ChevronRight size={12} />
                              </a>
                            </div>
                          ) : "In transit. Awaiting tracking details."
                        }
                      />

                      <TimelineStep 
                        active={selectedOrder.status === 'DELIVERED'} 
                        current={selectedOrder.status === 'DELIVERED'}
                        icon={<Package size={12}/>}
                        label="Success"
                        description="Delivered successfully. Your coffee ritual begins."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-[400px] flex flex-col items-center justify-center text-center bg-white border border-slate-100 rounded-[3rem] p-10">
                     <ChevronRight size={32} className="text-slate-100 mb-4" />
                     <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-300">Select an order <br/> to track progress</h3>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
               <SettingsCard icon={<MapPin size={18}/>} title="Shipping Address" desc="Manage your default delivery locations." />
               <SettingsCard icon={<PaymentIcon size={18}/>} title="Payment Methods" desc="Saved cards and digital wallets." />
               <SettingsCard icon={<Settings size={18}/>} title="Account Security" desc="Change password and two-factor auth." />
               <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-4">
                  <Sparkles className="text-fermion-blue" size={24} />
                  <h4 className="text-lg font-black uppercase italic tracking-tighter">Fermion Rewards</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">You have <span className="text-white font-bold">450 Points</span>. Earn 50 more to unlock free shipping on all orders.</p>
                  <Button className="w-full bg-white text-slate-900 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest italic hover:bg-fermion-blue hover:text-white transition-all">Redeem Points</Button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TimelineStep({ active, current, icon, label, description }: { active: boolean, current: boolean, icon: React.ReactNode, label: string, description: React.ReactNode }) {
  return (
    <div className={`relative transition-all duration-700 ${active ? 'opacity-100' : 'opacity-20 translate-x-2'}`}>
      <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-500 ${current ? 'bg-fermion-blue border-fermion-blue text-white scale-125 shadow-lg shadow-fermion-blue/30' : active ? 'bg-white border-slate-900 text-slate-900' : 'bg-white border-slate-200 text-slate-300'}`}>
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className={`text-xs font-black uppercase tracking-widest transition-colors ${current ? 'text-fermion-blue' : 'text-slate-900'}`}>{label}</h4>
        <div className="text-[11px] font-medium text-slate-500 leading-relaxed max-w-sm">{description}</div>
      </div>
    </div>
  );
}

function SettingsCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 hover:border-slate-300 transition-all group">
       <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-fermion-blue group-hover:text-white transition-all">
          {icon}
       </div>
       <div className="space-y-1">
          <h4 className="text-sm font-black uppercase italic tracking-tighter text-slate-900">{title}</h4>
          <p className="text-xs text-slate-500 font-medium">{desc}</p>
       </div>
       <Button variant="outline" className="w-full border-slate-100 rounded-xl h-12 text-[9px] font-black uppercase tracking-widest">Manage Settings</Button>
    </div>
  );
}
