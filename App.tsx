
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
  LogOut,
  Sparkles,
  Zap,
  Star,
  Award,
  Image as ImageIcon
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
} from './constants.tsx';
import AIChatBot from './components/AIChatBot.tsx';
import RegistrationForm from './components/RegistrationForm.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import AdminLogin from './components/AdminLogin.tsx';
import { supabase } from './services/supabase.ts';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'register' | 'admin'>('home');
  const [scrolled, setScrolled] = useState(false);
  const [dynamicDepartments, setDynamicDepartments] = useState<any[]>(DEPARTMENTS);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });
  const [adminProfile, setAdminProfile] = useState<any>(() => {
    const saved = localStorage.getItem('adminProfile');
    return saved ? JSON.parse(saved) : null;
  });

  // Fetch dynamic major settings
  useEffect(() => {
    const fetchMajorSettings = async () => {
      try {
        const { data, error } = await supabase.from('major_settings').select('*');
        if (!error && data && data.length > 0) {
          // Merge static code with dynamic description/logo
          setDynamicDepartments(data);
        }
      } catch (err) {
        console.error("Failed to load dynamic majors:", err);
      }
    };
    fetchMajorSettings();
  }, [activeTab]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const getMajorIcon = (dept: any) => {
    if (dept.logo_url) {
      return (
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-white/20">
          <img src={dept.logo_url} alt={dept.code} className="w-full h-full object-contain p-1" />
        </div>
      );
    }
    
    // Default fallback icons
    const iconColor = dept.color_hex || '#10b981';
    switch (dept.code) {
      case "DKV": return <Palette style={{ color: iconColor }} size={40} />;
      case "TKR": return <Car style={{ color: iconColor }} size={40} />;
      default: return <GraduationCap size={40} />;
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
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200 py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-18 items-center">
            <button 
              onClick={() => handleNavigate('home', '#home')}
              className="flex items-center gap-3 group transition-all"
            >
              <div className="bg-emerald-600 p-2 rounded-2xl group-hover:rotate-12 transition-all shadow-lg shadow-emerald-200">
                <GraduationCap className="text-white w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div className="text-left">
                <span className="text-lg md:text-xl font-black text-slate-900 leading-tight block tracking-tight">SMK Mathlaul Anwar</span>
                <span className="text-[10px] md:text-xs text-emerald-600 font-black uppercase tracking-[0.2em] opacity-80">Buaranjati</span>
              </div>
            </button>
            
            <div className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <button 
                  key={item.label} 
                  onClick={() => handleNavigate('home', item.href)}
                  className="text-xs font-black text-slate-500 hover:text-emerald-600 transition-all uppercase tracking-widest relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-emerald-500 hover:after:w-full after:transition-all"
                >
                  {item.label}
                </button>
              ))}
              <div className="w-px h-6 bg-slate-200 mx-2"></div>
              <button 
                onClick={() => handleNavigate('admin')}
                className={`p-3 rounded-2xl transition-all ${activeTab === 'admin' ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`}
                title="Admin Panel"
              >
                <Lock size={20} />
              </button>
              <button 
                onClick={() => handleNavigate('register')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-200 transition-all active:scale-95 btn-shine"
              >
                Pendaftaran
              </button>
            </div>

            <button className="lg:hidden p-2 text-slate-600 bg-white/50 backdrop-blur rounded-xl border border-slate-200 shadow-sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[72px] bg-white border-b border-slate-100 animate-in slide-in-from-top duration-300 shadow-2xl z-50">
            <div className="p-6 space-y-3">
              {NAV_ITEMS.map((item) => (
                <button 
                  key={item.label} 
                  className="block w-full text-left p-4 rounded-2xl text-base font-black text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all uppercase tracking-widest"
                  onClick={() => handleNavigate('home', item.href)}
                >
                  {item.label}
                </button>
              ))}
              <div className="h-px bg-slate-100 my-4"></div>
              <button 
                className="block w-full bg-slate-100 text-slate-700 text-center py-5 rounded-2xl font-black flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                onClick={() => handleNavigate('admin')}
              >
                <Lock size={18} /> Admin Panel
              </button>
              <button 
                className="block w-full bg-emerald-600 text-white text-center py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-100"
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
          <div className="animate-in fade-in duration-700">
            {/* Hero Section */}
            <section id="home" className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
              <div className="absolute inset-0 bg-pattern opacity-40"></div>
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="absolute top-1/2 -left-24 w-64 h-64 bg-emerald-50 rounded-full blur-2xl animate-pulse-slow"></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                  <div className="flex-1 text-center lg:text-left space-y-8 animate-in slide-in-from-left duration-1000">
                    <div className="inline-flex items-center gap-3 bg-emerald-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 animate-bounce">
                      <Sparkles size={12} /> Penerimaan Murid Baru 2026
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight">
                      Membangun Karakter <br/>
                      <span className="text-gradient">Profesional & Mandiri</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                      Pendidikan vokasi berkualitas dengan kurikulum berbasis industri untuk melahirkan generasi yang siap bersaing di era digital.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 pt-4">
                      <button 
                        onClick={() => handleNavigate('register')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-200 flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 group btn-shine"
                      >
                        Gabung Sekarang <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                      <button 
                        onClick={() => handleNavigate('home', '#departments')}
                        className="bg-white/80 backdrop-blur hover:bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-sm transition-all hover:border-emerald-500 hover:text-emerald-600 flex items-center justify-center"
                      >
                        Lihat Keunggulan
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 relative animate-in zoom-in duration-1000">
                    <div className="relative z-20 animate-float">
                      <div className="rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] aspect-[4/5] border-8 border-white group">
                        <img 
                          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" 
                          alt="Siswa Berprestasi" 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      {/* Floating Badge */}
                      <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-[2rem] shadow-2xl animate-float [animation-delay:2s] border border-slate-50 glass-card">
                        <div className="flex items-center gap-4">
                          <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                            <Award size={32} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sekolah Unggulan</p>
                            <p className="text-lg font-black text-slate-900">Lulusan Siap Kerja</p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -top-10 -right-10 bg-slate-900 p-6 rounded-[2rem] shadow-2xl animate-float [animation-delay:1s] text-white">
                        <div className="flex items-center gap-4">
                          <div className="bg-white/10 p-3 rounded-2xl text-emerald-400">
                            <Zap size={32} fill="currentColor" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pendaftaran</p>
                            <p className="text-lg font-black text-white leading-tight">Gelombang I Dibuka</p>
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mt-1">Januari - Maret</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Decorative Background Circles */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-2 border-emerald-100 rounded-full opacity-20 animate-pulse-slow"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-slate-200 rounded-full opacity-10 animate-pulse-slow [animation-delay:2s]"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Stats Section */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {FEATURES.map((feature, i) => (
                    <div key={i} className="group p-8 rounded-[2.5rem] bg-slate-50 hover:bg-emerald-600 transition-all duration-500 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-200 hover:-translate-y-3">
                      <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-md group-hover:scale-110 transition-transform">
                        {feature.icon === 'ShieldCheck' && <ShieldCheck className="text-emerald-600" />}
                        {feature.icon === 'Trophy' && <Trophy className="text-emerald-600" />}
                        {feature.icon === 'Users' && <Users className="text-emerald-600" />}
                        {feature.icon === 'BookOpen' && <BookOpen className="text-emerald-600" />}
                      </div>
                      <h4 className="text-xl font-black text-slate-900 mb-4 group-hover:text-white transition-colors tracking-tight">{feature.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium group-hover:text-emerald-50 transition-colors">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Departments Section */}
            <section id="departments" className="py-32 bg-slate-50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24 space-y-4">
                  <div className="inline-block bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                    Keahlian Masa Depan
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Program Keahlian Unggulan</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto font-medium">Kurikulum berbasis kompetensi yang dirancang untuk menjawab tantangan industri masa kini.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {dynamicDepartments.map((dept, i) => (
                    <div key={dept.code} className={`group relative bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 overflow-hidden ${i === 1 ? 'lg:translate-y-12' : ''}`}>
                      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 scale-50 group-hover:scale-100" style={{ backgroundColor: dept.color_hex + '10' }}></div>
                      
                      <div className="relative z-10">
                        <div className="bg-slate-50 p-6 rounded-3xl inline-block mb-10 shadow-inner group-hover:text-white transition-all duration-500 group-hover:rotate-12" style={{ backgroundColor: scrolled ? 'white' : 'transparent', '--tw-bg-opacity': '1' }}>
                          <div className="group-hover:hidden">
                            {getMajorIcon(dept)}
                          </div>
                          <div className="hidden group-hover:block">
                            <Zap size={40} />
                          </div>
                        </div>
                        <h4 className="text-4xl font-black text-slate-900 mb-2 tracking-tight transition-colors" style={{ color: dept.color_hex }}>{dept.code}</h4>
                        <p className="text-xl font-bold text-slate-500 mb-6">{dept.name}</p>
                        <p className="text-slate-400 leading-relaxed font-medium text-lg mb-10">{dept.description || dept.desc}</p>
                        
                        <div className="flex flex-wrap gap-3 mb-10">
                          {dept.code === 'DKV' ? (
                            ['Desain Grafis', 'Multimedia', 'Fotografi', 'UI/UX'].map(tag => (
                              <span key={tag} className="px-5 py-2.5 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-100">{tag}</span>
                            ))
                          ) : (
                            ['Otomotif', 'Teknisi Mesin', 'Listrik Kendaraan', 'EFI'].map(tag => (
                              <span key={tag} className="px-5 py-2.5 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-100">{tag}</span>
                            ))
                          )}
                        </div>
                        
                        <button className="flex items-center gap-4 font-black text-sm uppercase tracking-[0.2em] group-hover:gap-6 transition-all" style={{ color: dept.color_hex }}>
                          Detail Kurikulum <ArrowRight size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Steps & Alur Section */}
            <section id="flow" className="py-32 bg-white relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-24 space-y-4">
                  <h2 className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Informasi Pendaftaran</h2>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">Langkah Mudah Pendaftaran</h3>
                  <p className="text-slate-500 font-medium">Proses seleksi yang transparan dan terintegrasi secara digital.</p>
                </div>
                
                <div className="relative">
                  {/* Connecting Line */}
                  <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 relative z-10">
                    {STEPS.map((step, i) => (
                      <div key={i} className="group text-center space-y-6">
                        <div className="relative">
                          <div className="w-24 h-24 bg-white border-4 border-slate-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl group-hover:bg-emerald-600 group-hover:border-emerald-100 group-hover:text-white transition-all duration-500 group-hover:-translate-y-4">
                            <span className="text-3xl font-black tracking-tight">{step.id}</span>
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500">
                             <CheckCircle2 size={16} />
                          </div>
                        </div>
                        <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">{step.title}</h4>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-[180px] mx-auto">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-24 text-center">
                   <button 
                    onClick={() => handleNavigate('register')}
                    className="bg-slate-900 text-white px-12 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-black transition-all hover:scale-105 active:scale-95 btn-shine"
                   >
                    Mulai Daftar Sekarang
                   </button>
                </div>
              </div>
            </section>
            
            {/* CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
               <div className="max-w-7xl mx-auto rounded-[4rem] bg-emerald-600 p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(16,185,129,0.4)]">
                  <div className="absolute top-0 left-0 w-full h-full animate-gradient-x bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700"></div>
                  <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10 space-y-10 animate-in fade-in zoom-in duration-1000">
                     <h3 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">Siap Bergabung dengan <br/> Generasi Juara?</h3>
                     <p className="text-xl md:text-2xl text-emerald-50/80 font-medium max-w-3xl mx-auto leading-relaxed">Jangan lewatkan kesempatan menjadi bagian dari SMK Mathlaul Anwar Buaranjati Gelombang I.</p>
                     <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
                        <button onClick={() => handleNavigate('register')} className="bg-white text-emerald-600 px-12 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-emerald-50 transition-all hover:scale-105 active:scale-95 btn-shine">Daftar SPMB Online</button>
                        <a href={`https://wa.me/${CONTACT_INFO.phone.split(' / ')[0].replace(/-/g, '')}`} target="_blank" className="bg-emerald-950 text-white px-12 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3">Konsultasi WA</a>
                     </div>
                  </div>
               </div>
            </section>
          </div>
        )}

        {activeTab === 'register' && (
          <div className="animate-in slide-in-from-bottom duration-500 bg-slate-50 min-h-screen py-12 pt-32">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                   <button 
                    onClick={() => handleNavigate('home')}
                    className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black uppercase tracking-widest text-[10px] transition-all group"
                   >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
                   </button>
                   <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Formulir <span className="text-gradient">SPMB Online</span></h2>
                   <p className="text-slate-500 font-medium">Isi biodata Anda dengan lengkap dan benar.</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4 animate-pulse">
                  <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                    <Clock size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Sesi Pendaftaran</p>
                    <p className="text-sm font-black text-slate-900 uppercase">Gelombang I Aktif</p>
                  </div>
                </div>
              </div>
              <RegistrationForm />
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="animate-in fade-in duration-500 bg-slate-50 min-h-screen py-12 pt-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               {!isAuthenticated ? (
                 <AdminLogin onLoginSuccess={handleLoginSuccess} />
               ) : (
                 <div className="animate-in fade-in duration-500">
                   <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="space-y-3">
                        <button 
                          onClick={() => handleNavigate('home')}
                          className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black uppercase tracking-widest text-[10px] transition-all"
                        >
                          <ChevronLeft size={16} /> Beranda
                        </button>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Pusat <span className="text-emerald-600">Kendali Admin</span></h2>
                        <p className="text-slate-500 font-medium">Pantau dan kelola data pendaftar masuk secara real-time.</p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                          <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-emerald-100">
                            {adminProfile?.full_name?.charAt(0) || 'A'}
                          </div>
                          <div className="text-left">
                            <p className="text-[11px] font-black text-slate-900 leading-tight uppercase tracking-tight">{adminProfile?.full_name}</p>
                            <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">{adminProfile?.role === 'super_admin' ? 'Super Admin' : 'Staff Admission'}</p>
                          </div>
                        </div>
                        <button 
                          onClick={handleLogout}
                          className="bg-rose-50 text-rose-600 border border-rose-100 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-rose-100 transition-all shadow-sm w-full md:w-auto justify-center"
                        >
                          <LogOut size={16} /> Keluar Sistem
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

      {/* Simplified Contact Section */}
      <section id="contact" className="py-32 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-20 space-y-4">
             <h3 className="text-4xl md:text-5xl font-black tracking-tight">Hubungi Kami</h3>
             <p className="text-slate-500 font-medium max-w-xl mx-auto">Kami siap membantu menjawab pertanyaan Anda terkait proses pendaftaran murid baru.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <div className="group p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500">
              <div className="bg-emerald-600/20 w-16 h-16 rounded-2xl text-emerald-400 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <MapPin size={32} />
              </div>
              <h4 className="font-black text-xl uppercase tracking-tight mb-4">Lokasi</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">{CONTACT_INFO.address}</p>
            </div>

            <div className="group p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500">
              <div className="bg-emerald-600/20 w-16 h-16 rounded-2xl text-emerald-400 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all">
                <Phone size={32} />
              </div>
              <h4 className="font-black text-xl uppercase tracking-tight mb-4">WhatsApp</h4>
              <p className="text-slate-400 text-sm font-black mb-2">{CONTACT_INFO.phone}</p>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">{CONTACT_INFO.hours}</p>
            </div>

            <div className="group p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500">
              <div className="bg-emerald-600/20 w-16 h-16 rounded-2xl text-emerald-400 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <Mail size={32} />
              </div>
              <h4 className="font-black text-xl uppercase tracking-tight mb-4">Email</h4>
              <p className="text-slate-400 text-sm font-medium">{CONTACT_INFO.email}</p>
            </div>
          </div>
          
          <div className="mt-32 pt-16 border-t border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="text-left space-y-2">
                 <div className="flex items-center gap-3">
                   <GraduationCap className="text-emerald-500" size={32} />
                   <span className="text-2xl font-black tracking-tight">SMK Mathlaul Anwar</span>
                 </div>
                 <p className="text-slate-500 text-sm font-medium">{SCHOOL_TAGLINE}</p>
               </div>
               
               <div className="flex flex-col items-center md:items-end gap-6">
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Official Social Media</p>
                 <div className="flex gap-4">
                   <button className="w-14 h-14 bg-white/5 rounded-2xl hover:bg-emerald-600 transition-all text-emerald-400 hover:text-white flex items-center justify-center border border-white/10 group"><Instagram size={24} className="group-hover:scale-110 transition-transform" /></button>
                   <button className="w-14 h-14 bg-white/5 rounded-2xl hover:bg-emerald-600 transition-all text-emerald-400 hover:text-white flex items-center justify-center border border-white/10 group"><Facebook size={24} className="group-hover:scale-110 transition-transform" /></button>
                   <button className="w-14 h-14 bg-white/5 rounded-2xl hover:bg-emerald-600 transition-all text-emerald-400 hover:text-white flex items-center justify-center border border-white/10 group"><Youtube size={24} className="group-hover:scale-110 transition-transform" /></button>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-12 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} SMK Mathlaul Anwar Buaranjati • Seluruh Hak Cipta Dilindungi.</p>
      </footer>

      <AIChatBot />
    </div>
  );
};

export default App;
