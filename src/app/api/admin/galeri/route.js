import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// GET - Fetch all gallery items
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const kategori = searchParams.get('kategori') || '';
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    let params = [];
    
    if (search) {
      whereClause += ' AND (judul LIKE ? OR deskripsi LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (kategori) {
      whereClause += ' AND kategori = ?';
      params.push(kategori);
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM galeri ${whereClause}`;
    const countResult = await executeQuery(countQuery, params);
    const total = countResult[0].total;
    
    // Get gallery data
    const query = `
      SELECT id, judul, deskripsi, gambar, kategori, tanggal_dibuat, tanggal_diperbarui
      FROM galeri 
      ${whereClause}
      ORDER BY tanggal_dibuat DESC
      LIMIT ? OFFSET ?
    `;
    
    const gallery = await executeQuery(query, [...params, limit, offset]);
    
    return NextResponse.json({
      success: true,
      data: gallery,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data galeri' },
      { status: 500 }
    );
  }
}

// POST - Create new gallery item
export async function POST(request) {
  try {
    const adminId = request.headers.get('x-admin-id');
    
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const formData = await request.formData();
    const judul = formData.get('judul');
    const deskripsi = formData.get('deskripsi');
    const kategori = formData.get('kategori');
    const gambar = formData.get('gambar');
    
    if (!judul || !gambar) {
      return NextResponse.json(
        { success: false, error: 'Judul dan gambar harus diisi' },
        { status: 400 }
      );
    }
    
    let gambarPath = null;
    
    // Handle image upload
    if (gambar && gambar.size > 0) {
      const bytes = await gambar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'galeri');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const extension = gambar.name.split('.').pop();
      const filename = `${timestamp}.${extension}`;
      const filepath = join(uploadsDir, filename);
      
      await writeFile(filepath, buffer);
      gambarPath = `/uploads/galeri/${filename}`;
    }
    
    const query = `
      INSERT INTO galeri (judul, deskripsi, gambar, kategori, admin_id, tanggal_dibuat, tanggal_diperbarui)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const result = await executeQuery(query, [judul, deskripsi, gambarPath, kategori, adminId]);
    
    return NextResponse.json({
      success: true,
      message: 'Foto berhasil ditambahkan',
      data: { id: result.insertId }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal menambahkan foto' },
      { status: 500 }
    );
  }
}