# Follow-ups: investigate & fix

Punch list of gaps found auditing the deployed app. Each item is independently actionable — pick up whichever slot you have time for.

Grouped by how much it costs you in a live demo.

---

## 🔴 Demo blockers — fix before the next live run

### 1. Mobile = Freighter absent (no empty state)

**What**
Freighter is a desktop-only browser extension. On `/app` from a phone, the **Connect** button either fails silently or shows a generic "Freighter not detected" error. A reviewer opening the landing page from LinkedIn on their phone bounces.

**Verify**
- Open `/app` on a mobile browser (or Chrome DevTools device emulation).
- Tap **Connect**.
- Observe: no clear CTA to get to a working state.

**Fix**
- Detect mobile user-agent OR absence of `window.freighter` on mount.
- Swap the form column for an empty state: "Freighter is desktop-only. Scan a Proof Block QR, open on desktop, or view a sample: **[Sample Proof Block →]**".
- Keep the right-rail Proof Block preview visible (it's the demo without a wallet).

**Files**
- `frontend/src/components/wallet/*` (connect gate)
- `frontend/src/app/app/page.tsx` (mobile fallback column)

---

### 2. Contract-ID / network drift silent failure

**What**
If Freighter is on pubnet, or `NEXT_PUBLIC_CONTRACT_ID` / `NEXT_PUBLIC_NETWORK_PASSPHRASE` drift from the deployed contract, simulate fails with an opaque error. Nothing tells the user "you're on the wrong network."

**Verify**
- In Freighter, switch to Pubnet.
- Hit **Register** on `/app`.
- Expect: a clear banner. Currently: a raw error surface or nothing.

**Fix**
- On wallet connect, read the connected network via `freighterApi.getNetwork()`.
- Compare against `appConfig.networkPassphrase`.
- If mismatch → render a dismissible yellow banner at top of `/app`: "You're connected to **Pubnet**. This demo is on **Testnet** — switch networks in Freighter to continue."
- Also flag if `appConfig.contractId` is empty.

**Files**
- `frontend/src/hooks/use-freighter.ts` (or wherever connect lives)
- New `frontend/src/components/app/network-banner.tsx`
- Mount in `frontend/src/app/app/page.tsx` above the grid

---

## 🟡 Polish — visible gaps a reviewer notices

### 3. Locale toggle only covers the hero

**What**
Flip the footer locale toggle to Tagalog — the hero changes, nothing else does. `/about`, `/app`, FAQ, footer links, and the demo script all stay in English. Either scope up or scope down.

**Options**
- **A (fast)** — Move the toggle to sit *inside* the hero with copy "View this section in Tagalog" so its scope is obvious.
- **B (right)** — Extract a `copy/en.ts` + `copy/tl.ts` dictionary, thread through a small React context, translate at least: hero, footer, `/about` lede, `/app` form labels, FAQ.

**Files**
- `frontend/src/components/layout/locale-toggle.tsx` (A)
- New `frontend/src/lib/i18n/` + touch most chrome components (B)

---

### 4. No live on-chain events feed

**What**
The contract emits 5 event types (`cert_reg`, `cert_ver`, `reward`, `payment`, plus init). The site has no visible proof that anything is happening on-chain — which is the single strongest trust signal available.

**Fix**
- New server component `frontend/src/components/activity/recent-activity.tsx`.
- Fetches last N events for `appConfig.contractId` via Soroban RPC `getEvents` or Horizon `/contracts/{id}/data` paginated.
- Renders a 3–5 row strip: icon · short event label · short hash · relative time · "View ↗".
- Mount at the top of `/about` (below the hero) and on `/` between the hero and the Proof Block teaser.
- Cache for 30s to avoid hammering RPC.

**Files**
- New `frontend/src/lib/events.ts` — `getRecentEvents(contractId, limit)`.
- New component + CSS module.
- Mount points: `frontend/src/app/page.tsx`, `frontend/src/app/about/page.tsx`.

---

### 5. `/proof` index has no sample hashes

**What**
The `/proof` lookup page is a bare form. A reviewer with no hash to paste bounces. We already have a known-good sample hash used on `/`:
`1e8078e36333023c46f11a0bd990f97b62bd13ae086597de6a3db8e66d4b3a22`.

**Fix**
- Below the form, add a "Try a sample" row with 2–3 chips pointing to real cert hashes currently registered on the deployed contract.
- If (4) lands first, surface the last 3 verified hashes from the events feed.

**Files**
- `frontend/src/app/proof/page.tsx`

---

### 6. Errors-are-human grid → category pills

**What**
The 6 contract errors on `/about` are a flat list. Now that the contract-surface section groups functions by Init / Write / Read, the errors should mirror the pattern.

**Fix**
- Tag each error with a category: `#1–#2 state`, `#3 auth`, `#4–#5 input`, `#6 input`.
- Color the `.errCode` pill by category (reuse the `.fnTone_*` palette from the contract-surface section).

**Files**
- `frontend/src/app/about/page.tsx` (data)
- `frontend/src/app/about/page.module.css` (new `.errTone_*` classes)

---

## 🟢 Stretch — skip if timeboxed

### 7. Print stylesheet for `/proof/[hash]`

Existing `@media print` in `proof-card.module.css` is minimal. QR block + share buttons print on a second page with broken alignment. Hide the share row; keep the QR; make the card fit A4.

### 8. Sitemap + robots.txt

Proof Block URLs aren't indexable. Add `frontend/src/app/sitemap.ts` (static: `/`, `/about`, `/app`, `/proof`). Robots.txt already defaults to allow-all via Next — verify.

### 9. Lightweight analytics

Vercel Analytics or Plausible. One-line install. You currently have no visibility into which demo section converts.

### 10. Accessibility pass

- Add a skip-link in `site-nav.tsx` (`<a href="#main">Skip to content</a>`).
- Audit focus rings on `.ctaPrimary` / `.ctaGhost` / `.stackChip` — currently browser default.
- Errors grid tone is color-only (`#dc2626` beat icons etc.) — add a text label or `aria-label` that conveys severity.

### 11. Playwright smoke test

One `e2e/register-verify-pay.spec.ts` that:
1. Visits `/app`.
2. Mocks Freighter (`window.freighterApi`) with a canned signer.
3. Clicks Demo autofill → Register → asserts success toast.
4. Clicks Verify → asserts success.
5. Navigates to `/proof/<hash>` → asserts the verified badge.

Catches regressions when multiple AIs land parallel commits to the same files.

---

## Verification checklist (run before merging fixes)

```bash
cd frontend
npm run lint
npm run build           # must succeed
npm run dev             # manual smoke: /, /app, /about, /proof, /proof/<hash>
```

Cross-check on mobile viewport (375×812) + desktop (1440×900). Flip locale toggle on every page.
