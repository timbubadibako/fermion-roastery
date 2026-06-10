"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, Search, ShoppingBag, LayoutDashboard, LayoutGrid, PackageSearch, Loader2 } from "lucide-react";
import { CartSheet } from "./cart-sheet";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";

interface NavLink {
  label: string;
  href: string;
}

interface BrandConfig {
  name: string;
  tagline: string;
  subTagline: string;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  
  const [brand, setBrand] = useState<BrandConfig | null>(null);
  const [announcement, setAnnouncement] = useState("");
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Mock Search Data
  const promotedProducts = [
    { id: 1, name: "Fermion Espresso Blend", price: "Rp 125.000", img: "https://placehold.co/200x200/7a9cff/ffffff?text=Espresso+Blend" },
    { id: 2, name: "Kendal Honey Process", price: "Rp 145.000", img: "https://placehold.co/200x200/ffd700/0f172a?text=Honey+Process" },
  ];

  const mockSearchResults = [
    { id: 3, name: "Sumedang Anaerob", category: "Single Origin" },
    { id: 4, name: "Gayo Washed", category: "Specialty" },
    { id: 5, name: "Fermion Brew Mug", category: "Merchandise" },
  ];

  useEffect(() => {
    setIsScrolled(false);
    setIsMenuOpen(false);
    setIsSearchOpen(false);

    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 20);
    };

    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setIsSearchOpen(false); };
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pathname]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const isRectangleVariant = pathname.startsWith("/our-coffee");
  
  const rectangleClasses = "mt-0 w-full h-16 bg-white border-b border-slate-100 shadow-sm";
  const roundedClasses = isScrolled 
    ? "mt-4 w-[96%] max-w-[1400px] bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full h-16" 
    : "mt-0 w-full h-16 bg-transparent border-transparent";

  const activeWrapperClasses = isRectangleVariant ? rectangleClasses : roundedClasses;

  const displayLinks = navLinks.length > 0 ? navLinks : [
    { label: "OUR COFFEE", href: "/our-coffee" },
    { label: "WHOLESALE", href: "/wholesale" },
    ...(user?.role !== 'B2B' ? [{ label: "SUBSCRIPTION", href: "/subscription" }] : []),
    { label: "JOURNAL", href: "/journal" },
    { label: "OUR STORY", href: "/our-story" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className={`mx-auto pointer-events-auto transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${activeWrapperClasses}`}>
          <div className="max-w-[1400px] mx-auto flex items-center justify-between h-full px-6 md:px-12 relative w-full">
            
            <div className={`flex-shrink-0 transition-opacity duration-300 ${isSearchOpen ? "opacity-0 md:opacity-100" : "opacity-100"}`}>
              <Link href="/" className="text-2xl font-black tracking-[-0.04em] text-slate-900 uppercase italic">
                {brand?.name || "FERMION"}
              </Link>
            </div>

            <nav className={`hidden items-center justify-center gap-10 lg:flex flex-1 transition-all duration-500 ${isSearchOpen ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"}`}>
              {displayLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`group relative text-[10px] font-black tracking-[0.3em] transition-all duration-300 uppercase ${isActive ? "text-slate-900" : "text-slate-400 hover:text-fermion-blue"}`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] bg-fermion-blue transition-all duration-500 ${isActive ? "w-4 opacity-100" : "w-0 opacity-0"}`} />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-6 flex-shrink-0" ref={searchContainerRef}>
              <div className="relative">
                <div className={`flex items-center transition-all duration-700 ease-out h-10 ${isSearchOpen ? "w-64 md:w-[320px] bg-slate-50 border border-slate-200/50 rounded-full px-5" : "w-10"}`}>
                  <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-slate-900 hover:text-fermion-blue transition-colors flex-shrink-0 focus:outline-none">
                    <Search size={18} strokeWidth={2.5} />
                  </button>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Find your beans..."
                    className={`bg-transparent border-none outline-none text-[11px] font-bold uppercase tracking-wider w-full transition-all duration-300 ml-3 ${isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible width-0"}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {isSearchOpen && (
                    <button onClick={() => { if (searchQuery) setSearchQuery(""); else setIsSearchOpen(false); }} className="text-slate-300 hover:text-slate-900 transition-colors ml-2">
                      <X size={14} strokeWidth={3} />
                    </button>
                  )}
                </div>

                {isSearchOpen && (
                  <div className="absolute top-14 right-0 w-64 md:w-[320px] bg-white/95 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[2rem] mt-2 p-6 animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
                    {!searchQuery ? (
                      <div className="space-y-4">
                        <h4 className="text-[9px] font-black tracking-[0.3em] text-slate-300 uppercase italic">Curated</h4>
                        <div className="space-y-3">
                          {promotedProducts.map((product) => (
                            <Link key={product.id} href={`/our-coffee/${product.id}`} className="flex items-center gap-4 p-2 hover:bg-slate-50 rounded-2xl transition-all duration-300 group">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/50">
                                <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              </div>
                              <div className="flex-1">
                                <p className="text-[10px] font-black text-slate-900 leading-tight mb-0.5 uppercase">{product.name}</p>
                                <p className="text-[9px] font-bold text-fermion-blue font-mono">{product.price}</p>
                              </div>
                              <div className="p-2 bg-slate-900 text-white rounded-xl group-hover:bg-fermion-blue transition-colors duration-500 shadow-md">
                                <ShoppingBag size={12} strokeWidth={2.5} />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h4 className="text-[9px] font-black tracking-[0.3em] text-slate-300 uppercase italic">Suggestions</h4>
                        <div className="space-y-1">
                          {mockSearchResults.map((result) => (
                            <button key={result.id} className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl text-left transition-all duration-300 group">
                              <div>
                                <p className="text-[11px] font-black text-slate-900 group-hover:text-fermion-blue uppercase tracking-tighter">{result.name}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{result.category}</p>
                              </div>
                              <Search size={12} className="text-slate-200 group-hover:text-fermion-blue" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-5">
                {user?.role === 'RETAIL' && (
                  <Link href="/account/orders" title="My Orders" className="text-slate-900 hover:text-fermion-blue transition-all flex items-center gap-2">
                    <PackageSearch size={20} strokeWidth={2.5} />
                    <span className="hidden md:inline text-[9px] font-black tracking-widest uppercase">Orders</span>
                  </Link>
                )}
                {user?.role === 'B2B' && (
                  <Link href="/b2b/dashboard" title="Partner Dashboard" className="text-slate-900 hover:text-fermion-blue transition-all flex items-center gap-2">
                    <LayoutGrid size={20} strokeWidth={2.5} />
                    <span className="hidden md:inline text-[9px] font-black tracking-widest uppercase">Partner</span>
                  </Link>
                )}
                {user?.role === 'ADMIN' && (
                  <Link href="/admin/dashboard" title="Admin Dashboard" className="text-slate-900 hover:text-fermion-blue transition-all flex items-center gap-2">
                    <LayoutDashboard size={20} strokeWidth={2.5} />
                    <span className="hidden md:inline text-[9px] font-black tracking-widest uppercase">Admin</span>
                  </Link>
                )}
                {!user && (
                  <Link href="/auth" title="Login" className="text-slate-900 hover:text-fermion-blue transition-all flex items-center gap-2">
                    <User size={20} strokeWidth={2.5} />
                    <span className="hidden md:inline text-[9px] font-black tracking-widest uppercase">Login</span>
                  </Link>
                )}
              </div>

              {user?.role !== 'ADMIN' && (
                <div className="relative border-l border-slate-100 pl-5 ml-1">
                  <CartSheet />
                </div>
              )}

              <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className={`transition-colors lg:hidden text-slate-900 ${isSearchOpen ? "hidden" : "block"}`}>
                {isMenuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 px-10 py-12 lg:hidden animate-in slide-in-from-top-4 duration-500 pointer-events-auto shadow-2xl rounded-b-[3rem]">
            <nav className="flex flex-col gap-8 text-center">
              {displayLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm font-black tracking-[0.4em] transition-colors uppercase italic text-slate-900" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="pt-8 mt-4 border-t border-slate-100 flex flex-col gap-6">
                {user?.role === 'RETAIL' && (
                  <Link href="/account/orders" className="flex items-center justify-center gap-4 text-xs font-black tracking-[0.3em] uppercase italic" onClick={() => setIsMenuOpen(false)}>
                      <PackageSearch size={22} strokeWidth={2.5} /> My Orders
                  </Link>
                )}
                {user?.role === 'B2B' && (
                  <Link href="/b2b/dashboard" className="flex items-center justify-center gap-4 text-xs font-black tracking-[0.3em] uppercase italic" onClick={() => setIsMenuOpen(false)}>
                      <LayoutGrid size={22} strokeWidth={2.5} /> Partner Dashboard
                  </Link>
                )}
                {user?.role === 'ADMIN' && (
                  <Link href="/admin/dashboard" className="flex items-center justify-center gap-4 text-xs font-black tracking-[0.3em] uppercase italic" onClick={() => setIsMenuOpen(false)}>
                      <LayoutDashboard size={22} strokeWidth={2.5} /> Admin Dashboard
                  </Link>
                )}
                {!user && (
                  <Link href="/auth" className="flex items-center justify-center gap-4 text-xs font-black tracking-[0.3em] uppercase italic" onClick={() => setIsMenuOpen(false)}>
                      <User size={22} strokeWidth={2.5} /> Login Account
                  </Link>
                )}
                {user?.role !== 'ADMIN' && (
                  <Link href="/cart" className="flex items-center justify-center gap-4 text-xs font-black tracking-[0.3em] uppercase italic" onClick={() => setIsMenuOpen(false)}>
                      <ShoppingBag size={22} strokeWidth={2.5} /> My Cart
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-gradient-to-r from-slate-900 via-fermion-blue to-slate-900 backdrop-blur-md text-white text-[9px] font-black tracking-[0.5em] py-3.5 text-center uppercase border-t border-white/10">
        {announcement || "Free shipping for orders above Rp 500.000! (Indonesia only)"}
      </div>
    </>
  );
}
