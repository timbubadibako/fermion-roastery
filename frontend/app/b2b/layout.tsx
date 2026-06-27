import type { Metadata } from 'next';
import B2bRouteGuard from '@/components/B2bRouteGuard';

export const metadata: Metadata = {
  title: {
    template: '%s | Portal B2B',
    default: 'Portal B2B | Fermion Roastery',
  },
  description: 'Dashboard khusus Partner B2B Fermion Roastery. Kelola pesanan grosir, langganan kopi, histori transaksi, dan invoice Anda dalam satu pintu.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function B2BPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <B2bRouteGuard>
      {children}
    </B2bRouteGuard>
  );
}
