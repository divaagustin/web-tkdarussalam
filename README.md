# Website TK Darussalam Asahan

Website resmi Taman Kanak-Kanak Darussalam Asahan yang dibangun menggunakan Next.js, Tailwind CSS, dan MySQL.

## Fitur Utama

### Halaman Publik
1. **Beranda** - Halaman utama dengan informasi sekolah
2. **Tentang Kami** - Sejarah, visi, misi, dan fasilitas sekolah
3. **Galeri** - Koleksi foto dan video kegiatan sekolah
4. **Berita** - Artikel dan pengumuman terbaru
5. **Hubungi Kami** - Informasi kontak dan formulir pesan
6. **Pendaftaran** - Formulir pendaftaran siswa baru

### Dashboard Admin
- Login/logout admin
- Manajemen berita (CRUD)
- Manajemen galeri (CRUD)
- Manajemen pendaftaran siswa
- Pengaturan sekolah
- Ubah password admin

## Teknologi yang Digunakan

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL
- **Authentication**: JWT dengan HTTP-only cookies
- **Icons**: Heroicons, Lucide React
- **UI Components**: Headless UI

## Instalasi dan Setup

### Prasyarat
- Node.js (versi 18 atau lebih baru)
- MySQL Server
- npm atau yarn

### Langkah Instalasi

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup Database**
   - Buat database MySQL baru
   - Update konfigurasi database di file `.env.local`

3. **Konfigurasi Environment Variables**
   
   File `.env.local` sudah tersedia dengan konfigurasi:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=tk_darussalam
   
   # NextAuth Configuration
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # Default Admin Credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ADMIN_EMAIL=admin@tkdarussalam.sch.id
   ```

4. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

5. **Akses Website**
   - Website: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin

## Kredensial Default Admin

- **Username**: admin
- **Password**: admin123
- **Email**: admin@tkdarussalam.sch.id

*Pastikan untuk mengubah password default setelah login pertama kali.*

## Struktur Database

Database akan dibuat otomatis saat pertama kali menjalankan aplikasi dengan tabel:
- `berita` - Manajemen artikel dan berita
- `galeri` - Koleksi foto dan video
- `pendaftaran` - Data pendaftaran siswa baru
- `admin` - Data administrator

## API Endpoints

- `/api/berita` - CRUD operasi untuk berita
- `/api/galeri` - CRUD operasi untuk galeri
- `/api/pendaftaran` - CRUD operasi untuk pendaftaran
- `/api/auth/login` - Autentikasi admin
- `/api/auth/verify` - Verifikasi token
- `/api/auth/change-password` - Ubah password
- `/api/settings` - Pengaturan sekolah

## Kontak

Untuk pertanyaan atau dukungan teknis:
- Email: info@tkdarussalam.sch.id
- Telepon: (0623) 123-4567
- Website: www.tkdarussalam.sch.id
