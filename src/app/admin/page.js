'use client';
import { useState, useEffect } from 'react';
import { 
  UserGroupIcon,
  NewspaperIcon,
  PhotoIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowRightOnRectangleIcon,
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [realData, setRealData] = useState({
    news: [],
    gallery: [],
    registrations: [],
    stats: { total: 0, pending: 0, approved: 0, rejected: 0 }
  });

  // Sample data
  const [stats] = useState({
    totalStudents: 125,
    totalNews: 24,
    totalGallery: 156,
    totalRegistrations: 45
  });

  const [newsData, setNewsData] = useState([
    {
      id: 1,
      title: 'Penerimaan Siswa Baru 2024',
      category: 'Pengumuman',
      date: '2024-01-15',
      status: 'Published',
      views: 245
    },
    {
      id: 2,
      title: 'Kegiatan Outing Class ke Kebun Binatang',
      category: 'Kegiatan',
      date: '2024-01-10',
      status: 'Published',
      views: 189
    },
    {
      id: 3,
      title: 'Prestasi Juara 1 Lomba Mewarnai',
      category: 'Prestasi',
      date: '2024-01-08',
      status: 'Draft',
      views: 0
    }
  ]);

  const [galleryData, setGalleryData] = useState([
    {
      id: 1,
      title: 'Kegiatan Belajar Outdoor',
      category: 'Kegiatan Belajar',
      type: 'image',
      date: '2024-01-15',
      status: 'Published'
    },
    {
      id: 2,
      title: 'Fasilitas Playground Baru',
      category: 'Fasilitas',
      type: 'image',
      date: '2024-01-12',
      status: 'Published'
    },
    {
      id: 3,
      title: 'Video Kegiatan Senam Pagi',
      category: 'Kegiatan Belajar',
      type: 'video',
      date: '2024-01-10',
      status: 'Published'
    }
  ]);

  const [registrations, setRegistrations] = useState([
    // 2024 Data
    {
      id: 1,
      childName: 'Ahmad Rizki',
      parentName: 'Budi Santoso',
      phone: '081234567890',
      email: 'budi@email.com',
      program: 'Full Day',
      date: '2024-01-15',
      year: 2024,
      status: 'Pending',
      age: 5,
      address: 'Jl. Merdeka No. 123'
    },
    {
      id: 2,
      childName: 'Siti Aisyah',
      parentName: 'Dewi Sartika',
      phone: '081234567891',
      email: 'dewi@email.com',
      program: 'Regular',
      date: '2024-01-14',
      year: 2024,
      status: 'Approved',
      age: 4,
      address: 'Jl. Pendidikan No. 456'
    },
    {
      id: 3,
      childName: 'Muhammad Farhan',
      parentName: 'Ali Rahman',
      phone: '081234567892',
      email: 'ali@email.com',
      program: 'Full Day',
      date: '2024-01-13',
      year: 2024,
      status: 'Pending',
      age: 5,
      address: 'Jl. Harmoni No. 789'
    },
    // 2023 Data
    {
      id: 4,
      childName: 'Fatimah Zahra',
      parentName: 'Ahmad Yusuf',
      phone: '081234567893',
      email: 'ahmad@email.com',
      program: 'Regular',
      date: '2023-02-10',
      year: 2023,
      status: 'Approved',
      age: 4,
      address: 'Jl. Damai No. 321'
    },
    {
      id: 5,
      childName: 'Omar Abdullah',
      parentName: 'Siti Nurhaliza',
      phone: '081234567894',
      email: 'siti@email.com',
      program: 'Full Day',
      date: '2023-03-15',
      year: 2023,
      status: 'Approved',
      age: 5,
      address: 'Jl. Sejahtera No. 654'
    },
    // 2022 Data
    {
      id: 6,
      childName: 'Aisha Putri',
      parentName: 'Muhammad Iqbal',
      phone: '081234567895',
      email: 'iqbal@email.com',
      program: 'Regular',
      date: '2022-01-20',
      year: 2022,
      status: 'Approved',
      age: 4,
      address: 'Jl. Bahagia No. 987'
    }
  ]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginForm),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsAuthenticated(true);
        setAdminData(data.admin);
        setLoginError('');
        await fetchAllData();
      } else {
        setLoginError(data.message || 'Login gagal');
      }
    } catch (error) {
      setLoginError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/login', {
        method: 'DELETE',
        credentials: 'include'
      });
    } catch (error) {
    } finally {
      setIsAuthenticated(false);
      setAdminData(null);
      setActiveTab('dashboard');
    }
  };

  // Filter functions
  const getFilteredRegistrations = () => {
    return registrations.filter(reg => {
      const matchesYear = reg.year === selectedYear;
      const matchesStatus = statusFilter === 'all' || reg.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        reg.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.phone.includes(searchTerm);
      return matchesYear && matchesStatus && matchesSearch;
    });
  };

  const getAvailableYears = () => {
    const years = [...new Set(registrations.map(reg => reg.year))];
    return years.sort((a, b) => b - a);
  };

  // CRUD functions
  const handleApproveRegistration = (id) => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === id ? { ...reg, status: 'Approved' } : reg
    ));
  };

  const handleRejectRegistration = (id) => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === id ? { ...reg, status: 'Rejected' } : reg
    ));
  };

  const handleDeleteItem = (id, type) => {
    setDeleteItemId(id);
    setModalType(type);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (modalType === 'registration') {
      setRegistrations(prev => prev.filter(reg => reg.id !== deleteItemId));
    } else if (modalType === 'news') {
      setNewsData(prev => prev.filter(news => news.id !== deleteItemId));
    } else if (modalType === 'gallery') {
      setGalleryData(prev => prev.filter(item => item.id !== deleteItemId));
    }
    setShowDeleteConfirm(false);
    setDeleteItemId(null);
  };

  const handleEditItem = (item, type) => {
    setEditingItem(item);
    setModalType(type);
    setShowModal(true);
  };

  const handleAddNew = (type) => {
    setEditingItem(null);
    setModalType(type);
    setShowModal(true);
  };

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, activeTab]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setAdminData(data.admin);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      // Fetch news
      const newsResponse = await fetch('/api/admin/berita?limit=10', {
        credentials: 'include'
      });
      if (newsResponse.ok) {
        const newsData = await newsResponse.json();
        setRealData(prev => ({ ...prev, news: newsData.data }));
      }

      // Fetch gallery
      const galleryResponse = await fetch('/api/admin/galeri?limit=10', {
        credentials: 'include'
      });
      if (galleryResponse.ok) {
        const galleryData = await galleryResponse.json();
        setRealData(prev => ({ ...prev, gallery: galleryData.data }));
      }

      // Fetch registrations
      const regResponse = await fetch('/api/admin/pendaftaran?limit=10', {
        credentials: 'include'
      });
      if (regResponse.ok) {
        const regData = await regResponse.json();
        setRealData(prev => ({ ...prev, registrations: regData.data }));
      }

      // Fetch stats
      const statsResponse = await fetch('/api/admin/pendaftaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: new Date().getFullYear() }),
        credentials: 'include'
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setRealData(prev => ({ ...prev, stats: statsData }));
      }
    } catch (error) {
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { id: 'news', label: 'Kelola Berita', icon: NewspaperIcon },
    { id: 'gallery', label: 'Kelola Galeri', icon: PhotoIcon },
    { id: 'registrations', label: 'Pendaftaran', icon: UserGroupIcon },
    { id: 'settings', label: 'Pengaturan', icon: CogIcon }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-rainbow relative overflow-hidden flex items-center justify-center py-12">
        <div className="absolute inset-0 bg-clouds opacity-30"></div>
        <div className="absolute inset-0 bg-pattern-dots opacity-20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 text-6xl animate-float">🌈</div>
        <div className="absolute top-20 right-20 text-5xl animate-bounce-slow" style={{animationDelay: '1s'}}>⭐</div>
        <div className="absolute bottom-20 left-1/4 text-4xl animate-pulse-slow" style={{animationDelay: '2s'}}>🎨</div>
        <div className="absolute bottom-10 right-10 text-5xl animate-float" style={{animationDelay: '3s'}}>🎈</div>
        
        <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 relative z-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
              <UserGroupIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🎓 Admin Dashboard</h1>
            <p className="text-gray-600 font-medium">TK Darussalam Asahan</p>
            <div className="w-16 h-1 bg-gradient-primary rounded-full mx-auto mt-2"></div>
          </div>

          {loginError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-fadeInUp">
              <div className="flex items-center">
                <XMarkIcon className="w-5 h-5 mr-2" />
                {loginError}
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                👤 Username
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                required
                className="w-full px-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                placeholder="Masukkan username admin"
              />
            </div>

            <div className="animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🔒 Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                required
                className="w-full px-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                placeholder="Masukkan password admin"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-kindergarten hover-lift disabled:opacity-50 disabled:cursor-not-allowed animate-fadeInUp"
              style={{animationDelay: '0.3s'}}
            >
              {isLoading ? '🔄 Sedang Masuk...' : '🚀 Masuk Dashboard'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="font-medium text-blue-800">💡 Demo Login:</p>
              <p><strong>Username:</strong> admin</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative">
      <div className="absolute inset-0 bg-pattern-waves opacity-10"></div>
      
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b-4 border-gradient-primary relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center animate-bounce-slow">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">🎓 Admin Dashboard</h1>
                <p className="text-sm text-gray-600 font-medium">TK Darussalam Asahan - Panel Kontrol</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-green-600 transition-colors px-3 py-2 rounded-lg hover:bg-green-50"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                🏠 Ke Website
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                🚪 Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72">
            <nav className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-slow">
                  <CogIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">🎛️ Menu Kontrol</h3>
                <div className="w-12 h-1 bg-gradient-primary rounded-full mx-auto mt-2"></div>
              </div>
              <ul className="space-y-3">
                {menuItems.map((item, index) => (
                  <li key={item.id} className="animate-fadeInLeft" style={{animationDelay: `${index * 0.1}s`}}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-4 text-left rounded-xl transition-all duration-300 hover-lift ${
                        activeTab === item.id
                          ? 'bg-gradient-primary text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                      }`}
                    >
                      <item.icon className="w-6 h-6 mr-4" />
                      <span className="font-medium">{item.label}</span>
                      {activeTab === item.id && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div className="animate-fadeInUp">
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">📊 Dashboard Overview</h2>
                  <p className="text-gray-600 mb-8">Selamat datang di panel kontrol TK Darussalam Asahan</p>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card-kindergarten p-6 hover-lift animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center animate-bounce-slow">
                          <UserGroupIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">👥 Total Siswa</p>
                          <p className="text-3xl font-bold text-gray-900">{realData.stats.total || 0}</p>
                          <p className="text-xs text-green-600 font-medium">+5 bulan ini</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-kindergarten p-6 hover-lift animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center animate-bounce-slow">
                          <NewspaperIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">📰 Total Berita</p>
                          <p className="text-3xl font-bold text-gray-900">{realData.news.length || 0}</p>
                          <p className="text-xs text-green-600 font-medium">+3 minggu ini</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-kindergarten p-6 hover-lift animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce-slow">
                          <PhotoIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">📸 Total Galeri</p>
                          <p className="text-3xl font-bold text-gray-900">{realData.gallery.length || 0}</p>
                          <p className="text-xs text-green-600 font-medium">+12 foto baru</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-kindergarten p-6 hover-lift animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center animate-bounce-slow">
                          <DocumentTextIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">📝 Pendaftaran Baru</p>
                          <p className="text-3xl font-bold text-gray-900">{realData.stats.pending || 0}</p>
                          <p className="text-xs text-green-600 font-medium">+8 minggu ini</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activities */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="card-kindergarten animate-fadeInUp" style={{animationDelay: '0.5s'}}>
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center">
                          <NewspaperIcon className="w-6 h-6 text-green-600 mr-3" />
                          <h3 className="text-xl font-bold text-gray-900">📰 Berita Terbaru</h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {newsData.slice(0, 3).map((news, index) => (
                            <div key={news.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors animate-fadeInLeft" style={{animationDelay: `${0.6 + index * 0.1}s`}}>
                              <div>
                                <p className="font-semibold text-gray-900">{news.title}</p>
                                <p className="text-sm text-gray-500">📅 {news.date}</p>
                              </div>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                news.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {news.status === 'Published' ? '✅ Published' : '⏳ Draft'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="card-kindergarten animate-fadeInUp" style={{animationDelay: '0.6s'}}>
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center">
                          <UserGroupIcon className="w-6 h-6 text-blue-600 mr-3" />
                          <h3 className="text-xl font-bold text-gray-900">👥 Pendaftaran Terbaru</h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {getFilteredRegistrations().slice(0, 3).map((reg, index) => (
                            <div key={reg.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors animate-fadeInRight" style={{animationDelay: `${0.7 + index * 0.1}s`}}>
                              <div>
                                <p className="font-semibold text-gray-900">{reg.childName}</p>
                                <p className="text-sm text-gray-500">👨‍👩‍👧‍👦 {reg.parentName}</p>
                              </div>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                reg.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                reg.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {reg.status === 'Approved' ? '✅ Approved' : 
                                 reg.status === 'Rejected' ? '❌ Rejected' : '⏳ Pending'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* News Management Tab */}
            {activeTab === 'news' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeInUp">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900">📰 Kelola Berita</h2>
                    <p className="text-gray-600 mt-2">Kelola semua artikel dan berita sekolah</p>
                  </div>
                  <button 
                    onClick={() => handleAddNew('news')}
                    className="btn-kindergarten hover-lift flex items-center"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    ➕ Tambah Berita
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="card-kindergarten p-4 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="🔍 Cari berita..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="all">📋 Semua Status</option>
                      <option value="published">✅ Published</option>
                      <option value="draft">⏳ Draft</option>
                    </select>
                  </div>
                </div>

                <div className="card-kindergarten overflow-hidden animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-primary">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">📰 Judul</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">🏷️ Kategori</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">📅 Tanggal</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">📊 Status</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">👀 Views</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">⚙️ Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {newsData.filter(news => {
                          const matchesSearch = searchTerm === '' || news.title.toLowerCase().includes(searchTerm.toLowerCase());
                          const matchesStatus = statusFilter === 'all' || news.status.toLowerCase() === statusFilter;
                          return matchesSearch && matchesStatus;
                        }).map((news, index) => (
                          <tr key={news.id} className="hover:bg-gray-50 transition-colors animate-fadeInUp" style={{animationDelay: `${0.3 + index * 0.05}s`}}>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{news.title}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {news.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{news.date}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                news.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {news.status === 'Published' ? '✅ Published' : '⏳ Draft'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">{news.views}</td>
                            <td className="px-6 py-4 text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => window.open(`/berita/${news.id}`, '_blank')}
                                  className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Lihat"
                                >
                                  <EyeIcon className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleEditItem(news, 'news')}
                                  className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteItem(news.id, 'news')}
                                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Hapus"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Gallery Management Tab */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeInUp">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900">🖼️ Kelola Galeri</h2>
                    <p className="text-gray-600 mt-2">Kelola semua foto dan dokumentasi kegiatan</p>
                  </div>
                  <button 
                    onClick={() => handleAddNew('gallery')}
                    className="btn-kindergarten hover-lift flex items-center"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    📸 Tambah Media
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="card-kindergarten p-4 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="🔍 Cari media..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="all">📂 Semua Kategori</option>
                      <option value="kegiatan belajar">📚 Kegiatan Belajar</option>
                      <option value="fasilitas">🏢 Fasilitas</option>
                    </select>
                  </div>
                </div>

                <div className="card-kindergarten overflow-hidden animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-primary">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">📝 Judul</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">🏷️ Kategori</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">📱 Tipe</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">📅 Tanggal</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">📊 Status</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">⚙️ Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {galleryData.filter(item => {
                          const matchesSearch = searchTerm === '' || item.title.toLowerCase().includes(searchTerm.toLowerCase());
                          const matchesCategory = statusFilter === 'all' || item.category.toLowerCase() === statusFilter.toLowerCase();
                          return matchesSearch && matchesCategory;
                        }).map((item, index) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors animate-fadeInUp" style={{animationDelay: `${0.3 + index * 0.05}s`}}>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.title}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                {item.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                item.type === 'image' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {item.type === 'image' ? '🖼️ Image' : '🎥 Video'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                ✅ {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => window.open(`/galeri/${item.id}`, '_blank')}
                                  className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Lihat"
                                >
                                  <EyeIcon className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleEditItem(item, 'gallery')}
                                  className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteItem(item.id, 'gallery')}
                                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Hapus"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Registrations Tab */}
            {activeTab === 'registrations' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeInUp">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900">👶 Kelola Pendaftaran</h2>
                    <p className="text-gray-600 mt-2">Kelola pendaftaran siswa baru berdasarkan tahun</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600 font-medium">Total: {getFilteredRegistrations().length} pendaftar</span>
                  </div>
                </div>

                {/* Year and Filter Selection */}
                <div className="card-kindergarten p-4 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="🔍 Cari nama anak atau orang tua..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <select 
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        {getAvailableYears().map(year => (
                          <option key={year} value={year}>📅 {year}</option>
                        ))}
                      </select>
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="all">📋 Semua Status</option>
                        <option value="pending">⏳ Pending</option>
                        <option value="approved">✅ Approved</option>
                        <option value="rejected">❌ Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                  {['pending', 'approved', 'rejected', 'all'].map((status, index) => {
                    const count = status === 'all' 
                      ? getFilteredRegistrations().length
                      : getFilteredRegistrations().filter(r => r.status.toLowerCase() === status).length;
                    const icons = ['⏳', '✅', '❌', '👥'];
                    const colors = ['yellow', 'green', 'red', 'blue'];
                    const labels = ['Pending', 'Approved', 'Rejected', 'Total'];
                    
                    return (
                      <div key={status} className={`card-kindergarten p-6 hover-lift animate-bounce-slow bg-${colors[index]}-50 border-${colors[index]}-200`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-${colors[index]}-600 text-sm font-medium`}>{labels[index]}</p>
                            <p className="text-3xl font-bold text-gray-900">{count}</p>
                          </div>
                          <div className={`text-4xl`}>{icons[index]}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="card-kindergarten overflow-hidden animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-primary">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">👶 Nama Anak</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">👨‍👩‍👧‍👦 Orang Tua</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">📞 Telepon</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">🎓 Program</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">📅 Tanggal</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">📊 Status</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">⚙️ Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getFilteredRegistrations().map((registration, index) => (
                          <tr key={registration.id} className="hover:bg-gray-50 transition-colors animate-fadeInUp" style={{animationDelay: `${0.4 + index * 0.05}s`}}>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                              <div>
                                <div className="font-bold">{registration.childName}</div>
                                <div className="text-xs text-gray-500">Umur: {registration.age} tahun</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <div>
                                <div className="font-medium">{registration.parentName}</div>
                                <div className="text-xs text-gray-400">{registration.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">{registration.phone}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                                {registration.program}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <div>
                                <div>{registration.date}</div>
                                <div className="text-xs text-gray-400">Tahun: {registration.year}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                registration.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                registration.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {registration.status === 'Approved' ? '✅ Approved' :
                                 registration.status === 'Pending' ? '⏳ Pending' : '❌ Rejected'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">
                              <div className="flex space-x-1">
                                <button 
                                  onClick={() => handleEditItem(registration, 'registration')}
                                  className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Lihat Detail"
                                >
                                  <EyeIcon className="w-4 h-4" />
                                </button>
                                {registration.status === 'Pending' && (
                                  <>
                                    <button 
                                      onClick={() => handleApproveRegistration(registration.id)}
                                      className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                                      title="Setujui"
                                    >
                                      <CheckIcon className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleRejectRegistration(registration.id)}
                                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Tolak"
                                    >
                                      <XMarkIcon className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                <button 
                                  onClick={() => handleDeleteItem(registration.id, 'registration')}
                                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                                  title="Hapus"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {getFilteredRegistrations().length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pendaftaran</h3>
                      <p className="text-gray-500">Belum ada pendaftaran yang sesuai dengan filter yang dipilih.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="animate-fadeInUp">
                  <h2 className="text-4xl font-bold text-gray-900">⚙️ Pengaturan</h2>
                  <p className="text-gray-600 mt-2">Kelola informasi sekolah dan pengaturan sistem</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* School Information */}
                  <div className="card-kindergarten p-6 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                    <div className="flex items-center mb-6">
                      <div className="text-3xl mr-3">🏫</div>
                      <h3 className="text-2xl font-bold text-gray-900">Informasi Sekolah</h3>
                    </div>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">🏷️ Nama Sekolah</label>
                        <input 
                          type="text" 
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" 
                          defaultValue="TK Darussalam Asahan" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">📍 Alamat</label>
                        <textarea 
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" 
                          rows="3" 
                          defaultValue="Jl. Pendidikan No. 123, Kisaran, Kabupaten Asahan" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">📞 Telepon</label>
                        <input 
                          type="text" 
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" 
                          defaultValue="+62 812-3456-7890" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">📧 Email</label>
                        <input 
                          type="email" 
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" 
                          defaultValue="info@tkdarussalam-asahan.sch.id" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">🌐 Website</label>
                        <input 
                          type="url" 
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" 
                          defaultValue="https://tkdarussalam-asahan.sch.id" 
                        />
                      </div>
                      <button type="submit" className="btn-kindergarten hover-lift w-full">
                        💾 Simpan Perubahan
                      </button>
                    </form>
                  </div>

                  {/* Change Password */}
                  <div className="card-kindergarten p-6 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                    <div className="flex items-center mb-6">
                      <div className="text-3xl mr-3">🔐</div>
                      <h3 className="text-2xl font-bold text-gray-900">Ubah Password</h3>
                    </div>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">🔒 Password Lama</label>
                        <input 
                          type="password" 
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                          placeholder="Masukkan password lama"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">🆕 Password Baru</label>
                        <input 
                          type="password" 
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                          placeholder="Masukkan password baru"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">✅ Konfirmasi Password Baru</label>
                        <input 
                          type="password" 
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                          placeholder="Konfirmasi password baru"
                        />
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="font-bold text-blue-800 mb-2">💡 Tips Password Aman:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Minimal 8 karakter</li>
                          <li>• Kombinasi huruf besar dan kecil</li>
                          <li>• Sertakan angka dan simbol</li>
                          <li>• Hindari informasi pribadi</li>
                        </ul>
                      </div>
                      <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 w-full font-bold">
                        🔄 Ubah Password
                      </button>
                    </form>
                  </div>
                </div>

                {/* Additional Settings */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Backup & Export */}
                  <div className="card-kindergarten p-6 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                    <div className="text-center">
                      <div className="text-4xl mb-4">💾</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Backup Data</h3>
                      <p className="text-gray-600 mb-4">Unduh backup semua data sekolah</p>
                      <button className="btn-kindergarten hover-lift w-full">
                        📥 Download Backup
                      </button>
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="card-kindergarten p-6 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                    <div className="text-center">
                      <div className="text-4xl mb-4">📊</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Info Sistem</h3>
                      <div className="text-sm text-gray-600 space-y-2">
                        <div>Versi: 2.1.0</div>
                        <div>Database: MySQL</div>
                        <div>Server: Online</div>
                        <div className="text-green-600 font-medium">✅ Sistem Normal</div>
                      </div>
                    </div>
                  </div>

                  {/* Support */}
                  <div className="card-kindergarten p-6 animate-fadeInUp" style={{animationDelay: '0.5s'}}>
                    <div className="text-center">
                      <div className="text-4xl mb-4">🆘</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Bantuan</h3>
                      <p className="text-gray-600 mb-4">Butuh bantuan teknis?</p>
                      <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 w-full font-bold">
                        📞 Hubungi Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal for Add/Edit */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-fadeInUp">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {modalType === 'add' ? '➕ Tambah' : '✏️ Edit'} 
                    {activeTab === 'news' ? ' Berita' : activeTab === 'gallery' ? ' Foto' : ' Pendaftaran'}
                  </h3>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                {activeTab === 'news' && (
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">📰 Judul Berita</label>
                      <input 
                        type="text" 
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        defaultValue={editingItem?.title || ''}
                        placeholder="Masukkan judul berita"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">📝 Konten</label>
                      <textarea 
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        rows="4"
                        defaultValue={editingItem?.content || ''}
                        placeholder="Masukkan konten berita"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">🏷️ Status</label>
                      <select className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="published">📢 Published</option>
                        <option value="draft">📝 Draft</option>
                      </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button 
                        type="button" 
                        onClick={() => setShowModal(false)}
                        className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-xl hover:bg-gray-300 transition-colors font-bold"
                      >
                        ❌ Batal
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 btn-kindergarten hover-lift"
                      >
                        💾 Simpan
                      </button>
                    </div>
                  </form>
                )}
                
                {activeTab === 'gallery' && (
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">🖼️ Judul Foto</label>
                      <input 
                        type="text" 
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                        defaultValue={editingItem?.title || ''}
                        placeholder="Masukkan judul foto"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">📂 Kategori</label>
                      <select className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="kegiatan">🎯 Kegiatan</option>
                        <option value="pembelajaran">📚 Pembelajaran</option>
                        <option value="acara">🎉 Acara</option>
                        <option value="fasilitas">🏢 Fasilitas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">📷 Upload Foto</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">📝 Deskripsi</label>
                      <textarea 
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                        rows="3"
                        defaultValue={editingItem?.description || ''}
                        placeholder="Masukkan deskripsi foto"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button 
                        type="button" 
                        onClick={() => setShowModal(false)}
                        className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-xl hover:bg-gray-300 transition-colors font-bold"
                      >
                        ❌ Batal
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 font-bold"
                      >
                        💾 Simpan
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-fadeInUp">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗑️</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Konfirmasi Hapus</h3>
                  <p className="text-gray-600 mb-6">
                    Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-xl hover:bg-gray-300 transition-colors font-bold"
                    >
                      ❌ Batal
                    </button>
                    <button 
                      onClick={() => {
                        handleDeleteItem(deleteItemId);
                        setShowDeleteConfirm(false);
                      }}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 font-bold"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}