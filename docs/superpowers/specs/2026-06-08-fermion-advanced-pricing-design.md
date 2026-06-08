# Design Spec: Advanced Pricing & Smart Tiering (B2B Engine)

**Status:** Draft / Pending Review
**Date:** 2026-06-08
**Topic:** Price Locking, 3-Month Evaluation, and Growth-Driven Dashboard

---

## 1. Overview
To differentiate Fermion Roastery in the B2B market, the system needs a highly flexible and professional pricing engine. This module handles contract-based price locking (anti-fluctuation), automated tiered recommendations based on 3-month rolling averages, and a growth-tracking UI for partners.

### Success Criteria
- Support for individual partner contracts with fixed prices.
- Dynamic pricing resolver with 4-level hierarchy.
- Rolling 3-month evaluation window for tier assignments.
- Elegant progress tracking in the partner dashboard.

---

## 2. Pricing Resolution Hierarchy
When a user views a product, the backend will resolve the price in the following order:

| Priority | Level | Condition | Price Source |
| :--- | :--- | :--- | :--- |
| **1** | **Contract** | Active row in `contracts` table for the specific product/user. | `contracts.fixed_price` |
| **2** | **B2B Tier** | User `status = 'approved'` and assigned a tier (Bronze/Silver/Gold). | `pricing_tiers.unit_price` |
| **3** | **B2B Pending**| User `status = 'pending'`. | `products.price_retail` - (5-10%) |
| **4** | **Retail** | Public guest or unverified user. | `products.price_retail` |

---

## 3. Data Architecture Updates (PostgreSQL)

### New Tables
- **`contracts`**:
    - `id` (UUID, PK)
    - `profile_id` (FK to profiles)
    - `product_id` (FK to products)
    - `fixed_price` (Numeric)
    - `start_date` (Date)
    - `end_date` (Date) - *The "Price Lock" window.*
- **`evaluation_logs`**:
    - `id` (UUID, PK)
    - `profile_id` (FK to profiles)
    - `month_year` (Text, e.g., '06-2026')
    - `total_volume_kg` (Numeric) - *Used to calculate the 3-month average.*

### Modified Tables
- **`b2b_partners`**:
    - `current_evaluation_cycle` (Integer, 1-3) - *Current month in the 3-month window.*
    - `next_tier_progress` (Integer, 0-100) - *Calculated percentage towards the next tier.*

---

## 4. Smart Tiering Logic

### Evaluation Window (Opsi B: 3 Months)
- The system monitors monthly purchase volume.
- **Up-Tier Suggestion:** If the 3-month average exceeds the current tier's threshold.
- **Down-Tier Warning:** If the 3-month average falls below the current tier's threshold.
- **Admin Control:** The system generates a "Recommendation" in the Admin Panel. If no manual override is performed, the system applies the recommended tier.

---

## 5. UI/UX: Elegant Gamification
- **The Progress Ring:** A minimal SVG ring in the Partner Dashboard showing volume progress.
- **Price Lock Badge:** A small "Gembok" (Lock) icon next to the price in the catalog when a contract is active.
- **Growth Toast:** Occasional UI notifications celebrating the partner's volume growth.

---

## 6. Implementation Roadmap
1. **Migration:** Create `contracts` and `evaluation_logs` tables.
2. **Backend Resolver:** Refactor `productController` to handle the 4-level hierarchy.
3. **Admin UI:** Basic table to view partner volume averages and approve tier changes.
4. **Partner UI:** Integration of the progress ring in the dashboard.
