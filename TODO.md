# ☕ Fermion Roastery - Project Progress

## ✅ Completed
- [x] Initial Brainstorming & Design Spec
- [x] Architecture selection (Engine-Heavy Hybrid)
- [x] Backend Setup (Express v5, Supabase, Axios)
- [x] Frontend Setup (Next.js 15, Tailwind v4)
- [x] Fix Frontend Build & Runtime Errors
- [x] Finalize Artisan Navigation (Our Coffee, Wholesale, Subscription, Journal, Our Story)
- [x] Implement Dynamic Floating Navbar (Pill transition + Glassmorphism)
- [x] Setup Multi-page Routing & Under Construction placeholders
- [x] Setup Local Postgres Database (`fermion`)
- [x] Implement Core Schema (Products, Pricing Tiers, B2B Partners, Batches)
- [x] Connect Express Backend to Local Postgres
- [x] Build Product API with Dynamic Pricing data
- [x] Create B2B Onboarding Flow (Multi-step form)

## ⏳ To Do

### Phase 1: Core Engine & Data Architecture (Postgres)
- [x] Setup Production Postgres Database
- [x] Implement Core Schema (Products, Batches, Pricing)
- [x] Connect Express Backend to Postgres
- [x] Build Basic Product API (CRUD)

### Phase 2: B2B Core Logic
- [ ] Implement Google Places API in Backend (Scraping/API Proxy) - *Skipped/Pending API Key*
- [x] Create B2B Onboarding Flow (Full-stack integration)
- [x] Setup Tiered Pricing & Contract Logic (Pricing Engine)
- [x] Automated Invoicing System (PDF Generation)
- [x] B2B Partner Admin Approval Dashboard

### Phase 3: Marketplace & Auth
- [x] Implement Custom Local Auth (Laravel Breeze style)
- [x] Link Profiles & Roles to Postgres
- [x] Product Catalog with "Interactive Stickers"
- [x] Cart & Checkout (Xendit Integration)
### Phase 4: Full Order Fulfillment Pipeline (Marketplace v2.0)
- [x] Database Migration (Orders & Order Items Tables)
- [x] Refine Order State Machine (Add `READY_TO_SHIP` state)
- [x] Implement Backend Price Locking (Checkout Snapshot)
- [x] Implement Xendit Webhook Idempotency (Duplicate Prevention)
- [x] Refine Role-Dynamic Header (4 Role Faces)
- [x] Server-side Cart Persistence (Synced per User)
- [ ] Implement Admin "Magic Wand" (Quick Edit Buttons)
- [x] Basic Customer Tracking Timeline UI
- [/] Advanced B2B Dashboard (Tier Progress mockup done)
- [x] Geolocation Helper ("Use Current Location" button)

### Phase 5: Production Polish
- [ ] Admin Real-time Chat Panel
- [ ] Admin Batch Roasting Management UI
- [ ] Final UI Refinement & Responsive Audit
- [ ] Production Deployment (Vercel & Render)
