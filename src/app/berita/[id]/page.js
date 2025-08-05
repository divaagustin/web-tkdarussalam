'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CalendarIcon, UserIcon, TagIcon, ArrowLeftIcon, ShareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function BeritaDetail() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news data from API
  useEffect(() => {
    const fetchNewsData = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        // Fetch specific news item
        const newsResponse = await fetch(`/api/berita/${params.id}`);
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          if (newsData.success) {
            const transformedNews = {
              id: newsData.data.id,
              title: newsData.data.judul,
              content: newsData.data.konten,
              category: newsData.data.kategori || 'umum',
              author: newsData.data.penulis || 'Admin',
              date: new Date(newsData.data.tanggal_dibuat || newsData.data.tanggal).toLocaleDateString('id-ID'),
              image: newsData.data.gambar || '/images/news/default.svg'
            };
            setNews(transformedNews);
            
            // Fetch related news
            const relatedResponse = await fetch(`/api/berita?limit=3&exclude=${params.id}`);
            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json();
              if (relatedData.success) {
                const transformedRelated = relatedData.data.map(item => ({
                  id: item.id,
                  title: item.judul,
                  excerpt: item.konten ? item.konten.substring(0, 100) + '...' : 'Tidak ada konten',
                  category: item.kategori || 'umum',
                  author: item.penulis || 'Admin',
                  date: new Date(item.tanggal_dibuat || item.tanggal).toLocaleDateString('id-ID'),
                  image: item.gambar || '/images/news/default.svg'
                }));
                setRelatedNews(transformedRelated);
              }
            }
          } else {
            setError('Berita tidak ditemukan');
          }
        } else {
          setError('Gagal memuat berita');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat memuat berita');
        // Fallback to static data
        const foundNews = staticNewsItems.find(item => item.id === parseInt(params.id));
        if (foundNews) {
          setNews(foundNews);
          const related = staticNewsItems
            .filter(item => item.id !== parseInt(params.id) && item.category === foundNews.category)
            .slice(0, 3);
          setRelatedNews(related);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [params.id]);

  // Static fallback data
  const staticNewsItems = [
    {
      id: 1,
      title: 'Pendaftaran Siswa Baru Tahun Ajaran 2024/2025 Dibuka',
      excerpt: 'TK Darussalam Asahan membuka pendaftaran siswa baru untuk tahun ajaran 2024/2025. Dapatkan early bird discount untuk pendaftar awal.',
      content: `TK Darussalam Asahan dengan bangga mengumumkan pembukaan pendaftaran siswa baru untuk tahun ajaran 2024/2025. Kami menyediakan program pendidikan berkualitas dengan kurikulum yang disesuaikan dengan perkembangan anak usia dini.

Pendaftaran dibuka mulai tanggal 15 Januari 2024 hingga 30 April 2024. Untuk pendaftar awal yang mendaftar sebelum tanggal 28 Februari 2024, akan mendapatkan diskon biaya pendaftaran sebesar 20%.

Fasilitas yang tersedia:
• 8 ruang kelas yang nyaman dan ber-AC
• 2 area bermain outdoor yang aman
• 1 perpustakaan dengan koleksi buku anak yang lengkap
• 1 aula untuk kegiatan bersama
• Kantin sehat dengan menu bergizi

Syarat pendaftaran:
• Usia minimal 4 tahun untuk kelas A
• Usia minimal 5 tahun untuk kelas B
• Fotocopy akta kelahiran
• Fotocopy kartu keluarga
• Pas foto 3x4 sebanyak 4 lembar
• Surat keterangan sehat dari dokter

Untuk informasi lebih lanjut dan pendaftaran, silakan hubungi kantor TK Darussalam atau kunjungi website resmi kami.`,
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
      content: `Prestasi membanggakan kembali diraih oleh siswa TK Darussalam Asahan. Ananda Siti Aisyah dari kelas B berhasil meraih juara 1 dalam lomba mewarnai tingkat kabupaten yang diselenggarakan oleh Dinas Pendidikan Kabupaten Asahan.

Lomba yang berlangsung pada tanggal 8 Januari 2024 di Gedung Serbaguna Kabupaten Asahan ini diikuti oleh 150 peserta dari berbagai TK se-Kabupaten Asahan. Tema lomba adalah "Cinta Lingkungan" yang mengajak anak-anak untuk menggambar dan mewarnai tentang pentingnya menjaga kelestarian alam.

Ananda Siti Aisyah berhasil memikat juri dengan karya seninya yang menggambarkan taman yang indah dengan berbagai jenis bunga dan kupu-kupu. Teknik mewarnai yang rapi dan pemilihan warna yang harmonis menjadi nilai plus dalam penilaian juri.

"Kami sangat bangga dengan prestasi Siti Aisyah. Ini menunjukkan bahwa program seni dan kreativitas di TK Darussalam memberikan hasil yang positif," ujar Ibu Sari, wali kelas B.

Sebagai juara 1, Siti Aisyah mendapat piala, sertifikat, dan uang pembinaan senilai Rp 500.000. Prestasi ini semakin memperkuat reputasi TK Darussalam sebagai lembaga pendidikan yang tidak hanya fokus pada akademik, tetapi juga pengembangan bakat dan kreativitas anak.`,
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
      content: `Dalam rangka memberikan pengalaman belajar yang menyenangkan, TK Darussalam mengadakan kegiatan field trip ke Kebun Binatang Medan. Kegiatan ini diikuti oleh seluruh siswa kelas A dan B bersama dengan guru-guru pendamping.

Field trip yang berlangsung pada tanggal 6 Januari 2024 ini bertujuan untuk:
• Mengenalkan berbagai jenis hewan kepada anak-anak
• Mengajarkan pentingnya menjaga kelestarian satwa
• Memberikan pengalaman belajar di luar kelas
• Melatih kemandirian dan kedisiplinan anak

Selama di kebun binatang, anak-anak sangat antusias melihat berbagai hewan seperti gajah, harimau, orangutan, dan berbagai jenis burung. Mereka juga mendapat kesempatan untuk memberi makan beberapa hewan jinak seperti kelinci dan kambing.

"Anak-anak sangat senang dan excited. Mereka banyak bertanya tentang hewan-hewan yang mereka lihat. Ini adalah metode pembelajaran yang sangat efektif," kata Ibu Maya, koordinator kegiatan.

Kegiatan ini juga dilengkapi dengan sesi edukasi dari petugas kebun binatang tentang cara merawat hewan dan pentingnya konservasi. Anak-anak pulang dengan pengetahuan baru dan pengalaman yang tak terlupakan.

TK Darussalam berencana mengadakan field trip serupa ke tempat-tempat edukatif lainnya untuk memperkaya pengalaman belajar siswa.`,
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
      content: `Upacara wisuda siswa TK Darussalam angkatan 2023 telah berlangsung dengan sukses dan meriah. Sebanyak 45 siswa dinyatakan lulus dan siap melanjutkan pendidikan ke jenjang sekolah dasar.

Acara wisuda yang berlangsung pada tanggal 3 Januari 2024 di Aula TK Darussalam ini dihadiri oleh orang tua, keluarga, dan seluruh guru. Suasana penuh haru dan kebanggaan menyelimuti acara yang dimulai pukul 08.00 WIB ini.

Rundown acara wisuda:
• Pembukaan dan sambutan Kepala Sekolah
• Laporan ketua panitia
• Penyerahan ijazah kepada siswa
• Pemberian penghargaan siswa berprestasi
• Penampilan seni dari siswa
• Foto bersama dan penutupan

Dalam sambutannya, Ibu Kepala Sekolah menyampaikan rasa bangga atas pencapaian para siswa. "Anak-anak ini telah menunjukkan perkembangan yang luar biasa selama belajar di TK Darussalam. Mereka siap menghadapi tantangan di jenjang pendidikan selanjutnya," ujarnya.

Beberapa siswa juga mendapat penghargaan khusus:
• Siswa terpintar: Ananda Ahmad Fauzi
• Siswa paling kreatif: Ananda Zahra Aulia
• Siswa paling sopan: Ananda Rizki Pratama

Acara ditutup dengan penampilan tari dan lagu dari para siswa, yang membuat orang tua terharu melihat perkembangan buah hati mereka.`,
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
      content: `TK Darussalam memiliki program unggulan berupa kelas seni dan musik yang dirancang khusus untuk mengembangkan kreativitas anak. Program ini mencakup kegiatan melukis, menggambar, dan bermain musik dengan berbagai alat musik sederhana.

Program seni dan musik ini dilaksanakan 2 kali seminggu dengan durasi 60 menit per sesi. Kegiatan dibimbing oleh guru yang berpengalaman di bidang seni dan musik anak.

Kegiatan dalam kelas seni:
• Menggambar bebas dengan berbagai media
• Melukis dengan cat air dan finger painting
• Membuat kerajinan tangan dari bahan bekas
• Mewarnai dengan teknik gradasi
• Membuat kolase dari berbagai bahan

Kegiatan dalam kelas musik:
• Bernyanyi lagu anak-anak
• Bermain alat musik sederhana (tamborin, triangle, marakas)
• Belajar ritme dan tempo
• Mengenal not balok dasar
• Pertunjukan musik mini

"Melalui seni dan musik, anak-anak belajar mengekspresikan diri, meningkatkan koordinasi motorik, dan mengembangkan kepercayaan diri," jelas Ibu Maya, guru seni dan musik.

Hasil karya seni anak-anak dipamerkan setiap bulan di papan display sekolah, sementara kemampuan musik mereka ditampilkan dalam acara-acara sekolah. Program ini terbukti efektif dalam mengembangkan bakat dan minat anak di bidang seni.`,
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
      content: `Dalam upaya meningkatkan kualitas pendidikan anak, TK Darussalam mengadakan workshop parenting dengan tema "Mendidik Anak di Era Digital". Workshop ini menghadirkan psikolog anak sebagai narasumber dan diikuti oleh 80 orang tua siswa.

Workshop yang berlangsung pada tanggal 1 Januari 2024 di Aula TK Darussalam ini bertujuan untuk memberikan pemahaman kepada orang tua tentang cara mendidik anak di era teknologi digital yang semakin berkembang.

Materi yang dibahas dalam workshop:
• Dampak positif dan negatif teknologi pada anak
• Cara mengatur screen time yang sehat
• Tips memilih konten digital yang edukatif
• Strategi komunikasi efektif dengan anak
• Pentingnya quality time tanpa gadget

Dr. Sarah Amelia, M.Psi., psikolog anak yang menjadi narasumber, menekankan pentingnya keseimbangan antara dunia digital dan aktivitas fisik. "Teknologi bukan musuh, tetapi kita perlu bijak dalam menggunakannya untuk mendukung perkembangan anak," ujarnya.

Peserta workshop sangat antusias mengikuti sesi tanya jawab. Banyak orang tua yang berbagi pengalaman dan mendapat solusi untuk tantangan yang mereka hadapi dalam mendidik anak.

"Workshop ini sangat bermanfaat. Saya jadi lebih paham bagaimana cara mengatur penggunaan gadget untuk anak saya," kata Ibu Rina, salah satu peserta.

TK Darussalam berencana mengadakan workshop parenting secara rutin dengan tema-tema yang relevan untuk mendukung peran orang tua dalam pendidikan anak.`,
      category: 'kegiatan',
      author: 'Ibu Dewi',
      date: '2024-01-01',
      image: '/images/gallery/music-class.svg',
      featured: false
    }
  ];

  const categories = [
    { id: 'semua', name: 'Semua Berita' },
    { id: 'pengumuman', name: 'Pengumuman' },
    { id: 'kegiatan', name: 'Kegiatan' },
    { id: 'prestasi', name: 'Prestasi' },
    { id: 'info', name: 'Informasi' }
  ];

  // This useEffect is replaced by the API fetch above

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link berhasil disalin!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat berita...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Berita Tidak Ditemukan'}
            </h1>
            <p className="text-gray-600 mb-8">
              {error ? 'Terjadi kesalahan saat memuat berita.' : 'Maaf, berita yang Anda cari tidak dapat ditemukan.'}
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Coba Lagi
              </button>
              <Link 
                href="/berita"
                className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2 inline" />
                Kembali ke Berita
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-green-600">Beranda</Link>
            <span>/</span>
            <Link href="/berita" className="hover:text-green-600">Berita</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{news.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
          <div className="aspect-video overflow-hidden">
            <img 
              src={news.image} 
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="p-8">
            {/* Meta Information */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <TagIcon className="w-4 h-4" />
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    {getCategoryName(news.category)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{formatDate(news.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UserIcon className="w-4 h-4" />
                  <span>{news.author}</span>
                </div>
              </div>
              <button 
                onClick={handleShare}
                className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
              >
                <ShareIcon className="w-5 h-5" />
                <span className="text-sm">Bagikan</span>
              </button>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {news.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-green-500 pl-6 italic">
              {news.excerpt}
            </p>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {news.content.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return null;
                
                // Handle bullet points
                if (paragraph.startsWith('•')) {
                  return (
                    <li key={index} className="ml-6 mb-2 text-gray-700">
                      {paragraph.substring(1).trim()}
                    </li>
                  );
                }
                
                // Handle headings (lines that end with :)
                if (paragraph.trim().endsWith(':')) {
                  return (
                    <h3 key={index} className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                      {paragraph.trim()}
                    </h3>
                  );
                }
                
                // Regular paragraphs
                return (
                  <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Link 
            href="/berita"
            className="inline-flex items-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Kembali ke Berita
          </Link>
          
          <button 
            onClick={handleShare}
            className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <ShareIcon className="w-5 h-5 mr-2" />
            Bagikan Artikel
          </button>
        </div>
      </article>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Berita Terkait</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedNews.map((relatedItem) => (
              <Link 
                key={relatedItem.id}
                href={`/berita/${relatedItem.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={relatedItem.image} 
                    alt={relatedItem.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                      {getCategoryName(relatedItem.category)}
                    </span>
                    <span>{formatDate(relatedItem.date)}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                    {relatedItem.title}
                  </h3>
                  <p className="text-gray-600 text-xs line-clamp-2">
                    {relatedItem.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}