# Execution Plan

This document outlines the detailed execution plan for extracting hardcoded text and integrating i18n support across the target operational pages.

## Objectives
1. Identify all hardcoded texts in the 7 target files.
2. Group the text keys logically by page context.
3. Integrate translations in both English (`en`) and Indonesian (`id`) inside `frontend/lib/i18n.ts`.
4. Refactor pages/components to use `useI18n()`.
5. Verify build integrity (`npx tsc --noEmit` and `npm run build` in `frontend` directory).

## Steps

### Step 1: Mapping & Exploration
- Spawn `teamwork_preview_explorer` to scan the codebase, find all hardcoded text strings in target pages, and draft translations for `en` and `id`.
- Ensure translation mapping avoids banned terms (e.g. "ritual") and adheres to formatting guidelines.

### Step 2: Milestone Execution & Refactoring
Refactoring will be done milestone-by-milestone to maintain clean diffs and avoid conflicts in the shared `i18n.ts` dictionary:
- **Milestone 2**: Refactor `app/account/page.tsx`
- **Milestone 3**: Refactor `app/cart/page.tsx` & `components/cart-sheet.tsx`
- **Milestone 4**: Refactor `app/b2b/register/page.tsx` & `app/b2b/contract/page.tsx`
- **Milestone 5**: Refactor `app/b2b/shop/page.tsx` & `app/b2b/checkout/page.tsx`
- **Milestone 6**: Refactor `app/subscription/checkout/page.tsx`

Each milestone uses a sub-orchestrator pattern:
1. **Explorer**: Recommend exact translation keys and verify string replacements.
2. **Worker**: Perform dictionary updates in `i18n.ts` and component refactoring in target files.
3. **Reviewer**: Inspect changes for typesafety, UI breakage, and style.
4. **Challenger**: Run compilation & typecheck (`npx tsc --noEmit`) to verify correctness.

### Step 3: Final Verification & Auditing
- Verify that `frontend` builds successfully (`npm run build`).
- Spawn Forensic Auditor to verify no hardcoded text remains and i18n was implemented cleanly.
