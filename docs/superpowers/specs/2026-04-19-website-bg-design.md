# Website Background Illustration — Design Spec

**Date:** 2026-04-19
**Status:** Approved

---

## Summary

Add a two-layer ambient background to the site: a stable hex grid that covers every page, and an animated node graph that lives in the hero section and crossfades into the hex grid below.

---

## Visual Design

### Layer 1 — Hex grid (all pages)

- **Pattern:** honeycomb SVG, cell ~28×24 px, `stroke="rgba(245,158,11,0.07)"` (amber, 7% opacity)
- **Rendering:** CSS `background-image` SVG data-URI on `body`
- **Scroll behaviour:** `background-attachment: fixed` — grid stays locked while content scrolls (parallax-like depth)
- **Coverage:** every page via root layout — no per-page work needed
- **Vignette:** none — uniform opacity everywhere

### Layer 2 — Node graph (hero section only)

- **Component:** `src/components/landing/hero-bg.tsx`
- **Positioning:** `absolute inset-0`, `pointer-events-none`, `aria-hidden="true"`, z-index below `HeroOrbs`
- **Nodes:** ~12 scattered across a wide viewBox (e.g. `0 0 1200 480`), with ~10 connecting edges; a few dashed edges for variation
- **Crossfade:** SVG `linearGradient` mask applied to the node group — fully visible at top, fades to transparent over the bottom ~30% of the viewBox
- **Animation:** 3–4 key nodes (the larger ones) get a slow opacity pulse: `0.40 → 0.65`, 4–6s ease-in-out loop, CSS `@keyframes` (not Framer Motion)
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables animation; nodes stay at mid-opacity (~0.50)

---

## Implementation

### Files changed

| File | Change |
|---|---|
| `src/styles/globals.css` | Add hex grid to `body`: `background-image`, `background-size`, `background-attachment: fixed` |
| `src/components/landing/hero-bg.tsx` | **New.** Absolutely-positioned SVG node graph with pulse animation |
| `src/app/page.tsx` | Import `HeroBg`; render inside hero section div, before `HeroOrbs` |

### globals.css change

Add to the `body` rule (or alongside existing body styles):

```css
body {
  /* existing styles... */
  background-image: url("data:image/svg+xml,..."); /* hex pattern */
  background-size: 28px 24px;                      /* ~hex cell size */
  background-attachment: fixed;
}
```

The SVG data-URI encodes a `<pattern>` with a single amber-stroked hexagon polygon.

### hero-bg.tsx structure

```tsx
"use client";
export function HeroBg() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 480"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* gradient mask for bottom crossfade */}
        {/* pulse keyframe via <style> */}
      </defs>
      {/* edges */}
      {/* nodes — key nodes get className="node-pulse" */}
    </svg>
  );
}
```

### page.tsx change

```tsx
// Inside the hero <section> or outermost hero div:
<div className="relative ...">
  <HeroBg />       {/* new — node graph, below orbs */}
  <HeroOrbs />     {/* existing — amber/violet blur orbs */}
  {/* hero content */}
</div>
```

---

## Constraints

- No Framer Motion in `HeroBg` — keep it CSS-only to avoid bundle overhead
- The hex grid must not cause layout shift — `background-image` on `body` is safe
- Nodes and edges are decorative only — no interactive behaviour, no accessibility role
- `prefers-reduced-motion` must be respected on all animations
- Do not animate the hex grid — it should be completely static

---

## Out of scope

- Per-page variation of the hex grid (all pages get the same pattern)
- Mouse-tracking parallax on the node graph
- Node graph on `/about`, `/proof`, or `/app` — landing page hero only
