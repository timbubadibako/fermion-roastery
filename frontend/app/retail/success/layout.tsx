import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Retail Success',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RetailSuccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
