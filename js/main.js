// ============================================================================
// LOGIKA WEBSITE — Umumnya tidak perlu diedit, cukup edit js/data.js.
// File ini dipakai bersama oleh index.html, produk.html, dan anggota.html.
// Setiap fungsi hanya dijalankan jika elemen targetnya ada di halaman itu.
//
// STRUKTUR MODUL (urutan deklarasi):
//   1. Bootstrap (DOMContentLoaded)
//   2. Navbar
//   3. Format & Link
//   4. Keranjang (Cart State)
//   5. Produk (render kartu)
//   6. Cart Bar (panel bawah)
//   7. Order Modal (form konfirmasi pesanan)  ← fitur baru
//   8. Anggota
//   9. Navigasi mobile
// ============================================================================

// --- Nama brand, logo, footer & menu aktif dipasang otomatis dari data.js ---
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("brand-name").textContent = SITE_CONFIG.brandName;
  document.getElementById("brand-logo").innerHTML = SITE_CONFIG.brandLogo;
  document.getElementById("footer-brand-name").textContent = SITE_CONFIG.brandName;
  document.getElementById("footer-copy-brand").textContent = SITE_CONFIG.brandName;
  document.getElementById("footer-logo").innerHTML = SITE_CONFIG.brandLogo;
  document.getElementById("footer-tagline").textContent = SITE_CONFIG.tagline;
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
    renderProducts(PRODUCTS);
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

// --- Link pesan via WhatsApp (single product, legacy, tidak dipakai lagi) ---
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
// KERANJANG (CART)
// ============================================================================

var _cart = {}; // { produkId: { produk, qty } }

function getCartItems() {
  return Object.values(_cart).filter(function (item) { return item.qty > 0; });
}

function getTotalItems() {
  return getCartItems().reduce(function (sum, item) { return sum + item.qty; }, 0);
}

function getTotalHarga() {
  return getCartItems().reduce(function (sum, item) { return sum + item.produk.price * item.qty; }, 0);
}

function ubahQty(produkId, delta) {
  if (!_cart[produkId]) return;
  var newQty = _cart[produkId].qty + delta;
  if (newQty < 0) newQty = 0;
  if (newQty > 99) newQty = 99;
  _cart[produkId].qty = newQty;
  updateQtyDisplay(produkId);
  updateCartBar();
}

function setQtyDirect(produkId, val) {
  if (!_cart[produkId]) return;
  var str = String(val).replace(/[^0-9]/g, "");
  var num = parseInt(str, 10);
  if (isNaN(num) || num < 0) num = 0;
  if (num > 99) num = 99;
  _cart[produkId].qty = num;
  updateQtyDisplay(produkId);
  updateCartBar();
}

function updateQtyDisplay(produkId) {
  var display = document.getElementById("qty-display-" + produkId);
  var minusBtn = document.getElementById("qty-minus-" + produkId);
  var plusBtn = document.getElementById("qty-plus-" + produkId);
  if (!display) return;
  var qty = _cart[produkId] ? _cart[produkId].qty : 0;
  display.textContent = qty;
  if (minusBtn) minusBtn.disabled = qty <= 0;
  if (plusBtn) plusBtn.disabled = qty >= 99;

  var wrapper = document.getElementById("qty-wrapper-" + produkId);
  if (wrapper) {
    if (qty > 0) {
      wrapper.classList.add("has-qty");
    } else {
      wrapper.classList.remove("has-qty");
    }
  }
}

// ============================================================================
// PRODUK
// ============================================================================

