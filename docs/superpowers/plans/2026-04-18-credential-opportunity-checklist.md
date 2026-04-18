# Credential-to-Opportunity Implementation Checklist

> **Source spec:** [`docs/superpowers/specs/2026-04-18-credential-opportunity-roadmap.md`](../specs/2026-04-18-credential-opportunity-roadmap.md)
>
> **For implementers:** Use checkbox updates in this file as the single progress tracker. Work top-to-bottom. Keep the app buildable after each task boundary.

**Goal:** Upgrade Stellaroid Earn from a credential registry + payment demo into a trusted issuer, recruiter-readable proof, and escrowed paid opportunity product.

**Current base:** The repo already has a live contract, Freighter-powered frontend, proof page, and register/verify/pay flow. This checklist extends that base instead of replacing it.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `contract/src/lib.rs` | Modify | Trust model, issuer registry, credential status, opportunity escrow |
| `contract/src/test.rs` | Modify | Contract tests for trust + opportunity flows |
| `frontend/src/lib/types.ts` | Modify | Shared issuer / credential / opportunity types |
| `frontend/src/lib/contract-client.ts` | Modify | New client bindings for issuer and opportunity methods |
| `frontend/src/lib/contract-read-server.ts` | Modify | Server-side reads for issuer / credential / opportunity |
| `frontend/src/lib/issuer-registry.ts` | Modify | Demote to temporary display fallback |
| `frontend/src/app/app/page.tsx` | Modify | Evolve app dashboard to role-based control center |
| `frontend/src/app/proof/[hash]/page.tsx` | Modify | Rich proof route |
| `frontend/src/components/proof/proof-card.tsx` | Modify | Rich credential proof card + CTA |
| `frontend/src/app/issuer/page.tsx` | Create | Issuer dashboard |
| `frontend/src/app/issuer/register/page.tsx` | Create | Issuer registration flow |
| `frontend/src/app/employer/page.tsx` | Create | Employer search / opportunity actions |
| `frontend/src/app/talent/[address]/page.tsx` | Create | Candidate passport |
| `frontend/src/app/opportunity/[id]/page.tsx` | Create | Escrow / milestone detail page |
| `frontend/src/components/issuer/*` | Create | Issuer UI components |
| `frontend/src/components/employer/*` | Create | Employer UI components |
| `frontend/src/components/talent/*` | Create | Passport UI components |
| `frontend/src/components/opportunity/*` | Create | Opportunity / escrow UI components |
| `frontend/src/components/proof/*` | Create/Modify | Proof metadata and CTA components |

---

## Phase 1: Trust Layer

### Task 1: Expand contract enums, structs, and storage keys

**Files:**
- `contract/src/lib.rs`

- [ ] Add `IssuerStatus`
- [ ] Add `CredentialStatus`
- [ ] Add `Issuer` struct
- [ ] Replace the old `Certificate` struct with a richer `Credential` struct
- [ ] Add `NextOpportunityId` storage key
- [ ] Add `Issuer(Address)` storage key
- [ ] Confirm TTL handling still applies to trust-critical records

**Definition of done**
- Contract compiles
- Existing imports are clean
- Old `verified: bool` logic is fully replaced in the type model

---

### Task 2: Add issuer registry contract methods

**Files:**
- `contract/src/lib.rs`

- [ ] Add `register_issuer`
- [ ] Add `approve_issuer`
- [ ] Add `suspend_issuer`
- [ ] Add `get_issuer`
- [ ] Require admin auth for issuer approval/suspension
- [ ] Emit `issuer_reg`, `issuer_appr`, `issuer_susp` events

**Definition of done**
- Unapproved issuer can exist on-chain
- Approved issuer status is queryable
- Suspended issuer status is queryable

---

### Task 3: Replace open verification with role-based verification

**Files:**
- `contract/src/lib.rs`
- `frontend/src/components/actions/verify-form.tsx`

