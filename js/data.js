// ============================================================================
// DATA WEBSITE — SEMUA data yang mau diganti ada DI SINI.
// Cukup edit file ini, seluruh website (kartu produk, anggota, dsb.) akan
// ikut berubah otomatis. Tidak perlu menyentuh index.html / style.css.
// ============================================================================

// ----------------------------------------------------------------------------
// 1. PENGATURAN UMUM (brand / toko / admin WhatsApp)
// ----------------------------------------------------------------------------
const SITE_CONFIG = {
  brandName: "V-SHOP",           // Nama brand / toko
  brandLogo: '<img src="img/vshop.png" alt="Logo V-Shop">',  // Logo gambar (taruh file di folder img/)
  tagline: "Jajanan Enak dan Murah Untuk Pembeli.",

  // Akun Instagram toko/kelompok untuk ikon Instagram di navbar.
  // Tulis username TANPA "@". Jika dikosongkan "", ikon menuju ke halaman utama Instagram.
  groupInstagram: "xii.rpl_1",

  // Nomor WhatsApp admin tujuan pesanan.
  // Format: kode negara tanpa "+" / tanpa "0". Contoh: 6281234567890
  whatsappNumber: "6285219969078",

  // Gambar khusus untuk halaman Beranda (taruh file-nya di folder img/, nama bebas).
  heroImage: "img/produk.png",     // gambar besar di sisi kanan hero
  whyImage: "img/why.png",    // gambar di section "Kenapa Harus ...?"
};

// ----------------------------------------------------------------------------
// 2. PRODUK
// ----------------------------------------------------------------------------
// - image  : path foto produk (taruh foto di folder img/ ), misal "img/makanan-1.jpg"
//            Jika foto belum tersedia, website otomatis menampilkan placeholder.
// - category: untuk tombol filter. Pakai "Makanan" / "Minuman" / bebas.
// - price  : harga dalam Rupiah (tanpa titik/koma).
const PRODUCTS = [
  {
    id: 1,
    name: "Cireng Bentuk",
    price: 1500,
    image: "img/produk.png",
    desc: "Cireng dengan beragam bentuk dan isi, bisa request bentuk.",
  },
  {
    id: 2,
    name: "Bakso Goreng",
    price: 1500,
    image: "img/produk.png",
    desc: "Bakso goreng, itu aja sih.",
  },
  {
    id: 3,
    name: "Cireng Ayam",
    price: 1500,
    image: "img/produk.png",
    desc: "Cireng isi suwir ayam.",
  },
  {
    id: 4,
    name: "Otak-Otak",
    price: 1500,
    image: "img/produk.png",
    desc: "Otak-otak putih goreng, itu aja sih.",
  },
  {
    id: 5,
    name: "Cireng Krispi",
    price: 1500,
    image: "img/produk.png",
    desc: "Cireng krispi di luar lembut di dalam.",
  },
];

// ----------------------------------------------------------------------------
// 3. ANGGOTA KELOMPOK
// ----------------------------------------------------------------------------
// - photo     : foto anggota (taruh di folder img/ ), misal "img/anggota-1.jpg"
// - instagram : username IG tanpa "@" (kosongkan "" jika tidak punya)
const TEAM = [
  {
    name: "Kevin Kenrico",
    role: "Admin",
    photo: "img/kevin.jpeg",
    instagram: "kenricok",
    kelas: "XII RPL 1",
  },
  {
    name: "Muhammad Nawfal Riyadi",
    role: "Software Engineer",
    photo: "img/nawfal.jpeg",
    instagram: "nawfalwkwkwk",
    kelas: "XII RPL 1",
  },
  {
    name: "Muhammad Rasya Noor Fajri",
    role: "Software Engineer",
    photo: "img/rasya.jpeg",
    instagram: "syaa_nf11",
    kelas: "XII RPL 1",
  },
  {
    name: "Satria Afgansyah Habibullah",
    role: "Marketing",
    photo: "img/afgan.jpeg",
    instagram: "enerledieu8",
    kelas: "XII RPL 1",
  },
  {
    name: "Faaiz Ariiq Izzuddin",
    role: "Sales",
    photo: "img/ariq.jpeg",
    instagram: "fz.riiq.izzddn.",
    kelas: "XII RPL 1",
  },
];

// ============================================================================
// (Selesai — bagian bawah ini tidak perlu diubah)
// ============================================================================