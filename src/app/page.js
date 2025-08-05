import Link from 'next/link';
import { AcademicCapIcon, HeartIcon, StarIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Pendidikan Berkualitas',
      description: 'Kurikulum yang disesuaikan dengan perkembangan anak usia dini dengan metode pembelajaran yang menyenangkan.'
    },
    {
      icon: HeartIcon,
      title: 'Nilai-Nilai Islami',
      description: 'Menanamkan akhlak mulia dan nilai-nilai keislaman sejak dini untuk membentuk karakter yang baik.'
    },
    {
      icon: UsersIcon,
      title: 'Tenaga Pengajar Profesional',
      description: 'Guru-guru yang berpengalaman dan berdedikasi tinggi dalam mendidik anak-anak.'
    },
    {
      icon: StarIcon,
      title: 'Fasilitas Lengkap',
      description: 'Ruang kelas yang nyaman, area bermain yang aman, dan fasilitas penunjang pembelajaran lainnya.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-rainbow text-white py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-clouds opacity-30"></div>
        <div className="absolute inset-0 bg-pattern-dots opacity-20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 text-6xl animate-float">🌈</div>
        <div className="absolute top-20 right-20 text-5xl animate-bounce-slow" style={{animationDelay: '1s'}}>⭐</div>
        <div className="absolute bottom-20 left-1/4 text-4xl animate-pulse-slow" style={{animationDelay: '2s'}}>🎨</div>
        <div className="absolute bottom-10 right-10 text-5xl animate-float" style={{animationDelay: '3s'}}>🎈</div>
        <div className="absolute top-1/2 left-20 text-3xl animate-wiggle" style={{animationDelay: '1.5s'}}>📚</div>
        <div className="absolute top-1/3 right-1/4 text-4xl animate-bounce-slow" style={{animationDelay: '2.5s'}}>🧸</div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp text-rainbow">
              Selamat Datang di
              <span className="block">TK Darussalam Asahan</span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              🌟 Memberikan pendidikan terbaik untuk anak-anak dengan nilai-nilai islami 
              dan metode pembelajaran yang menyenangkan untuk masa depan yang cerah! 🎨
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{animationDelay: '0.6s'}}>
              <Link 
                href="/pendaftaran" 
                className="btn-kindergarten inline-block hover-lift"
              >
                🎒 Daftar Sekarang
              </Link>
              <Link 
                href="/tentang-kami" 
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-600 transition duration-300 hover-scale inline-block"
              >
                📚 Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden"
        style={{
          backgroundImage: `url('/images/backgrounds/children-learning-classroom.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-white/90"></div>
        <div className="absolute inset-0 bg-pattern-waves"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🌟 Fasilitas Lengkap untuk Pembelajaran Optimal 🌟
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami berkomitmen memberikan yang terbaik untuk perkembangan anak Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-kindergarten p-6 hover-lift animate-fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow hover-rotate">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 bg-gradient-rainbow relative overflow-hidden"
        style={{
          backgroundImage: `url('/images/backgrounds/teacher-with-children.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/80 to-blue-500/80"></div>
        
        {/* Floating Shapes */}
        <div className="absolute top-10 left-10 animate-float">
          <div className="w-20 h-20 bg-yellow-300 rounded-full opacity-30"></div>
        </div>
        <div className="absolute top-20 right-20 animate-float" style={{animationDelay: '1s'}}>
          <div className="w-16 h-16 bg-pink-300 rounded-full opacity-30"></div>
        </div>
        <div className="absolute bottom-10 left-1/3 animate-float" style={{animationDelay: '2s'}}>
          <div className="w-24 h-24 bg-purple-300 rounded-full opacity-30"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fadeInUp">
            🎉 Siap Bergabung dengan Keluarga Besar TK Darussalam? 🎉
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            Daftarkan anak Anda sekarang dan berikan mereka pendidikan terbaik untuk masa depan yang gemilang! ✨
          </p>
          <Link 
            href="/pendaftaran" 
            className="btn-kindergarten bg-white text-green-600 hover:bg-gray-100 hover-lift animate-fadeInUp" 
            style={{animationDelay: '0.6s'}}
          >
            🚀 Mulai Pendaftaran
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-white/85"></div>
        <div className="absolute inset-0 bg-pattern-dots"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 animate-fadeInUp">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              📊 Prestasi & Pencapaian Kami 📊
            </h2>
            <p className="text-lg text-gray-600">
              Angka-angka yang membanggakan dari perjalanan TK Darussalam
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="card-kindergarten p-8 hover-lift animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              <div className="text-5xl font-bold text-rainbow mb-4 animate-pulse-slow">15+</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">📅 Tahun Pengalaman</div>
              <div className="text-gray-600">Melayani pendidikan anak dengan dedikasi tinggi</div>
            </div>
            <div className="card-kindergarten p-8 hover-lift animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <div className="text-5xl font-bold text-rainbow mb-4 animate-pulse-slow">200+</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">👶 Siswa Aktif</div>
              <div className="text-gray-600">Anak-anak ceria yang belajar bersama kami</div>
            </div>
            <div className="card-kindergarten p-8 hover-lift animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <div className="text-5xl font-bold text-rainbow mb-4 animate-pulse-slow">20+</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">👩‍🏫 Tenaga Pengajar</div>
              <div className="text-gray-600">Guru berpengalaman dan bersertifikat</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
