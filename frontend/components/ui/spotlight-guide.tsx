"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSpotlightStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { X, ChevronRight, Check } from "lucide-react";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18n } from "@/lib/i18n";
import { debugLog } from "@/lib/debug";

// Define the steps for different pages
const getStepsConfig = (t: any): Record<string, any[]> => ({
  "/": [
    {
      id: "header-search",
      selector: "#tour-search-btn, #tour-search-mobile",
      title: t.spotlight.headerSearch?.title || "1. PENCARIAN & ARSIP KOPI",
      content: t.spotlight.headerSearch?.content || "Cari varietal kopi, origin, dan notes rasa secara presisi dengan katalog terindeks.",
      position: "bottom",
    },
    {
      id: "series-section",
      selector: "#tour-series-section",
      title: t.spotlight.seriesSection?.title || "2. PILIHAN ESPRESSO & FILTER",
      content: t.spotlight.seriesSection?.content || "Koleksi kopi dikelompokkan ke Espresso Series (body tebal & krema seimbang) dan Filter Series (acidity bersih & clarity tinggi).",
      position: "bottom",
    },
    {
      id: "add-to-cart-step",
      selector: "nav a[href='/our-coffee']",
      title: t.spotlight.addCartStep?.title || "3. MENAMBAHKAN KE KERANJANG",
      content: t.spotlight.addCartStep?.content || "Pembeli dapat memilih varian gilingan (Whole Bean / Filter / Espresso), ukuran kemasan (250g/1kg), lalu memasukkannya ke keranjang.",
      position: "bottom",
    },
    {
      id: "cart-weight-step",
      selector: "#tour-cart-wrapper",
      title: t.spotlight.cartWeightStep?.title || "4. KERANJANG & ESTIMASI BERAT",
      content: t.spotlight.cartWeightStep?.content || "Drawer keranjang interaktif menghitung akumulasi berat kopi (gram), varian gilingan, serta fasilitas promo gratis ongkir.",
      position: "bottom",
    },
    {
      id: "checkout-step",
      selector: "#tour-cart-wrapper",
      title: t.spotlight.checkoutStep?.title || "5. ALUR CHECKOUT & INPUT ALAMAT",
      content: t.spotlight.checkoutStep?.content || "Pada tahap checkout, pembeli mengisi nama penerima, alamat pengiriman (Kecamatan/Kota), dan sistem mengkalkulasi opsi kurir.",
      position: "bottom",
    },
    {
      id: "payment-step",
      selector: "#tour-cart-wrapper",
      title: t.spotlight.paymentStep?.title || "6. PEMBAYARAN ONLINE AUTOMATED",
      content: t.spotlight.paymentStep?.content || "Integrasi payment gateway Xendit mendukung QRIS, Transfer Bank VA, dan E-Wallet dengan konfirmasi pembayaran otomatis.",
      position: "bottom",
    },
    {
      id: "wholesale-section",
      selector: "#tour-wholesale-section",
      title: t.spotlight.wholesaleSection?.title || "7. KEMITRAAN B2B GROSIR & TIER DISKON",
      content: t.spotlight.wholesaleSection?.content || "Khusus pemilik kafe & partner B2B: Geser slider estimasi volume bulanan untuk melihat tier diskon grosir dan mengunduh draft kontrak.",
      position: "top",
    },
    {
      id: "subscription-link",
      selector: "nav a[href='/subscription']",
      title: t.spotlight.subscriptionLink?.title || "8. SIKLUS BERLANGGANAN FRESH ROAST",
      content: t.spotlight.subscriptionLink?.content || "Fitur berlangganan bulanan yang dikurasi langsung oleh Head Roaster Mr. Yanotama. Kopi segar di-roasting dan dikirim sesuai siklus.",
      position: "bottom",
    },
    {
      id: "account-portal-step",
      selector: "#tour-account-btn, #tour-account-btn-login",
      title: t.spotlight.accountPortalStep?.title || "9. PELAKASAN PESANAN & MULTI-PORTAL",
      content: t.spotlight.accountPortalStep?.content || "Pantau status roasting & resi kurir secara realtime melalui Dashboard Akun (Retail, Partner Hub B2B, atau Admin Portal).",
      position: "bottom",
    }
  ],
  "/our-coffee": [
    {
      id: "catalog-header",
      selector: "h1",
      title: t.spotlight.catalog.title,
      content: t.spotlight.catalog.content,
      position: "bottom",
    },
    {
      id: "catalog-tools",
      selector: "#catalog-tools-btn",
      title: t.spotlight.tools.title,
      content: t.spotlight.tools.content,
      position: "bottom",
    },
    {
      id: "catalog-sort",
      selector: "#catalog-sort-btn",
      title: t.spotlight.sort.title,
      content: t.spotlight.sort.content,
      position: "bottom",
    },
    {
      id: "product-card",
      selector: ".product-kopi-card",
      title: t.spotlight.card.title,
      content: t.spotlight.card.content,
      position: "right",
    },
    {
      id: "add-to-cart",
      selector: "#tour-add-to-cart-btn",
      title: t.spotlight.addCart?.title || "Add to Cart",
      content: t.spotlight.addCart?.content || "Add to Cart",
      position: "bottom",
    },
    {
      id: "open-cart",
      selector: "#tour-cart-wrapper",
      title: t.spotlight.openCart?.title || "Open Cart",
      content: t.spotlight.openCart?.content || "Open Cart",
      position: "bottom",
    }
  ],
  "/cart": [
    {
      id: "cart-header",
      selector: "h1",
      title: t.spotlight.cartPage?.title || "Cart",
      content: t.spotlight.cartPage?.content || "Cart",
      position: "bottom",
    },
    {
      id: "address-selection",
      selector: "#tour-address-selection",
      title: t.spotlight.addressSelection?.title || "Shipping Address",
      content: t.spotlight.addressSelection?.content || "Shipping Address",
      position: "bottom",
    },
    {
      id: "account-hint",
      selector: "#tour-account-btn, #tour-account-btn-login",
      title: t.spotlight.headerAccount?.title || "Account",
      content: t.spotlight.accountSaveHint?.content || "To save your addresses for future orders, you can register or log in from the menu up here.",
      position: "bottom",
    }
  ],
  "/checkout": [
    {
      id: "checkout-header",
      selector: "h1, h2",
      title: t.spotlight.checkout?.title || "Checkout",
      content: t.spotlight.checkout?.content || "Checkout",
      position: "bottom",
    }
  ],
  "/wholesale": [
    {
      id: "wholesale-header",
      selector: "h1",
      title: t.spotlight.wholesalePage?.title || "Wholesale",
      content: t.spotlight.wholesalePage?.content || "Wholesale",
      position: "bottom",
    },
    {
      id: "wholesale-slider",
      selector: "#tour-wholesale-slider",
      title: t.spotlight.wholesaleSlider?.title || "Volume Slider",
      content: t.spotlight.wholesaleSlider?.content || "Adjust your monthly volume estimation here to see how it affects your partnership tier.",
      position: "right",
    },
    {
      id: "wholesale-tier",
      selector: "#tour-wholesale-tier",
      title: t.spotlight.wholesaleTier?.title || "Partnership Tier",
      content: t.spotlight.wholesaleTier?.content || "Your projected tier, roastery discounts, and total savings will dynamically update here.",
      position: "bottom",
    },
    {
      id: "wholesale-benefit-card",
      selector: "#tour-wholesale-benefit-card",
      title: t.spotlight.wholesaleBenefitCard?.title || "Quality Assurance",
      content: t.spotlight.wholesaleBenefitCard?.content || "This is one of our six core promises. Every partnership comes with a guarantee of excellence.",
      position: "bottom",
    },
    {
      id: "wholesale-join",
      selector: "#tour-wholesale-join",
      title: t.spotlight.wholesaleJoin?.title || "Join the Network",
      content: t.spotlight.wholesaleJoin?.content || "Ready to elevate your coffee program? Click here to begin the registration process and become a partner.",
      position: "top",
    }
  ],
  "/b2b/register": [
    {
      id: "b2b-register-header",
      selector: "#tour-b2b-header",
      title: t.spotlight.b2bRegHeader?.title || "Registration Progress",
      content: t.spotlight.b2bRegHeader?.content || "Follow these three steps: account creation, profile setup, and contract finalization.",
      position: "right",
    },
    {
      id: "b2b-register-form",
      selector: "#tour-b2b-form",
      title: t.spotlight.b2bRegForm?.title || "Partnership Form",
      content: t.spotlight.b2bRegForm?.content || "Fill in your details and estimated monthly volume to help us prepare your custom B2B dashboard.",
      position: "left",
    }
  ],
  "/b2b/contract": [
    {
      id: "contract-header",
      selector: "#tour-contract-header",
      title: t.spotlight.b2bContractHeader?.title || "Contract Protocol",
      content: t.spotlight.b2bContractHeader?.content || "This is the final step. You can always return to this page later if you need time to review.",
      position: "right",
    },
    {
      id: "contract-download",
      selector: "#tour-contract-download",
      title: t.spotlight.b2bContractDownload?.title || "Download Contract",
      content: t.spotlight.b2bContractDownload?.content || "Click here to download your personalized B2B partnership agreement.",
      position: "bottom",
    },
    {
      id: "contract-upload",
      selector: "#tour-contract-upload",
      title: t.spotlight.b2bContractUpload?.title || "Upload Signed Copy",
      content: t.spotlight.b2bContractUpload?.content || "Once signed, upload the document here to activate your partner dashboard access.",
      position: "bottom",
    }
  ],
  "/subscription": [
    {
      id: "subscription-header",
      selector: "#tour-sub-hero",
      title: t.spotlight.subHero?.title || "The Roastery Loop",
      content: t.spotlight.subHero?.content || "Welcome to our exclusive subscription service. Let our Master Roaster curate your monthly delivery.",
      position: "bottom",
    },
    {
      id: "subscription-master",
      selector: "#tour-sub-master",
      title: t.spotlight.subMaster?.title || "Master Roaster's Promise",
      content: t.spotlight.subMaster?.content || "Every batch is meticulously crafted and guaranteed by our Head Roaster, Mr. Yanotama.",
      position: "left",
    },
    {
      id: "subscription-steps",
      selector: "#tour-sub-steps",
      title: t.spotlight.subSteps?.title || "How It Works",
      content: t.spotlight.subSteps?.content || "The process is simple: choose your vibe, wait for the roast, and enjoy your monthly supply.",
      position: "top",
    },
    {
      id: "subscription-pricing",
      selector: "#tour-sub-pricing",
      title: t.spotlight.subPricing?.title || "Select Your Plan",
      content: t.spotlight.subPricing?.content || "From 'The Discovery' to 'The Collector', pick the plan that best matches your coffee journey.",
      position: "top",
    }
  ],
  "/subscription/checkout": [
    {
      id: "subcheck-saved",
      selector: "#tour-subcheck-saved",
      title: t.spotlight.subCheckSaved?.title || "Saved Addresses",
      content: t.spotlight.subCheckSaved?.content || "Quickly select an address from your account profile.",
      position: "right",
    },
    {
      id: "subcheck-form",
      selector: "#tour-subcheck-form",
      title: t.spotlight.subCheckForm?.title || "Shipping Details",
      content: t.spotlight.subCheckForm?.content || "Please review and complete your recipient details.",
      position: "right",
    },
    {
      id: "subcheck-priority",
      selector: "#tour-subcheck-priority",
      title: t.spotlight.subCheckPriority?.title || "Priority Shipping",
      content: t.spotlight.subCheckPriority?.content || "As a subscriber, your delivery automatically receives priority routing.",
      position: "top",
    },
    {
      id: "subcheck-summary",
      selector: "#tour-subcheck-summary",
      title: t.spotlight.subCheckSummary?.title || "Order Summary",
      content: t.spotlight.subCheckSummary?.content || "Review your selected subscription plan. Note that shipping is completely free.",
      position: "left",
    },
    {
      id: "subcheck-pay",
      selector: "#tour-subcheck-pay",
      title: t.spotlight.subCheckPay?.title || "Complete Subscription",
      content: t.spotlight.subCheckPay?.content || "Click here to proceed to payment and finalize your coffee subscription.",
      position: "top",
    }
  ],
  "/journal": [
    {
      id: "journal-hero",
      selector: "#tour-journal-hero",
      title: t.spotlight.journalHero?.title || "The Archives",
      content: t.spotlight.journalHero?.content || "Read our latest experiments, field reports, and roastery updates.",
      position: "bottom",
    },
    {
      id: "journal-search",
      selector: "#tour-journal-search",
      title: t.spotlight.journalSearch?.title || "Search Records",
      content: t.spotlight.journalSearch?.content || "Looking for something specific? Search through our entire repository of articles.",
      position: "bottom",
    },
    {
      id: "journal-explore",
      selector: "#tour-journal-explore",
      title: t.spotlight.journalExplore?.title || "Explore More",
      content: t.spotlight.journalExplore?.content || "Swipe through our older entries and discover the history behind our beans.",
      position: "top",
    }
  ],
  "/our-story": [
    {
      id: "story-header",
      selector: "h1",
      title: t.spotlight.storyPage?.title || "Our Story",
      content: t.spotlight.storyPage?.content || "Our Story",
      position: "bottom",
    }
  ]
});

