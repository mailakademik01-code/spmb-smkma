
import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Trophy, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2,
  Instagram,
  Facebook,
  Youtube,
  GraduationCap,
  Palette,
  Car,
  Home as HomeIcon,
  ChevronLeft,
  Settings,
  Lock,
  LogOut
} from 'lucide-react';
import { 
  SCHOOL_NAME, 
  SCHOOL_TAGLINE, 
  NAV_ITEMS, 
  FEATURES, 
  STEPS, 
  CONTACT_INFO, 
  REQUIREMENTS,
  DEPARTMENTS
} from './constants';
import AIChatBot from './components/AIChatBot';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'register' | 'admin'>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });
  const [adminProfile, setAdminProfile] = useState<any>(() => {
    const saved = localStorage.getItem('adminProfile');
    return saved ? JSON.parse(saved) : null;
  });

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#register') {
        setActiveTab('register');
      } else if (hash === '#admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const getMajorIcon = (code: string) => {
    switch (code) {
      case "DKV": return <Palette className="text-emerald-500" size={32} />;
      case "TKR": return <Car className="text-emerald-500" size={32} />;
      default: return <GraduationCap size={32} />;
    }
  };

  const handleNavigate = (tab: 'home' | 'register' | 'admin', hash?: string) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
    if (hash) {
      window.location.hash = hash;
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (user: any) => {
    setIsAuthenticated(true);
    setAdminProfile(user);
    localStorage.setItem('isAdminAuthenticated', 'true');
    localStorage.setItem('adminProfile', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminProfile(null);
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminProfile');
    handleNavigate('home', '#home');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            <button 
              onClick={() => handleNavigate('home', '#home')}
              className="flex items-center gap-3 group transition-all"
            >
              <div className="bg-emerald-600 p-2 rounded-xl group-hover:bg-emerald-700 transition-colors">
                <GraduationCap className="text-white w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div className="text-left">
                <span className="text-lg md:text-xl font-bold text-slate-900 leading-tight block">SMK Mathlaul Anwar</span>
                <span className="text-xs md:text-sm text-emerald-600 font-semibold uppercase tracking-wider">Buaranjati</span>
              </div>
            </button>
            
            <div className="hidden md:flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <button 
                  key={item.label} 
                  onClick={() => handleNavigate('home', item.href)}
                  className={`text-sm font-bold transition-colors ${activeTab === 'home' ? 'text-slate-600 hover:text-emerald-600' : 'text-slate-400 hover:text-emerald-600'}`}
                >
                  {item.label}
                </button>
              ))}
              <div className="w-px h-6 bg-slate-200"></div>
              <button 
                onClick={() => handleNavigate('admin')}
                className={`p-2 rounded-full transition-colors ${activeTab === 'admin' ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400 hover:bg-slate-100'}`}
                title="Admin Panel"
              >
                <Lock size={20} />
              </button>
              <button 
                onClick={() => handleNavigate('register')}
                className={`px-6 py-2.5 rounded-full font-bold transition-all shadow-lg ${
                  activeTab === 'register' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                }`}
              >
                SPMB Online
              </button>
            </div>

            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 absolute w-full left-0 animate-in slide-in-from-top duration-300 shadow-xl">
            <div className="px-4 py-6 space-y-4">
              {NAV_ITEMS.map((item) => (
                <button 
                  key={item.label} 
                  className="block w-full text-left text-lg font-medium text-slate-700 hover:text-emerald-600"
                  onClick={() => handleNavigate('home', item.href)}
                >
                  {item.label}
                </button>
              ))}
              <button 
                className="block w-full bg-slate-100 text-slate-700 text-center py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                onClick={() => handleNavigate('admin')}
              >
                <Lock size={18} /> Admin Panel
              </button>
              <button 
                className="block w-full bg-emerald-600 text-white text-center py-3 rounded-xl font-bold"
                onClick={() => handleNavigate('register')}
              >
                Daftar Sekarang
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-500">
            {/* Hero Section */}
            <section id="home" className="relative pt-12 pb-24 lg:pt-24 lg:pb-32 overflow-hidden bg-pattern">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
                    Selamat Datang Di WEB SPMB SMK MA Buaranjati
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] mb-6">
                    Kuasai Keahlian, Siap <span className="text-emerald-600">Kerja & Mandiri</span>
                  </h1>
                  <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    Bergabunglah dengan SMK Mathlaul Anwar Buaranjati. Pendidikan berbasis kompetensi yang menjembatani siswa langsung ke dunia kerja dan kewirausahaan.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                    <button 
                      onClick={() => handleNavigate('register')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 group transition-all"
                    >
                      Daftar SPMB Sekarang <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => handleNavigate('home', '#departments')}
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg shadow-sm transition-all flex items-center justify-center"
                    >
                      Pilih Jurusan
                    </button>
                  </div>
                </div>
                <div className="flex-1 relative">
                  <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border-4 border-white">
                    <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800" alt="Siswa SMK Praktik" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </section>

            {/* Departments Section */}
            <section id="departments" className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">Pilihan Masa Depan</h2>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Program Keahlian Unggulan</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {DEPARTMENTS.map((dept) => (
                    <div key={dept.code} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
                      <div className="bg-white p-4 rounded-2xl inline-block shadow-sm mb-6 group-hover:bg-emerald-50 transition-colors">
                        {getMajorIcon(dept.code)}
                      </div>
                      <h4 className="text-2xl font-bold text-slate-900 mb-1">{dept.code}</h4>
                      <p className="text-emerald-600 font-semibold mb-4 text-base">{dept.name}</p>
                      <p className="text-slate-600 text-sm leading-relaxed">{dept.desc}</p>
                      <div className="mt-6 flex items-center gap-2 text-emerald-600 font-bold text-sm">
                         Pelajari Selengkapnya <ArrowRight size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Flow Section */}
            <section id="flow" className="py-24 bg-slate-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                   <h2 className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">Informasi Pendaftaran</h2>
                   <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Alur SPMB Online</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                  {STEPS.map((step, i) => (
                    <div key={i} className="relative text-center">
                       <div className="bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 font-black text-xl shadow-lg shadow-emerald-200">
                          {step.id}
                       </div>
                       <h4 className="font-bold text-slate-900 mb-2">{step.title}</h4>
                       <p className="text-slate-500 text-xs leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'register' && (
          <div className="animate-in slide-in-from-bottom duration-500 bg-slate-50 min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <button 
                    onClick={() => handleNavigate('home')}
                    className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold mb-4 transition-colors"
                   >
                    <ChevronLeft size={20} /> Kembali ke Beranda
                   </button>
                   <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Portal SPMB Online</h2>
                   <p className="text-slate-500 mt-2">Lengkapi data diri Anda untuk bergabung bersama kami.</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Status SPMB</p>
                    <p className="text-sm font-bold text-slate-900">Gelombang I - Dibuka</p>
                  </div>
                </div>
              </div>
              <RegistrationForm />
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="animate-in fade-in duration-500 bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               {!isAuthenticated ? (
                 <AdminLogin onLoginSuccess={handleLoginSuccess} />
               ) : (
                 <div className="animate-in fade-in duration-500">
                   <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <button 
                          onClick={() => handleNavigate('home')}
                          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold mb-4 transition-colors"
                        >
                          <ChevronLeft size={20} /> Kembali
                        </button>
                        <h2 className="text-3xl font-extrabold text-slate-900">Admin Panel SPMB</h2>
                        <p className="text-slate-500">Kelola seluruh data pendaftar yang masuk melalui website.</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                          <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-black text-xs">
                            {adminProfile?.full_name?.charAt(0) || 'A'}
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-black text-slate-900 leading-tight">{adminProfile?.full_name}</p>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{adminProfile?.role === 'super_admin' ? 'Super Admin' : 'Staff Admission'}</p>
                          </div>
                        </div>
                        <button 
                          onClick={handleLogout}
                          className="bg-white text-rose-600 border border-rose-100 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-rose-50 transition-all shadow-sm w-full md:w-auto justify-center"
                        >
                          <LogOut size={18} /> Keluar Admin
                        </button>
                      </div>
                   </div>
                   <AdminDashboard adminProfile={adminProfile} />
                 </div>
               )}
            </div>
          </div>
        )}
      </main>

      {/* Simplified Contact Section without "Tinggalkan Pesan" */}
      <section id="contact" className="py-24 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-extrabold mb-12">Informasi Kontak</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Address */}
            <div className="flex flex-col items-center gap-4">
              <div className="bg-emerald-600/20 p-4 rounded-2xl text-emerald-400 mb-2">
                <MapPin size={32} />
              </div>
              <h4 className="font-bold text-lg">Alamat Sekolah</h4>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{CONTACT_INFO.address}</p>
            </div>

            {/* Phone */}
            <div className="flex flex-col items-center gap-4">
              <div className="bg-emerald-600/20 p-4 rounded-2xl text-emerald-400 mb-2">
                <Phone size={32} />
              </div>
              <h4 className="font-bold text-lg">Hubungi Kami</h4>
              <p className="text-slate-400 text-sm">{CONTACT_INFO.phone}</p>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest">{CONTACT_INFO.hours}</p>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center gap-4">
              <div className="bg-emerald-600/20 p-4 rounded-2xl text-emerald-400 mb-2">
                <Mail size={32} />
              </div>
              <h4 className="font-bold text-lg">Email Resmi</h4>
              <p className="text-slate-400 text-sm">{CONTACT_INFO.email}</p>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Ikuti Media Sosial Kami</p>
            <div className="flex gap-4">
              <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-emerald-400"><Instagram size={24} /></button>
              <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-emerald-400"><Facebook size={24} /></button>
              <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-emerald-400"><Youtube size={24} /></button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-12 text-center text-slate-500 text-sm border-t border-white/5">
        <p className="mb-2 font-semibold text-slate-400">PERGURUAN MATHLA’UL ANWAR</p>
        <p>&copy; {new Date().getFullYear()} {SCHOOL_NAME}. Seluruh Hak Cipta Dilindungi.</p>
      </footer>

      <AIChatBot />
    </div>
  );
};

export default App;