function renderProducts(daftar) {
  var grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  daftar.forEach(function (produk) {
    if (!_cart[produk.id]) {
      _cart[produk.id] = { produk: produk, qty: 0 };
    }

    var card = document.createElement("div");
    card.className = "product-card";

    var img = document.createElement("img");
    img.className = "product-img";
    img.src = produk.image;
    img.alt = produk.name;
    img.loading = "lazy";
    pasangJagaGambar(img, produk.name);

    var body = document.createElement("div");
    body.className = "product-body";

    var nama = document.createElement("h3");
    nama.className = "product-name";
    nama.textContent = produk.name;

    var harga = document.createElement("p");
    harga.className = "product-price";
    harga.textContent = "Rp " + formatRupiah(produk.price);

    if (produk.desc) {
      var deskripsi = document.createElement("p");
      deskripsi.className = "product-desc";
      deskripsi.textContent = produk.desc;
      body.appendChild(deskripsi);
    }

    var qtyWrapper = document.createElement("div");
    qtyWrapper.className = "qty-wrapper";
    qtyWrapper.id = "qty-wrapper-" + produk.id;

    var minusBtn = document.createElement("button");
    minusBtn.className = "qty-btn qty-minus";
    minusBtn.id = "qty-minus-" + produk.id;
    minusBtn.type = "button";
    minusBtn.textContent = "-";
    minusBtn.setAttribute("aria-label", "Kurangi " + produk.name);
    minusBtn.disabled = true;
    (function (id) {
      minusBtn.addEventListener("click", function () { ubahQty(id, -1); });
    })(produk.id);

    var display = document.createElement("span");
    display.className = "qty-display";
    display.id = "qty-display-" + produk.id;
    display.textContent = "0";

    var plusBtn = document.createElement("button");
    plusBtn.className = "qty-btn qty-plus";
    plusBtn.id = "qty-plus-" + produk.id;
    plusBtn.type = "button";
    plusBtn.textContent = "+";
    plusBtn.setAttribute("aria-label", "Tambah " + produk.name);
    (function (id) {
      plusBtn.addEventListener("click", function () { ubahQty(id, 1); });
    })(produk.id);

    qtyWrapper.appendChild(minusBtn);
    qtyWrapper.appendChild(display);
    qtyWrapper.appendChild(plusBtn);

    body.insertBefore(nama, body.firstChild);
    body.insertBefore(harga, nama.nextSibling);
    body.appendChild(qtyWrapper);
    card.appendChild(img);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

// ============================================================================
// CART BAR (panel bawah seperti bottom navbar)
// ============================================================================

function buatCartBar() {
  if (document.getElementById("cart-bar")) return;

  var bar = document.createElement("div");
  bar.id = "cart-bar";
  bar.className = "cart-bar";
  bar.setAttribute("aria-live", "polite");
  bar.setAttribute("aria-label", "Keranjang pesanan");

  var inner = document.createElement("div");
  inner.className = "cart-bar-inner container";

  var itemsRow = document.createElement("div");
  itemsRow.className = "cart-items-row";
  itemsRow.id = "cart-items-row";

  var actions = document.createElement("div");
  actions.className = "cart-actions";

  var totalEl = document.createElement("span");
  totalEl.className = "cart-total";
  totalEl.id = "cart-total";

  var pesanBtn = document.createElement("button");
  pesanBtn.className = "cart-pesan-btn";
  pesanBtn.type = "button";
  pesanBtn.id = "cart-pesan-btn";
  pesanBtn.textContent = "Pesan via WhatsApp";
  pesanBtn.addEventListener("click", bukaOrderModal);

  actions.appendChild(totalEl);
  actions.appendChild(pesanBtn);

  inner.appendChild(itemsRow);
  inner.appendChild(actions);
  bar.appendChild(inner);
  document.body.appendChild(bar);
}

function updateCartBar() {
  buatCartBar();

  var bar = document.getElementById("cart-bar");
  var itemsRow = document.getElementById("cart-items-row");
  var totalEl = document.getElementById("cart-total");
  if (!bar || !itemsRow || !totalEl) return;

  var items = getCartItems();

  if (items.length === 0) {
    bar.classList.remove("cart-bar-visible");
    document.body.classList.remove("cart-bar-visible");
    return;
  }

  bar.classList.add("cart-bar-visible");
  document.body.classList.add("cart-bar-visible");

  itemsRow.innerHTML = "";
  items.forEach(function (item) {
    var chip = document.createElement("span");
    chip.className = "cart-chip";
    chip.textContent = item.produk.name + " " + item.qty + "x";
    itemsRow.appendChild(chip);
  });

  var total = getTotalHarga();
  totalEl.textContent = "Rp " + formatRupiah(total);
}

function kirimPesananCart() {
  var items = getCartItems();
  if (items.length === 0) return;

  var baris = items.map(function (item) {
    return item.produk.name + " " + item.qty + "x" +
      " (Rp " + formatRupiah(item.produk.price) + "/pcs)";
  });

  var total = getTotalHarga();

  var pesan = "Halo " + SITE_CONFIG.brandName + "! Saya mau pesan:\n\n" +
    baris.join("\n") +
    "\n\nTotal: Rp " + formatRupiah(total);

  var url = "https://wa.me/" + SITE_CONFIG.whatsappNumber +
    "?text=" + encodeURIComponent(pesan);

  window.open(url, "_blank", "noopener");
}

// ============================================================================
// ORDER MODAL — Form konfirmasi pesanan sebelum dikirim ke WhatsApp
// ============================================================================
//
// Arsitektur modul ini dibagi menjadi 4 lapisan:
//
//   [A] DOM Builder  — buatOrderModal()
//       Inject elemen modal ke <body> sekali saja (pola sama dengan buatCartBar).
//       Tidak ada logika bisnis di sini, hanya konstruksi elemen.
//
//   [B] Lifecycle    — bukaOrderModal(), tutupOrderModal()
//       Mengatur state tampil/sembunyi modal, render ulang ringkasan,
//       reset form, dan kunci scroll body.
//
//   [C] Field Logic  — toggleFieldAlamat(), updateStatusTombolKirim()
//       Reactive: dipanggil setiap kali radio berubah.
//       Menampilkan/menyembunyikan field alamat dan mengaktifkan tombol kirim.
//
//   [D] Validasi & Submit — validasiForm(), submitPesanan()
//       Validasi semua field wajib sebelum membangun pesan WA.
//       submitPesanan() hanya dipanggil setelah validasiForm() lulus.
//
// ----------------------------------------------------------------------------

// --- [A] DOM Builder ---

function buatOrderModal() {
  if (document.getElementById("order-backdrop")) return;

  var backdrop = document.createElement("div");
  backdrop.id = "order-backdrop";
  backdrop.className = "order-backdrop";
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-modal", "true");
  backdrop.setAttribute("aria-labelledby", "order-modal-title");

  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) tutupOrderModal();
  });

  backdrop.innerHTML =
    '<div class="order-card">' +

    '<div class="order-header">' +
    '<h2 class="order-title" id="order-modal-title"> Konfirmasi Pesanan</h2>' +
    '<button class="order-close" id="order-close" type="button" aria-label="Tutup form">✕</button>' +
    '</div>' +

    '<div class="order-body">' +

    '<div class="order-ringkasan" id="order-ringkasan"></div>' +

    '<div class="order-field">' +
    '<label for="order-nama">Atas Nama <span style="color:#ef4444">*</span></label>' +
    '<input class="order-input" id="order-nama" type="text" maxlength="60"' +
    ' placeholder="Nama pemesan" autocomplete="name" />' +
    '<span class="order-error" id="order-nama-err">Nama wajib diisi.</span>' +
    '</div>' +

    '<div class="order-field">' +
    '<label>Metode Pembayaran <span style="color:#ef4444">*</span></label>' +
    '<div class="order-radio-group" id="order-bayar-group">' +
    '<label class="order-radio-label" id="label-tunai">' +
    '<input type="radio" name="order-bayar" value="Tunai" /> Tunai' +
    '</label>' +
    '<label class="order-radio-label" id="label-qris">' +
    '<input type="radio" name="order-bayar" value="QRIS" /> QRIS' +
    '</label>' +
    '</div>' +
    '<span class="order-error" id="order-bayar-err">Pilih metode pembayaran.</span>' +
    '</div>' +

    '<div class="order-field">' +
    '<label>Opsi Pengambilan <span style="color:#ef4444">*</span></label>' +
    '<div class="order-radio-group" id="order-ambil-group">' +
    '<label class="order-radio-label" id="label-smk">' +
    '<input type="radio" name="order-ambil" value="SMK Fatahillah Cileungsi" /> SMK Fatahillah' +
    '</label>' +
    '<label class="order-radio-label" id="label-antar">' +
    '<input type="radio" name="order-ambil" value="Diantar ke Rumah" /> Diantar ke Rumah' +
    '</label>' +
    '</div>' +
    '<span class="order-error" id="order-ambil-err">Pilih opsi pengambilan.</span>' +
    '</div>' +

    '<div class="order-field" id="order-field-alamat" style="display:none">' +
    '<label for="order-alamat">' +
    'Alamat Lengkap <span style="color:#ef4444">*</span>' +
    '<span class="order-hint"> — dari kecamatan hingga nomor rumah</span>' +
    '</label>' +
    '<textarea class="order-textarea" id="order-alamat" rows="3"' +
    ' placeholder="Contoh: Kec. Cileungsi, Kp. Narogong, Jl. Merdeka No. 10">' +
    '</textarea>' +
    '<span class="order-charcount" id="order-alamat-count">0 karakter</span>' +
    '<span class="order-error" id="order-alamat-err">Alamat wajib diisi.</span>' +
    '</div>' +

    '<div class="order-field">' +
    '<label for="order-catatan">Catatan <span class="order-hint">(opsional)</span></label>' +
    '<textarea class="order-textarea" id="order-catatan" rows="2"' +
    ' placeholder="Contoh: mau tambah kecap, jangan pedas, dll.">' +
    '</textarea>' +
    '</div>' +

    '</div>' +

    '<div class="order-actions">' +
    '<button class="order-btn order-btn-cancel" id="order-btn-cancel" type="button">Batalkan</button>' +
    '<button class="order-btn order-btn-submit" id="order-btn-submit" type="button">Kirim Pesanan →</button>' +
    '</div>' +

    '</div>';

  document.body.appendChild(backdrop);

  document.getElementById("order-close").addEventListener("click", tutupOrderModal);
  document.getElementById("order-btn-cancel").addEventListener("click", tutupOrderModal);
  document.getElementById("order-btn-submit").addEventListener("click", submitPesanan);

  document.querySelectorAll("input[name='order-bayar']").forEach(function (radio) {
    radio.addEventListener("change", function () {
      pasangSelectedRadio("order-bayar-group");
      updateStatusTombolKirim();
    });
  });

  document.querySelectorAll("input[name='order-ambil']").forEach(function (radio) {
    radio.addEventListener("change", function () {
      pasangSelectedRadio("order-ambil-group");
      toggleFieldAlamat();
      updateStatusTombolKirim();
    });
  });

  document.getElementById("order-nama").addEventListener("input", function () {
    bersihkanError("order-nama");
    updateStatusTombolKirim();
  });

  var textarea = document.getElementById("order-alamat");
  textarea.addEventListener("input", function () {
    document.getElementById("order-alamat-count").textContent =
      textarea.value.length + " karakter";
    bersihkanError("order-alamat");
    updateStatusTombolKirim();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") tutupOrderModal();
  });
}

