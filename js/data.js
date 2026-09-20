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
  tagline: "Menu lezat dan hemat untuk semua orang.",

  // Akun Instagram toko/kelompok untuk ikon Instagram di navbar.
  // Tulis username TANPA "@". Jika dikosongkan "", ikon menuju ke halaman utama Instagram.
  groupInstagram: "vshop.pkk",

  // Nomor WhatsApp admin tujuan pesanan.
  // Format: kode negara tanpa "+" / tanpa "0". Contoh: 6281234567890
  whatsappNumber: "6285219969078",

  // Gambar khusus untuk halaman Beranda (taruh file-nya di folder img/, nama bebas).
  heroImage: "img/produk.png",     // gambar besar di sisi kanan hero
  whyImage: "img/memasak.jpeg",    // gambar di section "Kenapa Harus ...?"
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
    name: "Nasi Goreng Spesial",
    category: "Makanan",
    price: 15000,
    image: "img/nasi-goreng.jpg",
    desc: "Nasi goreng dengan topping ayam dan telur, gurih mantap.",
  },
  {
    id: 2,
    name: "Ayam Geprek",
    category: "Makanan",
    price: 12000,
    image: "img/ayam-geprek.jpg",
    desc: "Ayam goreng krispi disiram sambal pedas yang nampol.",
  },
  {
    id: 3,
    name: "Sate Ayam",
    category: "Makanan",
    price: 18000,
    image: "img/sate-ayam.jpg",
    desc: "Sate ayam empuk dengan bumbu kacang yang kaya rasa.",
  },
  {
    id: 4,
    name: "Bakso Sapi",
    category: "Makanan",
    price: 13000,
    image: "img/bakso-sapi.jpg",
    desc: "Bakso sapi kenyal dengan kuah kaldu yang hangat.",
  },
  {
    id: 5,
    name: "Es Teh Manis",
    category: "Minuman",
    price: 5000,
    image: "img/es-teh.jpg",
    desc: "Teh manis dingin yang menyegarkan setiap tegukan.",
  },
  {
    id: 6,
    name: "Es Jeruk Segar",
    category: "Minuman",
    price: 7000,
    image: "img/es-jeruk.jpg",
    desc: "Perasan jeruk asli dengan rasa asam manis segar.",
  },
  {
    id: 7,
    name: "Cappuccino",
    category: "Minuman",
    price: 10000,
    image: "img/cappuccino.jpg",
    desc: "Kopi lembut dengan buih susu yang creamy.",
  },
  {
    id: 8,
    name: "Jus Alpukat",
    category: "Minuman",
    price: 9000,
    image: "img/jus-alpukat.jpg",
    desc: "Jus alpukat kental manis, nikmat dan mengenyangkan.",
  },
  // Produk dengan isAlternatif: true masuk ke section "Menu Alternatif (Plan B)",
  // dirender sebagai kartu kecil horizontal di bawah grid produk utama.
  {
    id: 9,
    name: "Kentang Goreng",
    category: "Makanan",
    price: 10000,
    image: "img/kentang-goreng.jpg",
    desc: "Kentang goreng renyah dengan taburan garam dan bumbu.",
    isAlternatif: true,
  },
  {
    id: 10,
    name: "Es Kopi Susu",
    category: "Minuman",
    price: 12000,
    image: "img/es-kopi-susu.jpg",
    desc: "Es kopi susu kekinian yang creamy dan segar.",
    isAlternatif: true,
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
    role: "Admin Bandar",
    photo: "img/kevin.jpeg",
    instagram: "kenricok",
    kelas: "XII RPL 1",
  },
  {
    name: "Muhammad Nawfal Riyadi",
    role: "Web Developer & Programmer",
    photo: "img/nawfal.jpeg",
    instagram: "nawfalwkwkwk",
    kelas: "XII RPL 1",
  },
  {
    name: "Muhammad Rasya Noor Fajri",
    role: "Backend Developer & Programmer",
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
    role: "Anggota / Sales",
    photo: "img/ariq.jpeg",
    instagram: "fz.riiq.izzddn.",
    kelas: "XII RPL 1",
  },
];

// ============================================================================
// (Selesai — bagian bawah ini tidak perlu diubah)
// ============================================================================