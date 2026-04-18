# Frontend TODO

Status snapshot for the Stellaroid Earn frontend. Project-level tracker lives at `../setup/TODO.md`.

## Done

- [x] `npm install` — all packages installed
- [x] `.env.local` populated with testnet RPC, contract ID, SAC asset, read address
- [x] Dashboard composition: AppShell + RpcStatusPill + NextActionCard + MilestoneRail + RegisterForm / VerifyForm / PayForm + ProofBlockPreview
- [x] Public `/proof/[hash]` route (shareable, no wallet required)
- [x] Dark theme design tokens in `src/styles/globals.css` (IBM Plex Sans/Mono, amber primary, violet accent)
- [x] Human-readable error mapping (`src/lib/errors.ts`) — no raw ScVal / HostError surfaces
- [x] RPC timeout helper (`src/lib/with-timeout.ts`)
- [x] Contract client (`src/lib/contract-client.ts`) maps all 5 public fns + 6 error variants
- [x] `next build` compiles; Vercel live at https://stellaroid-earn-demo.vercel.app/

## To run locally

```bash
cd frontend && npm run dev
```

Open http://localhost:3000 with [Freighter](https://www.freighter.app/) installed and set to **Testnet**.

## Nice-to-haves (out of scope for bootcamp submission)

- [ ] Per-event detail modal on the Proof page (currently links to stellar.expert)
- [ ] Optional server-side cert hash registry index for discovery UX
- [ ] Playwright e2e driving Freighter via a mock
