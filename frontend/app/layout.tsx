import type { Metadata } from 'next';
import { ClientWrapper } from './client-wrapper';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fermionroastery.com';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Fermion Roastery',
  url: siteUrl,
  logo: `${siteUrl}/fermion-logo.png`,
  description: 'Specialty coffee roastery dari Indonesia dengan fokus pada presisi roasting, filter coffee, dan espresso roast.',
  sameAs: ['https://fermionroastery.com'],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Fermion Roastery',
  url: siteUrl,
  inLanguage: 'id-ID',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  title: {
    template: '%s | Fermion Roastery',
    default: 'Fermion Roastery | Specialty Coffee & Roasting',
  },
  description: 'Fermion Roastery adalah specialty coffee roastery dari Indonesia yang merancang filter coffee dan espresso roast dengan presisi, transparansi, dan karakter rasa yang bersih.',
  keywords: 'Fermion Roastery, Roastery Kopi Cirebon Timur, Roastery Kopi Babakan, Roastery Kopi Ciayumajakuning, Supplier Biji Kopi Cirebon, Supplier Biji Kopi Cirebon Timur, Supplier Biji Kopi Babakan, Supplier Biji Kopi Ciayumajakuning, Jual Kopi Grosir Cirebon, Jual Kopi Grosir Cirebon Timur, Jual Kopi Grosir Babakan, Jual Kopi Grosir Ciayumajakuning, Supplier Kopi Kafe Cirebon, Supplier Kopi Kafe Indramayu, Supplier Kopi Kafe Majalengka, Supplier Kopi Kafe Kuningan, Specialty Coffee Roaster Cirebon, Specialty Coffee Roaster Indramayu, Specialty Coffee Roaster Majalengka, Specialty Coffee Roaster Kuningan, Review Fermion Roastery, Kopi Viral',
  openGraph: {
    title: 'Fermion Roastery',
    description: 'Specialty coffee roastery dari Indonesia dengan fokus pada presisi roasting, filter coffee, dan espresso roast.',
    url: '/',
    siteName: 'Fermion Roastery',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Fermion Roastery Cover Image' }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fermion Roastery',
    description: 'Specialty coffee roastery dari Indonesia dengan fokus pada presisi roasting, filter coffee, dan espresso roast.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased bg-[#FAF9F6]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ClientWrapper>
          {children}
        </ClientWrapper>
        <Analytics />
      </body>
    </html>
  );
}
