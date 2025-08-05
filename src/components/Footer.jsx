import Link from 'next/link';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer 
      className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white relative overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="absolute inset-0 bg-gray-900/90"></div>
      <div className="absolute inset-0 bg-pattern-dots opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 animate-float opacity-30">
        <div className="w-12 h-12 bg-yellow-400 rounded-full"></div>
      </div>
      <div className="absolute top-20 right-20 animate-float opacity-30" style={{animationDelay: '1s'}}>
        <div className="w-8 h-8 bg-pink-400 rounded-full"></div>
      </div>
      <div className="absolute bottom-20 left-1/4 animate-float opacity-30" style={{animationDelay: '2s'}}>
        <div className="w-16 h-16 bg-purple-400 rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo dan Deskripsi */}
          <div className="col-span-1 md:col-span-2 animate-fadeInLeft">
            <div className="flex items-center space-x-2 mb-4 group">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center animate-bounce-slow hover-rotate group-hover:animate-wiggle">
                <span className="text-white font-bold text-lg">🎓</span>
              </div>
              <div>
                <h3 className="text-xl font-bold group-hover:text-rainbow transition-all duration-300">TK Darussalam Asahan</h3>
                <p className="text-gray-400 text-sm group-hover:text-green-400 transition-colors duration-300">🌟 Taman Kanak-Kanak 🌟</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md leading-relaxed">
              🎨 TK Darussalam Asahan adalah lembaga pendidikan anak usia dini yang berkomitmen 
              memberikan pendidikan berkualitas dengan nilai-nilai islami untuk membentuk 
              generasi yang cerdas dan berakhlak mulia. ✨
            </p>
          </div>

          {/* Menu Navigasi */}
          <div className="animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <h4 className="text-lg font-semibold mb-4 text-rainbow">📋 Menu</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-green-400 hover:translate-x-2 transition-all duration-300 flex items-center group">
                  <span className="mr-2 group-hover:animate-bounce">🏠</span> Beranda
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami" className="text-gray-300 hover:text-green-400 hover:translate-x-2 transition-all duration-300 flex items-center group">
                  <span className="mr-2 group-hover:animate-bounce">📖</span> Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="text-gray-300 hover:text-green-400 hover:translate-x-2 transition-all duration-300 flex items-center group">
                  <span className="mr-2 group-hover:animate-bounce">🖼️</span> Galeri
                </Link>
              </li>
              <li>
                <Link href="/berita" className="text-gray-300 hover:text-green-400 hover:translate-x-2 transition-all duration-300 flex items-center group">
                  <span className="mr-2 group-hover:animate-bounce">📰</span> Berita
                </Link>
              </li>
              <li>
                <Link href="/pendaftaran" className="text-gray-300 hover:text-green-400 hover:translate-x-2 transition-all duration-300 flex items-center group">
                  <span className="mr-2 group-hover:animate-bounce">📝</span> Pendaftaran
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <h4 className="text-lg font-semibold mb-4 text-rainbow">📞 Kontak</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group hover-lift transition-all duration-300">
                <MapPinIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0 group-hover:animate-bounce group-hover:text-green-400" />
                <div>
                  <p className="text-gray-300 text-sm group-hover:text-white transition-colors">
                    🏫 Jl. Pendidikan No. 123<br />
                    Asahan, Sumatera Utara<br />
                    Indonesia 21214
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group hover-lift transition-all duration-300">
                <PhoneIcon className="h-5 w-5 text-green-500 flex-shrink-0 group-hover:animate-bounce group-hover:text-green-400" />
                <p className="text-gray-300 text-sm group-hover:text-white transition-colors">📱 +62 812-3456-7890</p>
              </div>
              <div className="flex items-center space-x-3 group hover-lift transition-all duration-300">
                <EnvelopeIcon className="h-5 w-5 text-green-500 flex-shrink-0 group-hover:animate-bounce group-hover:text-green-400" />
                <p className="text-gray-300 text-sm group-hover:text-white transition-colors">✉️ info@tkdarussalam.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gradient-rainbow mt-8 pt-8 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
          <div className="flex justify-center items-center">
            <p className="text-gray-400 text-sm hover:text-rainbow transition-all duration-300 cursor-default text-center">
              © {new Date().getFullYear()} 🎓 TK Darussalam Asahan. All rights reserved. 💖
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;