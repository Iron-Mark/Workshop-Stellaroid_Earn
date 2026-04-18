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

> **Stellaroid Earn is proof-of-work as a public good.** Issuers anchor a SHA-256 hash of completed work on Stellar. Employers verify it and pay in the same flow. The result is a shareable **Proof Block** URL — a cryptographic receipt anyone can open.

## Live demo

- **App:** deployed to Vercel (see project dashboard for URL)
- **Network:** Stellar **testnet**
- **Contract ID:** `CDWCARXLJUJ5ISC3GPXRLR5HC6QPLMGULCVRIACYKQM4U5AG7TFWXHVZ`
- **Wallet:** [Freighter](https://www.freighter.app/) (testnet mode)

## Run it locally

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`, connect Freighter on testnet, then follow [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md).
