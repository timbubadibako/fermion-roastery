import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Retail Coffees',
  description: 'Explore our selection of premium single origins and signature blends, meticulously roasted for perfection.',
  openGraph: {
    title: 'Fermion Retail Coffees',
    description: 'Explore our premium specialty coffee beans.',
  }
};

export default function OurCoffeeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
