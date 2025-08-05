import { NextResponse } from 'next/server';
import { getConnection, initializeDatabase } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper function to verify admin token
async function verifyAdmin(request) {
  const token = request.cookies.get('admin-token')?.value;
  
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'your-secret-key');
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export async function PUT(request) {
  try {
    // Verify admin authentication
    const admin = await verifyAdmin(request);
    
    await initializeDatabase();
    const connection = await getConnection();
    
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'New passwords do not match' },
        { status: 400 }
      );
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    
    // Get current admin data
    const query = 'SELECT * FROM admin WHERE id = ?';
    const [rows] = await connection.execute(query, [admin.id]);
    
    if (rows.length === 0) {
      connection.release();
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 404 }
      );
    }
    
    const adminData = rows[0];
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, adminData.password);
    
    if (!isCurrentPasswordValid) {
      connection.release();
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 400 }
      );
    }
    
    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password in database
    const updateQuery = 'UPDATE admin SET password = ?, tanggal_diperbarui = NOW() WHERE id = ?';
    await connection.execute(updateQuery, [hashedNewPassword, admin.id]);
    
    connection.release();
    
    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    if (error.message === 'No token provided' || error.message === 'Invalid or expired token') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to change password' },
      { status: 500 }
    );
  }
}