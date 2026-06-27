import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Catatan roasting, sourcing, sensory analysis, dan perjalanan Fermion Roastery dalam membangun kopi yang presisi.',
  alternates: {
    canonical: '/journal',
  },
  openGraph: {
    title: 'Journal | Fermion Roastery',
    description: 'Catatan roasting, sourcing, sensory analysis, dan perjalanan Fermion Roastery dalam membangun kopi yang presisi.',
    url: '/journal',
    type: 'website',
  },
};

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
