import { createClient } from '@supabase/supabase-js';

// Konfigurasi Supabase
export const supabaseUrl = 'https://hmgewuxwbygyplmrceqa.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtZ2V3dXh3YnlneXBsbXJjZXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NDQxMTIsImV4cCI6MjA4NDIyMDExMn0.6qCF5Ww9eopV1xXG2vi1B5qZqj4KR8x3CCMM4gVf9iM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* 
  --------------------------------------------------------------------------------------
  PENTING: JALANKAN SQL DI BAWAH INI DI SQL EDITOR SUPABASE ANDA!
  Ini akan memperbaiki error "Could not find column berkebutuhan_khusus_ayah" dll.
  --------------------------------------------------------------------------------------

  -- 1. Tambahkan kolom untuk Data Ayah
  ALTER TABLE registrations 
  ADD COLUMN IF NOT EXISTS pendidikan_ayah TEXT,
  ADD COLUMN IF NOT EXISTS pekerjaan_ayah TEXT,
  ADD COLUMN IF NOT EXISTS penghasilan_ayah TEXT,
  ADD COLUMN IF NOT EXISTS berkebutuhan_khusus_ayah TEXT;

  -- 2. Tambahkan kolom untuk Data Ibu
  ALTER TABLE registrations 
  ADD COLUMN IF NOT EXISTS pendidikan_ibu TEXT,
  ADD COLUMN IF NOT EXISTS pekerjaan_ibu TEXT,
  ADD COLUMN IF NOT EXISTS penghasilan_ibu TEXT,
  ADD COLUMN IF NOT EXISTS berkebutuhan_khusus_ibu TEXT;

  -- 3. Tambahkan kolom untuk Data Wali
  ALTER TABLE registrations 
  ADD COLUMN IF NOT EXISTS nama_wali TEXT,
  ADD COLUMN IF NOT EXISTS pendidikan_wali TEXT,
  ADD COLUMN IF NOT EXISTS pekerjaan_wali TEXT,
  ADD COLUMN IF NOT EXISTS penghasilan_wali TEXT;

  -- 4. Tambahkan kolom pendukung lainnya (jika belum ada)
  ALTER TABLE registrations 
  ADD COLUMN IF NOT EXISTS kewarganegaraan TEXT DEFAULT 'WNI',
  ADD COLUMN IF NOT EXISTS negara_wna TEXT,
  ADD COLUMN IF NOT EXISTS kabupaten TEXT,
  ADD COLUMN IF NOT EXISTS provinsi TEXT,
  ADD COLUMN IF NOT EXISTS tempat_tinggal TEXT,
  ADD COLUMN IF NOT EXISTS transportasi_lainnya TEXT,
  ADD COLUMN IF NOT EXISTS jarak_km TEXT,
  ADD COLUMN IF NOT EXISTS waktu_jam TEXT,
  ADD COLUMN IF NOT EXISTS waktu_menit TEXT,
  ADD COLUMN IF NOT EXISTS jumlah_saudara TEXT,
  ADD COLUMN IF NOT EXISTS anak_ke TEXT,
  ADD COLUMN IF NOT EXISTS penerima_kip TEXT,
  ADD COLUMN IF NOT EXISTS no_kip TEXT,
  ADD COLUMN IF NOT EXISTS ukuran_seragam TEXT;

  --------------------------------------------------------------------------------------
  OPSI RESET TOTAL (Gunakan jika ALTER di atas terasa rumit):
  Hapus tabel lama dan buat ulang dengan skema lengkap berikut.
  (PERINGATAN: SEMUA DATA PENDAFTAR LAMA AKAN TERHAPUS!)
  
  DROP TABLE IF EXISTS registrations;
  CREATE TABLE registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    submitted_at TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'pending',
    jurusan TEXT,
    ukuran_seragam TEXT,
    nama_lengkap TEXT,
    jenis_kelamin TEXT,
    nisn TEXT UNIQUE,
    nik TEXT,
    no_kk TEXT,
    no_akta TEXT,
    tempat_lahir TEXT,
    tanggal_lahir DATE,
    agama TEXT,
    kewarganegaraan TEXT DEFAULT 'WNI',
    negara_wna TEXT,
    berkebutuhan_khusus TEXT,
    alamat_jalan TEXT,
    rt TEXT,
    rw TEXT,
    dusun TEXT,
    kelurahan TEXT,
    kecamatan TEXT,
    kabupaten TEXT,
    provinsi TEXT,
    kode_pos TEXT,
    lintang TEXT,
    bujur TEXT,
    tempat_tinggal TEXT,
    transportasi TEXT,
    transportasi_lainnya TEXT,
    anak_ke TEXT,
    penerima_kip TEXT,
    no_kip TEXT,
    nama_ayah TEXT,
    nik_ayah TEXT,
    tahun_lahir_ayah TEXT,
    pendidikan_ayah TEXT,
    pekerjaan_ayah TEXT,
    penghasilan_ayah TEXT,
    berkebutuhan_khusus_ayah TEXT,
    nama_ibu TEXT,
    nik_ibu TEXT,
    tahun_lahir_ibu TEXT,
    pendidikan_ibu TEXT,
    pekerjaan_ibu TEXT,
    penghasilan_ibu TEXT,
    berkebutuhan_khusus_ibu TEXT,
    nama_wali TEXT,
    pendidikan_wali TEXT,
    pekerjaan_wali TEXT,
    penghasilan_wali TEXT,
    no_hp TEXT,
    email TEXT,
    tinggi_badan TEXT,
    berat_badan TEXT,
    lingkar_kepala TEXT,
    jarak_km TEXT,
    waktu_jam TEXT,
    waktu_menit TEXT,
    jumlah_saudara TEXT
  );
*/