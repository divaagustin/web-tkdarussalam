import { NextResponse } from 'next/server';
import { getConnection, initializeDatabase } from '@/lib/db';

export async function GET(request) {
  try {
    await initializeDatabase();
    const connection = await getConnection();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const limit = searchParams.get('limit') || 12;
    const offset = searchParams.get('offset') || 0;
    
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
    params.push(parseInt(limit), parseInt(offset));
    
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
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < total
      }
    });
  } catch (error) {
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
    return NextResponse.json(
      { success: false, error: 'Failed to delete galeri' },
      { status: 500 }
    );
  }
}