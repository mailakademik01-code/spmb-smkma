
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  Trash2, 
  User, 
  Key, 
  X, 
  AlertCircle, 
  Loader2,
  CheckCircle2,
  Database,
  Terminal,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';

interface AdminUser {
  id: string;
  created_at: string;
  username: string;
  full_name: string;
  role: 'super_admin' | 'staff';
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableMissing, setTableMissing] = useState(false);
  const [copied, setCopied] = useState(false);

  const SQL_SCRIPT = `CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'staff'
);

-- Tambahkan user admin default
INSERT INTO admin_users (username, password, full_name, role) 
VALUES ('admin', 'smkma@2026', 'Administrator Utama', 'super_admin')
ON CONFLICT (username) DO NOTHING;`;

  const fetchUsers = async () => {
    setLoading(true);
    setTableMissing(false);
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        // Cek jika error karena tabel tidak ditemukan (PGRST116 atau 42P01)
        if (error.code === '42P01' || error.message.includes('admin_users') || error.message.includes('cache')) {
          setTableMissing(true);
          throw new Error("Tabel 'admin_users' belum dibuat di database Supabase.");
        }
        throw error;
      }
      setUsers(data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert([formData]);

      if (insertError) throw insertError;

      setIsModalOpen(false);
      setFormData({ username: '', password: '', full_name: '', role: 'staff' });
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Gagal membuat user baru.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'staff' as 'super_admin' | 'staff'
  });

  const handleDeleteUser = async (id: string, username: string) => {
    if (username === 'admin') {
      alert("Akun admin utama tidak dapat dihapus.");
      return;
    }
    
    if (!window.confirm(`Hapus pengguna ${username}? Tindakan ini permanen.`)) return;

    try {
      const { error: deleteError } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      alert("Gagal menghapus user: " + err.message);
    }
  };

  if (tableMissing) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="bg-amber-50 border-2 border-amber-200 p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex items-start gap-6">
            <div className="bg-amber-100 p-4 rounded-2xl text-amber-600 shadow-sm">
              <Database size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-amber-900 uppercase tracking-tight mb-2">Setup Database Diperlukan</h3>
              <p className="text-sm text-amber-700 font-medium leading-relaxed">
                Fitur Manajemen User membutuhkan tabel baru di database Supabase Anda. 
                Ikuti langkah di bawah ini untuk mengaktifkan fitur ini:
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4 text-xs font-bold text-amber-800">
              <span className="bg-amber-200 w-6 h-6 rounded-full flex items-center justify-center">1</span>
              Buka Dashboard Supabase &gt; SQL Editor &gt; New Query
            </div>
            
            <div className="relative group">
              <div className="absolute -top-3 left-6 bg-slate-900 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest z-10 flex items-center gap-2">
                <Terminal size={10} /> SQL Script Setup
              </div>
              <pre className="bg-slate-950 text-emerald-400 p-8 rounded-3xl font-mono text-xs overflow-x-auto shadow-2xl border border-slate-800 pt-10">
                {SQL_SCRIPT}
              </pre>
              <button 
                onClick={handleCopySQL}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl transition-all backdrop-blur-md border border-white/10 flex items-center gap-2 text-[10px] font-bold uppercase"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? 'Tersalin' : 'Salin Kode'}
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-amber-800">
              <span className="bg-amber-200 w-6 h-6 rounded-full flex items-center justify-center">2</span>
              Tempel kode di atas dan klik tombol "Run"
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={fetchUsers}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-amber-200 transition-all active:scale-95"
              >
                {/* Fixed: RefreshCw was missing from imports */}
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Sudah Saya Jalankan, Cek Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Manajemen Pengguna</h3>
          <p className="text-sm text-slate-500 font-medium">Kelola akun administrator dan hak akses sistem SPMB.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-emerald-100 transition-all active:scale-95"
        >
          <UserPlus size={18} /> Tambah User Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center">
            <Loader2 className="animate-spin text-emerald-600" size={32} />
          </div>
        ) : users.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100">
            <User size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">Belum ada user tambahan.</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${user.role === 'super_admin' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {user.role === 'super_admin' ? <ShieldCheck size={24} /> : <Shield size={24} />}
                </div>
                {user.username !== 'admin' && (
                  <button 
                    onClick={() => handleDeleteUser(user.id, user.username)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <h4 className="font-black text-slate-900 text-lg mb-1">{user.full_name}</h4>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">@{user.username}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${user.role === 'super_admin' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {user.role === 'super_admin' ? 'Super Admin' : 'Staff Admission'}
                </span>
                <span className="text-[10px] text-slate-300 font-medium">Sejak {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-slate-950 p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-600 p-3 rounded-2xl">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className="font-black text-xl uppercase tracking-tight">User Baru</h3>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Registrasi Akun Admin</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-8 space-y-6">
              {error && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600">
                  <AlertCircle size={20} className="shrink-0" />
                  <p className="text-xs font-bold">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold transition-all"
                      placeholder="Contoh: Budi Santoso"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase()})}
                      className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold transition-all"
                      placeholder="user123"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold transition-all"
                        placeholder="••••••"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Hak Akses (Role)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, role: 'staff'})}
                      className={`p-4 rounded-2xl border-2 font-black text-xs flex items-center justify-center gap-2 transition-all ${formData.role === 'staff' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-white text-slate-600 border-slate-100'}`}
                    >
                      <Shield size={16} /> Staff
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, role: 'super_admin'})}
                      className={`p-4 rounded-2xl border-2 font-black text-xs flex items-center justify-center gap-2 transition-all ${formData.role === 'super_admin' ? 'bg-amber-500 text-white border-amber-500 shadow-lg' : 'bg-white text-slate-600 border-slate-100'}`}
                    >
                      <ShieldCheck size={16} /> Super Admin
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <><CheckCircle2 size={20} /> Simpan Pengguna Baru</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
