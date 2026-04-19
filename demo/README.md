# Stellaroid Earn — Demo Kit

> **Prove the work. Settle the payout. Share the proof.**
> A Soroban-powered proof-of-work registry that closes the loop between verification and payment on the Stellar network.

This folder is the **marketing + demo hub** for Stellaroid Earn. It is aimed at judges, sponsors, employers, and early adopters who need to understand what the app does in under 60 seconds.

## Contents

| File | Purpose | Read time |
|---|---|---|
| [`ONE_PAGER.md`](./ONE_PAGER.md) | Elevator pitch, problem, solution, traction hooks | 60 sec |
| [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md) | Live walkthrough script — what to click, what to say | 3 min |
| [`NOVELTY.md`](./NOVELTY.md) | What's new about it and why it's marketable | 2 min |
| [`FAQ.md`](./FAQ.md) | Technical + business questions judges ask | reference |
| [`PRESS_KIT.md`](./PRESS_KIT.md) | Taglines, boilerplate copy, social blurbs, hashtags | reference |

## The 10-second pitch

> **Maria graduated top of her cohort in Quezon City.** Verifying her credential takes her next employer three weeks — so the role goes to someone who didn't need verifying. Stellaroid Earn binds the hash on Stellar, verifies it in five seconds, and pays Maria directly — no invoice, no platform, no wait. Every completed cycle produces a public **Proof Block** URL she can drop into her next offer email.

## The one-line reframe

> We didn't pick a vertical. We picked a **shape of transaction** — prove → get paid → share — and encoded it in 32 bytes on Stellar. Which vertical it runs in is a GTM decision, not a technical one.

## Live demo

- **App:** https://stellaroid-earn-demo.vercel.app/
- **Network:** Stellar **testnet**
- **Contract ID:** `CBNSOFNXAOIFFKCOZLT7UZ5EEPB3ML2DP4YUGF24M4VBJCUWEHI2DX2Y`
- **Wallet:** [Freighter](https://www.freighter.app/) (testnet mode)

## Registered certificates (testnet archive)

All certificates registered on contract `CBNSOFNXAOIFFKCOZLT7UZ5EEPB3ML2DP4YUGF24M4VBJCUWEHI2DX2Y` since deploy.

| # | Hash (full) | Title | Cohort | Registered | Status |
|---|---|---|---|---|---|
| 1 | `b7c433bad95373ba4ef70815eb72665b9bc37dd6190df204f7b1cc794096a254` | Stellar Bootcamp Completion | UniTour 2026 | 2026-04-18 | Verified |
| 2 | `35a19276e58b8f742177892531def5e820f7c07bd8fd5a716ac710db09e6702e` | Stellar Smart Contract Bootcamp Completion | Stellar Philippines UniTour 2026 | 2026-04-18 | Verified |
| 3 | `c02ce1602d5bbb6ddfe93c6603d7f4e3dae3b2fb571ea4e70669ccd5a359aea3` | Stellar Smart Contract Bootcamp Completion | Stellar PH Bootcamp 2026 | 2026-04-19 | Verified |
| 4 | `c6df0adf9d1a6f5a88d847e8e9a779e71aa2435d6fa47b47d065ebbfa8c1f890` | Stellar Smart Contract Bootcamp Completion | Stellar PH Bootcamp 2026 | 2026-04-19 | Issued (locked demo — intentionally unverified) |

Proof pages (no wallet required):
- https://stellaroid-earn-demo.vercel.app/proof/b7c433bad95373ba4ef70815eb72665b9bc37dd6190df204f7b1cc794096a254
- https://stellaroid-earn-demo.vercel.app/proof/35a19276e58b8f742177892531def5e820f7c07bd8fd5a716ac710db09e6702e
- https://stellaroid-earn-demo.vercel.app/proof/c02ce1602d5bbb6ddfe93c6603d7f4e3dae3b2fb571ea4e70669ccd5a359aea3

## Run it locally

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`, connect Freighter on testnet, then follow [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md).
