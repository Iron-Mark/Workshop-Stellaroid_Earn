# Stellaroid Earn — Frontend

Next.js 15 (App Router) + React 19 dApp connecting to a Soroban certificate contract on Stellar testnet via Freighter.

Built following `../setup/STELLAR_FREIGHTER_INTEGRATION_GUIDE.md`.

## Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

Then in `.env.local`:

1. Set `NEXT_PUBLIC_SOROBAN_CONTRACT_ID` to your deployed testnet contract ID.
2. Set `NEXT_PUBLIC_STELLAR_ADMIN_ADDRESS` to the admin `G...` address used when calling `init`.
3. Set `NEXT_PUBLIC_STELLAR_READ_ADDRESS` to a funded testnet `G...` account used only for read-only simulation (fund at https://friendbot.stellar.org/).

If you pulled the new trust-layer frontend bindings, the old demo contract ID is no longer ABI-compatible. Rebuild and redeploy the contract before testing register / verify / issuer approval flows. The step-by-step checklist lives in `../docs/superpowers/plans/2026-04-18-trust-layer-redeploy-checklist.md`.

## Run

```bash
npm run dev
```

Open http://localhost:3000. Install [Freighter](https://www.freighter.app/) and switch it to **Testnet**.

## Routes

| Path | Description |
|------|-------------|
| `/` | Dashboard — Next Action card + Milestone rail + Register / Verify / Pay forms + Proof Block preview |
| `/about` | About page |
| `/proof` | Proof lookup form — enter any cert hash to check status |
| `/proof/[hash]` | Public proof page — shareable, no wallet required. Cached 60 s at CDN; invalid hashes return instant 404. Transitional off-chain metadata/evidence can be shown here while the contract still stores trust-critical state only. |
| `/proof/[hash]/embed` | Compact iframe embed — for portfolios, Notion, blogs. `frame-ancestors *` CSP allows all hosts. |
| `/issuer` | Issuer dashboard — wallet-aware issuer status plus admin-only issuer approval/suspension controls |
| `/issuer/register` | Register the connected wallet as a pending issuer |

## Design system

Tokens and global styles live in `src/styles/globals.css`. The palette is dark-first (slate-900 background) with a gold primary (`--color-primary: #F59E0B`), purple accent, and IBM Plex Sans / IBM Plex Mono typography. All spacing, radii, and transitions are CSS custom properties — no utility framework. A `prefers-reduced-motion` media query zeroes all animation durations globally.

## Layout

```
frontend/
├── next.config.ts                HTTP security headers + CSP for all routes
├── src/
│   ├── app/                      App Router (layout, page, /about, /proof, /proof/[hash], /proof/[hash]/embed)
│   ├── components/
│   │   ├── actions/              RegisterForm, VerifyForm, PayForm, NextActionCard
│   │   ├── activity/             RecentActivity (live on-chain events)
│   │   ├── layout/               AppShell, RpcStatusPill, SiteNav, SiteFooter
│   │   ├── milestones/           MilestoneRail
│   │   ├── proof/                ProofCard, ProofBlockPreview, ShareButtons, ProofQr
│   │   ├── ui/                   Button, Input, Badge, CopyButton, Skeleton, Toast
│   │   └── wallet/               WalletConnectButton
│   ├── hooks/
│   │   └── use-freighter-wallet.tsx
│   ├── lib/
│   │   ├── config.ts             Env + network config
│   │   ├── contract-client.ts    Soroban build/simulate/sign/submit (client-side)
│   │   ├── contract-read-server.ts  Server-side read-only simulation
│   │   ├── demo-data.ts          Fallback sample hashes for E2E / demo mode
│   │   ├── errors.ts             humanizeError — friendly error copy, no raw XDR leakage
│   │   ├── events.ts             RPC event polling + decoding
│   │   ├── format.ts             Amount + address formatting
│   │   ├── freighter.ts          Freighter wrapper (E2E mock included)
│   │   ├── issuer-registry.ts    Known issuer label lookup
│   │   ├── types.ts              Shared types (WalletStatus, TxState, etc.)
│   │   ├── validators.ts         Address + input validation
│   │   └── with-timeout.ts       Promise timeout helper
│   └── styles/
│       └── globals.css           Design tokens, reset, reduced-motion
```
