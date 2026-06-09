# 🗺️ Fermion Roastery - User Journey & Route Map

Dokumen ini menjelaskan peta jalan (route) aplikasi Fermion Roastery, apa yang dilakukan user di setiap halaman, dan bagaimana alur datanya berakhir.

---

## 🔐 1. Authentication & Account
Sistem ini menggunakan **Custom Local Auth** yang mendukung Role-based Access Control (RBAC).

| Route | User Action | Destination / Outcome |
| :--- | :--- | :--- |
| `/auth` | User mengisi form login atau registrasi (menggunakan `AuthForm` component). | **Success:** Redirect ke `/admin/dashboard` (jika Admin) atau `/our-coffee` (jika Retail/B2B). Cookie `fermion_profile_id` diset. |
| `/account/register` | *(Deprecated)* Diarahkan otomatis ke `/auth`. | Memastikan konsistensi sistem login. |

---

## ☕ 2. Retail Journey (Public)
Alur untuk pembeli kopi satuan/umum.

| Route | User Action | Destination / Outcome |
| :--- | :--- | :--- |
| `/` | Landing page utama. Membaca narasi brand. | Mengarahkan user ke `/our-coffee` atau `/wholesale`. |
| `/our-coffee` | Menjelajah katalog kopi, memfilter berdasarkan asal/proses, dan melihat stiker promosi. | Klik produk &rarr; `/our-coffee/[id]`. Klik "Add" &rarr; Buka Sidebar Cart. |
| `/our-coffee/[id]` | Melihat detail sensory profile (Fermentation, Sweetness, dll) dan deskripsi lengkap. | Klik "Add to Cart" &rarr; Menambah item ke keranjang belanja. |
| `/retail/success` | Landing page setelah pembayaran sukses via Xendit. | User melihat status "Order Confirmed" dan jadwal roasting. Akhir dari flow belanja. |

---

## 🤝 3. B2B / Wholesale Journey
Alur khusus untuk calon mitra cafe/resto (B2B Client).

| Route | User Action | Destination / Outcome |
| :--- | :--- | :--- |
| `/wholesale` | Membaca benefit kemitraan (6 benefit cards) dan syarat MOQ (5kg). | Klik "Join Wholesale" &rarr; `/b2b/register`. |
| `/b2b/register` | **Step 1:** Login/Register. **Step 2:** Isi Nama Cafe & Alamat manual. **Step 3:** Pilih estimasi volume bulanan. | **Submit:** Data disimpan ke tabel `b2b_partners` dengan status `pending`. User diarahkan ke halaman Success B2B. |
| `/b2b/register` (Success State) | Membaca pesan "Verification in progress (~1 hour)". | User diberikan tombol "Go to Retail Shop" (`/our-coffee`) dengan diskon otomatis 10% (Introductory). |

---

## 📅 4. Subscription Journey (Direct Sub)
Alur langganan kopi berkala (Recurring Payment).

| Route | User Action | Destination / Outcome |
| :--- | :--- | :--- |
| `/subscription` | Memilih paket langganan (The Discovery, Signature, atau Collector). | Klik "Subscribe Now" &rarr; Redirect ke **Xendit Payment Page** (Recurring Mode). |
| `/subscription/success` | Landing page setelah pembayaran langganan dikonfirmasi. | User resmi menjadi member "Club" dan menunggu pengiriman rutin sesuai jadwal. |

---

## 🛡️ 5. Admin Journey (Command Center)
Halaman khusus Owner/Admin. Dilindungi oleh **Server-side Middleware**.

| Route | User Action | Destination / Outcome |
| :--- | :--- | :--- |
| `/admin/dashboard` | Melihat statistik utama: Revenue (Rp), Volume (Kg), dan grafik tren performa. | Memberikan gambaran cepat kesehatan bisnis. |
| `/admin/partners` | Review pendaftar B2B. Klik "Approve" dan memilih Tier (Bronze/Silver/Gold) atau "Reject". | **Action:** Mengubah status di DB. User B2B terkait otomatis mendapatkan harga tier tersebut saat login. |
| `/admin/products` | *(Planned)* Menambah, mengedit, atau menghapus produk kopi (CMS). | Memperbarui data katalog yang tampil di `/our-coffee`. |
| `/admin/inventory` | *(Planned)* Memonitor stok per batch sangrai. | Memberikan peringatan jika stok menipis. |

---

## 📝 Catatan Teknis (Middleware)
*   **Gatekeeper:** Rute `/admin/*` hanya bisa diakses jika user memiliki role `ADMIN`. 
*   **Verification:** Middleware mengecek setiap request ke backend `/api/auth/verify-admin`. Jika gagal, user dilempar balik ke `/auth`.
