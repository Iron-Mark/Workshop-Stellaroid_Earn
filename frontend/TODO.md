# TODO

Next steps to get the frontend running end-to-end.

## Setup

- [ ] `cd frontend && cp .env.example .env.local`
- [ ] Deploy your Soroban contract to testnet
- [ ] Fill in `NEXT_PUBLIC_SOROBAN_CONTRACT_ID` in `.env.local`
- [ ] Fund a testnet `G...` account at https://friendbot.stellar.org/ and set it as `NEXT_PUBLIC_STELLAR_READ_ADDRESS`
- [ ] (Optional) Set `NEXT_PUBLIC_SOROBAN_ASSET_ADDRESS` and `NEXT_PUBLIC_SOROBAN_ASSET_CODE` if you use a specific token

## Contract integration

- [ ] Replace the placeholder methods in `src/lib/contract-client.ts` (`checkMembership`, `createRecord`, `transferAmount`) with functions matching your actual Soroban contract methods
  - Use `simulateRead(...)` for read-only queries
  - Use `signAndSubmit(...)` for state-changing calls
- [ ] Update the `normalizeError` mapping in `src/lib/contract-client.ts` to match your `#[contracterror]` enum variants
- [ ] Update `src/components/contract-dashboard.tsx` so the sample UI calls your real contract functions

## Run

- [ ] Install the [Freighter](https://www.freighter.app/) browser extension
- [ ] Switch Freighter to **Testnet**
- [ ] `npm run dev` and open http://localhost:3000
- [ ] Click "Connect Freighter", approve the popup, and test a read and a write call

## Verified already

- [x] `npm install` — 88 packages installed
- [x] `npx tsc --noEmit` — clean
- [x] `next dev` — `/` returns HTTP 200
