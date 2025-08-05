import { NextResponse } from 'next/server';
import { getConnection, initializeDatabase } from '@/lib/db';

export async function GET(request) {
  try {
    await initializeDatabase();
    const connection = await getConnection();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const program = searchParams.get('program');
    const limit = searchParams.get('limit') || 10;
    const offset = searchParams.get('offset') || 0;
    
    let query = 'SELECT * FROM pendaftaran WHERE 1=1';
    let params = [];
    
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (program && program !== 'all') {
      query += ' AND program = ?';
      params.push(program);
    }
    
    query += ' ORDER BY tanggal_daftar DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [rows] = await connection.execute(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM pendaftaran WHERE 1=1';
    let countParams = [];
    
    if (status && status !== 'all') {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    
    if (program && program !== 'all') {
      countQuery += ' AND program = ?';
      countParams.push(program);
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
      { success: false, error: 'Failed to fetch pendaftaran' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await initializeDatabase();
    const connection = await getConnection();
    
    const body = await request.json();
    const {
      nama_anak,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      nama_ayah,
      nama_ibu,
      pekerjaan_ayah,
      pekerjaan_ibu,
      telepon,
      email,
      program,
      catatan
    } = body;
    
    if (!nama_anak || !tanggal_lahir || !jenis_kelamin || !nama_ayah || !nama_ibu || !telepon || !program) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const query = `
      INSERT INTO pendaftaran (
        nama_anak, tanggal_lahir, jenis_kelamin, alamat,
        nama_ayah, nama_ibu, pekerjaan_ayah, pekerjaan_ibu,
        telepon, email, program, catatan, status, tanggal_daftar
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;
    
    const [result] = await connection.execute(query, [
      nama_anak,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      nama_ayah,
      nama_ibu,
      pekerjaan_ayah,
      pekerjaan_ibu,
      telepon,
      email,
      program,
      catatan
    ]);
    
    connection.release();
    
    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        nama_anak,
        tanggal_lahir,
        jenis_kelamin,
        alamat,
        nama_ayah,
        nama_ibu,
        pekerjaan_ayah,
        pekerjaan_ibu,
        telepon,
        email,
        program,
        catatan,
        status: 'pending'
      },
      message: 'Pendaftaran berhasil dikirim. Kami akan menghubungi Anda segera.'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create pendaftaran' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await initializeDatabase();
    const connection = await getConnection();
    
    const body = await request.json();
    const { id, status, catatan_admin } = body;
    
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const query = `
      UPDATE pendaftaran 
      SET status = ?, catatan_admin = ?, tanggal_diperbarui = NOW()
      WHERE id = ?
    `;
    
    const [result] = await connection.execute(query, [
      status,
      catatan_admin,
      id
    ]);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Pendaftaran not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: { id, status, catatan_admin },
      message: 'Status pendaftaran berhasil diperbarui'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update pendaftaran' },
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
    
    const query = 'DELETE FROM pendaftaran WHERE id = ?';
    const [result] = await connection.execute(query, [id]);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Pendaftaran not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Pendaftaran deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete pendaftaran' },
      { status: 500 }
    );
  }
}