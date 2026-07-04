# Fermion Roastery Production Optimization Todo

Dokumen ini berisi checklist kerja untuk production readiness, SEO, security, business flow testing, invoice/export integrity, dan review UI/UX.

## Audit Status 2026-06-28

Legenda:
- `DONE`: sudah ada implementasi nyata di repo.
- `PARTIAL`: sudah disentuh, tapi belum lengkap atau belum cukup aman untuk production.
- `TODO`: belum terlihat implementasinya atau belum terverifikasi.

### Ringkasan Per Area

#### Production Readiness

- `DONE` metadata base, canonical root, OG, Twitter, dan robots global sudah memakai fallback `NEXT_PUBLIC_SITE_URL` di [`frontend/app/layout.tsx`](/home/jrilym/Projects/Next/fermion-roastery/frontend/app/layout.tsx).
- `DONE` `robots.txt` dan `sitemap.xml` sudah memakai domain yang sama dengan fallback production di [`frontend/app/robots.ts`](/home/jrilym/Projects/Next/fermion-roastery/frontend/app/robots.ts) dan [`frontend/app/sitemap.ts`](/home/jrilym/Projects/Next/fermion-roastery/frontend/app/sitemap.ts).
- `DONE` font brand sudah self-hosted lewat [`frontend/app/globals.css`](/home/jrilym/Projects/Next/fermion-roastery/frontend/app/globals.css) dengan `PermanentMarker-Regular.ttf` di [`frontend/app/fonts/PermanentMarker-Regular.ttf`](/home/jrilym/Projects/Next/fermion-roastery/frontend/app/fonts/PermanentMarker-Regular.ttf).
- `PARTIAL` homepage masih penuh `dynamic(..., { ssr: false })` di [`frontend/app/page.tsx`](/home/jrilym/Projects/Next/fermion-roastery/frontend/app/page.tsx), jadi audit SSR/bundle belum selesai.
- `PARTIAL` sitemap sudah memakai `revalidate: 3600`, tapi data publik utama lain masih banyak fetch client-side tanpa caching server yang jelas.
- `PARTIAL` health endpoint dasar sudah ada di [`backend/index.js`](/home/jrilym/Projects/Next/fermion-roastery/backend/index.js), tapi masih di `/` dan belum ada endpoint monitoring yang lebih eksplisit seperti `/api/health`.
- `TODO` bundle audit per route belum terlihat.
- `TODO` structured logging belum ada; backend masih dominan `console.log`.
- `TODO` request logging production masih mentah dan terlalu verbose.
- `TODO` error boundary public/private belum saya temukan diaudit khusus.

#### SEO

- `DONE` sitemap publik sudah mencakup `/`, `/our-coffee`, `/our-coffee/[id]`, `/wholesale`, `/subscription`, `/our-story`, `/journal`, `/journal/[id]`, dan `/contact` di [`frontend/app/sitemap.ts`](/home/jrilym/Projects/Next/fermion-roastery/frontend/app/sitemap.ts).
- `DONE` robots sudah memblok private route utama seperti `/admin`, `/auth`, `/cart`, `/b2b`, dan success/failure retail/subscription di [`frontend/app/robots.ts`](/home/jrilym/Projects/Next/fermion-roastery/frontend/app/robots.ts).
- `DONE` beberapa layout private sudah `noindex` seperti [`frontend/app/admin/layout.tsx`](/home/jrilym/Projects/Next/fermion-roastery/frontend/app/admin/layout.tsx), [`frontend/app/auth/layout.tsx`](/home/jrilym/Projects/Next/fermion-roastery/frontend/app/auth/layout.tsx), [`frontend/app/b2b/layout.tsx`](/home/jrilym/Projects/Next/fermion-roastery/frontend/app/b2b/layout.tsx), [`frontend/app/cart/layout.tsx`](/home/jrilym/Projects/Next/fermion-roastery/frontend/app/cart/layout.tsx), dan invoice B2B private.
- `DONE` canonical dan metadata per halaman sudah mulai diterapkan pada halaman publik penting seperti [`frontend/app/our-story/layout.tsx`](/home/jrilym/Projects/Next/fermion-roastery/frontend/app/our-story/layout.tsx), [`frontend/app/our-coffee/layout.tsx`](/home/jrilym/Projects/Next/fermion-roastery/frontend/app/our-coffee/layout.tsx), [`frontend/app/wholesale/layout.tsx`](/home/jrilym/Projects/Next/fermion-roastery/frontend/app/wholesale/layout.tsx), [`frontend/app/journal/layout.tsx`](/home/jrilym/Projects/Next/fermion-roastery/frontend/app/journal/layout.tsx), dan route dinamis produk/journal.
- `PARTIAL` structured data baru kuat di level `Organization` dan `WebSite` pada root layout. `Product`, `Article`, `BreadcrumbList`, dan `FAQPage` belum terlihat konsisten.
- `PARTIAL` sitemap dynamic masih fetch ke `/products` dan `/journal`, tetapi belum tampak filter eksplisit untuk memastikan hanya konten publik yang masuk index.
- `TODO` audit heading structure, internal linking, dan title/description yang benar-benar spesifik per landing page belum selesai.

