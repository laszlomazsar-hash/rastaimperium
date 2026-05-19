# Invariants

This document defines enforceable invariants for deterministic execution, audit integrity, and replay-verifiable state.

## Core Invariants (Enforced)

1. `replay(ledger) == original_state`  
   Reconstructed state from authoritative ledger must match originally committed state under identical version bundle and event order.

2. No hidden state mutation  
   All state changes must be represented by explicit governed events. Side-channel writes and implicit mutation paths are forbidden.

3. Append-only ledger  
   Ledger records are immutable after append. Update/delete semantics are disallowed for authoritative event history.

4. Explicit event-origin transitions  
   Every lifecycle mutation must trace to a specific `STATE_TRANSITION` event with valid predecessor state and allowed target.

## Transition Legality Invariant

Allowed transitions:
- `INGESTED -> NORMALIZED`
- `NORMALIZED -> VERIFIED`
- `VERIFIED -> CORRELATED`
- `CORRELATED -> ARCHIVED`
- `ANY -> CONTESTED`

Invariant:
- Any transition outside this matrix must be rejected and audited as failure.

## Commit Boundary Invariant

- A committed state transition is not final until anchored by `COMMIT_FINALIZED`.
- Absence of required commit anchor is invariant failure.

## Ordering & Lineage Invariants

- Global sequence ordering is strict and reproducible.
- Hash-link continuity must hold across adjacent events.
- Audit completeness requires no gaps between accepted operation receipt and ledgered event lineage.

## Determinism Invariants

For identical inputs + version bundle + event order:
- Validation decisions are identical.
- Resulting transition outcomes are identical.
- Receipts are byte-stable under canonicalization policy.
- Replay output hashes are identical.

## Version Bundle Invariant

Critical operations must include:
- `schema_version`
- `ruleset_version`
- `governance_version`
- `canon_spec_version`
- `cert_profile` (when applicable)

Missing/ambiguous version metadata is a hard failure.

## Identity & Attribution Invariant

Authoritative operations must include attributable identity context:
- `request_id`
- `operator_id`
- `actor_key_id`
- service principal (where applicable)

If attribution is incomplete, operation is non-authoritative and must not mutate governed state.

## Idempotency Invariant

For critical writes:
- `idempotency_key = SHA256(checksum + source_origin + ingestion_namespace)`
- Same key + same payload yields same result and same lineage.
- Duplicate event creation for idempotent retries is invariant failure.

## Failure Handling Invariant

On critical invariant breach:
1. Trigger write freeze (or explicit freeze recommendation).
2. Mark affected artifacts `CONTESTED` through valid transition event(s).
3. Emit canonical counterexample containing:
   - violated invariant,
   - divergence index,
   - minimal reproducer slice,
   - expected vs actual hashes,
   - version bundle context,
   - replay capsule reference.
4. Preserve append-only lineage; no destructive remediation.
