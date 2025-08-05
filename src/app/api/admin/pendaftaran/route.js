import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET - Fetch all registrations
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const tahun = searchParams.get('tahun') || '';
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    let params = [];
    
    if (search) {
      whereClause += ' AND (nama_anak LIKE ? OR nama_ayah LIKE ? OR nama_ibu LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }
    
    if (tahun) {
      whereClause += ' AND YEAR(tanggal_daftar) = ?';
      params.push(tahun);
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM pendaftaran ${whereClause}`;
    const countResult = await executeQuery(countQuery, params);
    const total = countResult[0].total;
    
    // Get registration data
    const query = `
      SELECT id, nama_anak, tempat_lahir_anak, tanggal_lahir_anak, jenis_kelamin,
             nama_ayah, nama_ibu, alamat, no_telepon, email, status, 
             tanggal_daftar, tanggal_diperbarui
      FROM pendaftaran 
      ${whereClause}
      ORDER BY tanggal_daftar DESC
      LIMIT ? OFFSET ?
    `;
    
    const registrations = await executeQuery(query, [...params, limit, offset]);
    
    return NextResponse.json({
      success: true,
      data: registrations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data pendaftaran' },
      { status: 500 }
    );
  }
}

// GET registration statistics
export async function POST(request) {
  try {
    const { action } = await request.json();
    
    if (action === 'statistics') {
      const { searchParams } = new URL(request.url);
      const tahun = searchParams.get('tahun') || new Date().getFullYear();
      
      const statsQuery = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
        FROM pendaftaran 
        WHERE YEAR(tanggal_daftar) = ?
      `;
      
      const stats = await executeQuery(statsQuery, [tahun]);
      
      return NextResponse.json({
        success: true,
        data: stats[0]
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil statistik' },
      { status: 500 }
    );
  }
}