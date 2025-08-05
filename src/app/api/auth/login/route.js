import { NextResponse } from 'next/server';
import { executeQuery, verifyPassword, generateToken, initializeDatabase } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    // Initialize database if needed
    await initializeDatabase();
    
    const { username, password } = await request.json();
    
    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username dan password harus diisi' },
        { status: 400 }
      );
    }
    
    // Get admin from database
    const admin = await executeQuery(
      'SELECT * FROM admin WHERE username = ? AND is_active = TRUE',
      [username]
    );
    
    if (admin.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Username atau password salah' },
        { status: 401 }
      );
    }
    
    const adminData = admin[0];
    
    // Verify password
    const isValidPassword = await verifyPassword(password, adminData.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Username atau password salah' },
        { status: 401 }
      );
    }
    
    // Update last login
    await executeQuery(
      'UPDATE admin SET last_login = NOW() WHERE id = ?',
      [adminData.id]
    );
    
    // Generate JWT token
    const tokenPayload = {
      id: adminData.id,
      username: adminData.username,
      email: adminData.email,
      nama: adminData.nama,
      role: adminData.role
    };
    
    const token = generateToken(tokenPayload);
    

    
    // Store session in database
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    await executeQuery(
      'INSERT INTO admin_sessions (admin_id, token_hash, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))',
      [adminData.id, token, ipAddress, userAgent]
    );
    
    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      admin: {
        id: adminData.id,
        username: adminData.username,
        email: adminData.email,
        nama: adminData.nama,
        role: adminData.role
      }
    });
    
    // Set cookie dengan pengaturan untuk debugging
    response.cookies.set('admin_token', token, {
      httpOnly: false,  // Sementara false untuk debugging
      secure: false,    // false untuk development
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 jam
      path: '/'
    });
    

    
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    
    if (token) {
      // Remove session from database
      await executeQuery(
        'DELETE FROM admin_sessions WHERE token_hash = ?',
        [token]
      );
    }
    
    // Clear the cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logout berhasil'
    });
    
    response.cookies.set('admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}