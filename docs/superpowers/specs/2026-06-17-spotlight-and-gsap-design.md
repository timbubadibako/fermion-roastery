# Design Specification: Spotlight Tour & GSAP Performance Optimization

## 1. GSAP Performance Optimization (Hero Section)
- **Goal:** Resolve F12 warnings, eliminate lag, and disable heavy animations on mobile.
- **Tech Stack:** GSAP `matchMedia` & `gsap.context`.
- **Implementation Strategy:**
  - Wrap all `HeroV2` animations in `gsap.context()` with `ctx.revert()` in the cleanup function (`useEffect`/`useLayoutEffect`).
  - Use `gsap.matchMedia()` to wrap animation logic for desktop screens (`min-width: 768px`). Mobile devices will serve a static layout to conserve CPU/GPU resources and improve battery life.

## 2. Spotlight Guided Tour ("Scrapbook Spotlights")
- **Goal:** Provide a non-intrusive, aesthetic-aligned guided tour for retail/B2B users.
- **Scope:** Subscription, Wholesale, and Our Coffee pages.
- **Visual Aesthetic:** "Scrapbook" theme—textured note-card boxes, soft shadows, and clean typography.
- **Behavior:** 
  - **Automatic:** Triggered on first visit (persisted via `localStorage`).
  - **Manual:** Re-triggerable via a small FAB icon in the bottom corner.
  - **Interaction:** Dimming backdrop (`bg-black/60`), highlighting the focused area, and sliding in the note-card text explanation.
- **Logic:** Custom React component without heavy third-party libraries, relying on existing `gsap` instance.

## 3. Workflow & Branching
- **Branch:** `feat/spotlight-guide-and-gsap-perf`
- **Deployment:** Vercel Preview for approval -> Merge to `main`.
