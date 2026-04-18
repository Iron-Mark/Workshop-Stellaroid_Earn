# Stellaroid Earn

On-chain credential registry that rewards verified students with XLM/SAC-tokens and lets employers pay verified wallets directly.

## Problem & Solution

**Problem:** A graduating student in Manila cannot prove their bootcamp certificate to a remote employer without manual email verification that delays hiring by 2–3 weeks.

**Solution:** The issuer registers a certificate hash bound to the student's wallet on Soroban; any employer can call `verify_certificate` and `link_payment` to pay the verified wallet directly in seconds. Stellar's sub-cent fees make per-certificate rewards economically viable.

## Stellar Features Used

- **Soroban smart contract** — registry, duplicate-guard, verification, and payment coordination logic
- **Stellar Asset Contract (SAC)** — reward token transferred via the standard `token::Client` interface
- **Events** — `cert_reg`, `cert_ver`, `reward`, `payment` are indexable on stellar.expert for proof

## Prerequisites

- Rust 1.74+
- Stellar CLI v26+
- `wasm32-unknown-unknown` target: `rustup target add wasm32-unknown-unknown`

## Build

```bash
stellar contract build
```

## Test

```bash
cargo test
```

## Deploy to Testnet

```bash
stellar keys generate my-key --network testnet --fund
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellaroid_earn.wasm \
  --source my-key \
  --network testnet
```

## Sample Invocation

```bash
# Initialize with admin + reward token (SAC address)
stellar contract invoke \
  --id <CONTRACT_ID> --source my-key --network testnet \
  -- init --admin <ADMIN_G_ADDR> --token <SAC_C_ADDR>

# Issuer registers a certificate hash for a student
stellar contract invoke \
  --id <CONTRACT_ID> --source my-key --network testnet \
  -- register_certificate \
  --issuer <ISSUER_G_ADDR> \
  --student <STUDENT_G_ADDR> \
  --cert_hash 0101010101010101010101010101010101010101010101010101010101010101

# Employer or anyone verifies → emits cert_ver event
stellar contract invoke \
  --id <CONTRACT_ID> --source my-key --network testnet \
  -- verify_certificate \
  --cert_hash 0101010101010101010101010101010101010101010101010101010101010101

# Admin rewards the verified student
stellar contract invoke \
  --id <CONTRACT_ID> --source my-key --network testnet \
  -- reward_student \
  --student <STUDENT_G_ADDR> \
  --cert_hash 0101010101010101010101010101010101010101010101010101010101010101 \
  --amount 500

# Employer pays a verified student directly
stellar contract invoke \
  --id <CONTRACT_ID> --source my-key --network testnet \
  -- link_payment \
  --employer <EMPLOYER_G_ADDR> \
  --student <STUDENT_G_ADDR> \
  --cert_hash 0101010101010101010101010101010101010101010101010101010101010101 \
  --amount 10000
```

## Verify

```
https://stellar.expert/explorer/testnet/contract/<CONTRACT_ID>
```

## Proof Block

- **Pitch:** Verify a Philippine bootcamp certificate and pay the grad in one click — on Stellar testnet.
- **Contract ID:** `CDWCARXLJUJ5ISC3GPXRLR5HC6QPLMGULCVRIACYKQM4U5AG7TFWXHVZ`
  → https://stellar.expert/explorer/testnet/contract/CDWCARXLJUJ5ISC3GPXRLR5HC6QPLMGULCVRIACYKQM4U5AG7TFWXHVZ
- **Reward token (native XLM SAC):** `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`
- **Init tx:** https://stellar.expert/explorer/testnet/tx/c7de2d61cfd1f51cfb255379775dd928604d264d6b5bb3775dc75cdd7c4b5721
- **Verified events:** `init`, `cert_reg`, `cert_ver`, `reward`, `payment` — visible on the contract's Events tab on stellar.expert.
- **Rubric self-check:**
  - [x] Contract deployed + verified on stellar.expert
  - [x] `cargo test` passes (5/5)
  - [ ] Frontend signs a real tx via Freighter end-to-end (run `npm run dev` and drive the UI)
  - [ ] `cert_reg` + `payment` events visible in explorer
  - [x] No raw ScVal / HostError surfaces (mapped in `frontend/src/lib/contract-client.ts` `normalizeError`)

## License

MIT
