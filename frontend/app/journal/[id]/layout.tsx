import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/journal/${id}`);
    if (res.ok) {
      const post = await res.json();
      return {
        title: post.title,
        description: post.excerpt || `Membaca jurnal: ${post.title} di Fermion Roastery.`,
        openGraph: {
          title: `${post.title} | Fermion Roastery Journal`,
          description: post.excerpt || `Membaca jurnal: ${post.title} di Fermion Roastery.`,
          images: post.featured_image ? [{ url: post.featured_image }] : [],
        }
      }
    }
  } catch (error) {
    console.error("Metadata fetch error for journal:", error);
  }

  return {
    title: 'Jurnal Fermion',
    description: 'Catatan perjalanan, edukasi kopi, dan eksperimen roasting dari Fermion Roastery.'
  };
}

export default function JournalReadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
