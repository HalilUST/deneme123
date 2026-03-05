import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error('middleware supabase error', error);
  }

  const { pathname } = req.nextUrl;

  // allow public auth routes and static files
  if (
    pathname.startsWith('/(auth)') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.') // file ext
  ) {
    return res;
  }

  if (!session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/:path*'],
};
