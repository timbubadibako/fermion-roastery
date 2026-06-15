# Fermion Roastery V2 & B2B Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "Cinematic" Hero UI, i18n localization, dynamic FAQ/Contact systems, and the complex B2B Wholesale dynamic tiering/contract logic.

**Architecture:** Engine-Heavy Hybrid approach. Backend handles complex business logic (pricing tiers, cron jobs, contract tracking), while Frontend (Next.js) handles dynamic UI rendering based on user roles and eligibility flags.

**Tech Stack:** Next.js 15 (Tailwind v4), Express v5, PostgreSQL, Axios, node-cron.

---

## File Mapping & Responsibilities

### Frontend
- `frontend/lib/strings.ts`: Source of truth for all localized (ID/EN) static text.
- `frontend/styles/globals.css`: Defines the 10-color hex system as CSS variables.
- `frontend/components/sections/v2/HeroV2.tsx`: Cinematic 100vh hero component.
- `frontend/components/sections/v2/FAQSection.tsx`: Dynamic FAQ accordion.
- `frontend/components/sections/v2/ContactSection.tsx`: Contact form with rate limiting awareness.
- `frontend/components/dashboard/B2BProgressBar.tsx`: Real-time KG accumulation tracker.
- `frontend/components/dashboard/TierClaimButton.tsx`: Conditional "Claim Silver Tier" button.

### Backend
- `backend/routes/contentRoutes.js`: Endpoints for FAQ and Contact Inquiries.
- `backend/controllers/contentController.js`: Logic for fetching FAQs and saving inquiries.
- `backend/routes/adminRoutes.js`: Protected endpoints for B2B approvals and churn alerts.
- `backend/controllers/adminController.js`: Admin-specific logic (Approval, Churn tracking).
- `backend/lib/cron.js`: Scheduled tasks for monthly volume calculation and tier resets.
- `backend/lib/security.js`: Rate limiting and input sanitization middleware.

### Database (`backend/schema.sql` updates)
- `faqs`: Localized questions and answers.
- `inquiries`: Customer messages.
- `b2b_contracts`: Tracking contract sequences and types.
- `profiles`: Updated with `is_silver_eligible` and `b2b_status` flags.

---

## Task 1: Foundation (Colors & i18n)

- [ ] **Step 1: Define CSS Variables**
  Modify: `frontend/styles/globals.css`
  Add the 10 logo-extracted colors as variables.
- [ ] **Step 2: Initialize Strings Library**
  Create: `frontend/lib/strings.ts`
  Add Hero and Common labels in ID and EN.
- [ ] **Step 3: Update Tailwind Configuration**
  Modify: `frontend/tailwind.config.ts`
  Map the new CSS variables to Tailwind utility classes.
- [ ] **Step 4: Commit**
  `git commit -m "feat(ui): implement color palette and i18n foundation"`

## Task 2: Backend Content Management (FAQ & Inquiries)

- [ ] **Step 1: Update Database Schema**
  Modify: `backend/schema.sql`
  Add `faqs` and `inquiries` tables.
- [ ] **Step 2: Create Content Controller**
  Create: `backend/controllers/contentController.js`
  Implement `getFaqs` and `createInquiry`.
- [ ] **Step 3: Implement Security Middleware**
  Create: `backend/lib/security.js`
  Add rate limiter and XSS sanitizer.
- [ ] **Step 4: Define Content Routes**
  Modify: `backend/routes/contentRoutes.js`
  Connect controller to endpoints.
- [ ] **Step 5: Test API**
  Run: `curl -X POST http://localhost:3001/api/content/contact -d '{"name":"Test", "email":"test@test.com", "message":"Hello"}'`
- [ ] **Step 6: Commit**
  `git commit -m "feat(api): add FAQ and Contact Inquiry system with security"`

## Task 3: B2B Logic (Contracts & Tiering)

- [ ] **Step 1: Update Database for B2B**
  Modify: `backend/schema.sql`
  Add `b2b_contracts` table and update `profiles` table.
- [ ] **Step 2: Implement Monthly Cron Job**
  Create: `backend/lib/cron.js`
  Write logic to calculate volume and set `is_silver_eligible`.
- [ ] **Step 3: Create Tier Claim Endpoint**
  Modify: `backend/controllers/authController.js`
  Add `claimSilverTier` function.
- [ ] **Step 4: Implement Contract History Logic**
  Modify: `backend/controllers/adminController.js`
  Add contract sequence tracking and service unlocking logic.
- [ ] **Step 5: Commit**
  `git commit -m "feat(b2b): implement contract history and dynamic tier logic"`

## Task 4: UI Overhaul (Hero & Dashboards)

- [ ] **Step 1: Refactor Hero Section**
  Modify: `frontend/components/sections/v2/HeroV2.tsx`
  Implement the 100vh cinematic image with linear scrim.
- [ ] **Step 2: Build B2B Dashboard Components**
  Create: `frontend/components/dashboard/B2BProgressBar.tsx`
  Implement the real-time KG tracker.
- [ ] **Step 3: Implement FAQ & Contact Components**
  Create: `frontend/components/sections/v2/FAQSection.tsx`
- [ ] **Step 4: Implement Admin Churn Alerts**
  Modify: `frontend/app/admin/dashboard/page.tsx`
  Add the 45-day churn notification logic.
- [ ] **Step 5: Commit**
  `git commit -m "feat(ui): finalize v2 hero and role-specific dashboards"`
