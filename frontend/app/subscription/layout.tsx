import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Langganan Kopi (Subscription)',
  description: 'Langganan kopi Fermion Roastery untuk kiriman biji kopi segar rutin dengan kurasi batch yang presisi dan konsisten.',
  alternates: {
    canonical: '/subscription',
  },
};

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
