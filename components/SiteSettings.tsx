import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase.ts';
import { 
  Save, 
  ImageIcon, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Database,
  Terminal,
  Copy,
  Check,
  Layout,
  Globe
} from 'lucide-react';

const SiteSettings: React.FC = () => {
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [tableMissing, setTableMissing] = useState(false);
  const [copied, setCopied] = useState(false);

  const SQL_SETUP = `-- 1. Buat Tabel
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- 2. Aktifkan Realtime (SANGAT PENTING)
-- Supabase memerlukan publikasi diaktifkan untuk tabel ini
ALTER PUBLICATION supabase_realtime ADD TABLE site_settings;

-- 3. Masukkan Data Default
INSERT INTO site_settings (key, value)
VALUES ('hero_image_url', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000')
ON CONFLICT (key) DO NOTHING;`;

  const fetchSettings = async () => {
    setLoading(true);
    setTableMissing(false);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'hero_image_url')
        .maybeSingle();
      
      if (error) {
        if (error.code === '42P01') {
          setTableMissing(true);
          throw new Error("Tabel settings belum ada.");
        }
        throw error;
      }
      
      if (!data) {
        setTableMissing(true);
      } else {
        setHeroImageUrl(data.value);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMsg(null);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: 'hero_image_url', value: heroImageUrl });

      if (error) throw error;
      setMsg({ type: 'success', text: 'Gambar beranda berhasil diperbarui secara instan!' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="py-20 flex justify-center items-center flex-col gap-4">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Menghubungkan ke Database...</p>
    </div>
  );

  if (tableMissing) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="bg-amber-50 border-2 border-amber-200 p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex items-start gap-6">
            <div className="bg-amber-100 p-4 rounded-2xl text-amber-600 shadow-sm">
              <Database size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-amber-900 uppercase tracking-tight mb-2">Setup Realtime Diperlukan</h3>
              <p className="text-sm text-amber-700 font-medium leading-relaxed">
                Agar gambar bisa berubah otomatis, silakan jalankan SQL di bawah untuk mengaktifkan tabel dan sistem Realtime Supabase.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="relative group">
              <pre className="bg-slate-950 text-emerald-400 p-8 rounded-3xl font-mono text-[10px] overflow-x-auto border border-slate-800">
                {SQL_SETUP}
              </pre>
              <button 
                onClick={() => { navigator.clipboard.writeText(SQL_SETUP); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl transition-all backdrop-blur-md border border-white/10 flex items-center gap-2 text-[10px] font-bold uppercase"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                Salin SQL
              </button>
            </div>
            <div className="pt-4 flex justify-end">
              <button onClick={fetchSettings} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black flex items-center gap-3 shadow-xl transition-all active:scale-95 uppercase text-xs tracking-widest">
                <RefreshCw size={18} /> Cek Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Pengaturan Visual Situs</h3>
          <p className="text-sm text-slate-500 font-medium">Kelola elemen visual utama yang tampil di halaman depan website secara real-time.</p>
        </div>
        <button onClick={fetchSettings} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 transition-all">
          <RefreshCw size={20} className={isSaving ? 'animate-spin' : ''} />
        </button>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top duration-300 ${msg.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
          {msg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-xs font-bold">{msg.text}</p>
        </div>
      )}

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden group">
        <div className="p-8 bg-slate-950 text-white flex items-center gap-4 relative">
          <div className="bg-emerald-600 p-3 rounded-2xl">
            <Layout size={24} />
          </div>
          <div>
            <h4 className="font-black uppercase tracking-tight">Gambar Utama Beranda (Hero)</h4>
            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Homepage Visual Management</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Live Preview Area */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pratinjau Gambar Saat Ini</label>
            <div className="relative rounded-[2rem] overflow-hidden aspect-video border-4 border-slate-50 shadow-inner group">
              <img 
                src={heroImageUrl || 'https://placehold.co/1200x600?text=URL+Gambar+Kosong'} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Hero Preview"
                onError={(e) => (e.target as any).src = 'https://placehold.co/1200x600?text=URL+Gambar+Tidak+Valid'}
              />
              <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                Preview Mode
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Gambar Baru</label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                <Globe size={18} />
              </div>
              <input 
                type="text" 
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] text-sm font-medium outline-none focus:border-emerald-500 transition-all"
              />
            </div>
            <p className="text-[10px] text-slate-400 italic px-2">
              * Tips: Pastikan Anda menjalankan perintah SQL Setup di atas agar fitur Realtime aktif.
            </p>
          </div>

          <div className="pt-4">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-slate-900 hover:bg-black text-white py-6 rounded-[2rem] font-black flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:opacity-50 group"
            >
              {isSaving ? <Loader2 className="animate-spin" size={24} /> : <><Save size={20} className="group-hover:rotate-12" /> Perbarui Tampilan Beranda</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;