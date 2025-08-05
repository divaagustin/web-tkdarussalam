import { NextResponse } from 'next/server';
import { executeQuery, hashPassword } from '@/lib/db';

// GET - Fetch settings
export async function GET(request) {
  try {
    const adminId = request.headers.get('x-admin-id');
    
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get school settings
    const settingsQuery = 'SELECT * FROM settings WHERE id = 1';
    const settings = await executeQuery(settingsQuery);
    
    // Get admin info
    const adminQuery = 'SELECT id, username, email, nama, role FROM admin WHERE id = ?';
    const admin = await executeQuery(adminQuery, [adminId]);
    
    return NextResponse.json({
      success: true,
      data: {
        settings: settings[0] || {},
        admin: admin[0] || {}
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil pengaturan' },
      { status: 500 }
    );
  }
}

// PUT - Update settings
export async function PUT(request) {
  try {
    const adminId = request.headers.get('x-admin-id');
    
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { type, data } = await request.json();
    
    if (type === 'school_info') {
      const { nama_sekolah, alamat, telepon, email, website, deskripsi } = data;
      
      const query = `
        UPDATE settings 
        SET nama_sekolah = ?, alamat = ?, telepon = ?, email = ?, website = ?, deskripsi = ?
        WHERE id = 1
      `;
      
      await executeQuery(query, [nama_sekolah, alamat, telepon, email, website, deskripsi]);
      
      return NextResponse.json({
        success: true,
        message: 'Informasi sekolah berhasil diperbarui'
      });
    }
    
    if (type === 'change_password') {
      const { current_password, new_password, confirm_password } = data;
      
      if (!current_password || !new_password || !confirm_password) {
        return NextResponse.json(
          { success: false, error: 'Semua field password harus diisi' },
          { status: 400 }
        );
      }
      
      if (new_password !== confirm_password) {
        return NextResponse.json(
          { success: false, error: 'Password baru dan konfirmasi tidak cocok' },
          { status: 400 }
        );
      }
      
      if (new_password.length < 6) {
        return NextResponse.json(
          { success: false, error: 'Password baru minimal 6 karakter' },
          { status: 400 }
        );
      }
      
      // Get current admin data
      const adminQuery = 'SELECT * FROM admin WHERE id = ?';
      const admin = await executeQuery(adminQuery, [adminId]);
      
      if (admin.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Admin tidak ditemukan' },
          { status: 404 }
        );
      }
      
      // Verify current password
      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare(current_password, admin[0].password);
      
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: 'Password saat ini salah' },
          { status: 400 }
        );
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(new_password);
      
      // Update password
      const updateQuery = 'UPDATE admin SET password = ? WHERE id = ?';
      await executeQuery(updateQuery, [hashedPassword, adminId]);
      
      return NextResponse.json({
        success: true,
        message: 'Password berhasil diperbarui'
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Tipe update tidak valid' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui pengaturan' },
      { status: 500 }
    );
  }
}