import { Metadata, ResolvingMetadata } from 'next';
import { supabase } from '@/lib/supabase'; // Assuming frontend has a supabase client export or we can just fetch via API

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  
  // Try fetching from the backend API if we don't want to use supabase directly in frontend Server Components
  // But Next.js can fetch relative to the site if we use full URL, or just use absolute URL 
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fermion-roastery.vercel.app';
  
  try {
    const res = await fetch(`${baseUrl}/api/products/${id}`);
    if (res.ok) {
      const product = await res.json();
      return {
        title: `${product.name} | ${product.roast_profile}`,
        description: `Explore ${product.name} from ${product.origin}. Notes: ${product.notes}.`,
        openGraph: {
          title: product.name,
          description: `Specialty coffee from ${product.origin}. ${product.notes}`,
          images: [
            {
              url: product.image || '/images/default-coffee.jpg',
            }
          ]
        }
      }
    }
  } catch (e) {
    console.error("Failed to generate metadata for product", e);
  }

  return {
    title: 'Specialty Coffee Detail',
    description: 'Discover the unique notes and origin of this specialty coffee bean.',
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
