# Live Demo Script — 3 Minutes

> Rehearsed for a live audience with a projector. Times are wall-clock. Every step has a **say** line and an **action** line.

## Pre-flight (do before you start)

- Freighter unlocked, on **testnet**, account funded via friendbot.
- Browser tab 1: the deployed app. Browser tab 2: `stellar.expert/explorer/testnet`.
- A small text file (e.g. `deliverable.txt`) on your Desktop to drag in as the work artifact.
- Zoom browser to 110% so the back row can read it.

---

## 00:00 — Hook (15s)

**Say:**
> "Work gets done every day. Payment gets stuck every day. Stellaroid Earn fixes that loop with one contract, one wallet, and one shareable link."

**Action:** Open the app. The **Next Action card** and **Milestone rail** are visible. Point at them.

---

## 00:15 — Connect wallet (15s)

**Say:**
> "I'm connecting Freighter on testnet. No email, no password, no KYC."

**Action:** Click **Connect wallet**. Approve in Freighter. Point at the **RPC health pill** in the header turning green — "we probe the Soroban RPC every 60 seconds so users always know the network is alive."

---

## 00:30 — Register (30s)

**Say:**
> "I'm the issuer. I just finished a piece of work for a student. I drop the file in — the browser hashes it locally with SHA-256. The file never leaves my machine."

**Action:** In the **Register** form, drag `deliverable.txt` onto the file input. The hash auto-fills. Paste a student G-address. Click **Register on-chain**.

**Say (while signing):**
> "Freighter pops up. I sign. Fifteen-second timeout wrapped around the RPC so the UI never hangs. If it fails, users get a sentence they can read — never raw ScVal."

**Action:** Approve in Freighter. Wait for the toast. Click the explorer link in the toast — tab 2 shows the tx on stellar.expert.

---

## 01:00 — Switch role, Verify (30s)

**Say:**
> "Now I flip to the employer side. Same app, same wallet, different role. No separate dashboard."

**Action:** Click the **Employer** segment in the role switcher. The Next Action copy changes.

**Say:**
> "The employer has their own copy of the deliverable. They hash it. If the hash on-chain matches, the work is real."

**Action:** Fill the Verify form with the same hash. Submit. Freighter pops, sign. Watch the **Milestone rail** tick from *Registered* to *Verified*.

---

## 01:30 — Pay (30s)

**Say:**
> "Here's the part every other credentialing app skips. Verification triggers payment in the same flow. No invoice. No 'net-30.' No bridge."

**Action:** Fill the Pay form. Amount: `10` XLM. Submit. Sign. Toast confirms settlement.

**Say:**
> "Sub-cent fees. Five-second finality. That's why this lives on Stellar."

---

## 02:00 — The Proof Block (45s)

**Say:**
> "And this is the artifact. Every completed flow produces a **Proof Block** — a public URL anyone can open."

**Action:** Click the **Proof Block preview** card on the dashboard. Route navigates to `/proof/<hash>`.

**Say:**
> "SHA-256 hash. Issuer. Student. Amount. Timestamp. Explorer links. Rubric self-check. And share intents for X and LinkedIn."

**Action:** Click **Copy link**. Paste into the URL bar of a new tab to prove it resolves standalone.

**Say:**
> "This is the receipt. This is the portfolio piece. This is the reference an employer links in an offer email. It's the **artifact that is the product.**"

---

## 02:45 — Walletless verification (15s)

**Say:**
> "Anyone can verify a claim without installing a wallet. Navigate to `/proof`, paste the hash, and the Proof Block opens. Recruiters, grant committees, and clients don't need an account to trust the receipt."

**Action:** Open `/proof` in a new tab. Paste the 64-char hash into the input. Submit. Proof Block loads.

---

## 03:00 — Close (15s)

**Say:**
> "Stellaroid Earn. Proof-of-work as a public good. Built in a bootcamp, deployed on Stellar testnet, ready for design partners. Thank you."

**Action:** Leave the Proof Block URL on screen. Open the floor for questions. Point judges at [`ONE_PAGER.md`](./ONE_PAGER.md) and [`FAQ.md`](./FAQ.md).

---

## Fallback script (if the network is flaky)

- If Freighter hangs → show the 15s timeout kicking in and the humanized error toast. "That's exactly what a user would see. No raw error bleed."
- If RPC is down → the health pill goes red. "The UI tells users the truth about the network. Fail loud, fail clearly."
- If a tx fails → navigate directly to a pre-baked Proof Block URL (bookmark one) and walk the artifact section.
- If an app route throws → the branded error boundary renders a recoverable screen, not a stack trace. If a hash is malformed → the branded 404 page offers a direct link to the `/proof` lookup.
- If you're running short on time or fumble a paste → click the **Demo autofill** button (bottom-right on `/app`) to populate a valid student address, certificate hash, and amount in one click. The button is there for rehearsal, but it's also your in-demo escape hatch.
