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
2. Set `NEXT_PUBLIC_STELLAR_READ_ADDRESS` to a funded testnet `G...` account (fund at https://friendbot.stellar.org/).

## Run

```bash
npm run dev
```

Open http://localhost:3000. Install [Freighter](https://www.freighter.app/) and switch it to **Testnet**.

## Routes

| Path | Description |
|------|-------------|
| `/` | Dashboard — Next Action card + Milestone rail + Register / Verify / Pay forms + Proof Block preview |
| `/proof/[hash]` | Public proof page — shareable, no wallet required |

## Design system

Tokens and global styles live in `src/styles/globals.css`. The palette is dark-first (slate-900 background) with a gold primary (`--color-primary: #F59E0B`), purple accent, and IBM Plex Sans / IBM Plex Mono typography. All spacing, radii, and transitions are CSS custom properties — no utility framework. A `prefers-reduced-motion` media query zeroes all animation durations globally.

## Layout

```
frontend/
├── src/
│   ├── app/                      App Router (layout, page, proof/[hash]/page)
│   ├── components/
│   │   ├── actions/              RegisterForm, VerifyForm, PayForm, NextActionCard
│   │   ├── layout/               AppShell, RpcStatusPill
│   │   ├── milestones/           MilestoneRail
│   │   ├── proof/                ProofCard, ProofBlockPreview, ShareButtons
│   │   ├── ui/                   Button, Input, Badge, CopyButton, Skeleton, Toast
│   │   └── wallet/               WalletConnectButton
│   ├── hooks/
│   │   └── use-freighter-wallet.ts
│   ├── lib/
│   │   ├── config.ts             Env + network config
│   │   ├── contract-client.ts    Soroban build/simulate/sign/submit
│   │   ├── errors.ts             humanizeError — friendly error copy
│   │   ├── format.ts             Amount + address formatting
│   │   ├── freighter.ts          Freighter wrapper
│   │   ├── types.ts              Shared types
│   │   ├── validators.ts         Address + input validation
│   │   └── with-timeout.ts       Promise timeout helper
│   └── styles/
│       └── globals.css           Design tokens, reset, reduced-motion
```