- [ ] Replace public `verify_certificate` behavior with auth-gated `verify_credential`
- [ ] Only allow admin or approved issuer/verifier to verify
- [ ] Update event name if needed to stay semantically clear
- [ ] Update frontend copy to reflect trusted verification
- [ ] Remove any assumptions in UI that "anyone can verify"

**Definition of done**
- Verification without proper role fails
- UI no longer suggests open/public verification

---

### Task 4: Add revocation and suspension for credentials

**Files:**
- `contract/src/lib.rs`
- `frontend/src/lib/contract-client.ts`
- `frontend/src/lib/contract-read-server.ts`

- [ ] Add `revoke_credential`
- [ ] Add `suspend_credential`
- [ ] Update credential status transitions
- [ ] Emit revocation/suspension events
- [ ] Normalize status values in client/server read helpers

**Definition of done**
- Revoked credential reads back with revoked status
- Suspended credential reads back with suspended status
- Downstream payment flows can block these statuses

---

### Task 5: Add trust-layer tests

**Files:**
- `contract/src/test.rs`

- [ ] Test unapproved issuer cannot issue
- [ ] Test suspended issuer cannot issue
- [ ] Test unauthorized verifier fails
- [ ] Test revoked credential status persists
- [ ] Test issuer events emit
- [ ] Update snapshots if needed

**Definition of done**
- `cargo test` passes
- New trust behaviors are covered

---

## Phase 2: Rich Credential Model

### Task 6: Expand frontend shared types

**Files:**
- `frontend/src/lib/types.ts`

- [ ] Add `IssuerStatus`
- [ ] Add `CredentialStatus`
- [ ] Add `OpportunityStatus`
- [ ] Add `IssuerRecord`
- [ ] Add richer `CredentialRecord`
- [ ] Add `OpportunityRecord`

**Definition of done**
- Shared types are imported instead of redefining status strings in multiple files

---

### Task 7: Expand contract client bindings

**Files:**
- `frontend/src/lib/contract-client.ts`

- [ ] Add issuer write bindings
- [ ] Add issuer read bindings
- [ ] Replace `getCertificate` model with `getCredential`
- [ ] Replace `verifyCertificate` with `verifyCredential`
- [ ] Add revoke/suspend credential bindings
- [ ] Keep existing compatibility only if needed during transition

**Definition of done**
- Client API mirrors the new contract surface
- Old helper names are removed or clearly deprecated

---

### Task 8: Expand server read helpers

**Files:**
- `frontend/src/lib/contract-read-server.ts`

- [ ] Add `getIssuerServer`
- [ ] Add `getCredentialServer`
- [ ] Add `getOpportunityServer` scaffold if contract methods exist
- [ ] Share normalization helpers between client and server where practical

**Definition of done**
- Proof and dashboard pages can be rendered from server reads without client-only fetches

---

### Task 9: Decide metadata boundary

**Files:**
- `contract/src/lib.rs`
- `frontend/src/lib/types.ts`
- optional metadata helper file

- [ ] Keep trust-critical state on-chain
- [ ] Keep rich presentation metadata off-chain via `metadata_uri` + `metadata_hash`
- [ ] Define metadata JSON shape
- [ ] Add a local/demo metadata example for development

**Definition of done**
- There is a single documented metadata shape
- UI can render skills/evidence without forcing long arrays on-chain

---

## Phase 3: Proof Page Upgrade

### Task 10: Upgrade proof route data loading

**Files:**
- `frontend/src/app/proof/[hash]/page.tsx`

- [ ] Replace `CertificateRecord` dependency with richer credential record
- [ ] Load issuer data server-side
- [ ] Load metadata payload if available
- [ ] Pass issuer + metadata + status to the proof UI

**Definition of done**
- Proof route has enough data to render issuer trust and evidence sections

---

### Task 11: Upgrade proof card

**Files:**
- `frontend/src/components/proof/proof-card.tsx`

