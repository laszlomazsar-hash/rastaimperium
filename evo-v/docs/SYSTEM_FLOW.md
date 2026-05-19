# System Flow

This system permits exactly one execution chain for stateful operations:

**Event -> Validation -> State Transition -> Receipt -> Ledger -> Replay**

No stage may be skipped, reordered, or merged in a way that obscures audit lineage.

## 1) Event
- Runtime creates an explicit event envelope from input.
- Envelope must include identity attribution and deterministic metadata.
- Event type determines whether lifecycle mutation is even eligible.

**Output:** canonical event candidate (not yet authoritative).

## 2) Validation
- Governance validates:
  - schema/canonicalization conformance,
  - version bundle completeness,
  - identity/security requirements,
  - FSM transition legality.
- Rejected events must produce auditable failure events/reasons.

**Output:** deterministic decision: `ALLOW` or `REJECT` (+ reason codes).

## 3) State Transition
- Only `STATE_TRANSITION` events may mutate lifecycle state.
- Transition must match allowed matrix:
  - `INGESTED -> NORMALIZED`
  - `NORMALIZED -> VERIFIED`
  - `VERIFIED -> CORRELATED`
  - `CORRELATED -> ARCHIVED`
  - `ANY -> CONTESTED`
- Illegal transitions are rejected and audited.

**Output:** proposed post-state derived from governed transition.

## 4) Receipt
- System emits deterministic receipt for the attempted operation.
- Receipt binds:
  - event hash,
  - decision,
  - transition details (if allowed),
  - version bundle,
  - identity attribution.

**Output:** immutable operation receipt for clients and audit.

## 5) Ledger
- Append accepted records to hash-linked, globally ordered ledger.
- Commit boundaries must be anchored by `COMMIT_FINALIZED`.
- No updates/deletes; only append.

**Output:** authoritative event history.

## 6) Replay
- Rebuild state from ledger only.
- Verify replay parity and other invariants.
- On divergence, emit deterministic counterexample and trigger freeze/escalation path.

**Output:** reconstructed state + verification result.

## Forbidden Alternate Flows

The following are explicitly invalid:
- Event -> State Transition (skips validation)
- Event -> Ledger (skips receipt and governed transition semantics)
- Validation -> Ledger without explicit event/receipt binding
- Replay -> direct state mutation
- Runtime side-effects not represented as events

## Idempotency Across the Chain

For critical write endpoints:
- `idempotency_key = SHA256(checksum + source_origin + ingestion_namespace)`
- Same key + same payload must return existing result.
- Duplicate CRN/event creation is forbidden.

Idempotent retries must re-surface the same receipt and ledger lineage, not create parallel histories.
