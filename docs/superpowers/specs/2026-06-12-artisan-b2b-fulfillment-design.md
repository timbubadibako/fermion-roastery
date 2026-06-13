# Design Spec: Artisan B2B Dashboard & Fulfillment Engine

**Date:** 2026-06-12
**Status:** Approved
**Topic:** B2B Lifecycle, Wholesale Tiering, Batch Transparency, and Automated Shipping/Invoicing.

## 1. Overview
Fermion Roastery requires a sophisticated B2B ecosystem that balances "Scientific Rigor" (data-driven transparency) with "Artisan Passion" (personalized partner service). This system manages the lifecycle of a B2B partner from onboarding to loyalty-based service rewards.

## 2. Goals
- **B2B Lifecycle Management:** Manual approval workflow and contract sequence tracking.
- **Role-Based Dashboards:** Distinct experiences for Admin and B2B Clients.
- **Loyalty Rewards:** Unlock maintenance services upon second contract renewal.
- **Batch Transparency:** Record and display Roast Batch IDs and dates on orders and invoices.
- **Hybrid Fulfillment:** Automated shipping for Retail; batch-gated shipping for B2B.

## 3. Data Model Enhancements

### 3.1 Profiles & Partners
- `b2b_partners` (Updates):
    - `cafe_logo_url`: String (Mandatory for partners).
    - `contract_status`: Enum (`PENDING`, `ACTIVE`, `EXPIRED`).
    - `is_service_eligible`: Boolean (Determined by contract sequence).
- `b2b_contracts`:
    - `id`: UUID.
    - `profile_id`: UUID (Ref: profiles).
    - `contract_sequence`: Integer (1, 2, 3...).
    - `start_date`, `end_date`: Date.

### 3.2 Orders & Transparency
- `orders` (Updates):
    - `batch_id`: String (e.g., #FM-GRT-001).
    - `roast_date`: Date.
    - `fulfillment_type`: Enum (`RETAIL_INSTANT`, `B2B_ROAST_TO_ORDER`).

## 4. Key Workflows

### 4.1 B2B Onboarding & Activation
1.  **Application:** Cafe owner fills out a multi-step form (Cafe Name, Address, Contact).
2.  **Verification:** Admin verifies via WhatsApp and signs the contract offline.
3.  **Activation:** Admin approves the partner in the dashboard, setting the `contract_sequence` to 1.
4.  **Service Unlock:** Upon the second contract approval (Sequence >= 2), the "Maintenance Request" feature is automatically enabled for the client.

### 4.2 Fulfillment & Shipping (Biteship)
- **Retail (Instant):** 
    - Trigger: Xendit Webhook (`PAID`).
    - Action: Backend calls Biteship `createOrder` immediately.
    - Status: `SHIPPED`.
- **B2B (Batch-Gated):**
    - Trigger: Xendit Webhook (`PAID`).
    - Action: Order moves to `ROASTING_QUEUE`.
    - Fulfillment: Admin sangrai kopi, enters `Batch ID` and `Roast Date` in the Admin Panel.
    - Shipping: Admin clicks "Ship Order", backend calls Biteship `createOrder`.
    - Status: `SHIPPED`.

### 4.3 Invoicing & Transparency
- **Engine:** PDFKit generation on the backend.
- **Design:** Minimalist "Laboratory" aesthetic.
- **Dynamic Branding:** Fermion Logo (Left) + Partner Cafe Logo (Right).
- **Transparency Data:** Every line item includes its specific `Batch ID` and `Roast Date`.
- **Access:** B2B Clients can download invoices directly from their "Invoice Vault" in the dashboard.

## 5. UI/UX Components

### 5.1 Admin Panel
- **"Magic Wand" Approval:** List of pending B2B applications with one-click activation.
- **Service Scheduler:** View of all partners eligible for the 3-monthly espresso/grinder maintenance.

### 5.2 B2B Client Portal
- **Partner Header:** "Fermion x [Cafe Name]" branding.
- **Volume Tracker:** Real-time progress bar of KG accumulated this month.
- **Service Center:** Maintenance request form (locked for Contract #1).

## 6. Implementation Stages (Phased)
1.  **Foundation:** Database updates and B2B pendaftaran form.
2.  **Admin Logic:** Activation workflow and manual B2B fulfillment gating.
3.  **Client Portal:** Dashboard UI, Volume Tracking, and Invoice Vault.
4.  **Automation:** Biteship Retail auto-trigger and PDF Invoice Generator.
