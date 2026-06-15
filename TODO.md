# Fermion Roastery - Master Implementation & User Journey TODO

## 📂 Phase 0: Workspace & Infrastructure (Done)
- [x] **Cleanup:** Removed legacy SQA screenshots, logs, and unused templates.
- [x] **Database:** Postgres Schema established with support for B2B tiers, Orders, and Tracking History.
- [x] **Logistics:** Biteship API integrated (Area Search, Rates, Draft Confirmation).
- [x] **Payments:** Xendit Invoice API integrated with automated webhook handlers.
- [x] **Real-time:** Robust polling (15s) and Ably-ready infrastructure for Admin/User sync.

---

## ☕ Phase 1: Retail Customer Journey (Production Ready)
### 1.1 Authentication & Profile
- [x] **Login/Register:** Standard retail entry via `/auth`.
- [x] **Account Management:** Save full shipping address (City, Postal Code, Phone) in `/account`.
- [x] **Auto-Fill:** Address is automatically injected into the checkout form from the profile.

### 1.2 The "Ritual" Purchase Flow
- [x] **Catalog:** Browse beans with dynamic weight and grind variants.
- [x] **Selective Checkout:** Toggle specific items in the cart sidebar to purchase.
- [x] **Biteship Area Search:** Real-time city/district lookup during checkout.
- [x] **Courier Selection:** Live shipping rates from JNE, SiCepat, J&T, etc.
- [x] **Payment Redirect:** Instant hand-off to Xendit Secure Checkout.

### 1.3 Post-Purchase Experience
- [x] **Order Status:** 5-step visual tracker (Menunggu Bayar -> Dibayar -> Diproses -> Dipanggang -> Dikirim).
- [x] **Expandable Tracking:** Click "Pantau Detail Paket" to see vertical timeline history (cost-saving local cache).
- [x] **Cancellation Awareness:** Clear UI feedback if an order is rejected with reasons.

---

## 🏢 Phase 2: B2B Partner Ecosystem (Enterprise Ready)
### 2.1 Self-Service Onboarding
- [x] **B2B Registration:** Story-driven onboarding flow at `/b2b/register`.
- [x] **Contract Protocol:** Optional PDF contract upload and tier explanation.
- [x] **Verification:** Admin approval gate (Status changes from 'pending' to 'approved').

### 2.2 Wholesale Procurement
- [x] **B2B Shop:** Specialized wholesale catalog with bulk volume options.
- [x] **Tiered Pricing:** Automatic logic for Bronze/Silver discounts based on monthly volume.
- [x] **Cart Interceptor:** Forces B2B users to the wholesale checkout to prevent retail price leakage.
- [x] **B2B Ledger:** Private procurement history and digital contract management.

---

## 🛠️ Phase 3: Admin Command Center (Laboratory Ops)
### 3.1 Fulfillment Kanban (The Hub)
- [x] **5-Column Pipeline:** Total control over the Roastery workflow.
- [x] **Manual Override:** Admin can confirm payments manually if webhooks are delayed.
- [x] **Decision Gate:** Accept or Reject orders with custom feedback notes for customers.
- [x] **Logistics Print:** One-click "Print Shipping Label" (Direct Biteship PDF).

### 3.2 Inventory & Commerce
- [x] **Manual Ledger:** Record offline (WhatsApp) sales with automatic stock deduction.
- [x] **B2B Partner Management:** Approve/Reject partner applications and assign tiers.
- [x] **Site Settings:** Update landing page content and roastery journal entries dynamically.

---

## 🚀 Final Production Checklist (Remaining)
- [ ] **Live Keys:** Transition from Xendit/Biteship TEST keys to LIVE environment.
- [ ] **Webhook Tunneling:** Setup permanent production URL for Biteship/Xendit callbacks.
- [ ] **Inventory Sync:** Automated stock deduction on PAID webhook (Retail & B2B).
- [ ] **Notifications:** Email/WA trigger upon order confirmation.
- [ ] **Performance:** Final image optimization and Next.js build verification.
