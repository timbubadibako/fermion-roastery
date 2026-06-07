"use client";

import { useEffect, useState } from "react";

export function LoadingCover() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Keep it solid white for 200ms
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 200);

    // Completely remove from DOM after fade animation (700ms total)
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 900);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white transition-opacity duration-700 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    />
  );
}
