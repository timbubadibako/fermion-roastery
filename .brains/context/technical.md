# Technical Context

## Runtime
- Environments: frontend Next.js app dan backend Express app berjalan terpisah.
- Local ports from repo defaults: frontend `3000`, backend `3001`.
- Required services: Supabase, payment gateway, shipping service, email provider, dan deployment environment variables.
- Secret sources: `frontend/.env`, `backend/.env`, dan deployment environment di Vercel.

## Commands
- Frontend dev: jalankan `npm run dev` di `frontend/`.
- Frontend build: jalankan `npm run build` di `frontend/`.
- Frontend start: jalankan `npm run start` di `frontend/`.
- Backend dev: jalankan `npm run dev` di `backend/`.
- Backend start: jalankan `npm run start` di `backend/`.
- Frontend e2e: jalankan `npm run test:e2e` di `frontend/`.

## Current Observations
- Root repo tidak menyediakan single-command stack runner seperti root `package.json` atau `docker-compose`.
- Frontend dan backend memiliki dependency tree serta env masing-masing.
- Backend memiliki local dev server pada `PORT` dan mengekspor default app untuk shape deployment serverless.
- Frontend memakai `NEXT_PUBLIC_API_URL` untuk berkomunikasi dengan backend.

## Known Technical Risks
- Risk: local startup bisa gagal jika port frontend tidak bisa dibind atau environment tidak mengizinkan listen pada port default.
- Risk: readiness transaksi tidak boleh diasumsikan hanya dari keberadaan route atau env key.
- Risk: kualitas visual dan performa halaman publik punya dampak langsung pada persepsi kualitas brand.

## Working Rules
- Saat menyentuh arsitektur atau integrasi, update `.brains/architecture.md` dan `.brains/context/integrations.md`.
- Saat menemukan blocker teknis besar, update `.brains/current-status.md` dan `.brains/todo.md` pada sesi yang sama.
