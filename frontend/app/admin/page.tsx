"use client";

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
  ChevronDown
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

export default function AdminOverview() {
  const t = useI18n();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [churnAlerts, setChurnAlerts] = useState<any[]>([]);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  
  // Timeframe State
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "custom">("30d");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const fetchVitals = async () => {
    setLoading(true);
    try {
      let url = "/api/admin/stats";
      if (timeframe === "custom" && dateRange?.from && dateRange?.to) {
        url += `?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`;
      } else {
        const days = timeframe === "7d" ? 7 : 30;
        url += `?days=${days}`;
      }

      const [statsRes, churnRes] = await Promise.all([
        fetch(url),
        fetch("/api/admin/churn")
      ]);
      
      if (statsRes.ok) setStats(await statsRes.json());
      if (churnRes.ok) setChurnAlerts(await churnRes.json());
    } catch (error) {
      console.error("Vitals fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeframe !== "custom") {
        fetchVitals();
    }
  }, [timeframe]);

  // Special effect for custom range application
  const handleApplyCustomRange = () => {
    if (dateRange?.from && dateRange?.to) {
        fetchVitals();
    } else {
        toast.error(t.admin.selectFullRange);
    }
  };

  if (loading && !stats) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
      <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">{t.admin.loading}</p>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/5 pb-10">
        <div className="space-y-3 text-left">
          <h1 className="text-5xl md:text-7xl font-display italic tracking-tighter text-slate-900 leading-none" dangerouslySetInnerHTML={{ __html: t.admin.overviewTitle.replace(' ', ' <br/> ') }}></h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{t.admin.overviewDesc}</p>
        </div>

        {/* Timeframe Picker UI */}
        <div className="flex items-center gap-3 bg-stone-100 p-1 rounded-sm border border-black/5 self-start md:self-end">
           <button 
            onClick={() => setTimeframe("7d")}
            className={`px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === "7d" ? 'bg-white text-[#367F4D] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
             {t.admin.days7}
           </button>
           <button 
            onClick={() => setTimeframe("30d")}
            className={`px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === "30d" ? 'bg-white text-[#367F4D] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
             {t.admin.days30}
           </button>
           
           <Popover>
              <PopoverTrigger asChild>
                <button 
                  className={`px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${timeframe === "custom" ? 'bg-white text-[#367F4D] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {timeframe === "custom" && dateRange?.from ? (
                    `${format(dateRange.from, "dd MMM")} - ${dateRange.to ? format(dateRange.to, "dd MMM") : '...'}`
                  ) : t.admin.custom}
                  <CalendarIcon size={12} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-sm shadow-2xl border-black/5" align="end">
                <div className="p-4 bg-stone-50 border-b border-black/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.admin.reportRange}</p>
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
                <div className="p-4 bg-stone-50 border-t border-black/5 flex justify-end">
                    <Button 
                        size="sm" 
                        onClick={() => {
                            setTimeframe("custom");
                            handleApplyCustomRange();
                        }}
                        className="bg-[#367F4D] text-white rounded-sm text-[9px] font-black uppercase tracking-widest h-10 px-6"
                    >
                        {t.admin.applyFilter}
                    </Button>
                </div>
              </PopoverContent>
           </Popover>
        </div>
      </div>

      {/* CHURN ALERT STICKY */}
      <AnimatePresence>
        {churnAlerts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="bg-white border border-red-100 rounded-sm p-8 flex items-center justify-between relative overflow-hidden group shadow-sm"
          >
            <div className="flex items-center gap-8 relative z-10 text-left">
              <div className="w-14 h-14 bg-red-500 rounded-sm flex items-center justify-center text-white shadow-xl shadow-red-500/10 border-none">
                  <AlertTriangle size={24} />
              </div>
              <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest bg-red-500 text-white px-3 py-0.5 rounded-full">{t.admin.criticalAlert}</span>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900">{churnAlerts[0].company_name} {t.admin.inactiveCompany}</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    {churnAlerts[0].last_order_date 
                      ? `${Math.floor((new Date().getTime() - new Date(churnAlerts[0].last_order_date).getTime()) / (1000 * 3600 * 24))} ${t.admin.daysSinceLastOrder}`
                      : t.admin.noOrderHistory}
                  </p>
              </div>
            </div>
            <button 
              className="bg-slate-900 text-white px-8 py-4 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition-all relative z-10 shadow-lg border-none"
              onClick={() => window.open(`https://wa.me/${churnAlerts[0].phone?.replace(/\D/g, '')}`, '_blank')}
            >
              {t.admin.contactWa}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BENTO STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: t.admin.totalRevenue, val: `Rp ${((stats?.revenue || 0) / 1000000).toFixed(2)}jt`, icon: TrendingUp, color: "text-blue-500", trend: t.admin.thisPeriod, link: "/admin/orders" },
          { label: t.admin.volumeFlow, val: `${(stats?.volume || 0).toFixed(1)} Kg`, icon: Package, color: "text-[#367F4D]", trend: t.admin.logistics, link: "/admin/inventory" },
          { label: t.admin.activePartner, val: stats?.activeSubs || 0, icon: Users, color: "text-emerald-500", trend: t.admin.stability, link: "/admin/partners" },
          { label: t.admin.needsReview, val: stats?.pendingB2B || 0, icon: Zap, color: "text-amber-500", trend: t.admin.urgent, link: "/admin/partners" },
        ].map((s, i) => (
          <Link href={s.link} key={s.label}>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-sm border border-black/5 shadow-sm space-y-6 relative overflow-hidden group hover:shadow-xl hover:border-black/10 transition-all duration-300 text-left h-full"
            >
               <div className="flex justify-between items-start relative z-10">
                  <div className={`w-10 h-10 rounded-sm bg-stone-50 flex items-center justify-center ${s.color} group-hover:bg-slate-900 group-hover:text-white transition-all border border-black/5`}>
                     <s.icon size={18} strokeWidth={2.5} />
                  </div>
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">{s.trend}</span>
               </div>
               <div className="relative z-10">
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">{s.label}</p>
                  <h4 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">{s.val}</h4>
               </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          <div className="lg:col-span-8 bg-white border border-black/5 rounded-sm p-10 shadow-sm space-y-10">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{t.admin.revenueAnalysis}</h3>
                   <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mt-1">{t.admin.financialPerformance}</p>
                </div>
                <CalendarIcon size={14} className="text-slate-200" />
             </div>
             
             <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.revenueTrends || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="label" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fontWeight: 'bold', fill: '#94a3b8' }} 
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                      contentStyle={{ borderRadius: '2px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', fontSize: '10px', fontWeight: 'bold' }}
                      formatter={(val: number) => [`Rp ${val.toLocaleString('id-ID')}`, t.admin.revenue]}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="#367F4D" 
                      radius={[2, 2, 0, 0]}
                      barSize={timeframe === "7d" ? 60 : 30}
                      animationDuration={1000}
                    />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900 p-10 rounded-sm text-white space-y-8 shadow-2xl relative overflow-hidden flex flex-col justify-between border border-black">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl -mr-32 -mt-32" />
             <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white"><Coffee size={18} /></div>
                   <h3 className="text-xl font-bold tracking-tighter leading-tight uppercase italic font-display text-white" dangerouslySetInnerHTML={{ __html: t.admin.labAnalysis.replace(' ', ' <br/> ') }}></h3>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium uppercase tracking-wider">{t.admin.labDescPart1} <span className="text-white font-bold italic">Sumedang Anaerob</span>{t.admin.labDescPart2}</p>
             </div>
             
             <div className="space-y-4 relative z-10">
                <div className="space-y-2">
                   <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500"><span>{t.admin.roastAccuracy}</span><span>98.2%</span></div>
                   <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`w-[98%] h-full bg-[#367F4D]`} />
                   </div>
                </div>
                <button 
                  onClick={() => setIsComingSoonOpen(true)}
                  className="w-full py-4 bg-white text-slate-950 rounded-sm font-black uppercase tracking-widest italic text-[9px] shadow-xl hover:bg-[#367F4D] hover:text-white transition-all border-none"
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
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-sm w-full max-w-md p-10 space-y-8 shadow-2xl text-left border border-black/5"
             >
                <div className="flex justify-between items-start">
                   <h2 className="font-display text-3xl italic font-bold text-slate-950 leading-none">{t.admin.comingSoonTitle}</h2>
                   <button onClick={() => setIsComingSoonOpen(false)}><X size={20} /></button>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{t.admin.comingSoonDesc}</p>
                <Button onClick={() => setIsComingSoonOpen(false)} className="w-full h-14 bg-slate-950 text-white rounded-sm font-black uppercase italic text-[10px] border-none">{t.admin.okUnderstand}</Button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
