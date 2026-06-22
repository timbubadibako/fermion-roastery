# 🎯 Fermion Roastery: Production Test Plan

Sebelum melakukan peresmian (*Grand Launching*) untuk sistem *e-commerce*, kita wajib melakukan simulasi uji coba untuk memastikan tidak ada celah bisnis yang merugikan (misal: *user* biasa mendapat harga grosir B2B).

Silakan jadikan daftar ini sebagai panduan pengujian manual Anda (atau kita bisa mengujinya bersama):

## 🛒 1. Skenario Retail (B2C / Pembeli Biasa)
*Fokus: Memastikan pelanggan biasa bisa berbelanja dengan mulus tanpa hambatan.*

- [ ] **Registrasi & Login:** Daftar menggunakan email baru, pastikan role otomatis menjadi `RETAIL`.
- [ ] **Katalog Harga:** Buka menu *Our Coffee*. Pastikan harga yang tampil adalah **Harga Retail** (bukan harga coret B2B).
- [ ] **Add to Cart:** Masukkan kopi ke keranjang, pastikan jumlah harga (*subtotal*) terhitung benar.
- [ ] **Checkout & Address:** Masukkan alamat tujuan (pastikan isian dinamis RT/RW dan jalan bisa diketik manual), pastikan ongkir terhitung (jika ada), lalu lunasi via *Payment Gateway*.
- [ ] **Success Page & Invoice:** Setelah bayar, pastikan *user* dilempar ke halaman `/retail/success` dan langsung melihat struk *invoice* (Order ID, daftar produk, dan total harga) hasil dari memori tagihan sementara.
- [ ] **Pembatasan B2B:** Pastikan akun Retail tidak memiliki akses ke halaman `/b2b` (Partner Hub).

---

## 🤝 2. Skenario B2B (Wholesale / Kafe)
*Fokus: Menguji alur perizinan, penyembunyian harga grosir, dan keranjang khusus B2B.*

- [ ] **Registrasi B2B:** Daftar di halaman Wholesale (*Partnership*). Pastikan *role* menjadi `B2B` dengan status `PENDING`.
- [ ] **Limitasi PENDING:** Saat login dalam status `PENDING`, pastikan:
  - Muncul notifikasi "Akun menunggu persetujuan".
  - Di halaman katalog kopi, **belum boleh** melihat Harga Grosir (masih Harga Retail).
- [ ] **Upload Dokumen:** Pastikan pendaftar B2B bisa mengunggah dokumen usaha (KTP/NIB/Foto Kafe).
- [ ] **Approval Admin:** Login sebagai `ADMIN`, setujui (*Approve*) akun B2B tersebut.
- [ ] **Akses Harga Spesial:** Login kembali sebagai akun B2B yang sudah di-*approve*. Pastikan sekarang harga di katalog otomatis berubah menjadi **Harga Grosir B2B**.
- [ ] **B2B Cart & Checkout:** *Ini poin krusial yang sempat error!* Masukkan kopi ke keranjang, pastikan:
  - Berlaku aturan MOQ (*Minimum Order Quantity*), misal minimal beli 1 kg.
  - Subtotal menggunakan *tier* harga B2B.

---

## 👑 3. Skenario Admin Portal
*Fokus: Kontrol penuh pemilik roastery atas pesanan dan mitra.*

- [ ] **Akses Terbatas:** Pastikan akun `RETAIL` atau `B2B` tidak bisa membuka `/admin`. Hanya akun khusus `ADMIN` yang bisa masuk.
- [ ] **Review Partner:** Buka menu persetujuan B2B, pastikan dokumen bisa di- *preview*, dan ada tombol *Approve/Reject*.
- [ ] **Manajemen Produk:** Coba edit harga salah satu biji kopi (misal ubah harga retail dari 95rb menjadi 100rb). Pastikan perubahannya langsung *live* di *frontend*.
- [ ] **Daftar Pesanan:** Pastikan pesanan masuk dari uji coba (Retail/B2B) muncul rapi di *dashboard* pesanan.
