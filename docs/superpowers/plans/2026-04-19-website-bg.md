# Website Background Illustration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a two-layer ambient background — stable hex grid on every page + animated node graph on the hero that crossfades into the hex grid below.

**Architecture:** Hex grid lives in `globals.css` as a `background-image` SVG data-URI on `body` (`background-attachment: fixed`). Node graph is a new server component `HeroBg` rendered in `page.tsx` before `HeroOrbs`, using an inline SVG with a gradient mask for the crossfade and CSS `@keyframes` for node pulse animation.

**Tech Stack:** Next.js 15 App Router, Tailwind v4, SVG, CSS animations

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `frontend/src/styles/globals.css` | Modify (body rule) | Hex grid as CSS background |
| `frontend/src/components/landing/hero-bg.tsx` | **Create** | Node graph SVG, pulse animation, crossfade mask |
| `frontend/src/app/page.tsx` | Modify | Import + render `<HeroBg />` before `<HeroOrbs />` |

---

## Task 1: Hex grid on `body`

**Files:**
- Modify: `frontend/src/styles/globals.css` lines 111–119 (existing `body` rule)

- [ ] **Step 1: Add hex grid properties to the body rule**

The existing body rule starts at line 111. Add three properties after `background-color`:

```css
  body {
    min-height: 100dvh;
    background-color: var(--color-bg);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20.8' height='36'%3E%3Cpolygon points='10.4,0 20.8,6 20.8,18 10.4,24 0,18 0,6' fill='none' stroke='rgba(245,158,11,0.07)' stroke-width='0.8'/%3E%3Cpolygon points='0,18 10.4,24 10.4,36 0,42 -10.4,36 -10.4,24' fill='none' stroke='rgba(245,158,11,0.07)' stroke-width='0.8'/%3E%3C/svg%3E");
    background-size: 20.8px 36px;
    background-attachment: fixed;
    color: var(--color-text);
    font-family: var(--font-sans);
    font-size: 16px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
```

The data URI encodes two partial hexagon polygons that tile into a seamless honeycomb. The pattern cell is 20.8×36px (side length ≈12px). `background-attachment: fixed` keeps the grid locked while content scrolls.

- [ ] **Step 2: Verify hex grid renders on all pages**

Run:
```bash
cd frontend && npm run dev
```

Open http://localhost:3000 in the browser. The hex grid should be faintly visible on the dark background — thin amber lines forming a honeycomb pattern. Check `/`, `/about`, and `/app` — all should have it. The grid should NOT move when you scroll.

- [ ] **Step 3: Commit**

```bash
cd frontend && git add src/styles/globals.css
git commit -m "feat: add hex grid background to body"
```

---

## Task 2: Create `HeroBg` component

**Files:**
- Create: `frontend/src/components/landing/hero-bg.tsx`

- [ ] **Step 1: Create the component file**

This is a server component (no `"use client"` — no browser APIs needed). It renders an absolutely-positioned SVG. A `<style>` block inside the SVG defines the pulse keyframe. A `linearGradient` mask fades the nodes out toward the bottom 30% of the SVG (the crossfade zone).

Create `frontend/src/components/landing/hero-bg.tsx` with:

