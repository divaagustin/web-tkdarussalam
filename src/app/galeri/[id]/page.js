'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CalendarIcon, UserIcon, ArrowLeftIcon, ShareIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

export default function GaleriDetail() {
  const params = useParams();
  const router = useRouter();
  const [gallery, setGallery] = useState(null);
  const [relatedGallery, setRelatedGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch gallery data from API
  useEffect(() => {
    const fetchGalleryData = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        // Fetch specific gallery item
        const galleryResponse = await fetch(`/api/galeri/${params.id}`);
        if (galleryResponse.ok) {
          const galleryData = await galleryResponse.json();
          if (galleryData.success) {
            const transformedGallery = {
              id: galleryData.data.id,
              title: galleryData.data.judul,
              description: galleryData.data.deskripsi,
              category: galleryData.data.kategori || 'umum',
              author: galleryData.data.penulis || 'Admin',
              date: new Date(galleryData.data.tanggal_dibuat || galleryData.data.tanggal).toLocaleDateString('id-ID'),
              image: galleryData.data.gambar || '/images/gallery/default.svg'
            };
            setGallery(transformedGallery);
            
            // Fetch related gallery
            const relatedResponse = await fetch(`/api/galeri?limit=6&exclude=${params.id}`);
            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json();
              if (relatedData.success) {
                const transformedRelated = relatedData.data.map(item => ({
                  id: item.id,
                  title: item.judul,
                  description: item.deskripsi ? item.deskripsi.substring(0, 100) + '...' : 'Tidak ada deskripsi',
                  category: item.kategori || 'umum',
                  author: item.penulis || 'Admin',
                  date: new Date(item.tanggal_dibuat || item.tanggal).toLocaleDateString('id-ID'),
                  image: item.gambar || '/images/gallery/default.svg'
                }));
                setRelatedGallery(transformedRelated);
              }
            }
          } else {
            setError('Galeri tidak ditemukan');
          }
        } else {
          setError('Galeri tidak ditemukan');
        }
      } catch (error) {
        setError('Terjadi kesalahan saat memuat galeri');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, [params.id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: gallery?.title,
        text: gallery?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link berhasil disalin!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Galeri Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/galeri"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Kembali ke Galeri
          </Link>
        </div>
      </div>
    );
  }

  if (!gallery) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/galeri"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Kembali ke Galeri
        </Link>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Gallery Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="relative h-96 md:h-[500px]">
              <Image
                src={gallery.image}
                alt={gallery.title}
                fill
                className="object-cover cursor-pointer"
                onClick={() => setSelectedImage(gallery.image)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded-full mb-3">
                  {gallery.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {gallery.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Gallery Info */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-600">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>{gallery.date}</span>
              </div>
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                <span>{gallery.author}</span>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ShareIcon className="h-5 w-5 mr-2" />
                Bagikan
              </button>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {gallery.description}
              </p>
            </div>
          </div>

          {/* Related Gallery */}
          {relatedGallery.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeri Terkait</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedGallery.map((item) => (
                  <Link
                    key={item.id}
                    href={`/galeri/${item.id}`}
                    className="group block bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative h-48">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2">
                        {item.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedImage}
              alt="Gallery Image"
              width={800}
              height={600}
              className="object-contain max-w-full max-h-full"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}