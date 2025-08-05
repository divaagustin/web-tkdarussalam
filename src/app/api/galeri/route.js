import { NextResponse } from 'next/server';
// Pastikan path ini benar menuju file koneksi database Anda
import { getConnection, initializeDatabase } from '@/lib/db';

export async function GET(request) {
  try {
    // Fungsi ini bisa jadi tidak efisien jika dijalankan setiap saat, 
    // tetapi kita biarkan dulu untuk fokus pada error utama.
    await initializeDatabase();
    const connection = await getConnection();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');

    // --- PERBAIKAN VALIDASI INPUT ---
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    // Ubah ke angka, cek apakah valid, dan pastikan tidak negatif
    let limit = parseInt(limitParam, 10);
    if (isNaN(limit) || limit <= 0) {
      limit = 12; // Gunakan nilai default yang aman jika tidak valid
    }

    // Lakukan hal yang sama untuk offset
    let offset = parseInt(offsetParam, 10);
    if (isNaN(offset) || offset < 0) {
      offset = 0; // Gunakan nilai default yang aman jika tidak valid
    }
    // --- SELESAI PERBAIKAN VALIDASI INPUT ---
    
    let query = 'SELECT * FROM galeri WHERE 1=1';
    let params = [];
    
    if (category && category !== 'all') {
      query += ' AND kategori = ?';
      params.push(category);
    }
    
    if (type && type !== 'all') {
      query += ' AND tipe = ?';
      params.push(type);
    }
    
    query += ' ORDER BY tanggal_dibuat DESC LIMIT ? OFFSET ?';
    // Sekarang kita yakin limit dan offset adalah angka yang valid
    params.push(limit, offset);
    
    const [rows] = await connection.execute(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM galeri WHERE 1=1';
    let countParams = [];
    
    if (category && category !== 'all') {
      countQuery += ' AND kategori = ?';
      countParams.push(category);
    }
    
    if (type && type !== 'all') {
      countQuery += ' AND tipe = ?';
      countParams.push(type);
    }
    
    const [countResult] = await connection.execute(countQuery, countParams);
    const total = countResult[0].total;
    
    connection.release();
    
    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        total,
        limit: limit, // Gunakan variabel yang sudah divalidasi
        offset: offset, // Gunakan variabel yang sudah divalidasi
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    // Log error yang sebenarnya untuk debugging
    console.error("!!! DATABASE ERROR DI /api/galeri [GET] !!!:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch galeri' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await initializeDatabase();
    const connection = await getConnection();
    
    const body = await request.json();
    const { judul, deskripsi, kategori, tipe, url_media, thumbnail } = body;
    
    if (!judul || !kategori || !tipe || !url_media) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const query = `
      INSERT INTO galeri (judul, deskripsi, kategori, tipe, url_media, thumbnail, tanggal_dibuat, tanggal_diperbarui)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const [result] = await connection.execute(query, [
      judul,
      deskripsi,
      kategori,
      tipe,
      url_media,
      thumbnail
    ]);
    
    connection.release();
    
    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        judul,
        deskripsi,
        kategori,
        tipe,
        url_media,
        thumbnail
      }
    });
  } catch (error) {
    // PERBAIKAN: Menambahkan error logging
    console.error("!!! DATABASE ERROR DI /api/galeri [POST] !!!:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to create galeri' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await initializeDatabase();
    const connection = await getConnection();
    
    const body = await request.json();
    const { id, judul, deskripsi, kategori, tipe, url_media, thumbnail } = body;
    
    if (!id || !judul || !kategori || !tipe || !url_media) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const query = `
      UPDATE galeri 
      SET judul = ?, deskripsi = ?, kategori = ?, tipe = ?, url_media = ?, thumbnail = ?, tanggal_diperbarui = NOW()
      WHERE id = ?
    `;
    
    const [result] = await connection.execute(query, [
      judul,
      deskripsi,
      kategori,
      tipe,
      url_media,
      thumbnail,
      id
    ]);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Galeri item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: { id, judul, deskripsi, kategori, tipe, url_media, thumbnail }
    });
  } catch (error) {
    // PERBAIKAN: Menambahkan error logging
    console.error("!!! DATABASE ERROR DI /api/galeri [PUT] !!!:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to update galeri' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await initializeDatabase();
    const connection = await getConnection();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing ID parameter' },
        { status: 400 }
      );
    }
    
    const query = 'DELETE FROM galeri WHERE id = ?';
    const [result] = await connection.execute(query, [id]);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Galeri item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Galeri item deleted successfully'
    });
  } catch (error) {
    // PERBAIKAN: Menambahkan error logging
    console.error("!!! DATABASE ERROR DI /api/galeri [DELETE] !!!:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete galeri' },
      { status: 500 }
    );
  }
}