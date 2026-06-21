import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wholesale & B2B Partnership',
  description: 'Partner with Fermion Roastery for premium specialty coffee beans at wholesale prices. Unlock exclusive tier discounts and dedicated roasting labs.',
  openGraph: {
    title: 'Fermion B2B Wholesale',
    description: 'Specialty coffee supply for cafes and businesses.',
  }
};

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
