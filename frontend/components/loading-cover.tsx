"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function LoadingCover() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Reset state on route change to trigger the splash screen again
    setIsVisible(true);
    setShouldRender(true);

    // Tahan efek blur selama 150ms agar animasi spinner sempat terlihat dan tidak sekadar berkedip
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 150);

    // Fade out glass effect
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [pathname]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#FDFBF7]/40 backdrop-blur-[8px] transition-opacity duration-500 ease-out flex items-center justify-center ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className={`flex flex-col items-center gap-3 transition-transform duration-500 ${isVisible ? 'scale-100' : 'scale-95'}`}>
        <div className="w-6 h-6 rounded-full border-2 border-black/10 border-t-[#367F4D] animate-spin" />
      </div>
    </div>
  );
}
