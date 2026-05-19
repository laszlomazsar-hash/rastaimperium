# SYSTEM FLOW

This document specifies the deterministic kernel execution pipeline:

**Event → Validation → State Transition → Receipt → Ledger → Replay**

Terminology aligns with [GLOSSARY](./GLOSSARY.md), [INVARIANTS](./INVARIANTS.md), and [ARCHITECTURE](./ARCHITECTURE.md).

## 1) Event

Input is an append-only, globally ordered event stream.
Each event carries canonical metadata and attribution (`request_id`, `operator_id`, `actor_key_id`, and principal where applicable).

## 2) Validation

Validation is deterministic and must run before state mutation:
- schema and canonicalization checks
- signature/identity checks where required
- transition precondition checks
- idempotency-key enforcement

Validation output is explicit: `accepted` or `rejected`.
Rejections must emit failure audit artifacts/counterexamples for critical invariant breaches.

## 3) State Transition

Only `STATE_TRANSITION` events may mutate lifecycle state.
`RECORD_INSERT` creates identity only and cannot mutate lifecycle status.
All transitions must be legal under the transition matrix:
- `INGESTED -> NORMALIZED`
- `NORMALIZED -> VERIFIED`
- `VERIFIED -> CORRELATED`
- `CORRELATED -> ARCHIVED`
- `ANY -> CONTESTED`

## 4) Receipt

For each accepted operation, produce a deterministic receipt containing at minimum:
- event reference
- pre-state hash
- post-state hash
- transition decision
- version bundle
- timestamp (UTC ISO-8601, ms precision)

## 5) Ledger

Receipts and events are anchored into a hash-linked, append-only ledger.
Committed transitions must be anchored by a `COMMIT_FINALIZED` boundary event.
Ledger order is authoritative for replay.

## 6) Replay

Replay reconstructs state as a pure function:
- inputs: ordered events/receipts + fixed version bundle
- constraints: no external mutable dependencies, no nondeterministic ordering fallback
- outputs: deterministic terminal state and lineage hashes

Replay must satisfy replay parity and no-hidden-state constraints defined in [INVARIANTS](./INVARIANTS.md).
