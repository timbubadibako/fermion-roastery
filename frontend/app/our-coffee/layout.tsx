import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Katalog Kopi (Retail)',
  description: 'Jelajahi koleksi kopi retail Fermion Roastery, dari filter coffee sampai espresso roast, disangrai segar dan siap dikirim.',
  alternates: {
    canonical: '/our-coffee',
  },
};

export default function OurCoffeeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
