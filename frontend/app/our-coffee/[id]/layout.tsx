import { Metadata } from 'next';
import { debugError } from '@/lib/debug';
import { getServerApiBaseUrl } from '@/lib/server-api';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const canonical = `/our-coffee/${id}`;
  
  try {
    const apiBaseUrl = await getServerApiBaseUrl();
    const res = await fetch(`${apiBaseUrl}/products/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const product = await res.json();
      return {
        title: product.name,
        description: product.description || `Biji kopi ${product.name} dari Fermion Roastery. Karakteristik notes: ${product.notes}.`,
        alternates: {
          canonical,
        },
        openGraph: {
          title: `${product.name} | Fermion Roastery`,
          description: product.description || `Biji kopi ${product.name} dari Fermion Roastery. Karakteristik notes: ${product.notes}.`,
          url: canonical,
          type: 'website',
          images: product.image_url ? [{ url: product.image_url }] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${product.name} | Fermion Roastery`,
          description: product.description || `Biji kopi ${product.name} dari Fermion Roastery. Karakteristik notes: ${product.notes}.`,
          images: product.image_url ? [product.image_url] : [],
        },
      }
    }
  } catch (error) {
    debugError("Metadata fetch error:", error);
  }

  return {
    title: 'Detail Kopi',
    description: 'Detail produk biji kopi specialty pilihan Fermion Roastery.',
    alternates: {
      canonical,
    },
  };
}

export default function DynamicCoffeeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
