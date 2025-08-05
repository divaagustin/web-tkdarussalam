'use client';
import { useState } from 'react';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  BuildingOfficeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function HubungiKami() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    subjek: '',
    pesan: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulasi pengiriman form
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        nama: '',
        email: '',
        telepon: '',
        subjek: '',
        pesan: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Alamat',
      content: 'Jl. Pendidikan No. 123, Kisaran, Kabupaten Asahan, Sumatera Utara 21224',
      link: 'https://maps.google.com'
    },
    {
      icon: PhoneIcon,
      title: 'Telepon',
      content: '+62 812-3456-7890',
      link: 'tel:+6281234567890'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      content: 'info@tkdarussalam-asahan.sch.id',
      link: 'mailto:info@tkdarussalam-asahan.sch.id'
    },
    {
      icon: ClockIcon,
      title: 'Jam Operasional',
      content: 'Senin - Jumat: 07:00 - 16:00 WIB\nSabtu: 07:00 - 12:00 WIB',
      link: null
    }
  ];

  const socialMedia = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/tkdarussalam',
      color: 'bg-blue-600'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/tkdarussalam',
      color: 'bg-pink-600'
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/6281234567890',
      color: 'bg-green-600'
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/tkdarussalam',
      color: 'bg-red-600'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Hubungi <span className="text-green-600">Kami</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami siap membantu Anda dengan segala pertanyaan tentang 
              pendidikan anak di TK Darussalam Asahan.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{info.title}</h3>
                {info.link ? (
                  <a 
                    href={info.link}
                    className="text-gray-600 hover:text-green-600 transition-colors whitespace-pre-line"
                    target={info.link.startsWith('http') ? '_blank' : '_self'}
                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Kirim Pesan</h2>
              </div>
              
              {submitStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  Terjadi kesalahan. Silakan coba lagi nanti.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      id="nama"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="telepon" className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      id="telepon"
                      name="telepon"
                      value={formData.telepon}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="08xx-xxxx-xxxx"
                    />
                  </div>
                  <div>
                    <label htmlFor="subjek" className="block text-sm font-medium text-gray-700 mb-2">
                      Subjek *
                    </label>
                    <select
                      id="subjek"
                      name="subjek"
                      value={formData.subjek}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Pilih subjek</option>
                      <option value="pendaftaran">Pendaftaran Siswa Baru</option>
                      <option value="informasi">Informasi Umum</option>
                      <option value="kurikulum">Kurikulum & Program</option>
                      <option value="fasilitas">Fasilitas Sekolah</option>
                      <option value="biaya">Biaya Pendidikan</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="pesan" className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan *
                  </label>
                  <textarea
                    id="pesan"
                    name="pesan"
                    value={formData.pesan}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tulis pesan Anda di sini..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex items-center">
                    <MapPinIcon className="w-6 h-6 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Lokasi Kami</h3>
                  </div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPinIcon className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Peta Lokasi</p>
                    <p className="text-sm">TK Darussalam Asahan</p>
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Buka di Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ikuti Kami</h3>
                <div className="grid grid-cols-2 gap-4">
                  {socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${social.color} text-white p-4 rounded-lg text-center hover:opacity-90 transition-opacity`}
                    >
                      <div className="font-semibold">{social.name}</div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-green-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Kontak Cepat</h3>
                <div className="space-y-3">
                  <a href="tel:+6281234567890" className="flex items-center hover:text-green-100 transition-colors">
                    <PhoneIcon className="w-5 h-5 mr-3" />
                    <span>+62 812-3456-7890</span>
                  </a>
                  <a href="https://wa.me/6281234567890" className="flex items-center hover:text-green-100 transition-colors">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 mr-3" />
                    <span>WhatsApp</span>
                  </a>
                  <a href="mailto:info@tkdarussalam-asahan.sch.id" className="flex items-center hover:text-green-100 transition-colors">
                    <EnvelopeIcon className="w-5 h-5 mr-3" />
                    <span>info@tkdarussalam-asahan.sch.id</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-lg text-gray-600">Temukan jawaban untuk pertanyaan umum tentang TK Darussalam</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Berapa usia minimal untuk mendaftar?</h3>
              <p className="text-gray-600">Usia minimal untuk mendaftar di TK Darussalam adalah 4 tahun untuk kelas A dan 5 tahun untuk kelas B.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Apa saja dokumen yang diperlukan untuk pendaftaran?</h3>
              <p className="text-gray-600">Dokumen yang diperlukan meliputi: fotokopi akta kelahiran, fotokopi KK, fotokopi KTP orang tua, pas foto anak 3x4 (4 lembar), dan surat keterangan sehat dari dokter.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Apakah tersedia program full day?</h3>
              <p className="text-gray-600">Ya, kami menyediakan program full day dari pukul 07:00 hingga 16:00 WIB dengan kegiatan pembelajaran dan ekstrakurikuler yang beragam.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bagaimana sistem pembayaran biaya sekolah?</h3>
              <p className="text-gray-600">Pembayaran dapat dilakukan secara bulanan, per semester, atau tahunan. Kami juga menyediakan berbagai metode pembayaran untuk kemudahan orang tua.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}