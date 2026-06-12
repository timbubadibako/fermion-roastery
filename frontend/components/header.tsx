"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu, X, User, Search, ShoppingBag,
  LayoutDashboard, LayoutGrid, PackageSearch,
  Loader2, Coffee, Sparkles, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CartSheet } from "./cart-sheet";
import { useAuthStore, useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { siteContent } from "@/lib/content";
import { Sticker } from "./ui/sticker";
import { toast } from "sonner";

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
  const { user, logout } = useAuthStore();
  const { addItem } = useCartStore();

  // --- States ---
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [promotedProducts, setPromotedProducts] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [brand, setBrand] = useState<BrandConfig | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Content from Library
  const announcementText = siteContent.announcement;

  // --- Handlers ---
  const handleLogout = () => {
    logout();
    router.push("/auth");
    setIsMenuOpen(false);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price_retail),
      quantity: 1,
      image: product.image_url || "https://placehold.co/200x200/7a9cff/ffffff?text=FERMION",
      weight: "250g",
      grind: "Whole Bean"
    });
    toast.success(`${product.name} added to cart!`);
    setIsSearchOpen(false);
  };

  // --- Effects ---
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setAllProducts(data);
          setPromotedProducts(data.slice(0, 2));
        }
      } catch (e) {
        console.error("Failed to fetch products for search:", e);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.origin && p.origin.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.notes && p.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5);
      setFilteredResults(filtered);
    } else {
      setFilteredResults([]);
    }
  }, [searchQuery, allProducts]);

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

  // V2 UI CONSTANTS: Smoother Pill Transition
  const displayLinks = navLinks.length > 0 ? navLinks : [
    { label: "OUR COFFEE", href: "/our-coffee" },
    { label: "WHOLESALE", href: "/wholesale" },
    ...(user?.role !== 'B2B' ? [{ label: "SUBSCRIPTION", href: "/subscription" }] : []),
    { label: "JOURNAL", href: "/journal" },
    { label: "OUR STORY", href: "/our-story" },
  ];

  return (
    <>
      {/* Floating Announcement (Diagonal Corner Ribbon - Bottom Left) */}
      <div className="fixed bottom-0 left-0 z-[110] w-80 h-40 pointer-events-none overflow-hidden hidden lg:block">
        <motion.div
          initial={{ x: -100, y: 800, rotate: 20 }}
          animate={{ x: -45, y: 25, rotate: 20 }}
          className="absolute bottom-6 left-[-40px] w-[120%] bg-white shadow-2xl border-y-[1.5px] border-slate-100 py-3 pointer-events-auto flex flex-col items-center justify-center"
          style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.12)" }}
        >
          <div className="border-y border-dashed border-slate-200 w-full py-2 flex flex-col items-center justify-center gap-0.5">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 leading-none">Free Shipping</p>
            <p className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mt-1">Above Rp 500.000</p>
          </div>
        </motion.div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-[100] pointer-events-none flex flex-col items-center">
        {/* The Pill Navbar - Smoothened with Framer Motion */}
        <motion.div
          initial={false}
          animate={{
            marginTop: isScrolled ? 24 : 0,
            width: isScrolled ? "90%" : "100%",
            backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0)",
            backdropFilter: isScrolled ? "blur(40px) saturate(180%)" : "blur(0px) saturate(100%)",
            borderColor: isScrolled ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0)",
            borderRadius: isScrolled ? "100px" : "0px",
            boxShadow: isScrolled ? "0 20px 50px rgba(0,0,0,0.1)" : "0 0px 0px rgba(0,0,0,0)",
            height: isScrolled ? 64 : 80
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 30,
            backgroundColor: { duration: 0.5 },
            backdropFilter: { duration: 0.5 }
          }}
          className="mx-auto pointer-events-auto border flex items-center justify-center relative max-w-[1400px]"
        >

          {/* Decorative Navbar Sticker */}
          {/* <div className="absolute -top-3 -left-4 hidden lg:block rotate-[-15deg]">
            <div className="bg-white p-1 shadow-md border-2 border-white rounded-lg">
              <div className="border border-dashed border-slate-100 p-1.5">
                <Coffee size={14} className="text-slate-200" />
              </div>
            </div>
          </div> */}

          <div className="w-full flex items-center justify-between h-full px-6 md:px-10 relative">

            <div className={`flex-shrink-0 transition-opacity duration-300 ${isSearchOpen ? "opacity-0 md:opacity-100" : "opacity-100"}`}>
              <Link href="/" className="block hover:scale-105 transition-transform duration-300">
                <Image
                  src="/fermion-logo.png"
                  alt={brand?.name || "Fermion Roastery"}
                  width={88}
                  height={35}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>

            <nav className={`hidden items-center justify-center gap-8 lg:flex flex-1 transition-all duration-500 ${isSearchOpen ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"}`}>
              {displayLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`group relative text-[9px] font-black tracking-[0.3em] transition-all duration-300 uppercase ${isActive ? "text-slate-900" : "text-slate-400 hover:text-fermion-french-blue"}`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] bg-fermion-french-blue transition-all duration-500 ${isActive ? "w-4 opacity-100" : "w-0 opacity-0"}`} />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-6 flex-shrink-0" ref={searchContainerRef}>
              <div className="relative">
                <div className={`flex items-center transition-all duration-700 ease-out h-9 ${isSearchOpen ? "w-64 md:w-[280px] bg-white/60 backdrop-blur-xl rounded-full px-4 shadow-lg shadow-slate-900/5" : "w-9"}`}>
                  <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-slate-900 hover:text-fermion-french-blue transition-colors flex-shrink-0 focus:outline-none">
                    <Search size={16} strokeWidth={1.5} />
                  </button>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Find your beans..."
                    className={`bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-wider w-full transition-all duration-300 ml-2 ${isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible width-0"}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {isSearchOpen && (
                    <button
                      onClick={() => { if (searchQuery) setSearchQuery(""); else setIsSearchOpen(false); }}
                      className="text-slate-300 hover:text-slate-900 transition-colors ml-2"
                    >
                      <X size={14} strokeWidth={2} />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-12 right-0 w-64 md:w-[320px] bg-white/90 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-[2rem] p-6 overflow-hidden z-[110]"
                    >
                      {!searchQuery ? (
                        <div className="space-y-5">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[9px] font-black tracking-[0.3em] text-slate-300 uppercase italic">Promoted</h4>
                            <Sparkles size={12} className="text-fermion-french-blue" />
                          </div>
                          <div className="space-y-4">
                            {promotedProducts.map((product) => (
                              <Link
                                key={product.id}
                                href={`/our-coffee/${product.id}`}
                                onClick={() => setIsSearchOpen(false)}
                                className="flex items-center gap-4 p-2 hover:bg-slate-50 rounded-2xl transition-all duration-300 group"
                              >
                                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/50">
                                  <img src={product.image_url || "https://placehold.co/200x200/7a9cff/ffffff?text=FERMION"} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-[10px] font-black text-slate-900 leading-tight mb-0.5 uppercase truncate">{product.name}</p>
                                  <p className="text-[9px] font-bold text-fermion-french-blue font-mono">Rp {Number(product.price_retail).toLocaleString('id-ID')}</p>
                                </div>
                                <button
                                  onClick={(e) => handleQuickAdd(e, product)}
                                  className="p-2 bg-slate-900 text-white rounded-xl hover:bg-fermion-french-blue transition-colors duration-500 shadow-md group-hover:scale-110 transition-transform"
                                >
                                  <ShoppingBag size={12} strokeWidth={1.5} />
                                </button>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h4 className="text-[9px] font-black tracking-[0.3em] text-slate-300 uppercase italic">Matches Found</h4>
                          <div className="space-y-1">
                            {filteredResults.length > 0 ? (
                              filteredResults.map((result) => (
                                <Link
                                  key={result.id}
                                  href={`/our-coffee/${result.id}`}
                                  onClick={() => setIsSearchOpen(false)}
                                  className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl text-left transition-all duration-300 group"
                                >
                                  <div>
                                    <p className="text-[11px] font-black text-slate-900 group-hover:text-fermion-french-blue uppercase tracking-tighter">{result.name}</p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{result.origin}</p>
                                  </div>
                                  <ArrowRight size={12} className="text-slate-200 group-hover:text-fermion-french-blue group-hover:translate-x-1 transition-all" />
                                </Link>
                              ))
                            ) : (
                              <div className="py-10 text-center space-y-2">
                                <Search size={24} className="mx-auto text-slate-100" />
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No specimen matches</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="mt-5 pt-5 border-t border-slate-100 text-center">
                        <Link
                          href={`/our-coffee?search=${encodeURIComponent(searchQuery)}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="text-[9px] font-black text-slate-400 hover:text-slate-900 transition-colors duration-300 uppercase tracking-[0.2em] italic"
                        >
                          View All Results →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-4">
                {user?.role === 'RETAIL' && (
                  <Link href="/account/orders" title="My Orders" className="text-slate-900 hover:text-fermion-french-blue transition-all flex items-center gap-2">
                    <PackageSearch size={18} strokeWidth={1.5} />
                  </Link>
                )}
                {user?.role === 'B2B' && (
                  <Link href="/b2b/dashboard" title="Partner Dashboard" className="text-slate-900 hover:text-fermion-french-blue transition-all flex items-center gap-2">
                    <LayoutGrid size={18} strokeWidth={1.5} />
                  </Link>
                )}
                {user?.role === 'ADMIN' && (
                  <Link href="/admin/dashboard" title="Admin Dashboard" className="text-slate-900 hover:text-fermion-french-blue transition-all flex items-center gap-2">
                    <LayoutDashboard size={18} strokeWidth={1.5} />
                  </Link>
                )}
                {!user && (
                  <Link href="/auth" title="Login" className="text-slate-900 hover:text-fermion-french-blue transition-all flex items-center gap-2">
                    <User size={18} strokeWidth={1.5} />
                  </Link>
                )}
              </div>

              {user?.role !== 'ADMIN' && (
                <div className="relative border-l border-slate-200/50 pl-4 ml-1">
                  <CartSheet />
                </div>
              )}

              <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className={`transition-colors lg:hidden text-slate-900 ${isSearchOpen ? "hidden" : "block"}`}>
                {isMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </motion.div>

        {isMenuOpen && (
          <div className="absolute top-24 left-4 right-4 bg-white/90 backdrop-blur-2xl border border-white/60 p-10 lg:hidden animate-in fade-in slide-in-from-top-4 duration-500 pointer-events-auto shadow-2xl rounded-[3rem]">
            <nav className="flex flex-col gap-8 text-center">
              {displayLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-xs font-black tracking-[0.4em] transition-colors uppercase italic text-slate-900" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="pt-8 mt-4 border-t border-slate-100 flex flex-col gap-6 text-center">
                {user?.role === 'RETAIL' && (
                  <Link href="/account/orders" className="text-[10px] font-black tracking-[0.3em] uppercase italic" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                )}
                {user?.role === 'B2B' && (
                  <Link href="/b2b/dashboard" className="text-[10px] font-black tracking-[0.3em] uppercase italic" onClick={() => setIsMenuOpen(false)}>Partner Dashboard</Link>
                )}
                {!user && (
                  <Link href="/auth" className="text-[10px] font-black tracking-[0.3em] uppercase italic" onClick={() => setIsMenuOpen(false)}>Login Account</Link>
                )}
                {user?.role !== 'ADMIN' && (
                  <Link href="/cart" className="text-[10px] font-black tracking-[0.3em] uppercase italic" onClick={() => setIsMenuOpen(false)}>My Cart</Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
