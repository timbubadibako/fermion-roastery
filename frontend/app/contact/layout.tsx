import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Hubungi Fermion Roastery untuk retail inquiry, wholesale partnership, dan kebutuhan kopi specialty untuk bisnis Anda.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
