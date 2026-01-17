
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
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
  ShieldAlert
} from 'lucide-react';
import UserManagement from './UserManagement';

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
  kode_pos: string;
  lintang: string;
  bujur: string;
  tempat_tinggal: string;
  transportasi: string;
  nama_ayah: string;
  nik_ayah: string;
  tahun_lahir_ayah: string;
  pendidikan_ayah: string;
  pekerjaan_ayah: string;
  penghasilan_ayah: string;
  nama_ibu: string;
  nik_ibu: string;
  tahun_lahir_ibu: string;
  pendidikan_ibu: string;
  pekerjaan_ibu: string;
  penghasilan_ibu: string;
  nama_wali: string;
  nik_wali: string;
  tahun_lahir_wali: string;
  pendidikan_wali: string;
  pekerjaan_wali: string;
  penghasilan_wali: string;
  telp_rumah: string;
  no_hp: string;
  email: string;
  tinggi_badan: string;
  berat_badan: string;
  lingkar_kepala: string;
  jarak_sekolah: string;
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
  const [activeTab, setActiveTab] = useState<'registrations' | 'users'>('registrations');

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

  return (
    <div className="space-y-8 pb-20">
      {/* Sub Navigation Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 w-fit shadow-sm">
        <button 
          onClick={() => setActiveTab('registrations')}
          className={`px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all ${activeTab === 'registrations' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <UsersIcon size={16} /> Data Pendaftar
        </button>
        
        {adminProfile?.role === 'super_admin' && (
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <ShieldAlert size={16} /> Manajemen User
          </button>
        )}
      </div>

      {activeTab === 'registrations' ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Pendaftar SPMB" value={stats.total} icon={<UsersIcon size={20} />} color="emerald" />
            <StatsCard title="Peminat DKV" value={stats.dkv} icon={<PieChart size={20} />} color="purple" />
            <StatsCard title="Peminat TKR" value={stats.tkr} icon={<BarChart3 size={20} />} color="blue" />
            <StatsCard title="Siswa Diterima" value={stats.approved} icon={<CheckCircle size={20} />} color="emerald" />
          </div>

          {/* Search & Actions */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari Nama atau NISN..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={exportToCSV}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-black transition-all active:scale-95 text-xs"
              >
                <Download size={16} /> Export CSV SPMB
              </button>
              <button 
                onClick={() => { setRefreshing(true); fetchRegistrations(); }}
                className="p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
              >
                <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Calon Murid</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Jurusan</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">WhatsApp</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <RefreshCw className="animate-spin text-emerald-600 mx-auto" size={24} />
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        <AlertCircle size={24} className="mx-auto mb-2" />
                        Belum ada data pendaftar SPMB.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 font-bold text-xs uppercase">
                              {reg.nama_lengkap?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight text-sm">{reg.nama_lengkap}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">NISN: {reg.nisn}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded ${reg.jurusan === 'DKV' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {reg.jurusan}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-600">{reg.no_hp}</td>
                        <td className="px-6 py-4">{getStatusBadge(reg.status)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setSelectedReg(reg)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Lihat Detail">
                              <Eye size={18} />
                            </button>
                            {adminProfile?.role === 'super_admin' && (
                              <button onClick={() => deleteRegistration(reg.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Hapus">
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
      ) : (
        adminProfile?.role === 'super_admin' ? <UserManagement /> : <div className="p-10 text-center bg-white rounded-3xl border border-slate-100">Anda tidak memiliki hak akses untuk halaman ini.</div>
      )}

      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300 border border-white/20">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
              <div className="flex items-center gap-4">
                 <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-900/20"><User size={24} /></div>
                 <div>
                    <h3 className="font-black text-lg leading-tight uppercase tracking-tight">{selectedReg.nama_lengkap}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-black tracking-widest">{selectedReg.jurusan}</span>
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">NISN: {selectedReg.nisn}</span>
                    </div>
                 </div>
              </div>
              <button onClick={() => setSelectedReg(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-slate-50/30">
               <div className="space-y-4">
                  <h4 className="text-xs font-black text-emerald-600 uppercase flex items-center gap-2 tracking-widest border-b border-emerald-100 pb-2">
                    <User size={14}/> 1. Identitas Calon Murid (Sistem SPMB)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DetailItem label="Nama Lengkap" value={selectedReg.nama_lengkap} />
                    <DetailItem label="Jenis Kelamin" value={selectedReg.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
                    <DetailItem label="NISN" value={selectedReg.nisn} />
                    <DetailItem label="NIK / No. KITAS" value={selectedReg.nik} />
                    <DetailItem label="No. KK" value={selectedReg.no_kk} />
                    <DetailItem label="Tempat Lahir" value={selectedReg.tempat_lahir} />
                    <DetailItem label="Tanggal Lahir" value={selectedReg.tanggal_lahir} />
                    <DetailItem label="No. Akta Lahir" value={selectedReg.no_akta} />
                    <DetailItem label="Agama" value={selectedReg.agama} />
                    <DetailItem label="Kewarganegaraan" value={`${selectedReg.kewarganegaraan} ${selectedReg.negara_wna ? '('+selectedReg.negara_wna+')' : ''}`} />
                    <DetailItem label="Ukuran Seragam" value={selectedReg.ukuran_seragam} />
                    <div className="md:col-span-2">
                       <DetailItem label="Berkebutuhan Khusus" value={selectedReg.berkebutuhan_khusus || 'Tidak'} />
                    </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-xs font-black text-emerald-600 uppercase flex items-center gap-2 tracking-widest border-b border-emerald-100 pb-2">
                    <Home size={14}/> 2. Alamat & Tempat Tinggal
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                       <DetailItem label="Alamat Jalan" value={selectedReg.alamat_jalan} />
                    </div>
                    <DetailItem label="RT / RW" value={`${selectedReg.rt} / ${selectedReg.rw}`} />
                    <DetailItem label="Dusun" value={selectedReg.dusun || '-'} />
                    <DetailItem label="Kelurahan / Desa" value={selectedReg.kelurahan} />
                    <DetailItem label="Kecamatan" value={selectedReg.kecamatan} />
                    <DetailItem label="Kode Pos" value={selectedReg.kode_pos} />
                    <DetailItem label="Tempat Tinggal" value={selectedReg.tempat_tinggal} />
                    <DetailItem label="Moda Transportasi" value={selectedReg.transportasi} />
                    <div className="md:col-span-2 p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm">
                       <div className="bg-slate-100 p-2 rounded-xl text-slate-500"><MapPin size={20}/></div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Koordinat Geografis</p>
                          <p className="text-sm font-mono font-bold text-slate-700">{selectedReg.lintang}, {selectedReg.bujur}</p>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <h4 className="text-xs font-black text-emerald-600 uppercase flex items-center gap-2 tracking-widest border-b border-emerald-100 pb-2">
                    <UsersIcon size={14}/> 3. Data Orang Tua / Wali
                  </h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-800 uppercase tracking-widest border-l-4 border-emerald-500 pl-2 mb-2">Ayah Kandung</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <DetailItem label="Nama Ayah" value={selectedReg.nama_ayah} />
                           <DetailItem label="NIK Ayah" value={selectedReg.nik_ayah} />
                           <DetailItem label="Tahun Lahir" value={selectedReg.tahun_lahir_ayah} />
                           <DetailItem label="Pendidikan" value={selectedReg.pendidikan_ayah} />
                           <DetailItem label="Pekerjaan" value={selectedReg.pekerjaan_ayah} />
                           <DetailItem label="Penghasilan" value={selectedReg.penghasilan_ayah} />
                        </div>
                     </div>

                     <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-800 uppercase tracking-widest border-l-4 border-emerald-500 pl-2 mb-2">Ibu Kandung</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <DetailItem label="Nama Ibu" value={selectedReg.nama_ibu} />
                           <DetailItem label="NIK Ibu" value={selectedReg.nik_ibu} />
                           <DetailItem label="Tahun Lahir" value={selectedReg.tahun_lahir_ibu} />
                           <DetailItem label="Pendidikan" value={selectedReg.pendidikan_ibu} />
                           <DetailItem label="Pekerjaan" value={selectedReg.pekerjaan_ibu} />
                           <DetailItem label="Penghasilan" value={selectedReg.penghasilan_ibu} />
                        </div>
                     </div>

                     <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-4 lg:col-span-2">
                        <div className="flex items-center gap-2 text-[10px] font-black text-amber-700 uppercase tracking-widest border-l-4 border-amber-500 pl-2 mb-2">Data Wali</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                           <DetailItem label="Nama Wali" value={selectedReg.nama_wali} />
                           <DetailItem label="NIK Wali" value={selectedReg.nik_wali} />
                           <DetailItem label="Tahun Lahir" value={selectedReg.tahun_lahir_wali} />
                           <DetailItem label="Pendidikan" value={selectedReg.pendidikan_wali} />
                           <DetailItem label="Pekerjaan" value={selectedReg.pekerjaan_wali} />
                           <DetailItem label="Penghasilan" value={selectedReg.penghasilan_wali} />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                     <h4 className="text-xs font-black text-emerald-600 uppercase flex items-center gap-2 tracking-widest border-b border-emerald-100 pb-2">
                       <Heart size={14}/> 4. Data Periodik Murid
                     </h4>
                     <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-2 md:grid-cols-3 gap-6">
                        <DetailItem label="Tinggi Badan" value={`${selectedReg.tinggi_badan} cm`} />
                        <DetailItem label="Berat Badan" value={`${selectedReg.berat_badan} kg`} />
                        <DetailItem label="Lingkar Kepala" value={`${selectedReg.lingkar_kepala} cm`} />
                        <DetailItem label="Jarak Sekolah" value={selectedReg.jarak_sekolah} />
                        <DetailItem label="Jarak Exact (Km)" value={`${selectedReg.jarak_km} km`} />
                        <DetailItem label="Waktu Tempuh" value={`${selectedReg.waktu_jam} j ${selectedReg.waktu_menit} m`} />
                        <DetailItem label="Jumlah Saudara" value={`${selectedReg.jumlah_saudara} orang`} />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-xs font-black text-emerald-600 uppercase flex items-center gap-2 tracking-widest border-b border-emerald-100 pb-2">
                       <Phone size={14}/> 5. Kontak Aktif
                     </h4>
                     <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl shadow-slate-200 space-y-4">
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No. WhatsApp</p>
                           <p className="text-lg font-black text-emerald-400">{selectedReg.no_hp}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alamat Email</p>
                           <p className="text-sm font-medium text-slate-200 truncate">{selectedReg.email || '-'}</p>
                        </div>
                        <DetailItem label="Telp. Rumah" value={selectedReg.telp_rumah} />
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-white flex flex-wrap gap-4 justify-between items-center">
              <div className="flex gap-2">
                 <button 
                  onClick={() => updateStatus(selectedReg.id, 'approved')} 
                  className={`px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shadow-lg active:scale-95 ${selectedReg.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'}`}
                 >
                   <CheckCircle size={16} /> {selectedReg.status === 'approved' ? 'DITERIMA' : 'TERIMA SISWA'}
                 </button>
                 <button 
                  onClick={() => updateStatus(selectedReg.id, 'rejected')} 
                  className={`px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all active:scale-95 ${selectedReg.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                 >
                   <XCircle size={16} /> {selectedReg.status === 'rejected' ? 'DITOLAK' : 'TOLAK'}
                 </button>
              </div>
              {adminProfile?.role === 'super_admin' && (
                <button 
                  onClick={() => deleteRegistration(selectedReg.id)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all active:scale-95 border border-rose-100"
                >
                  <Trash2 size={16} /> HAPUS PERMANEN
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatsCard = ({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) => {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
  };
  return (
    <div className={`p-5 rounded-3xl border shadow-sm ${colors[color]} flex flex-col gap-2 transition-all hover:shadow-md`}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{title}</span>
        <div className="opacity-50">{icon}</div>
      </div>
      <span className="text-3xl font-black">{value}</span>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string, value: string | null | undefined }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-black text-slate-800 leading-tight">
      {value && value !== '' && value !== 'undefined' ? value : <span className="text-slate-300 font-normal italic">Tidak diisi</span>}
    </p>
  </div>
);

export default AdminDashboard;
