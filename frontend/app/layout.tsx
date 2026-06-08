import React from "react"
import type { Metadata } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { LoadingCover } from "@/components/loading-cover";
import './globals.css'

const fraunces = Fraunces({ subsets: ["latin"], variable: '--font-display' });
const manrope = Manrope({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Fermion Roastery',
  description: 'Modern coffee commerce for wholesale, retail, subscription, and brand storytelling.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${manrope.variable} font-sans antialiased`}>
        <LoadingCover />
        <Header />
        {children}
        <Toaster position="bottom-right" expand={false} richColors />
        <Analytics />
      </body>
    </html>
  )
}
