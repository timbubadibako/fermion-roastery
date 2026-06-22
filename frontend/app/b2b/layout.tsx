import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Portal B2B',
    default: 'Portal B2B | Fermion Roastery',
  },
  description: 'Dashboard khusus Partner B2B Fermion Roastery. Kelola pesanan grosir, langganan kopi, histori transaksi, dan invoice Anda dalam satu pintu.',
};

export default function B2BPortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
