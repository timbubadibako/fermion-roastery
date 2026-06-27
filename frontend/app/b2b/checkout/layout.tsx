import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'B2B Checkout',
  robots: {
    index: false,
    follow: false,
  },
};

export default function B2BCheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
