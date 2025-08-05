import { NextResponse } from 'next/server';
import { verifyToken, executeQuery } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(request) {

  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token tidak ditemukan' },
        { status: 401 }
      );
    }
    
    // Verify token
    const decoded = await verifyToken(token);
    
    if (!decoded) {
      // Invalid token, clear cookie
      const response = NextResponse.json(
        { success: false, error: 'Token tidak valid' },
        { status: 401 }
      );
      response.cookies.set('admin_token', '', {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });
      return response;
    }
    
    // Check if session exists in database
    const session = await executeQuery(
      'SELECT * FROM admin_sessions WHERE token_hash = ? AND expires_at > NOW()',
      [token]
    );
    
    if (session.length === 0) {
      // Session expired or not found, clear cookie
      const response = NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 401 }
      );
      // Di bagian clear cookie, pastikan pengaturan sama
      response.cookies.set('admin_token', '', {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });
      return response;
    }
    
    // Get admin data
    const admin = await executeQuery(
      'SELECT id, username, email, nama, role FROM admin WHERE id = ? AND is_active = TRUE',
      [decoded.id]
    );
    
    if (admin.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Admin tidak ditemukan' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      admin: admin[0]
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
   }
 }