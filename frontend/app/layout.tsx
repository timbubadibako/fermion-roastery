"use client";

import React from "react";
import { Fraunces, Manrope } from 'next/font/google';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { Header } from "@/components/header";
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
  
  // Portal detection (Admin or B2B Partner Hub)
  const isAdmin = pathname.startsWith('/admin');
  const isB2BPortal = pathname.startsWith('/b2b') && !pathname.startsWith('/b2b/register');
  const hideMainLayout = pathname === '/auth' || pathname === '/b2b/register' || isAdmin || isB2BPortal;

  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${manrope.variable} ${cloude.variable} font-sans antialiased`}>
        <LoadingCover />
        <CartSync />

        {!hideMainLayout && <Header />}

        <main className={`${hideMainLayout ? "" : "min-h-screen"}`}>
          {children}
        </main>

        {!hideMainLayout && <ChatFloating />}

        <Toaster position="bottom-right" expand={false} richColors />
        <Analytics />
      </body>
    </html>
  );
}