- [ ] Replace "verified bool" UX with status-driven UX
- [ ] Show issuer profile/trust badge
- [ ] Show credential title and cohort
- [ ] Show status title/body for revoked/suspended/expired
- [ ] Add evidence/project links
- [ ] Add recruiter CTA panel
- [ ] Keep explorer/hash actions as supporting UI

**Definition of done**
- A recruiter can understand the credential without knowing Stellar

---

### Task 12: Add proof subcomponents

**Files to create:**
- `frontend/src/components/proof/issuer-trust-card.tsx`
- `frontend/src/components/proof/credential-metadata-panel.tsx`
- `frontend/src/components/proof/credential-status-timeline.tsx`
- `frontend/src/components/proof/recruiter-cta-panel.tsx`

- [ ] Create issuer trust card
- [ ] Create metadata panel
- [ ] Create status timeline
- [ ] Create recruiter CTA panel

**Definition of done**
- Proof page composition is modular, not one giant component

---

### Task 13: Add verified PDF export

**Files:**
- proof UI files
- optional utility file

- [ ] Decide export strategy (print-friendly route or generated document)
- [ ] Add export button to proof page
- [ ] Ensure exported output includes verification URL / QR

**Definition of done**
- Proof can be shared in a recruiter-friendly, document-shaped format

---

## Phase 4: Opportunity Layer

### Task 14: Add opportunity structs and storage

**Files:**
- `contract/src/lib.rs`

- [ ] Add `OpportunityStatus`
- [ ] Add `Opportunity` struct
- [ ] Add `Opportunity(u64)` storage key usage
- [ ] Add `NextOpportunityId` sequencing

**Definition of done**
- Contract can store and retrieve opportunity records

---

### Task 15: Add opportunity contract methods

**Files:**
- `contract/src/lib.rs`

- [ ] Add `create_opportunity`
- [ ] Add `fund_opportunity`
- [ ] Add `submit_milestone`
- [ ] Add `approve_milestone`
- [ ] Add `release_payment`
- [ ] Add `refund_opportunity`
- [ ] Add `get_opportunity`
- [ ] Emit opportunity lifecycle events

**Definition of done**
- Full funded-trial lifecycle exists in contract form

---

### Task 16: Add opportunity tests

**Files:**
- `contract/src/test.rs`

- [ ] Test opportunity creation against valid credential
- [ ] Test revoked/suspended credential cannot create opportunity
- [ ] Test fund path
- [ ] Test release path
- [ ] Test refund path
- [ ] Test invalid status transitions fail

**Definition of done**
- Opportunity lifecycle is covered by tests

---

### Task 17: Add opportunity client bindings

**Files:**
- `frontend/src/lib/contract-client.ts`
- `frontend/src/lib/contract-read-server.ts`

- [ ] Add create/fund/submit/approve/release/refund bindings
- [ ] Add opportunity normalization helpers
- [ ] Add opportunity server read

**Definition of done**
- Frontend can fully drive the opportunity lifecycle

---

## Phase 5: New Routes

### Task 18: Add issuer routes

**Files to create:**
- `frontend/src/app/issuer/page.tsx`
- `frontend/src/app/issuer/register/page.tsx`

- [ ] Create issuer dashboard page
- [ ] Create issuer register page
- [ ] Show issuer status
- [ ] Show credentials issued
- [ ] Add revoke/suspend actions

**Definition of done**
- An issuer can manage trust and credential lifecycle from dedicated routes

---

### Task 19: Add employer route

**Files to create:**
- `frontend/src/app/employer/page.tsx`

- [ ] Create employer page
- [ ] Add candidate lookup/search entry point
- [ ] Add action to create/fund opportunity
- [ ] Add shortlist-ready proof summary cards

**Definition of done**
- Employer route can move from proof to funding action

---

### Task 20: Add talent passport route

**Files to create:**
- `frontend/src/app/talent/[address]/page.tsx`

- [ ] Create candidate passport page
- [ ] Show credentials
- [ ] Show issuers
- [ ] Show active/completed opportunities
- [ ] Show released payments or activity

