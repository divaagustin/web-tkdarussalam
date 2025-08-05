import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/db';

export async function middleware(request) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to main admin page (login page) without token
    if (request.nextUrl.pathname === '/admin') {
      return NextResponse.next();
    }

    // Get token from cookies for other admin routes
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      // Redirect to admin page (which has integrated login) if no token
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      // Verify token
      const decoded = await verifyToken(token);
      
      if (!decoded) {
        // Invalid token, redirect to admin page
        const response = NextResponse.redirect(new URL('/admin', request.url));
        response.cookies.set('admin_token', '', {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: 0,
          path: '/'
        });
        return response;
      }

      // Add user info to request headers for use in API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-admin-id', decoded.id.toString());
      requestHeaders.set('x-admin-username', decoded.username);
      requestHeaders.set('x-admin-role', decoded.role || 'admin');

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Invalid token, redirect to admin page
      const response = NextResponse.redirect(new URL('/admin', request.url));
      response.cookies.set('admin_token', '', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });
      return response;
    }
  }

  // Check if the request is for admin API routes
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    // Skip authentication for login API
    if (request.nextUrl.pathname === '/api/auth/login') {
      return NextResponse.next();
    }

    // Get token from cookies
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token tidak ditemukan' },
        { status: 401 }
      );
    }

    try {
      // Verify token
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return NextResponse.json(
          { success: false, error: 'Token tidak valid' },
          { status: 401 }
        );
      }

      // Add user info to request headers

      const requestHeaders = new Headers(request.headers);
      
      // Safe access to decoded properties
      if (decoded && decoded.id) {
        requestHeaders.set('x-admin-id', decoded.id.toString());
      }
      if (decoded && decoded.username) {
        requestHeaders.set('x-admin-username', decoded.username);
      }
      if (decoded && decoded.role) {
        requestHeaders.set('x-admin-role', decoded.role);
      } else {
        requestHeaders.set('x-admin-role', 'admin');
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Token tidak valid' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
};