"use client";

import React, { useState, useEffect } from "react";
import { Fraunces, Manrope, Permanent_Marker } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { Header } from "@/components/header";
import { UnifiedSidebar } from "@/components/dashboard/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { LoadingCover } from "@/components/loading-cover";
import { ChatFloating } from "@/components/chat-floating";
import { CartSync } from "@/components/cart-sync";
import { SpotlightGuide, SpotlightFAB } from "@/components/ui/spotlight-guide";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import './globals.css';

const fraunces = Fraunces({ subsets: ["latin"], variable: '--font-display' });
const manrope = Manrope({ subsets: ["latin"], variable: '--font-sans' });

const marker = Permanent_Marker({ 
  weight: '400',
  subsets: ["latin"], 
  variable: '--font-cloude',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();
  const { user, setUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log("LAYOUT DEBUG:", {
      pathname,
      userRole: user?.role,
      user,
      mounted
    });
  }, [user, mounted, pathname]);

  useEffect(() => {
    setMounted(true);
    // Hydrate auth state from localStorage
    const savedAuth = localStorage.getItem('fermion-auth-storage');
    if (savedAuth) {
      try {
        const { state } = JSON.parse(savedAuth);
        if (state.user) setUser(state.user);
      } catch (e) { console.error("Hydration failed"); }
    }
  }, [setUser]);
  
  // Portal detection
  const isAdmin = pathname.startsWith('/admin');
  const isB2BPortal = pathname.startsWith('/b2b') && !pathname.startsWith('/b2b/register');
  const hideMainLayout = pathname === '/auth' || pathname === '/b2b/register' || isAdmin || isB2BPortal;

  // Final role determination for sidebar
  const activeRole = isAdmin ? "ADMIN" : (isB2BPortal ? "B2B" : null);

  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${manrope.variable} ${marker.variable} font-sans antialiased bg-[#FAF9F6]`}>
        <LoadingCover />
        <CartSync />

        {mounted && activeRole && <UnifiedSidebar role={activeRole} />}
        
        {!hideMainLayout && <Header />}

        <main className={`${(mounted && activeRole) ? "ml-64 min-h-screen bg-slate-50 flex flex-col items-center" : ""}`}>
          <div className={`${(mounted && activeRole) ? "w-full max-w-[1440px] px-8 lg:px-12 py-16" : "min-h-screen"}`}>
            {children}
          </div>
        </main>

        {/* Temporarily hidden chat feature */}
        {/* {!hideMainLayout && <ChatFloating />} */}
        
        {!hideMainLayout && <SpotlightGuide />}
        {!hideMainLayout && <SpotlightFAB />}

        <Toaster position="bottom-right" expand={false} richColors />
        <Analytics />
      </body>
    </html>
  );
}
