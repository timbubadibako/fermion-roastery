# Fermion Roastery Marketing Site - Design Specification

## Context
Fermion Roastery already has a full landing template in `frontend/`. The product direction for this phase is to turn that template into a long-form, story-led marketing site that strengthens the Fermion brand and pushes sales toward B2B first, then retail.

The site should feel modern and joyful, with premium coffee positioning and playful brand details drawn from the blue-to-purple packaging gradient and the owner's emoji language.

## Goals
- Make the homepage feel like a narrative journey, not a static brochure.
- Push B2B inquiries and retail purchases through clear CTAs in every major section.
- Keep the brand memorable through motion, spacing, and a distinctive color system.
- Preserve the existing multi-page structure: `Our Coffee`, `Wholesale`, `Subscription`, `Journal`, `Our Story`, and auth pages.

## Non-Goals
- Checkout, payment gateway, shipping tracking, and review mechanics are not implemented in this spec.
- Marketplace backend logic is deferred to a separate spec.
- Auth flow behavior is treated as page-level routing only, not a new auth system.

## Design Direction
- **Theme:** modern, premium, joyful, and slightly playful.
- **Palette:** blue gradient into purple, with accents that support contrast and readability.
- **Motion:** Framer Motion with scroll stacking, parallax, and staggered reveals.
- **Tone:** confident, warm, and sales-oriented without feeling aggressive.

## Information Architecture
The homepage is a long scroll with linked sections:
1. Hero
2. Value proposition / competitive pricing
3. Bean showcase
4. Wholesale invitation
5. Retail / Our Coffee
6. Subscription
7. Journal teaser
8. Our Story
9. Footer CTA

Each section must contain a direct CTA to the relevant route.

## Route Map
- `/` — branded long-form landing page
- `/our-coffee` — retail product entry point
- `/wholesale` — B2B partner path and registration entry
- `/subscription` — retail subscription offers
- `/journal` — blog / story / event updates
- `/our-story` — brand story, values, owner, team
- `/auth/*` — login, register, forgot password

## Motion System
- Hero elements enter with subtle stagger and depth.
- Bean/product cards use parallax offsets during scroll.
- Section transitions use stacking behavior so panels feel layered as the user moves down the page.
- CTA blocks and supporting text reveal progressively to keep momentum.
- Motion should feel cinematic, but never distract from the sales message.

## Component Boundaries
- **Hero:** first impression, brand statement, primary CTA to wholesale and secondary CTA to retail.
- **Value section:** communicates quality + competitive pricing.
- **Bean showcase:** visual product story with interactive hover states.
- **Wholesale panel:** business-focused invitation and partner entry.
- **Retail panel:** product and subscription cross-sells.
- **Journal panel:** editorial teaser for stories, events, and roaster updates.
- **Story panel:** Fermion origin, values, owner, and team.
- **Footer CTA:** final conversion push.

## Content Rules
- B2B messaging stays above retail in prominence.
- Every section must connect to a real route, not a dead-end button.
- Storytelling should reinforce that Fermion is quality-driven, competitively priced, and joyful.
- Any playful emoji or illustration detail should stay restrained and premium.

## Error / Edge Handling
- If a route is unavailable, CTAs should degrade to the nearest relevant page instead of failing silently.
- If motion is reduced by the user, the layout must remain readable and structurally intact without the animation layer.

## Acceptance Criteria
- The landing page reads as a coherent brand story from top to bottom.
- B2B and retail CTAs are present in the expected sections and are visually distinct.
- Scroll animation, stacking, and parallax are part of the design, not optional embellishments.
- Auth, wholesale, retail, journal, and story routes are discoverable from the homepage.
