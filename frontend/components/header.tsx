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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    window.location.href = "/auth";
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
      const threshold = pathname === "/" ? 4500 : 20;
      setIsScrolled(offset > threshold);
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
  const isB2B = mounted && user?.role === 'B2B';
  const displayLinks = [
    { label: "OUR COFFEE", href: "/our-coffee" },
    ...(!isB2B ? [{ label: "WHOLESALE", href: "/wholesale" }] : []),
    ...(!isB2B ? [{ label: "SUBSCRIPTION", href: "/subscription" }] : []),
    { label: "JOURNAL", href: "/journal" },
    { label: "OUR STORY", href: "/our-story" },
  ];

  return (
    <>
      {/* Floating Announcement (Scrapbook Taped Note - Bottom Left) */}
      {mounted && (
        <div className="fixed bottom-0 left-0 z-[80] w-80 h-40 pointer-events-none overflow-hidden hidden lg:block">
          <motion.div
            initial={{ x: -100, y: 100, rotate: 10 }}
            animate={{ x: -20, y: 10, rotate: 15 }}
            className="absolute bottom-4 left-[-48px] w-64 bg-[#FDFBF7] border border-black/10 shadow-[6px_6px_0px_rgba(0,0,0,0.03)] py-4 pointer-events-auto flex flex-col items-center justify-center rotate-[15deg]"
            style={{ borderRadius: "2px 8px 3px 6px" }}
          >
            {/* Masking Tape */}
            <div className="absolute top-[-12px] right-10 w-12 h-4 bg-white/40 border border-black/5 rotate-[20deg] backdrop-blur-sm shadow-sm"></div>
            
            <div className="w-full py-1 flex flex-col items-center justify-center gap-1">
              <p className="text-[14px] font-cloude uppercase tracking-widest text-[#367F4D] leading-none">Free Shipping</p>
              <p className="text-[9px] font-display italic font-black text-stone-400 leading-none">Above Rp 500.000</p>
            </div>

            {/* Squiggly line */}
            <svg className="w-16 opacity-10 mt-2" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5" stroke="currentColor" fill="transparent" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>
      )}

      <header className="fixed top-0 left-0 right-0 z-[100] pointer-events-none flex flex-col items-center">
        {/* The Simplified Clean Navbar */}
        <motion.div
          initial={false}
          animate={{
            marginTop: isScrolled ? 16 : 0,
            width: isScrolled ? "94%" : "100%",
            backgroundColor: isScrolled ? "rgba(253, 251, 247, 0.9)" : "rgba(255, 255, 255, 0)",
            backdropFilter: isScrolled ? "blur(16px)" : "blur(0px)",
            borderColor: isScrolled ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0)",
            borderRadius: isScrolled ? "16px" : "0px",
            boxShadow: isScrolled ? "0 10px 30px rgba(0,0,0,0.02)" : "0 0px 0px rgba(0,0,0,0)",
            height: isScrolled ? 64 : 80
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 30
          }}
          className="mx-auto pointer-events-auto border flex items-center justify-center relative max-w-[1400px]"
        >
          <div className="w-full flex items-center justify-between h-full px-6 md:px-10 relative">

            <div className={`flex-shrink-0 transition-opacity duration-300 ${isSearchOpen ? "opacity-0 md:opacity-100" : "opacity-100"}`}>
              <Link href="/" className="block hover:opacity-70 transition-opacity duration-300">
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

            <nav className={`hidden items-center justify-center gap-10 lg:flex flex-1 transition-all duration-500 ${isSearchOpen ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"}`}>
              {displayLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`group relative text-[10px] font-black tracking-[0.2em] transition-all duration-300 uppercase ${isActive ? "text-stone-900" : "text-stone-400 hover:text-[#367F4D]"}`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-[#367F4D] transition-all duration-500 ${isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"}`} />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-6 flex-shrink-0" ref={searchContainerRef}>
              <div className="relative">
                <div className={`flex items-center transition-all duration-700 ease-out h-10 ${isSearchOpen ? "w-64 md:w-[320px] bg-white border border-black/5 rounded-full px-4 shadow-sm" : "w-9"}`}>
                  <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-stone-900 hover:text-[#367F4D] transition-colors flex-shrink-0 focus:outline-none">
                    <Search size={18} strokeWidth={2.2} />
                  </button>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search archives..."
                    className={`bg-transparent border-none outline-none text-[11px] font-bold uppercase tracking-wider w-full transition-all duration-300 ml-2 placeholder:text-stone-300 text-stone-900 ${isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible width-0"}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {isSearchOpen && (
                    <button
                      onClick={() => { if (searchQuery) setSearchQuery(""); else setIsSearchOpen(false); }}
                      className="text-stone-300 hover:text-stone-900 transition-colors ml-2"
                    >
                      <X size={16} strokeWidth={2} />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown - Scrapbook Style */}
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, rotate: -1 }}
                      animate={{ opacity: 1, y: 0, rotate: 1 }}
                      exit={{ opacity: 0, y: 15, rotate: -1 }}
                      className="absolute top-14 right-0 w-64 md:w-[360px] bg-[#FDFBF7] border border-black/10 shadow-[8px_8px_0px_rgba(0,0,0,0.05)] rounded-xl p-8 overflow-hidden z-[110]"
                    >
                      {/* Decorative Tape */}
                      <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-20 h-4 bg-white/40 border border-black/5 rotate-[-2deg] z-20 backdrop-blur-sm shadow-sm"></div>

                      {!searchQuery ? (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between border-b border-black/5 pb-2">
                            <h4 className="text-[10px] font-black tracking-[0.3em] text-stone-400 uppercase italic">Curated Specimen</h4>
                            <Sparkles size={14} className="text-fermion-gold" strokeWidth={1.5} />
                          </div>
                          <div className="space-y-4">
                            {promotedProducts.map((product) => (
                              <Link
                                key={product.id}
                                href={`/our-coffee/${product.id}`}
                                onClick={() => setIsSearchOpen(false)}
                                className="flex items-center gap-5 p-2 hover:bg-stone-50 transition-all duration-300 group rounded-lg"
                              >
                                <div className="w-14 h-14 bg-white p-1 border border-black/5 shadow-sm overflow-hidden rotate-[-2deg] group-hover:rotate-0 transition-transform">
                                  <img src={product.image_url || "https://placehold.co/200x200/7a9cff/ffffff?text=FERMION"} alt={product.name} className="w-full h-full object-cover filter contrast-125 saturate-110" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-[11px] font-display font-black text-stone-900 leading-tight mb-0.5 uppercase truncate">{product.name}</p>
                                  <p className="text-[10px] font-cloude text-[#367F4D]">Rp {Number(product.price_retail).toLocaleString('id-ID')}</p>
                                </div>
                                <button
                                  onClick={(e) => handleQuickAdd(e, product)}
                                  className="p-2.5 bg-stone-900 text-white rounded-lg hover:bg-[#367F4D] transition-colors duration-500 shadow-md group-hover:scale-110 transition-transform"
                                >
                                  <ShoppingBag size={14} strokeWidth={2} />
                                </button>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between border-b border-black/5 pb-2">
                             <h4 className="text-[10px] font-black tracking-[0.3em] text-stone-400 uppercase italic">Matches Found</h4>
                             <p className="text-[9px] font-bold text-stone-300 tabular-nums">{filteredResults.length} Result(s)</p>
                          </div>
                          <div className="space-y-2">
                            {filteredResults.length > 0 ? (
                              filteredResults.map((result) => (
                                <Link
                                  key={result.id}
                                  href={`/our-coffee/${result.id}`}
                                  onClick={() => setIsSearchOpen(false)}
                                  className="w-full flex items-center justify-between p-3 hover:bg-stone-50 rounded-lg text-left transition-all duration-300 group border border-transparent hover:border-black/5"
                                >
                                  <div>
                                    <p className="text-[12px] font-display font-black text-stone-900 group-hover:text-[#367F4D] uppercase tracking-tight">{result.name}</p>
                                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">{result.origin}</p>
                                  </div>
                                  <ArrowRight size={14} strokeWidth={2} className="text-stone-200 group-hover:text-[#367F4D] group-hover:translate-x-1 transition-all" />
                                </Link>
                              ))
                            ) : (
                              <div className="py-12 text-center space-y-3">
                                <Search size={28} strokeWidth={2} className="mx-auto text-stone-100" />
                                <p className="text-[11px] font-display italic text-stone-300">No specimen matches your query.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="mt-6 pt-5 border-t border-black/5 text-center">
                        <Link
                          href={`/our-coffee?search=${encodeURIComponent(searchQuery)}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="text-[10px] font-black text-stone-400 hover:text-stone-900 transition-colors duration-300 uppercase tracking-[0.3em] flex items-center justify-center gap-2"
                        >
                          <span>Examine All Results</span>
                          <ArrowRight size={12} strokeWidth={2.5} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-4">
                {mounted && user?.role === 'RETAIL' && (
                  <Link href="/account" title="My Account" className="text-stone-900 hover:text-[#367F4D] transition-all flex items-center gap-2">
                    <PackageSearch size={20} strokeWidth={2} />
                  </Link>
                )}
                {mounted && user?.role === 'B2B' && (
                  <Link href="/b2b" title="Partner Hub" className="text-stone-900 hover:text-[#367F4D] transition-all flex items-center gap-2">
                    <LayoutGrid size={20} strokeWidth={2} />
                  </Link>
                )}
                {mounted && user?.role === 'ADMIN' && (
                  <Link href="/admin" title="Admin Portal" className="text-stone-900 hover:text-[#367F4D] transition-all flex items-center gap-2">
                    <LayoutDashboard size={20} strokeWidth={2} />
                  </Link>
                )}
                {mounted && !user && (
                  <Link href="/auth" title="Login" className="text-stone-900 hover:text-[#367F4D] transition-all flex items-center gap-2">
                    <User size={20} strokeWidth={2} />
                  </Link>
                )}
                {!mounted && (
                  <div className="w-18 h-4 animate-pulse bg-stone-50 rounded-full" />
                )}
              </div>

              {mounted && (
                <div className="relative border-l border-black/10 pl-4 ml-1">
                  <CartSheet />
                </div>
              )}

              <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className={`transition-colors lg:hidden text-stone-900 ${isSearchOpen ? "hidden" : "block"}`}>
                {isMenuOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
              </button>
            </div>
          </div>
        </motion.div>

        {isMenuOpen && (
          <div className="absolute top-24 left-4 right-4 bg-[#FDFBF7]/95 backdrop-blur-2xl border border-black/5 p-12 lg:hidden animate-in fade-in slide-in-from-top-4 duration-500 pointer-events-auto shadow-2xl rounded-3xl">
            <nav className="flex flex-col gap-8 text-center">
              {displayLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm font-black tracking-[0.4em] transition-colors uppercase italic text-stone-900" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="pt-8 mt-4 border-t border-black/5 flex flex-col gap-6 text-center">
                {mounted && user?.role === 'RETAIL' && (
                  <Link href="/account" className="text-[11px] font-black tracking-[0.3em] uppercase italic" onClick={() => setIsMenuOpen(false)}>My Account</Link>
                )}
                {mounted && user?.role === 'B2B' && (
                  <Link href="/b2b" className="text-[11px] font-black tracking-[0.3em] uppercase italic" onClick={() => setIsMenuOpen(false)}>Partner Hub</Link>
                )}
                {mounted && user?.role === 'ADMIN' && (
                  <Link href="/admin" className="text-[11px] font-black tracking-[0.3em] uppercase italic" onClick={() => setIsMenuOpen(false)}>Admin Portal</Link>
                )}
                {mounted && !user && (
                  <Link href="/auth" className="text-[11px] font-black tracking-[0.3em] uppercase italic" onClick={() => setIsMenuOpen(false)}>Login Account</Link>
                )}
                {mounted && (
                  <Link href="/cart" className="text-[11px] font-black tracking-[0.3em] uppercase italic" onClick={() => setIsMenuOpen(false)}>My Cart</Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
