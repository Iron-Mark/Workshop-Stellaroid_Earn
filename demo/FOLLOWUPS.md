# Follow-ups: current status

Current audit of the deployed app versus the original punch list.

Use this as the live backlog. Items already shipped are called out so we do not re-audit stale issues.

---

## Resolved

### 8. Sitemap + robots.txt

**Status**
- Done.

**What shipped**
- `frontend/src/app/sitemap.ts`
- `frontend/src/app/robots.ts`

**Notes**
- Static routes `/`, `/about`, `/app`, and `/proof` are present in the sitemap.
- `robots.ts` explicitly allows crawling and points to the generated sitemap.

---

## Partially addressed

### 2. Contract-ID / network drift silent failure

**Status**
- Partially fixed.

**What shipped**
- Wallet state now captures Freighter network details.
- Wrong-network state is surfaced in the wallet button as a warning badge.

**Still missing**
- Top-of-page dismissible banner on `/app` explaining the mismatch in plain language.
- Explicit warning when `NEXT_PUBLIC_CONTRACT_ID` is empty.
- Stronger UX for pubnet/testnet drift before a form submission fails.

**Files**
- `frontend/src/lib/freighter.ts`
- `frontend/src/hooks/use-freighter-wallet.ts`
- `frontend/src/components/wallet/wallet-connect-button.tsx`
- `frontend/src/app/app/page.tsx`

---

### 5. `/proof` index has no sample hashes

**Status**
- Partially fixed.

**What shipped**
- `/proof` now includes a demo hash block so the page is no longer a dead-end for first-time visitors.

**Still missing**
- The original ask was stronger: 2-3 sample chips or recent verified hashes, not a single plain link.
- If the live activity feed lands, this page should pull the latest real hashes from there instead of hardcoding one.

**Files**
- `frontend/src/app/proof/page.tsx`

---

## Still open

### 1. Mobile = Freighter absent (no empty state)

**What**
Freighter is a desktop browser extension. `/app` still assumes the wallet flow and does not swap into a mobile-safe empty state that points users to desktop or a sample Proof Block.

**Current behavior**
- The modal explains how to install Freighter, but it does not solve the mobile dead-end.
- The main `/app` layout still renders the normal action stack regardless of device context.

**Fix**
- Detect mobile user-agent and/or unsupported wallet state early.
- Swap the action column for a clear empty state:
  "Freighter is desktop-only. Open this on desktop, or view a sample Proof Block."
- Keep the right-side Proof Block preview visible so mobile visitors still see a useful demo artifact.

**Files**
- `frontend/src/components/wallet/*`
- `frontend/src/components/onboarding/freighter-welcome.tsx`
- `frontend/src/app/app/page.tsx`

---

### 3. Locale toggle only covers the hero

**What**
The footer toggle still changes only the homepage hero copy. `/about`, `/app`, footer copy, and the rest of the site remain English, so the scope is still misleading.

**Current behavior**
- Toggle still lives in the footer.
- Only `LocalizedHero` subscribes to locale changes.

**Options**
- **A (fast)** Move the toggle inside the hero with copy that makes the scope explicit.
- **B (right)** Add a lightweight i18n dictionary/context and translate at least hero, footer, `/about`, `/app`, and FAQ/demo-script-facing copy.

**Files**
- `frontend/src/components/layout/locale-toggle.tsx`
- `frontend/src/components/layout/site-footer.tsx`
- `frontend/src/components/landing/localized-hero.tsx`
- likely new `frontend/src/lib/i18n/*`

---

### 4. No live on-chain events feed

**What**
The site still has no fetched on-chain activity strip. Home currently shows hardcoded transaction rows, which is better than nothing but weaker than a real event feed.

**Fix**
- New server component `frontend/src/components/activity/recent-activity.tsx`
- New `frontend/src/lib/events.ts` with `getRecentEvents(contractId, limit)`
- Fetch recent Soroban contract events and render a compact list with event label, short hash, relative time, and explorer link
- Cache for 30s

**Mount points**
- `/`
- `/about`

**Files**
- `frontend/src/app/page.tsx`
- `frontend/src/app/about/page.tsx`
- new activity/event helpers

---

### 6. Errors-are-human grid needs category pills

**What**
The contract-surface section is grouped nicely, but the error section is still a flat grid. The original category treatment has not landed.

**Fix**
- Tag each error with a category, for example:
  - `#1-#2` state
  - `#3` auth
  - `#4-#6` input
- Add colored pills or tones that mirror the existing function-tone system

**Files**
- `frontend/src/app/about/page.tsx`
- `frontend/src/app/about/page.module.css`

---

## Stretch

### 7. Print stylesheet for `/proof/[hash]`

**Status**
- Still open.

**What**
Print styling exists but is minimal. The original polish pass for single-page A4 output, cleaner QR alignment, and hiding share affordances has not landed.

**Files**
- `frontend/src/components/proof/proof-card.module.css`

---

### 9. Lightweight analytics

**Status**
- Still open.

**What**
No Vercel Analytics or Plausible integration is wired up yet, so there is still no visibility into which sections convert during demos.

---

### 10. Accessibility pass

**Status**
- Still open.

**What**
- No skip-link in `site-nav.tsx`
- Focus styling still needs an intentional pass
- Error-tone communication still leans on visual treatment more than explicit text semantics

**Files**
- `frontend/src/components/layout/site-nav.tsx`
- button/chip styles
- `/about` error grid

---

### 11. Playwright smoke test

**Status**
- Still open.

**What**
No `e2e/register-verify-pay.spec.ts` exists yet. There are Playwright packages in the lockfile, but no actual smoke coverage in the repo.

**Fix**
1. Visit `/app`
2. Mock Freighter with a canned signer
3. Run register
4. Run verify
5. Open `/proof/<hash>`
6. Assert verified badge

---

## Verification checklist

```bash
cd frontend
npm run lint
npm run build
npm run dev
```

Manual smoke:
- `/`
- `/app`
- `/about`
- `/proof`
- `/proof/<hash>`
- mobile viewport `375x812`
- desktop `1440x900`
- locale toggle behavior on every page
