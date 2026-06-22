import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Program B2B & Wholesale',
  description: 'Bergabunglah menjadi partner B2B Fermion Roastery. Dapatkan harga grosir khusus, pelatihan barista, suplai biji kopi terbaik, dan kustomisasi profil roasting untuk kafe Anda.',
};

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
