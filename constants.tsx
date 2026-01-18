
import { NavItem, Feature, Step } from './types';

export const SCHOOL_NAME = "SMK Mathlaul Anwar Buaranjati";
export const SCHOOL_TAGLINE = "Terampil, Mandiri, dan Berakhlakul Karimah";

export const NAV_ITEMS: NavItem[] = [
  { label: 'Beranda', href: '#home' },
  { label: 'Jurusan', href: '#departments' },
  { label: 'Alur SPMB', href: '#flow' },
  { label: 'Syarat', href: '#requirements' },
  { label: 'Kontak', href: '#contact' },
];

export const FEATURES: Feature[] = [
  {
    title: "Link and Match Industri",
    description: "Kurikulum yang disesuaikan dengan kebutuhan dunia industri dan dunia kerja (DUDI).",
    icon: "ShieldCheck"
  },
  {
    title: "Praktik Kerja Industri",
    description: "Program magang (PKL) di perusahaan-perusahaan terkemuka mitra sekolah.",
    icon: "Users"
  },
  {
    title: "Siap Kerja & Kuliah",
    description: "Membekali siswa untuk langsung bekerja, berwirausaha, atau melanjutkan kuliah.",
    icon: "BookOpen"
  }
];

export const DEPARTMENTS = [
  {
    code: "DKV",
    name: "Desain Komunikasi Visual",
    desc: "Mengembangkan kreativitas di bidang desain grafis, multimedia, fotografi, dan komunikasi visual berbasis teknologi digital."
  },
  {
    code: "TKR",
    name: "Teknik Kendaraan Ringan",
    desc: "Mendalami kompetensi teknisi otomotif profesional khusus kendaraan roda empat, sistem mesin, dan teknologi EFI."
  }
];

export const STEPS: Step[] = [
  {
    id: 1,
    title: "Pendaftaran Online",
    description: "Mengisi formulir dan memilih jurusan yang diminati melalui website."
  },
  {
    id: 2,
    title: "Verifikasi & Tes Bakat",
    description: "Penyerahan berkas fisik dan mengikuti Tes Potensi Kejuruan (TPK)."
  },
  {
    id: 3,
    title: "Tes Wawancara",
    description: "Wawancara kompetensi dan komitmen orang tua/siswa."
  },
  {
    id: 4,
    title: "Pengumuman",
    description: "Hasil seleksi diumumkan secara transparan melalui portal pendaftaran."
  },
  {
    id: 5,
    title: "Daftar Ulang",
    description: "Penyelesaian administrasi dan pengukuran seragam praktik."
  }
];

export const CONTACT_INFO = {
  address: "JL. Raya Mauk Km. 16 Kec. Sukadiri Kab. Tangerang, Banten 15530",
  phone: "0877-6831-2363 / 0856-8654-323",
  email: "spmb@smkma-buaranjati.sch.id",
  hours: "Senin - Sabtu: 08:00 - 13:00 WIB"
};

export const REQUIREMENTS = [
  "Fotokopi Ijazah/SKL & Rapor Terakhir",
  "Fotokopi Kartu Keluarga & Akta Kelahiran",
  "Surat Keterangan Sehat (Tidak Buta Warna untuk DKV)",
  "Pas Foto 3x4 Background Biru (5 Lembar)",
  "Mengisi Formulir Pendaftaran"
];
