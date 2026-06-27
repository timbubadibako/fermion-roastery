import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

type SitemapProduct = {
  id: string;
  updated_at?: string | null;
};

type SitemapJournalPost = {
  slug?: string | null;
  id?: string | null;
  updated_at?: string | null;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fermionroastery.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  // Base static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/our-coffee`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/wholesale`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/subscription`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/our-story`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  try {
    const [productsRes, journalRes] = await Promise.all([
      fetch(`${apiUrl}/products`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/journal`, { next: { revalidate: 3600 } }),
    ]);

    if (productsRes.ok) {
      const products = await productsRes.json() as SitemapProduct[];
      products.forEach((product) => {
        routes.push({
          url: `${baseUrl}/our-coffee/${product.id}`,
          lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }

    if (journalRes.ok) {
      const posts = await journalRes.json() as SitemapJournalPost[];
      posts.forEach((post) => {
        const slug = post.slug || post.id;
        if (!slug) return;

        routes.push({
          url: `${baseUrl}/journal/${slug}`,
          lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.5,
        });
      });
    }
  } catch (error) {
    console.error('Failed to fetch dynamic routes for sitemap:', error);
  }

  return routes;
}
