import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'clxijsaeiemwywgkjqqd.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'clxijsaeiemwywgkjqqd.supabase.co',
        pathname: '/storage/v1/object/**',
      },
      {
        protocol: 'https',
        hostname: 'clxijsaeiemwywgkjqqd.supabase.co',
        pathname: '/storage/v1/object/sign/**',
      },
    ],
  },
  async rewrites() {
    // Jika di Vercel (production), biarkan vercel.json yang mengatur routing-nya.
    // Jika di lokal (development), belokkan ke localhost:3001.
    if (process.env.NODE_ENV === 'production') {
      return [];
    }

    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

export default nextConfig;
