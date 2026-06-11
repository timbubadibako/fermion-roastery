# Fermion Marketing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current frontend into a Fermion-branded, story-led marketing site with B2B-first conversion, retail cross-sells, custom scroll motion, and packaging-matched UI polish.

**Architecture:** Keep the existing Next.js App Router structure, but replace the Evasion-style landing experience with a Fermion-specific visual system and homepage story flow. Centralize shared chrome and tokens in the root layout/global CSS, then rebuild the homepage as a composed set of focused sections and align all route entry points to the same brand language.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS v4 utilities, Framer Motion, next/font, Lucide React.

---

### Task 1: Rebuild the shared Fermion shell and design tokens

**Files:**
- Modify: `frontend/app/layout.tsx`
- Modify: `frontend/app/globals.css`

- [ ] **Step 1: Read the Next.js App Router and font docs before editing layout**

Check `node_modules/next/dist/docs/` for the current guidance on metadata, fonts, and App Router layout behavior so the implementation matches this project’s Next.js version.

- [ ] **Step 2: Replace the global font and metadata setup in `frontend/app/layout.tsx`**

Use a Fermion-facing font stack and brand metadata:

```tsx
import React from "react";
import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Fermion Roastery",
  description: "Modern coffee commerce for wholesale, retail, subscription, and story-led brand discovery.",
};
```

Wrap the `<body>` with both variables:

```tsx
<body className={`${fraunces.variable} ${manrope.variable} font-sans antialiased`}>
```

- [ ] **Step 3: Rework `frontend/app/globals.css` around the Fermion palette**

Use off-white as the base, not cream, and add the packaging-inspired accent system:

```css
:root {
  --background: #faf9f6;
  --foreground: #101828;
  --surface: rgba(255, 255, 255, 0.72);
  --border: rgba(16, 24, 40, 0.08);
  --fermion-blue: #84a8ff;
  --fermion-blue-deep: #6486f4;
  --fermion-lilac: #b7a0ff;
  --fermion-lilac-deep: #8f73ff;
  --fermion-yellow: #f3ca57;
  --fermion-coral: #ff826f;
}
```

Add a custom scrollbar track/thumb pair using CSS only, not default webkit styling, and keep `prefers-reduced-motion` from breaking layout:

```css
html {
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: var(--fermion-blue-deep) rgba(16, 24, 40, 0.08);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: Validate the shared shell with the repo scripts**

Run:

```bash
cd frontend && npm run lint
cd frontend && npm run build
```

Expected: both commands complete successfully after the font and token update.

- [ ] **Step 5: Commit the shell and token changes**

```bash
git add frontend/app/layout.tsx frontend/app/globals.css
git commit -m "feat: establish fermion shell and design tokens"
```

---

### Task 2: Rebuild the homepage into a Fermion story-led conversion page

**Files:**
- Modify: `frontend/app/page.tsx`
- Create: `frontend/components/sections/fermion-hero-section.tsx`
- Create: `frontend/components/sections/fermion-value-section.tsx`
- Create: `frontend/components/sections/fermion-bean-showcase-section.tsx`
- Create: `frontend/components/sections/fermion-wholesale-section.tsx`
- Create: `frontend/components/sections/fermion-retail-section.tsx`
- Create: `frontend/components/sections/fermion-subscription-section.tsx`
- Create: `frontend/components/sections/fermion-journal-section.tsx`
- Create: `frontend/components/sections/fermion-story-section.tsx`
- Create: `frontend/components/sections/fermion-footer-cta-section.tsx`
- Create: `frontend/components/ui/fermion-placeholder-panel.tsx`

- [ ] **Step 1: Define the reusable placeholder panel**

Create a small card component that accepts `tone`, `title`, and `description`, and use it anywhere the page needs an intentional empty-state visual:

```tsx
type Tone = "blue" | "lilac" | "yellow" | "coral" | "dark";

