import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscription Success',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubscriptionSuccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