// --- [B] Lifecycle ---

function bukaOrderModal() {
  if (getCartItems().length === 0) return;

  buatOrderModal();
  renderRingkasanModal();
  resetFormModal();

  var backdrop = document.getElementById("order-backdrop");
  backdrop.classList.add("active");
  document.body.classList.add("modal-open");

  setTimeout(function () {
    var inputNama = document.getElementById("order-nama");
    if (inputNama) inputNama.focus();
  }, 100);
}

function tutupOrderModal() {
  var backdrop = document.getElementById("order-backdrop");
  if (!backdrop) return;

  backdrop.classList.remove("active");
  document.body.classList.remove("modal-open");
}

function resetFormModal() {
  var nama = document.getElementById("order-nama");
  if (nama) nama.value = "";

  document.querySelectorAll("input[name='order-bayar']").forEach(function (r) { r.checked = false; });
  document.querySelectorAll("input[name='order-ambil']").forEach(function (r) { r.checked = false; });

  document.querySelectorAll(".order-radio-label").forEach(function (lbl) {
    lbl.classList.remove("selected");
  });

  var textarea = document.getElementById("order-alamat");
  if (textarea) textarea.value = "";

  var catatanField = document.getElementById("order-catatan");
  if (catatanField) catatanField.value = "";

  var count = document.getElementById("order-alamat-count");
  if (count) count.textContent = "0 karakter";

  document.querySelectorAll(".order-error").forEach(function (el) { el.classList.remove("show"); });
  document.querySelectorAll(".order-input, .order-textarea").forEach(function (el) {
    el.classList.remove("error");
  });

  toggleFieldAlamat();
  updateStatusTombolKirim();
}