export function FermionPlaceholderPanel({
  tone,
  title,
  description,
}: {
  tone: Tone;
  title: string;
  description: string;
}) {
  return (
    <section className={`fermion-placeholder fermion-placeholder--${tone}`}>
      <span className="fermion-placeholder__tag">Placeholder</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </section>
  );
}
```

- [ ] **Step 2: Build the hero section with B2B-first copy and dual CTAs**

The hero must lead with wholesale and retail actions, not generic branding. Use the packaging colors, a premium off-white base, and a strong headline hierarchy:

```tsx
export function FermionHeroSection() {
  return (
    <section className="fermion-hero">
      <p className="fermion-eyebrow">Fermion Roastery</p>
      <h1>Modern coffee commerce for joyful wholesale and retail growth.</h1>
      <p>Competitively priced beans, story-led branding, and a premium path for cafes and coffee drinkers.</p>
      <div className="fermion-hero__actions">
        <Link href="/wholesale">Wholesale first</Link>
        <Link href="/our-coffee">Shop our coffee</Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add the value, bean showcase, and wholesale sections**

Use the current Fermion narrative: quality beans, competitive pricing, playful premium packaging, and B2B trust. Keep the sections distinct so each one has one job:

```tsx
// value section: price + quality proof
// bean showcase section: hero pack shots + product stories
// wholesale section: partner invitation + B2B registration CTA
```

The bean showcase should include at least one placeholder panel for a missing photo and one for a product-spec card, with different tones so the page does not look uniform.

- [ ] **Step 4: Add retail, subscription, journal, and story sections**

Each section should have one conversion goal and one supporting explanation:

```tsx
// retail: route to /our-coffee
// subscription: route to /subscription
// journal: route to /journal
// story: route to /our-story
```

Use the placeholder component wherever content is still missing so no section ends up visually empty.

- [ ] **Step 5: Wire `frontend/app/page.tsx` to the Fermion section stack**

Replace the current template section imports with the new Fermion sections in this order:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <FermionHeroSection />
      <FermionValueSection />
      <FermionBeanShowcaseSection />
      <FermionWholesaleSection />
      <FermionRetailSection />
      <FermionSubscriptionSection />
      <FermionJournalSection />
      <FermionStorySection />
      <FermionFooterCTASection />
    </main>
  );
}
```

- [ ] **Step 6: Validate the homepage section stack**

Run:

```bash
cd frontend && npm run lint
cd frontend && npm run build
```

Expected: the homepage compiles with the new section imports and no unused Evasion template references remain in the homepage path.

- [ ] **Step 7: Commit the homepage rebuild**

```bash
git add frontend/app/page.tsx frontend/components/sections frontend/components/ui/fermion-placeholder-panel.tsx
git commit -m "feat: rebuild fermion homepage as story-led landing page"
```

---

### Task 3: Align navigation, route names, and conversion pages

**Files:**
- Modify: `frontend/components/header.tsx`
- Modify: `frontend/components/sections/footer-section.tsx`
- Modify: `frontend/app/wholesale/page.tsx`
- Modify: `frontend/app/retail/page.tsx`
- Modify: `frontend/app/subscription/page.tsx`
- Modify: `frontend/app/blog/page.tsx`
- Modify: `frontend/app/about/page.tsx`
- Modify: `frontend/app/account/page.tsx`
- Modify: `frontend/app/cart/page.tsx`
- Modify: `frontend/app/b2b/register/page.tsx`

- [ ] **Step 1: Update the header route map to Fermion route names**

Use the real route targets and keep the B2B path prominent:

```tsx
const NAV_LINKS = [
  { label: "Our Coffee", href: "/retail" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Subscription", href: "/subscription" },
  { label: "Journal", href: "/journal" },
  { label: "Our Story", href: "/our-story" },
];
```

Also fix any remaining `/blog`, `/about`, `/retail/register`, or `/wholesale/register` mismatch so the navigation never points to the wrong route.

- [ ] **Step 2: Rework the footer into a real Fermion sitemap**

Replace placeholder links with the actual marketing routes and use B2B-first hierarchy:

```tsx
const footerLinks = {
  explore: [
    { label: "Our Coffee", href: "/retail" },
    { label: "Wholesale", href: "/wholesale" },
    { label: "Subscription", href: "/subscription" },
    { label: "Journal", href: "/journal" },
  ],
  about: [
    { label: "Our Story", href: "/our-story" },
    { label: "Team", href: "/our-story#team" },
    { label: "Contact", href: "/contact" },
  ],
};
```

- [ ] **Step 3: Rewrite the route pages so they match Fermion’s story and CTA intent**

Update each page to use the packaging palette, off-white base, and a single conversion goal:

```tsx
// wholesale: wholesale partner story + /b2b/register CTA
// retail: curated product catalog + add-to-cart flow
// subscription: espresso / filter / roaster choice tiers
// journal: editorial stories about beans, events, and roasts
// about: Fermion origin, values, owner, and team
// account: login / register / forgot-password states
// cart: cart summary with checkout CTA
// b2b/register: shop search + partner application flow
```

Fix the obvious route mismatch in wholesale CTA so it points to `/b2b/register`, not a non-existent `/wholesale/register`.

- [ ] **Step 4: Validate route consistency with a full frontend build**

Run:

```bash
cd frontend && npm run lint
cd frontend && npm run build
```

Expected: no broken hrefs, no missing imports, and no route references to deprecated template paths.

- [ ] **Step 5: Commit the navigation and route repair**

```bash
git add frontend/components/header.tsx frontend/components/sections/footer-section.tsx frontend/app/wholesale/page.tsx frontend/app/retail/page.tsx frontend/app/subscription/page.tsx frontend/app/blog/page.tsx frontend/app/about/page.tsx frontend/app/account/page.tsx frontend/app/cart/page.tsx frontend/app/b2b/register/page.tsx
git commit -m "feat: align fermion navigation and route pages"
```

---

### Task 4: Add scroll motion, custom scrollbar, and reduced-motion safety

**Files:**
- Modify: `frontend/app/globals.css`
- Modify: `frontend/components/sections/fermion-hero-section.tsx`
- Modify: `frontend/components/sections/fermion-bean-showcase-section.tsx`
- Modify: `frontend/components/sections/fermion-value-section.tsx`
- Modify: `frontend/components/sections/fermion-wholesale-section.tsx`

- [ ] **Step 1: Encode the scroll animation rules in shared CSS classes**

Add motion utilities that support stacking, parallax, and staggered reveals without hardcoding browser-specific scrollbar styles:

```css
.fermion-stack {
  position: sticky;
  top: 0;
}

.fermion-parallax {
  will-change: transform;
}

.fermion-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 500ms ease, transform 500ms ease;
}

