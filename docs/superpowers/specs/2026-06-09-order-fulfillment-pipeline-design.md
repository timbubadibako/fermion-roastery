# Design Spec: Order Fulfillment Pipeline (Biteship & Xendit)

**Status:** Draft / Pending Review
**Date:** 2026-06-09
**Topic:** E-to-E Order Management, Dynamic Shipping, and Order Tracking

---

## 1. Overview
This specification outlines the complete lifecycle of a coffee order. It integrates **Biteship** for dynamic shipping rate calculation, **Xendit** for payment processing, and a custom **Fermion Admin Dashboard** for order management and fulfillment tracking. This creates a seamless, marketplace-level experience for both retail and B2B customers.

### Success Criteria
- Dynamic shipping rates calculated via Biteship API during checkout.
- Robust state machine for Order Status (UNPAID -> PAID -> ROASTING -> SHIPPED -> DELIVERED).
- Custom Admin Dashboard to manage orders, assign roasting batches, and input tracking numbers (AWB).
- Customer-facing "Track Order" page with a visual timeline.

---

## 2. Order State Machine

Every order follows a strict, one-way lifecycle to ensure operational clarity.

| Status | Triggered By | Action / Meaning |
| :--- | :--- | :--- |
| `UNPAID` | User clicks "Pay via Xendit" | Xendit Invoice created. Waiting for customer payment. |
| `PAID` | Xendit Webhook | Payment received. Order moves to Admin queue. |
| `ROASTING` | Admin Action | Admin assigns the order to a specific roast schedule/batch. |
| `SHIPPED` | Admin Action | Admin inputs the Airway Bill (Resi) number. Handed to courier. |
| `DELIVERED` | Biteship Webhook / Admin | Package arrived at customer. Order archived as success. |
| `CANCELLED` | System / Admin | Xendit invoice expired or Admin manually cancelled. |

---

## 3. Data Architecture (PostgreSQL)

### New Tables

- **`orders`**:
    - `id` (UUID, PK)
    - `profile_id` (UUID, FK to profiles, Nullable for Guests)
    - `xendit_invoice_id` (Text)
    - `biteship_order_id` (Text, Nullable - if using Biteship order creation)
    - `status` (Text, Enum based on State Machine)
    - `total_amount` (Numeric)
    - `shipping_fee` (Numeric)
    - `shipping_courier` (Text, e.g., 'JNE REG')
    - `shipping_awb` (Text, Tracking Number)
    - `customer_name` (Text)
    - `customer_email` (Text)
    - `customer_phone` (Text)
    - `shipping_address` (Text)
    - `created_at` & `updated_at`

- **`order_items`**:
    - `id` (UUID, PK)
    - `order_id` (UUID, FK to orders)
    - `product_id` (UUID, FK to products)
    - `product_name` (Text, Snapshot of name at time of purchase)
    - `variant_weight` (Text, e.g., '250g')
    - `variant_grind` (Text, e.g., 'Whole Bean')
    - `quantity` (Integer)
    - `unit_price` (Numeric, Snapshot of price paid)

---

## 4. Workflows

### A. The Checkout Flow (Frontend -> Backend -> APIs)
1. **Cart Review:** User reviews items in `/cart`.
2. **Shipping Details:** User inputs address. *(Optional: "Use My Location" fills coordinates).*
3. **Fetch Rates:** Frontend calls Backend `/api/shipping/rates`. Backend calls Biteship API using Fermion's Origin Postal Code and Customer's Destination.
4. **Courier Selection:** User selects a courier (e.g., JNE, Sicepat) and the shipping fee updates the Grand Total.
5. **Payment Generation:** User clicks "Pay". Backend creates an `UNPAID` order in DB and generates a Xendit Invoice. User is redirected to Xendit.

### B. Admin Fulfillment Dashboard
- A dedicated view in `/admin/orders`.
- **Kanban / Table View:** Orders are categorized by status (Needs Roasting, Ready to Ship, Completed).
- **Fulfillment Action:** Admin can click an order to print a packing slip, assign a roasting batch, or input the `shipping_awb` (Resi).

### C. Customer Tracking UI
- Route: `/account/orders/[id]`
- Displays a visual, vertical timeline (e.g., Lucide icons with connecting lines).
- Once status is `SHIPPED`, the timeline displays the AWB number and a link to track the package via Biteship's tracking page (or integrated tracking if API is used).

---

## 5. Implementation Roadmap
1. **Database Migration:** Create `orders` and `order_items` tables.
2. **Biteship Integration:** Register API key and create backend endpoint to fetch shipping rates.
3. **Checkout Upgrade:** Update the frontend `/cart` page to include dynamic shipping selection and pass data to the Xendit invoice creator.
4. **Admin Dashboard:** Build the `/admin/orders` UI to manage the order lifecycle.
5. **Tracking Page:** Build the customer-facing order history and tracking timeline.
