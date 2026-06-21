# Original User Request

## Initial Request — 2026-06-20T08:46:34Z

Extract all hardcoded text from 7 key operational pages (Account, B2B Registration, B2B Contract, B2B Shop, B2B Checkout, Cart, Subscription Checkout), add them to the existing `lib/i18n.ts` dictionary in both English and Indonesian, and update the pages to use the `useI18n()` hook.

Working directory: /home/jrilym/Projects/Next/fermion-roastery
Integrity mode: development

## Requirements

### R1. Complete Text Extraction
Extract all hardcoded texts (including headings, paragraphs, button labels, placeholders, alert/toast messages, and empty states) from the target files:
- `app/account/page.tsx`
- `app/cart/page.tsx` & `components/cart-sheet.tsx`
- `app/b2b/register/page.tsx`
- `app/b2b/contract/page.tsx`
- `app/b2b/shop/page.tsx`
- `app/b2b/checkout/page.tsx`
- `app/subscription/checkout/page.tsx`

### R2. Dictionary Integration
Insert the extracted texts into `frontend/lib/i18n.ts`. You must add them to BOTH the `en` and `id` objects. Group the keys logically by their page context (e.g., `accountDashboard: { ... }`, `b2bShop: { ... }`) rather than dumping them all into a flat structure.

### R3. Component Refactoring
Refactor the target pages/components to import and use the `useI18n()` hook. Replace all the hardcoded strings you found with the corresponding dynamic variables (e.g., `t.accountDashboard.welcomeMessage`). Ensure that JSX syntax and component states remain unbroken.

## Acceptance Criteria

### Static Analysis
- [ ] Running `npx tsc --noEmit` inside the `frontend` directory completes successfully with 0 errors (verifying that all new i18n keys are correctly typed and exist in both dictionaries).

### Build Integrity
- [ ] Running `npm run build` inside the `frontend` directory completes successfully (verifying that the React components were not broken during the replacement process).
