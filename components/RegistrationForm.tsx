
import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle, ArrowRight, ArrowLeft, Loader2, User, Home, FileText, Printer, Globe, Bus, Users, Heart, ClipboardList, AlertTriangle, X } from 'lucide-react';
import { supabase } from '../services/supabase.ts';

const RegistrationForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // A. Data Pribadi
    jurusan: '',
    ukuran_seragam: '',
    nama_lengkap: '',
    jenis_kelamin: '',
    nisn: '',
    nik: '',
    no_kk: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    no_akta: '',
    agama: '',
    kewarganegaraan: 'WNI',
    negara_wna: '',
    berkebutuhan_khusus: [] as string[],
    
    // B. Alamat
    alamat_jalan: '',
    rt: '',
    rw: '',
    dusun: '',
    kelurahan: '',
    kecamatan: '',
    kabupaten: '',
    provinsi: '',
    kode_pos: '',
    lintang: '',
    bujur: '',
    tempat_tinggal: '',
    transportasi: '',
    transportasi_lainnya: '',
    anak_ke: '',
    penerima_kip: '',
    no_kip: '',

    // Data Orang Tua & Wali
    nama_ayah: '', nik_ayah: '', tahun_lahir_ayah: '', pendidikan_ayah: '', pekerjaan_ayah: '', penghasilan_ayah: '', khusus_ayah: 'Tidak',
    nama_ibu: '', nik_ibu: '', tahun_lahir_ibu: '', pendidikan_ibu: '', pekerjaan_ibu: '', penghasilan_ibu: '', khusus_ibu: 'Tidak',
    nama_wali: '', nik_wali: '', tahun_lahir_wali: '', pendidikan_wali: '', pekerjaan_wali: '', penghasilan_wali: '',
    
    // Kontak
    telp_rumah: '',
    no_hp: '',
    email: '',

    // Data Periodik
    tinggi_badan: '',
    berat_badan: '',
    lingkar_kepala: '',
    jarak_sekolah: '', 
    jarak_km: '',
    waktu_jam: '',
    waktu_menit: '',
    jumlah_saudara: ''
  });

  // Clear error message after some time or when changing input
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg(null);
  };

  const validateStep = (currentStep: number) => {
    const missing: string[] = [];
    
    if (currentStep === 1) {
      if (!formData.ukuran_seragam) missing.push("Ukuran Seragam");
      if (!formData.nama_lengkap) missing.push("Nama Lengkap");
      if (!formData.jenis_kelamin) missing.push("Jenis Kelamin");
      if (!formData.jurusan) missing.push("Jurusan");
      if (!formData.nisn) missing.push("NISN");
      if (!formData.nik) missing.push("NIK");
      if (!formData.no_kk) missing.push("No. KK");
      if (!formData.no_akta) missing.push("No. Akta Lahir");
    } else if (currentStep === 2) {
      if (!formData.tempat_lahir) missing.push("Tempat Lahir");
      if (!formData.tanggal_lahir) missing.push("Tanggal Lahir");
      if (!formData.agama) missing.push("Agama");
    } else if (currentStep === 3) {
      if (!formData.alamat_jalan) missing.push("Alamat Jalan");
      if (!formData.rt || !formData.rw) missing.push("RT/RW");
      if (!formData.kelurahan) missing.push("Kelurahan");
      if (!formData.kecamatan) missing.push("Kecamatan");
      if (!formData.kabupaten) missing.push("Kabupaten/Kota");
      if (!formData.provinsi) missing.push("Provinsi");
      if (!formData.kode_pos) missing.push("Kode Pos");
      if (!formData.tempat_tinggal) missing.push("Tempat Tinggal");
      if (!formData.transportasi) missing.push("Transportasi");
    } else if (currentStep === 4) {
      if (!formData.nama_ayah) missing.push("Nama Ayah");
      if (!formData.nik_ayah) missing.push("NIK Ayah");
      if (!formData.tahun_lahir_ayah) missing.push("Thn Lahir Ayah");
      if (!formData.nama_ibu) missing.push("Nama Ibu");
      if (!formData.nik_ibu) missing.push("NIK Ibu");
      if (!formData.tahun_lahir_ibu) missing.push("Thn Lahir Ibu");
    } else if (currentStep === 5) {
      if (!formData.tinggi_badan) missing.push("Tinggi Badan");
      if (!formData.berat_badan) missing.push("Berat Badan");
      if (!formData.lingkar_kepala) missing.push("Lingkar Kepala");
      if (!formData.jarak_km) missing.push("Jarak (km)");
      if (!formData.waktu_jam || !formData.waktu_menit) missing.push("Waktu Tempuh");
      if (!formData.jumlah_saudara) missing.push("Jumlah Saudara");
      if (!formData.no_hp) missing.push("No. WhatsApp");
      if (!formData.email) missing.push("Email");
    }

    if (missing.length > 0) {
      setErrorMsg(`⚠️ Harap lengkapi: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? '...' : ''}`);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          lintang: position.coords.latitude.toString(),
          bujur: position.coords.longitude.toString()
        }));
      }, () => {
        setErrorMsg("Gagal mengambil lokasi. Silakan isi alamat manual.");
      });
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const content = `<html><head><title>Bukti SPMB - ${formData.nama_lengkap}</title><style>body{font-family:sans-serif;padding:40px;line-height:1.6}h1{border-bottom:2px solid #000}table{width:100%;margin-top:20px}td{padding:8px;border-bottom:1px solid #eee}</style></head><body><h1>BIODATA PENDAFTAR SPMB</h1><table><tr><td>Nama</td><td>: <b>${formData.nama_lengkap}</b></td></tr><tr><td>NISN</td><td>: ${formData.nisn}</td></tr><tr><td>Jurusan</td><td>: ${formData.jurusan}</td></tr><tr><td>WhatsApp</td><td>: ${formData.no_hp}</td></tr></table><p style="margin-top:40px">Dicetak pada: ${new Date().toLocaleString()}</p><script>window.print()</script></body></html>`;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;
    
    setIsSubmitting(true);
    try {
      // VALIDASI DUPLIKASI: Cek apakah NISN sudah terdaftar
      const { data: existing, error: checkError } = await supabase
        .from('registrations')
        .select('id')
        .eq('nisn', formData.nisn)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        setErrorMsg("❌ Pendaftaran Gagal! NISN ini (" + formData.nisn + ") sudah terdaftar sebelumnya. Anda hanya diperbolehkan mendaftar satu kali di sistem SPMB.");
        setIsSubmitting(false);
        setStep(1); 
        return;
      }

      const { error } = await supabase
        .from('registrations')
        .insert([
          { 
            ...formData, 
            berkebutuhan_khusus: formData.berkebutuhan_khusus.join(','),
            submitted_at: new Date().toISOString() 
          }
        ]);

      if (error) throw error;
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      setErrorMsg("Gagal menyimpan pendaftaran: " + (error.message || "Masalah koneksi database."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-emerald-100 text-center animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border-4 border-emerald-50">
          <CheckCircle size={56} />
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Pendaftaran SPMB Sukses!</h3>
        <p className="text-slate-500 mb-10 max-w-lg mx-auto font-medium leading-relaxed">Selamat! Anda sudah resmi terdaftar di sistem SPMB. Anda tidak dapat melakukan pendaftaran ulang dengan NISN yang sama.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button onClick={handlePrint} className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-slate-200 hover:bg-black transition-all active:scale-95">
            <Printer size={20} /> Cetak Bukti Pendaftaran
          </button>
          <button onClick={() => window.location.reload()} className="w-full sm:w-auto bg-white border border-slate-200 text-slate-600 px-10 py-5 rounded-2xl font-black hover:bg-slate-50 transition-all">
            Halaman Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden relative">
      <div className="bg-slate-950 p-8 md:p-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500/20">
          <div className="h-full bg-emerald-500 transition-all duration-700 ease-out shadow-[0_0_10px_#10b981]" style={{ width: `${(step / 6) * 100}%` }}></div>
        </div>
        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-3">Sistem SPMB Terintegrasi 2025</div>
        <h2 className="text-2xl md:text-3xl font-black leading-tight uppercase tracking-tight">Seleksi Penerimaan Murid Baru</h2>
        <div className="flex justify-center gap-3 mt-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'bg-emerald-500 w-16' : step > i ? 'bg-emerald-800 w-8' : 'bg-white/10 w-8'}`}></div>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="mx-6 md:mx-10 mt-8 bg-rose-50 border border-rose-100 p-6 rounded-3xl flex items-start gap-4 animate-in slide-in-from-top duration-300 shadow-sm ring-1 ring-rose-200">
           <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={28} />
           <div className="flex-1">
              <p className="text-sm font-black text-rose-800 leading-tight uppercase tracking-wide">Pendaftaran SPMB Gagal</p>
              <p className="text-xs font-bold text-rose-600 mt-1 leading-relaxed">{errorMsg}</p>
           </div>
           <button onClick={() => setErrorMsg(null)} className="text-rose-300 hover:text-rose-500 transition-colors p-1">
              <X size={20} />
           </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 md:p-12">
        {step === 1 && (
          <div className="space-y-10 animate-in slide-in-from-right duration-300">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pilih Ukuran Seragam Sekolah <span className="text-rose-500">*</span></label>
              <div className="flex flex-wrap gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button key={size} type="button" onClick={() => setFormData(prev => ({ ...prev, ukuran_seragam: size }))} className={`px-8 py-4 rounded-2xl font-black border-2 transition-all text-sm ${formData.ukuran_seragam === size ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-100 scale-105' : 'bg-white text-slate-600 border-slate-100'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-xs font-black text-emerald-600 flex items-center gap-3 uppercase tracking-widest border-b border-emerald-100 pb-3"><User size={20} /> 1. Identitas Calon Murid</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">Nama Lengkap Sesuai Ijazah <span className="text-rose-500">*</span></label>
                  <input type="text" name="nama_lengkap" required value={formData.nama_lengkap} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 outline-none font-black text-base transition-all focus:border-emerald-500" placeholder="Contoh: DZAKIR KHAFADI NUGRAHA" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">Nomor NISN (10 Digit) <span className="text-rose-500">*</span></label>
                  <input type="text" name="nisn" required value={formData.nisn} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black tracking-widest" maxLength={10} placeholder="0012345678" />
                  <p className="text-[9px] text-slate-400 mt-2 italic">* NISN digunakan untuk validasi pendaftaran tunggal di sistem SPMB.</p>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">NIK / No. KTP <span className="text-rose-500">*</span></label>
                  <input type="text" name="nik" required value={formData.nik} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black tracking-widest" maxLength={16} placeholder="3603..." />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">No. Kartu Keluarga (KK) <span className="text-rose-500">*</span></label>
                  <input type="text" name="no_kk" required value={formData.no_kk} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black tracking-widest" maxLength={16} placeholder="3603..." />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">No. Registrasi Akta Lahir <span className="text-rose-500">*</span></label>
                  <input type="text" name="no_akta" required value={formData.no_akta} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black" placeholder="Contoh: 1234/567/2008" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">Jenis Kelamin <span className="text-rose-500">*</span></label>
                  <select name="jenis_kelamin" required value={formData.jenis_kelamin} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black outline-none appearance-none">
                    <option value="">-- Pilih --</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">Jurusan Pilihan <span className="text-rose-500">*</span></label>
                  <select name="jurusan" required value={formData.jurusan} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black outline-none appearance-none">
                    <option value="">-- Pilih Jurusan --</option>
                    <option value="DKV">DKV - Desain Komunikasi Visual</option>
                    <option value="TKR">TKR - Teknik Kendaraan Ringan</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-6">
              <button type="button" onClick={handleNext} className="bg-emerald-600 text-white px-12 py-5 rounded-3xl font-black flex items-center gap-3 hover:bg-emerald-700 shadow-2xl shadow-emerald-100 active:scale-95 group transition-all">
                Lanjut Tahap 2 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-in slide-in-from-right duration-300">
            <h4 className="text-xs font-black text-emerald-600 flex items-center gap-3 uppercase tracking-widest border-b border-emerald-100 pb-3"><Globe size={20} /> 2. Tempat & Tanggal Lahir</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">Tempat Lahir <span className="text-rose-500">*</span></label>
                <input type="text" name="tempat_lahir" required value={formData.tempat_lahir} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black" placeholder="Kota / Kabupaten" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">Tanggal Lahir <span className="text-rose-500">*</span></label>
                <input type="date" name="tanggal_lahir" required value={formData.tanggal_lahir} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">Agama <span className="text-rose-500">*</span></label>
                <select name="agama" required value={formData.agama} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black outline-none">
                  <option value="">-- Pilih Agama --</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between pt-6">
              <button type="button" onClick={() => setStep(prev => prev - 1)} className="text-slate-400 px-8 py-5 font-black flex items-center gap-3 hover:text-slate-900 transition-colors"> <ArrowLeft size={20} /> Kembali</button>
              <button type="button" onClick={handleNext} className="bg-emerald-600 text-white px-12 py-5 rounded-3xl font-black flex items-center gap-3 hover:bg-emerald-700 shadow-xl shadow-emerald-100 active:scale-95 group">Lanjut Tahap 3 <ArrowRight size={20} /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-in slide-in-from-right duration-300">
            <h4 className="text-xs font-black text-emerald-600 flex items-center gap-3 uppercase tracking-widest border-b border-emerald-100 pb-3"><Home size={20} /> 3. Alamat Lengkap</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">Alamat Jalan <span className="text-rose-500">*</span></label>
                <input type="text" name="alamat_jalan" required value={formData.alamat_jalan} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">RT <span className="text-rose-500">*</span></label><input type="text" name="rt" required value={formData.rt} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-black" /></div>
                <div><label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">RW <span className="text-rose-500">*</span></label><input type="text" name="rw" required value={formData.rw} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-black" /></div>
              </div>
              <div><label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">Kelurahan <span className="text-rose-500">*</span></label><input type="text" name="kelurahan" required value={formData.kelurahan} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black" /></div>
              <div><label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">Kecamatan <span className="text-rose-500">*</span></label><input type="text" name="kecamatan" required value={formData.kecamatan} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black" /></div>
              <div><label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">Kabupaten/Kota <span className="text-rose-500">*</span></label><input type="text" name="kabupaten" required value={formData.kabupaten} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black" placeholder="Contoh: Kab. Tangerang" /></div>
              <div><label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">Provinsi <span className="text-rose-500">*</span></label><input type="text" name="provinsi" required value={formData.provinsi} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black" placeholder="Contoh: Banten" /></div>
              <div><label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">Kode Pos <span className="text-rose-500">*</span></label><input type="text" name="kode_pos" required value={formData.kode_pos} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black" /></div>
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">Moda Transportasi <span className="text-rose-500">*</span></label>
                <select name="transportasi" required value={formData.transportasi} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black outline-none">
                  <option value="">-- Pilih --</option>
                  <option value="Jalan kaki">Jalan kaki</option>
                  <option value="Motor">Motor</option>
                  <option value="Mobil">Mobil</option>
                  <option value="Angkutan Umum">Angkutan Umum</option>
                </select>
              </div>
            </div>
            <div className="bg-emerald-50 p-6 rounded-3xl flex items-center justify-between border-2 border-emerald-100">
              <div className="flex items-center gap-4">
                 <div className="bg-white p-3 rounded-2xl text-emerald-600 shadow-sm"><MapPin size={24}/></div>
                 <div className="text-[10px] font-black text-emerald-700 tracking-widest uppercase">Pinpoint Lokasi Rumah (GPS)</div>
              </div>
              <button type="button" onClick={handleGeolocation} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black shadow-lg hover:bg-black transition-all"> Ambil Kordinat</button>
            </div>
            <div className="flex justify-between pt-6">
              <button type="button" onClick={() => setStep(prev => prev - 1)} className="text-slate-400 px-8 py-5 font-black flex items-center gap-3 hover:text-slate-900 transition-colors"> <ArrowLeft size={20} /> Kembali</button>
              <button type="button" onClick={handleNext} className="bg-emerald-600 text-white px-12 py-5 rounded-3xl font-black flex items-center gap-3 hover:bg-emerald-700 shadow-xl shadow-emerald-100 active:scale-95 group">Lanjut Tahap 4 <ArrowRight size={20} /></button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-12 animate-in slide-in-from-right duration-300">
            <h4 className="text-xs font-black text-emerald-600 flex items-center gap-3 uppercase tracking-widest border-b border-emerald-100 pb-3"><Users size={20} /> 4. Data Orang Tua</h4>
            <div className="bg-slate-50 p-8 rounded-[2.5rem] space-y-8 border-2 border-slate-100 shadow-sm">
              <div className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] border-l-4 border-emerald-500 pl-4">DATA AYAH KANDUNG</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2"><label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-wide">Nama Ayah <span className="text-rose-500">*</span></label><input type="text" name="nama_ayah" required value={formData.nama_ayah} onChange={handleChange} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black" /></div>
                <div><label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-wide">NIK Ayah <span className="text-rose-500">*</span></label><input type="text" name="nik_ayah" required value={formData.nik_ayah} onChange={handleChange} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black tracking-widest" maxLength={16} /></div>
                <div><label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-wide">Tahun Lahir <span className="text-rose-500">*</span></label><input type="text" name="tahun_lahir_ayah" required value={formData.tahun_lahir_ayah} onChange={handleChange} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black" /></div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2.5rem] space-y-8 border-2 border-slate-100 shadow-sm">
              <div className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] border-l-4 border-emerald-500 pl-4">DATA IBU KANDUNG</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2"><label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-wide">Nama Ibu <span className="text-rose-500">*</span></label><input type="text" name="nama_ibu" required value={formData.nama_ibu} onChange={handleChange} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black" /></div>
                <div><label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-wide">NIK Ibu <span className="text-rose-500">*</span></label><input type="text" name="nik_ibu" required value={formData.nik_ibu} onChange={handleChange} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black tracking-widest" maxLength={16} /></div>
                <div><label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-wide">Tahun Lahir <span className="text-rose-500">*</span></label><input type="text" name="tahun_lahir_ibu" required value={formData.tahun_lahir_ibu} onChange={handleChange} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black" /></div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <button type="button" onClick={() => setStep(prev => prev - 1)} className="text-slate-400 px-8 py-5 font-black flex items-center gap-3 hover:text-slate-900 transition-colors"> <ArrowLeft size={20} /> Kembali</button>
              <button type="button" onClick={handleNext} className="bg-emerald-600 text-white px-12 py-5 rounded-3xl font-black flex items-center gap-3 hover:bg-emerald-700 shadow-xl shadow-emerald-100 active:scale-95 group">Lanjut Tahap 5 <ArrowRight size={20} /></button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-10 animate-in slide-in-from-right duration-300">
            <h4 className="text-xs font-black text-emerald-600 flex items-center gap-3 uppercase tracking-widest border-b border-emerald-100 pb-3"><Heart size={20} /> 5. Data Fisik & Kontak Aktif</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 shadow-inner">
              <div><label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Tinggi (cm) <span className="text-rose-500">*</span></label><input type="number" name="tinggi_badan" required value={formData.tinggi_badan} onChange={handleChange} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 text-lg font-black text-emerald-600" /></div>
              <div><label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Berat (kg) <span className="text-rose-500">*</span></label><input type="number" name="berat_badan" required value={formData.berat_badan} onChange={handleChange} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 text-lg font-black text-emerald-600" /></div>
              <div><label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Lingkar Kepala <span className="text-rose-500">*</span></label><input type="number" name="lingkar_kepala" required value={formData.lingkar_kepala} onChange={handleChange} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 text-lg font-black" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900 p-10 rounded-[3rem] shadow-2xl">
               <div>
                 <label className="block text-[10px] font-black text-emerald-400 mb-3 uppercase tracking-widest">WhatsApp <span className="text-rose-400">*</span></label>
                 <input type="text" name="no_hp" required value={formData.no_hp} onChange={handleChange} className="w-full bg-white/10 border-2 border-white/10 rounded-2xl px-8 py-6 text-xl font-black text-white outline-none focus:border-emerald-500 transition-all" placeholder="08..." />
               </div>
               <div>
                 <label className="block text-[10px] font-black text-emerald-400 mb-3 uppercase tracking-widest">Email <span className="text-rose-400">*</span></label>
                 <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-white/10 border-2 border-white/10 rounded-2xl px-8 py-6 text-xl font-black text-white outline-none focus:border-emerald-500 transition-all" placeholder="nama@email.com" />
               </div>
            </div>
            <div className="flex justify-between pt-6">
              <button type="button" onClick={() => setStep(prev => prev - 1)} className="text-slate-400 px-8 py-5 font-black flex items-center gap-3 hover:text-slate-900 transition-colors"> <ArrowLeft size={20} /> Kembali</button>
              <button type="button" onClick={handleNext} className="bg-emerald-600 text-white px-12 py-5 rounded-3xl font-black flex items-center gap-3 hover:bg-emerald-700 shadow-xl shadow-emerald-100 active:scale-95">Tinjau Data SPMB <ArrowRight size={20} /></button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="text-center py-12 space-y-10 animate-in fade-in duration-700">
            <div className="w-28 h-28 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border-2 border-emerald-100">
               <ClipboardList size={48} />
            </div>
            <div>
               <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Kirim Sekarang?</h4>
               <p className="text-slate-500 font-bold mt-3 leading-relaxed">Sistem akan mengecek apakah NISN <b>{formData.nisn}</b> sudah pernah mendaftar di sistem SPMB.<br/>Jika sudah, pendaftaran ini akan ditolak otomatis oleh sistem.</p>
            </div>
            <div className="bg-slate-50 p-10 rounded-[3.5rem] border-2 border-slate-100 text-left space-y-4 max-w-2xl mx-auto">
               <div className="flex justify-between border-b pb-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Pendaftar</span><span className="font-black text-slate-900">{formData.nama_lengkap}</span></div>
               <div className="flex justify-between border-b pb-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NISN</span><span className="font-black text-slate-900 tracking-widest">{formData.nisn}</span></div>
               <div className="flex justify-between border-b pb-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</span><span className="font-black text-emerald-700">{formData.no_hp}</span></div>
            </div>
            <div className="flex justify-between pt-12 border-t-2 border-slate-100 mt-12">
              <button type="button" onClick={() => setStep(prev => prev - 1)} className="text-slate-400 px-8 py-5 font-black flex items-center gap-3 hover:text-slate-900 transition-colors"> <ArrowLeft size={20} /> Edit Lagi</button>
              <button type="submit" disabled={isSubmitting} className="bg-emerald-600 text-white px-16 py-6 rounded-[2.5rem] font-black flex items-center gap-4 hover:bg-emerald-700 disabled:opacity-50 shadow-2xl shadow-emerald-200 transition-all active:scale-95">
                {isSubmitting ? <><Loader2 className="animate-spin" size={28} /> Memeriksa Data...</> : 'Konfirmasi Pendaftaran SPMB'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegistrationForm;
