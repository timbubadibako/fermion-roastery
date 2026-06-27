import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const canonical = `/journal/${id}`;
  
  try {
    if (process.env.VERCEL && !process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("Skipping fetch during Vercel build");
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/journal/${id}`);
    if (res.ok) {
      const post = await res.json();
      return {
        title: post.title,
        description: post.excerpt || `Membaca jurnal: ${post.title} di Fermion Roastery.`,
        alternates: {
          canonical,
        },
        openGraph: {
          title: `${post.title} | Fermion Roastery Journal`,
          description: post.excerpt || `Membaca jurnal: ${post.title} di Fermion Roastery.`,
          url: canonical,
          type: 'article',
          publishedTime: post.published_at || post.created_at,
          modifiedTime: post.updated_at,
          images: post.featured_image ? [{ url: post.featured_image }] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${post.title} | Fermion Roastery Journal`,
          description: post.excerpt || `Membaca jurnal: ${post.title} di Fermion Roastery.`,
          images: post.featured_image ? [post.featured_image] : [],
        },
      }
    }
  } catch (error) {
    console.error("Metadata fetch error for journal:", error);
  }

  return {
    title: 'Jurnal Fermion',
    description: 'Catatan perjalanan, edukasi kopi, dan eksperimen roasting dari Fermion Roastery.',
    alternates: {
      canonical,
    },
  };
}

export default function JournalReadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
