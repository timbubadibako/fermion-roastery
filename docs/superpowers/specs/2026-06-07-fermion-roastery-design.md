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
    *   **Evasion Foundation:** Adopting the full landing page structure from the Evasion template (Hero, Features, Pricing, etc.) as the base, removing internal anchor links ("jump-to" navigation).
    *   **Custom Theming:** Injecting Fermion's modern-playful tokens into the Evasion components.

## Core Features
1.  **Production-Grade Landing Page:** A multi-section home page based on Evasion UI, customized for Fermion's brand.
2.  **Seamless B2B Onboarding:** Automated verification via Google Places API.
3.  **Role-Based Access Control:** Admin, Staff, B2B Partner, and Retail.
4.  **Modern Product Catalog:** Refined, modern icon set and layout for coffee specs.

## Next Steps
*   Finalize implementation plan.
*   Setup Supabase and Express boilerplate.
*   Refine Evasion template components with Fermion's modern-playful tokens.
