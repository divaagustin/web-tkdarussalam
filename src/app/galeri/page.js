'use client';
import { useState, useEffect } from 'react';
import { PhotoIcon, PlayIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Galeri() {
  const [activeCategory, setActiveCategory] = useState('semua');
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'semua', name: 'Semua' },
    { id: 'kegiatan', name: 'Kegiatan Belajar' },
    { id: 'pembelajaran', name: 'Pembelajaran' },
    { id: 'acara', name: 'Acara Sekolah' },
    { id: 'fasilitas', name: 'Fasilitas' }
  ];

  // Fetch gallery data from API
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/galeri?limit=50');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Transform API data to match component structure
            const transformedData = data.data.map(item => ({
              id: item.id,
              title: item.judul,
              category: item.kategori,
              type: item.tipe === 'video' ? 'video' : 'image',
              thumbnail: item.thumbnail || item.gambar || '/images/gallery/default.svg',
              description: item.deskripsi || 'Tidak ada deskripsi',
              url_media: item.url_media || item.gambar
            }));
            setGalleryItems(transformedData);
          } else {
            setError('Gagal memuat data galeri');
          }
        } else {
          setError('Gagal terhubung ke server');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat memuat galeri');
        // Fallback to static data if API fails
        setGalleryItems(staticGalleryItems);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  // Static fallback data
  const staticGalleryItems = [
    {
      id: 1,
      title: 'Kegiatan Belajar di Kelas',
      category: 'kegiatan',
      type: 'image',
      thumbnail: '/images/gallery/classroom-learning.svg',
      description: 'Suasana pembelajaran yang menyenangkan di ruang kelas'
    },
    {
      id: 2,
      title: 'Bermain di Playground',
      category: 'kegiatan',
      type: 'image',
      thumbnail: '/images/gallery/children-playing-playground.svg',
      description: 'Anak-anak bermain dengan gembira di area playground'
    },
    {
      id: 3,
      title: 'Kelas Seni dan Kreativitas',
      category: 'kegiatan',
      type: 'image',
      thumbnail: '/images/gallery/art-class.svg',
      description: 'Mengembangkan kreativitas melalui kegiatan seni dan melukis'
    },
    {
      id: 4,
      title: 'Kelas Musik',
      category: 'kegiatan',
      type: 'image',
      thumbnail: '/images/gallery/music-class.svg',
      description: 'Belajar musik dan mengembangkan bakat bermusik anak'
    },
    {
      id: 5,
      title: 'Ruang Kelas Modern',
      category: 'fasilitas',
      type: 'image',
      thumbnail: '/images/gallery/classroom-learning.svg',
      description: 'Ruang kelas yang nyaman dan dilengkapi fasilitas modern'
    },
    {
      id: 6,
      title: 'Area Bermain Outdoor',
      category: 'fasilitas',
      type: 'image',
      thumbnail: '/images/gallery/children-playing-playground.svg',
      description: 'Area bermain outdoor yang aman dan menyenangkan'
    },
    {
      id: 7,
      title: 'Wisuda Angkatan 2023',
      category: 'acara',
      type: 'image',
      thumbnail: '/images/news/graduation-ceremony.svg',
      description: 'Momen kelulusan siswa angkatan 2023 yang membanggakan'
    },
    {
      id: 8,
      title: 'Field Trip ke Kebun Binatang',
      category: 'acara',
      type: 'image',
      thumbnail: '/images/news/field-trip.svg',
      description: 'Kegiatan pembelajaran di luar kelas yang menyenangkan'
    },
    {
      id: 9,
      title: 'Juara Lomba Mewarnai',
      category: 'prestasi',
      type: 'image',
      thumbnail: '/images/news/competition.svg',
      description: 'Siswa meraih juara 1 lomba mewarnai tingkat kabupaten'
    },
    {
      id: 10,
      title: 'Prestasi Lomba Menggambar',
      category: 'prestasi',
      type: 'image',
      thumbnail: '/images/gallery/art-class.svg',
      description: 'Prestasi membanggakan di lomba menggambar tingkat kecamatan'
    },
    {
      id: 11,
      title: 'Pentas Seni Musik',
      category: 'acara',
      type: 'image',
      thumbnail: '/images/gallery/music-class.svg',
      description: 'Penampilan musik dalam acara pentas seni sekolah'
    },
    {
      id: 12,
      title: 'Kegiatan Pembelajaran Interaktif',
      category: 'kegiatan',
      type: 'image',
      thumbnail: '/images/gallery/classroom-learning.svg',
      description: 'Metode pembelajaran yang interaktif dan menyenangkan'
    }
  ];

  const filteredItems = activeCategory === 'semua' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const openModal = (item) => {
    setSelectedImage(item);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen">
      {/* Loading State */}
      {loading && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat galeri...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
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
      )}

      {/* Main Content - Only show when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-green-50 to-blue-50 py-20 overflow-hidden" style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}>
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-4xl animate-float">📸</div>
          <div className="absolute top-20 right-20 text-3xl animate-bounce-slow">🎨</div>
          <div className="absolute bottom-20 left-20 text-3xl animate-pulse-slow">🖼️</div>
          <div className="absolute bottom-10 right-10 text-4xl animate-float" style={{animationDelay: '1s'}}>🌈</div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-dots opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fadeInUp">
              📷 Galeri <span className="text-green-600 text-rainbow">TK Darussalam</span> 🎨
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              🌟 Dokumentasi kegiatan, fasilitas, dan prestasi yang membanggakan 
              di TK Darussalam Asahan. ✨
            </p>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="relative py-8 bg-white border-b overflow-hidden" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-waves opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 hover-lift animate-fadeInUp ${
                  activeCategory === category.id
                    ? 'bg-gradient-primary text-white shadow-lg btn-kindergarten'
                    : 'bg-gray-100 text-gray-700 hover:bg-gradient-secondary hover:text-white'
                }`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="relative py-16 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-dots opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <Link
                key={item.id}
                href={`/galeri/${item.id}`}
                className="card-kindergarten bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover-lift transition-all duration-300 cursor-pointer group animate-fadeInUp block"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                  />
                  {item.type === 'video' && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        VIDEO
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-green-500 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover-glow">
                        {item.type === 'video' ? (
                          <PlayIcon className="w-6 h-6 text-green-600 animate-pulse" />
                        ) : (
                          <PhotoIcon className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-800 transition-colors">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16 animate-fadeInUp">
              <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 text-rainbow">
                Tidak ada item ditemukan 😔
              </h3>
              <p className="text-gray-600">
                Coba pilih kategori lain atau kembali ke semua kategori. 🔍
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden card-kindergarten animate-fadeInUp">
            <div className="flex justify-between items-center p-4 border-b bg-gradient-primary">
              <h3 className="text-lg font-semibold text-white">
                {selectedImage.title}
              </h3>
              <button
                onClick={closeModal}
                className="text-white hover:text-red-300 text-2xl font-bold hover-lift transition-all duration-300"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <div className="aspect-video rounded-lg overflow-hidden mb-4 hover-lift transition-all duration-300">
                <img 
                  src={selectedImage.thumbnail} 
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
                {selectedImage.type === 'video' && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <PlayIcon className="w-4 h-4" />
                      VIDEO
                    </div>
                  </div>
                )}
              </div>
              <p className="text-gray-700">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 text-4xl animate-bounce-slow">🎨</div>
          <div className="absolute top-20 right-20 text-3xl animate-pulse-slow">📸</div>
          <div className="absolute bottom-10 left-20 text-3xl animate-bounce-slow">🖼️</div>
          <div className="absolute bottom-20 right-10 text-4xl animate-pulse-slow">🌈</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fadeInUp text-rainbow">
            Ingin Melihat Lebih Banyak? 👀
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            Kunjungi sekolah kami untuk melihat langsung fasilitas dan 
            suasana pembelajaran yang menyenangkan. 🏫✨
          </p>
          <a
            href="/hubungi-kami"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold btn-kindergarten hover-lift animate-fadeInUp"
            style={{animationDelay: '0.4s'}}
          >
            Hubungi Kami 📞
          </a>
        </div>
      </section>
        </>
      )}
    </div>
  );
}