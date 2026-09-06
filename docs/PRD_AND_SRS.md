# 📋 Product Requirement Document (PRD) & Software Requirement Specification (SRS)
## Fermion Roastery Platform (`fermion-roastery`)

---

## 1. Product Requirement Document (PRD)

### 1.1 Latar Belakang & Visi Produk
- **Problem Statement**: Penjualan specialty coffee melalui marketplace pihak ketiga (seperti Shopee dan Tokopedia) dibebani biaya layanan (*merchant fee*) yang tinggi hingga ~30%, serta membatasi hubungan langsung dan kepemilikan data pelanggan.
- **Visi Produk**: Membangun marketplace mandiri (*Owned E-Commerce & B2B Hub*) untuk **Fermion Roastery** yang independen, memperkuat kepercayaan merek (*brand trust*), serta menyediakan pengalaman belanja retail, berlangganan bulanan, dan kemitraan B2B grosir yang mulus.
- **Tujuan Bisnis**:
  1. Menghilangkan potongan biaya platform pihak ketiga.
  2. Meningkatkan *lifetime value* (LTV) melalui fitur berlangganan rutin.
  3. Mempermudah akuisisi partner kafe (B2B) dengan sistem kalkulator tier diskon dan invoice otomatis.

### 1.2 Target Pengguna (User Personas)
1. **Retail Coffee Enthusiast (Pembeli Eceran)**: Penikmat kopi spesialtis yang mencari biji kopi fresh roast (Whole Bean / Filter / Espresso) kemasan 250g atau 1kg.
2. **B2B Partner & Cafe Owner (Kemitraan Grosir)**: Pemilik bisnis kafe/Horeca yang membutuhkan suplai kopi konsisten bulanan (≥15kg - >50kg) dengan tier harga diskon grosir.
3. **Monthly Subscriber (Pelanggan Berlangganan)**: Pembeli rutin yang mempercayakan kurasi biji kopi bulanan langsung kepada Head Roaster Mr. Yanotama.
4. **Roastery Admin & Operations**: Tim internal Fermion Roastery yang mengelola stok, status sangrai (*roast batch*), verifikasi pembayaran, dan pengiriman resi.

---

## 2. Software Requirement Specification (SRS)

### 2.1 Spesifikasi Kebutuhan Fungsional (Functional Requirements)

#### FR-1: Katalog Produk & Pengalaman Belanja Retail
- **FR-1.1 Katalog Terindeks**: Sistem harus menyediakan halaman `/our-coffee` dengan filter varietal, origin, dan profil sangrai (*Espresso Series* vs *Filter Series*).
- **FR-1.2 Opsi Varian**: Pengguna dapat memilih opsi profil gilingan (*Whole Bean*, *Filter Grind*, *Espresso Grind*) dan ukuran kemasan (*250g*, *1kg*).
- **FR-1.3 Cart Drawer & Estimasi Berat**: Drawer keranjang menghitung berat total pesanan (gram) serta menampilkan progress gratis ongkir untuk transaksi ≥ Rp 500.000.

#### FR-2: Kemitraan B2B & Kalkulator Grosir
- **FR-2.1 Volume Tier Calculator**: Halaman `/wholesale` dilengkapi slider interaktif estimasi volume bulanan dengan tier diskon:
  - **Bronze Tier** (< 15 kg/bulan): Potongan Rp 10.000 / kg.
  - **Silver Tier** (15 kg - 49 kg/bulan): Potongan Rp 15.000 / kg.
  - **Gold Tier** (≥ 50 kg/bulan): Potongan Rp 20.000 / kg.
- **FR-2.2 B2B Registration & Contract Draft**: Partner B2B dapat mendaftar melalui `/b2b/register`, mengunduh berkas draft kontrak kerja sama, dan mengunggah dokumen yang telah ditandatangani di `/b2b/contract`.
- **FR-2.3 Net-30 Invoicing**: Partner B2B yang telah terverifikasi dapat melakukan pemesanan dengan opsi metode pembayaran Invoice Tempo (NET-30).

#### FR-3: Siklus Berlangganan (Roastery Loop Subscription)
- **FR-3.1 Paket Kurasi Bulanan**: Menyediakan fitur berlangganan rutin bulanan di `/subscription` yang dikurasi langsung oleh Head Roaster.
- **FR-3.2 Penjadwalan Roasting**: Batch pengiriman paket langganan diproses pada hari sangrai pertama tiap awal bulan.
- **FR-3.3 Bebas Biaya Kirim**: Seluruh transaksi paket berlangganan mendapatkan fasilitas bebas biaya pengiriman (*free priority shipping*).

