"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Package,
  Building2,
  PenTool,
  ShoppingCart,
  BookOpenCheck,
  LayoutDashboard,
  Layers,
  Truck,
  Globe,
  LogOut
} from "lucide-react";
import { useAuthStore } from "@/lib/store";

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const navItems = [
    { name: "Ringkasan", href: "/admin", icon: LayoutDashboard },
    { name: "Produk & Stok", href: "/admin/inventory", icon: Package },
    { name: "Partner B2B", href: "/admin/partners", icon: Building2 },
    { name: "Daftar Pesanan", href: "/admin/orders", icon: ShoppingCart },
    { name: "Journal Studio", href: "/admin/journal", icon: PenTool },
    { name: "Manual Ledger", href: "/admin/manual-ledger", icon: BookOpenCheck },
    { name: "Pengiriman", href: "/admin/shipping", icon: Truck },
    { name: "Langganan", href: "/admin/subscriptions", icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A]/95 backdrop-blur-xl border-b border-slate-800 text-white font-sans shadow-lg">
      {/* Top Utility & Status Bar */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-3 group">
            <Image
              src="/fermion-logo.png"
              alt="Fermion Roastery Logo"
              width={110}
              height={36}
              className="h-8 w-auto object-contain group-hover:scale-105 transition-transform"
              priority
            />
            <div className="border-l border-slate-700/80 pl-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold tracking-tight text-white uppercase font-mono">
                  ENGINE
                </span>
                <span className="bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                  PRO V2
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono font-medium">COMMAND CENTER</p>
            </div>
          </Link>
        </div>

        {/* Live System Status Indicators & User Profile */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2.5 bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-800 text-[10px] shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-semibold">SUPABASE REALTIME</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">XENDIT ONLINE</span>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              target="_blank" 
              className="hidden md:flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors bg-slate-800/60 hover:bg-slate-800 px-3.5 py-1.5 rounded-full border border-slate-700/60"
            >
              <Globe size={13} />
              <span>Lihat Web</span>
            </Link>

            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2 bg-slate-800/40 border border-slate-700/40 px-3 py-1 rounded-full">
              <div className="w-6 h-6 rounded-full bg-[#367F4D] flex items-center justify-center font-bold text-[10px] text-white">
                {user?.full_name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <span className="text-[11px] text-slate-200 font-semibold hidden md:inline truncate max-w-[140px]">
                {user?.full_name || user?.email || "Admin"}
              </span>
              <button 
                onClick={handleLogout}
                className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors ml-1" 
                title="Keluar Sesi"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Navigation Strip Tabs */}
      <nav className="bg-slate-950/80 px-6 py-2 flex items-center justify-between text-xs overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-xl font-medium text-[12px] whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-[#367F4D] text-white font-bold shadow-md shadow-emerald-950/40"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <Icon size={14} className={isActive ? "text-white" : "text-slate-400"} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
