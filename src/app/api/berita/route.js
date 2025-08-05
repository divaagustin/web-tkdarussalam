import { NextResponse } from 'next/server';
import { getConnection, initializeDatabase } from '@/lib/db';

export async function GET(request) {
  try {
    await initializeDatabase();
    const connection = await getConnection();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') || 10;
    const offset = searchParams.get('offset') || 0;
    
    let query = 'SELECT * FROM berita';
    let params = [];
    
    if (category && category !== 'all') {
      query += ' WHERE kategori = ?';
      params.push(category);
    }
    
    query += ' ORDER BY tanggal_dibuat DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [rows] = await connection.execute(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM berita';
    let countParams = [];
    
    if (category && category !== 'all') {
      countQuery += ' WHERE kategori = ?';
      countParams.push(category);
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
      { success: false, error: 'Failed to fetch berita' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await initializeDatabase();
    const connection = await getConnection();
    
    const body = await request.json();
    const { judul, konten, kategori, gambar, status = 'draft' } = body;
    
    if (!judul || !konten || !kategori) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const query = `
      INSERT INTO berita (judul, konten, kategori, gambar, status, tanggal_dibuat, tanggal_diperbarui)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const [result] = await connection.execute(query, [
      judul,
      konten,
      kategori,
      gambar,
      status
    ]);
    
    connection.release();
    
    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        judul,
        konten,
        kategori,
        gambar,
        status
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create berita' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await initializeDatabase();
    const connection = await getConnection();
    
    const body = await request.json();
    const { id, judul, konten, kategori, gambar, status } = body;
    
    if (!id || !judul || !konten || !kategori) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const query = `
      UPDATE berita 
      SET judul = ?, konten = ?, kategori = ?, gambar = ?, status = ?, tanggal_diperbarui = NOW()
      WHERE id = ?
    `;
    
    const [result] = await connection.execute(query, [
      judul,
      konten,
      kategori,
      gambar,
      status,
      id
    ]);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Berita not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: { id, judul, konten, kategori, gambar, status }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update berita' },
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
    
    const query = 'DELETE FROM berita WHERE id = ?';
    const [result] = await connection.execute(query, [id]);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Berita not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Berita deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete berita' },
      { status: 500 }
    );
  }
}