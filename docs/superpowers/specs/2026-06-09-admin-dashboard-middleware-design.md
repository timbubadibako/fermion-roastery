# Design Spec: Fermion Command Center (Admin Dashboard & Middleware)

**Status:** Draft / Pending Review
**Date:** 2026-06-09
**Topic:** Unified Admin Management and Server-side Security

---

## 1. Overview
The "Fermion Command Center" is a centralized management system for the owner to monitor sales, manage products/inventory, handle B2B partnerships, and control marketing content. It must be secured via server-side role validation to ensure only authorized administrators can access sensitive data.

### Success Criteria
- Secure `/admin` routes via Next.js Middleware.
- Modular Sidebar navigation covering all business departments.
- Informative analytics dashboard with Revenue and Volume trends.
- Full CRUD capabilities for core entities (Products, Orders, Partners).

---

## 2. Security & Middleware Architecture

### Flow
1. **Request:** User navigates to `/admin/*`.
2. **Middleware (Frontend):** 
    - Extracts `profileId` from cookies/localStorage.
    - If missing, redirects to `/login`.
3. **Verification (Backend):**
    - Calls `GET /api/auth/verify-admin?id=[profileId]`.
    - Backend checks `profiles.role` in PostgreSQL.
4. **Grant/Deny:** 
    - If `role === 'ADMIN'`, proceed to page.
    - If not, redirect to `/unauthorized` or `/login`.

---

## 3. Dashboard Structure (Departments)

### A. Home (Analytics)
- **Stats Row:** Total Revenue (Monthly), Total Volume (Monthly Kg), Pending B2B Applications, Active Subscriptions.
- **Chart Card 1:** Line chart for **Revenue Trends** (Daily/Weekly).
- **Chart Card 2:** Bar chart for **Volume Trends** (Kg sold per category).

### B. Commerce Management
- **`Products (CMS)`:** CRUD for coffee products (image, notes, specs, character levels).
- **`Pricing Hub`:** Set base retail prices and specific Tier Fix Prices (Bronze/Silver/Gold).
- **`Inventory`:** Roast batch monitoring and stock level alerts.
- **`B2B Partners`:** Table of applications with Approve/Reject/Assign Tier actions (Integrated from previous phase).

### C. Operational Console
- **`Orders`:** Transaction log (Xendit status, customer info, items).
- **`Shipping`:** Fulfillment manager (Input resi, update delivery status).
- **`Subscriptions`:** Member management and delivery cycle scheduling.

### D. Content & Marketing
- **`Journal`:** Markdown-based blog editor.
- **`Stickers & Banners`:** Visual asset manager for frontend flair.

---

## 4. Technical Requirements

### Backend (Express)
- **Auth Endpoint:** `/api/auth/verify-admin` (Validates role for middleware).
- **Stats Endpoint:** `/api/admin/stats` (Aggregates revenue and volume data).
- **CRUD Endpoints:** Standardized routes for Products, Orders, and Content.

### Frontend (Next.js)
- **Layout:** High-contrast Sidebar (`#101828`) with a flexible Content Area (`#FAF9F6`).
- **Charts:** Uses `recharts` for minimalist data visualization.
- **Form Components:** Standardized Inputs/Selects for CMS functionality.

---

## 5. Security & Integrity
- **API Protection:** ALL `/api/admin/*` endpoints must verify the requester's role on every call.
- **Error Handling:** Graceful degradation if backend is unreachable during middleware check.

---

## 6. Implementation Roadmap
1. **Security:** Implement `verify-admin` endpoint and Next.js middleware.
2. **Layout:** Build the Sidebar and Shell for the Admin portal.
3. **Analytics:** Implement stats aggregation in backend and render charts.
4. **Departments:** Migrate existing B2B logic to the new layout and build Product/Order CMS.
