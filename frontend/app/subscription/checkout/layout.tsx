import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscription Checkout',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubscriptionCheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
