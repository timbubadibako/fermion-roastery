# 📜 Fermion Roastery — Development Log & Project Roadmap

Dokumen ini adalah **single source of truth** untuk perkembangan projek **Fermion Roastery** (`fermion-roastery`), melacak roadmap keseluruhan, fitur yang telah selesai (`[x]`), serta sisa pekerjaan untuk sesi berikutnya (`[ ]`).

---

## 📌 Ringkasan Status Projek

- **Nama Projek**: Fermion Roastery (`fermion-roastery`)
- **Pemilik Projek**: Syifa Pajril Yaum
- **Tipe Aplikasi**: Web Commerce Platform (Owned Specialty Coffee Marketplace & B2B Hub)
- **Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, GSAP, Framer Motion, Express.js Backend, Supabase (Postgres & Auth), Xendit Payment Gateway, Biteship.
- **Identitas Git**: `Syifa Pajril Yaum` <`pjrlywm@gmail.com`>
- **Status Indeks CodeGraph**: Active (`.codegraph/`)

---

## 📋 TODO Keseluruhan Projek (Roadmap Big Picture)

- [x] **Storefront & Visual Identity**: High-craft Swiss Modernism typography, hero media, product series (Espresso & Filter), wholesale CTAs, dan Dev Notice Modal.
- [x] **Spotlight Tour Interaktif (Desktop & Mobile)**:
  - [x] Guide 9-step landing page dengan smart positioning.
  - [x] Auto-trigger & close drawer hamburger mobile ketika menyeleksi menu nav/search.
  - [x] Fallback dual-selector & resolution `getVisibleElement` (mencegah koordinat `(0,0)`).
  - [x] Auto bottom alignment note card pada mobile agar tidak menutupi link berlangganan/menu.
- [x] **Responsive Header & Brand Alignment**:
  - [x] Penyesuaian ukuran logo Fermion 75% pada mobile/tablet (`h-[22px]` / `md:h-[24px]` / `lg:h-8`) sejajar dengan icon hamburger & keranjang.
  - [x] Anti-ritual copywriting enforcement (Pesanan, Kemitraan, Berlangganan).
- [ ] **Dokumentasi Formal SDLC 5-Category Framework**:
  - [x] Pembaruan aturan global `~/.gemini/config/rules/sdlc_behavior.md`.
  - [x] Inisialisasi `DEVELOPMENT_LOG.md` di root projek.
  - [ ] Pembuatan `docs/PRD_AND_SRS.md` (Requirements & Product Specs).
  - [ ] Pembuatan `docs/ARCHITECTURE_AND_ERD.md` (System Architecture & Database Schema).
  - [ ] Pembuatan `docs/API_SPECIFICATION.md` (OpenAPI/Endpoints & Integration Specs).
- [ ] **Transaction Readiness & Payment Gateway**:
  - [ ] Validasi end-to-end payment gateway Xendit (QRIS, VA, E-Wallet) pada environment produksi.
  - [ ] Webhook signature verification & idempotency handling.
- [ ] **Security & Production Hardening**:
  - [ ] Pembatasan CORS backend whitelist (ganti `cors()` default).
  - [ ] Rate limiting menyeluruh pada endpoint sensitif (login, register, B2B, webhook).
  - [ ] Structured logging untuk transaksi & audit trail admin.

---

## 🚀 Ceklis Task Selesai (`[x]`) — Sesi Terbaru

### 🎨 Frontend UI / UX & Spotlight Tour
- [x] **Dev Notice Modal**: Pembuatan komponen notice modal dengan aksen visual *Plaster Tape* interaktif untuk narasi selamat datang tanpa membatasi percobaan pembelian.
- [x] **Spotlight Tour Smart Selector**: Mengganti target selector `#tour-search-btn` ke dual selector `#tour-search-btn, #tour-search-mobile` agar berjalan mulus di mobile.
- [x] **Visible Element Resolver**: Implementasi `getVisibleElement()` pada `spotlight-guide.tsx` untuk memfilter elemen tersembunyi (`display: none` / width=0) agar cutout spotlight tidak melompat ke `(0,0)`.
- [x] **Mobile Drawer Integration**: Mengatur `isTargetInDrawer` agar menu hamburger otomatis terbuka saat tur menyeleksi link nav/search mobile dan otomatis tertutup saat berpindah ke section halaman utama.
- [x] **Mobile Card Placement Optimization**: Mengatur `cardTop` pada mobile agar kartu catatan diletakkan di area bawah layar (`windowSize.height - cardHeight - 24px`), menjaga link **Berlangganan** dan menu drawer 100% bebas dari halangan.
- [x] **Header Logo Scaling**: Memperkecil logo Fermion menjadi 75% di mobile & tablet (`h-[22px]` / `md:h-[24px]` / `lg:h-8`) sehingga presisi sejajar dengan tinggi icon hamburger (22px).

### ⚙️ Infrastructure, Security & Compliance
- [x] **Git Credentials**: Memastikan seluruh commit Git menggunakan kredensial lokal pengguna (`Syifa Pajril Yaum` <`pjrlywm@gmail.com`>).
- [x] **Anti-Ritual Wording Audit**: Memastikan seluruh antarmuka dan copywriting menggunakan istilah profesional (*Pesanan*, *Kemitraan*, *Berlangganan*).
- [x] **Clean TypeCheck**: Memastikan kompilasi TypeScript `npx tsc --noEmit` bersih tanpa error (exit code 0).
- [x] **Git Integration**: Seluruh perubahan bertahap di-commit & di-push ke `origin/main`.

---

## ⏳ Sisa Pekerjaan Sesi Berikutnya (`[ ]`)

- [ ] **Dokumentasi PRD & SRS (`docs/PRD_AND_SRS.md`)**:
  - [ ] Menyusun latar belakang, problematika fee marketplace 30%, target audience (Retail, B2B, Subscriber).
  - [ ] Mendokumentasikan spesifikasi fungsional (Katalog Kopi, Cart Weight Estimator, B2B Volume Tier Slider, Roastery Loop Subscription).
  - [ ] Mendokumentasikan spesifikasi non-fungsional (Lighthouse performance target > 90, TTFB < 300ms, Xendit API latency).
- [ ] **Dokumentasi Arsitektur & ERD (`docs/ARCHITECTURE_AND_ERD.md`)**:
  - [ ] Memetakan arsitektur Next.js 16 App Router + Express.js Backend + Supabase Postgres.
  - [ ] Mendokumentasikan skema tabel Supabase (`products`, `orders`, `order_items`, `b2b_profiles`, `subscriptions`, `shipping_addresses`).
- [ ] **Dokumentasi Spesifikasi API (`docs/API_SPECIFICATION.md`)**:
  - [ ] Memetakan endpoint Xendit Invoice & Webhook events.
  - [ ] Memetakan Biteship shipping calculator & tracking API endpoints.
  - [ ] Memetakan internal Next.js API routes & Express backend endpoints.
- [ ] **Backend Security Hardening**:
  - [ ] Mengubah CORS origin whitelist di `backend/index.js`.
  - [ ] Menambahkan verifikasi signature webhook Xendit & Biteship.

---

## 📊 Git Commit Log Sesi Ini
- `a4cd356` — `style(header): adjust logo size to 75% on mobile and tablet to align with icon height`
- `8f6273a` — `fix(spotlight): adjust note card position on mobile for drawer items to prevent obscuring subscription link`
- `caced19` — `fix(spotlight): resolve mobile element targeting and search popup positioning`
- `81ed5fa` — `feat(ui): implement auto open/close hamburger drawer and centered note overlay for mobile spotlight tour`
