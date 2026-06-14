# 🏢 FERMION ROASTERY - BACK OFFICE ARCHITECTURE V2

This document provides a comprehensive summary of the newly engineered Fermion Back Office ecosystem. It is divided into two distinct portals: The Admin Command Center and the B2B Partner Hub.

---

## 🛡️ 1. ADMIN COMMAND CENTER (`/admin`)

The Admin portal is designed with a **"Dark Lab"** aesthetic (Slate 950), focusing on operational control, rapid response, and data integrity.

### A. Intelligence & Overview
- **Command Stats:** Real-time visibility into Revenue, Volume Flow, Active Partners, and Pending B2B verifications.
- **Churn Alert System:** An automated, high-contrast red banner that detects and warns the admin if any active B2B partner has not ordered in $\ge 45$ days. Includes a quick-action button to re-engage via WhatsApp.
- **Magic Wand (Coming Soon):** An AI-powered tactical insight dashboard designed to read sales data and suggest operational maneuvers.

### B. Commerce & Partner Management
- **B2B Partners:** A verification directory where admins can review uploaded PDF contracts, approve applications, and assign Pricing Tiers (Bronze, Silver, Gold).
- **Manual Ledger:** A critical tool for data integrity. Allows admins to log offline transactions (e.g., WhatsApp orders) directly into the database. These transactions sync with the partner's monthly volume accumulation, ensuring they don't lose progress toward Tier upgrades.

### C. Operational & Logistics
- **Fulfillment Kanban:** A highly interactive 3-column board (`Incoming` $\rightarrow$ `ROASTING` $\rightarrow$ `SHIPPED`).
  - **Sensory QC Integration:** Dropping an order into `ROASTING` triggers a QC slider modal (Sweetness, Acidity, Body) to update the exact flavor profile of the batch.
  - **AWB Modal:** Dropping an order into `SHIPPED` prompts the admin to input the Courier and Air Waybill (Resi) number before finalizing the dispatch.
- **Green Bean Inventory (Phase 4):** A tracking system for raw material arrival and batch-cutting (Currently in roadmap).

### D. Laboratory CMS
- **Roastery Journal:** A Markdown-powered editor to publish stories, harvest reports, and scientific findings directly to the public landing page.
- **Global Settings:** Centralized control for editing the Hero section text, brand messaging, and official contact information without touching code.

---

## 🤝 2. B2B PARTNER HUB (`/b2b`)

The B2B portal uses a **"Clean Light"** aesthetic (White & Slate 50 with Periwinkle accents), designed to feel like a premium, self-service business suite.

### A. Self-Service Onboarding
- **Registration Gateway:** A multi-step flow that captures business details and desired monthly volume.
- **Contract Engine:** Generates a dynamic PDF agreement based on the partner's inputs. The partner downloads, signs, and uploads it. The system holds them in an `Awaiting Review` state until admin approval.
- **Identity Verification:** Upon first login after approval, the partner MUST upload their Cafe Logo and Billing Info. This logo dynamically syncs to the public Landing Page's "Partner Showcase".

### B. Dashboard & Dynamic Tiering
- **Volume Progress Ring:** A massive, interactive ring chart showing the partner's accumulated KG for the current month relative to the 15KG Silver Tier target.
- **Silver Tier Claiming:** If the 15KG threshold is met, the ring activates and a "Claim Silver Tier" button appears, unlocking a fixed Rp 15.000/kg discount. (Base/Bronze discount is fixed at Rp 10.000/kg).
- **Retention Gate (Premium Service):** Machine calibration and maintenance services are visually displayed but **LOCKED** until the partner reaches their second contract cycle (`contract_sequence >= 2`), incentivizing long-term loyalty.

### C. Commercial Loop
- **Wholesale Laboratory (Shop):** A dedicated B2B catalog where tier discounts are automatically applied to the listed prices. Features a floating Cart button that syncs directly with the B2B Checkout.
- **The Cart Interceptor:** B2B partners are structurally prevented from using the normal retail cart. If they try to checkout, a Next.js middleware intercepts and forces them into the specialized B2B Checkout Protocol.
- **Monospace Checkout Matrix:** A laboratory-style checkout table that locks the delivery to their registered Cafe Address and calculates heavy-cargo fees via Biteship integration.

### D. Post-Purchase tracking
- **Order Logs (Ledger):** A clean history of all commercial transactions with the ability to download official PDF Invoices containing both the Fermion logo and the Partner's uploaded Cafe logo.
- **Cargo Tracking:** A dedicated timeline interface that pulls live status updates from the Biteship Webhook, showing exactly where their beans are (e.g., Packed $\rightarrow$ Picked Up $\rightarrow$ In Transit).

---
*End of Document. Engineered with Scientific Rigor.*