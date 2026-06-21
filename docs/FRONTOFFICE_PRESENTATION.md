# ☕ FERMION ROASTERY - FRONTOFFICE EXPERIENCE V2

This document summarizes the guest and retail customer journey for the new Fermion Roastery digital ecosystem.

---

## 🏛️ 1. LANDING PAGE: THE SCIENTIFIC LABORATORY

The landing page is the first touchpoint, designed with a **"Modern Laboratory"** aesthetic that emphasizes precision and artisan quality.

### A. Narrative & Branding
- **Hero Section:** High-impact typography with a focus on "Scientific Precision" and "Artisan Roasting".
- **Dynamic Content:** Fetches live data from the **Roastery Journal** (Stories from the field) and **Partner Showcase** (Logos of verified B2B partners).
- **Sensory Visuals:** Interactive elements that showcase the flavor profiles (Sweetness, Acidity, Body) of our current batches.

### B. Navigation
- **Role-Dynamic Header:** 
  - **Guest:** Sees "Login" and "Wholesale" application links.
  - **Retail User:** Sees "My Account" (Personal Rutinitas).
  - **B2B Partner:** Sees "Partner Hub" and a specialized wholesale menu.
  - **Admin:** Sees "Command Center" access.

---

## 🛍️ 2. RETAIL SHOPPING JOURNEY (`/our-coffee`)

A seamless, premium experience for retail customers to acquire premium coffee produk.

### A. Product Catalog
- **Grid Layout:** Optimized for visual clarity with high-quality kopi photography.
- **Filtering & Sorting:** Ability to filter by Origin, Roast Profile, or Processing Method.
- **Dynamic Pricing:** Automatically displays retail prices for guest/standard users.

### B. Product Details
- **Scientific Specs:** Displays Altitude, Farm, and Processing details.
- **Sensory Wheel:** Visual representation of the Cupping Score and flavor notes.
- **Buy It Now:** A fast-track checkout button that adds to cart and initiates the payment protocol immediately.

---

## 🧘 3. RETAIL PORTAL: PERSONAL RITUALS (`/account`)

A dedicated space for regular customers to track their relationship with Fermion.

### A. Rutinitas Overview
- **Visual Order Tracker:** A real-time timeline for the most recent order (Confirmed → Roasting → Shipped).
- **Roasting Spinner:** A unique UI element that appears when a batch is currently being roasted for the customer.

### B. Order Ledger
- **History:** Full list of past purchases with status indicators and net settlement details.
- **Invoices:** Ability to view and download past transaction records.

### C. Profile & Settings
- **Preferences:** Manage shipping addresses and contact information to expedite future rutinitas.
- **B2B Fast-Track:** A persistent call-to-action for cafe owners to initialize their wholesale partnership directly from their account.

---

## 🛒 4. THE CART PROTOCOL (`/cart`)

- **Cart Sheet:** A slide-over interface accessible from any page with a high z-index to ensure it overlaps all navigation.
- **Interception Logic:** 
  - Standard users proceed to the clean Retail Checkout.
  - B2B users are automatically intercepted and redirected to the **Wholesale Checkout Protocol**.
  - Admins receive a security warning banner explaining that checkouts are simulated.

---
*End of Document. Precision in Every Cup.*
