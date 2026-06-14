"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Sparkles, 
  Users, 
  BookOpen, 
  Package, 
  BarChart3, 
  Edit3, 
  Settings,
  Coffee,
  ShieldCheck,
  Scale,
  FileText,
  History,
  LogOut,
  ChevronRight,
  Globe,
  Truck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";

interface SidebarProps {
  role: "ADMIN" | "B2B";
}

const adminMenu = [
  {
    group: "Statistik",
    items: [
      { id: "overview", label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { id: "magic", label: "Magic Wand", href: "/admin/magic", icon: Sparkles },
    ]
  },
  {
    group: "Penjualan",
    items: [
      { id: "partners", label: "Partner B2B", href: "/admin/partners", icon: Users },
      { id: "manual", label: "Catatan Penjualan", href: "/admin/manual-ledger", icon: BookOpen },
    ]
  },
  {
    group: "Operasional",
    items: [
      { id: "fulfillment", label: "Daftar Pesanan", href: "/admin/orders", icon: Package },
      { id: "shipping", label: "Manajemen Kirim", href: "/admin/shipping", icon: Truck },
      { id: "inventory", label: "Stok Kopi", href: "/admin/inventory", icon: BarChart3 },
    ]
  },
  {
    group: "Konten",
    items: [
      { id: "journal", label: "Jurnal Kopi", href: "/admin/journal", icon: Edit3 },
      { id: "settings", label: "Pengaturan Site", href: "/admin/settings", icon: Settings },
    ]
  }
];

const b2bMenu = [
  {
    group: "Utama",
    items: [
      { id: "overview", label: "Dashboard", href: "/b2b", icon: LayoutDashboard },
      { id: "shop", label: "Belanja Grosir", href: "/b2b/shop", icon: Coffee },
    ]
  },
  {
    group: "Layanan",
    items: [
      { id: "maintenance", label: "Servis Mesin", href: "/b2b/maintenance", icon: ShieldCheck },
      { id: "calibration", label: "Kalibrasi Rasa", href: "/b2b/calibration", icon: Scale },
    ]
  },
  {
    group: "Bisnis",
    items: [
      { id: "contract", label: "Kontrak Kerjasama", href: "/b2b/contract", icon: FileText },
      { id: "ledger", label: "Riwayat Pesanan", href: "/b2b/ledger", icon: History },
      { id: "shipping", label: "Pantau Kiriman", href: "/b2b/shipping", icon: Package },
    ]
  }
];

export function UnifiedSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  
  const menu = role === "ADMIN" ? adminMenu : b2bMenu;

  const handleLogout = () => {
    logout();
    window.location.href = "/auth";
  };

  return (
    <aside className="w-64 bg-slate-950 h-screen fixed left-0 top-0 text-white flex flex-col z-50 border-r border-white/5">
      {/* Brand Header */}
      <div className="h-24 flex flex-col justify-center px-8 border-b border-white/5">
        <h2 className="display-font text-2xl font-black italic tracking-tighter uppercase leading-none text-white">Fermion.</h2>
        <p className="text-[8px] font-bold text-slate-500 tracking-[0.4em] uppercase mt-2">
          {role === "ADMIN" ? "Panel Admin" : "Portal Partner"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-10 overflow-y-auto no-scrollbar">
        {menu.map((group) => (
          <div key={group.group} className="space-y-4">
            <h4 className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">
              {group.group}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.id} 
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between group px-4 py-3 rounded-2xl text-[11px] font-bold transition-all border-l-4",
                      isActive 
                        ? "bg-white/10 text-white border-white" 
                        : "text-slate-400 hover:text-white hover:bg-white/5 border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="uppercase tracking-widest">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight size={14} className="text-white/40" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / User */}
      <div className="p-4 border-t border-white/5 space-y-4">
        <Link href="/" className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black text-slate-500 hover:text-white hover:bg-white/5 transition-all">
          <Globe size={16} />
          <span className="uppercase tracking-widest">Buka Website</span>
        </Link>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 text-slate-500 hover:text-red-400 transition-colors font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <LogOut size={18} /> 
          <span>Keluar Sesi</span>
        </button>

        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-xs">
            {user?.full_name?.substring(0, 2).toUpperCase() || "JD"}
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <p className="text-[10px] font-bold truncate">{user?.full_name || "John Doe"}</p>
            <p className="text-[8px] text-slate-500 truncate">{user?.email || "admin@fermion.co"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
