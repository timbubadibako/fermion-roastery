import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fermion-roastery.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/b2b/settings', '/b2b/contract', '/cart', '/checkout'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
