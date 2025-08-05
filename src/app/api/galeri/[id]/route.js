import { NextResponse } from 'next/server';
import { getConnection, initializeDatabase } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    await initializeDatabase();
    const connection = await getConnection();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID galeri diperlukan' },
        { status: 400 }
      );
    }
    
    const query = 'SELECT * FROM galeri WHERE id = ?';
    const [rows] = await connection.execute(query, [id]);
    
    connection.release();
    
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Galeri tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: rows[0]
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await initializeDatabase();
    const connection = await getConnection();
    
    const { id } = params;
    const body = await request.json();
    const { judul, deskripsi, kategori, penulis, gambar } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID galeri diperlukan' },
        { status: 400 }
      );
    }
    
    if (!judul || !deskripsi) {
      return NextResponse.json(
        { success: false, message: 'Judul dan deskripsi diperlukan' },
        { status: 400 }
      );
    }
    
    const query = `
      UPDATE galeri 
      SET judul = ?, deskripsi = ?, kategori = ?, penulis = ?, gambar = ?, tanggal_diperbarui = NOW()
      WHERE id = ?
    `;
    
    const [result] = await connection.execute(query, [
      judul, deskripsi, kategori || 'umum', penulis || 'Admin', gambar, id
    ]);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Galeri tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Galeri berhasil diperbarui'
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await initializeDatabase();
    const connection = await getConnection();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID galeri diperlukan' },
        { status: 400 }
      );
    }
    
    const query = 'DELETE FROM galeri WHERE id = ?';
    const [result] = await connection.execute(query, [id]);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Galeri tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Galeri berhasil dihapus'
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}