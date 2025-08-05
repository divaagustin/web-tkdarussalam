import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET - Fetch single registration by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const query = 'SELECT * FROM pendaftaran WHERE id = ?';
    const registration = await executeQuery(query, [id]);
    
    if (registration.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pendaftaran tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: registration[0]
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data pendaftaran' },
      { status: 500 }
    );
  }
}

// PUT - Update registration status
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const adminId = request.headers.get('x-admin-id');
    
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if registration exists
    const existingRegistration = await executeQuery('SELECT * FROM pendaftaran WHERE id = ?', [id]);
    if (existingRegistration.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pendaftaran tidak ditemukan' },
        { status: 404 }
      );
    }
    
    const { status, catatan } = await request.json();
    
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status tidak valid' },
        { status: 400 }
      );
    }
    
    const query = `
      UPDATE pendaftaran 
      SET status = ?, catatan = ?, tanggal_diperbarui = NOW()
      WHERE id = ?
    `;
    
    await executeQuery(query, [status, catatan || null, id]);
    
    let message = 'Status pendaftaran berhasil diperbarui';
    if (status === 'approved') {
      message = 'Pendaftaran berhasil disetujui';
    } else if (status === 'rejected') {
      message = 'Pendaftaran berhasil ditolak';
    }
    
    return NextResponse.json({
      success: true,
      message
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui pendaftaran' },
      { status: 500 }
    );
  }
}

// DELETE - Delete registration
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const adminId = request.headers.get('x-admin-id');
    
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if registration exists
    const existingRegistration = await executeQuery('SELECT * FROM pendaftaran WHERE id = ?', [id]);
    if (existingRegistration.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pendaftaran tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Delete registration from database
    await executeQuery('DELETE FROM pendaftaran WHERE id = ?', [id]);
    
    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil dihapus'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus pendaftaran' },
      { status: 500 }
    );
  }
}