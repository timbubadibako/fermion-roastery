import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coffee Subscription (The Roastery Loop)',
  description: 'Subscribe to our monthly curated specialty coffee boxes. Delivered fresh from our roastery to your door with exclusive experimental batches.',
  openGraph: {
    title: 'Fermion Coffee Subscription',
    description: 'Fresh specialty coffee delivered monthly.',
  }
};

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
