"use client";

import { apiFetch } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Package,
  Users,
  Zap,
  AlertTriangle,
  Calendar as CalendarIcon,
  Coffee,
  X,
  ArrowUpRight,
  ShoppingCart,
  Building2,
  BookOpen,
  Plus,
  ChevronRight,
  Boxes,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { format, subDays } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

import { useI18n } from "@/lib/i18n";
import { useAuthStore } from "@/lib/store";

export default function AdminOverview() {
  const t = useI18n();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [churnAlerts, setChurnAlerts] = useState<any[]>([]);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  // Module Preview States
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [b2bApplications, setB2bApplications] = useState<any[]>([]);
  const [recentJournals, setRecentJournals] = useState<any[]>([]);

  // Timeframe State
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "custom">("30d");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const fetchVitals = async () => {
    if (!user || user.role !== "ADMIN") return;
    setLoading(true);
    try {
      let url = "/api/admin/stats";
      if (timeframe === "custom" && dateRange?.from && dateRange?.to) {
        url += `?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`;
      } else {
        const days = timeframe === "7d" ? 7 : 30;
        url += `?days=${days}`;
      }

      const [statsRes, churnRes, ordersRes, productsRes, b2bRes, journalRes] = await Promise.all([
        apiFetch(url),
        apiFetch("/api/admin/churn"),
        apiFetch("/api/admin/orders").catch(() => ({ ok: false, json: async () => [] })),
        supabase.from("products").select("id, name, stock_quantity, price_retail, category, is_active, origin").order("stock_quantity", { ascending: true }).limit(4),
        supabase.from("b2b_partners").select("id, company_name, status, tier_name, estimated_volume_kg, created_at, profiles:profile_id (email)").order("created_at", { ascending: false }).limit(4),
        supabase.from("journal_posts").select("id, title, category, status, created_at, featured_image").order("created_at", { ascending: false }).limit(3)
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (churnRes.ok) setChurnAlerts(await churnRes.json());

      if ('ok' in ordersRes && ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setRecentOrders(ordersData.slice(0, 4));
      }
      if (productsRes.data) setLowStockProducts(productsRes.data);
      
      if (b2bRes.data && b2bRes.data.length > 0) {
        const mappedB2b = b2bRes.data.map((item: any) => ({
          ...item,
          email: item.profiles?.email || 'N/A'
        }));
        setB2bApplications(mappedB2b);
      } else {
        const partnersRes = await apiFetch("/api/admin/partners").catch(() => null);
        if (partnersRes && partnersRes.ok) {
          const pData = await partnersRes.json();
          if (Array.isArray(pData)) setB2bApplications(pData.slice(0, 4));
        }
      }

      if (journalRes.data) setRecentJournals(journalRes.data);
    } catch (error) {
      console.error("Vitals fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN" && timeframe !== "custom") {
      fetchVitals();
    }
  }, [user, timeframe]);

  const handleApplyCustomRange = () => {
    if (dateRange?.from && dateRange?.to) {
      fetchVitals();
    } else {
      toast.error(t.admin.selectFullRange);
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800">Lunas</span>;
      case 'ROASTING':
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-100 text-purple-800">Pemanggangan</span>;
      case 'READY_TO_SHIP':
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-100 text-blue-800">Siap Kirim</span>;
      case 'SHIPPED':
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-indigo-100 text-indigo-800">Dikirim</span>;
      case 'UNPAID':
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-800">Belum Bayar</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-stone-100 text-stone-700">{status}</span>;
    }
  };

  if (loading && !stats) return (
    <div className="h-[65vh] flex flex-col items-center justify-center gap-4 text-slate-400 font-sans">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-[#367F4D] rounded-full animate-spin" />
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.admin.loading}</p>
    </div>
  );

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-200/80">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Ringkasan Operasional & Pusat Kontrol
          </h1>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest font-mono">
            PUSAT RINGKASAN MONITORING REAL-TIME SELURUH MODUL FERMION ROASTERY.
          </p>
        </div>

        {/* Timeframe & Refresh Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={fetchVitals}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-stone-50 transition-all shadow-xs"
            title="Refresh Data"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-[#367F4D]" : ""} />
          </button>

          <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-2xl border border-slate-300/50">
            <button
              onClick={() => setTimeframe("7d")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timeframe === "7d" ? 'bg-white text-[#367F4D] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.admin.days7}
            </button>
            <button
              onClick={() => setTimeframe("30d")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timeframe === "30d" ? 'bg-white text-[#367F4D] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.admin.days30}
            </button>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    timeframe === "custom" ? 'bg-white text-[#367F4D] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {timeframe === "custom" && dateRange?.from ? (
                    `${format(dateRange.from, "dd MMM")} - ${dateRange.to ? format(dateRange.to, "dd MMM") : '...'}`
                  ) : t.admin.custom}
                  <CalendarIcon size={13} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-slate-200" align="end">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.admin.reportRange}</p>
                </div>
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className="p-4"
                />
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => {
                      setTimeframe("custom");
                      handleApplyCustomRange();
                    }}
                    className="bg-[#367F4D] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold h-9 px-5 shadow-xs"
                  >
                    {t.admin.applyFilter}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* CHURN & URGENT ALERT BANNER */}
      <AnimatePresence>
        {churnAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="bg-red-50 border border-red-200/80 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-red-500/20 shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-full">
                    {t.admin.criticalAlert}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                  {churnAlerts[0].company_name} {t.admin.inactiveCompany}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {churnAlerts[0].last_order_date
                    ? `${Math.floor((new Date().getTime() - new Date(churnAlerts[0].last_order_date).getTime()) / (1000 * 3600 * 24))} ${t.admin.daysSinceLastOrder}`
                    : t.admin.noOrderHistory}
                </p>
              </div>
            </div>

            <button
              className="bg-slate-900 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors shadow-sm shrink-0 border-none"
              onClick={() => window.open(`https://wa.me/${churnAlerts[0].phone?.replace(/\D/g, '')}`, '_blank')}
            >
              {t.admin.contactWa}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BENTO STATS KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: t.admin.totalRevenue, val: `Rp ${((stats?.revenue || 0) / 1000000).toFixed(2)}jt`, icon: TrendingUp, color: "bg-blue-50 text-blue-600 border-blue-200", trend: t.admin.thisPeriod, link: "/admin/orders" },
          { label: t.admin.volumeFlow, val: `${(stats?.volume || 0).toFixed(1)} Kg`, icon: Package, color: "bg-emerald-50 text-[#367F4D] border-emerald-200", trend: t.admin.logistics, link: "/admin/inventory" },
          { label: t.admin.activePartner, val: stats?.activeSubs || 0, icon: Users, color: "bg-purple-50 text-purple-600 border-purple-200", trend: t.admin.stability, link: "/admin/partners" },
          { label: t.admin.needsReview, val: stats?.pendingB2B || 0, icon: Zap, color: "bg-amber-50 text-amber-600 border-amber-200", trend: t.admin.urgent, link: "/admin/partners" },
        ].map((s, i) => (
          <Link href={s.link} key={s.label}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md hover:border-slate-300 transition-all duration-300 text-left h-full group"
            >
              <div className="flex justify-between items-center">
                <div className={`w-10 h-10 rounded-xl ${s.color} border flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                  <s.icon size={18} strokeWidth={2.2} />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                  <span className="uppercase tracking-wider font-mono text-[9px]">{s.trend}</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
                <h4 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{s.val}</h4>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* MASTER MODULE PREVIEWS GRID (RINGKASAN INTEGRASI FITUR) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        
        {/* PREVIEW 1: LIVE ORDERS FEED */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                  <ShoppingCart size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Pesanan Masuk Terbaru</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Feed Operasional Transaksi Live</p>
                </div>
              </div>
              <Link href="/admin/orders" className="text-xs font-bold text-[#367F4D] hover:underline flex items-center gap-1">
                Lihat Kanban <ChevronRight size={14} />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">Belum ada pesanan terbaru</div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div key={order.id} className="p-3.5 rounded-xl border border-slate-100 bg-stone-50/50 hover:bg-stone-100/80 transition-colors flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-900">#ORD-{order.id.slice(0, 8)}</span>
                        {getOrderStatusBadge(order.status)}
                      </div>
                      <p className="text-xs font-bold text-slate-900 uppercase">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-slate-900">
                        Rp {parseInt(order.total_amount || '0').toLocaleString('id-ID')}
                      </p>
                      <p className="text-[9px] font-mono text-slate-400 uppercase">
                        {order.created_at ? new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Baru'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/admin/orders">
            <Button className="w-full h-11 bg-slate-900 hover:bg-[#367F4D] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-none">
              Kelola Antrean Pesanan Kanban <ArrowUpRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        {/* PREVIEW 2: INVENTORY & LOW STOCK WARNING */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#367F4D] border border-emerald-200 flex items-center justify-center">
                  <Boxes size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Status Katalog & Inventaris</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stok Terendah & Lot Kopi Active</p>
                </div>
              </div>
              <Link href="/admin/inventory" className="text-xs font-bold text-[#367F4D] hover:underline flex items-center gap-1">
                Buka Katalog <ChevronRight size={14} />
              </Link>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">Semua stok kopi terpantau aman</div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map(prod => {
                  const isLow = (prod.stock_quantity || 0) < 15;
                  return (
                    <div key={prod.id} className="p-3.5 rounded-xl border border-slate-100 bg-stone-50/50 hover:bg-stone-100/80 transition-colors flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 uppercase">{prod.name}</span>
                          {isLow && (
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-red-100 text-red-700 animate-pulse">
                              Stok Menipis
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{prod.origin || prod.category || 'Specialty'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono font-bold text-slate-900">
                          {prod.stock_quantity} Unit / Kg
                        </p>
                        <p className="text-[9px] font-mono text-[#367F4D] font-bold">
                          Rp {parseInt(prod.price_retail || '0').toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Link href="/admin/inventory">
            <Button className="w-full h-11 bg-slate-900 hover:bg-[#367F4D] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-none">
              Kelola Produk & Edit Stok <ArrowUpRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        {/* PREVIEW 3: B2B PARTNERSHIPS */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Kemitraan B2B & Cafe</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pengajuan Verifikasi & Tier Partner</p>
                </div>
              </div>
              <Link href="/admin/partners" className="text-xs font-bold text-[#367F4D] hover:underline flex items-center gap-1">
                Direktori B2B <ChevronRight size={14} />
              </Link>
            </div>

            {b2bApplications.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">Belum ada pengajuan B2B terdaftar</div>
            ) : (
              <div className="space-y-3">
                {b2bApplications.map(partner => (
                  <div key={partner.id} className="p-3.5 rounded-xl border border-slate-100 bg-stone-50/50 hover:bg-stone-100/80 transition-colors flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 uppercase">{partner.company_name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                          partner.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          partner.status === 'pending' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {partner.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">{partner.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#367F4D] block">
                        {partner.estimated_volume_kg || '50'} KG / BLN
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase">
                        {partner.tier_name || 'Bronze'} Tier
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/admin/partners">
            <Button className="w-full h-11 bg-slate-900 hover:bg-[#367F4D] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-none">
              Persetujuan & Pengaturan Tier B2B <ArrowUpRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        {/* PREVIEW 4: ROASTERY JOURNAL & STORIES */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Jurnal & Cerita Pemanggangan</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Publikasi Riset & Artikel Roastery</p>
                </div>
              </div>
              <Link href="/admin/journal" className="text-xs font-bold text-[#367F4D] hover:underline flex items-center gap-1">
                Buka Jurnal <ChevronRight size={14} />
              </Link>
            </div>

            {recentJournals.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">Belum ada cerita jurnal dipublikasikan</div>
            ) : (
              <div className="space-y-3">
                {recentJournals.map(journal => (
                  <div key={journal.id} className="p-3.5 rounded-xl border border-slate-100 bg-stone-50/50 hover:bg-stone-100/80 transition-colors flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 uppercase line-clamp-1">{journal.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-stone-200 text-slate-800">
                          {journal.category || 'Berita'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium">
                          {journal.created_at ? new Date(journal.created_at).toLocaleDateString('id-ID') : ''}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase ${
                        journal.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {journal.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/admin/journal/new">
            <Button className="w-full h-11 bg-slate-900 hover:bg-[#367F4D] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-none">
              Tulis Artikel / Jurnal Baru <Plus size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

      </div>

      {/* BOTTOM ANALYTICS & AI LAB GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">{t.admin.revenueAnalysis}</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{t.admin.financialPerformance}</p>
            </div>
            <CalendarIcon size={16} className="text-slate-400" />
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.revenueTrends || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: '600', fill: '#64748b' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: 'bold' }}
                  formatter={(val: number) => [`Rp ${val.toLocaleString('id-ID')}`, t.admin.revenue]}
                />
                <Bar
                  dataKey="revenue"
                  fill="#367F4D"
                  radius={[6, 6, 0, 0]}
                  barSize={timeframe === "7d" ? 48 : 24}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Roastery Lab Intelligence */}
        <div className="lg:col-span-4 bg-slate-900 p-6 sm:p-8 rounded-2xl text-white space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl -mr-32 -mt-32" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-emerald-400">
                <Coffee size={20} />
              </div>
              <h3 className="text-lg font-extrabold tracking-tight text-white uppercase" dangerouslySetInnerHTML={{ __html: t.admin.labAnalysis.replace(' ', ' ') }}></h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {t.admin.labDescPart1} <span className="text-emerald-400 font-bold">Sumedang Anaerob</span> {t.admin.labDescPart2}
            </p>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>{t.admin.roastAccuracy}</span>
                <span className="text-emerald-400 font-mono">98.2%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[98%] h-full bg-[#367F4D] rounded-full" />
              </div>
            </div>

            <button
              onClick={() => setIsComingSoonOpen(true)}
              className="w-full py-3.5 bg-white text-slate-950 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md hover:bg-[#367F4D] hover:text-white transition-all border-none"
            >
              {t.admin.aiStrategyBtn}
            </button>
          </div>
        </div>
      </div>

      {/* COMING SOON MODAL */}
      <AnimatePresence>
        {isComingSoonOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md p-8 space-y-6 shadow-2xl text-left border border-slate-200"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-extrabold text-slate-900">{t.admin.comingSoonTitle}</h2>
                <button onClick={() => setIsComingSoonOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={20} /></button>
              </div>
              <p className="text-xs font-medium text-slate-600 leading-relaxed">{t.admin.comingSoonDesc}</p>
              <Button onClick={() => setIsComingSoonOpen(false)} className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase text-xs border-none">
                {t.admin.okUnderstand}
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