function renderRingkasanModal() {
  var container = document.getElementById("order-ringkasan");
  if (!container) return;

  var items = getCartItems();
  var total = getTotalHarga();

  var html = '<div style="background:#fff8ee;border-radius:12px;padding:14px 16px;">';
  html += '<ul style="list-style:none;display:flex;flex-direction:column;gap:6px;margin-bottom:10px;">';

  items.forEach(function (item) {
    var subtotal = item.produk.price * item.qty;
    html +=
      '<li style="display:flex;justify-content:space-between;font-size:0.9rem;">' +
      '<span>' + item.produk.name + ' <span style="color:#6b7280;">×' + item.qty + '</span></span>' +
      '<span style="font-weight:600;">Rp ' + formatRupiah(subtotal) + '</span>' +
      '</li>';
  });

  html += '</ul>';
  html +=
    '<div style="display:flex;justify-content:space-between;border-top:1px solid #e9d5b0;' +
    'padding-top:10px;font-weight:800;font-size:1rem;">' +
    '<span>Total</span>' +
    '<span style="color:#e04e1a;">Rp ' + formatRupiah(total) + '</span>' +
    '</div>';
  html += '</div>';

  container.innerHTML = html;
}

// --- [C] Field Logic ---

function toggleFieldAlamat() {
  var radioAntar = document.querySelector("input[name='order-ambil'][value='Diantar ke Rumah']");
  var fieldAlamat = document.getElementById("order-field-alamat");
  if (!fieldAlamat) return;

  var perluAntar = radioAntar && radioAntar.checked;
  fieldAlamat.style.display = perluAntar ? "block" : "none";

  if (!perluAntar) {
    var textarea = document.getElementById("order-alamat");
    if (textarea) textarea.value = "";
    bersihkanError("order-alamat");
  }
}