#### Security

- `DONE` banyak route admin/private sudah memakai `verifyAuth` dan `verifyAdmin`, termasuk product/admin/order B2B private.
- `DONE` akses order detail dan invoice sekarang sudah dibatasi owner atau admin di [`backend/controllers/orderController.js`](/home/jrilym/Projects/Next/fermion-roastery/backend/controllers/orderController.js).
- `PARTIAL` rate limiter baru terlihat untuk contact di [`backend/lib/security.js`](/home/jrilym/Projects/Next/fermion-roastery/backend/lib/security.js), belum menyeluruh ke login/register/B2B/webhook.
- `PARTIAL` upload file sudah lewat `multer`, tapi audit MIME whitelist, size limit, dan sanitization belum terlihat komplet.
- `TODO` backend masih `app.use(cors())` default di [`backend/index.js`](/home/jrilym/Projects/Next/fermion-roastery/backend/index.js); ini belum aman untuk production.
- `TODO` verifikasi signature webhook payment/shipping belum saya lihat ditegakkan.
- `TODO` audit trail admin action belum ada.
- `TODO` review secret exposure frontend/backend belum terverifikasi penuh.

#### Business Flow

- `DONE` beberapa bug penting flow B2B sudah diperbaiki:
  - checkout cart B2B tidak lagi kosong jika item tidak punya flag eksplisit,
  - invoice manual/tempo tidak lagi 500 karena flow PDF,
  - download invoice B2B sudah aktif,
  - tracking shipment aktif untuk status manual payment,
  - list pantau kiriman sudah dipaginasi.
- `PARTIAL` flow admin order untuk NET30 dan cash manual sudah punya aksi operasional dasar, termasuk `Tandai Lunas`, `Konfirmasi Tunai`, dan `Ingatkan`.
- `PARTIAL` invoice storage ke Supabase sudah ditambahkan di generator PDF, tetapi saat ini download invoice masih diregenerasi setiap request agar template selalu mutakhir.
- `TODO` retail purchase flow belum terdokumentasi teruji end-to-end.
- `TODO` B2B approval flow belum saya lihat ditandai hasil test aktual satu per satu.
- `TODO` export finance/report/invoice/partner/order belum saya verifikasi.
- `TODO` idempotency webhook, race condition, dan single source of truth status masih terbuka.

#### Testing

- `PARTIAL` file Playwright dan script E2E ada di repo frontend, tetapi workflow aktif saat ini diposisikan manual-first.
- `PARTIAL` artifact automation boleh disimpan sebagai referensi teknis, tetapi jangan dianggap jalur verifikasi utama sampai owner mengaktifkannya kembali.
- `TODO` belum ada setup test automation yang benar-benar siap dipakai lintas environment.
- `TODO` belum terlihat unit test, integration test, maupun E2E test framework aktif sebagai kualitas bar utama.

#### UI/UX

