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

    // Keep it solid for 200ms
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 200);

    // Completely remove from DOM after fade animation (700ms transition)
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 900);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [pathname]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#FDFBF7] transition-opacity duration-700 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    />
  );
}
