# Fermion Roastery - Developer Guide & Architecture

Dokumen ini ditulis khusus untuk Anda sebagai pengembang utama (Developer). Karena proyek ini dibangun bersama, panduan ini akan menjadi "Peta Harta Karun" Anda untuk memahami alur kode, merawat aplikasi, dan melakukan modifikasi (*scaling*) secara mandiri di masa depan.

---

## 🏗️ 1. Arsitektur Utama (Tech Stack)
Proyek ini mengadopsi arsitektur **Decoupled (Terpisah)** antara antarmuka pengguna (Frontend) dan logika server (Backend).
*   **Frontend:** Next.js (App Router), TailwindCSS, GSAP (Animasi), Zustand (State Management).
*   **Backend:** Express.js (Node.js REST API), Xendit Node SDK (Payment).
*   **Database & Auth:** Supabase (PostgreSQL & Otentikasi berbasis JWT).

---

## 📂 2. Peta Direktori Kode (Modularity)

### A. Frontend (`/frontend`)
Sistem frontend menggunakan *Next.js App Router* di mana *folder* menentukan *URL Route*.

*   `app/` -> Berisi semua halaman website.
    *   `app/page.tsx` -> Halaman beranda (Home).
    *   `app/products/` -> Halaman katalog toko dan detail kopi.
    *   `app/wholesale/` -> Halaman pengajuan mitra B2B/Grosir.
    *   `app/admin/` -> *Dashboard* rahasia untuk Admin (dilindungi auth).
*   `components/` -> Kumpulan "Batu Bata" (Modularitas UI).
    *   Jika Anda ingin mengubah wujud tombol, *header*, *footer*, atau komponen FAQ, carilah di sini. Ini memisahkan logika halaman (di `app/`) dengan wujud tampilan visualnya.
*   `lib/` -> Kumpulan logika pendukung (Toko Data).
    *   `lib/store.ts` -> Tempat *Zustand* menyimpan data Cart (Keranjang) dan Bahasa (i18n).
    *   `lib/supabaseClient.ts` -> Kunci penghubung antara frontend dan database Supabase.

### B. Backend (`/backend`)
Backend Anda sangat rapi dengan pola desain **MVC-ish** (Routes - Controllers - Middleware).

*   `index.js` -> Jantung server. Tempat semua *route* didaftarkan (seperti `app.use('/api/payment', ...)`) dan pengaturan CORS/Keamanan awal.
*   `routes/` -> Penjaga Pintu. Mereka bertugas meneruskan URL (misal `/admin/stats`) ke *Controller* yang tepat.
*   `controllers/` -> Otak Logika.
    *   `paymentController.js` -> Segala urusan bikin *Invoice* Xendit dan menerima sinyal balik (Webhook) dari Xendit.
    *   `adminController.js` -> Urusan membaca data pesanan, statistik B2B, dan jadwal *maintenance*.
*   `middleware/` -> Satpam.
    *   `authMiddleware.js` -> Mengecek *"Apakah user ini sudah login?"* dan *"Apakah user ini seorang Admin?"*. Jika tidak, tendang keluar!

---

## 🔄 3. Alur Bisnis & Data (Cara Kerja)

### Alur Pembayaran Retail (Checkout)
1. **User (Frontend):** Menambah kopi ke keranjang (Zustand State) -> Mengisi form pengiriman -> Menekan "Bayar".
2. **Frontend -> Backend:** Frontend mengirim data total belanja ke `/api/payment/checkout`.
3. **Backend -> Xendit:** `paymentController.js` membuat pesanan di database dengan status `pending`, lalu memanggil API Xendit menggunakan `XENDIT_SECRET_KEY` untuk membuat tagihan (Invoice).
4. **Xendit -> User:** Mengembalikan URL Pembayaran Xendit ke frontend. User digeser ke layar pembayaran Xendit.
5. **Xendit -> Backend (Webhook):** Saat user selesai transfer, Xendit menembak `/api/payment/webhook` di server Anda secara diam-diam. Server mengubah status di database menjadi `PAID`.

### Alur Mitra B2B (Wholesale)
1. User masuk ke `fermionroastery.com/wholesale`. Animasi kalkulator diskon muncul.
2. User mengirim pengajuan (Form). Data dikirim ke tabel `b2b_inquiries` di Supabase.
3. Anda (Admin) masuk ke `/admin`. React me-render *dashboard* memanggil rute `/api/admin/partners` untuk mengambil semua calon mitra.
4. Karena Anda Admin, `authMiddleware.js` meloloskan *request* Anda, dan menampilkan daftar tersebut.

---

## 🛠️ 4. Panduan Jika Anda Bekerja Sendiri Nanti

Bagaimana jika Anda ingin menambah fitur baru tanpa saya? Konsep utamanya adalah **Modularitas**.

**Contoh Kasus: Anda ingin membuat Halaman "Tentang Kami (About)"**
1. **Frontend:** Buat folder baru `frontend/app/about/page.tsx`.
2. Tulis kode UI-nya di sana. Jika halamannya rumit, pecah bagian-bagiannya (misal: Foto Tim) menjadi file baru di `frontend/components/sections/TeamSection.tsx`.
3. Panggil `<TeamSection />` di dalam `page.tsx` tadi.
4. **Butuh ambil data dari DB?** Jika bisa diambil langsung via Supabase Client di frontend, langsung ambil. Jika datanya rahasia atau butuh kalkulasi rumit, buat rute di `backend/routes/contentRoutes.js`.

**Pesan Penting Terkait Environment Variables (`.env`)**
*   Jangan pernah menulis langsung (Hardcode) kunci rahasia (*secret key*) Xendit atau Supabase di dalam kode JS/TS.
*   Selalu gunakan `process.env.NAMA_KUNCI`.
*   Ingat, `NEXT_PUBLIC_...` di frontend artinya variabel tersebut bisa dilihat oleh umum (browser). Kunci rahasia (seperti Xendit) HANYA BOLEH disimpan di `.env` backend dan tidak boleh memiliki embel-embel `NEXT_PUBLIC`.

---

*Panduan ini dirancang agar Anda dapat menguasai kembali setiap baris kode yang telah kita tulis bersama.* Selamat memimpin *engineering* Fermion Roastery! ☕🚀
