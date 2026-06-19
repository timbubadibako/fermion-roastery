"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Wand2, // Icon Magic Wand
  Users,
  Layers, // Icon Paket Langganan
  FileSpreadsheet, // Icon Catatan Penjualan
  ShoppingCart,
  Truck,
  Package, // Icon Stok Kopi
  BookOpen,
  Globe,
  LogOut,
  ChevronRight
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

const menuItems = [
  {
    group: "STATISTIK",
    items: [
      { name: "DASHBOARD", href: "/admin", icon: LayoutDashboard },
      { name: "MAGIC WAND", href: "/admin/magic", icon: Wand2 },
    ]
  },
  {
    group: "PENJUALAN",
    items: [
      { name: "PARTNER B2B", href: "/admin/partners", icon: Users },
      { name: "PAKET LANGGANAN", href: "/admin/subscriptions", icon: Layers },
      { name: "CATATAN PENJUALAN", href: "/admin/sales-ledger", icon: FileSpreadsheet }, // sesuaikan href ledger lu
    ]
  },
  {
    group: "OPERASIONAL",
    items: [
      { name: "DAFTAR PESANAN", href: "/admin/orders", icon: ShoppingCart },
      { name: "MANAJEMEN KIRIM", href: "/admin/shipping", icon: Truck },
      { name: "STOK KOPI", href: "/admin/inventory", icon: Package },
    ]
  },
  {
    group: "KONTEN",
    items: [
      { name: "JURNAL KOPI", href: "/admin/journal", icon: BookOpen },
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <aside className="w-64 bg-[#101828] h-screen fixed left-0 top-0 text-white flex flex-col z-50 border-r border-white/5">
      {/* Brand Header */}
      <div className="p-8 pb-12 text-left">
        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Fermion.</h2>
        <p className="text-[8px] font-bold text-slate-500 tracking-[0.3em] uppercase mt-2">Panel Admin</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-10 overflow-y-auto scrollbar-hide">
        {menuItems.map((group) => (
          <div key={group.group} className="space-y-4 text-left">
            <h4 className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">{group.group}</h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href || "#"}
                    className={`flex items-center justify-between group px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all ${isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="uppercase tracking-wider">{item.name}</span>
                    </div>
                    {isActive && <ChevronRight size={14} className="text-[#367F4D]" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Action Footer */}
      <div className="p-4 border-t border-white/5 space-y-1 text-left">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors font-bold text-xs uppercase tracking-wider"
        >
          <Globe size={16} />
          <span>Buka Website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors font-bold text-xs uppercase tracking-wider"
        >
          <LogOut size={16} />
          <span>Keluar Sesi</span>
        </button>
      </div>

      {/* User Session Profile Mini */}
      <div className="p-4 mx-4 mb-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 text-left">
        <div className="w-8 h-8 rounded-full bg-[#367F4D] flex items-center justify-center font-black text-xs text-white">
          N
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-white">local</p>
          <p className="text-[8px] text-slate-500 font-bold">local@fermion.com</p>
        </div>
      </div>
    </aside>
  );
}