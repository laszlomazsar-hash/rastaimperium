# ARCHITECTURE

## Scope
This document describes kernel-relevant architecture only: deterministic governance execution, audit lineage, and replay verification semantics.

For execution ordering, see [SYSTEM_FLOW](./SYSTEM_FLOW.md).
For machine-checkable guarantees, see [INVARIANTS](./INVARIANTS.md).
For canonical terms, see [GLOSSARY](./GLOSSARY.md).

## Kernel components

1. **Event Plane**
   - Accepts append-only, globally ordered events.
   - Preserves attribution and canonical input representation.

2. **Validation Plane**
   - Enforces schema, canonicalization, identity, idempotency, and transition legality checks.
   - Rejects illegal transitions and emits failure audit artifacts.

3. **State Transition Engine**
   - Applies lifecycle mutation only through `STATE_TRANSITION` events.
   - Enforces legal lifecycle matrix and explicit failure semantics.

4. **Receipt Engine**
   - Produces deterministic operation receipts with pre/post hashes and version-bundle context.

5. **Ledger Engine**
   - Maintains append-only, hash-linked lineage.
   - Anchors committed transitions with `COMMIT_FINALIZED`.

6. **Replay & Verification Engine**
   - Reconstructs state purely from ordered lineage + fixed version bundle.
   - Checks replay parity, ordering integrity, and audit completeness.

## Kernel assertions

1. Deterministic outcomes require identical inputs, version bundle, and event order.
2. Lifecycle state mutation is explicit and event-bound (no hidden state writes).
3. Ledger lineage is append-only and hash-linked.
4. Replay is a first-class verification contract, not a best-effort diagnostic.
