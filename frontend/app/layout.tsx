"use client";

import React, { useState, useEffect } from "react";
import { Fraunces, Manrope } from 'next/font/google';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { Header } from "@/components/header";
import { UnifiedSidebar } from "@/components/dashboard/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { LoadingCover } from "@/components/loading-cover";
import { ChatFloating } from "@/components/chat-floating";
import { CartSync } from "@/components/cart-sync";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import './globals.css';

const fraunces = Fraunces({ subsets: ["latin"], variable: '--font-display' });
const manrope = Manrope({ subsets: ["latin"], variable: '--font-sans' });

const cloude = localFont({
  src: './fonts/cloude.otf',
  variable: '--font-cloude',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Portal detection
  const isAdmin = pathname.startsWith('/admin');
  const isB2BPortal = pathname.startsWith('/b2b') && !pathname.startsWith('/b2b/register');
  const hideMainLayout = pathname === '/auth' || pathname === '/b2b/register' || isAdmin || isB2BPortal;

  // Final role determination for sidebar
  const activeRole = isAdmin ? "ADMIN" : (isB2BPortal ? "B2B" : null);

  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${manrope.variable} ${cloude.variable} font-sans antialiased bg-[#FAF9F6]`}>
        <LoadingCover />
        <CartSync />

        {mounted && activeRole && <UnifiedSidebar role={activeRole} />}
        
        {!hideMainLayout && <Header />}

        <main className={`${(mounted && activeRole) ? "ml-64 min-h-screen bg-slate-50 flex flex-col items-center" : ""}`}>
          <div className={`${(mounted && activeRole) ? "w-full max-w-[1440px] px-8 lg:px-12 py-16" : "min-h-screen"}`}>
            {children}
          </div>
        </main>

        {!hideMainLayout && <ChatFloating />}

        <Toaster position="bottom-right" expand={false} richColors />
        <Analytics />
      </body>
    </html>
  );
}