- `DONE` identitas visual brand publik sudah kuat dan khas.
- `DONE` area transaksi B2B terbaru sudah lebih fungsional dibanding sebelumnya, terutama invoice dan shipping tracker.
- `PARTIAL` masih ada gap konsistensi antara area editorial/public dan area transaksi/admin.
- `PARTIAL` homepage tetap berat karena banyak section client-only dan animasi.
- `TODO` audit kontras, affordance, mobile density, dan hierarchy CTA lintas flow transaksi belum selesai penuh.

## 1. Production Readiness

- [x] Ganti `next/font/google` di [`frontend/app/layout.tsx`](../frontend/app/layout.tsx) ke font lokal/self-hosted agar build tidak bergantung ke Google Fonts.
- [x] Samakan sumber domain utama untuk metadata, robots, dan sitemap dengan `NEXT_PUBLIC_SITE_URL`.
- [x] Tambahkan fallback yang aman untuk env production; jangan biarkan sitemap/metadata jatuh ke host lokal.
- [ ] Audit semua page yang memakai `dynamic(..., { ssr: false })` di homepage.
- [ ] Pertahankan `ssr: false` hanya untuk komponen yang benar-benar butuh browser API.
- [ ] Pindahkan komponen yang bisa SSR kembali ke server render agar TTFB dan SEO lebih baik.
- [ ] Tambahkan caching/revalidate untuk data publik:
  - [x] products
  - [x] journal posts
  - [x] FAQ
  - [ ] content marketing pages
- [ ] Tambahkan health endpoint backend yang jelas untuk monitoring uptime.
- [ ] Kurangi logging request mentah di production.
- [ ] Tambahkan structured logging untuk aksi bisnis penting:
  - [ ] order creation
  - [ ] payment webhook
  - [ ] B2B approval
  - [ ] invoice generation
  - [ ] export file generation
- [ ] Audit bundle size per route.
- [ ] Pisahkan paket berat dari homepage jika tidak dibutuhkan di initial load.
- [ ] Optimalkan semua image remote dengan domain allowlist dan ukuran yang tepat.
- [ ] Tambahkan loading state yang konsisten untuk request data publik dan private.
- [ ] Pastikan error boundary tidak menampilkan error internal ke user.

## 2. SEO

- [x] Lengkapi sitemap production dengan semua halaman publik yang layak diindeks.
- [ ] Pastikan sitemap memasukkan:
  - [x] `/`
  - [x] `/our-coffee`
  - [x] `/our-coffee/[id]`
  - [x] `/wholesale`
  - [x] `/subscription`
  - [x] `/our-story`
  - [x] `/journal`
  - [x] `/journal/[id]`
  - [x] `/contact`
  - [ ] halaman publik B2B yang memang intended to index
- [ ] Pastikan sitemap mengambil data dynamic dari API hanya untuk konten publik.
- [ ] Jangan masukkan ke sitemap:
  - [x] `/admin/*`
  - [x] `/auth*`
  - [x] `/cart`
  - [x] checkout pages
  - [x] success/failure pages
  - [x] invoice detail private
  - [x] settings private
- [x] Tambahkan `noindex` untuk semua halaman private dan transactional.
- [x] Tambahkan canonical URL per halaman publik.
- [x] Tambahkan metadata spesifik untuk tiap landing page.
- [x] Tambahkan Open Graph dan Twitter metadata per halaman utama.
- [ ] Audit heading structure:
  - [ ] satu `h1` per halaman
  - [ ] urutan `h2/h3` konsisten
  - [ ] jangan pakai heading hanya demi style
- [ ] Tambahkan structured data:
  - [x] Organization
  - [ ] Product
  - [ ] BreadcrumbList
  - [ ] Article untuk journal
  - [ ] FAQPage untuk FAQ
- [x] Tambahkan internal link yang jelas dari home ke halaman komersial utama.
- [ ] Buat title dan description yang lebih spesifik, bukan satu set generic untuk semua halaman.
- [x] Pastikan `robots.txt` selaras dengan strategi index/noindex.

## 3. Security

- [ ] Ganti `cors()` default di backend dengan allowlist origin production.
- [ ] Tambahkan rate limit untuk:
  - [ ] login
  - [ ] register
  - [x] contact form
  - [ ] B2B registration
  - [ ] payment webhook