.fermion-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 2: Apply the motion rules to the hero and product showcase**

The hero should use a sticky/pinned first view, the product cards should drift slightly on scroll, and the section transitions should overlap just enough to feel cinematic.

```tsx
// hero: sticky first panel with layered visual depth
// showcase: scroll-linked product cards with subtle y-offsets
// wholesale/value: staggered text reveal and CTA timing
```

- [ ] **Step 3: Keep the custom scrollbar visible and brand-aligned**

Use a thin track and a blue-lilac thumb that mirrors the visual preview. Do not revert to the default browser scrollbar or add webkit-only styling.

- [ ] **Step 4: Validate motion behavior and accessibility**

Run:

```bash
cd frontend && npm run lint
cd frontend && npm run build
```

Then manually verify that the page still reads correctly with reduced motion enabled and that the sticky sections do not block access to the final CTA.

- [ ] **Step 5: Commit the motion and accessibility polish**

```bash
git add frontend/app/globals.css frontend/components/sections/fermion-hero-section.tsx frontend/components/sections/fermion-bean-showcase-section.tsx frontend/components/sections/fermion-value-section.tsx frontend/components/sections/fermion-wholesale-section.tsx
git commit -m "feat: add fermion motion system and accessibility polish"
```

---

### Task 5: Final QA pass and handoff notes

**Files:**
- No new files

- [ ] **Step 1: Run the full frontend verification pass**

Run:

```bash
cd frontend && npm run lint
cd frontend && npm run build
```

Expected: clean output with no lint failures and a successful production build.

- [ ] **Step 2: Spot-check the browser flow**

Manually verify:

```text
/
/wholesale
/retail
/subscription
/journal
/our-story
/b2b/register
/account
/cart
```

Confirm the homepage CTAs, header links, and footer links all land on the intended route.

- [ ] **Step 3: Update the task tracker if the repo uses one for implementation progress**

If the team wants a visible implementation checklist, sync the completed status in the local planning notes after the build pass.

- [ ] **Step 4: Commit any final QA tweaks**

```bash
git add .
git commit -m "chore: finalize fermion marketing site qa"
```
