import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Retail Failure',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RetailFailureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