- [ ] Audit semua endpoint publik dan pastikan memang sengaja public.
- [ ] Tambahkan validasi input ketat di semua route yang menerima data user.
- [ ] Pastikan webhook payment dan shipping divalidasi dengan signature/secret verification.
- [x] Pastikan endpoint admin dan B2B private benar-benar pakai middleware auth + role.
- [ ] Audit upload file:
  - [ ] MIME whitelist
  - [ ] size limit
  - [ ] sanitization
  - [ ] penyimpanan aman
- [ ] Pastikan error response tidak membocorkan stack trace di production.
- [ ] Review semua `.env` agar secret backend tidak pernah masuk frontend.
- [ ] Audit endpoint export file agar tidak bisa diakses tanpa otorisasi.
- [x] Pastikan order, invoice, dan ledger detail hanya bisa diakses oleh owner atau admin yang sah.
- [ ] Tambahkan audit trail untuk aksi admin:
  - [ ] approve partner
  - [ ] update order
  - [ ] delete product
  - [ ] generate contract
  - [ ] export file

## 4. Retail Flow

- [ ] Test browse katalog retail.
- [ ] Test detail produk retail.
- [ ] Test add to cart.
- [ ] Test update quantity.
- [ ] Test remove item.
- [ ] Test checkout retail.
- [ ] Test payment initiation.
- [ ] Test payment success.
- [ ] Test payment failure.
- [ ] Test order status setelah pembayaran.
- [ ] Test invoice retail terbentuk.
- [ ] Test email/notification setelah order dibuat.
- [ ] Test halaman akun menampilkan order yang benar.
- [ ] Test tidak ada order dobel saat refresh/retry.
- [ ] Test pembulatan harga dan ongkir konsisten.

## 5. B2B Approval Flow

- [ ] Test pendaftaran B2B.
- [ ] Test submission masuk sebagai pending.
- [ ] Test admin bisa lihat list applicant.
- [ ] Test admin approve partner.
- [ ] Test admin reject partner.
- [ ] Test status partner berubah sesuai aksi admin.
- [ ] Test portal hanya terbuka untuk partner yang sudah approved.
- [ ] Test partner pending tidak bisa akses fitur khusus.
- [ ] Test partner approved bisa akses katalog B2B.
- [ ] Test partner approved bisa lihat price list dan info kontrak.
- [ ] Test partner status sinkron antara frontend, backend, dan database.
- [ ] Test perubahan status tidak menimbulkan state stale di UI.

## 6. B2B Purchase Flow

- [ ] Test login partner.
- [ ] Test akses katalog B2B.
- [ ] Test add to cart B2B.
- [ ] Test checkout B2B.
- [ ] Test invoice B2B terbentuk.
- [ ] Test aturan payment term B2B.
- [ ] Test shipping request atau label.
- [ ] Test tracking status pengiriman.
- [ ] Test order status update.
- [ ] Test ledger ikut update.
- [ ] Test cancel order sesuai aturan bisnis.
- [ ] Test re-order dari histori pembelian.
- [ ] Test akses hanya berdasarkan role partner.

## 7. Invoice and Finance

- [ ] Test invoice number unik.
- [ ] Test invoice PDF generation.
- [ ] Test invoice content sesuai order.
- [ ] Test subtotal, ongkir, pajak, diskon, dan grand total.
- [ ] Test timezone dan tanggal pada invoice.
- [ ] Test partial payment.
- [ ] Test full payment.
- [ ] Test manual transaction entry.
- [ ] Test payment status sinkron dengan invoice status.
- [ ] Test export ledger bulanan.
- [ ] Test export finance report.
- [ ] Test export order report.
- [ ] Test export partner report.
- [ ] Test export invoice list.
- [ ] Test filter export berdasarkan tanggal dan status.
- [ ] Test export dataset besar.
- [ ] Test export dengan karakter non-ASCII.
- [ ] Test export dengan field kosong.
- [ ] Test export tidak merusak format angka mata uang.
- [ ] Test export tidak double count transaksi.
- [ ] Test hasil export bisa dibuka di spreadsheet umum.

