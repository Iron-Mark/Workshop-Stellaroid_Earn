# Stellar + Freighter Frontend

Sample Next.js 15 App Router frontend that connects to the Freighter wallet and calls a Soroban contract on Stellar testnet.

Built following `../setup/STELLAR_FREIGHTER_INTEGRATION_GUIDE.md`.

## Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

Then in `.env.local`:

1. Set `NEXT_PUBLIC_SOROBAN_CONTRACT_ID` to your deployed testnet contract ID.
2. Set `NEXT_PUBLIC_STELLAR_READ_ADDRESS` to a funded testnet `G...` account (fund one at https://friendbot.stellar.org/).

## Run

```bash
npm run dev
```

Open http://localhost:3000. Install [Freighter](https://www.freighter.app/) and switch it to **Testnet**.

## Layout

```
frontend/
├── src/
│   ├── app/                      App Router entry (layout, page)
│   ├── components/
│   │   └── contract-dashboard.tsx    Sample UI: connect, read, write
│   ├── hooks/
│   │   └── use-freighter-wallet.ts   Wallet state hook
│   └── lib/
│       ├── config.ts             Env + network config
│       ├── contract-client.ts    Soroban build/simulate/sign/submit
│       ├── freighter.ts          Freighter browser extension wrapper
│       ├── format.ts             Amount + address formatting
│       ├── types.ts              Shared types
│       └── validators.ts         Address + input validation
```

## Adapting to your contract

The sample contract calls (`checkMembership`, `createRecord`, `transferAmount`) in `src/lib/contract-client.ts` are placeholders. Replace them with functions that match your own Soroban contract methods — keep using `simulateRead` for reads and `signAndSubmit` for writes.

Also update the `normalizeError` mapping to match your `#[contracterror]` enum variants.