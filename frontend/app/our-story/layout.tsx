import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Kisah Fermion Roastery tentang presisi roasting, filosofi detail kecil, filter coffee, dan espresso roast yang dikurasi dengan cermat.',
  alternates: {
    canonical: '/our-story',
  },
  openGraph: {
    title: 'Our Story | Fermion Roastery',
    description: 'Kisah Fermion Roastery tentang presisi roasting, filosofi detail kecil, filter coffee, dan espresso roast yang dikurasi dengan cermat.',
    url: '/our-story',
    type: 'article',
  },
};

export default function OurStoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
