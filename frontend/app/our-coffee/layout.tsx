import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Katalog Kopi (Retail)',
  description: 'Jelajahi koleksi biji kopi specialty dan komersial terbaik dari Fermion Roastery. Sangrai segar, siap kirim ke seluruh Indonesia.',
};

export default function OurCoffeeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
