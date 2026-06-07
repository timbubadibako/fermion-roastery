# Fermion Roastery B2B Platform - Design Specification (REVISED)

## Context
Fermion Roastery is a boutique, single-brand coffee roastery transitioning to a robust digital platform. The goal is a high-end, production-grade website that balances a professional B2B experience with a modern, minimalist, and subtly playful brand identity.

## Aesthetic Direction
*   **Theme:** "Modern Playful Minimalism"
*   **Vibe:** Clean, premium, and professional (directly adopting the **Evasion** template structure), but with subtle "cartoonist" touches through color and illustrations.
*   **Navigation:** Multi-page routing (App Router) instead of a single-page "jump-to-section" layout.
*   **Typography:** Clean, high-end Sans-Serif (e.g., Inter, Satoshi, or General Sans).

## Architecture & Technology Stack
**The Engine-Heavy Hybrid Approach**

1.  **Frontend (Next.js 15, React 19, Tailwind CSS v4):**
    *   **Multi-page Architecture:** Distinct routes for Home, Wholesale, Retail, and Account.
    *   **Custom Theming:** Modern-playful design tokens injected into Evasion components.
2.  **Core Engine (Express.js v5):**
    *   Handles secure B2B logic, API integrations, and complex transactions.
3.  **Database (PostgreSQL - Production/Self-Hosted):**
    *   Primary relational storage for products, orders, and business data.
    *   Vendor-neutral PostgreSQL setup to allow hosting on VPS (Hostinger) or managed services.
4.  **Authentication (Future: Clerk or Kinde):**
    *   Deferred to a later phase; focus currently on data architecture and engine logic.
