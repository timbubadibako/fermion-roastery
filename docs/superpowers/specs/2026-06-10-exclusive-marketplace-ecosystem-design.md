# Design Spec: Exclusive Marketplace Ecosystem (Fermion Roastery)

**Status:** Approved
**Date:** 2026-06-10
**Topic:** Role-Based Navigation, Logistics Pipeline, and Financial Integrity

---

## 1. Overview
This specification defines the final architectural requirements for the Fermion Roastery Marketplace. It addresses role-based user experiences (Retail, B2B, Admin), a realistic coffee roasting-to-shipping pipeline, and safeguards for financial data integrity.

---

## 2. Role-Based Navigation (Header)

The Header component will dynamically adapt based on the user's role stored in `useAuthStore`.

### Right-Side Action Icons
- **ADMIN:** Search | Admin Dashboard Icon (`LayoutDashboard`) | Profile Icon (Logout). *Cart is hidden.*
- **B2B:** Search | Bulk History Icon (`PackageSearch`) | Partner Dashboard Icon (`LayoutGrid`) | Cart. *Subscription link hidden in Nav.*
- **RETAIL:** Search | My Orders Icon (`PackageSearch`) | Profile Icon (`User`) | Cart.
- **GUEST:** Search | User Icon (Redirect to Login) | Cart.

---

## 3. Logistics & Order Fulfillment

### Order State Machine (v2.0)
To bridge the gap between roasting and shipping, a new transition state is added.

| Status | Meaning |
| :--- | :--- |
| `UNPAID` | Invoice created, waiting for payment. |
| `PAID` | Payment confirmed via Xendit Webhook (Idempotency check required). |
| `ROASTING` | Admin has assigned order to a specific roast batch. |
| `READY_TO_SHIP` | Roasting complete, Packaging & QC finished. Ready for courier pickup. |
| `SHIPPED` | Admin provided AWB/Resi number. Package in transit. |
| `DELIVERED` | Package received by customer (Verified via Biteship or User confirmation). |

---

## 4. Data Integrity & Safeguards

### A. Price Locking Logic
- During the `createInvoice` process (POST `/api/payments/invoice`), the backend MUST snapshot the final calculated price.
- The `unit_price` in `order_items` is fixed at the moment of checkout.
- Subsequent changes to B2B Contracts or Tier Pricing will NOT affect orders already in progress.

### B. Shipping & Geolocation
- **Primary Flow:** Search-based address input with Nominatim OpenStreetMap for coordinate and address formatting.
- **Helper Flow:** "Use My Current Location" button using Browser Geolocation API as a convenience feature only.

### C. Webhook Idempotency (Xendit)
- The webhook handler MUST check the current order status before processing.
- If an order is already marked as `PAID`, additional incoming webhooks for the same order must return `200 OK` immediately without re-triggering PDF generation or status updates.

---

## 5. UI/UX Enhancements

### A. Admin "Magic Wand"
- On Product Cards and Detail pages, the "Add to Cart" button changes for Admin users.
- **Visual:** Amber/Orange theme.
- **Teks:** "EDIT BEAN SPECS".
- **Action:** Redirects to the Product CMS Edit view for that specific ID.

### B. Retail Tracking UI
- Vertical timeline showing the full Roasting -> QC -> Shipping journey.
- "Order Again" button for quick re-purchase.
- Upselling banner for Coffee Subscriptions (Retail only).

### C. B2B Dashboard
- Tier Progress Bar (Percentage to next discount level).
- Active Contract monitoring.
- Scheduled Purchase Reminder (Email/WhatsApp notification system).