## 8. Data Consistency

- [ ] Jadikan satu sumber kebenaran untuk status order.
- [ ] Jadikan satu sumber kebenaran untuk status payment.
- [ ] Jadikan satu sumber kebenaran untuk status invoice.
- [ ] Jadikan satu sumber kebenaran untuk status approval partner.
- [ ] Tambahkan idempotency untuk webhook.
- [ ] Pastikan retry webhook tidak menggandakan transaksi.
- [ ] Pastikan update status tidak race-condition.
- [ ] Audit sinkronisasi Supabase, backend API, dan frontend state.
- [ ] Tambahkan migration/seed yang jelas untuk status enum dan relasi penting.

## 9. Testing

- [ ] Unit test untuk formatter currency.
- [ ] Unit test untuk generator invoice.
- [ ] Unit test untuk mapper status order/payment/invoice.
- [ ] Unit test untuk helper export.
- [ ] Unit test untuk validasi payload.
- [ ] Integration test untuk public API route.
- [ ] Integration test untuk private API route.
- [ ] Integration test untuk auth middleware.
- [ ] Integration test untuk webhook handler.
- [ ] E2E test untuk retail purchase.
- [ ] E2E test untuk B2B approval.
- [ ] E2E test untuk B2B purchase.
- [ ] E2E test untuk invoice generation.
- [ ] E2E test untuk export file.
- [ ] E2E test untuk admin order update.
- [ ] SEO test untuk sitemap dan robots.
- [ ] Security test untuk unauthorized access.
- [ ] Security test untuk invalid payload.
- [ ] Security test untuk rate limit.

## 10. UI/UX Analysis

- [ ] Visual direction sudah kuat dan khas.
- [ ] Ada identitas editorial yang konsisten: tekstur, pastel, blok asimetris, dan gaya scrapbook/archive.
- [ ] Tone visual terasa premium dan arty, cocok untuk brand specialty coffee.
- [ ] Penggunaan `font-cloude` memberi karakter kuat dan memorable.
- [ ] Warna brand cukup kaya, tidak generik, dan ada diferensiasi antara retail, story, journal, dan B2B.
- [ ] Animasi GSAP dan Framer Motion memberi pengalaman mewah, tapi berisiko berat di mobile.
- [ ] Homepage sangat visual-first, jadi konten utama bisa terasa lambat muncul kalau JS berat.
- [ ] Banyak section punya style sangat khas, tapi ada risiko konsistensi menurun kalau variasi visual terlalu banyak.
- [ ] Beberapa halaman publik memakai layout editorial yang panjang, bagus untuk storytelling tapi kurang cepat discan.
- [ ] Produk dan CTA kadang kalah dominan dibanding efek visual.
- [ ] Perlu hierarki yang lebih tegas antara:
  - [ ] hero
  - [ ] value proposition
  - [ ] social proof
  - [ ] product actions
  - [ ] CTA conversion
- [ ] Beberapa elemen dekoratif seperti noise overlay, blob background, clip-path section, dan rotation effect sangat khas, tapi perlu dibatasi di area transaksi.
- [ ] Di halaman commerce, desain idealnya harus lebih langsung daripada halaman brand/story.
- [ ] Di mobile, risiko terbesar adalah:
  - [ ] layout terlalu padat
  - [ ] text terlalu panjang
  - [ ] animasi terlalu banyak
  - [ ] CTA terlalu kecil atau tersembunyi
- [ ] Audit kontras warna di beberapa area pastel agar tetap aman untuk aksesibilitas.
- [ ] Audit ukuran heading besar supaya tidak memecah viewport terlalu ekstrem di layar kecil.
- [ ] Audit loading skeleton agar pengalaman tunggu terasa intentional, bukan kosong.
- [ ] Audit form UX untuk checkout, auth, B2B register, dan invoice/payment flows.

## 11. UI/UX Improvements

