import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    // NOTE: LocalStorage is not accessible in Middleware. 
    // We'll use a cookie named 'fermion_profile_id'.
    const profileId = request.cookies.get('fermion_profile_id')?.value;

    if (!profileId) {
      // Redirect to login if no profile ID cookie found
      return NextResponse.redirect(new URL('/account/register', request.url));
    }

    try {
      // Verify role with backend
      const res = await fetch(`http://localhost:3001/api/auth/verify-admin?id=${profileId}`);
      const data = await res.json();

      if (!data.isAdmin) {
        // Redirect to retail if not an admin
        return NextResponse.redirect(new URL('/our-coffee', request.url));
      }
    } catch (error) {
      console.error('Middleware Verification Error:', error);
      // Fallback redirect on error
      return NextResponse.redirect(new URL('/our-coffee', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