function pasangSelectedRadio(groupId) {
  var group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll(".order-radio-label").forEach(function (lbl) {
    var radio = lbl.querySelector("input[type='radio']");
    lbl.classList.toggle("selected", radio && radio.checked);
  });
}

function updateStatusTombolKirim() {
  var tombol = document.getElementById("order-btn-submit");
  if (!tombol) return;

  var nama = document.getElementById("order-nama");
  var radioBayar = document.querySelector("input[name='order-bayar']:checked");
  var radioAmbil = document.querySelector("input[name='order-ambil']:checked");
  var textarea = document.getElementById("order-alamat");
  var perluAntar = radioAmbil && radioAmbil.value === "Diantar ke Rumah";

  var namaOk = nama && nama.value.trim().length > 0;
  var bayarOk = !!radioBayar;
  var ambilOk = !!radioAmbil;
  var alamatOk = !perluAntar || (textarea && textarea.value.trim().length > 0);

  var semuaOk = namaOk && bayarOk && ambilOk && alamatOk;
  tombol.classList.toggle("enabled", semuaOk);
}

// --- [D] Validasi & Submit ---

function bersihkanError(fieldId) {
  var input = document.getElementById(fieldId);
  var err = document.getElementById(fieldId + "-err");
  if (input) input.classList.remove("error");
  if (err) err.classList.remove("show");
}

