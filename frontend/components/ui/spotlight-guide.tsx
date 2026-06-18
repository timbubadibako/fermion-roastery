"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSpotlightStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { X, ChevronRight, Check } from "lucide-react";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

// Define the steps for different pages
const STEPS_CONFIG: Record<string, any[]> = {
  "/": [
    {
      id: "our-coffee-link",
      selector: "nav a[href='/our-coffee']",
      title: "The Specimens",
      content: "Explore our latest roasts and laboratory-grade single origins. Each bean is treated like a unique specimen.",
      position: "bottom",
    },
    {
      id: "wholesale-link",
      selector: "nav a[href='/wholesale']",
      title: "B2B Partnership",
      content: "Looking for precision roasting for your cafe? We provide custom profiles and scalable wholesale pricing.",
      position: "bottom",
    },
    {
      id: "subscription-link",
      selector: "nav a[href='/subscription']",
      title: "Never Run Out",
      content: "Subscribe to our rotating experimental lots. Fresh roasts delivered on your schedule.",
      position: "bottom",
    }
  ],
  "/our-coffee": [
    {
      id: "catalog-header",
      selector: "h1",
      title: "The Laboratory",
      content: "This is our complete archives. Every bean here has been scientifically profiled for peak flavor.",
      position: "bottom",
    },
    {
      id: "catalog-tools",
      selector: "#catalog-tools-btn",
      title: "Refine Search",
      content: "Use these tools to filter by process, origin, or change your viewing layout.",
      position: "bottom",
    },
    {
      id: "catalog-sort",
      selector: "#catalog-sort-btn",
      title: "Prioritize",
      content: "Sort by price or featured lots to find exactly what you need.",
      position: "bottom",
    },
    {
      id: "product-card",
      selector: ".product-specimen-card",
      title: "Specimen Data",
      content: "Each card shows origin, price, and tasting notes. Click for full technical specifications.",
      position: "right",
    }
  ]
};

export function SpotlightGuide() {
  const isMobile = useIsMobile();
  const { isTourActive, currentStep, endTour, setStep, nextStep, hasSeenTour } = useSpotlightStore();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();

  const TOUR_STEPS = STEPS_CONFIG[pathname] || [];

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

  // Disable body scroll when tour is active
  useEffect(() => {
    if (isTourActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isTourActive]);

  // Find target element bounds when step changes
  useEffect(() => {
    if (!isTourActive || !isReady || isMobile || TOUR_STEPS.length === 0) return;

    const step = TOUR_STEPS[currentStep];
    if (!step) {
      endTour();
      return;
    }

    // Wait a bit for layout to settle if navigating or just starting
    const timeout = setTimeout(() => {
      const element = document.querySelector(step.selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        
        // Spotlight directs the scroll
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Update rect after scroll animation completes
        setTimeout(() => {
            const newRect = document.querySelector(step.selector)?.getBoundingClientRect();
            if(newRect) setTargetRect(newRect);
        }, 500);

      } else {
        // Element not found, skip step
        if (currentStep < TOUR_STEPS.length - 1) {
          nextStep();
        } else {
          endTour();
        }
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [currentStep, isTourActive, isReady, windowSize, isMobile, pathname]);

  if (!isReady || !isTourActive || isMobile || TOUR_STEPS.length === 0) return null;

  const stepInfo = TOUR_STEPS[currentStep];
  if (!stepInfo || !targetRect) return null;

  // Calculate position for the scrapbook note card
  const padding = 10;
  const highlightStyle = {
    top: targetRect.top - padding,
    left: targetRect.left - padding,
    width: targetRect.width + padding * 2,
    height: targetRect.height + padding * 2,
  };

  // Smarter Card placement: check position preference
  const cardWidth = 300;
  const cardHeight = 250; // approximate
  
  let cardTop = 0;
  let cardLeft = 0;

  if (stepInfo.position === "right") {
    // Position to the right of the target
    cardTop = Math.max(20, Math.min(targetRect.top, windowSize.height - cardHeight - 20));
    cardLeft = targetRect.right + 40;
    
    // Fallback to left if no space on right
    if (cardLeft + cardWidth > windowSize.width - 20) {
      cardLeft = targetRect.left - cardWidth - 40;
    }
  } else {
    // Default Top/Bottom logic
    const spaceBelow = windowSize.height - targetRect.bottom;
    const showAbove = spaceBelow < cardHeight + 40;
    
    cardTop = showAbove 
        ? targetRect.top - cardHeight - 40 
        : targetRect.bottom + 20;
    cardLeft = Math.max(20, Math.min(targetRect.left, windowSize.width - cardWidth - 20));
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
          {/* Backdrop with cutout */}
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

          {/* Invisible overlay */}
          <div className="absolute inset-0 z-0" onClick={endTour}></div>

          {/* The Scrapbook Note Card */}
          <motion.div
            key={`${pathname}-${currentStep}`} // Re-animate on step or page change
            initial={{ y: 20, opacity: 0, rotate: -2 }}
            animate={{ y: 0, opacity: 1, rotate: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="absolute w-[300px] bg-[#FDFBF7] p-6 shadow-[8_8px_0px_rgba(0,0,0,0.15)] border border-black/10 z-10"
            style={{
              ...cardStyle,
              borderRadius: '4px 8px 3px 6px',
            }}
          >
            {/* Masking tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-white/80 border border-black/10 rotate-3 shadow-sm"></div>

            <button 
              onClick={endTour}
              className="absolute top-2 right-2 text-stone-400 hover:text-black transition-colors"
            >
              <X size={16} />
            </button>

            <span className="text-3xl font-cloude text-stone-200 absolute -top-2 right-6 -z-10 select-none">
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
                  Next 
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button 
                  onClick={endTour}
                  className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] bg-slate-900 text-white px-3 py-1.5 hover:bg-[#367F4D] transition-colors"
                >
                  Got It <Check size={12} />
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
  const isMobile = useIsMobile();
  const { startTour, isTourActive } = useSpotlightStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isTourActive || isMobile) return null;

  // Show FAB on landing page and Our Coffee page
  const allowedPages = ["/", "/our-coffee"];
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
        Quick Tour
      </span>
    </button>
  );
}
