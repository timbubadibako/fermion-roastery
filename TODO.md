# ☕ Fermion Roastery - Project Progress

## ✅ Completed
- [x] Initial Brainstorming & Design Spec
- [x] Architecture selection (Engine-Heavy Hybrid)
- [x] Backend Setup (Express v5, Supabase, Axios)
- [x] Frontend Setup (Next.js 15, Tailwind v4)
- [x] Fix Frontend Build & Runtime Errors
- [x] Implement Dynamic Floating Navbar (Pill transition + Glassmorphism)
- [x] Setup Local Postgres Database (`fermion`)
- [x] Implement Core Schema (Products, Pricing Tiers, B2B Partners, Batches)
- [x] Build Product API with Dynamic Pricing data
- [x] Create B2B Onboarding Flow (Initial multi-step form)
- [x] Refine Role-Dynamic Header (Admin, B2B, Retail, Guest)
- [x] Dedicated Dashboards for Admin and B2B (with Sidebars)

## ⏳ To Do

### Phase 1: Core Engine & Data Architecture (Postgres)
- [x] Setup Production Postgres Database
- [x] Implement Core Schema (Products, Batches, Pricing)
- [x] Connect Express Backend to Postgres
- [x] Build Basic Product API (CRUD)

### Phase 2: B2B & Admin Operational Flows
- [x] Setup Tiered Pricing Logic (Bronze: Base, Silver: 15kg/10k discount, Gold: TBD)
- [x] B2B Partner Admin Approval Dashboard
- [x] **Dedicated Admin Ordering** (Internal Procurement UI)
- [x] **Dedicated B2B Ordering** (Wholesale Catalog UI with 10k IDR/kg Silver discount)
- [ ] **Dynamic B2B Onboarding** (Cafe Name, Address, HP validation)

### Phase 3: CMS & Fulfillment Pipeline (ACTIVE)
- [x] **Functional CMS: Journal Editor** (Create/Edit stories for Landing Page)
- [x] **Functional CMS: Shipping Console** (Manual AWB/Courier management)
- [ ] Automated Invoicing System (PDFKit Generation with Logo Support)
- [ ] Biteship Webhook Integration for auto-tracking auto-awb

### Phase 4: Transparency Engine
- [ ] **Green Bean Lot Management** (Tracking arrival weight)
- [ ] **Roast Batch Integration** (FIFO cutting from Green Bean stock)
- [ ] Admin "Magic Wand" (Quick Edit Buttons for Batch/Status)

### Phase 5: Production Polish
- [ ] Admin Real-time Chat Panel
- [ ] Final UI Refinement & Responsive Audit
- [ ] Production Deployment (Vercel & Render)
