# 🌐 API Specification & Integrations Document
## Fermion Roastery Platform (`fermion-roastery`)

---

## 1. Overview & Authentication Standard

Seluruh komunikasi API backend menggunakan format **JSON** melalui RESTful HTTP endpoints.

### Header Autentikasi
Sistem menggunakan **Bearer JWT Token** yang diterbitkan oleh Supabase Auth:
```http
Authorization: Bearer <SUPABASE_JWT_TOKEN>
Content-Type: application/json
```

---

## 2. Rincian Endpoint Utama Backend API

### 2.1 Authentication & Profile Routes (`/api/auth`)
- `POST /api/auth/register` — Pendaftaran akun retail baru.
- `POST /api/auth/login` — Autentikasi pengguna & pengembalian JWT session.
- `GET /api/auth/me` — Ambil profil pengguna aktif (Role: RETAIL, B2B, ADMIN).

### 2.2 Katalog Produk (`/api/products`)
- `GET /api/products` — Ambil seluruh katalog produk publik (support filter: `series`, `search`).
- `GET /api/products/:id` — Detail spesifik kopi (flavor notes, harga 250g/1kg, origin).
- `POST /api/products` — `[ADMIN ONLY]` Tambah varietal/batch kopi baru.
- `PUT /api/products/:id` — `[ADMIN ONLY]` Update stok atau harga produk.

### 2.3 Pesanan & Checkout (`/api/orders`)
- `POST /api/orders/checkout` — Buat transaksi pesanan baru (Retail / B2B Wholesale).
  - **Payload Example**:
    ```json
    {
      "items": [
        { "productId": "uuid", "grindOption": "FILTER_GRIND", "packageSize": "250G", "quantity": 2 }
      ],
      "shippingAddress": {
        "recipientName": "Syifa Pajril",
        "phone": "08123456789",
        "addressLine": "Jl. Specialty Coffee No. 1",
        "subdistrict": "Cibeunying Kaler",
        "city": "Bandung",
        "postalCode": "40123"
      },
      "paymentMethod": "QRIS"
    }
    ```
- `GET /api/orders/my-orders` — Daftar transaksi milik pengguna aktif.
- `GET /api/orders/:id/invoice` — Download file invoice PDF resmi transaksi.

### 2.4 Kemitraan B2B & Wholesale (`/api/b2b`)
- `POST /api/b2b/register` — Pendaftaran kemitraan grosir kafe & estimasi volume bulanan.
- `GET /api/b2b/contract/draft` — Unduh draf kontrak kemitraan B2B.
- `POST /api/b2b/contract/upload` — Unggah salinan kontrak yang telah ditandatangani.
- `GET /api/b2b/dashboard` — `[B2B ONLY]` Dashboard statistik kemitraan, tier diskon, & invoice tempo NET-30.

### 2.5 Gateway Pembayaran Xendit (`/api/payment`)
- `POST /api/payment/create-invoice` — Inisialisasi invoice pembayaran Xendit.
- `POST /api/payment/webhook` — **[PUBLIC WEBHOOK]** Menerima callback konfirmasi pembayaran otomatis dari Xendit (QRIS, VA, E-Wallet, Card).

### 2.6 Kurir & Logistik Biteship (`/api/shipping`)
- `POST /api/shipping/rates` — Kalkulasi otomatis ongkos kirim berdasarkan alamat & total berat pesanan (gram).
- `GET /api/shipping/track/:waybill` — Lacak posisi paket dan update resi kurir realtime.

### 2.7 Siklus Berlangganan (`/api/subscriptions`)
- `GET /api/subscriptions/plans` — Daftar paket berlangganan bulanan Roastery Loop.
- `POST /api/subscriptions/subscribe` — Aktifkan paket berlangganan rutin.
- `POST /api/subscriptions/cancel` — Hentikan siklus berlangganan.

---

## 3. Integrasi Pihak Ketiga (Third-Party Webhook Specs)

### 3.1 Webhook Xendit Invoice (`/api/payment/webhook`)
Menerima notifikasi status perubahan invoice Xendit (`PAID`, `EXPIRED`).
- **Verifikasi Security**: Mengecek `x-callback-token` pada HTTP request header.
- **Idempotency**: Memastikan pembaruan status transaksi di database Supabase hanya diproses 1 kali.

### 3.2 Webhook Biteship Tracking (`/api/shipping/webhook`)
Menerima update perubahan status resi pengiriman (`allocated`, `picking_up`, `picked`, `dropping_off`, `delivered`).
