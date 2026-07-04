# Integrations Context

## Confirmed in Repo
- Supabase: dipakai di frontend dan backend melalui env URL dan keys.
- Xendit: backend env example dan local env menunjukkan integration path tersedia.
- Biteship: backend env example dan local env menunjukkan shipping integration path tersedia.
- Email delivery: backend memiliki mail provider config dan email-related library usage.
- Ably: dependency dan backend helper tersedia untuk realtime-related needs.

## Payment Status
- Payment integration terlihat hadir di codebase backend.
- Validasi end-to-end dengan gateway nyata belum dianggap selesai dari konteks saat ini.
- Midtrans disebut sebagai kebutuhan uji nyata oleh owner, tetapi belum terkonfirmasi dari file yang sudah dibaca apakah aktif di implementasi saat ini.
- Default working assumption: gateway yang terbukti ada di env dan dependency harus diprioritaskan untuk audit lebih dulu.

## Deployment Shape
- Frontend diarahkan ke Vercel-style deployment.
- Backend memiliki shape yang mendukung local Express run dan exported handler untuk deployment.
- Environment contract produksi perlu dibandingkan dengan `docs/VERCEL_ENV_CONTRACT.md` sebelum menganggap deploy state aman.

## Integration Risks
- Risk: env key hadir tetapi flow bisnis nyata belum tervalidasi.
- Risk: integrasi payment atau shipping dapat tampak siap di codebase tetapi gagal pada credential, webhook, atau edge-case produksi.
- Risk: perbedaan config dev dan deploy dapat menyebabkan perilaku yang tidak terlihat dari local-only testing.
