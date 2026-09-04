# AGENTS.md — Fermion Roastery Project Context & Rules

## 1. Identity & Purpose
- **Project Name**: Fermion Roastery (`fermion-roastery`)
- **Type**: Web Commerce Platform (Owned Marketplace)
- **Owner**: Syifa Pajril Yaum
- **Goal**: Marketplace mandiri untuk penjualan specialty coffee beans & produk espresso Fermion Roastery langsung dari brand. Mengurangi ketergantungan pada marketplace pihak ketiga (Shopee/Tokopedia dengan fee ~30%) serta memperkuat brand trust & keseriusan brand.
- **Target Users**: Pembeli retail specialty coffee, pelanggan subscription, dan partner B2B/cafe.

---

## 2. Architecture & Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, GSAP, Framer Motion.
- **Backend**: Express.js (Node.js ES Modules).
- **Database & Auth**: Supabase (Postgres & Auth).
- **Integrations**: Payment Gateway (Xendit), Shipping (Biteship), Realtime/Notifications (Ably), Email service.
- **Deployment**: Vercel (Frontend & Serverless Backend export).

---

## 3. Current Focus & Priorities
1. **Storefront Quality & Performance**: Optimasi Lighthouse (LCP & TBT di mobile/desktop), hero media (image-first strategy), dan penataan layout.
2. **Copywriting & Brand Messaging**: Menyempurnakan bahasa/copywriting untuk memperkuat positioning specialty coffee & CTA.
3. **Transaction & Payment Readiness**: Validasi integrasi Xendit secara end-to-end dengan kredensial & environment yang benar.
4. **Manual-First Verification**: Pengujian diarahkan ke manual-first sampai kebutuhan automation Playwright diaktifkan kembali.

---

## 4. Key Decisions & Business Rules
- **Anti-Ritual Rule**: Hindari istilah *"Ritual"* untuk order/berlangganan/proses bisnis. Gunakan istilah lugas seperti *Pesanan*, *Kemitraan*, atau *Berlangganan*.
- **Visual & Typography**: Utamakan tipografi sans-serif yang bersih, profesional, dan mudah dibaca. Hindari font dekoratif/handwritten pada UI fungsional.
- **Honest Status**: Gunakan status yang jujur (`confirmed`, `planned`, `not yet validated`) terutama untuk readiness payment & deployment.

---

## 5. Antigravity Configuration & Token Efficiency
- **Project Customizations**: Tersimpan di `.agents/`
  - Skills: `.agents/skills/` (`frontend-design`, `cavecrew`, `caveman`, `caveman-commit`, `caveman-review`, dll)

- **CodeGraph**: Selalu utamakan pengindeksan `.codegraph/` (via MCP tool `codegraph_explore`) saat mencari simbol/relasi fungsi sebelum melakukan `grep` atau membaca banyak file manual.
- **Token Efficiency**: Respon dibuat ringkas, langsung ke poin utama, dan menghindari penjelasan berulang atau bertele-tele (mendukung gaya *Caveman mode* saat diminta atau untuk riset mendalam).

