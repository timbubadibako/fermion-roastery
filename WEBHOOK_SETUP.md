# Webhook Integration Summary - Fermion Roastery

Dokumen ini merangkum integrasi Webhook yang telah diimplementasikan untuk sistem pembayaran (Xendit) dan pengiriman (Biteship).

## 1. Webhook URL (Development)
Gunakan URL berikut untuk didaftarkan di dashboard masing-masing layanan. 
*Catatan: Ganti domain tunnel jika berubah.*

| Layanan | Event | Endpoint URL |
| :--- | :--- | :--- |
| **Xendit** | Payment Success / Expiry | `https://xvcs1ml0-3001.asse.devtunnels.ms/api/payments/webhook` |
| **Biteship** | Tracking Update (Status Paket) | `https://xvcs1ml0-3001.asse.devtunnels.ms/api/shipping/webhook` |

## 2. Fitur yang Diimplementasikan

### A. Alur Pembayaran (Xendit)
*   **Auto-Draft Biteship:** Saat invoice Xendit dibuat, sistem otomatis membuat *Draft Order* di Biteship.
*   **Flexible Lookup:** Webhook Xendit sekarang dapat mencari order berdasarkan `xendit_invoice_id` maupun internal `order_id`.
*   **Auto-Confirm:** Saat pembayaran statusnya `PAID`, sistem otomatis mengonfirmasi *Draft Order* di Biteship menjadi pesanan aktif dan mendapatkan nomor resi (AWB).
*   **Invoice PDF:** Generate invoice otomatis setelah pembayaran berhasil.

### B. Alur Pengiriman (Biteship)
*   **Auto-Status Update:** Menangani update status dari kurir secara otomatis.
*   **Drop-off Sync:** Jika paket di-dropoff ke agen dan di-scan, status di database akan otomatis berubah menjadi `SHIPPED`.
*   **Delivered Sync:** Mengubah status order menjadi `DELIVERED` saat paket sampai ke pelanggan.

## 3. Konfigurasi Penting

### VS Code Dev Tunnels
Agar pihak luar (Xendit/Biteship) bisa mengakses backend lokal lo, pastikan:
1.  Buka tab **Ports** di VS Code.
2.  Cari Port **3001**.
3.  Klik kanan pada kolom **Visibility** dan set ke **Public**.

### Environment Variables (`backend/.env`)
Pastikan variabel berikut sudah terisi dengan benar:
*   `XENDIT_SECRET_KEY`
*   `BITESHIP_API_KEY`

## 4. File Terkait
*   `backend/controllers/paymentController.js` (Logic Pembayaran)
*   `backend/controllers/shippingController.js` (Logic Pengiriman & Webhook)
*   `backend/routes/shippingRoutes.js` (Jalur API Webhook)
*   `BITESHIP_TESTING.md` (Panduan testing manual)

---
*Last Updated: Thursday, June 11, 2026*
