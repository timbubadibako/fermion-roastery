import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Program B2B & Wholesale',
  description: 'Program wholesale Fermion Roastery untuk kafe dan bisnis yang membutuhkan suplai kopi specialty, harga grosir, dan partnership berbasis presisi.',
  alternates: {
    canonical: '/wholesale',
  },
};

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
