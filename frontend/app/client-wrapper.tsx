"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { UnifiedSidebar } from "@/components/dashboard/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { LoadingCover } from "@/components/loading-cover";
import { ChatFloating } from "@/components/chat-floating";
import { CartSync } from "@/components/cart-sync";
import { SpotlightGuide, SpotlightFAB } from "@/components/ui/spotlight-guide";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export function ClientWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();
  const { user, setUser, refreshSession } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // console.log("LAYOUT DEBUG:", { pathname, userRole: user?.role, user, mounted });
    }
  }, [user, mounted, pathname]);

  useEffect(() => {
    setMounted(true);

    const savedAuth = localStorage.getItem('fermion-auth-storage');

    if (savedAuth) {
      try {
        const { state } = JSON.parse(savedAuth);

        if (state.user) {
          setUser(state.user);
          refreshSession(state.user);
        }
      } catch (e) {
        console.error("Hydration failed", e);
      }
    }
  }, [setUser, refreshSession]);

  // Portal detection
  const isAdmin = pathname.startsWith('/admin');
  const isB2BPortal = pathname.startsWith('/b2b') && !pathname.startsWith('/b2b/register');
  const hideMainLayout = pathname === '/auth' || pathname === '/b2b/register' || isAdmin || isB2BPortal;

  // Final role determination for sidebar
  const activeRole = isAdmin ? "ADMIN" : (isB2BPortal ? "B2B" : null);

  return (
    <>
      <LoadingCover />
      <CartSync />

      {mounted && activeRole && <UnifiedSidebar role={activeRole} />}

      {!hideMainLayout && <Header />}

      <main className={`${(mounted && activeRole) ? "ml-64 min-h-screen bg-slate-50 flex flex-col items-center print:ml-0 print:bg-white print:min-h-0" : ""}`}>
        <div className={`${(mounted && activeRole) ? "w-full max-w-[1440px] px-8 lg:px-12 py-16 print:p-0 print:max-w-none" : "min-h-screen"}`}>
          {children}
        </div>
      </main>

      {/* Temporarily hidden chat feature */}
      {/* {!hideMainLayout && <ChatFloating />} */}

      <SpotlightGuide />
      <SpotlightFAB />

      <Toaster
        position="top-center"
        expand={false}
        toastOptions={{
          classNames: {
            toast: "group toast border shadow-lg rounded-sm px-5 py-4 flex items-center gap-3 font-sans",
            title: "text-[10px] font-black uppercase tracking-[0.15em]",
            description: "text-xs font-medium !text-stone-600",
            success: "border-[#367F4D]/20 bg-[#F2F9F4] text-[#367F4D]",
            error: "border-[#E05A47]/20 bg-[#FDF5F4] text-[#E05A47]",
            info: "border-black/5 bg-white text-slate-900",
            warning: "border-amber-500/20 bg-[#FFFBF0] text-amber-700",
          }
        }}
      />
    </>
  );
}
