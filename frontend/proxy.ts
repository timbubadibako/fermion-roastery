import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const profileId = request.cookies.get('fermion_profile_id')?.value;

  // 1. Protect /admin routes (Only ADMIN allowed)
  if (pathname.startsWith('/admin')) {
    if (!profileId) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    try {
      const res = await fetch(`${request.nextUrl.origin}/api/auth/verify-admin?id=${profileId}`);
      if (res.ok) {
        const data = await res.json();

        if (!data.isAdmin) {
          // Redirect to retail if not an admin
          return NextResponse.redirect(new URL('/our-coffee', request.url));
        }
      } else {
        return NextResponse.redirect(new URL('/our-coffee', request.url));
      }
    } catch (error) {
      console.error('Proxy Admin Verification Error:', error);
      return NextResponse.redirect(new URL('/our-coffee', request.url));
    }
  }

  // 3. Protect /b2b routes (Only B2B or ADMIN allowed)
  if (pathname.startsWith('/b2b/dashboard')) {
    if (!profileId) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    // For now, B2B check is local in the page, but let's at least ensure they are logged in
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
