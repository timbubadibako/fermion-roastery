"use client";

import React from "react";
import { Fraunces, Manrope } from 'next/font/google';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { Header } from "@/components/header";
import { AdminSidebar } from "@/components/admin/sidebar";
import { B2BSidebar } from "@/components/b2b/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { LoadingCover } from "@/components/loading-cover";
import { ChatFloating } from "@/components/chat-floating";
import { CartSync } from "@/components/cart-sync";
import { usePathname } from "next/navigation";
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
  
  // List of pages that should NOT show the main Header/Chat
  const isAdmin = pathname.startsWith('/admin');
  const isB2B = pathname.startsWith('/b2b/dashboard');
  const hideMainLayout = pathname === '/auth' || pathname === '/b2b/register' || isAdmin || isB2B;

  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${manrope.variable} ${cloude.variable} font-sans antialiased`}>
        <LoadingCover />
        <CartSync />
        {isAdmin && <AdminSidebar />}
        {isB2B && <B2BSidebar />}
        {!hideMainLayout && <Header />}
        <main className={`${isAdmin || isB2B ? "ml-64 min-h-screen bg-slate-50" : ""}`}>
          <div className={isAdmin || isB2B ? "w-full px-6 lg:px-12 py-12" : ""}>
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
