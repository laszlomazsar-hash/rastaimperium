# Architecture

This document defines the core system components and the strict boundaries between them. The system is deterministic, replay-verifiable, and append-only by design.

## Components

### 1) Runtime
**Responsibility:**
- Accept external requests and normalize request context (`request_id`, `operator_id`, `actor_key_id`, service principal).
- Build deterministic event candidates from inputs.
- Route events through validation before any state transition.

**Must not:**
- Mutate lifecycle state directly.
- Write ledger records directly.
- Bypass validation or governance policy checks.

---

### 2) Governance
**Responsibility:**
- Evaluate event candidates against policy (`governance/policy.v1.yaml`) and FSM transition matrix.
- Enforce identity/security requirements for authoritative operations.
- Produce deterministic decision outputs (allow/reject + reason codes).

**Must not:**
- Persist business state.
- Reorder events.
- Perform ledger compaction, mutation, or deletion.

---

### 3) Ledger
**Responsibility:**
- Persist append-only, globally ordered, hash-linked events.
- Anchor commit boundaries using `COMMIT_FINALIZED`.
- Preserve immutable lineage for all accepted events and failure audits.

**Must not:**
- Overwrite or delete prior events.
- Synthesize implicit transitions.
- Accept records without deterministic canonicalization and version bundle context.

---

### 4) Replay
**Responsibility:**
- Reconstruct state purely from ledger events.
- Verify invariants: parity, ordering integrity, audit completeness, lineage consistency.
- Emit deterministic counterexample artifacts when invariants fail.

**Must not:**
- Read mutable external systems during reconstruction.
- Depend on wall-clock/network-time variance.
- Apply nondeterministic ordering fallback in normal operation.

## Strict Boundary Rules

1. **Runtime -> Governance only by explicit event envelope**  
   No side-channel mutation or hidden context transfer.

2. **Governance -> Runtime returns decision, not state mutation**  
   Governance authorizes or rejects; Runtime executes only authorized path.

3. **Runtime -> Ledger only through committed event pipeline**  
   Direct state writes are forbidden.

4. **Ledger -> Replay is read-only and complete**  
   Replay consumes full canonical event stream and never mutates it.

5. **Replay outputs are verification artifacts, not implicit writes**  
   Any corrective action must be modeled as new governed events.

## Control Plane vs Data Plane

- **Data plane:** runtime handling, validation outcomes, state transitions, receipt emission, ledger append.
- **Control plane:** policy/ruleset versions, governance updates, replay verification scheduling.

Control-plane changes must remain explicit and versioned. Data-plane execution must include the relevant version bundle for deterministic interpretation.

## Version Bundle (Mandatory on Critical Operations)

Each critical operation must carry:
- `schema_version`
- `ruleset_version`
- `governance_version`
- `canon_spec_version`
- `cert_profile` (when proof/certificate is involved)

Any missing or ambiguous version field is a hard validation failure.

## Failure Behavior

On critical invariant failure:
1. Freeze writes (or recommend freeze when runtime cannot enforce directly).
2. Mark affected artifacts `CONTESTED` via governed transition events.
3. Emit canonical counterexample artifact with divergence context.
4. Preserve append-only lineage; no destructive repair.
