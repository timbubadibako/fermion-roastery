# Fermion Roastery - Rejected/Alternative Approaches

Dokumen ini berisi ide-ide dan pendekatan arsitektur yang tidak dipilih selama fase *brainstorming*, disimpan sebagai referensi di masa depan jika kebutuhan proyek berubah.

## 1. Arsitektur: Frontend-Driven (Next.js Monolith)
*   **Konsep:** Hampir semua *business logic* (termasuk B2B pricing, verifikasi, dll) diletakkan di Server Actions atau API Routes Next.js.
*   **Alasan Ditolak:** Kurang aman untuk menyembunyikan *logic* harga grosir B2B yang kompleks dan mengikat, serta kurang *scalable* jika nantinya Fermion ingin membuat aplikasi *mobile* terpisah yang membutuhkan API backend yang kokoh.
*   **Keputusan:** Kita menggunakan **Engine-Heavy Hybrid** (Next.js untuk UI, Express.js untuk Core Logic B2B & Transaksi).

## 2. B2B Verification: Manual & Email/Domain Validation
*   **Konsep:** User mendaftar B2B dengan email bisnis, lalu admin memverifikasi secara manual dengan meminta foto toko/menu, atau sistem hanya mengecek apakah email yang digunakan adalah email domain (bukan gmail).
*   **Alasan Ditolak:** Terlalu banyak *friction* (hambatan) bagi klien untuk mendaftar, dan membebani kerja admin (tidak otomatis).
*   **Keputusan:** Menggunakan **Google Places API** untuk verifikasi instan berdasarkan nama dan alamat toko (*frictionless*).

## 3. Product Info: "The Playful Lab-Report"
*   **Konsep:** Menampilkan informasi teknis kopi (Altitude, Origin, Process) dalam bentuk tabel/grid bergaya laporan laboratorium komik.
*   **Alasan Ditolak:** Terlalu kaku dan memakan banyak ruang secara visual.
*   **Keputusan:** Menggunakan **"The Interactive Sticker"** (Badge dengan icon yang bisa di-hover dan interaktif) karena lebih fleksibel dan mudah di-*reuse* (reusable component) di berbagai tempat.

## 4. Sistem Kontrak B2B: Belum Ditentukan
*   *(Catatan: Opsi mengenai jenis kontrak B2B seperti Commitment-Based atau Quota-Based masih ditunda menuggu konfirmasi dari klien).*
