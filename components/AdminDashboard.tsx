import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase.ts';
import { 
  Search, 
  Trash2, 
  Eye, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  X,
  AlertCircle,
  MapPin,
  Home,
  Users as UsersIcon,
  Phone,
  Download,
  PieChart,
  BarChart3,
  Heart,
  Globe,
  Briefcase,
  GraduationCap,
  Calendar,
  Settings,
  ShieldAlert,
  Sliders,
  Mail,
  Scale,
  Ruler,
  Navigation,
  Timer,
  CreditCard,
  Hash,
  Info,
  Edit3,
  Save,
  ChevronLeft
} from 'lucide-react';
import UserManagement from './UserManagement.tsx';
import MajorSettings from './MajorSettings.tsx';

interface Registration {
  id: string;
  submitted_at: string;
  jurusan: string;
  ukuran_seragam: string;
  nama_lengkap: string;
  jenis_kelamin: string;
  nisn: string;
  nik: string;
  no_kk: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  no_akta: string;
  agama: string;
  kewarganegaraan: string;
  negara_wna: string;
  berkebutuhan_khusus: string;
  alamat_jalan: string;
  rt: string;
  rw: string;
  dusun: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kode_pos: string;
  lintang: string;
  bujur: string;
  tempat_tinggal: string;
  transportasi: string;
  transportasi_lainnya: string;
  anak_ke: string;
  penerima_kip: string;
  no_kip: string;
  nama_ayah: string;
  nik_ayah: string;
  tahun_lahir_ayah: string;
  pendidikan_ayah: string;
  pekerjaan_ayah: string;
  penghasilan_ayah: string;
  berkebutuhan_khusus_ayah: string;
  nama_ibu: string;
  nik_ibu: string;
  tahun_lahir_ibu: string;
  pendidikan_ibu: string;
  pekerjaan_ibu: string;
  penghasilan_ibu: string;
  berkebutuhan_khusus_ibu: string;
  nama_wali: string;
  pendidikan_wali: string;
  pekerjaan_wali: string;
  penghasilan_wali: string;
  no_hp: string;
  email: string;
  tinggi_badan: string;
  berat_badan: string;
  lingkar_kepala: string;
  jarak_km: string;
  waktu_jam: string;
  waktu_menit: string;
  jumlah_saudara: string;
  status: string;
  [key: string]: any;
}