function tampilkanError(fieldId, pesan) {
  var input = document.getElementById(fieldId);
  var err = document.getElementById(fieldId + "-err");
  if (input) input.classList.add("error");
  if (err) {
    err.textContent = pesan || err.textContent;
    err.classList.add("show");
    input.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function validasiForm() {
  var valid = true;

  var nama = document.getElementById("order-nama");
  if (!nama || nama.value.trim() === "") {
    tampilkanError("order-nama", "Nama wajib diisi.");
    if (valid) { valid = false; }
  } else {
    bersihkanError("order-nama");
  }

  var radioBayar = document.querySelector("input[name='order-bayar']:checked");
  var errBayar = document.getElementById("order-bayar-err");
  if (!radioBayar) {
    if (errBayar) errBayar.classList.add("show");
    if (valid) {
      valid = false;
      var grupBayar = document.getElementById("order-bayar-group");
      if (grupBayar) grupBayar.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  } else {
    if (errBayar) errBayar.classList.remove("show");
  }

  var radioAmbil = document.querySelector("input[name='order-ambil']:checked");
  var errAmbil = document.getElementById("order-ambil-err");
  if (!radioAmbil) {
    if (errAmbil) errAmbil.classList.add("show");
    if (valid) {
      valid = false;
      var grupAmbil = document.getElementById("order-ambil-group");
      if (grupAmbil) grupAmbil.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  } else {
    if (errAmbil) errAmbil.classList.remove("show");
  }

  var perluAntar = radioAmbil && radioAmbil.value === "Diantar ke Rumah";
  if (perluAntar) {
    var textarea = document.getElementById("order-alamat");
    if (!textarea || textarea.value.trim() === "") {
      tampilkanError("order-alamat", "Alamat wajib diisi jika memilih diantar ke rumah.");
      valid = false;
    } else {
      bersihkanError("order-alamat");
    }
  }

  return valid;
}

function submitPesanan() {
  if (!validasiForm()) return;

  var items = getCartItems();
  if (items.length === 0) return;

  var nama = document.getElementById("order-nama").value.trim();
  var bayar = document.querySelector("input[name='order-bayar']:checked").value;
  var ambil = document.querySelector("input[name='order-ambil']:checked").value;
  var alamat = "";
  var catatan = "";
  if (ambil === "Diantar ke Rumah") {
    alamat = document.getElementById("order-alamat").value.trim();
  }
  catatan = document.getElementById("order-catatan").value.trim();

  var baris = items.map(function (item) {
    return "• " + item.produk.name + " × " + item.qty +
      " (Rp " + formatRupiah(item.produk.price) + "/pcs)";
  });

  var total = getTotalHarga();

  var pesan =
    "Halo " + SITE_CONFIG.brandName + "! Saya mau pesan:\n\n" +
    baris.join("\n") +
    "\n\nTotal       : Rp " + formatRupiah(total) +
    "\n\nAtas Nama   : " + nama +
    "\nPembayaran  : " + bayar +
    "\nPengambilan : " + ambil +
    (alamat ? "\nAlamat      : " + alamat : "") +
    (catatan ? "\nCatatan     : " + catatan : "");

  var url = "https://wa.me/" + SITE_CONFIG.whatsappNumber +
    "?text=" + encodeURIComponent(pesan);

  window.open(url, "_blank", "noopener");

  tutupOrderModal();
  resetCart();
}

function resetCart() {
  Object.keys(_cart).forEach(function (id) {
    _cart[id].qty = 0;
    updateQtyDisplay(Number(id));
  });
  updateCartBar();
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

  navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("open");
      navMenu.classList.remove("open");
    });
  });

  var navbar = document.getElementById("navbar");
  window.addEventListener("scroll", function () {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  });
}