import { NextResponse } from 'next/server';
import { getConnection, initializeDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';

// Helper function to verify admin token
async function verifyAdmin(request) {
  const token = request.cookies.get('admin-token')?.value;
  
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'your-secret-key');
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export async function GET(request) {
  try {
    await initializeDatabase();
    const connection = await getConnection();
    
    // Get school settings (you can create a settings table or use a simple key-value approach)
    const settings = {
      nama_sekolah: 'TK Darussalam Asahan',
      alamat: 'Jl. Pendidikan No. 123, Asahan, Sumatera Utara',
      telepon: '(0623) 123-4567',
      email: 'info@tkdarussalam.sch.id',
      website: 'www.tkdarussalam.sch.id',
      kepala_sekolah: 'Dra. Siti Aminah, M.Pd',
      tahun_berdiri: '1995',
      visi: 'Menjadi lembaga pendidikan anak usia dini yang unggul, berkarakter Islami, dan berwawasan global.',
      misi: [
        'Menyelenggarakan pendidikan yang berkualitas dengan pendekatan pembelajaran yang menyenangkan',
        'Mengembangkan potensi anak secara optimal melalui kegiatan yang kreatif dan inovatif',
        'Menanamkan nilai-nilai agama Islam dan akhlak mulia sejak dini',
        'Membangun kerjasama yang baik dengan orang tua dan masyarakat'
      ],
      jam_operasional: {
        senin_jumat: '07:00 - 16:00',
        sabtu: '07:00 - 12:00',
        minggu: 'Tutup'
      },
      sosial_media: {
        facebook: 'https://facebook.com/tkdarussalam',
        instagram: 'https://instagram.com/tkdarussalam',
        youtube: 'https://youtube.com/tkdarussalam'
      }
    };
    
    connection.release();
    
    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // Verify admin authentication
    await verifyAdmin(request);
    
    await initializeDatabase();
    const connection = await getConnection();
    
    const body = await request.json();
    
    // In a real application, you would save these settings to a database
    // For now, we'll just return success
    // You can implement a settings table to store these values
    
    connection.release();
    
    return NextResponse.json({
      success: true,
      data: body,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    if (error.message === 'No token provided' || error.message === 'Invalid or expired token') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}