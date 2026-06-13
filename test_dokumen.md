# 🧪 Fermion Roastery - Test Document

Dokumen ini berisi panduan pengujian untuk fitur-fitur utama Fermion Roastery V2, termasuk skenario untuk berbagai peran pengguna.

## 🔑 Akun Pengujian
Semua akun menggunakan password: `password123`

| Role | Email | Deskripsi |
| :--- | :--- | :--- |
| **Admin** | `admin@fermion.com` | Akses penuh ke Command Center, Approvals, dan Settings. |
| **B2B Partner** | `b2b@fermion.com` | Akses ke Partner Dashboard, Volume Tracking, dan Wholesale Pricing. |
| **Retail User** | `user@fermion.com` | Pengguna umum untuk pembelian eceran dan tracking pesanan. |

---

## 🛠 Skenario Pengujian

### 1. Autentikasi & Role-Based UI
- **Login sebagai Admin:**
    - Pastikan Navbar menampilkan ikon **LayoutDashboard** (Admin Panel).
    - Akses ke rute admin harus langsung masuk ke **Manage Orders**.
- **Login sebagai B2B:**
    - Pastikan Navbar menampilkan ikon **LayoutGrid** (Bulk Orders).
    - Dashboard utama (overview) ditiadakan, langsung masuk ke fungsionalitas utama.
- **Dedicated Ordering (Admin & B2B):**
    - Admin melakukan pembelian via `/admin/orders` (keranjang terpisah).
    - B2B melakukan pembelian via `/b2b/orders` (keranjang terpisah + wholesale price).
    NEW

### 2. B2B Onboarding Flow (Phase 1)
- **Registration:** Buka `/b2b/register`, buat akun baru, isi detail Cafe.
- **Contract Engine:** Setelah submit detail, klik "Download Contract". Pastikan PDF ter-generate dengan logo Fermion dan data Cafe Anda (Font Monospace).
- **Upload:** Upload file PDF tersebut. Status harus berubah menjadi "Verifying Contract" dengan animasi Si Gunung.
- **Approval:** Login sebagai Admin, buka menu Partners, Approve Partner tersebut dan tentukan Tier-nya.
- **Profile Completion:** Login kembali sebagai Partner. Dashboard harus terkunci oleh Modal "Identity Verification". Upload Logo Cafe dan isi NPWP.
- **Activation:** Setelah simpan logo, User diarahkan ke **Bulk Orders Catalog** dan Logo Cafe Anda harus muncul di Landing Page utama.
...
### 3. Admin Command Center
- **Journal CMS:** Buat story baru di menu Journal admin. Cek apakah story tersebut muncul di Landing Page (Stories from the Field).
- **Shipping Console:** Update nomor Resi pada pesanan PAID. Status harus otomatis berubah menjadi SHIPPED.
- **Symmetry Check:** Pastikan margin kiri dan kanan di semua halaman dashboard seimbang (tidak ada lagi "gepeng" atau berat sebelah).



### 4. Fulfillment & Shipping (Biteship Integration)
- **Retail Order:** Buat pesanan sebagai user retail, selesaikan pembayaran. Admin harus melihat tombol "Print Label" (Auto-trigger). perasaan tadi ada settingan auto dan manual print awb deh, tapi lihat nanti di dokumen yang lain
- **B2B Order:** Buat pesanan sebagai partner B2B. Admin harus memasukkan **Batch ID** dan **Roast Date** terlebih dahulu sebelum bisa memicu Biteship.

### 5. Invoicing
- **Download Invoice:** Login sebagai B2B, buka riwayat pesanan, dan klik "Download PDF". Pastikan Logo Fermion dan Logo Cafe (jika ada) muncul.

---

## 🐛 Bug Fix Verification (Navbar Grid Icon)
**Issue:** Ikon grid admin muncul saat user tidak login atau memiliki state role yang salah di browser.
**Fix:** Navbar sekarang secara ketat mengecek keberadaan objek `user` dan `role` sebelum menampilkan ikon fungsional.

**Cara Test Fix:**
1. Hapus Cookies/Local Storage di browser.
2. Buka homepage.
3. Pastikan di pojok kanan Navbar hanya ada **Search**, **Ikon User (Login)**, dan **Keranjang**. Tidak boleh ada ikon grid admin.