- [ ] Jadikan halaman transaksi lebih utilitarian.
- [ ] Pertahankan gaya visual kuat di homepage, journal, dan story.
- [ ] Kurangi dekorasi pada checkout, admin, dan portal B2B.
- [ ] Perjelas CTA primer di setiap halaman publik.
- [ ] Buat kontras yang lebih kuat untuk teks utama di atas background terang.
- [ ] Pastikan `h1` langsung menjelaskan value proposition, bukan cuma estetika.
- [ ] Kurangi elemen yang menambah beban visual tanpa kontribusi ke konversi.
- [ ] Pastikan section above-the-fold memberi jawaban cepat:
  - [ ] ini brand apa
  - [ ] jual apa
  - [ ] untuk siapa
  - [ ] next action apa
- [ ] Audit spacing antar section supaya ritme lebih jelas dan tidak terlalu rapat.
- [ ] Perbaiki konsistensi button style antara retail, B2B, dan admin.
- [ ] Pastikan komponen data-heavy selalu punya empty state dan loading state yang layak.
- [ ] Pastikan tabel dan list admin punya hierarchy yang mudah discan.
- [ ] Buat state pending/approved/failed lebih eksplisit secara visual.
- [ ] Tambahkan affordance yang jelas untuk copy invoice, download PDF, export CSV, dan print.

## 12. Execution Priority

- [ ] Prioritas 1: font lokal, sitemap, robots, noindex, metadata.
- [ ] Prioritas 2: CORS, rate limit, webhook security, auth hardening.
- [ ] Prioritas 3: retail flow test, B2B approval test, B2B purchase test.
- [ ] Prioritas 4: invoice/finance/export integrity test.
- [ ] Prioritas 5: bundle cleanup, SSR selective, caching, performance.
- [ ] Prioritas 6: UI/UX refinement untuk transaksi, mobile, accessibility, dan conversion.

## 13. Brand Copy Foundation

Bagian ini adalah materi copy yang bisa diolah menjadi:
- [ ] copy homepage
- [ ] copy about / our story
- [ ] copy our coffee
- [ ] SEO title and description
- [ ] structured content untuk sitemap dan metadata
- [ ] schema data untuk Organization, Product, Article, dan FAQ

### FERMION ROASTERY

**Filosofi Identitas Nama**

FERMION ROASTERY adalah representasi dari keyakinan bahwa hal-hal terkecil memiliki dampak terbesar.

Terinspirasi dari fermion, partikel fundamental penyusun alam semesta yang tidak dapat dilihat secara langsung, kami membangun setiap proses roasting dengan perhatian terhadap detail pada tingkat paling mendasar. Mulai dari karakter varietas, fermentasi, kadar air, densitas biji, hingga pengembangan profil sangrai, semuanya diperlakukan sebagai elemen yang saling membentuk hasil akhir.

Kami tidak hanya memanggang kopi. Kami menyusun setiap variabel kecil menjadi pengalaman rasa yang kompleks, bersih, dan presisi.

Because what is invisible often shapes everything we can taste.

### Our Coffee

Di FERMION ROASTERY, kami membagi fokus menjadi dua lini utama yang dirancang untuk kebutuhan penikmat kopi yang berbeda, namun memiliki prinsip yang sama: presisi, transparansi, dan pengalaman rasa terbaik.

#### Filter Coffee

Lini Filter Coffee berfokus pada Micro Lot, Nano Lot, hingga Exotic Lot, dengan prioritas utama kopi-kopi terbaik dari Indonesia. Namun eksplorasi kami tidak berhenti di dalam negeri. Kami juga mengkurasi origin-origin internasional yang memiliki karakter unik dan layak untuk dieksplorasi.

Line-up kami diperbarui setiap bulan, karena kami percaya bahwa kopi adalah perjalanan rasa yang terus berkembang. Setiap rilis baru adalah kesempatan untuk memperluas referensi sensorik, mengenal terroir yang berbeda, memahami berbagai metode proses, serta menikmati keberagaman karakter kopi dari berbagai penjuru dunia.

Kami tidak hanya menjual kopi, kami mengajak Anda membangun perbendaharaan rasa.

#### Espresso Roast

