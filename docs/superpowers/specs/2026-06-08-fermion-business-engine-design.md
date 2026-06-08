# Design Spec: Fermion Business Engine (B2B & Retail Core)

**Status:** Draft / Pending Review
**Date:** 2026-06-08
**Topic:** Core Data Architecture, Tiered Pricing, and B2B Onboarding

---

## 1. Overview
Fermion Roastery requires a unified business engine to handle two primary commerce flows: **Retail** (Public) and **B2B** (Partners). The engine must manage products, inventory batches, and complex pricing logic that adapts based on user roles and onboarding status.

### Success Criteria
- Unified database schema for Retail and B2B.
- Seamless B2B onboarding with Google Places integration.
- Tiered pricing system (Fixed Price per Tier) + Admin-controlled discounts.
- Introductory pricing for pending B2B partners.

---

## 2. User Roles & Pricing Levels

| Role | Status | Pricing Logic | Access Level |
| :--- | :--- | :--- | :--- |
| **Retail Guest** | Anonymous | Base Price + Active Discounts | Public Catalog |
| **B2B Pending** | Registered | Retail Price - (5-10%) | Retail + Bulk/Custom Options |
| **B2B Approved** | Verified | **Fixed Tier Price** (Bronze/Silver/Gold) | Full B2B Dashboard |
| **Admin** | Staff | Full Control | Management Console |

---

## 3. Data Architecture (Postgres)

### Core Tables
- **`products`**: Central product registry (Name, Slug, Notes, Origin, Base Price).
- **`pricing_tiers`**: Stores fixed unit prices for specific products per tier.
- **`batches`**: Inventory management linked to products (Roast Date, Quantity, Batch ID).
- **`b2b_partners`**: Partner profiles, business details (from Google Places), and assigned tier.
- **`profiles`**: Unified user accounts linked to either retail orders or B2B partner profiles.

---

## 4. Key Workflows

### A. B2B Onboarding Flow
1. **Landing:** User views wholesale benefits on `/wholesale`.
2. **Auth:** User registers or logs in via Clerk/Kinde.
3. **Smart Form:** 
    - Search business via **Google Places API**.
    - Manual fallback if business is not found.
    - Input estimated monthly volume (kg).
4. **Submission:** Data saved to `b2b_partners` with status `pending`.
5. **Waiting Room:** User sees "Verification in progress" notice. 
    - B2B Dashboard is locked.
    - User can buy from Retail page with a **5-10% Introductory Discount** and **Bulk Packaging** options.

### B. Admin Product Management
- Admin can update a product's base retail price.
- Admin can set a temporary "Discount" value (e.g., 20%).
- Admin can explicitly set fixed prices for Bronze, Silver, and Gold tiers for each product.

---

## 5. Technical Requirements

### Backend (Express v5)
- **Product API:** Dynamic price calculation based on the `Authorization` header and partner status.
- **Places Proxy:** Secure endpoint to query Google Places for business discovery.
- **Partner API:** CRUD for B2B applications and status updates.

### Frontend (Next.js 15)
- **Restricted Routes:** Middleware to handle B2B dashboard access based on `status`.
- **Pricing Component:** Displays "Retail Price" (crossed out) vs "Your Price" based on user level.
- **Custom Weight Selector:** Specialized input for B2B/Pending users to request specific kg amounts.

---

## 6. Security & Integrity
- **RLS (Row Level Security):** Only approved B2B partners can read B2B-specific pricing rows.
- **Validation:** Server-side validation for all price calculations to prevent front-end manipulation.

---

## 7. Next Steps
1. **Database Migration:** Create tables according to the schema.
2. **Seeding:** Add initial product data with mock tiered pricing.
3. **Backend Logic:** Implement the dynamic pricing resolver in `productController`.
