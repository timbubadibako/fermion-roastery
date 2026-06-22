import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/products/${id}`);
    if (res.ok) {
      const product = await res.json();
      return {
        title: product.name,
        description: product.description || `Biji kopi ${product.name} dari Fermion Roastery. Karakteristik notes: ${product.notes}.`,
        openGraph: {
          title: `${product.name} | Fermion Roastery`,
          description: product.description || `Biji kopi ${product.name} dari Fermion Roastery. Karakteristik notes: ${product.notes}.`,
          images: product.image_url ? [{ url: product.image_url }] : [],
        }
      }
    }
  } catch (error) {
    console.error("Metadata fetch error:", error);
  }

  return {
    title: 'Detail Kopi',
    description: 'Detail produk biji kopi specialty pilihan Fermion Roastery.'
  };
}

export default function DynamicCoffeeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
