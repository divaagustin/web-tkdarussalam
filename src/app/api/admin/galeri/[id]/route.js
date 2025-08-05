import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// GET - Fetch single gallery item by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const query = 'SELECT * FROM galeri WHERE id = ?';
    const gallery = await executeQuery(query, [id]);
    
    if (gallery.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Foto tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: gallery[0]
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data foto' },
      { status: 500 }
    );
  }
}

// PUT - Update gallery item
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
    
    // Check if gallery item exists
    const existingItem = await executeQuery('SELECT * FROM galeri WHERE id = ?', [id]);
    if (existingItem.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Foto tidak ditemukan' },
        { status: 404 }
      );
    }
    
    const formData = await request.formData();
    const judul = formData.get('judul');
    const deskripsi = formData.get('deskripsi');
    const kategori = formData.get('kategori');
    const gambar = formData.get('gambar');
    
    if (!judul) {
      return NextResponse.json(
        { success: false, error: 'Judul harus diisi' },
        { status: 400 }
      );
    }
    
    let gambarPath = existingItem[0].gambar; // Keep existing image by default
    
    // Handle image upload
    if (gambar && gambar.size > 0) {
      const bytes = await gambar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'galeri');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      
      // Delete old image if exists
      if (existingItem[0].gambar) {
        const oldImagePath = join(process.cwd(), 'public', existingItem[0].gambar);
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
      gambarPath = `/uploads/galeri/${filename}`;
    }
    
    const query = `
      UPDATE galeri 
      SET judul = ?, deskripsi = ?, gambar = ?, kategori = ?, tanggal_diperbarui = NOW()
      WHERE id = ?
    `;
    
    await executeQuery(query, [judul, deskripsi, gambarPath, kategori, id]);
    
    return NextResponse.json({
      success: true,
      message: 'Foto berhasil diperbarui'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui foto' },
      { status: 500 }
    );
  }
}

// DELETE - Delete gallery item
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
    
    // Check if gallery item exists and get image path
    const existingItem = await executeQuery('SELECT * FROM galeri WHERE id = ?', [id]);
    if (existingItem.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Foto tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Delete image file if exists
    if (existingItem[0].gambar) {
      const imagePath = join(process.cwd(), 'public', existingItem[0].gambar);
      try {
        if (existsSync(imagePath)) {
          await unlink(imagePath);
        }
      } catch (error) {
        // Error deleting image - continue with deletion
      }
    }
    
    // Delete gallery item from database
    await executeQuery('DELETE FROM galeri WHERE id = ?', [id]);
    
    return NextResponse.json({
      success: true,
      message: 'Foto berhasil dihapus'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus foto' },
      { status: 500 }
    );
  }
}