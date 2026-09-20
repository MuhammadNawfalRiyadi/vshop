// ============================================================================
// LOGIKA WEBSITE — Umumnya tidak perlu diedit, cukup edit js/data.js.
// File ini dipakai bersama oleh index.html, produk.html, dan anggota.html.
// Setiap fungsi hanya dijalankan jika elemen targetnya ada di halaman itu.
// ============================================================================

// --- Nama brand, logo, footer & menu aktif dipasang otomatis dari data.js ---
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("brand-name").textContent = SITE_CONFIG.brandName;
  document.getElementById("brand-logo").innerHTML = SITE_CONFIG.brandLogo;
  document.getElementById("footer-brand-name").textContent = SITE_CONFIG.brandName;
  document.getElementById("footer-copy-brand").textContent = SITE_CONFIG.brandName;
  document.getElementById("footer-logo").innerHTML = SITE_CONFIG.brandLogo;
  document.getElementById("footer-tagline").textContent = SITE_CONFIG.tagline;
  document.getElementById("footer-contact-line").textContent =
    "WhatsApp: " + formatNomor(SITE_CONFIG.whatsappNumber);
  document.getElementById("footer-year").textContent = new Date().getFullYear();

  // Link ikon Instagram di navbar, diambil dari data.js
  var instaLink = document.getElementById("insta-link");
  instaLink.href = "https://instagram.com/" + (SITE_CONFIG.groupInstagram || "");

  // Tandai menu navbar aktif berdasarkan file halaman yang sedang dibuka
  setActiveNav();

  // --- HANYA di index.html (Beranda): hero + section "Kenapa Harus ...?" ---
  if (document.getElementById("hero-img")) {
    document.getElementById("hero-subtitle").textContent = SITE_CONFIG.tagline;

    // Gambar hero sekarang diambil dari SITE_CONFIG.heroImage (bebas nama file),
    // bukan otomatis dari produk pertama lagi.
    var heroImg = document.getElementById("hero-img");
    heroImg.src = SITE_CONFIG.heroImage;
    pasangJagaGambar(heroImg, SITE_CONFIG.brandName);

    document.getElementById("why-brand").textContent = SITE_CONFIG.brandName;

    // Gambar section "Kenapa Harus ...?" diambil dari SITE_CONFIG.whyImage.
    var whyImg = document.getElementById("why-img");
    whyImg.src = SITE_CONFIG.whyImage;
    pasangJagaGambar(whyImg, SITE_CONFIG.brandName);
  }

  // --- HANYA di produk.html: filter + grid produk utama + menu alternatif ---
  if (document.getElementById("product-grid")) {
    setupFilterBar();
    renderProducts(PRODUCTS);
    renderAlternatif();
  }

  // --- HANYA di anggota.html: grid anggota kelompok ---
  if (document.getElementById("team-grid")) {
    renderTeam();
  }

  setupNavigation();
});

// ============================================================================
// NAVBAR — tandai menu aktif berdasarkan nama file halaman
// ============================================================================
// index.html -> "Beranda" aktif; produk.html -> "Produk" aktif; anggota.html -> "Anggota".
function setActiveNav() {
  var namaFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

  var target = "index";
  if (namaFile.indexOf("produk") === 0) target = "produk";
  else if (namaFile.indexOf("anggota") === 0) target = "anggota";

  document.querySelectorAll(".nav-link").forEach(function (link) {
    link.classList.toggle("active", link.getAttribute("href") === target + ".html");
  });
}

// ============================================================================
// FORMAT & LINK
// ============================================================================

// --- Format harga ke Rupiah: 15000 -> "15.000" ---
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID").format(angka);
}

// --- Format nomor WA agar mudah dibaca: 6281234567890 -> 0812-3456-7890 ---
function formatNomor(nomor) {
  var n = nomor.replace(/\D/g, "");
  if (n.length === 12) return "08" + n.slice(2, 5) + "-" + n.slice(5, 9) + "-" + n.slice(9, 12);
  if (n.length === 11) return "08" + n.slice(2, 5) + "-" + n.slice(5, 8) + "-" + n.slice(8, 11);
  return n;
}

