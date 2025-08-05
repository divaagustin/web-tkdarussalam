import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// GET - Fetch all news
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    let params = [];
    
    if (search) {
      whereClause += ' AND (judul LIKE ? OR konten LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM berita ${whereClause}`;
    const countResult = await executeQuery(countQuery, params);
    const total = countResult[0].total;
    
    // Get news data
    const query = `
      SELECT id, judul, konten, gambar, status, tanggal_dibuat, tanggal_diperbarui
      FROM berita 
      ${whereClause}
      ORDER BY tanggal_dibuat DESC
      LIMIT ? OFFSET ?
    `;
    
    const news = await executeQuery(query, [...params, limit, offset]);
    
    return NextResponse.json({
      success: true,
      data: news,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data berita' },
      { status: 500 }
    );
  }
}

// POST - Create new news
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
    const konten = formData.get('konten');
    const status = formData.get('status') || 'draft';
    const gambar = formData.get('gambar');
    
    if (!judul || !konten) {
      return NextResponse.json(
        { success: false, error: 'Judul dan konten harus diisi' },
        { status: 400 }
      );
    }
    
    let gambarPath = null;
    
    // Handle image upload
    if (gambar && gambar.size > 0) {
      const bytes = await gambar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'berita');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const extension = gambar.name.split('.').pop();
      const filename = `${timestamp}.${extension}`;
      const filepath = join(uploadsDir, filename);
      
      await writeFile(filepath, buffer);
      gambarPath = `/uploads/berita/${filename}`;
    }
    
    const query = `
      INSERT INTO berita (judul, konten, gambar, status, admin_id, tanggal_dibuat, tanggal_diperbarui)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const result = await executeQuery(query, [judul, konten, gambarPath, status, adminId]);
    
    return NextResponse.json({
      success: true,
      message: 'Berita berhasil ditambahkan',
      data: { id: result.insertId }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal menambahkan berita' },
      { status: 500 }
    );
  }
}