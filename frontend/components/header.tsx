"use client";

import { useState, useEffect, useRef, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu, X, User, Search, ShoppingBag,
  LayoutDashboard, LayoutGrid, PackageSearch,
  Loader2, Coffee, Sparkles, ArrowRight, Languages
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CartSheet } from "./cart-sheet";
import { useAuthStore, useCartStore, useLangStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { siteContent } from "@/lib/content";
import { Sticker } from "./ui/sticker";
import { toast } from "sonner";

// 🟢 Perbarui interface agar mendukung kustomisasi warna active per link
interface CustomNavLink {
  label: string;
  href: string;
  activeColor: string;
}

interface BrandConfig {
  name: string;
  tagline: string;
  subTagline: string;
}

function HeaderComponent() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { addItem } = useCartStore();
  const { language, toggleLanguage } = useLangStore();
  const t = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- States ---
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

  const handleLanguageToggle = () => {
    const newLang = language === 'id' ? 'en' : 'id';
    toggleLanguage();
    if (newLang === 'en') {
      toast.success('Language switched to English', { description: 'All contents have been translated.' });
    } else {
      toast.success('Berhasil ganti bahasa', { description: 'Bahasa diubah ke Indonesia.' });
    }
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

  // 🟢 PERBAIKAN 1: HILANGKAN DELAY SCROLL DENGAN THRESHOLD YANG REALISTIS DAN SINKRON
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);

    const handleScroll = () => {
      const offset = window.scrollY;
      // Threshold diturunkan ke 20px biar pas di-scroll 1 jentikan jari, navbar langsung beradaptasi secara instan!
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

  // Daily B2B Pending Hint
  useEffect(() => {
    if (!mounted || !user) return;
    
    // Check if they are pending B2B (either role B2B with pending status, or retail with pending status)
    if (user.b2b_status === 'PENDING') {
      const today = new Date().toISOString().split('T')[0];
      const lastShown = localStorage.getItem('b2b_pending_hint_date');
      
      if (lastShown !== today) {
        setTimeout(() => {
          toast.custom((t) => (
            <div 
              onClick={() => { toast.dismiss(t); router.push('/account'); }}
              className="bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer hover:bg-amber-100 transition-all transform hover:scale-105"
            >
              <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" /> 
                Aksi Diperlukan
              </h4>
              <p className="text-xs font-medium text-amber-800 mt-1">
                Akun Grosir B2B Anda menunggu persetujuan. Klik di sini untuk mengunggah dokumen!
              </p>
            </div>
          ), { duration: 8000, position: 'top-center' });
          
          localStorage.setItem('b2b_pending_hint_date', today);
        }, 1500); // slight delay so it doesn't pop instantly on fast loads
      }
    }
  }, [user, mounted, router]);

  // Logic for light/dark text contrast based on page and scroll position
  const isLandingPage = pathname === "/";
  const isDarkHero = isLandingPage && !isScrolled;

  // 🟢 PERBAIKAN 2: SINKRONISASI WARNA DINAMIS UTK ELEMEN NON-LINKS (Icon / Text / Search Icon)
  // Menjaga agar tombol search dan icon teman-temannya sewarna dengan layout aslinya
  const currentTextColor = isDarkHero ? "text-white/80 hover:text-white" : "text-stone-500 hover:text-stone-900";

  // 🟢 REQUEST KEDUA: STRUKTUR DATA NAVLINKS DENGAN KUSTOMISASI WARNA ACTIVE MASING-MASING
  const isB2B = mounted && user?.role === 'B2B';
  const displayLinks: CustomNavLink[] = [
    { label: "OUR COFFEE", href: "/our-coffee", activeColor: "text-[#e6b13f]" }, // Ijo lab khas lu
    { label: "WHOLESALE", href: "/wholesale", activeColor: "text-stone-900" },   // Cokelat kopi wholesale
    { label: "SUBSCRIPTION", href: "/subscription", activeColor: "text-[#772c13]" }, // Ijo terang sub
    { label: "JOURNAL", href: "/journal", activeColor: "text-[#a152ec]" },
    { label: "OUR STORY", href: "/our-story", activeColor: "text-[#1f70da]" },
  ].filter(link => {
    if (isB2B && (link.href === "/wholesale" || link.href === "/subscription")) return false;
    return true;
  });

  return (
    <>
      {/* Floating Announcement */}
      {mounted && (
        <div className="fixed bottom-0 left-0 z-[80] w-80 h-40 pointer-events-none overflow-hidden hidden lg:block">
          <motion.div
            initial={{ x: -100, y: 100, rotate: 10 }}
            animate={{ x: -20, y: 10, rotate: 15 }}
            className="absolute bottom-4 left-[-48px] w-64 bg-[#FDFBF7] border border-black/10 shadow-[6px_6px_0px_rgba(0,0,0,0.03)] py-4 pointer-events-auto flex flex-col items-center justify-center rotate-[15deg]"
            style={{ borderRadius: "2px 8px 3px 6px" }}
          >
            <div className="absolute top-[-12px] right-10 w-12 h-4 bg-white/40 border border-black/5 rotate-[20deg] backdrop-blur-sm shadow-sm"></div>
            <div className="w-full py-1 flex flex-col items-center justify-center gap-1">
              <p className="text-[14px] font-cloude uppercase tracking-widest text-[#367F4D] leading-none">Free Shipping</p>
              <p className="text-[9px] font-display italic font-black text-stone-400 leading-none">Above Rp 500.000</p>
            </div>
            <svg className="w-16 opacity-10 mt-2" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5" stroke="currentColor" fill="transparent" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>
      )}

      <header className="fixed top-0 left-0 right-0 z-[100] pointer-events-none flex flex-col items-center">
        <motion.div
          initial={false}
          style={{ willChange: "margin-top, width, background-color, backdrop-filter, border-radius, height" }}
          animate={{
            marginTop: isScrolled ? 16 : 0,
            width: isScrolled ? "94%" : "100%",
            backgroundColor: isScrolled ? "rgba(253, 251, 247, 0.95)" : "rgba(255, 255, 255, 0)",
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
                {/* 🟢 FIXED: Filter invert agar logo menyesuaikan dengan kondisi background hero */}
                <Image
                  src="/fermion-logo.png"
                  alt={brand?.name || "Fermion Roastery"}
                  width={88}
                  height={35}
                  className={`object-contain transition-all duration-300 ${isDarkHero ? 'opacity-90' : ''}`}
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
                    className={`group relative text-[10px] font-black tracking-[0.2em] transition-all duration-300 uppercase ${isActive
                      ? link.activeColor // Menggunakan warna active custom masing-masing
                      : isDarkHero
                        ? "text-white/60 hover:text-white" // 🟢 FIXED: Pas di-hover di latar gelap, teks berubah jadi putih terang, gak hitam meredup lagi
                        : "text-stone-500 hover:text-stone-950"
                      }`}
                  >
                    {link.label}
                    {/* 🟢 FIXED UNDERLINE: Lepas kelas bg-[#367F4D] kaku, ganti jadi dinamis sesuai kondisi isDarkHero */}
                    <span className={`absolute -bottom-1 left-0 h-[1.5px] transition-all duration-500 ${isActive
                      ? `w-full opacity-100 ${isDarkHero ? 'bg-white' : 'bg-[#000000]'}`
                      : `w-0 opacity-0 group-hover:w-full group-hover:opacity-60 ${isDarkHero ? 'bg-white' : 'bg-[#000000]'}`
                      }`} />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0" ref={searchContainerRef}>
              <div className="relative hidden lg:block">
                {/* 🟢 FIXED: Memperbaiki background wrapper search button agar sewarna teman-temannya */}
                <div className={`flex items-center transition-all duration-700 ease-out h-10 ${isSearchOpen ? "w-64 md:w-[320px] bg-[#FDFBF7] border border-black/5 rounded-full px-4 shadow-sm" : "w-9"}`}>
                  <button id="tour-search-btn" onClick={() => setIsSearchOpen(!isSearchOpen)} className={`${currentTextColor} transition-colors flex-shrink-0 focus:outline-none`}>
                    <Search size={18} strokeWidth={2} />
                  </button>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search archives..."
                    className="bg-transparent border-none outline-none text-[11px] font-bold uppercase tracking-wider w-full transition-all duration-300 ml-2 placeholder:text-stone-300 text-stone-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ display: isSearchOpen ? 'block' : 'none' }}
                  />
                  {isSearchOpen && (
                    <button
                      onClick={() => { if (searchQuery) setSearchQuery(""); else setIsSearchOpen(false); }}
                      className="text-stone-400 hover:text-stone-900 transition-colors ml-2"
                    >
                      <X size={16} strokeWidth={2} />
                    </button>
                  )}
                </div>

                {/* Search Dropdown - Scrapbook Style */}
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, rotate: -1 }}
                      animate={{ opacity: 1, y: 0, rotate: 1 }}
                      exit={{ opacity: 0, y: 15, rotate: -1 }}
                      className="absolute top-14 right-0 w-64 md:w-[360px] bg-[#FDFBF7] border border-black/10 shadow-[8px_8px_0px_rgba(0,0,0,0.05)] rounded-xl p-8 overflow-hidden z-[110]"
                    >
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

              <div className={`hidden lg:block h-5 w-[1px] ${isDarkHero ? "bg-white/20" : "bg-black/10"}`} />

              {/* 🟢 FIXED: Menerapkan currentTextColor dinamis ke semua icon pendukung agar sewarna */}
              <div className="flex items-center gap-3 md:gap-4">
                <button 
                  id="tour-lang-btn"
                  onClick={handleLanguageToggle} 
                  title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
                  className={`${currentTextColor} transition-all flex items-center justify-center hover:scale-110`}
                >
                  <Languages size={20} strokeWidth={1.8} />
                </button>
                {mounted && (user?.role === 'RETAIL' || (user?.role === 'B2B' && user?.b2b_status === 'PENDING')) && (
                  <Link id="tour-account-btn" href="/account" title="My Account" className={`${currentTextColor} transition-all flex items-center gap-2 relative`}>
                    <PackageSearch size={20} strokeWidth={1.8} />
                    {user?.b2b_status === 'PENDING' && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white animate-pulse" />
                    )}
                  </Link>
                )}
                {mounted && user?.role === 'B2B' && user?.b2b_status !== 'PENDING' && (
                  <Link href="/b2b" title="Partner Hub" className={`${currentTextColor} transition-all flex items-center gap-2`}>
                    <LayoutGrid size={20} strokeWidth={1.8} />
                  </Link>
                )}
                {mounted && user?.role === 'ADMIN' && (
                  <Link href="/admin" title="Admin Portal" className={`${currentTextColor} transition-all flex items-center gap-2`}>
                    <LayoutDashboard size={20} strokeWidth={1.8} />
                  </Link>
                )}
                {mounted && !user && (
                  <Link id="tour-account-btn-login" href="/auth" title="Login" className={`${currentTextColor} transition-all flex items-center gap-2`}>
                    <User size={20} strokeWidth={1.8} />
                  </Link>
                )}
                {!mounted && (
                  <div className="w-18 h-4 animate-pulse bg-stone-50 rounded-full" />
                )}
              </div>

              {mounted && (
                <div id="tour-cart-wrapper" className={`relative border-l ${isDarkHero ? "border-white/20" : "border-black/10"} pl-3 md:pl-4`}>
                  <CartSheet isScrolled={isScrolled} />
                </div>
              )}

              <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className={`transition-colors lg:hidden ${currentTextColor}`}>
                {isMenuOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-24 left-4 right-4 bg-[#FDFBF7]/95 backdrop-blur-2xl border border-black/5 p-12 lg:hidden animate-in fade-in slide-in-from-top-4 duration-500 pointer-events-auto shadow-2xl rounded-3xl">
            <nav className="flex flex-col gap-8 text-center">
              <div className="relative mb-8 scrapbook-note px-2">
                <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 w-20 h-5 bg-white/60 border border-black/5 rotate-[-2deg] z-20 backdrop-blur-sm shadow-sm"></div>
                <div className="bg-[#FFFDF9] border border-black/10 rounded-sm px-5 py-4 flex items-center gap-3 shadow-[6px_6px_0px_rgba(0,0,0,0.03)] rotate-[0.5deg]">
                  <Search size={18} className="text-stone-500" />
                  <input
                    type="text"
                    placeholder="Search Specimen..."
                    className="bg-transparent border-none outline-none text-[12px] font-black uppercase tracking-widest w-full text-stone-900 placeholder:text-stone-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        router.push(`/our-coffee?search=${encodeURIComponent(searchQuery)}`);
                        setIsMenuOpen(false);
                      }
                    }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")}>
                      <X size={16} className="text-stone-400" />
                    </button>
                  )}
                </div>

                {/* Quick Results for Mobile Search */}
                {searchQuery.trim().length > 0 && filteredResults.length > 0 && (
                  <div className="mt-4 space-y-2 text-left bg-white/50 p-2 rounded-lg border border-black/5 shadow-inner">
                    {filteredResults.map((result) => (
                      <Link
                        key={result.id}
                        href={`/our-coffee/${result.id}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between p-3 bg-white border border-black/5 rounded shadow-sm hover:bg-stone-50 transition-colors"
                      >
                        <span className="text-[11px] font-black uppercase tracking-tight text-stone-900">{result.name}</span>
                        <ArrowRight size={12} className="text-stone-400" />
                      </Link>
                    ))}
                    <Link
                      href={`/our-coffee?search=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-center text-[10px] font-black text-[#367F4D] uppercase tracking-widest pt-2 hover:underline"
                    >
                      Examine All Results →
                    </Link>
                  </div>
                )}
              </div>

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

export const Header = memo(HeaderComponent);