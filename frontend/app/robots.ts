import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fermionroastery.com';

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
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
