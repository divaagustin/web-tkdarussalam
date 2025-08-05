import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// GET - Fetch single news by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const query = 'SELECT * FROM berita WHERE id = ?';
    const news = await executeQuery(query, [id]);
    
    if (news.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Berita tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: news[0]
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data berita' },
      { status: 500 }
    );
  }
}

// PUT - Update news
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
    
    // Check if news exists
    const existingNews = await executeQuery('SELECT * FROM berita WHERE id = ?', [id]);
    if (existingNews.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Berita tidak ditemukan' },
        { status: 404 }
      );
    }
    
    const formData = await request.formData();
    const judul = formData.get('judul');
    const konten = formData.get('konten');
    const status = formData.get('status');
    const gambar = formData.get('gambar');
    
    if (!judul || !konten) {
      return NextResponse.json(
        { success: false, error: 'Judul dan konten harus diisi' },
        { status: 400 }
      );
    }
    
    let gambarPath = existingNews[0].gambar; // Keep existing image by default
    
    // Handle image upload
    if (gambar && gambar.size > 0) {
      const bytes = await gambar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'berita');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      
      // Delete old image if exists
      if (existingNews[0].gambar) {
        const oldImagePath = join(process.cwd(), 'public', existingNews[0].gambar);
        try {
          if (existsSync(oldImagePath)) {
            await unlink(oldImagePath);
          }
        } catch (error) {
          // Error deleting old image - continue with update
        }
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
      UPDATE berita 
      SET judul = ?, konten = ?, gambar = ?, status = ?, tanggal_diperbarui = NOW()
      WHERE id = ?
    `;
    
    await executeQuery(query, [judul, konten, gambarPath, status, id]);
    
    return NextResponse.json({
      success: true,
      message: 'Berita berhasil diperbarui'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui berita' },
      { status: 500 }
    );
  }
}

// DELETE - Delete news
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
    
    // Check if news exists and get image path
    const existingNews = await executeQuery('SELECT * FROM berita WHERE id = ?', [id]);
    if (existingNews.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Berita tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Delete image file if exists
    if (existingNews[0].gambar) {
      const imagePath = join(process.cwd(), 'public', existingNews[0].gambar);
      try {
        if (existsSync(imagePath)) {
          await unlink(imagePath);
        }
      } catch (error) {
        // Error deleting image - continue with deletion
      }
    }
    
    // Delete news from database
    await executeQuery('DELETE FROM berita WHERE id = ?', [id]);
    
    return NextResponse.json({
      success: true,
      message: 'Berita berhasil dihapus'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus berita' },
      { status: 500 }
    );
  }
}