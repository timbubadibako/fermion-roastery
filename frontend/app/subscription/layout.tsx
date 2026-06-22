import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Langganan Kopi (Subscription)',
  description: 'Dapatkan kiriman biji kopi segar rutin setiap bulan dari Fermion Roastery. Nikmati hasil kurasi langsung dari Master Roaster kami tanpa repot kehabisan stok.',
};

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
