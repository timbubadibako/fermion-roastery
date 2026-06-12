# Fermion Roastery - V2 Architecture & B2B Flow Specification

## 1. Frontend: The "Cinematic Beans" Hero & i18n
*   **Hero Redesign:** 100vh product-focused image with a left-to-right black-to-transparent linear gradient overlay.
*   **Text Readability:** 
    *   Use a scrim overlay or `mix-blend-mode: multiply` on the gradient to ensure text remains legible against dynamic background contrast.
    *   Apply subtle `text-shadow` for high-contrast safety.
*   **Color Palette:** Implement the 10-color hex system as CSS variables (`globals.css`) for dynamic thematic styling.
*   **i18n Strings:** Centralize static text into `frontend/lib/strings.ts` (ID/EN) for scalable localization.

## 2. Backend: Content Management & Security
*   **Data Models:**
    *   `faqs`: Localized columns (`question_id`, `answer_id`, `question_en`, `answer_en`) + `sort_order`.
    *   `inquiries`: Stores Contact Form data.
*   **Security & Safety:**
    *   **Rate Limiting:** Apply to `POST /api/content/contact` (e.g., max 3 submissions per IP per 15 mins).
    *   **Sanitization:** Implement XSS protection and input validation on all inquiry fields.
*   **Endpoints:** `GET /api/content/faqs`, `POST /api/content/contact`, `GET /api/admin/inquiries` (Auth-protected).

## 3. B2B Wholesale: Contract & Dynamic Tier Logic
### A. Tier Mechanics (Bronze/Silver/Gold)
*   **Eligibility Engine:** A Monthly Cron Job (1st of month) calculates previous month's total volume (only `PAID`/`SHIPPED` orders).
    *   If Volume $\ge$ 15kg, set `is_silver_eligible = true`.
    *   **Reset Logic:** The Cron Job must reset `is_silver_eligible = false` and revert current status to 'Bronze' if the volume threshold was not met in the previous month.
*   **Gold Tier (High-Volume Partner):**
    *   Target: Volume > 50kg/month.
    *   Logic: Not automated via Cron. Requires manual negotiation/contract.
    *   User can "Apply for Gold Tier" from dashboard.
    *   Admin sets custom `price_per_kg` based on agreement.
*   **Dynamic Claiming:**
    *   Users see a "Claim Silver Tier" button in their dashboard IF `is_silver_eligible` is true.
    *   Clicking "Claim" updates the status for the **current month only**.

### B. Contract History & Benefits
*   **`b2b_contracts` Table:** Tracks `id`, `user_id`, `start_date`, `end_date`, `status`, `contract_sequence` (INT), and `contract_type` (Bronze/Silver/Gold).
*   **Mandatory Profile Setup:** Upon contract approval, users **must** upload their Cafe Logo.
    *   This logo is displayed in their B2B Dashboard and used in the Fermion "Our Partners" section.
*   **Fermion Service:** 
    *   Maintenance service every 3 months.
    *   Logic: Unlocked IF `contract_sequence >= 2` AND status is 'active'.
    *   **Admin View:** "Maintenance Schedule" sub-view to track and notify technicians about eligible partners.

## 4. Dashboards Structure
*   **Admin Dashboard:**
    *   B2B Application Approval, Inquiry Management, and Contract Management.
    *   **Churn Alert:** Trigger IF `Current Date - Max(order_date) > 45 days`.
*   **B2B Client Dashboard:**
    *   Real-time Progress Bar (KG accumulation).
    *   Profile Logo management (Mandatory for partners).
    *   "Fermion Service" status/lock view.
*   **Retail Dashboard:** Clean UI for order history and basic profile management.

## 5. Implementation Flow (Sync Logic)
1.  **Cron Job (1st of month):** Evaluate last month -> Set eligibility flags.
2.  **User Interaction:** Eligible user claims higher tier -> Status updated for current month.
3.  **Checkout Loop:** Cart checks partner status -> Applies corresponding discount per kg -> Finalizes payment.