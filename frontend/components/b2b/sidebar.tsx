"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  History, 
  ShieldCheck, 
  Settings, 
  LogOut,
  ChevronRight,
  Coffee
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

const menuItems = [
  { 
    group: "Partner Hub", 
    items: [
      { name: "Order Coffee", href: "/our-coffee", icon: Coffee },
    ]
  },
  { 
    group: "Business", 
    items: [
      { name: "Bulk Orders", href: "/b2b/orders", icon: Package },
      { name: "Order History", href: "/b2b/history", icon: History },
    ]
  },
  { 
    group: "Account", 
    items: [
      { name: "Maintenance", href: "/b2b/maintenance", icon: ShieldCheck },
      { name: "Partner Settings", href: "/b2b/settings", icon: Settings },
    ]
  }
];

export function B2BSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <aside className="w-64 bg-slate-950 h-screen fixed left-0 top-0 text-white flex flex-col z-50 border-r border-white/5">
      {/* Brand Header */}
      <div className="p-8 pb-12">
        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-fermion-french-blue">Fermion.</h2>
        <p className="text-[8px] font-bold text-slate-500 tracking-[0.3em] uppercase mt-2">Partner Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-10 overflow-y-auto scrollbar-hide">
        {menuItems.map((group) => (
          <div key={group.group} className="space-y-4">
            <h4 className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">{group.group}</h4>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href || "#"} 
                  className={`flex items-center justify-between group px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    pathname === item.href 
                      ? "bg-fermion-french-blue/10 text-fermion-french-blue" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} strokeWidth={pathname === item.href ? 2.5 : 2} />
                    <span>{item.name}</span>
                  </div>
                  {pathname === item.href && <ChevronRight size={14} className="text-fermion-french-blue" />}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-4 text-slate-500 hover:text-red-400 transition-colors font-bold text-sm"
        >
          <LogOut size={18} /> 
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
}
