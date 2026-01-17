
import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';

interface AdminLoginProps {
  onLoginSuccess: (user: any) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Cek di database admin_users
      const { data: dbUser, error: dbError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .maybeSingle();

      if (dbError) throw dbError;

      if (dbUser) {
        onLoginSuccess(dbUser);
        return;
      }

      // 2. Fallback ke akun default sekolah (untuk kemudahan setup pertama kali)
      if (username === 'admin' && password === 'smkma@2026') {
        onLoginSuccess({
          username: 'admin',
          full_name: 'Administrator Utama',
          role: 'super_admin'
        });
      } else {
        setError('Username atau Password salah. Silakan coba lagi.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      // Tetap izinkan login default jika database bermasalah (fallback safety)
      if (username === 'admin' && password === 'smkma@2026') {
        onLoginSuccess({
          username: 'admin',
          full_name: 'Administrator Utama',
          role: 'super_admin'
        });
      } else {
        setError('Koneksi sistem bermasalah. Silakan gunakan akun default.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-950 p-10 text-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
          <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-900/20">
            <Lock className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Admin Login</h2>
          <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">Akses Panel Manajemen SPMB</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 animate-in slide-in-from-top duration-300">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-xs font-bold leading-tight">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold transition-all"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold transition-all"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <LogIn size={20} /> Masuk ke Dashboard
              </>
            )}
          </button>
        </form>

        <div className="px-10 pb-10 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            Gunakan kredensial resmi sekolah untuk mengakses data pendaftar murid baru.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
