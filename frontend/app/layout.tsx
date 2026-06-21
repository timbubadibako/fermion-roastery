import type { Metadata } from 'next';
import { Fraunces, Manrope, Permanent_Marker } from 'next/font/google';
import { ClientWrapper } from './client-wrapper';
import './globals.css';

const fraunces = Fraunces({ subsets: ["latin"], variable: '--font-display' });
const manrope = Manrope({ subsets: ["latin"], variable: '--font-sans' });
const marker = Permanent_Marker({ weight: '400', subsets: ["latin"], variable: '--font-cloude' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://fermionroastery.com'),
  title: {
    template: '%s | Fermion Roastery',
    default: 'Fermion Roastery | Specialty Coffee & Roasting',
  },
  description: 'Halo Brewers! Fermion Roastery adalah micro roastery curated in Babakan, Cirebon Timur. Kami menyediakan kebutuhan biji kopi grosir untuk B2B kafe maupun retail specialty, serta siap mengirimkannya ke seluruh dunia!',
  keywords: 'Fermion Roastery, Roastery Kopi Cirebon Timur, Roastery Kopi Babakan, Roastery Kopi Ciayumajakuning, Supplier Biji Kopi Cirebon, Supplier Biji Kopi Cirebon Timur, Supplier Biji Kopi Babakan, Supplier Biji Kopi Ciayumajakuning, Jual Kopi Grosir Cirebon, Jual Kopi Grosir Cirebon Timur, Jual Kopi Grosir Babakan, Jual Kopi Grosir Ciayumajakuning, Supplier Kopi Kafe Cirebon, Supplier Kopi Kafe Indramayu, Supplier Kopi Kafe Majalengka, Supplier Kopi Kafe Kuningan, Specialty Coffee Roaster Cirebon, Specialty Coffee Roaster Indramayu, Specialty Coffee Roaster Majalengka, Specialty Coffee Roaster Kuningan, Review Fermion Roastery, Kopi Viral',
  openGraph: {
    title: 'Fermion Roastery',
    description: 'Halo Brewers! Fermion Roastery adalah micro roastery curated in Babakan, Cirebon Timur. Menyediakan kebutuhan B2B kafe & retail, siap kirim ke seluruh dunia!',
    url: 'https://fermionroastery.com',
    siteName: 'Fermion Roastery',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Fermion Roastery Cover Image' }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fermion Roastery',
    description: 'Halo Brewers! Fermion Roastery adalah micro roastery curated in Babakan, Cirebon Timur. Menyediakan kebutuhan B2B kafe & retail, siap kirim ke seluruh dunia!',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/Ascella.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${manrope.variable} ${marker.variable} font-sans antialiased bg-[#FAF9F6]`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
