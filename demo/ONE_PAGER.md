# Stellaroid Earn — One-Pager

## The problem

Work gets done. Payment gets stuck.

- Freelancers chase invoices. Interns chase stipends. Bounty hunters chase maintainers.
- Credentials and receipts live in email threads, PDFs, and private dashboards — easy to forge, impossible to share cleanly.
- Existing credential registries stop at *"verified."* They don't close the loop with money.

## The solution

**Stellaroid Earn** turns completed work into a cryptographic, payable artifact on the Stellar blockchain.

1. **Register** — Issuer anchors a SHA-256 hash of the deliverable on-chain.
2. **Verify** — Employer confirms the hash matches their copy.
3. **Pay** — Settlement happens in the same flow, in the same app, on the same ledger.
4. **Share** — The result is a public **Proof Block** URL — a receipt anyone can open.

No backend. No database. No middleman. Just a contract, a wallet, and a link.

## Why Stellar + Soroban

- **Sub-cent fees** → micro-payments for micro-work are viable.
- **5-second finality** → demo-friendly, employer-friendly.
- **Freighter wallet** → zero onboarding friction for Web2 users.
- **Native payment rails** → no bridging, no wrapped assets, no L2 handoff.

## Who it's for

| Segment | Use case |
|---|---|
| **Freelance platforms** | Escrow-free milestone payouts |
| **Bootcamps & cohorts** | Provable completion + stipend release |
| **Bounty programs** | Hash-anchored submissions tied to bounty payout |
| **Grant DAOs** | Milestone verification with on-chain disbursement |
| **Gig marketplaces** | Two-sided proof for reviews and reputation |

## Edge

- **Proof-first UX** — the artifact *is* the product, not a tab in a dashboard.
- **Shareable by default** — every completed flow produces a link, not a record.
- **Payment is a step, not an afterthought** — most credentialing dApps stop at verification.
- **Production-grade polish** — 15s RPC timeouts, humanized errors, WCAG AA, reduced-motion, 44×44 touch targets.

## Status

- ✅ Deployed on Stellar testnet (Contract ID above)
- ✅ Frontend live on Vercel
- ✅ Full register → verify → pay → proof flow working end-to-end
- 🚧 Mainnet readiness, demo-mode fallback, verified-events history feed

## Ask

We're looking for:
- **Design partners** — one freelance platform, one bootcamp, one bounty program.
- **Feedback** — from Stellar ecosystem judges on mainnet-readiness.
- **Distribution** — a slot in Stellar community showcases.