Lini Espresso Roast dikembangkan dengan pendekatan ilmiah agar menghasilkan kopi yang mudah di-dial, konsisten, dan presisi.

Pada setiap batch, kami mengontrol beberapa variabel penting seperti Agtron, Weight Loss, dan Density Yield, sehingga karakter ekstraksi antar batch tetap konsisten.

Dengan variabel roasting yang telah kami kunci, Anda tidak perlu menghabiskan banyak waktu mencari sweet spot. Kami merancang espresso roast ini agar proses dial-in menjadi jauh lebih sederhana, cukup mengoptimalkan satu variabel utama sesuai preferensi dan mesin yang digunakan, sementara fondasi rasa tetap konsisten.

Hasilnya adalah proses dial-in yang lebih cepat, lebih mudah, dan lebih dapat diprediksi, baik untuk home brewer maupun barista profesional.

### SEO Notes

- [ ] Pecah copy ini menjadi blok konten yang terstruktur per halaman.
- [ ] Jadikan paragraf inti sebagai basis `meta description` dan intro section.
- [ ] Masukkan kata kunci natural seperti:
  - [ ] specialty coffee roastery
  - [ ] filter coffee
  - [ ] espresso roast
  - [ ] micro lot
  - [ ] nano lot
  - [ ] exotic lot
  - [ ] precision roasting
  - [ ] Indonesian coffee
- [ ] Buat versi ringkas untuk homepage hero dan versi panjang untuk `our-story`.
- [ ] Pisahkan copy retail vs B2B agar sitemap dan metadata tidak terlalu generik.
- [ ] Gunakan copy ini sebagai sumber untuk structured data dan internal linking antar halaman publik.

### Homepage Short Copy

#### Hero Headline

Fermion Roastery

#### Hero Subheadline

Kami merangkai detail-detail terkecil menjadi pengalaman kopi yang kompleks, bersih, dan presisi.

#### Hero Support Copy

Terinspirasi dari fermion, partikel fundamental yang membentuk alam semesta, kami percaya bahwa hal-hal yang tak terlihat sering kali menentukan hasil akhir yang paling terasa. Karena itu, setiap keputusan roasting kami dibangun dari perhatian terhadap variabel paling mendasar: varietas, fermentasi, kadar air, densitas, dan pengembangan profil sangrai.

#### Homepage Value Copy

Di Fermion Roastery, kami menghadirkan dua lini utama yang dirancang untuk kebutuhan yang berbeda, namun berangkat dari prinsip yang sama: presisi, transparansi, dan rasa yang terukur.

- Filter Coffee untuk eksplorasi Micro Lot, Nano Lot, Exotic Lot, dan origin pilihan dari Indonesia maupun mancanegara.
- Espresso Roast untuk hasil sangrai yang konsisten, mudah di-dial, dan siap dipakai home brewer maupun barista profesional.

#### Homepage CTA Copy

- Explore Our Coffee
- Read Our Story
- Start Wholesale Inquiry

### Our Story Long Copy

#### Section 1

FERMION ROASTERY adalah representasi dari keyakinan bahwa hal-hal terkecil memiliki dampak terbesar.

Nama Fermion terinspirasi dari partikel fundamental penyusun alam semesta yang tidak dapat dilihat secara langsung, tetapi keberadaannya membentuk struktur yang kita rasakan setiap hari. Bagi kami, filosofi itu menjadi dasar cara bekerja di roastery: fokus pada detail yang paling kecil, paling halus, dan paling menentukan.

Setiap batch kami mulai dari pertanyaan yang sangat spesifik. Bagaimana karakter varietas ini? Bagaimana fermentasinya? Seberapa tinggi kadar airnya? Bagaimana densitas bijinya? Apa yang harus terjadi selama roasting agar profil akhirnya seimbang, bersih, dan presisi?

Kami tidak melihat roasting sebagai proses sederhana. Kami melihatnya sebagai penyusunan banyak variabel kecil yang saling memengaruhi, lalu mengarahkannya menjadi pengalaman rasa yang utuh.

#### Section 2

Because what is invisible often shapes everything we can taste.

