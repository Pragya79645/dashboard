import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/signin', '/auth/signup'];
  
  // Protected routes that require authentication
  const protectedRoutes = ['/', '/profile', '/settings', '/favorites', '/movies', '/social', '/recommendations'];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname);

  // Get the auth token from localStorage (we'll simulate this with a cookie)
  const authToken = request.cookies.get('auth-user');

  if (isProtectedRoute && !authToken) {
    // Redirect to signin if trying to access protected route without auth
    const signInUrl = new URL('/auth/signin', request.url);
    return NextResponse.redirect(signInUrl);
  }

  if (isPublicRoute && authToken) {
    // Redirect to dashboard if trying to access auth pages while authenticated
    const dashboardUrl = new URL('/', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
