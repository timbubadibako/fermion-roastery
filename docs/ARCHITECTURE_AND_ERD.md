# 🏗️ System Architecture & Database ERD Specification
## Fermion Roastery Platform (`fermion-roastery`)

---

## 1. High-Level Architecture (HLD)

Sistem **Fermion Roastery** mengadopsi arsitektur terpisah (*Decoupled Hybrid Web Commerce*) yang menggabungkan kecepatan render Next.js App Router dengan fleksibilitas backend Node.js (Express.js) dan keandalan Supabase (Postgres & Storage).

```text
[ Client Browsers / Mobile ]
           │
           ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Next.js 16 App Router (Frontend)                   │
│  - React 19, Tailwind CSS, GSAP, Framer Motion                          │
│  - Zustand State Management & i18n Dictionary                          │
│  - Spotlight Guide & Dev Notice Modal                                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST / Server Actions
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Express.js Backend API Engine                    │
│  - Auth Middleware & Role Guard (RETAIL, B2B, ADMIN)                   │
│  - Order Controller & PDF Invoice Generator                            │
│  - B2B Partner Contract & Volume Tier Processor                        │
└─────┬─────────────────────────────┬──────────────────────────────┬─────┘
      │                             │                              │
      ▼                             ▼                              ▼
┌──────────────┐          ┌───────────────────┐          ┌───────────────────┐
│ Supabase DB  │          │   Xendit Payment  │          │  Biteship Shipping│
│  (Postgres)  │          │  (QRIS/VA/Cards)  │          │ (Rates & Tracking)│
└──────────────┘          └───────────────────┘          └───────────────────┘
```

---

## 2. Low-Level Design (LLD) & Data Flow Architecture

Aplikasi mematuhi prinsip **Feature-First Clean Architecture** pada layer frontend dan backend:

1. **Presentation Layer**: React Client Components, GSAP/Framer Motion Animations, Zustand store (`useSpotlightStore`, `useCartStore`).
2. **Domain Layer**: Entitas bisnis utama (Order, Product, B2B Partner Tier, Subscription Loop).
3. **Data & Repository Layer**: Integration Controllers, Supabase Client (`lib/supabase.js`), PDF Exporter (`lib/pdfGenerator.js`), Email & Realtime Service (`lib/ably.js`).

---

## 3. Skema Entity Relationship Diagram (ERD Schema)

Berikut adalah struktur tabel utama pada database PostgreSQL Supabase:

### 3.1 Tabel `users`
Tabel akun pengguna terpusat untuk Retail, B2B, dan Admin.
- `id` (UUID, Primary Key)
- `email` (TEXT, Unique, Not Null)
- `name` (TEXT, Not Null)
- `phone` (TEXT)
- `role` (VARCHAR, Enum: `'RETAIL'`, `'B2B'`, `'ADMIN'`)
- `created_at` (TIMESTAMPTZ, Default: `NOW()`)

### 3.2 Tabel `products`
Katalog biji kopi specialty Fermion Roastery.
- `id` (UUID, Primary Key)
- `name` (TEXT, Not Null)
- `series` (VARCHAR, Enum: `'ESPRESSO'`, `'FILTER'`)
- `origin` (TEXT)
- `process_type` (TEXT) -- *Washed, Natural, Anaerobic, Honey*
- `altitude` (TEXT)
- `flavor_notes` (TEXT[])
- `price_250g` (NUMERIC, Not Null)
- `price_1kg` (NUMERIC, Not Null)
- `stock_gram` (INTEGER, Default: `0`)
- `is_active` (BOOLEAN, Default: `true`)

### 3.3 Tabel `orders`
Header transaksi pesanan retail dan B2B.
- `id` (UUID, Primary Key)
- `order_number` (TEXT, Unique, Not Null) -- *e.g. FR-20260906-001*
- `user_id` (UUID, Foreign Key -> `users.id`)
- `order_type` (VARCHAR, Enum: `'RETAIL'`, `'B2B_WHOLESALE'`, `'SUBSCRIPTION'`)
- `total_amount` (NUMERIC, Not Null)
- `discount_amount` (NUMERIC, Default: `0`)
- `status` (VARCHAR, Enum: `'PENDING'`, `'CONFIRMED'`, `'ROASTING'`, `'SHIPPED'`, `'COMPLETED'`, `'CANCELLED'`)
- `payment_status` (VARCHAR, Enum: `'UNPAID'`, `'PAID'`, `'TEMPO_NET30'`)
- `payment_method` (TEXT) -- *QRIS, VA_BCA, VA_MANDIRI, E_WALLET, CREDIT_CARD*
- `shipping_address` (JSONB)
- `tracking_number` (TEXT)
- `created_at` (TIMESTAMPTZ, Default: `NOW()`)

### 3.4 Tabel `order_items`
Rincian item di dalam pesanan.
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key -> `orders.id` ON DELETE CASCADE)
- `product_id` (UUID, Foreign Key -> `products.id`)
- `grind_option` (VARCHAR, Enum: `'WHOLE_BEAN'`, `'FILTER_GRIND'`, `'ESPRESSO_GRIND'`)
- `package_size` (VARCHAR, Enum: `'250G'`, `'1KG'`)
- `quantity` (INTEGER, Not Null)
- `unit_price` (NUMERIC, Not Null)
- `subtotal` (NUMERIC, Not Null)

### 3.5 Tabel `b2b_profiles`
Profil dan verifikasi kemitraan kafe B2B.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> `users.id`, Unique)
- `company_name` (TEXT, Not Null)
- `monthly_volume_est_kg` (INTEGER, Not Null)
- `tier_name` (VARCHAR, Enum: `'BRONZE'`, `'SILVER'`, `'GOLD'`)
- `contract_signed_url` (TEXT)
- `is_verified` (BOOLEAN, Default: `false`)
- `verified_at` (TIMESTAMPTZ)

### 3.6 Tabel `subscriptions`
Siklus berlangganan rutin Roastery Loop.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> `users.id`)
- `plan_name` (TEXT, Not Null) -- *e.g. The Discovery, The Collector*
- `status` (VARCHAR, Enum: `'ACTIVE'`, `'PAUSED'`, `'CANCELLED'`)
- `next_roast_date` (DATE)
- `shipping_address_id` (UUID)

---

## 4. Keamanan & Pola Integrasi API

- **Authentication Middleware**: `backend/middleware/authMiddleware.js` memverifikasi Supabase JWT token pada setiap request privat.
- **Role Verification Guard**: `verifyAdmin` dan `verifyB2B` menjamin hak akses terbatas pada endpoint sensitif.
- **Signature Webhook Gate**: Endpoint webhook Xendit & Biteship memvalidasi keabsahan token header sebelum memutasi status order.