export function SpotlightGuide() {
  const isMobile = useIsMobile();
  const { isTourActive, currentStep, endTour, setStep, nextStep, hasSeenTour } = useSpotlightStore();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const t = useI18n();
  const STEPS_CONFIG = getStepsConfig(t);
  const TOUR_STEPS = STEPS_CONFIG[pathname] || [];

  debugLog("SpotlightGuide Rendering Check:", {
    isReady,
    isTourActive,
    isMobile,
    pathname,
    stepsLength: TOUR_STEPS.length,
    TOUR_STEPS
  });

  // Only run on client, and only on the landing page for the initial auto-trigger
  useEffect(() => {
    setIsReady(true);
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isTourActive && !isMobile && TOUR_STEPS.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isTourActive, TOUR_STEPS.length]);

  const getVisibleElement = (selector: string): HTMLElement | null => {
    if (typeof document === "undefined") return null;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const visible = elements.find((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    return visible || elements[0] || null;
  };

  useEffect(() => {
    if (!isTourActive || !isReady || TOUR_STEPS.length === 0) return;

    const step = TOUR_STEPS[currentStep];
    if (!step) {
      handleEndTour();
      return;
    }

    const timeout = setTimeout(() => {
      const hamburgerBtn = document.querySelector("#tour-hamburger-btn") as HTMLButtonElement;
      const isDrawerOpen = hamburgerBtn?.getAttribute("aria-expanded") === "true";
      const isTargetInDrawer =
        step.selector.includes("nav a[href") ||
        step.selector.includes("account") ||
        step.selector.includes("b2b") ||
        step.selector.includes("tour-search-mobile");

      if (window.innerWidth < 1024 && hamburgerBtn) {
        if (isTargetInDrawer && !isDrawerOpen) {
          hamburgerBtn.click();
        } else if (!isTargetInDrawer && isDrawerOpen) {
          hamburgerBtn.click();
        }
      }

      setTimeout(() => {
        let element = getVisibleElement(step.selector);
        if ((!element || (element.getBoundingClientRect().width === 0 && element.getBoundingClientRect().height === 0)) && window.innerWidth < 1024 && isTargetInDrawer && hamburgerBtn) {
          element = hamburgerBtn;
        }

        if (element) {
          const rect = element.getBoundingClientRect();
          setTargetRect(rect);
          document.body.style.overflow = '';
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          
          let isScrolling = true;
          const updateRect = () => {
            if (!isScrolling) return;
            const newRect = getVisibleElement(step.selector)?.getBoundingClientRect() || element?.getBoundingClientRect();
            if (newRect) setTargetRect(newRect);
            requestAnimationFrame(updateRect);
          };
          requestAnimationFrame(updateRect);

          setTimeout(() => {
            isScrolling = false;
            const finalRect = getVisibleElement(step.selector)?.getBoundingClientRect() || element?.getBoundingClientRect();
            if (finalRect) setTargetRect(finalRect);
            if (isTourActive) document.body.style.overflow = 'hidden';
          }, 600);

        } else {
          if (currentStep < TOUR_STEPS.length - 1) {
            nextStep();
          } else {
            handleEndTour();
          }
        }
      }, 250);
    }, 50);

    return () => clearTimeout(timeout);
  }, [currentStep, isTourActive, isReady, windowSize, pathname]);

  const handleEndTour = () => {
    const hamburgerBtn = document.querySelector("#tour-hamburger-btn") as HTMLButtonElement;
    if (hamburgerBtn && hamburgerBtn.getAttribute("aria-expanded") === "true") {
      hamburgerBtn.click();
    }
    endTour();
  };

  if (!isReady || !isTourActive || TOUR_STEPS.length === 0) return null;

  const stepInfo = TOUR_STEPS[currentStep];
  if (!stepInfo || !targetRect) return null;

  const padding = 10;
  const highlightStyle = {
    top: targetRect.top - padding,
    left: targetRect.left - padding,
    width: targetRect.width + padding * 2,
    height: targetRect.height + padding * 2,
  };

  const cardWidth = Math.min(320, windowSize.width - 32);
  const cardHeight = 260; 
  const margin = 16;

  const isTall = targetRect.height > windowSize.height * 0.35 || targetRect.height > 280;
  const isWide = targetRect.width > windowSize.width * 0.7;

  let cardTop = 0;
  let cardLeft = 0;

  if (window.innerWidth < 1024) {
    cardLeft = Math.max(16, (windowSize.width - cardWidth) / 2);
    const isTargetInDrawer =
      stepInfo.selector.includes("nav a[href") ||
      stepInfo.selector.includes("account") ||
      stepInfo.selector.includes("b2b") ||
      stepInfo.selector.includes("tour-search-mobile");

    if (isTargetInDrawer || targetRect.bottom < windowSize.height * 0.55) {
      // For elements in the upper screen/drawer (e.g. subscription link), position card near bottom so target stays 100% visible
      cardTop = Math.max(16, windowSize.height - cardHeight - 24);
    } else if (targetRect.top > windowSize.height * 0.45) {
      // For elements in lower screen, position card near top
      cardTop = 24;
    } else {
      cardTop = Math.max(16, (windowSize.height - cardHeight) / 2);
    }
  } else if ((isWide && isTall) || isTall) {
    cardLeft = Math.max(16, (windowSize.width - cardWidth) / 2);
    cardTop = Math.max(16, (windowSize.height - cardHeight) / 2);
  } else {
    const spaceRight = windowSize.width - targetRect.right - margin;
    const spaceLeft = targetRect.left - margin;
    const spaceTop = targetRect.top - margin;
    const spaceBottom = windowSize.height - targetRect.bottom - margin;

    let preferredPos = stepInfo.position || "bottom";

    if (preferredPos === "right" && spaceRight < cardWidth && spaceLeft >= cardWidth) {
      preferredPos = "left";
    } else if (preferredPos === "left" && spaceLeft < cardWidth && spaceRight >= cardWidth) {
      preferredPos = "right";
    } else if (preferredPos === "top" && spaceTop < cardHeight && spaceBottom >= cardHeight) {
      preferredPos = "bottom";
    } else if (preferredPos === "bottom" && spaceBottom < cardHeight && spaceTop >= cardHeight) {
      preferredPos = "top";
    }

    if (preferredPos === "right") {
      cardLeft = targetRect.right + margin;
      cardTop = targetRect.top;
    } else if (preferredPos === "left") {
      cardLeft = targetRect.left - cardWidth - margin;
      cardTop = targetRect.top;
    } else if (preferredPos === "top") {
      cardLeft = targetRect.left;
      cardTop = targetRect.top - cardHeight - margin;
    } else {
      cardLeft = targetRect.left;
      cardTop = targetRect.bottom + margin;
    }

    cardTop = Math.max(margin, Math.min(cardTop, windowSize.height - cardHeight - margin));
    cardLeft = Math.max(margin, Math.min(cardLeft, windowSize.width - cardWidth - margin));
  }

  const cardStyle = {
    top: cardTop,
    left: cardLeft,
  };

  return (
    <AnimatePresence>
      {isTourActive && (
        <motion.div 
          className="fixed inset-0 z-[9999] pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div 
            className="absolute transition-all duration-500 ease-in-out pointer-events-none"
            style={{
              top: highlightStyle.top,
              left: highlightStyle.left,
              width: highlightStyle.width,
              height: highlightStyle.height,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)', 
              borderRadius: '8px',
              border: '2px dashed rgba(255,255,255,0.5)',
            }}
          />

          <div className="absolute inset-0 z-0" onClick={handleEndTour}></div>

          <motion.div
            key={`${pathname}-${currentStep}`}
            initial={{ y: 20, opacity: 0, rotate: -2 }}
            animate={{ y: 0, opacity: 1, rotate: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="absolute w-[calc(100vw-32px)] sm:w-[320px] bg-[#FDFBF7] p-6 shadow-[8px_8px_0px_rgba(0,0,0,0.15)] border border-black/10 z-10"
            style={{
              ...cardStyle,
              borderRadius: '4px 8px 3px 6px',
            }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-white/80 border border-black/10 rotate-3 shadow-sm"></div>

            <button 
              onClick={handleEndTour}
              className="absolute top-2 right-2 text-stone-400 hover:text-black transition-colors"
            >
              <X size={16} />
            </button>

            <span className="text-3xl font-mono font-bold text-stone-300 absolute -top-2 right-6 -z-10 select-none">
               {currentStep + 1}
            </span>

            <h4 className="font-display font-black uppercase tracking-wider text-xl text-slate-900 mt-2 mb-2 relative z-10">
              {stepInfo.title}
            </h4>
            
            <p className="text-sm font-sans text-stone-600 leading-relaxed mb-6 font-medium">
              {stepInfo.content}
            </p>

            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-1">
                {TOUR_STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-4 bg-slate-800' : 'w-1.5 bg-stone-300'}`}
                  />
                ))}
              </div>

              {currentStep < TOUR_STEPS.length - 1 ? (
                <button 
                  onClick={nextStep}
                  className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 hover:text-[#EBA294] transition-colors group"
                >
                  {t.spotlight.buttons.next} 
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button 
                  onClick={handleEndTour}
                  className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] bg-slate-900 text-white px-3 py-1.5 hover:bg-[#367F4D] transition-colors"
                >
                  {t.spotlight.buttons.gotIt} <Check size={12} />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SpotlightFAB() {
  const { startTour, isTourActive } = useSpotlightStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const t = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isTourActive) return null;

  const allowedPages = ["/", "/our-coffee", "/wholesale", "/subscription", "/subscription/checkout", "/journal", "/our-story", "/cart", "/checkout", "/b2b/register", "/b2b/contract"];
  if (!allowedPages.includes(pathname)) return null;

  return (
    <button
      onClick={startTour}
      className="fixed bottom-6 right-6 z-[90] w-12 h-12 bg-[#F1B941] rounded-full shadow-[4px_4px_0px_rgba(0,0,0,0.15)] border-2 border-black/10 flex items-center justify-center text-slate-900 hover:bg-[#EBA294] hover:text-white transition-all hover:scale-105 group"
      aria-label="Start Guided Tour"
    >
      <span className="font-display font-black text-xl italic group-hover:rotate-12 transition-transform">?</span>
      
      {/* Tooltip - Now pointing to the left since the button is on the right */}
      <span className="absolute right-full mr-4 bg-white text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 border border-black/10 shadow-[2px_2px_0px_rgba(0,0,0,0.05)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none rounded-sm">
        {t.spotlight.buttons.quickTour}
      </span>
    </button>
  );
}
