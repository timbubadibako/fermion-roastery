# Architecture

## System Shape
- Summary: sistem terdiri dari frontend Next.js App Router dan backend Express yang dipisah, dengan Supabase sebagai layanan data dan autentikasi utama, serta integrasi payment dan notifikasi di backend.
- Main modules: storefront frontend, authentication and account area, B2B area, admin or backoffice area, backend API routes, payment handling, content and journal management, shipping and order tracking.
- Main flows: user melihat katalog di frontend, frontend memanggil backend API, backend berinteraksi dengan Supabase dan layanan eksternal, lalu frontend menampilkan status order, account, atau checkout result.

## Stack
- Frontend: Next.js 16, React 19, TypeScript, App Router, Tailwind-based styling, GSAP, Framer Motion.
- Backend: Node.js Express application dengan ES modules.
- Database: Supabase Postgres dan Supabase Auth-related integration.
- Infra: Vercel-oriented deployment shape untuk frontend dan serverless-style backend export.
- Tooling: npm, Playwright untuk e2e frontend, ESLint, local `.env` based configuration.

## Data and Boundaries
- Core entities: products, cart, orders, subscriptions, partners B2B, inventory, journal content, shipping data, payments, user accounts.
- Important interfaces: frontend ke backend via `NEXT_PUBLIC_API_URL`, backend ke Supabase, backend ke payment gateway, backend ke email and shipping services.
- External dependencies: Supabase, Xendit, Biteship, email provider, Ably, dan deployment environment di Vercel.

## Constraints
- Technical constraints: frontend dan backend berjalan sebagai aplikasi terpisah dengan env yang harus konsisten.
- Technical constraints: sebagian readiness integrasi produksi belum bisa dianggap tervalidasi tanpa uji nyata.
- Product constraints: storefront harus sekaligus menjual produk dan memperkuat persepsi brand premium.
- Product constraints: optimasi performa dan kualitas presentasi visual punya dampak bisnis langsung terhadap trust dan conversion.
