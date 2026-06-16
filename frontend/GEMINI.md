# Frontend Design Guidelines: "Freedom Scrapbook"

This document outlines the core aesthetic direction and technical implementation rules for the Fermion Roastery landing page and related frontend components, as defined during the "Freedom Scrapbook" redesign phase.

## Aesthetic Vision: "Freedom Scrapbook"

The overarching theme is a dynamic, slightly irregular "scrapbook" feel that conveys freedom and artisan craftsmanship without relying on generic AI aesthetics. 

## UI/UX Design Constraints

- **Font Readability (Crucial):** All numerical values and monetary amounts MUST use standard, highly-readable sans-serif fonts (`font-sans`/Manrope). NEVER use hand-drawn or decorative fonts (like the custom 'Cloude'/Permanent Marker font) for prices, as this negatively impacts UX and readability.
- **Clean Note Cards:** We prefer clean, off-white/cream or pure white cards that resemble pieces of paper or notes (as seen in "The Fermion Way" section).
- **Subtle Accents:** Use soft drop shadows (`shadow-[8px_8px_0px_rgba(0,0,0,0.05)]`), subtle masking tape elements (`bg-white/60`, `backdrop-blur`), and hand-drawn accents like squiggly lines for separators.
- **Varied Zig-Zag Flow:** The page should flow through alternating Light and Dark themes (e.g., Cream -> Dark Maroon -> Pale Beige -> Dark Green). 
- **Mixed Transitions:** Use a combination of flat (straight) borders and "torn paper" edges (`clip-path` polygons) between sections. Do not use torn edges on *every* transition to avoid monotony.
- **Distinctive Typography:** Prominent use of the custom `Cloude` font for large headings, signatures, and background accents, paired with `Fraunces` and `Manrope`.
- **Smooth Animations:** Use GSAP for scroll-triggered parallax and smooth entry animations.

### What We DISLIKE (Avoid This)
- **Heavy Retro/Brutalist Cards:** Avoid thick black borders (`border-4 border-black`), overly deep/harsh shadows (`shadow-[12px_12px_0px_rgba(0,0,0,1)]`), and dark card backgrounds that look like heavy polaroids.
- **Monotonous Layouts:** Avoid standard 50/50 splits or perfectly aligned grids without any rotation or irregularity. (Though, keep core structural components like the Series section clean if specifically requested).
- **Overused Effects:** Do not overuse the zigzag/torn paper effect on every single section divider.
- **Generic Colors:** Avoid pure `#000000` or `#FFFFFF` as large backgrounds. Use tinted variants like Dark Slate, Dark Forest Green (`#1A2B20`), Maroon (`#2A1619`), Cream (`#E2DACB`), and Pale Beige (`#F4F0E6`).

## Technical Rules
- **No Inline `Math.random()`:** Never use `Math.random()` directly in inline React `style={{}}` attributes during SSR, as this causes React Hydration Errors. For scrapbook irregularity (slight rotations, border-radius variations), either use an index-based pseudo-random value (e.g., `idx % 2 === 0 ? 1 : -1`) or apply the randomness strictly on the client side using `useEffect` or GSAP.
- **Marquee Animations:** For infinitely scrolling elements (like partner logos), ensure seamless looping by duplicating the content within a wide container and animating its `x` position to `-50%` using a linear ease. Avoid animating between explicit pixel values `[0, -1000]` which causes glitching.
- **Z-Indexing for Clip-Path:** When using negative margins to pull sections together for a torn-paper overlap, explicitly set ascending `z-index` values down the page to ensure the upper section's torn edge correctly masks the section above it.