interface AdminDashboardProps {
  adminProfile: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminProfile }) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [activeTab, setActiveTab] = useState<'registrations' | 'users' | 'settings'>('registrations');
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Registration | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error: any) {
      console.error('Error fetching:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const stats = {
    total: registrations.length,
    dkv: registrations.filter(r => r.jurusan === 'DKV').length,
    tkr: registrations.filter(r => r.jurusan === 'TKR').length,
    approved: registrations.filter(r => r.status === 'approved').length
  };

  const exportToCSV = () => {
    if (registrations.length === 0) return;
    const headers = Object.keys(registrations[0]).join(',');
    const rows = registrations.map(reg => {
      return Object.values(reg).map(val => `"${val}"`).join(',');
    }).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_SPMB_SMKMA_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      if (selectedReg?.id === id) setSelectedReg({ ...selectedReg, status: newStatus });
    } catch (error: any) {
      alert("Gagal update status: " + error.message);
    }
  };

  const deleteRegistration = async (id: string) => {
    if (adminProfile?.role !== 'super_admin') {
      alert("Hanya Super Admin yang dapat menghapus data.");
      return;
    }

    if (!window.confirm("PERINGATAN: Data pendaftar ini akan dihapus secara permanen dari database SPMB. Lanjutkan?")) return;
    
    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRegistrations(prev => prev.filter(r => r.id !== id));
      if (selectedReg?.id === id) setSelectedReg(null);
      
      alert("Data berhasil dihapus dari sistem SPMB.");
    } catch (error: any) {
      console.error("Delete error:", error);
      alert("Gagal menghapus data: " + (error.message || "Pastikan koneksi internet stabil."));
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editFormData) {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  const handleSaveEdit = async () => {
    if (!editFormData || !selectedReg) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('registrations')
        .update(editFormData)
        .eq('id', selectedReg.id);

      if (error) throw error;

      // Update local state
      setRegistrations(prev => prev.map(r => r.id === selectedReg.id ? editFormData : r));
      setSelectedReg(editFormData);
      setIsEditing(false);
      alert("Data pendaftar berhasil diperbarui!");
    } catch (error: any) {
      alert("Gagal menyimpan perubahan: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredData = registrations.filter(r => 
    r.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
    r.nisn?.includes(search)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit"><CheckCircle size={10}/> DITERIMA</span>;
      case 'rejected':
        return <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit"><XCircle size={10}/> DITOLAK</span>;
      default:
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit"><Clock size={10}/> PENDING</span>;
    }
  };

  const formatDate = (isoDate: string) => {
    if (!isoDate) return '-';
    return new Date(isoDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 w-fit shadow-sm overflow-x-auto">
        <button 
          onClick={() => setActiveTab('registrations')}
          className={`px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'registrations' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <UsersIcon size={16} /> Data Pendaftar
        </button>
        
        {adminProfile?.role === 'super_admin' && (
          <>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <ShieldAlert size={16} /> Manajemen User
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Sliders size={16} /> Pengaturan Jurusan
            </button>
          </>
        )}
      </div>

      {activeTab === 'registrations' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Pendaftar SPMB" value={stats.total} icon={<UsersIcon size={20} />} color="emerald" />
            <StatsCard title="Peminat DKV" value={stats.dkv} icon={<PieChart size={20} />} color="purple" />
            <StatsCard title="Peminat TKR" value={stats.tkr} icon={<BarChart3 size={20} />} color="blue" />
            <StatsCard title="Siswa Diterima" value={stats.approved} icon={<CheckCircle size={20} />} color="emerald" />
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Cari Nama atau NISN pendaftar..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-medium shadow-sm"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={exportToCSV}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-95"
              >
                <Download size={16} /> Export CSV
              </button>
              <button 
                onClick={() => { setRefreshing(true); fetchRegistrations(); }}
                className="p-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              >
                <RefreshCw size={20} className={refreshing ? 'animate-spin text-emerald-600' : ''} />
              </button>
            </div>
          </div>

          {!loading && (
            <div className="flex items-center justify-between px-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Menampilkan <span className="text-emerald-600">{filteredData.length}</span> dari <span className="text-slate-900">{registrations.length}</span> pendaftar
              </p>
            </div>
          )}

          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest w-12 text-center">No.</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Calon Murid</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Jurusan</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tgl Daftar</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <RefreshCw className="animate-spin text-emerald-600" size={32} />
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat Data SPMB...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <div className="max-w-xs mx-auto space-y-3">
                          <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                            <Search size={32} />
                          </div>
                          <p className="text-sm font-bold text-slate-400">Pendaftar tidak ditemukan.</p>
                          <p className="text-xs text-slate-400">Coba kata kunci lain atau periksa NISN pendaftar.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((reg, index) => (
                      <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-5 text-center text-xs font-black text-slate-400 group-hover:text-emerald-600 transition-colors">
                          {index + 1}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600 font-black text-xs uppercase shadow-sm">
                              {reg.nama_lengkap?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 leading-tight text-sm uppercase tracking-tight">{reg.nama_lengkap}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">NISN: {reg.nisn}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg tracking-widest ${reg.jurusan === 'DKV' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {reg.jurusan}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Calendar size={12} className="text-slate-300"/> {formatDate(reg.submitted_at)}</p>
                        </td>
                        <td className="px-6 py-5">{getStatusBadge(reg.status)}</td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => { setSelectedReg(reg); setIsEditing(false); }} 
                              className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 rounded-xl transition-all shadow-sm active:scale-95" 
                              title="Lihat Detail Pendaftar"
                            >
                              <Eye size={18} />
                            </button>
                            {adminProfile?.role === 'super_admin' && (
                              <button 
                                onClick={() => deleteRegistration(reg.id)} 
                                className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 rounded-xl transition-all shadow-sm active:scale-95" 
                                title="Hapus Data"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && adminProfile?.role === 'super_admin' && (
        <UserManagement />
      )}

      {activeTab === 'settings' && adminProfile?.role === 'super_admin' && (
        <MajorSettings />
      )}

      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-hidden">
          <div className="bg-white w-full max-w-6xl max-h-[95vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300 border border-white/20">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-950 text-white relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_#10b981]"></div>
              <div className="flex items-center gap-4">
                 <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-900/20">
                   {isEditing ? <Edit3 size={24} /> : <User size={24} />}
                 </div>
                 <div>
                    <h3 className="font-black text-lg md:text-xl leading-tight uppercase tracking-tight">
                      {isEditing ? `Edit: ${selectedReg.nama_lengkap}` : selectedReg.nama_lengkap}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5">
                       <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black tracking-widest border border-emerald-500/30">{selectedReg.jurusan}</span>
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1"><Hash size={10} /> NISN: {selectedReg.nisn}</span>
                    </div>
                 </div>
              </div>
              <button 
                onClick={() => { setSelectedReg(null); setIsEditing(false); }} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 bg-slate-50/40">
               {/* Quick Info Bar */}
               {!isEditing && (
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-100 p-4 rounded-[2rem] flex items-center gap-4 shadow-sm">
                       <div className="bg-emerald-50 p-2.5 rounded-2xl text-emerald-600"><Calendar size={20}/></div>
                       <div><p className="text-[9px] font-black text-slate-400 uppercase">Tgl Daftar</p><p className="text-xs font-black text-slate-800">{new Date(selectedReg.submitted_at).toLocaleDateString('id-ID')}</p></div>
                    </div>
                    <div className="bg-white border border-slate-100 p-4 rounded-[2rem] flex items-center gap-4 shadow-sm">
                       <div className="bg-emerald-50 p-2.5 rounded-2xl text-emerald-600"><Clock size={20}/></div>
                       <div><p className="text-[9px] font-black text-slate-400 uppercase">Waktu</p><p className="text-xs font-black text-slate-800">{new Date(selectedReg.submitted_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p></div>
                    </div>
                    <div className="bg-white border border-slate-100 p-4 rounded-[2rem] flex items-center gap-4 shadow-sm">
                       <div className="bg-emerald-50 p-2.5 rounded-2xl text-emerald-600"><Info size={20}/></div>
                       <div><p className="text-[9px] font-black text-slate-400 uppercase">Status</p><p className="text-xs font-black text-slate-800 uppercase">{selectedReg.status}</p></div>
                    </div>
                    <div className="bg-white border border-slate-100 p-4 rounded-[2rem] flex items-center gap-4 shadow-sm">
                       <div className="bg-emerald-50 p-2.5 rounded-2xl text-emerald-600"><Scale size={20}/></div>
                       <div><p className="text-[9px] font-black text-slate-400 uppercase">Seragam</p><p className="text-xs font-black text-slate-800 uppercase">{selectedReg.ukuran_seragam}</p></div>
                    </div>
                 </div>
               )}

               {/* Section A: Main Form */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-emerald-100 pb-3">
                    <User className="text-emerald-600" size={18}/>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">A. FORMULIR PENDAFTARAN UTAMA (DATA 1-25)</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isEditing ? (
                      <>
                        <EditInput label="Nama Lengkap" name="nama_lengkap" value={editFormData?.nama_lengkap} onChange={handleEditChange} />
                        <EditSelect label="Jenis Kelamin" name="jenis_kelamin" value={editFormData?.jenis_kelamin} onChange={handleEditChange} options={[{v:'L',l:'Laki-laki'},{v:'P',l:'Perempuan'}]} />
                        <EditInput label="NISN" name="nisn" value={editFormData?.nisn} onChange={handleEditChange} />
                        <EditInput label="NIK" name="nik" value={editFormData?.nik} onChange={handleEditChange} />
                        <EditInput label="No KK" name="no_kk" value={editFormData?.no_kk} onChange={handleEditChange} />
                        <EditInput label="Tempat Lahir" name="tempat_lahir" value={editFormData?.tempat_lahir} onChange={handleEditChange} />
                        <EditInput label="Tanggal Lahir" name="tanggal_lahir" type="date" value={editFormData?.tanggal_lahir} onChange={handleEditChange} />
                        <EditInput label="No Registrasi Akta" name="no_akta" value={editFormData?.no_akta} onChange={handleEditChange} />
                        <EditSelect label="Agama" name="agama" value={editFormData?.agama} onChange={handleEditChange} options={['Islam','Kristen','Katolik','Hindu','Buddha'].map(a=>({v:a,l:a}))} />
                        <EditSelect label="Kewarganegaraan" name="kewarganegaraan" value={editFormData?.kewarganegaraan} onChange={handleEditChange} options={[{v:'WNI',l:'WNI'},{v:'Asing',l:'Asing'}]} />
                        <EditInput label="Negara WNA" name="negara_wna" value={editFormData?.negara_wna} onChange={handleEditChange} />
                        <EditInput label="Kebutuhan Khusus" name="berkebutuhan_khusus" value={editFormData?.berkebutuhan_khusus} onChange={handleEditChange} />
                        <EditInput label="Alamat Jalan" name="alamat_jalan" value={editFormData?.alamat_jalan} onChange={handleEditChange} />
                        <EditInput label="RT" name="rt" value={editFormData?.rt} onChange={handleEditChange} />
                        <EditInput label="RW" name="rw" value={editFormData?.rw} onChange={handleEditChange} />
                        <EditInput label="Dusun" name="dusun" value={editFormData?.dusun} onChange={handleEditChange} />
                        <EditInput label="Kelurahan" name="kelurahan" value={editFormData?.kelurahan} onChange={handleEditChange} />
                        <EditInput label="Kecamatan" name="kecamatan" value={editFormData?.kecamatan} onChange={handleEditChange} />
                        <EditInput label="Kabupaten" name="kabupaten" value={editFormData?.kabupaten} onChange={handleEditChange} />
                        <EditInput label="Provinsi" name="provinsi" value={editFormData?.provinsi} onChange={handleEditChange} />
                        <EditInput label="Kode Pos" name="kode_pos" value={editFormData?.kode_pos} onChange={handleEditChange} />
                        <EditSelect label="Tempat Tinggal" name="tempat_tinggal" value={editFormData?.tempat_tinggal} onChange={handleEditChange} options={['Bersama orang tua','Wali','Kos','Asrama','Panti Asuhan','Lainnya'].map(t=>({v:t,l:t}))} />
                        <EditSelect label="Transportasi" name="transportasi" value={editFormData?.transportasi} onChange={handleEditChange} options={['Jalan kaki','Motor','Mobil','Angkutan Umum'].map(t=>({v:t,l:t}))} />
                        <EditInput label="Anak Ke-" name="anak_ke" type="number" value={editFormData?.anak_ke} onChange={handleEditChange} />
                        <EditSelect label="Punya KIP" name="penerima_kip" value={editFormData?.penerima_kip} onChange={handleEditChange} options={[{v:'Tidak',l:'Tidak'},{v:'Ya',l:'Ya'}]} />
                        <EditInput label="No KIP" name="no_kip" value={editFormData?.no_kip} onChange={handleEditChange} />
                        <EditSelect label="Jurusan" name="jurusan" value={editFormData?.jurusan} onChange={handleEditChange} options={[{v:'DKV',l:'DKV'},{v:'TKR',l:'TKR'}]} />
                        <EditSelect label="Ukuran Seragam" name="ukuran_seragam" value={editFormData?.ukuran_seragam} onChange={handleEditChange} options={['S','M','L','XL','XXL'].map(s=>({v:s,l:s}))} />
                      </>
                    ) : (
                      <>
                        <DetailItem num="1" label="Nama Lengkap" value={selectedReg.nama_lengkap} />
                        <DetailItem num="2" label="Jenis Kelamin" value={selectedReg.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
                        <DetailItem num="3" label="NISN" value={selectedReg.nisn} />
                        <DetailItem num="4" label="NIK" value={selectedReg.nik} />
                        <DetailItem num="5" label="No KK" value={selectedReg.no_kk} />
                        <DetailItem num="6" label="Tempat Lahir" value={selectedReg.tempat_lahir} />
                        <DetailItem num="7" label="Tanggal Lahir" value={selectedReg.tanggal_lahir} />
                        <DetailItem num="8" label="No Registrasi Akta Lahir" value={selectedReg.no_akta} />
                        <DetailItem num="9" label="Agama & Kepercayaan" value={selectedReg.agama} />
                        <DetailItem num="10" label="Kewarganegaraan" value={`${selectedReg.kewarganegaraan} ${selectedReg.negara_wna ? '('+selectedReg.negara_wna+')' : ''}`} />
                        <DetailItem num="11" label="Kebutuhan Khusus Calon Murid" value={selectedReg.berkebutuhan_khusus} />
                        <DetailItem num="12" label="Alamat Jalan" value={selectedReg.alamat_jalan} />
                        <DetailItem num="13" label="RT" value={selectedReg.rt} />
                        <DetailItem num="14" label="RW" value={selectedReg.rw} />
                        <DetailItem num="15" label="Dusun" value={selectedReg.dusun || '-'} />
                        <DetailItem num="16" label="Kelurahan/Desa" value={selectedReg.kelurahan} />
                        <DetailItem num="17" label="Kecamatan" value={selectedReg.kecamatan} />
                        <DetailItem num="18" label="Kode Pos" value={selectedReg.kode_pos} />
                        <DetailItem num="19" label="Lintang" value={selectedReg.lintang} />
                        <DetailItem num="20" label="Bujur" value={selectedReg.bujur} />
                        <DetailItem num="21" label="Tempat Tinggal" value={selectedReg.tempat_tinggal} />
                        <DetailItem num="22" label="Moda Transportasi" value={`${selectedReg.transportasi} ${selectedReg.transportasi_lainnya ? '('+selectedReg.transportasi_lainnya+')' : ''}`} />
                        <DetailItem num="23" label="Anak Keberapa" value={selectedReg.anak_ke} />
                        <DetailItem num="24" label="Apakah Punya KIP" value={`${selectedReg.penerima_kip} ${selectedReg.no_kip ? '('+selectedReg.no_kip+')' : ''}`} />
                        <DetailItem num="25" label="Jurusan yang dipilih" value={selectedReg.jurusan} className="bg-emerald-50 border-emerald-200" />
                      </>
                    )}
                  </div>
               </div>

               {/* Section B: Parents */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-emerald-100 pb-3">
                    <UsersIcon className="text-emerald-600" size={18}/>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">B. DATA ORANG TUA & WALI</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isEditing ? (
                      <>
                        <EditInput label="Nama Ayah" name="nama_ayah" value={editFormData?.nama_ayah} onChange={handleEditChange} />
                        <EditInput label="NIK Ayah" name="nik_ayah" value={editFormData?.nik_ayah} onChange={handleEditChange} />
                        <EditInput label="Thn Lahir Ayah" name="tahun_lahir_ayah" value={editFormData?.tahun_lahir_ayah} onChange={handleEditChange} />
                        <EditInput label="Pendidikan Ayah" name="pendidikan_ayah" value={editFormData?.pendidikan_ayah} onChange={handleEditChange} />
                        <EditInput label="Pekerjaan Ayah" name="pekerjaan_ayah" value={editFormData?.pekerjaan_ayah} onChange={handleEditChange} />
                        <EditInput label="Penghasilan Ayah" name="penghasilan_ayah" value={editFormData?.penghasilan_ayah} onChange={handleEditChange} />
                        <EditInput label="Keb. Khusus Ayah" name="berkebutuhan_khusus_ayah" value={editFormData?.berkebutuhan_khusus_ayah} onChange={handleEditChange} />
                        
                        <EditInput label="Nama Ibu" name="nama_ibu" value={editFormData?.nama_ibu} onChange={handleEditChange} />
                        <EditInput label="NIK Ibu" name="nik_ibu" value={editFormData?.nik_ibu} onChange={handleEditChange} />
                        <EditInput label="Thn Lahir Ibu" name="tahun_lahir_ibu" value={editFormData?.tahun_lahir_ibu} onChange={handleEditChange} />
                        <EditInput label="Pendidikan Ibu" name="pendidikan_ibu" value={editFormData?.pendidikan_ibu} onChange={handleEditChange} />
                        <EditInput label="Pekerjaan Ibu" name="pekerjaan_ibu" value={editFormData?.pekerjaan_ibu} onChange={handleEditChange} />
                        <EditInput label="Penghasilan Ibu" name="penghasilan_ibu" value={editFormData?.penghasilan_ibu} onChange={handleEditChange} />
                        <EditInput label="Keb. Khusus Ibu" name="berkebutuhan_khusus_ibu" value={editFormData?.berkebutuhan_khusus_ibu} onChange={handleEditChange} />

                        <EditInput label="Nama Wali" name="nama_wali" value={editFormData?.nama_wali} onChange={handleEditChange} />
                        <EditInput label="Pendidikan Wali" name="pendidikan_wali" value={editFormData?.pendidikan_wali} onChange={handleEditChange} />
                        <EditInput label="Pekerjaan Wali" name="pekerjaan_wali" value={editFormData?.pekerjaan_wali} onChange={handleEditChange} />
                        <EditInput label="Penghasilan Wali" name="penghasilan_wali" value={editFormData?.penghasilan_wali} onChange={handleEditChange} />
                      </>
                    ) : (
                      <>
                        <DetailItem num="26" label="Nama Ayah" value={selectedReg.nama_ayah} />
                        <DetailItem num="27" label="NIK Ayah" value={selectedReg.nik_ayah} />
                        <DetailItem num="28" label="Thn Lahir Ayah" value={selectedReg.tahun_lahir_ayah} />
                        <DetailItem num="29" label="Pendidikan Ayah" value={selectedReg.pendidikan_ayah} />
                        <DetailItem num="30" label="Pekerjaan Ayah" value={selectedReg.pekerjaan_ayah} />
                        <DetailItem num="31" label="Penghasilan Ayah" value={selectedReg.penghasilan_ayah} />
                        <DetailItem num="32" label="Keb. Khusus Ayah" value={selectedReg.berkebutuhan_khusus_ayah} />
                        
                        <DetailItem num="33" label="Nama Ibu" value={selectedReg.nama_ibu} />
                        <DetailItem num="34" label="NIK Ibu" value={selectedReg.nik_ibu} />
                        <DetailItem num="35" label="Thn Lahir Ibu" value={selectedReg.tahun_lahir_ibu} />
                        <DetailItem num="36" label="Pendidikan Ibu" value={selectedReg.pendidikan_ibu} />
                        <DetailItem num="37" label="Pekerjaan Ibu" value={selectedReg.pekerjaan_ibu} />
                        <DetailItem num="38" label="Penghasilan Ibu" value={selectedReg.penghasilan_ibu} />
                        <DetailItem num="39" label="Keb. Khusus Ibu" value={selectedReg.berkebutuhan_khusus_ibu} />

                        <DetailItem num="40" label="Nama Wali" value={selectedReg.nama_wali} className="bg-slate-50 border-slate-200" />
                        <DetailItem num="41" label="Pendidikan Wali" value={selectedReg.pendidikan_wali} />
                        <DetailItem num="42" label="Pekerjaan Wali" value={selectedReg.pekerjaan_wali} />
                        <DetailItem num="43" label="Penghasilan Wali" value={selectedReg.penghasilan_wali} />
                      </>
                    )}
                  </div>
               </div>

               {/* Section C: Physical & Contact */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-emerald-100 pb-3">
                    <Heart className="text-emerald-600" size={18}/>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">C. DATA FISIK & KONTAK</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isEditing ? (
                      <>
                        <EditInput label="No. WhatsApp" name="no_hp" value={editFormData?.no_hp} onChange={handleEditChange} />
                        <EditInput label="Email" name="email" type="email" value={editFormData?.email} onChange={handleEditChange} />
                        <EditInput label="Tinggi Badan (cm)" name="tinggi_badan" type="number" value={editFormData?.tinggi_badan} onChange={handleEditChange} />
                        <EditInput label="Berat Badan (kg)" name="berat_badan" type="number" value={editFormData?.berat_badan} onChange={handleEditChange} />
                        <EditInput label="Lingkar Kepala (cm)" name="lingkar_kepala" type="number" value={editFormData?.lingkar_kepala} onChange={handleEditChange} />
                        <EditInput label="Jarak ke Sekolah (km)" name="jarak_km" type="number" value={editFormData?.jarak_km} onChange={handleEditChange} />
                        <EditInput label="Waktu (Jam)" name="waktu_jam" type="number" value={editFormData?.waktu_jam} onChange={handleEditChange} />
                        <EditInput label="Waktu (Menit)" name="waktu_menit" type="number" value={editFormData?.waktu_menit} onChange={handleEditChange} />
                        <EditInput label="Jumlah Saudara" name="jumlah_saudara" type="number" value={editFormData?.jumlah_saudara} onChange={handleEditChange} />
                      </>
                    ) : (
                      <>
                        <DetailItem num="44" label="No. WhatsApp (Kontak)" value={selectedReg.no_hp} />
                        <DetailItem num="45" label="Email" value={selectedReg.email} />
                        <DetailItem num="46" label="Tinggi Badan (cm)" value={selectedReg.tinggi_badan} />
                        <DetailItem num="47" label="Berat Badan (kg)" value={selectedReg.berat_badan} />
                        <DetailItem num="48" label="Lingkar Kepala (cm)" value={selectedReg.lingkar_kepala} />
                        <DetailItem num="49" label="Jarak ke Sekolah (km)" value={selectedReg.jarak_km} />
                        <DetailItem num="50" label="Waktu Tempuh" value={`${selectedReg.waktu_jam}j ${selectedReg.waktu_menit}m`} />
                        <DetailItem num="51" label="Jumlah Saudara" value={selectedReg.jumlah_saudara} />
                      </>
                    )}
                  </div>
               </div>

               {/* GPS Visualization */}
               {!isEditing && (
                 <div className="p-8 bg-slate-950 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"></div>
                    <div className="bg-emerald-600 p-4 rounded-[2rem] text-white shadow-xl">
                      <MapPin size={40} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Verifikasi Titik Lokasi Rumah</p>
                      <h5 className="text-xl font-black text-white tracking-tight">{selectedReg.lintang}, {selectedReg.bujur}</h5>
                      <p className="text-xs text-slate-400 font-medium mt-2 max-w-lg">Pastikan koordinat ini sesuai dengan alamat pendaftar untuk verifikasi jarak tempuh sekolah.</p>
                    </div>
                    <a 
                      href={`https://www.google.com/maps?q=${selectedReg.lintang},${selectedReg.bujur}`} 
                      target="_blank" 
                      className="bg-white text-slate-900 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl active:scale-95 whitespace-nowrap"
                    >
                      Buka Google Maps
                    </a>
                 </div>
               )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 md:p-10 border-t border-slate-100 bg-white flex flex-wrap gap-4 justify-between items-center shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
              {isEditing ? (
                <div className="flex gap-4 w-full justify-between">
                   <button 
                    onClick={() => setIsEditing(false)} 
                    className="bg-white border-2 border-slate-200 text-slate-500 px-10 py-5 rounded-[2rem] text-xs font-black flex items-center gap-3 transition-all hover:bg-slate-50 active:scale-95"
                   >
                     <ChevronLeft size={18} /> Batal / Kembali
                   </button>
                   <button 
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="bg-emerald-600 text-white px-10 py-5 rounded-[2rem] text-xs font-black flex items-center gap-3 transition-all hover:bg-emerald-700 shadow-xl shadow-emerald-200 active:scale-95 disabled:opacity-50"
                   >
                     {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                     Simpan Perubahan
                   </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-4">
                     <button 
                      onClick={() => updateStatus(selectedReg.id, 'approved')} 
                      className={`px-10 py-5 rounded-[2rem] text-xs font-black flex items-center gap-3 transition-all active:scale-95 shadow-xl ${selectedReg.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-200' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200/50'}`}
                     >
                       <CheckCircle size={20} /> {selectedReg.status === 'approved' ? 'DATA TERVERIFIKASI' : 'VERIFIKASI / TERIMA'}
                     </button>
                     <button 
                      onClick={() => updateStatus(selectedReg.id, 'rejected')} 
                      className={`px-10 py-5 rounded-[2rem] text-xs font-black flex items-center gap-3 transition-all active:scale-95 border-2 ${selectedReg.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                     >
                       <XCircle size={20} /> {selectedReg.status === 'rejected' ? 'DITOLAK' : 'TOLAK DATA'}
                     </button>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => { setEditFormData(selectedReg); setIsEditing(true); }}
                      className="bg-slate-900 text-white hover:bg-black px-10 py-5 rounded-[2rem] text-xs font-black flex items-center gap-3 transition-all shadow-xl active:scale-95"
                    >
                      <Edit3 size={18} /> Edit Data
                    </button>
                    <button 
                      onClick={() => {
                        const waLink = `https://wa.me/${selectedReg.no_hp.replace(/^0/, '62')}`;
                        window.open(waLink, '_blank');
                      }}
                      className="bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 px-10 py-5 rounded-[2rem] text-xs font-black flex items-center gap-3 transition-all border-2 border-slate-100"
                    >
                      <Phone size={18} /> WhatsApp
                    </button>
                    {adminProfile?.role === 'super_admin' && (
                      <button 
                        onClick={() => deleteRegistration(selectedReg.id)} 
                        className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-[2rem] transition-all"
                        title="Hapus Permanen"
                      >
                        <Trash2 size={24} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// UI Components
const StatsCard = ({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) => {
  const colors: Record<string, string> = { emerald: "bg-emerald-50 text-emerald-600 border-emerald-100", purple: "bg-purple-50 text-purple-600 border-purple-100", blue: "bg-blue-50 text-blue-600 border-blue-100" };
  return (
    <div className={`p-6 rounded-[2.5rem] border shadow-sm ${colors[color]} flex flex-col gap-2 transition-all hover:shadow-md`}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{title}</span>
        <div className="opacity-50">{icon}</div>
      </div>
      <span className="text-4xl font-black tracking-tight">{value}</span>
    </div>
  );
};

const DetailItem = ({ num, label, value, className }: { num: string, label: string, value: string | null | undefined, className?: string }) => (
  <div className={`bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-1.5 hover:border-emerald-200 transition-all group ${className || ''}`}>
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 leading-none group-hover:bg-emerald-600 group-hover:text-white transition-colors">{num}</span>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
    <p className="text-sm font-black text-slate-900 leading-tight uppercase pl-1">
      {value && value !== '' && value !== 'undefined' && !value.includes('undefined') ? value : <span className="text-slate-300 font-normal italic lowercase tracking-normal">kosong / tidak diisi</span>}
    </p>
  </div>
);

const EditInput = ({ label, name, value, onChange, type = "text" }: { label: string, name: string, value: any, onChange: any, type?: string }) => (
  <div className="bg-white p-5 rounded-[2rem] border-2 border-emerald-100 shadow-sm flex flex-col gap-1.5">
    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{label}</p>
    <input 
      type={type} 
      name={name} 
      value={value || ''} 
      onChange={onChange} 
      className="w-full bg-slate-50 border-none px-4 py-2 rounded-xl text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20" 
    />
  </div>
);

const EditSelect = ({ label, name, value, onChange, options }: { label: string, name: string, value: any, onChange: any, options: {v:string,l:string}[] }) => (
  <div className="bg-white p-5 rounded-[2rem] border-2 border-emerald-100 shadow-sm flex flex-col gap-1.5">
    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{label}</p>
    <select 
      name={name} 
      value={value || ''} 
      onChange={onChange} 
      className="w-full bg-slate-50 border-none px-4 py-2 rounded-xl text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
    >
      <option value="">-- Pilih --</option>
      {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </div>
);

export default AdminDashboard;