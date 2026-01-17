
import { createClient } from '@supabase/supabase-js';

// Konfigurasi Supabase
export const supabaseUrl = 'https://hmgewuxwbygyplmrceqa.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtZ2V3dXh3YnlneXBsbXJjZXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NDQxMTIsImV4cCI6MjA4NDIyMDExMn0.6qCF5Ww9eopV1xXG2vi1B5qZqj4KR8x3CCMM4gVf9iM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* 
  ------------------------------------------------------------------
  PENTING: JALANKAN SQL DI BAWAH INI DI SQL EDITOR SUPABASE ANDA!
  ------------------------------------------------------------------

-- 1. Tabel Registrasi Pendaftar
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  jurusan TEXT,
  ukuran_seragam TEXT,
  nama_lengkap TEXT,
  jenis_kelamin TEXT,
  nisn TEXT,
  nik TEXT,
  no_kk TEXT,
  tempat_lahir TEXT,
  tanggal_lahir DATE,
  no_akta TEXT,
  agama TEXT,
  berkebutuhan_khusus TEXT,
  alamat_jalan TEXT,
  rt TEXT,
  rw TEXT,
  dusun TEXT,
  kelurahan TEXT,
  kecamatan TEXT,
  kode_pos TEXT,
  lintang TEXT,
  bujur TEXT,
  tempat_tinggal TEXT,
  transportasi TEXT,
  no_kks TEXT,
  anak_ke TEXT,
  penerima_kip TEXT,
  no_kip TEXT,
  nama_ayah TEXT,
  nik_ayah TEXT,
  tahun_lahir_ayah TEXT,
  pendidikan_ayah TEXT,
  pekerjaan_ayah TEXT,
  penghasilan_ayah TEXT,
  khusus_ayah TEXT,
  nama_ibu TEXT,
  nik_ibu TEXT,
  tahun_lahir_ibu TEXT,
  pendidikan_ibu TEXT,
  pekerjaan_ibu TEXT,
  penghasilan_ibu TEXT,
  khusus_ibu TEXT,
  nama_wali TEXT,
  nik_wali TEXT,
  tahun_lahir_wali TEXT,
  pendidikan_wali TEXT,
  pekerjaan_wali TEXT,
  penghasilan_wali TEXT,
  telp_rumah TEXT,
  no_hp TEXT,
  email TEXT,
  tinggi_badan TEXT,
  berat_badan TEXT,
  lingkar_kepala TEXT,
  jarak_sekolah TEXT,
  jarak_km TEXT,
  waktu_jam TEXT,
  waktu_menit TEXT,
  jumlah_saudara TEXT,
  status TEXT DEFAULT 'pending'
);

-- 2. Tabel Manajemen Admin/Staff
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'staff'
);

-- 3. Masukkan Akun Admin Default
INSERT INTO admin_users (username, password, full_name, role) 
VALUES ('admin', 'smkma@2026', 'Administrator Utama', 'super_admin')
ON CONFLICT (username) DO NOTHING;
*/