Kalimat itu merangkum cara kami bekerja. Tidak semua hal penting terlihat pada pandangan pertama. Sebagian justru berada pada lapisan yang sangat kecil: keputusan pada tahap sortasi, kontrol temperatur, durasi development, penyesuaian profil, dan cara tiap origin diperlakukan secara individual.

Bagi Fermion Roastery, kopi yang baik bukan hanya soal intensitas rasa. Kopi yang baik adalah kopi yang memperlihatkan keteraturan, transparansi, dan niat di balik setiap lapisan rasa.

#### Section 3

Di Fermion Roastery, kami membagi fokus menjadi dua lini utama yang dirancang untuk kebutuhan penikmat kopi yang berbeda, namun memiliki prinsip yang sama: presisi, transparansi, dan pengalaman rasa terbaik.

Lini pertama adalah Filter Coffee. Di sini kami berfokus pada Micro Lot, Nano Lot, hingga Exotic Lot, dengan prioritas utama kopi-kopi terbaik dari Indonesia. Namun eksplorasi kami tidak berhenti di dalam negeri. Kami juga mengkurasi origin-origin internasional yang memiliki karakter unik dan layak untuk dieksplorasi.

Line-up kami diperbarui setiap bulan karena kami percaya bahwa kopi adalah perjalanan rasa yang terus berkembang. Setiap rilis baru adalah kesempatan untuk memperluas referensi sensorik, mengenal terroir yang berbeda, memahami berbagai metode proses, serta menikmati keberagaman karakter kopi dari berbagai penjuru dunia.

Kami tidak hanya menjual kopi. Kami mengajak Anda membangun perbendaharaan rasa.

#### Section 4

Lini kedua adalah Espresso Roast. Program ini dikembangkan dengan pendekatan ilmiah agar menghasilkan kopi yang mudah di-dial, konsisten, dan presisi.

Pada setiap batch, kami mengontrol beberapa variabel penting seperti Agtron, Weight Loss, dan Density Yield, sehingga karakter ekstraksi antar batch tetap konsisten. Dengan variabel roasting yang telah kami kunci, Anda tidak perlu menghabiskan banyak waktu mencari sweet spot.

Kami merancang espresso roast ini agar proses dial-in menjadi jauh lebih sederhana. Anda cukup mengoptimalkan satu variabel utama sesuai preferensi dan mesin yang digunakan, sementara fondasi rasa tetap konsisten. Hasilnya adalah proses dial-in yang lebih cepat, lebih mudah, dan lebih dapat diprediksi, baik untuk home brewer maupun barista profesional.

#### Section 5

Fermion Roastery berdiri di atas keyakinan bahwa presisi bukanlah batasan kreativitas. Justru sebaliknya, presisi memberi ruang agar karakter kopi tampil lebih jernih, lebih jujur, dan lebih mudah dipahami.

Kami terus mengembangkan kurasi, roasting, dan penyajian dengan tujuan yang sama: menghadirkan kopi yang bukan hanya enak diminum, tetapi juga bermakna untuk dipelajari, dieksplorasi, dan diulang dengan konsisten.

#### Section 6

This is our way of roasting.
This is our way of seeing coffee.
This is Fermion Roastery.

### SEO-Friendly Structure

- [ ] `h1` homepage: singkat, brand-led, conversion-friendly.
- [ ] `h1` our-story: naratif namun tetap mengandung brand keyword.
- [ ] `h2` untuk filosofi identitas, `h2` untuk Our Coffee, `h2` untuk Filter Coffee, `h2` untuk Espresso Roast.
- [ ] `meta title` halaman story: `Fermion Roastery Story | Precision Coffee Roasting`.
- [ ] `meta description` halaman story: 150-160 karakter, memuat specialty coffee, filter coffee, espresso roast, dan precision roasting secara natural.
- [ ] Gunakan satu versi ringkas dari paragraf filosofi sebagai intro di homepage.
- [ ] Gunakan versi panjang ini sebagai isi utama `our-story` agar SEO punya depth konten yang cukup.
- [ ] Jadikan dua lini coffee sebagai anchor section untuk internal linking ke halaman produk dan wholesale.
