
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase.ts';
import { 
  Save, 
  Image as ImageIcon, 
  Palette, 
  Type, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Database,
  Terminal,
  Copy,
  Check
} from 'lucide-react';

interface MajorConfig {
  code: string;
  name: string;
  description: string;
  logo_url: string;
  color_hex: string;
}

const MajorSettings: React.FC = () => {
  const [configs, setConfigs] = useState<MajorConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [tableMissing, setTableMissing] = useState(false);
  const [copied, setCopied] = useState(false);

  const SQL_SETUP = `-- Jalankan ini di SQL Editor Supabase
CREATE TABLE IF NOT EXISTS major_settings (
  code TEXT PRIMARY KEY,
  name TEXT,
  description TEXT,
  logo_url TEXT,
  color_hex TEXT DEFAULT '#10b981'
);

INSERT INTO major_settings (code, name, description, color_hex)
VALUES 
('DKV', 'Desain Komunikasi Visual', 'Mengembangkan kreativitas di bidang desain grafis, multimedia, fotografi, dan komunikasi visual.', '#8b5cf6'),
('TKR', 'Teknik Kendaraan Ringan', 'Mendalami kompetensi teknisi otomotif profesional khusus kendaraan roda empat.', '#3b82f6')
ON CONFLICT (code) DO NOTHING;`;

  const fetchConfigs = async () => {
    setLoading(true);
    setTableMissing(false);
    setMsg(null);
    try {
      const { data, error } = await supabase.from('major_settings').select('*').order('code');
      
      if (error) {
        // Error code 42P01 berarti tabel tidak ditemukan
        if (error.code === '42P01' || error.message.includes('major_settings')) {
          setTableMissing(true);
          throw new Error("Tabel 'major_settings' belum ada.");
        }
        throw error;
      }
      
      if (!data || data.length === 0) {
        setTableMissing(true);
      } else {
        setConfigs(data);
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      if (!tableMissing) {
        setMsg({ type: 'error', text: 'Gagal memuat data jurusan. Cek koneksi atau database.' });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SQL_SETUP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdate = async (code: string) => {
    const config = configs.find(c => c.code === code);
    if (!config) return;

    setIsSaving(code);
    setMsg(null);

    try {
      const { error } = await supabase
        .from('major_settings')
        .update({
          name: config.name,
          description: config.description,
          logo_url: config.logo_url,
          color_hex: config.color_hex
        })
        .eq('code', code);

      if (error) throw error;
      setMsg({ type: 'success', text: `Berhasil memperbarui logo & data ${code}!` });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setIsSaving(null);
    }
  };

  const updateLocalState = (code: string, field: keyof MajorConfig, value: string) => {
    setConfigs(prev => prev.map(c => c.code === code ? { ...c, [field]: value } : c));
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
        <div className="bg-rose-50 border-2 border-rose-100 p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex items-start gap-6">
            <div className="bg-rose-100 p-4 rounded-2xl text-rose-600 shadow-sm">
              <Database size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-rose-900 uppercase tracking-tight mb-2">Setup Tabel Jurusan Diperlukan</h3>
              <p className="text-sm text-rose-700 font-medium leading-relaxed">
                Tabel <code className="bg-white px-2 py-0.5 rounded border">major_settings</code> tidak ditemukan di database Anda. 
                Sistem tidak dapat memuat data logo dan deskripsi jurusan tanpa tabel ini.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4 text-xs font-bold text-rose-800">
              <span className="bg-rose-200 w-6 h-6 rounded-full flex items-center justify-center">1</span>
              Buka Dashboard Supabase Anda &gt; Pilih Project &gt; Menu SQL Editor
            </div>
            
            <div className="relative group">
              <div className="absolute -top-3 left-6 bg-slate-900 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest z-10 flex items-center gap-2">
                <Terminal size={10} /> SQL Editor Script
              </div>
              <pre className="bg-slate-950 text-emerald-400 p-8 rounded-3xl font-mono text-[10px] overflow-x-auto shadow-2xl border border-slate-800 pt-10">
                {SQL_SETUP}
              </pre>
              <button 
                onClick={handleCopySQL}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl transition-all backdrop-blur-md border border-white/10 flex items-center gap-2 text-[10px] font-bold uppercase"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? 'Tersalin' : 'Salin SQL'}
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-rose-800">
              <span className="bg-rose-200 w-6 h-6 rounded-full flex items-center justify-center">2</span>
              Tempel kode SQL di atas dan klik tombol "Run" di Supabase.
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={fetchConfigs}
                className="bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-2xl font-black flex items-center gap-3 shadow-xl transition-all active:scale-95 uppercase text-xs tracking-widest"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Sudah Saya Jalankan, Muat Ulang
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Pengaturan Visual Jurusan</h3>
          <p className="text-sm text-slate-500 font-medium">Ubah logo (URL), warna tema, dan deskripsi jurusan yang tampil di beranda.</p>
        </div>
        <button onClick={fetchConfigs} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 transition-all shadow-sm">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top duration-300 ${msg.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
          {msg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-xs font-bold">{msg.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {configs.map((major) => (
          <div key={major.code} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-500">
            <div className="p-8 bg-slate-950 text-white flex justify-between items-center relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg" style={{ backgroundColor: major.color_hex }}>
                  {major.code}
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight text-lg">{major.name}</h4>
                  <p className="text-[10px] text-emerald-400 uppercase tracking-[0.2em] font-black">Major System Identity</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8 flex-1">
              {/* Logo Preview */}
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Logo & Ikon Jurusan</label>
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 group-hover:bg-white transition-all">
                  <div className="w-24 h-24 bg-white rounded-3xl shadow-md border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                    {major.logo_url ? (
                      <img src={major.logo_url} alt="Logo" className="w-full h-full object-contain p-2" onError={(e) => { (e.target as any).src = 'https://placehold.co/200x200?text=Invalid+URL'; }} />
                    ) : (
                      <div className="text-center p-2">
                        <ImageIcon className="text-slate-200 mx-auto mb-1" size={32} />
                        <span className="text-[8px] font-black text-slate-300 uppercase">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        value={major.logo_url || ''} 
                        onChange={(e) => updateLocalState(major.code, 'logo_url', e.target.value)}
                        placeholder="https://imgur.com/logo-anda.png"
                        className="w-full pl-10 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-xs outline-none focus:border-emerald-500 font-medium shadow-inner"
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 mt-2 font-medium italic">* Gunakan URL gambar langsung (akhiri dengan .png atau .jpg)</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Panjang Program</label>
                  <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={major.name} 
                      onChange={(e) => updateLocalState(major.code, 'name', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm outline-none font-bold focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Warna Identitas</label>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Palette className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={major.color_hex} 
                        onChange={(e) => updateLocalState(major.code, 'color_hex', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-mono font-black outline-none"
                        maxLength={7}
                      />
                    </div>
                    <input 
                      type="color" 
                      value={major.color_hex} 
                      onChange={(e) => updateLocalState(major.code, 'color_hex', e.target.value)}
                      className="w-16 h-14 rounded-2xl cursor-pointer border-none bg-transparent p-0 overflow-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Deskripsi Jurusan</label>
                  <textarea 
                    value={major.description} 
                    onChange={(e) => updateLocalState(major.code, 'description', e.target.value)}
                    rows={4}
                    className="w-full p-6 bg-slate-50 border-none rounded-[2rem] text-sm font-medium outline-none resize-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Tuliskan keunggulan jurusan ini..."
                  />
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 mt-auto">
              <button 
                onClick={() => handleUpdate(major.code)}
                disabled={isSaving === major.code}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50 active:scale-95 group"
              >
                {isSaving === major.code ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <Save size={20} className="group-hover:rotate-12 transition-transform" /> 
                    Simpan Konfigurasi {major.code}
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MajorSettings;
