import { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/auth',
        '/auth/',
        '/account',
        '/account/',
        '/cart',
        '/cart/',
        '/subscription/checkout',
        '/subscription/success',
        '/retail/success',
        '/retail/failure',
        '/b2b',
        '/b2b/',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