```tsx
// frontend/src/components/landing/hero-bg.tsx

export function HeroBg() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 480"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient mask: nodes fully visible top half, fade to transparent bottom 30% */}
        <linearGradient id="hero-node-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="white" stopOpacity="1" />
          <stop offset="60%"  stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="hero-node-mask">
          <rect width="1200" height="480" fill="url(#hero-node-fade)" />
        </mask>

        {/* Pulse keyframe for key nodes */}
        <style>{`
          .node-pulse-a { animation: node-pulse 5s ease-in-out infinite; }
          .node-pulse-b { animation: node-pulse 4s ease-in-out infinite 0.8s; }
          .node-pulse-c { animation: node-pulse 6s ease-in-out infinite 1.6s; }
          .node-pulse-d { animation: node-pulse 4.5s ease-in-out infinite 2.4s; }
          @keyframes node-pulse {
            0%, 100% { opacity: 0.40; }
            50%       { opacity: 0.65; }
          }
          @media (prefers-reduced-motion: reduce) {
            .node-pulse-a,
            .node-pulse-b,
            .node-pulse-c,
            .node-pulse-d { animation: none; opacity: 0.50; }
          }
        `}</style>
      </defs>

      {/* All nodes and edges are masked so they fade at the bottom */}
      <g mask="url(#hero-node-mask)">

        {/* ── Edges ─────────────────────────────────────── */}
        <line x1="120" y1="80"  x2="300" y2="140" stroke="rgba(245,158,11,0.11)" strokeWidth="1" />
        <line x1="300" y1="140" x2="520" y2="60"  stroke="rgba(245,158,11,0.10)" strokeWidth="1" />
        <line x1="520" y1="60"  x2="680" y2="170" stroke="rgba(245,158,11,0.10)" strokeWidth="1" />
        <line x1="680" y1="170" x2="850" y2="90"  stroke="rgba(245,158,11,0.09)" strokeWidth="1" />
        <line x1="850" y1="90"  x2="1050" y2="150" stroke="rgba(245,158,11,0.09)" strokeWidth="1" />
        <line x1="1050" y1="150" x2="1150" y2="80" stroke="rgba(245,158,11,0.08)" strokeWidth="1" />
        <line x1="300"  y1="140" x2="200"  y2="260" stroke="rgba(245,158,11,0.09)" strokeWidth="1" />
        <line x1="680"  y1="170" x2="430"  y2="300" stroke="rgba(245,158,11,0.08)" strokeWidth="1" strokeDasharray="5 6" />
        <line x1="520"  y1="60"  x2="430"  y2="300" stroke="rgba(245,158,11,0.07)" strokeWidth="1" strokeDasharray="5 6" />
        <line x1="430"  y1="300" x2="650"  y2="340" stroke="rgba(245,158,11,0.09)" strokeWidth="1" />
        <line x1="650"  y1="340" x2="820"  y2="280" stroke="rgba(245,158,11,0.08)" strokeWidth="1" />
        <line x1="820"  y1="280" x2="1000" y2="310" stroke="rgba(245,158,11,0.08)" strokeWidth="1" />
        <line x1="200"  y1="260" x2="430"  y2="300" stroke="rgba(245,158,11,0.07)" strokeWidth="1" />

        {/* ── Glow halos (static, behind the node dots) ── */}
        <circle cx="300"  cy="140" r="14" fill="rgba(245,158,11,0.06)" />
        <circle cx="680"  cy="170" r="12" fill="rgba(245,158,11,0.05)" />
        <circle cx="1050" cy="150" r="13" fill="rgba(245,158,11,0.05)" />
        <circle cx="430"  cy="300" r="12" fill="rgba(245,158,11,0.05)" />

        {/* ── Nodes — small (static) ────────────────────── */}
        <circle cx="120"  cy="80"  r="3"   fill="rgba(245,158,11,0.28)" />
        <circle cx="520"  cy="60"  r="3.5" fill="rgba(245,158,11,0.32)" />
        <circle cx="850"  cy="90"  r="3"   fill="rgba(245,158,11,0.28)" />
        <circle cx="1150" cy="80"  r="2.5" fill="rgba(245,158,11,0.22)" />
        <circle cx="200"  cy="260" r="3"   fill="rgba(245,158,11,0.26)" />
        <circle cx="650"  cy="340" r="3"   fill="rgba(245,158,11,0.26)" />
        <circle cx="820"  cy="280" r="3.5" fill="rgba(245,158,11,0.28)" />
        <circle cx="1000" cy="310" r="3"   fill="rgba(245,158,11,0.24)" />

        {/* ── Nodes — key (pulse animated) ─────────────── */}
        <circle cx="300"  cy="140" r="5.5" fill="rgba(245,158,11,0.52)" className="node-pulse-a" />
        <circle cx="680"  cy="170" r="4.5" fill="rgba(245,158,11,0.45)" className="node-pulse-b" />
        <circle cx="1050" cy="150" r="5"   fill="rgba(245,158,11,0.48)" className="node-pulse-c" />
        <circle cx="430"  cy="300" r="4.5" fill="rgba(245,158,11,0.42)" className="node-pulse-d" />
      </g>
    </svg>
  );
}

export default HeroBg;
```

- [ ] **Step 2: Verify the component has no type errors**

Run:
```bash
cd frontend && npx tsc --noEmit 2>&1 | head -30
```

Expected: no output (zero errors). If you see JSX attribute errors like `stopColor` / `strokeWidth` — those are the correct camelCase SVG prop names in React and should pass. If you see errors about unknown props, check you haven't accidentally left HTML attribute names (`stop-color`, `stroke-width`) instead of React's camelCase equivalents.

---

## Task 3: Wire `HeroBg` into `page.tsx`

**Files:**
- Modify: `frontend/src/app/page.tsx`

- [ ] **Step 1: Import and render HeroBg**

`page.tsx` currently has `<HeroOrbs />` at line 21, as the first child of the root `<div className="relative min-h-dvh">`. Add `HeroBg` before it so nodes render behind the orb blurs (later DOM siblings paint on top).

Replace the top of `page.tsx`:

```tsx
import Link from "next/link";
import { appConfig } from "@/lib/config";
import { shortenAddress } from "@/lib/format";
import { ActivitySnackbar } from "@/components/activity/activity-snackbar";
import { RecentActivity } from "@/components/activity/recent-activity";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { LocalizedHero } from "@/components/landing/localized-hero";
import { HeroOrbs } from "@/components/landing/hero-orbs";
import { HeroBg } from "@/components/landing/hero-bg";
```

Then in the JSX, replace:

```tsx
    <div className="relative min-h-dvh">
      <HeroOrbs />
```

with:

```tsx
    <div className="relative min-h-dvh">
      <HeroBg />
      <HeroOrbs />
```

- [ ] **Step 2: Verify visually**

With `npm run dev` still running, reload http://localhost:3000. You should see:
- Hero section: amber nodes connected by thin edges, concentrated in the upper half. A few nodes slowly pulse in opacity. The nodes fade to nothing toward the bottom of the hero area, where the hex grid continues uninterrupted.
- Orb blurs (amber top-left, violet bottom-right) appear on top of the nodes — the orbs are larger and blurrier, nodes are sharp thin lines beneath them.
- Scrolling down: hex grid continues uniformly with no nodes. Grid stays fixed (doesn't scroll).

If nodes appear ON TOP of the orbs: swap the render order so `<HeroOrbs />` comes after `<HeroBg />`.

If the crossfade looks abrupt: adjust the `60%` stop in the `hero-node-fade` gradient to `50%` for an earlier fade.

- [ ] **Step 3: Check reduced-motion**

In Chrome DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`. All four pulsing nodes should stop animating and stay at a fixed opacity (~0.50). The hex grid and static nodes are unaffected.

- [ ] **Step 4: Commit**

```bash
cd frontend && git add src/components/landing/hero-bg.tsx src/app/page.tsx
git commit -m "feat: hero node graph background with crossfade to hex grid"
```

---

## Done

All three files changed. The background is:
- **Every page:** faint amber hex grid, `background-attachment: fixed`
- **Landing hero only:** node graph with slow pulse on 4 key nodes, fading into hex grid below
