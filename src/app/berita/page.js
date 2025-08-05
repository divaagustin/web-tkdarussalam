'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalendarIcon, UserIcon, TagIcon, ClockIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Berita() {
  const [activeCategory, setActiveCategory] = useState('semua');
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'semua', name: 'Semua Berita' },
    { id: 'kegiatan', name: 'Kegiatan' },
    { id: 'pengumuman', name: 'Pengumuman' },
    { id: 'prestasi', name: 'Prestasi' },
    { id: 'pembelajaran', name: 'Pembelajaran' }
  ];

  // Fetch news data from API
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/berita?limit=50');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Transform API data to match component structure
            const transformedData = data.data.map(item => ({
              id: item.id,
              title: item.judul,
              excerpt: item.konten ? item.konten.substring(0, 150) + '...' : 'Tidak ada konten',
              content: item.konten,
              category: item.kategori || 'umum',
              author: item.penulis || 'Admin',
              date: new Date(item.tanggal_dibuat || item.tanggal).toLocaleDateString('id-ID'),
              readTime: Math.ceil((item.konten || '').split(' ').length / 200) + ' menit',
              image: item.gambar || '/images/news/default.svg',
              featured: false // You can add logic for featured articles
            }));
            setNewsItems(transformedData);
          } else {
            setError('Gagal memuat data berita');
          }
        } else {
          setError('Gagal terhubung ke server');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat memuat berita');
        // Fallback to static data if API fails
        setNewsItems(staticNewsItems);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, []);

  // Static fallback data
  const staticNewsItems = [
    {
      id: 1,
      title: 'Pendaftaran Siswa Baru Tahun Ajaran 2024/2025 Dibuka',
      excerpt: 'TK Darussalam Asahan membuka pendaftaran siswa baru untuk tahun ajaran 2024/2025. Dapatkan early bird discount untuk pendaftar awal.',
      content: 'TK Darussalam Asahan dengan bangga mengumumkan pembukaan pendaftaran siswa baru untuk tahun ajaran 2024/2025. Kami menyediakan program pendidikan berkualitas dengan kurikulum yang disesuaikan dengan perkembangan anak usia dini...',
      category: 'pengumuman',
      author: 'Admin TK Darussalam',
      date: '2024-01-15',
      image: '/images/gallery/classroom-learning.svg',
      featured: true
    },
    {
      id: 2,
      title: 'Siswa TK Darussalam Raih Juara 1 Lomba Mewarnai Tingkat Kabupaten',
      excerpt: 'Ananda Siti Aisyah dari kelas B berhasil meraih juara 1 dalam lomba mewarnai yang diselenggarakan oleh Dinas Pendidikan Kabupaten Asahan.',
      content: 'Prestasi membanggakan kembali diraih oleh siswa TK Darussalam Asahan. Ananda Siti Aisyah dari kelas B berhasil meraih juara 1 dalam lomba mewarnai tingkat kabupaten...',
      category: 'prestasi',
      author: 'Ibu Sari',
      date: '2024-01-10',
      image: '/images/news/competition.svg',
      featured: false
    },
    {
      id: 3,
      title: 'Kegiatan Field Trip ke Kebun Binatang Medan',
      excerpt: 'Siswa-siswi TK Darussalam mengikuti kegiatan field trip edukatif ke Kebun Binatang Medan untuk mengenal berbagai jenis hewan.',
      content: 'Dalam rangka memberikan pengalaman belajar yang menyenangkan, TK Darussalam mengadakan kegiatan field trip ke Kebun Binatang Medan. Kegiatan ini diikuti oleh seluruh siswa kelas A dan B...',
      category: 'kegiatan',
      author: 'Ibu Maya',
      date: '2024-01-08',
      image: '/images/news/field-trip.svg',
      featured: true
    },
    {
      id: 4,
      title: 'Wisuda Angkatan 2023 - Momen Kebanggaan TK Darussalam',
      excerpt: 'Upacara wisuda siswa angkatan 2023 berlangsung meriah dengan penuh kebanggaan dan kegembiraan dari seluruh keluarga besar TK Darussalam.',
      content: 'Upacara wisuda siswa TK Darussalam angkatan 2023 telah berlangsung dengan sukses dan meriah. Sebanyak 45 siswa dinyatakan lulus dan siap melanjutkan pendidikan ke jenjang sekolah dasar...',
      category: 'kegiatan',
      author: 'Ibu Rina',
      date: '2024-01-05',
      image: '/images/news/graduation-ceremony.svg',
      featured: false
    },
    {
      id: 5,
      title: 'Kelas Seni dan Musik - Mengembangkan Kreativitas Anak',
      excerpt: 'Program kelas seni dan musik TK Darussalam membantu mengembangkan kreativitas dan bakat seni anak-anak dengan metode pembelajaran yang menyenangkan.',
      content: 'TK Darussalam memiliki program unggulan berupa kelas seni dan musik yang dirancang khusus untuk mengembangkan kreativitas anak. Program ini mencakup kegiatan melukis, menggambar, dan bermain musik...',
      category: 'info',
      author: 'Ibu Maya',
      date: '2024-01-03',
      image: '/images/gallery/art-class.svg',
      featured: false
    },
    {
      id: 6,
      title: 'Workshop Parenting untuk Orang Tua Siswa',
      excerpt: 'TK Darussalam mengadakan workshop parenting dengan tema "Mendidik Anak di Era Digital" untuk para orang tua siswa.',
      content: 'Dalam upaya meningkatkan kualitas pendidikan anak, TK Darussalam mengadakan workshop parenting dengan tema "Mendidik Anak di Era Digital". Workshop ini menghadirkan psikolog anak sebagai narasumber...',
      category: 'kegiatan',
      author: 'Ibu Dewi',
      date: '2024-01-01',
      image: '/images/gallery/music-class.svg',
      featured: false
    }
  ];

  const filteredNews = activeCategory === 'semua' 
    ? newsItems 
    : newsItems.filter(item => item.category === activeCategory);

  const featuredNews = newsItems.filter(item => item.featured);
  const regularNews = newsItems.filter(item => !item.featured);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Berita & <span className="text-green-600">Informasi</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Dapatkan informasi terkini tentang kegiatan, prestasi, dan 
                pengumuman penting dari TK Darussalam Asahan.
              </p>
            </div>
          </div>
        </section>
        
        {/* Loading State */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat berita...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Berita & <span className="text-green-600">Informasi</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Dapatkan informasi terkini tentang kegiatan, prestasi, dan 
                pengumuman penting dari TK Darussalam Asahan.
              </p>
            </div>
          </div>
        </section>
        
        {/* Error State */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Berita & <span className="text-green-600">Informasi</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dapatkan informasi terkini tentang kegiatan, prestasi, dan 
              pengumuman penting dari TK Darussalam Asahan.
            </p>
          </div>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Berita Utama</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredNews.map((news) => (
                <article key={news.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <TagIcon className="w-4 h-4" />
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {getCategoryName(news.category)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{formatDate(news.date)}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {news.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <UserIcon className="w-4 h-4" />
                        <span>{news.author}</span>
                      </div>
                      <Link 
                        href={`/berita/${news.id}`}
                        className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                      >
                        Baca Selengkapnya
                        <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter Categories */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.filter(news => !news.featured).map((news) => (
              <article key={news.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {getCategoryName(news.category)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(news.date)}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <UserIcon className="w-4 h-4" />
                      <span>{news.author}</span>
                    </div>
                    <Link 
                      href={`/berita/${news.id}`}
                      className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      Baca
                      <ChevronRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada berita ditemukan
              </h3>
              <p className="text-gray-600">
                Coba pilih kategori lain atau kembali ke semua berita.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Jangan Lewatkan Berita Terbaru
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Dapatkan informasi terkini tentang kegiatan dan pengumuman 
            penting langsung ke email Anda.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-green-300 focus:outline-none"
            />
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Berlangganan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}