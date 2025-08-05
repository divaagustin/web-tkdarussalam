'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/tentang-kami' },
    { name: 'Galeri', href: '/galeri' },
    { name: 'Berita', href: '/berita' },
    { name: 'Hubungi Kami', href: '/hubungi-kami' },
    { name: 'Pendaftaran', href: '/pendaftaran' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-4 border-gradient-rainbow">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 hover-scale group">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center animate-bounce-slow hover-rotate group-hover:animate-wiggle">
                <span className="text-white font-bold text-lg">🎓</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-rainbow transition-all duration-300">TK Darussalam</h1>
                <p className="text-sm text-gray-600 group-hover:text-green-600 transition-colors duration-300">✨ Asahan ✨</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-white hover:bg-gradient-primary px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover-lift animate-fadeInUp"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;