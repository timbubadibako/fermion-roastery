"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  Coffee, 
  Package, 
  Users, 
  ShoppingCart, 
  Truck, 
  BookOpen, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { 
    group: "Overview", 
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ]
  },
  { 
    group: "Commerce", 
    items: [
      { name: "Products", href: "/admin/products", icon: Coffee },
      { name: "Inventory", href: "/admin/inventory", icon: Package },
      { name: "B2B Partners", href: "/admin/partners", icon: Users },
    ]
  },
  { 
    group: "Operational", 
    items: [
      { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { name: "Shipping", href: "/admin/shipping", icon: Truck },
    ]
  },
  { 
    group: "Content", 
    items: [
      { name: "Journal", href: "/admin/journal", icon: BookOpen },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Clear the security cookie
    document.cookie = "fermion_profile_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/auth");
  };

  return (
    <aside className="w-64 bg-[#101828] h-screen fixed left-0 top-0 text-white flex flex-col z-50">
      {/* Brand Header */}
      <div className="p-8 pb-12">
        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Fermion.</h2>
        <p className="text-[8px] font-bold text-slate-500 tracking-[0.3em] uppercase mt-2">Command Center</p>
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
                      ? "bg-white/10 text-white" 
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
