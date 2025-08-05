import { AcademicCapIcon, HeartIcon, UsersIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function TentangKami() {
  const visiMisi = {
    visi: "Menjadi lembaga pendidikan anak usia dini terdepan yang menghasilkan generasi cerdas, berkarakter islami, dan siap menghadapi tantangan masa depan.",
    misi: [
      "Memberikan pendidikan berkualitas tinggi dengan kurikulum yang sesuai dengan perkembangan anak usia dini",
      "Menanamkan nilai-nilai keislaman dan akhlak mulia dalam setiap aspek pembelajaran",
      "Mengembangkan potensi anak secara optimal melalui metode pembelajaran yang kreatif dan menyenangkan",
      "Menciptakan lingkungan belajar yang aman, nyaman, dan kondusif untuk tumbuh kembang anak",
      "Membangun kerjasama yang baik dengan orang tua dalam mendidik anak"
    ]
  };

  const nilai = [
    {
      icon: HeartIcon,
      title: "Kasih Sayang",
      description: "Memberikan perhatian dan kasih sayang kepada setiap anak dengan penuh kesabaran dan ketulusan."
    },
    {
      icon: AcademicCapIcon,
      title: "Kualitas",
      description: "Berkomitmen memberikan pendidikan berkualitas tinggi dengan standar yang terus ditingkatkan."
    },
    {
      icon: UsersIcon,
      title: "Kerjasama",
      description: "Membangun kerjasama yang solid antara sekolah, orang tua, dan masyarakat."
    },
    {
      icon: BuildingOfficeIcon,
      title: "Integritas",
      description: "Menjunjung tinggi kejujuran, transparansi, dan tanggung jawab dalam setiap tindakan."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-kindergarten-sky py-20 overflow-hidden bg-clouds">
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-4xl animate-float">🎈</div>
          <div className="absolute top-20 right-20 text-3xl animate-bounce-slow">🌟</div>
          <div className="absolute bottom-20 left-20 text-3xl animate-pulse-slow">🎨</div>
          <div className="absolute bottom-10 right-10 text-4xl animate-float" style={{animationDelay: '1s'}}>🧸</div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-dots opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fadeInUp">
              Tentang <span className="text-green-600 text-rainbow">TK Darussalam Asahan</span> 🏫
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              🌈 Mengenal lebih dekat dengan sejarah, visi, misi, dan nilai-nilai yang menjadi 
              fondasi pendidikan di TK Darussalam Asahan. ✨
            </p>
          </div>
        </div>
      </section>

      {/* Sejarah Section */}
      <section className="relative py-20 bg-white overflow-hidden" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-waves opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInLeft">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-rainbow">
                📚 Sejarah Singkat
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="hover-lift transition-all duration-300 p-4 rounded-lg hover:bg-white hover:shadow-lg">
                  🏛️ TK Darussalam Asahan didirikan pada tahun 2008 dengan visi mulia untuk 
                  memberikan pendidikan anak usia dini yang berkualitas dengan landasan 
                  nilai-nilai keislaman yang kuat.
                </p>
                <p className="hover-lift transition-all duration-300 p-4 rounded-lg hover:bg-white hover:shadow-lg">
                  🌱 Berawal dari sebuah rumah sederhana dengan 15 siswa, kini TK Darussalam 
                  telah berkembang menjadi salah satu lembaga pendidikan anak usia dini 
                  terpercaya di Asahan dengan lebih dari 200 siswa aktif.
                </p>
                <p className="hover-lift transition-all duration-300 p-4 rounded-lg hover:bg-white hover:shadow-lg">
                  ⭐ Selama lebih dari 15 tahun, kami telah berkomitmen untuk terus 
                  meningkatkan kualitas pendidikan dan fasilitas demi memberikan yang 
                  terbaik bagi perkembangan anak-anak.
                </p>
              </div>
            </div>
            <div className="card-kindergarten bg-gradient-secondary rounded-lg p-8 animate-fadeInRight">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 hover-lift transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold group-hover:animate-bounce group-hover:scale-110 transition-all duration-300">
                    2008
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">🎯 Pendirian</h4>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors">TK Darussalam didirikan dengan 15 siswa</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 hover-lift transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold group-hover:animate-bounce group-hover:scale-110 transition-all duration-300">
                    2015
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">🏗️ Ekspansi</h4>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors">Pembangunan gedung baru dan fasilitas modern</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 hover-lift transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold group-hover:animate-bounce group-hover:scale-110 transition-all duration-300">
                    2023
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">🎉 Sekarang</h4>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors">200+ siswa dengan fasilitas lengkap</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi Section */}
      <section className="relative py-20 bg-gray-50 overflow-hidden" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(249, 250, 251, 0.95)'
      }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-dots opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-rainbow">
              🎯 Visi & Misi
            </h2>
            <p className="text-lg text-gray-700">
              ✨ Landasan filosofis yang mengarahkan setiap langkah pendidikan kami 🌟
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Visi */}
            <div className="card-kindergarten bg-white rounded-lg p-8 shadow-lg hover-lift animate-fadeInLeft">
              <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
                <span className="mr-3 text-3xl animate-pulse-slow">👁️</span> Visi
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed hover:text-gray-900 transition-colors">
                {visiMisi.visi}
              </p>
            </div>
            
            {/* Misi */}
            <div className="card-kindergarten bg-white rounded-lg p-8 shadow-lg hover-lift animate-fadeInRight">
              <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
                <span className="mr-3 text-3xl animate-bounce-slow">🎯</span> Misi
              </h3>
              <ul className="space-y-4">
                {visiMisi.misi.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3 hover-lift transition-all duration-300 group">
                    <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:animate-bounce group-hover:scale-110 transition-all duration-300">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 group-hover:text-gray-900 transition-colors">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai-Nilai Section */}
      <section className="relative py-20 bg-white overflow-hidden" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}>
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-3xl animate-float">💖</div>
          <div className="absolute top-20 right-20 text-3xl animate-bounce-slow">🌟</div>
          <div className="absolute bottom-20 left-20 text-3xl animate-pulse-slow">🤝</div>
          <div className="absolute bottom-10 right-10 text-3xl animate-float" style={{animationDelay: '1s'}}>🎯</div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-waves opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-rainbow">
              💎 Nilai-Nilai Kami
            </h2>
            <p className="text-lg text-gray-700">
              ✨ Prinsip-prinsip yang menjadi pedoman dalam setiap aktivitas pendidikan 🌟
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {nilai.map((item, index) => (
              <div key={index} className="text-center p-6 rounded-lg card-kindergarten hover-lift transition-all duration-300 animate-fadeInUp group" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">{item.title}</h3>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fasilitas Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-400 via-green-500 to-green-600 overflow-hidden" style={{
        backgroundImage: 'url("/images/backgrounds/children-learning-classroom.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(34, 197, 94, 0.9)'
      }}>
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-4xl animate-float text-white opacity-30">🏫</div>
          <div className="absolute top-20 right-20 text-3xl animate-bounce-slow text-white opacity-30">🎪</div>
          <div className="absolute bottom-20 left-20 text-3xl animate-pulse-slow text-white opacity-30">🎨</div>
          <div className="absolute bottom-10 right-10 text-4xl animate-float text-white opacity-30" style={{animationDelay: '1s'}}>📚</div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-dots opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fadeInUp text-rainbow">
              🏫 Fasilitas Lengkap untuk Pembelajaran Optimal
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              ✨ Kami menyediakan berbagai fasilitas modern dan aman untuk mendukung 
              proses pembelajaran dan perkembangan anak. 🌟
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="hover-lift transition-all duration-300 animate-fadeInUp group" style={{animationDelay: '0.3s'}}>
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce group-hover:text-yellow-300 transition-colors">8️⃣</div>
                <div className="text-green-100 group-hover:text-white transition-colors">🏛️ Ruang Kelas</div>
              </div>
              <div className="hover-lift transition-all duration-300 animate-fadeInUp group" style={{animationDelay: '0.4s'}}>
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce group-hover:text-yellow-300 transition-colors">2️⃣</div>
                <div className="text-green-100 group-hover:text-white transition-colors">🎪 Area Bermain</div>
              </div>
              <div className="hover-lift transition-all duration-300 animate-fadeInUp group" style={{animationDelay: '0.5s'}}>
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce group-hover:text-yellow-300 transition-colors">1️⃣</div>
                <div className="text-green-100 group-hover:text-white transition-colors">📚 Perpustakaan</div>
              </div>
              <div className="hover-lift transition-all duration-300 animate-fadeInUp group" style={{animationDelay: '0.6s'}}>
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce group-hover:text-yellow-300 transition-colors">1️⃣</div>
                <div className="text-green-100 group-hover:text-white transition-colors">🎭 Aula</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}