'use client';
import { useState } from 'react';
import { 
  UserIcon, 
  CalendarDaysIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function Pendaftaran() {
  const [formData, setFormData] = useState({
    namaAnak: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    alamat: '',
    namaAyah: '',
    pekerjaanAyah: '',
    namaIbu: '',
    pekerjaanIbu: '',
    telepon: '',
    email: '',
    program: '',
    informasiTambahan: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

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
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: 'Data Anak', icon: UserIcon },
    { number: 2, title: 'Data Orang Tua', icon: DocumentTextIcon },
    { number: 3, title: 'Program & Konfirmasi', icon: CheckCircleIcon }
  ];

  const programs = [
    {
      name: 'Regular (Half Day)',
      time: '07:00 - 12:00 WIB',
      price: 'Rp 350.000/bulan',
      features: ['Pembelajaran dasar', 'Snack pagi', 'Kegiatan bermain']
    },
    {
      name: 'Full Day',
      time: '07:00 - 16:00 WIB', 
      price: 'Rp 500.000/bulan',
      features: ['Pembelajaran lengkap', 'Makan siang', 'Istirahat siang', 'Ekstrakurikuler']
    }
  ];

  const requirements = [
    'Fotokopi Akta Kelahiran',
    'Fotokopi Kartu Keluarga (KK)',
    'Fotokopi KTP Orang Tua',
    'Pas Foto Anak 3x4 (4 lembar)',
    'Surat Keterangan Sehat dari Dokter',
    'Formulir Pendaftaran (diisi lengkap)'
  ];

  const timeline = [
    {
      phase: 'Pendaftaran',
      period: 'Januari - Maret 2024',
      status: 'active',
      description: 'Pengisian formulir dan pengumpulan berkas'
    },
    {
      phase: 'Seleksi',
      period: 'April 2024',
      status: 'upcoming',
      description: 'Wawancara dan observasi anak'
    },
    {
      phase: 'Pengumuman',
      period: 'Mei 2024',
      status: 'upcoming',
      description: 'Pengumuman hasil seleksi'
    },
    {
      phase: 'Daftar Ulang',
      period: 'Juni 2024',
      status: 'upcoming',
      description: 'Pembayaran dan konfirmasi kehadiran'
    }
  ];

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pendaftaran Berhasil!</h2>
          <p className="text-gray-600 mb-6">
            Terima kasih telah mendaftar di TK Darussalam Asahan. 
            Kami akan menghubungi Anda dalam 2-3 hari kerja untuk proses selanjutnya.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>Nomor Pendaftaran:</strong> TKD-2024-{Math.random().toString(36).substr(2, 6).toUpperCase()}
            </p>
          </div>
          <button
            onClick={() => {
              setSubmitStatus(null);
              setCurrentStep(1);
              setFormData({
                namaAnak: '',
                tempatLahir: '',
                tanggalLahir: '',
                jenisKelamin: '',
                alamat: '',
                namaAyah: '',
                pekerjaanAyah: '',
                namaIbu: '',
                pekerjaanIbu: '',
                telepon: '',
                email: '',
                program: '',
                informasiTambahan: ''
              });
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Daftar Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Pendaftaran <span className="text-green-600">Siswa Baru</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bergabunglah dengan keluarga besar TK Darussalam Asahan dan berikan 
              pendidikan terbaik untuk buah hati Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Timeline Pendaftaran</h2>
            <p className="text-lg text-gray-600">Tahapan proses pendaftaran siswa baru</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {timeline.map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  item.status === 'active' ? 'bg-green-600 text-white' : 
                  item.status === 'completed' ? 'bg-green-100 text-green-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  <span className="text-xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.phase}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.period}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Progress Steps */}
            <div className="bg-gray-50 px-8 py-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.number ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className={`ml-3 text-sm font-medium ${
                      currentStep >= step.number ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-4 ${
                        currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-8">
              {/* Step 1: Data Anak */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Data Anak</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap Anak *
                      </label>
                      <input
                        type="text"
                        name="namaAnak"
                        value={formData.namaAnak}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan nama lengkap anak"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jenis Kelamin *
                      </label>
                      <select
                        name="jenisKelamin"
                        value={formData.jenisKelamin}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Pilih jenis kelamin</option>
                        <option value="laki-laki">Laki-laki</option>
                        <option value="perempuan">Perempuan</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tempat Lahir *
                      </label>
                      <input
                        type="text"
                        name="tempatLahir"
                        value={formData.tempatLahir}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Kota tempat lahir"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Lahir *
                      </label>
                      <input
                        type="date"
                        name="tanggalLahir"
                        value={formData.tanggalLahir}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Lengkap *
                    </label>
                    <textarea
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Masukkan alamat lengkap"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Step 2: Data Orang Tua */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Data Orang Tua</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Ayah *
                      </label>
                      <input
                        type="text"
                        name="namaAyah"
                        value={formData.namaAyah}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Nama lengkap ayah"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pekerjaan Ayah *
                      </label>
                      <input
                        type="text"
                        name="pekerjaanAyah"
                        value={formData.pekerjaanAyah}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Pekerjaan ayah"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Ibu *
                      </label>
                      <input
                        type="text"
                        name="namaIbu"
                        value={formData.namaIbu}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Nama lengkap ibu"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pekerjaan Ibu *
                      </label>
                      <input
                        type="text"
                        name="pekerjaanIbu"
                        value={formData.pekerjaanIbu}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Pekerjaan ibu"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor Telepon *
                      </label>
                      <input
                        type="tel"
                        name="telepon"
                        value={formData.telepon}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="08xx-xxxx-xxxx"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="nama@email.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Program & Konfirmasi */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Pilih Program & Konfirmasi</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Pilih Program *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {programs.map((program, index) => (
                        <div key={index} className={`border-2 rounded-lg p-6 cursor-pointer transition-colors ${
                          formData.program === program.name ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, program: program.name }))}
                        >
                          <div className="flex items-center mb-3">
                            <input
                              type="radio"
                              name="program"
                              value={program.name}
                              checked={formData.program === program.name}
                              onChange={handleInputChange}
                              className="mr-3"
                            />
                            <h4 className="text-lg font-semibold text-gray-900">{program.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{program.time}</p>
                          <p className="text-lg font-bold text-green-600 mb-3">{program.price}</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {program.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center">
                                <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Informasi Tambahan
                    </label>
                    <textarea
                      name="informasiTambahan"
                      value={formData.informasiTambahan}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Informasi tambahan tentang anak (alergi, kebutuhan khusus, dll.)"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Selanjutnya
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Requirements & Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Requirements */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Persyaratan Pendaftaran</h3>
              <div className="space-y-4">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-start">
                    <DocumentTextIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <span className="text-gray-700">{req}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Catatan Penting</h4>
                    <p className="text-sm text-yellow-700">
                      Semua dokumen harus dalam kondisi baik dan jelas terbaca. 
                      Dokumen asli akan diminta saat verifikasi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Informasi Kontak</h3>
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-semibold text-green-800 mb-3">Butuh Bantuan?</h4>
                  <p className="text-green-700 mb-4">
                    Tim kami siap membantu Anda dalam proses pendaftaran.
                  </p>
                  <div className="space-y-2 text-sm text-green-700">
                    <p>📞 +62 812-3456-7890</p>
                    <p>📧 pendaftaran@tkdarussalam-asahan.sch.id</p>
                    <p>🕒 Senin - Jumat: 08:00 - 15:00 WIB</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-3">Kunjungi Sekolah</h4>
                  <p className="text-blue-700 mb-4">
                    Anda dapat mengunjungi sekolah untuk melihat fasilitas dan bertemu dengan tim pengajar.
                  </p>
                  <p className="text-sm text-blue-700">
                    📍 Jl. Pendidikan No. 123, Kisaran, Kabupaten Asahan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}