// --- Link pesan via WhatsApp ---
function buatLinkWhatsApp(produk) {
  var pesan = "Halo " + SITE_CONFIG.brandName +
    "! Saya mau pesan *" + produk.name + "* seharga Rp " +
    formatRupiah(produk.price) + ". Apakah masih tersedia?";
  return "https://wa.me/" + SITE_CONFIG.whatsappNumber +
    "?text=" + encodeURIComponent(pesan);
}

// --- Placeholder otomatis saat foto produk/anggota belum tersedia ---
function placeholderGambar(label) {
  var huruf = (label || "?").trim().charAt(0).toUpperCase();
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">' +
    '<rect width="600" height="400" fill="#ffe6d5"/>' +
    '<text x="50%" y="50%" font-size="160" text-anchor="middle" ' +
    'dominant-baseline="central" font-family="sans-serif" fill="#ff6b35">' +
    huruf + "</text></svg>";
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function pasangJagaGambar(img, nama) {
  img.addEventListener("error", function () {
    this.onerror = null;
    this.src = placeholderGambar(nama);
    this.classList.add("img-placeholder");
  });
}

// ============================================================================
// PRODUK
// ============================================================================

// --- Tombol filter kategori dibuat otomatis dari data produk ---
function setupFilterBar() {
  var produkUtama = PRODUCTS;

  var daftarKategori = [];
  produkUtama.forEach(function (p) {
    if (daftarKategori.indexOf(p.category) === -1) daftarKategori.push(p.category);
  });

  var bar = document.getElementById("filter-bar");
  // Tombol "Semua" + satu tombol per kategori
  var tombolSemua = buatTombolFilter("Semua", null, true);
  bar.appendChild(tombolSemua);

  daftarKategori.forEach(function (kategori) {
    bar.appendChild(buatTombolFilter(kategori, kategori, false));
  });

  function buatTombolFilter(label, kategori, aktif) {
    var btn = document.createElement("button");
    btn.className = "filter-btn" + (aktif ? " active" : "");
    btn.textContent = label;
    btn.addEventListener("click", function () {
      document.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      var hasil = kategori
        ? produkUtama.filter(function (p) {
            return p.category === kategori;
          })
        : produkUtama;
      renderProducts(hasil);
    });
    return btn;
  }
}

// --- Render kartu produk ke dalam grid ---
function renderProducts(daftar) {
  var grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  daftar.forEach(function (produk) {
    var card = document.createElement("div");
    card.className = "product-card";

    var img = document.createElement("img");
    img.className = "product-img";
    img.src = produk.image;
    img.alt = produk.name;
    img.loading = "lazy";
    pasangJagaGambar(img, produk.name);

    var badge = document.createElement("span");
    badge.className = "product-category";
    badge.textContent = produk.category;

    var body = document.createElement("div");
    body.className = "product-body";

    var nama = document.createElement("h3");
    nama.className = "product-name";
    nama.textContent = produk.name;

    var harga = document.createElement("p");
    harga.className = "product-price";
    harga.textContent = "Rp " + formatRupiah(produk.price);

    var deskripsi;
    if (produk.desc) {
      deskripsi = document.createElement("p");
      deskripsi.className = "product-desc";
      deskripsi.textContent = produk.desc;
    }

    var btn = document.createElement("a");
    btn.className = "btn btn-primary btn-order";
    btn.href = buatLinkWhatsApp(produk);
    btn.target = "_blank";
    btn.rel = "noopener";
    btn.innerHTML = ikonWA() + " Pesan Sekarang";

    body.appendChild(nama);
    body.appendChild(harga);
    if (deskripsi) body.appendChild(deskripsi);
    body.appendChild(btn);
    card.appendChild(img);
    card.appendChild(badge);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

// --- Ikon WhatsApp kecil yang dipakai tombol "Pesan Sekarang" ---
function ikonWA() {
  return (
    '<svg class="wa-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.21 5.1 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.44 9.44 0 0 1-4.81-1.32l-.35-.2-3.57.94.95-3.48-.23-.36a9.42 9.42 0 0 1-1.45-5.04C2.57 6.28 6.81 2.03 12.05 2.03c2.57 0 4.98 1 6.8 2.82a9.55 9.55 0 0 1 2.82 6.8c0 5.24-4.25 9.5-9.48 9.5zm8.4-17.7A11.37 11.37 0 0 0 12.04 0C5.5 0 .18 5.32.18 11.87c0 2.09.55 4.13 1.59 5.93L.06 24l6.4-1.68a11.9 11.9 0 0 0 5.59 1.42h.01c6.55 0 11.87-5.32 11.87-11.87 0-3.17-1.24-6.16-3.48-8.4z"/>' +
    "</svg>"
  );
}

// ============================================================================
// MENU ALTERNATIF (PLAN B)
// ============================================================================
// Produk dengan isAlternatif: true dirender sebagai kartu kecil horizontal.
function renderAlternatif() {
  var grid = document.getElementById("alt-grid");
  grid.innerHTML = "";

  var daftar = PRODUCTS.filter(function (p) {
    return p.isAlternatif;
  });

  daftar.forEach(function (produk) {
    var card = document.createElement("div");
    card.className = "alt-card";

    var img = document.createElement("img");
    img.className = "alt-img";
    img.src = produk.image;
    img.alt = produk.name;
    img.loading = "lazy";
    pasangJagaGambar(img, produk.name);

    var body = document.createElement("div");
    body.className = "alt-body";

    var nama = document.createElement("h3");
    nama.className = "alt-name";
    nama.textContent = produk.name;

    var harga = document.createElement("p");
    harga.className = "alt-price";
    harga.textContent = "Rp " + formatRupiah(produk.price);

    var btn = document.createElement("a");
    btn.className = "alt-btn";
    btn.href = buatLinkWhatsApp(produk);
    btn.target = "_blank";
    btn.rel = "noopener";
    btn.innerHTML = ikonWA() + " Pesan Sekarang";

    body.appendChild(nama);
    body.appendChild(harga);
    body.appendChild(btn);

    card.appendChild(img);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

// ============================================================================
// ANGGOTA KELOMPOK
// ============================================================================
function renderTeam() {
  var grid = document.getElementById("team-grid");

  TEAM.forEach(function (anggota) {
    var card = document.createElement("div");
    card.className = "team-card";

    var img = document.createElement("img");
    img.className = "team-img";
    img.src = anggota.photo;
    img.alt = anggota.name;
    img.loading = "lazy";
    pasangJagaGambar(img, anggota.name);

    var body = document.createElement("div");
    body.className = "team-body";

    var nama = document.createElement("h3");
    nama.className = "team-name";
    nama.textContent = anggota.name;

    var role = document.createElement("span");
    role.className = "team-role";
    role.textContent = anggota.role;

    body.appendChild(nama);
    body.appendChild(role);

    if (anggota.kelas) {
      var kelas = document.createElement("p");
      kelas.className = "team-kelas";
      kelas.textContent = anggota.kelas;
      body.appendChild(kelas);
    }

    if (anggota.instagram) {
      var igWrap = document.createElement("a");
      igWrap.className = "team-ig";
      igWrap.href = "https://instagram.com/" + anggota.instagram;
      igWrap.target = "_blank";
      igWrap.rel = "noopener";
      igWrap.setAttribute("aria-label", "Instagram @" + anggota.instagram);
      igWrap.innerHTML =
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M12 2.16c3.2 0 3.58 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16m0-2.16C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.87 5.87 0 0 0-2.13 1.38A5.87 5.87 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.8.72 1.47 1.38 2.13a5.87 5.87 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.87 5.87 0 0 0 2.13-1.38 5.87 5.87 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.87 5.87 0 0 0-1.38-2.13A5.87 5.87 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.6a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/>' +
        "</svg>" +
        '<span class="team-ig-text">@' + anggota.instagram + "</span>";
      body.appendChild(igWrap);
    }

    card.appendChild(img);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

// ============================================================================
// NAVBAR (menu mobile + bayangan saat scroll)
// ============================================================================
function setupNavigation() {
  var hamburger = document.getElementById("hamburger");
  var navMenu = document.getElementById("nav-menu");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("open");
    navMenu.classList.toggle("open");
  });

  // Tutup menu mobile setelah mengeklik tautan
  navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("open");
      navMenu.classList.remove("open");
    });
  });

  // Bayangan navbar setelah digulir (menu aktif sudah ditangani setActiveNav)
  var navbar = document.getElementById("navbar");
  window.addEventListener("scroll", function () {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  });
}