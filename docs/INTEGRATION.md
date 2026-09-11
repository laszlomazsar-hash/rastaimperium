# Phase 22 Step 5 — Verification Receipt Integration Guide

## Files

- `non-kernel/frontend/components/design-system/VerificationReceipt.tsx`
- `non-kernel/frontend/components/design-system/EvidenceGraph.tsx`
- `non-kernel/frontend/data/evidence/receipts.ts`
- `non-kernel/frontend/data/evidence/receipts.test.ts`

## Integration (additive)

### /proof/
Render EvidenceGraph + VerificationReceipt for the three L7 capsules via `listReceipts()`.

### /verify/
Link each capsule to `/proof/#receipt-{id}`.

### /challenge/
Link CHAL-ILLEGAL-TRANSITION-001 / INV-002 to `/proof/#receipt-ART-L7-REJECT-001`.

### /evaluate/
Provide links to the three public receipts.

## Evidence boundary

- Status from Living Evidence Manifest only
- Expected/Observed remain Not established until offline pure-verifier run
- productionAuthority always false on public surface
- UI is not the authority
