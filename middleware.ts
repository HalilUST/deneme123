import { NextRequest, NextResponse } from 'next/server';

// Simple middleware to redirect root to login/feed
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow static assets and public pages
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // For protected routes, auth check happens on client-side via useEffect
  // Vercel/Firebase can't easily check auth in middleware
  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
