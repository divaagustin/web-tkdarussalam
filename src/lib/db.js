import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tk_darussalam',
  port: process.env.DB_PORT,
    // Bagian ini adalah kunci untuk koneksi SSL ke Aiven
    ssl: {
      ca: process.env.AIVEN_CA_CERT,
    },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

export default pool;

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Password hashing utilities
export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// JWT utilities
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Edge Runtime compatible token verification
export const verifyToken = async (token) => {
  try {
    // Check if we're in Edge Runtime
    const isEdgeRuntime = typeof EdgeRuntime !== 'undefined' || typeof crypto !== 'undefined' && !crypto.createHash;
    
    if (isEdgeRuntime) {
      // Use Web Crypto API for Edge Runtime
      const result = await verifyTokenWebCrypto(token, JWT_SECRET);
      return result;
    } else {
      // Use jsonwebtoken for Node.js runtime
      const result = jwt.verify(token, JWT_SECRET);
      return result;
    }
  } catch (error) {
    return null;
  }
};

// Web Crypto API implementation for Edge Runtime
async function verifyTokenWebCrypto(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const [header, payload, signature] = parts;
    const data = `${header}.${payload}`;
    
    // Import the secret key
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    // Verify the signature
    const signatureBytes = new Uint8Array(
      atob(signature.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map(char => char.charCodeAt(0))
    );
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      new TextEncoder().encode(data)
    );
    
    if (!isValid) {
      throw new Error('Invalid signature');
    }
    
    // Decode and return payload
    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    );
    
    // Check expiration
    if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
      throw new Error('Token expired');
    }
    
    return decodedPayload;
  } catch (error) {
    return null;
  }
}

// Database connection utilities
export const getConnection = async () => {
  try {
    return await pool.getConnection();
  } catch (error) {
    throw error;
  }
};

// Database query utilities
export const executeQuery = async (query, params = []) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(query, params);
    connection.release();
    return results;
  } catch (error) {
    throw error;
  }
};

// Function to initialize database tables
export async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create admin table first
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        nama VARCHAR(255) NOT NULL,
        role ENUM('admin', 'super_admin') DEFAULT 'admin',
        last_login TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create berita table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS berita (
        id INT AUTO_INCREMENT PRIMARY KEY,
        judul VARCHAR(255) NOT NULL,
        konten TEXT NOT NULL,
        kategori ENUM('pengumuman', 'kegiatan', 'prestasi', 'umum') DEFAULT 'umum',
        gambar VARCHAR(255),
        tanggal_publikasi DATETIME DEFAULT CURRENT_TIMESTAMP,
        tanggal_dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tanggal_diperbarui TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        status ENUM('draft', 'published') DEFAULT 'draft',
        author_id INT,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES admin(id) ON DELETE SET NULL
      )
    `);
    
    // Create galeri table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS galeri (
        id INT AUTO_INCREMENT PRIMARY KEY,
        judul VARCHAR(255) NOT NULL,
        deskripsi TEXT,
        gambar VARCHAR(255) NOT NULL,
        kategori ENUM('kegiatan', 'pembelajaran', 'acara', 'fasilitas') DEFAULT 'kegiatan',
        tipe ENUM('foto', 'video') DEFAULT 'foto',
        url_media VARCHAR(500),
        thumbnail VARCHAR(500),
        tanggal_dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tanggal_diperbarui TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        author_id INT,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES admin(id) ON DELETE SET NULL
      )
    `);
    
    // Create pendaftaran table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS pendaftaran (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_lengkap VARCHAR(255) NOT NULL,
        nama_anak VARCHAR(255),
        tanggal_lahir DATE NOT NULL,
        jenis_kelamin ENUM('L', 'P') NOT NULL,
        alamat TEXT NOT NULL,
        nama_orang_tua VARCHAR(255) NOT NULL,
        nama_ayah VARCHAR(255),
        nama_ibu VARCHAR(255),
        pekerjaan_ayah VARCHAR(255),
        pekerjaan_ibu VARCHAR(255),
        no_telepon VARCHAR(20) NOT NULL,
        telepon VARCHAR(20),
        email VARCHAR(255),
        program ENUM('reguler', 'fullday') DEFAULT 'reguler',
        tahun_ajaran VARCHAR(10) NOT NULL,
        status ENUM('pending', 'diterima', 'ditolak', 'menunggu') DEFAULT 'pending',
        catatan TEXT,
        tanggal_daftar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_by INT,
        processed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (processed_by) REFERENCES admin(id) ON DELETE SET NULL
      )
    `);
    
    // Create admin sessions table for security
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NOT NULL,
        token_hash VARCHAR(255) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE CASCADE
      )
    `);
    
    // Check if default admin exists
    const [adminExists] = await connection.execute(
      'SELECT COUNT(*) as count FROM admin WHERE username = ?',
      ['admin']
    );
    
    // Create default admin if doesn't exist
    if (adminExists[0].count === 0) {
      const defaultPassword = await hashPassword('admin123');
      await connection.execute(
        'INSERT INTO admin (username, password, email, nama, role) VALUES (?, ?, ?, ?, ?)',
        ['admin', defaultPassword, 'admin@tkdarussalam.com', 'Administrator', 'super_admin']
      );
    }
    
    // Insert default settings if not exists
    const [settingsExists] = await connection.execute(
      'SELECT COUNT(*) as count FROM settings WHERE id = 1'
    );
    
    if (settingsExists[0].count === 0) {
      await connection.execute(`
        INSERT INTO settings (id, nama_sekolah, alamat, telepon, email, website, deskripsi) 
        VALUES (1, 'TK Darussalam Asahan', 'Jl. Pendidikan No. 123, Kisaran, Kabupaten Asahan', 
                '+62 812-3456-7890', 'info@tkdarussalam-asahan.sch.id', 
                'https://tkdarussalam-asahan.sch.id', 
                'TK Darussalam adalah lembaga pendidikan anak usia dini yang berkomitmen memberikan pendidikan terbaik untuk anak-anak.')
      `);
    }
    
    connection.release();
  } catch (error) {
    throw error;
  }
}