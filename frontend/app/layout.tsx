import type { Metadata } from 'next';
import { Fraunces, Manrope, Permanent_Marker } from 'next/font/google';
import { ClientWrapper } from './client-wrapper';
import './globals.css';

const fraunces = Fraunces({ subsets: ["latin"], variable: '--font-display' });
const manrope = Manrope({ subsets: ["latin"], variable: '--font-sans' });
const marker = Permanent_Marker({ weight: '400', subsets: ["latin"], variable: '--font-cloude' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://fermion-roastery.vercel.app'),
  title: {
    template: '%s | Fermion Roastery',
    default: 'Fermion Roastery | Specialty Coffee & Roasting Lab',
  },
  description: 'Premium coffee roaster serving high-quality specialty beans. Join our B2B partnership, subscribe to our coffee labs, or buy retail beans.',
  keywords: 'coffee, roastery, specialty coffee, b2b coffee, coffee subscription, indonesian coffee',
  openGraph: {
    title: 'Fermion Roastery',
    description: 'Specialty coffee roastery and lab.',
    url: 'https://fermionroastery.com',
    siteName: 'Fermion Roastery',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Fermion Roastery Cover Image' }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fermion Roastery',
    description: 'Specialty coffee roastery and lab.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
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
