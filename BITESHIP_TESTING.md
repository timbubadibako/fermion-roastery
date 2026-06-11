# Biteship Shipping Integration Testing

Dokumen ini digunakan untuk mencatat langkah-langkah, hasil uji coba, dan panduan penggunaan integrasi Biteship pada project Fermion Roastery.

## 1. Persiapan Environment
Pastikan variabel berikut sudah ada di file `backend/.env`:
```env
BITESHIP_API_KEY=your_api_key_here
```
*Note: Token biasanya diawali dengan `biteship_test.` untuk testing atau `biteship_live.` untuk produksi.*

## 2. Fitur & Endpoint Utama
Berdasarkan dokumentasi resmi:

### A. Authentication
- **Base URL:** `https://api.biteship.com`
- **Header:** `authorization: <<YOUR_API_KEY>>`
- **Method:** Mendukung HTTP Basic Auth (API Key sebagai username, password kosong).

### B. Maps API (Mencari Area ID)
Digunakan untuk standarisasi nama lokasi dan mendapatkan `area_id` agar perhitungan ongkir lebih akurat.
- **Endpoint:** `GET /v1/maps/areas`
- **Query Params:** `countries=ID`, `input=Nama Daerah`, `type=single`

### C. Rates API (Cek Ongkir)
- **Endpoint:** `POST /v1/rates/couriers`
- **Tingkat Akurasi:**
  1. **High (Area ID):** Paling akurat karena menggunakan ID distrik/kecamatan.
  2. **Medium (Postal Code):** Cukup akurat, tapi satu kode pos bisa mencakup beberapa area.
  3. **Low (Coordinates):** Bagus untuk kurir instan (Gojek/Grab), tapi bisa meleset untuk reguler.

### F. Order Status Flow
Penting untuk memantau status pesanan di sistem kita:
1. `confirmed`: Order dibuat, resi (AWB) sudah ada.
2. `allocated`: Kurir sudah ditugaskan.
3. `picking_up` -> `picked`: Kurir dalam perjalanan & sudah ambil paket.
4. `in_transit`: Paket sedang dikirim.
5. `delivered`: Paket sampai tujuan.
6. `cancelled`: Pesanan dibatalkan (bisa lewat API `/v1/orders/:id/cancel`).

### G. Tracking API & Webhooks
Ada dua cara memantau resi:
- **Tracking via API:**
  - Internal: `GET /v1/trackings/:id` (Pakai ID dari Biteship).
  - Public: `GET /v1/trackings/:waybill_id/couriers/:courier_code` (Pakai No Resi & Kode Kurir).
- **Webhooks (Rekomendasi Utama):**
  - Setup URL (misal `https://api.fermion.com/webhook/biteship`) di Dashboard Biteship -> Pengaturan -> Tambah Webhook.
  - Saat mode Testing, ada tombol kuning di dashboard untuk mensimulasikan webhook dikirim ke server kita.

### H. Shipping Label (Cetak Resi)
Biteship **tidak** menyediakan API untuk generate PDF Resi/Shipping Label.
Solusi:
1. Print manual dari Dashboard Biteship.
2. Generate PDF mandiri di sisi Backend (menggunakan data: Barcode Resi, Routing Code, Info Pengirim & Penerima).

## 3. Struktur Item (Standard)
```json
{
  "name": "Nama Produk",
  "description": "Deskripsi",
  "value": 150000,
  "quantity": 1,
  "weight": 300,
  "length": 10,
  "width": 10,
  "height": 10
}
```

## 4. Rencana Implementasi di Fermion Roastery
Berdasarkan riset, alur yang paling cocok adalah:
1. User pilih produk -> Checkout.
2. Sistem buat **Draft Order** (tanpa kurir dulu).
3. Sistem panggil **Draft Order Rates** -> Tampilkan pilihan kurir ke User.
4. User pilih kurir & bayar -> Sistem panggil **Confirm Draft Order**.
5. Order resmi tercipta di Biteship.
6. Sistem memantau status via **Webhook** (endpoint `/api/orders/webhook-biteship` akan dibuat nanti).
7. Admin print label resi dari Dashboard (atau kita buatkan generator PDF di admin panel).

## 5. Script Uji Coba Tersedia
- `backend/biteship_test_suite.js`: Menjalankan alur lengkap (Cek ongkir -> Buat order -> Cek status).
- `backend/biteship_activate.js`: Membuat 2 order testing untuk simulasi status di dashboard Biteship.
- `backend/biteship_draft_test.js`: Script simulasi alur checkout lengkap dengan Draft Order.

## 6. Cara Menjalankan Test
Masuk ke direktori `backend` dan jalankan:
```bash
node biteship_draft_test.js
```

## 7. Log Hasil Uji Coba
### [2026-06-10] - Full API Mapping
- [x] Memahami beda Order API vs Draft Order API.
- [x] Mapping status pengiriman (Confirmed -> Delivered).
- [x] Paham skema Webhooks dan limitasi Shipping Label.
- [x] Implementasi script testing untuk alur Draft Order.


---
*Dokumen ini akan diperbarui seiring dengan perkembangan integrasi.*
