# 🚀 Stellar Philippines UniTour — University of East Caloocan

**Platform:** [Rise In](https://www.risein.com/programs/stellar-philippines-unitour-university-of-east-caloocan)  
**Track:** Stellar Smart Contract Bootcamp  
**Duration:** 4 Hours | 4:00 PM - 8:00 PM

---

## 📋 Overview

Welcome to the Stellar Philippines UniTour at University of East Caloocan! In this session, you will be given an assigned smart contract to complete, deploy to the Stellar testnet, and submit for certification - all through the Rise In platform.

No prior Web3 experience needed. Just follow the steps below and you'll have your certificate by the end of the session.

---

## 🎯 Your Goal

1. **Receive** your assigned Soroban smart contract
2. **Complete** the contract code as instructed
3. **Test** it locally using `cargo test`
4. **Deploy** it to the Stellar testnet
5. **Submit** your Contract ID and GitHub repo on Rise In to earn your certificate

---

## ✅ Step-by-Step Guide

### Step 1 - Set Up Your Environment

For complete installation instructions and troubleshooting, use the local guide:

- `[ENG] Pre-Workshop Setup Guide.pdf`

Install the following before or at the start of the session:

- [Rust](https://rustup.rs/) - run `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- Add WASM target:

```bash
rustup target add wasm32-unknown-unknown
```

- [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli):

```bash
cargo install --locked stellar-cli --features opt
```

- [Freighter Wallet](https://freighter.app) - browser extension, set to **Testnet**

### Step 2 - Get Your Assigned Contract

Your facilitator will share the assigned smart contract during the session.  
Clone or copy the starter contract into your local machine:

```bash
git clone <facilitator-provided-repo-link>
cd <contract-folder>
```

### Step 3 - Complete the Contract

Open `src/lib.rs` and complete the contract logic as instructed.  
Make sure you also have at least **3 passing unit tests** in `src/test.rs`.

Run tests locally:

```bash
cargo test
```

All tests must pass before you proceed.

### Step 4 - Deploy to Stellar Testnet

**Configure your Stellar CLI identity (first time only):**

```bash
stellar keys generate --global my-key --network testnet
stellar keys address my-key
```

**Fund your testnet account:**

```bash
stellar keys fund my-key --network testnet
```

**Build your contract:**

```bash
stellar contract build
```

**Deploy to testnet:**

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/<your_contract>.wasm \
  --source my-key \
  --network testnet
```

Copy the **Contract ID** from the output - it looks like: `CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

**Verify on Stellar Expert:**

```text
https://stellar.expert/explorer/testnet/contract/<YOUR_CONTRACT_ID>
```

### Step 5 - Submit on Rise In

Go to your Rise In program page and submit the following:

| Field | What to Submit |
|-------|----------------|
| **GitHub Repository** | Public repo link with your contract source code |
| **Contract ID** | Your deployed testnet contract address |
| **Stellar Expert Link** | `https://stellar.expert/explorer/testnet/contract/<CONTRACT_ID>` |
| **Short Description** | 2-3 sentences on what your contract does |

🔗 Submit here: [Rise In Program Page](https://www.risein.com/programs/stellar-philippines-unitour-university-of-east-caloocan)

---

## 📁 Required Repo Structure

Your GitHub repository must follow this structure to qualify:

```text
my-soroban-contract/
├── src/
│   ├── lib.rs        # Your completed contract logic
│   └── test.rs       # At least 3 passing unit tests
├── Cargo.toml
└── README.md         # Brief description of your contract
```

---

## 🏆 Certificate Requirements

| Requirement | Status |
|-------------|--------|
| ✅ Attend the bootcamp session | Required |
| ✅ Complete the assigned smart contract | Required |
| ✅ Pass `cargo test` with 3+ tests | Required |
| ✅ Deploy contract to Stellar testnet | Required |
| ✅ Submit on Rise In (repo + contract ID) | Required |

> Certificates are issued digitally within **3-5 business days** after your submission is reviewed.  
> Incomplete submissions (missing deployment or failing tests) will not qualify. You may resubmit once after feedback.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Rise In Program | [risein.com](https://www.risein.com/programs/stellar-philippines-unitour-university-of-east-caloocan) |
| Stellar Docs | [developers.stellar.org](https://developers.stellar.org) |
| Soroban SDK | [docs.rs/soroban-sdk](https://docs.rs/soroban-sdk) |
| Stellar CLI Docs | [developers.stellar.org/docs/tools/stellar-cli](https://developers.stellar.org/docs/tools/stellar-cli) |
| Freighter Wallet | [freighter.app](https://freighter.app) |
| Stellar Expert (Testnet) | [stellar.expert/explorer/testnet](https://stellar.expert/explorer/testnet) |
| Stellar Lab | [lab.stellar.org](https://lab.stellar.org) |

---

## 🇵🇭 About Stellar Philippines UniTour

The Stellar UniTour is a university roadshow bringing Stellar and Soroban smart contract education to students across the Philippines. This stop is at **University of East Caloocan**, powered by [Rise In](https://risein.com).

---

*Questions? Ask your facilitator during the session or reach out via the Rise In platform.*
# 🚀 Stellar Philippines UniTour — University of East Caloocan

**Platform:** [Rise In](https://www.risein.com/programs/stellar-philippines-unitour-university-of-east-caloocan)  
**Track:** Stellar Smart Contract Bootcamp  
**Duration:** 4 Hours | 4:00 PM - 8:00 PM

---

## 📋 Overview

Welcome to the Stellar Philippines UniTour at University of East Caloocan! In this session, you will be given an assigned smart contract to complete, deploy to the Stellar testnet, and submit for certification - all through the Rise In platform.

No prior Web3 experience needed. Just follow the steps below and you'll have your certificate by the end of the session.

---

## 🎯 Your Goal

1. **Receive** your assigned Soroban smart contract
2. **Complete** the contract code as instructed
3. **Test** it locally using `cargo test`
4. **Deploy** it to the Stellar testnet
5. **Submit** your Contract ID and GitHub repo on Rise In to earn your certificate

---

## ✅ Step-by-Step Guide

### Step 1 - Set Up Your Environment

For complete installation instructions and troubleshooting, use the local guide:

- `[ENG] Pre-Workshop Setup Guide.pdf`

Install the following before or at the start of the session:

- [Rust](https://rustup.rs/) - run `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- Add WASM target:

```bash
rustup target add wasm32-unknown-unknown
```

- This repository currently includes the pre-workshop setup guide as the main resource.
- Add your contract source files and examples here as you progress.


# Soroban Contract Deployment Quickstart

A step-by-step guide for deploying any Soroban smart contract to the Stellar testnet. Follow this guide to go from a compiled Rust contract to a live on-chain deployment.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Step 1 — Add Testnet Network](#step-1--add-testnet-network)
- [Step 2 — Generate and Fund a Keypair](#step-2--generate-and-fund-a-keypair)
- [Step 3 — Build Your Contract](#step-3--build-your-contract)
- [Step 4 — Deploy to Testnet](#step-4--deploy-to-testnet)
- [Step 5 — Initialize Your Contract](#step-5--initialize-your-contract)
- [Step 6 — Invoke Contract Functions](#step-6--invoke-contract-functions)
- [Step 7 — Verify on Explorer](#step-7--verify-on-explorer)
- [Tips and Troubleshooting](#tips-and-troubleshooting)

---

## Deployment of your Smart Contract

Install the following before starting:

- **Rust** — [rustup.rs](https://rustup.rs)
- **Stellar CLI** — [Install guide](https://developers.stellar.org/docs/tools/developer-tools/cli/install-cli)
- **wasm32 target:**
```bash
rustup target add wasm32-unknown-unknown
```

Verify your CLI is installed:
```bash
stellar --version
```

---

## Step 1 — Add Testnet Network

Register the Stellar testnet as a named network so you can reference it by name in subsequent commands:
```bash
soroban network add \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  testnet
```

Verify it was added:
```bash
stellar network ls
```

Expected output:
```
testnet
```

---

## Step 2 — Generate and Fund a Keypair

Generate a local keypair named `alice` and fund it automatically via Friendbot (testnet faucet):
```bash
stellar keys generate alice --network testnet --fund
```

Confirm the address was created:
```bash
stellar keys ls
stellar keys address alice
```

Expected output:
```
alice
GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

> **Note:** `alice` is just a local alias. You can name it anything — `deployer`, `admin`, `mykey`, etc. The `--fund` flag only works on testnet.

---

## Step 3 — Build Your Contract

From your contract's root directory, compile it to WebAssembly:
```bash
cargo build --release --target wasm32-unknown-unknown
```

Your compiled artifact will be at:
```
target/wasm32-unknown-unknown/release/<your_contract_name>.wasm
```

**Example** — for a contract named `hello-world` in `Cargo.toml`:
```toml
[package]
name = "hello-world"
version = "0.1.0"
edition = "2021"
```

The wasm output will be:
```
target/wasm32-unknown-unknown/release/hello_world.wasm
```

> **Note:** Rust converts hyphens to underscores in filenames. `hello-world` → `hello_world.wasm`.

---

## Step 4 — Deploy to Testnet

Deploy the compiled wasm to the Stellar testnet:
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/<your_contract_name>.wasm \
  --source-account alice \
  --network testnet
```

**Example:**
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/hello_world.wasm \
  --source-account alice \
  --network testnet
```

On success you will see:
```
ℹ️  Uploading contract WASM…
ℹ️  Simulating transaction…
ℹ️  Signing transaction: 3d5ad32df06ca6...
🌎 Sending transaction…
✅ Transaction submitted successfully!
🔗 https://stellar.expert/explorer/testnet/tx/3d5ad32df06ca6...
✅ Deployed!
CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

The last line is your **Contract ID** — save it, you will need it for all invocations.
```bash
# Save it as a variable for convenience
export CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
=======
- [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli):

```bash
cargo install --locked stellar-cli --features opt
```

- [Freighter Wallet](https://freighter.app) - browser extension, set to **Testnet**

### Step 2 - Get Your Assigned Contract

Your facilitator will share the assigned smart contract during the session.  
Clone or copy the starter contract into your local machine:

```bash
git clone <facilitator-provided-repo-link>
cd <contract-folder>
```

### Step 3 - Complete the Contract

Open `src/lib.rs` and complete the contract logic as instructed.  
Make sure you also have at least **3 passing unit tests** in `src/test.rs`.

Run tests locally:

```bash
cargo test
```

All tests must pass before you proceed.

### Step 4 - Deploy to Stellar Testnet

**Configure your Stellar CLI identity (first time only):**

```bash
stellar keys generate --global my-key --network testnet
stellar keys address my-key
```

**Fund your testnet account:**

```bash
stellar keys fund my-key --network testnet
```

**Build your contract:**

```bash
stellar contract build
```

**Deploy to testnet:**

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/<your_contract>.wasm \
  --source my-key \
  --network testnet
```

Copy the **Contract ID** from the output - it looks like: `CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

**Verify on Stellar Expert:**

```text
https://stellar.expert/explorer/testnet/contract/<YOUR_CONTRACT_ID>
```

### Step 5 - Submit on Rise In

Go to your Rise In program page and submit the following:

| Field | What to Submit |
|-------|----------------|
| **GitHub Repository** | Public repo link with your contract source code |
| **Contract ID** | Your deployed testnet contract address |
| **Stellar Expert Link** | `https://stellar.expert/explorer/testnet/contract/<CONTRACT_ID>` |
| **Short Description** | 2-3 sentences on what your contract does |

🔗 Submit here: [Rise In Program Page](https://www.risein.com/programs/stellar-philippines-unitour-university-of-east-caloocan)

---

## 📁 Required Repo Structure

Your GitHub repository must follow this structure to qualify:

```text
my-soroban-contract/
├── src/
│   ├── lib.rs        # Your completed contract logic
│   └── test.rs       # At least 3 passing unit tests
├── Cargo.toml
└── README.md         # Brief description of your contract
>>>>>>> 08aeb8a (add)
```

---

<<<<<<< HEAD
## Step 5 — Initialize Your Contract

Most contracts have an `initialize` or constructor function that must be called once after deployment. Use `stellar contract invoke` to call it:
```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source-account alice \
  --network testnet \
  -- <function_name> \
  --<param_name> <param_value>
```

**Example** — initializing a contract with an admin address:
```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source-account alice \
  --network testnet \
  -- initialize \
  --admin $(stellar keys address alice)
```

**Example** — initializing with multiple parameters:
```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source-account alice \
  --network testnet \
  -- initialize \
  --admin $(stellar keys address alice) \
  --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC \
  --max_amount 1000000
```

> **Note:** The `--` separator between the CLI flags and the contract function arguments is required.

---

## Step 6 — Invoke Contract Functions

Call any contract function the same way:
```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source-account alice \
  --network testnet \
  -- <function_name> \
  --<param> <value>
```

**Example** — calling a `hello` function that takes a `name` parameter:
```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source-account alice \
  --network testnet \
  -- hello \
  --name world
```

Expected output:
```json
["Hello", "world"]
```

**Example** — calling a read-only `get_balance` function:
```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source-account alice \
  --network testnet \
  -- get_balance \
  --address $(stellar keys address alice)
```

**Example** — calling a function with a boolean parameter:
```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source-account alice \
  --network testnet \
  -- set_active \
  --enabled true
```

**Example** — calling a function with an integer parameter:
```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source-account alice \
  --network testnet \
  -- set_limit \
  --amount 5000
```

---

## Step 7 — Verify on Explorer

After deploying, verify your contract is live using either of these tools:

**Stellar Expert:**
```
https://stellar.expert/explorer/testnet/contract/<CONTRACT_ID>
```

**Stellar Lab:**
```
https://lab.stellar.org/r/testnet/contract/<CONTRACT_ID>
```

Both show your contract's transaction history, storage state, and invocation logs.

---

## Tips and Troubleshooting

**`contract missing metadata section`**

Your contract is missing the `contractmeta!` macro. Add this to your `lib.rs`:
```rust
use soroban_sdk::contractmeta;

contractmeta!(
    key = "Description",
    val = "Your contract description here"
);
```

Then rebuild and redeploy.

---

**`src refspec master does not match any`**

You have no commits yet. Run:
```bash
git add .
git commit -m "initial commit"
git push -u origin main --force
```

---

**`error: src refspec main does not match any`**

Your local branch is `master` not `main`. Run:
```bash
git push -u origin master --force
```

Or check your current branch:
```bash
git branch
```

---

**`transaction simulation failed: HostError`**

Usually means the contract function arguments are wrong. Double-check:
- Parameter names match exactly what is in your contract
- The `--` separator is present before function name
- Types match (e.g. passing a string where an address is expected)

---

**Friendbot / funding issues**

If `--fund` fails, fund manually:
```bash
curl "https://friendbot.stellar.org?addr=$(stellar keys address alice)"
```

---

**Check account balance**
```bash
stellar contract invoke \
  --id <NATIVE_TOKEN_CONTRACT_ID> \
  --source-account alice \
  --network testnet \
  -- balance \
  --id $(stellar keys address alice)
```

---

## Quick Reference
```bash
# Add network
soroban network add --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" testnet

# Generate keypair
stellar keys generate alice --network testnet --fund

# Build
cargo build --release --target wasm32-unknown-unknown

# Deploy
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/<contract>.wasm \
  --source-account alice \
  --network testnet

# Invoke
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source-account alice \
  --network testnet \
  -- <function> --<param> <value>
```
=======
## 🏆 Certificate Requirements

| Requirement | Status |
|-------------|--------|
| ✅ Attend the bootcamp session | Required |
| ✅ Complete the assigned smart contract | Required |
| ✅ Pass `cargo test` with 3+ tests | Required |
| ✅ Deploy contract to Stellar testnet | Required |
| ✅ Submit on Rise In (repo + contract ID) | Required |

> Certificates are issued digitally within **3-5 business days** after your submission is reviewed.  
> Incomplete submissions (missing deployment or failing tests) will not qualify. You may resubmit once after feedback.

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Rise In Program | [risein.com](https://www.risein.com/programs/stellar-philippines-unitour-university-of-east-caloocan) |
| Stellar Docs | [developers.stellar.org](https://developers.stellar.org) |
| Soroban SDK | [docs.rs/soroban-sdk](https://docs.rs/soroban-sdk) |
| Stellar CLI Docs | [developers.stellar.org/docs/tools/stellar-cli](https://developers.stellar.org/docs/tools/stellar-cli) |
| Freighter Wallet | [freighter.app](https://freighter.app) |
| Stellar Expert (Testnet) | [stellar.expert/explorer/testnet](https://stellar.expert/explorer/testnet) |
| Stellar Lab | [lab.stellar.org](https://lab.stellar.org) |

---

## 🇵🇭 About Stellar Philippines UniTour

The Stellar UniTour is a university roadshow bringing Stellar and Soroban smart contract education to students across the Philippines. This stop is at **University of East Caloocan**, powered by [Rise In](https://risein.com).

---

*Questions? Ask your facilitator during the session or reach out via the Rise In platform.*