#### FR-4: Gateway Pembayaran Online Automated (Xendit Integration)
- **FR-4.1 Dukungan Multi-Channel Payment**: Sistem mengintegrasikan Xendit Payment Gateway mendukung 4 saluran utama:
  1. **QRIS Instant Payment** (Gopay, ShopeePay, QRIS BCA/Mandiri).
  2. **Virtual Account (VA)**: BCA, Mandiri, BRI, BNI.
  3. **E-Wallet Direct**: OVO, DANA, ShopeePay, GoPay.
  4. **Credit / Debit Card**: Visa & Mastercard.
- **FR-4.2 Konfirmasi Pembayaran Otomatis**: Webhook Xendit mengonfirmasi status pembayaran secara realtime tanpa verifikasi manual.

#### FR-5: Integrasi Kurir & Logistik (Biteship Integration)
- **FR-5.1 Tarif Realtime**: Sistem menghitung ongkos kirim secara otomatis berdasarkan lokasi Kecamatan/Kota penerima melalui API Biteship.
- **FR-5.2 Pelacakan Resi**: Pembeli dapat memantau status posisi pengiriman dan nomor resi kurir melalui Dashboard Akun atau Invoice page.

#### FR-6: Interactive Onboarding & Spotlight Tour
- **FR-6.1 Interactive Spotlight Guide**: Komponen `SpotlightGuide` menyediakan 9-step panduan alur transaksi lengkap pada landing page.
- **FR-6.2 Mobile Drawer Automation**: Tur otomatis membuka drawer menu mobile (< 1024px) saat menyeleksi elemen pencarian/navigasi mobile, dan menutupnya kembali saat tur berlanjut.
- **FR-6.3 Smart Note Card Positioning**: Kartu catatan tur secara otomatis diposisikan di bagian bawah layar mobile (`windowSize.height - cardHeight - 24px`) agar tidak menghalangi menu nav/link berlangganan.

---

### 2.2 Spesifikasi Kebutuhan Non-Fungsional (Non-Functional Requirements)

#### NFR-1: Performa & Speed SLA
- **NFR-1.1 Target Lighthouse Score**: Halaman publik harus mencapai skor **Lighthouse Performance ≥ 90/100** di desktop dan mobile.
- **NFR-1.2 Waktu Muat Halaman (Page Load SLA)**: First Contentful Paint (FCP) dan waktu muat halaman utama tidak boleh melebihi **2.0 detik** pada koneksi standar.
- **NFR-1.3 Response Time API**: Waktu respon backend API internal < 300ms.

#### NFR-2: Keamanan (Security Hardening)
- **NFR-2.1 Authentication & Authorization**: Menggunakan Supabase Auth (JWT) dengan pembatasan peran ketat (`RETAIL`, `B2B`, `ADMIN`).
- **NFR-2.2 CORS Whitelist**: Backend Express wajib membatasi origin CORS hanya untuk domain resmi `NEXT_PUBLIC_SITE_URL`.
- **NFR-2.3 Webhook Signature Verification**: Webhook Xendit dan Biteship wajib melakukan validasi HMAC signature token.

#### NFR-3: Tipografi & Penulisan (Brand Copywriting Rules)
- **NFR-3.1 Anti-Ritual Wording Rule**: Dilarang keras menggunakan kata *"Ritual"* untuk proses bisnis/order/berlangganan. Wajib menggunakan istilah lugas: *Pesanan*, *Kemitraan*, atau *Berlangganan*.
- **NFR-3.2 Typography Standards**: Utamakan tipografi sans-serif profesional yang jernih dan mudah dibaca pada seluruh antarmuka fungsional.

---

## 3. Kriteria Penerimaan & Verifikasi (Acceptance Criteria)

1. Semua halaman utama lulus audit kompilasi TypeScript (`npx tsc --noEmit` exit code 0).
2. Tur Spotlight berjalan mulus di desktop & mobile tanpa koordinat cutout miring/`0,0`.
3. Pembayaran Xendit QRIS, VA, E-Wallet, dan Card mengalirkan status transaksi secara realtime.
4. `DEVELOPMENT_LOG.md` ter-update setiap penutupan sesi.
