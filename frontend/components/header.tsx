"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, Search, ShoppingCart, Loader2 } from "lucide-react";
import { CartSheet } from "./cart-sheet";

const NAV_LINKS = [
  { label: "OUR COFFEE", href: "/retail" },
  { label: "WHOLESALE", href: "/wholesale" },
  { label: "SUBSCRIPTION", href: "/subscription" },
  { label: "JOURNAL", href: "/blog" },
  { label: "OUR STORY", href: "/about" },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Mock Data
  const promotedProducts = [
    { id: 1, name: "Fermion Espresso Blend", price: "Rp 125.000", img: "https://placehold.co/200x200/7a9cff/ffffff?text=Espresso+Blend" },
    { id: 2, name: "Kendal Honey Process", price: "Rp 145.000", img: "https://placehold.co/200x200/ffd700/0f172a?text=Honey+Process" },
  ];

  const mockSearchResults = [
    { id: 3, name: "Sumedang Anaerob", category: "Single Origin" },
    { id: 4, name: "Gayo Washed", category: "Specialty" },
    { id: 5, name: "Fermion Brew Mug", category: "Merchandise" },
    { id: 6, name: "Drip Bag Mix", category: "Coffee" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const isHomePage = pathname === "/";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        {/* Visual Header Wrapper (The part that actually animates and has background) */}
        <div 
          className={`mx-auto pointer-events-auto transition-all duration-500 ease-in-out ${
            isHomePage
              ? isScrolled 
                ? "mt-4 w-[98%] max-w-7xl bg-white/70 backdrop-blur-md border border-white/20 shadow-xl rounded-full h-16" 
                : "mt-0 w-full max-w-7xl bg-transparent border-transparent h-16"
              : "mt-0 w-full h-16 bg-white border-b border-slate-100 shadow-sm"
          }`}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between h-full px-12">
            {/* Left: Logo */}
            <div className={`flex-shrink-0 transition-opacity duration-300 ${isSearchOpen ? "opacity-0 md:opacity-100" : "opacity-100"}`}>
              <Link href="/" className="text-lg font-black tracking-tighter text-slate-900 uppercase">
                FERMION
              </Link>
            </div>

            {/* Center: Navigation Links */}
            <nav className={`hidden items-center justify-center gap-12 lg:flex flex-1 transition-all duration-300 ${isSearchOpen ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"}`}>
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`group relative text-[9px] font-bold tracking-[0.25em] transition-all duration-300 ${isActive ? "text-slate-900" : "text-slate-500 hover:text-fermion-blue"}`}
                  >
                    {link.label}
                    {/* Short Dash Active Indicator */}
                    <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] bg-fermion-blue transition-all duration-300 ${isActive ? "w-3 opacity-100" : "w-0 opacity-0"}`} />
                  </Link>
                );
              })}
            </nav>

            {/* Right: Action Icons & Search */}
            <div className="flex items-center gap-5 flex-shrink-0 relative" ref={searchContainerRef}>
              
              {/* Expanding Search Bar Container */}
              <div className="relative">
                <div className={`flex items-center transition-all duration-500 ease-out h-8 ${isSearchOpen ? "w-64 md:w-[340px] bg-slate-100 border border-slate-200/40 rounded-full px-3" : "w-8"}`}>
                  <button 
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="text-slate-800 hover:text-fermion-blue transition-colors flex-shrink-0 focus:outline-none"
                  >
                    <Search size={17} strokeWidth={1.5} />
                  </button>
                  
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    className={`bg-transparent border-none outline-none text-[11px] font-medium w-full transition-all duration-300 ml-2 ${isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible width-0"}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  
                  {isSearchOpen && (
                    <button 
                      onClick={() => {
                        if (searchQuery) setSearchQuery("");
                        else setIsSearchOpen(false);
                      }}
                      className="text-slate-400 hover:text-slate-600 transition-colors ml-2"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Search Dropdown Panel - Glassmorphism */}
                {isSearchOpen && (
                  <div className="absolute top-10 right-0 w-64 md:w-[340px] bg-white/80 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[1.5rem] mt-2 p-4 animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
                    {!searchQuery ? (
                      <div>
                        <h4 className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mb-3 px-1">Featured Products</h4>
                        <div className="space-y-2">
                          {promotedProducts.map((product) => (
                            <Link 
                              key={product.id} 
                              href={`/retail/${product.id}`}
                              className="flex items-center gap-3 p-2 bg-white/40 backdrop-blur-sm border border-white/20 hover:bg-white/60 rounded-xl transition-all duration-300 group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200/50">
                                <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              </div>
                              <div className="flex-1">
                                <p className="text-[11px] font-bold text-slate-800 leading-none mb-1">{product.name}</p>
                                <p className="text-[10px] font-semibold text-fermion-blue">{product.price}</p>
                              </div>
                              <div className="p-1.5 bg-fermion-blue/10 text-fermion-blue rounded-lg group-hover:bg-fermion-blue group-hover:text-white transition-colors duration-300">
                                <ShoppingCart size={12} strokeWidth={2} />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mb-3 px-1">Suggestions</h4>
                        <div className="space-y-0.5">
                          {mockSearchResults.map((result) => (
                            <button 
                              key={result.id}
                              className="w-full flex items-center justify-between p-2 bg-white/0 hover:bg-white/40 rounded-lg text-left transition-all duration-300 group"
                            >
                              <div>
                                <p className="text-[11px] font-bold text-slate-800 group-hover:text-fermion-blue">{result.name}</p>
                                <p className="text-[8px] font-medium text-slate-400">{result.category}</p>
                              </div>
                              <Search size={10} className="text-slate-300 group-hover:text-fermion-blue" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-slate-200/30">
                      <Link 
                          href={`/retail?search=${encodeURIComponent(searchQuery)}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="block w-full text-center text-[9px] font-bold text-slate-400 hover:text-fermion-blue transition-colors duration-300 uppercase tracking-widest"
                      >
                          View All Results
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/account" className={`text-slate-800 hover:text-fermion-blue transition-all duration-300`}>
                <User size={18} strokeWidth={1.5} />
              </Link>

              <CartSheet />

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`transition-colors lg:hidden text-slate-900 ${isSearchOpen ? "hidden" : "block"}`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 px-6 py-8 lg:hidden animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
            <nav className="flex flex-col gap-5">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-xs font-bold tracking-widest transition-colors ${isActive ? "text-fermion-blue" : "text-slate-900"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-6">
                <Link href="/account" className="flex items-center gap-2 text-xs font-bold" onClick={() => setIsMenuOpen(false)}>
                    <User size={18} /> ACCOUNT
                </Link>
                <Link href="/cart" className="flex items-center gap-2 text-xs font-bold" onClick={() => setIsMenuOpen(false)}>
                    <ShoppingCart size={18} /> CART (0)
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Announcement Bar (Sticky Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-slate-900/90 backdrop-blur-md text-white text-[9px] font-bold tracking-[0.3em] py-3 text-center uppercase border-t border-white/10">
        Free shipping for orders above Rp 500.000! (Indonesia only)
      </div>
    </>
  );
}
