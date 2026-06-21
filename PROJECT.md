# Project: Fermion Roastery i18n Integration

## Architecture
- **Monorepo / Frontend Layout**: Standard Next.js structure under `frontend/`.
- **Target Files**:
  - `frontend/app/account/page.tsx`
  - `frontend/app/cart/page.tsx`
  - `frontend/components/cart-sheet.tsx`
  - `frontend/app/b2b/register/page.tsx`
  - `frontend/app/b2b/contract/page.tsx`
  - `frontend/app/b2b/shop/page.tsx`
  - `frontend/app/b2b/checkout/page.tsx`
  - `frontend/app/subscription/checkout/page.tsx`
- **Shared translation state**: `frontend/lib/i18n.ts` houses translations and `useI18n()` hook.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Exploration and Translation Mapping | Map all hardcoded texts in all target files. | none | DONE |
| 2 | M2: Account Page Refactoring | Refactor `app/account/page.tsx` | M1 | DONE |
| 3 | M3: Cart Page & Sheet Refactoring | Refactor `app/cart/page.tsx` & `components/cart-sheet.tsx` | M1 | DONE |
| 4 | M4: B2B Register & Contract Refactoring | Refactor `app/b2b/register/page.tsx` & `app/b2b/contract/page.tsx` | M1 | DONE |
| 5 | M5: B2B Shop & Checkout Refactoring | Refactor `app/b2b/shop/page.tsx` & `app/b2b/checkout/page.tsx` | M1 | DONE |
| 6 | M6: Subscription Checkout Refactoring | Refactor `app/subscription/checkout/page.tsx` | M1 | IN_PROGRESS |
| 7 | M7: Final Verification & Auditing | Run typecheck, build validation, and forensic audits | M2, M3, M4, M5, M6 | PLANNED |

## Interface Contracts
### Page Component ↔ i18n Dictionary
- Components must import and use the `useI18n()` hook.
- Translation keys must be grouped logically under respective page contexts in `frontend/lib/i18n.ts` (e.g. `accountDashboard: { ... }`).
- Keys must match exactly between `en` and `id` dictionaries.

## Code Layout
- Root directory: `/home/jrilym/Projects/Next/fermion-roastery`
- Frontend: `frontend/`
- Translations: `frontend/lib/i18n.ts`
- Target Pages: `frontend/app/`
- Target Components: `frontend/components/`
