# Current Status

## Summary
- Current state: aplikasi sudah memiliki frontend Next.js dan backend Express terpisah, dengan integrasi Supabase dan payment-related flows yang sedang menuju validasi lebih nyata.
- Health: at-risk
- Last meaningful update: 2026-07-04

## Current Focus
- Focus now: meningkatkan kesiapan storefront publik dan checkout journey agar layak dipakai sebagai owned marketplace utama Fermion.
- Why this matters: nilai bisnis utama project ini adalah menurunkan ketergantungan pada marketplace fee tinggi sambil menaikkan trust dan kesan profesional brand.
- What is being worked on: perbaikan kualitas halaman publik, optimasi hero agar lebih image-first dan lebih ringan di mobile, review manual hasil perbaikan hero media, penguatan bahasa atau copy, kesiapan alur transaksi nyata, dan perpindahan workflow testing ke manual-first.

## Blockers
- Blocker: performa Lighthouse masih menjadi concern utama pada experience publik.
- Impact: kualitas first impression, SEO, dan perceived quality storefront bisa tertinggal walau produk dan brand positioning sudah kuat.
- Needed action: audit bottleneck halaman publik, media asset, script loading, dan rendering behavior per route utama.

- Update: poster hero sudah diganti agar memakai frame dari video yang sama.
- Impact: mismatch visual utama di atas fold sudah dikurangi, tetapi tetap perlu review manual di browser untuk memastikan hasilnya paling tepat.
- Needed action: pastikan poster baru terasa natural di desktop dan mobile, lalu lanjutkan audit media publik lain jika masih ada ketidakkonsistenan.

- Update: hero sekarang diposisikan image-first, dengan video hanya sebagai enhancement untuk desktop setelah idle.
- Impact: jalur LCP mobile seharusnya lebih ringan karena poster image menjadi konten utama yang diprioritaskan, sementara beban video dan GSAP tidak lagi dipaksakan ke semua user.
- Needed action: bandingkan Lighthouse baru melawan baseline sebelumnya dan cek apakah quality visual hero tetap terasa kuat.

- Blocker: copywriting atau kebahasaan belum optimal.
- Impact: value specialty coffee, positioning brand, dan kejelasan CTA bisa kurang terasa bagi calon pembeli.
- Needed action: review manual homepage yang sudah diperbarui, lalu lanjutkan penyempurnaan bahasa ke halaman publik lain secara bertahap.

- Blocker: alur transaksi belum tervalidasi memakai API payment asli secara end-to-end.
- Impact: readiness produksi untuk transaksi nyata belum bisa dianggap aman.
- Needed action: verifikasi integrasi payment gateway yang aktif di codebase, lalu uji flow nyata dengan environment dan kredensial yang benar.

- Blocker: automation testing tidak cocok dengan workflow owner saat ini dan environment lokal belum siap menjalankan Playwright secara mulus.
- Impact: test artifacts tetap ada, tetapi tidak boleh dianggap jalur verifikasi utama untuk pekerjaan dekat.
- Needed action: posisikan testing sebagai manual-first sampai kebutuhan automation diaktifkan kembali dengan sengaja.

## Active Streams
- Stream: storefront quality and performance
- Status: in progress
- Next checkpoint: baseline Lighthouse dan daftar prioritas optimasi route publik utama tercatat jelas.

- Stream: media correctness
- Status: in progress
- Next checkpoint: poster hero baru lolos review manual dan tidak ada mismatch visual mencolok di atas fold.

- Stream: transaction readiness
- Status: in progress
- Next checkpoint: payment flow diuji dengan gateway nyata yang benar-benar dipakai project.

- Stream: strategic documentation discipline
- Status: in progress
- Next checkpoint: `.brains` cukup akurat untuk dibaca agent Obsidian tanpa perlu mengandalkan chat lama.

## This Week
- Main target: ubah `.brains` dari bootstrap template menjadi dokumen strategis project yang nyata.
- Main target: petakan pekerjaan optimasi storefront paling dekat berdasarkan blocker yang sudah diketahui.
- Secondary target: pastikan status integrasi payment dan deployment didokumentasikan dengan jujur, termasuk yang belum tervalidasi.
- Avoid doing: menganggap flow transaksi sudah production-ready tanpa uji gateway nyata.