**Definition of done**
- Candidate has a durable profile surface beyond a single proof hash

---

### Task 21: Add opportunity detail route

**Files to create:**
- `frontend/src/app/opportunity/[id]/page.tsx`

- [ ] Create opportunity detail page
- [ ] Show escrow state
- [ ] Show milestone state
- [ ] Show release/refund controls depending on role

**Definition of done**
- Opportunity lifecycle can be demonstrated on a dedicated page

---

## Phase 6: New Components

### Task 22: Add issuer components

**Files to create:**
- `frontend/src/components/issuer/issuer-profile-card.tsx`
- `frontend/src/components/issuer/issuer-register-form.tsx`
- `frontend/src/components/issuer/issuer-approval-panel.tsx`
- `frontend/src/components/issuer/issuer-credential-table.tsx`

- [ ] Create issuer profile card
- [ ] Create issuer registration form
- [ ] Create issuer approval panel
- [ ] Create issuer credential table

---

### Task 23: Add employer components

**Files to create:**
- `frontend/src/components/employer/employer-candidate-search.tsx`
- `frontend/src/components/employer/employer-shortlist.tsx`
- `frontend/src/components/employer/employer-opportunity-form.tsx`

- [ ] Create candidate search
- [ ] Create shortlist display
- [ ] Create opportunity funding form

---

### Task 24: Add talent components

**Files to create:**
- `frontend/src/components/talent/talent-passport.tsx`
- `frontend/src/components/talent/talent-credential-list.tsx`
- `frontend/src/components/talent/talent-opportunity-history.tsx`

- [ ] Create passport summary
- [ ] Create credential list
- [ ] Create opportunity history

---

### Task 25: Add opportunity components

**Files to create:**
- `frontend/src/components/opportunity/opportunity-card.tsx`
- `frontend/src/components/opportunity/fund-opportunity-form.tsx`
- `frontend/src/components/opportunity/milestone-stepper.tsx`
- `frontend/src/components/opportunity/opportunity-timeline.tsx`

- [ ] Create opportunity card
- [ ] Create funding form
- [ ] Create milestone stepper
- [ ] Create opportunity timeline

---

## Phase 7: Cleanup and Source of Truth

### Task 26: Demote frontend-only issuer registry

**Files:**
- `frontend/src/lib/issuer-registry.ts`
- proof/issuer UI files

- [ ] Stop using the static registry as the source of trust
- [ ] Keep it only for temporary display enrichment if needed
- [ ] Ensure proof badges are based on on-chain issuer status

**Definition of done**
- Trust comes from contract state, not from a local hardcoded map

---

### Task 27: Upgrade `/app` from demo page to control center

**Files:**
- `frontend/src/app/app/page.tsx`
- related action components

- [ ] Rewire current issuer/employer cards to the new trust/opportunity flows
- [ ] Keep existing wallet and milestone UX where still useful
- [ ] Remove outdated assumptions about boolean verification

**Definition of done**
- `/app` reflects the new product model instead of the old demo-only flow

---

### Task 28: Verification pass

**Files:**
- contract + frontend touched files

- [ ] Run `cargo test`
- [ ] Run `npm run build`
- [ ] Verify proof route still works
- [ ] Verify issuer route renders
- [ ] Verify employer route renders
- [ ] Verify opportunity route renders
- [ ] Verify no raw error leaks in new flows

**Definition of done**
- Contract and frontend both build and run with the upgraded model

---

## Recommended Execution Order

1. Phase 1 trust layer
2. Phase 2 shared types and bindings
3. Phase 3 proof page upgrade
4. Phase 4 opportunity contract
5. Phase 5 routes
6. Phase 6 component split
7. Phase 7 cleanup and verification

---

## Hackathon Cut Line

If time runs short, stop after these:

- [ ] issuer registry on-chain
- [ ] role-based verification
- [ ] credential revocation/suspension
- [ ] rich proof page
- [ ] opportunity create/fund/release flow

That is the minimum strong demo set.
