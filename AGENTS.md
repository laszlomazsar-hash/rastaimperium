# AGENTS.md — Codex Deterministic Engineering Policy v1.0

## Purpose
This repository is operated as a deterministic, replay-verifiable system.
Agents must preserve audit integrity, append-only lineage, and explicit state semantics.

---

## 1) Global Operating Mode

### Required behavior
- Make the smallest correct change.
- Prefer explicitness over convenience.
- Preserve determinism across runs.
- Never silently rewrite history, interpretations, or prior outputs.

### Prohibited behavior
- Hidden state mutation.
- Destructive overwrite of archival artifacts.
- Unbounded refactors unrelated to task.
- Introducing nondeterministic logic in critical paths.

---

## 2) Change Policy

### Allowed
- Additive changes.
- Versioned replacements with lineage references.
- Guarded state transitions through defined FSM.

### Disallowed
- In-place mutation of immutable records.
- Delete/update on append-only tables/log streams.
- State transitions outside transition matrix.

---

## 3) Determinism Rules

All critical operations must be deterministic under identical:
- inputs
- version bundle
- event order

### Version bundle (mandatory in critical operations)
- schema_version
- ruleset_version
- governance_version
- canon_spec_version
- cert_profile (when proof/certificate involved)

### Canonicalization baseline
- Lexicographic key ordering
- Explicit nulls
- UTF-8 NFC normalization
- UTC ISO-8601 timestamps (ms precision)
- Fixed numeric representation (repo-wide standard)

---

## 4) Event & Audit Rules

### Event model
- Append-only
- Globally ordered
- Hash-linked
- Dual-plane allowed (OUT_OF_TX and TX), unified by global sequence

### Mandatory commit boundary
- `COMMIT_FINALIZED` must anchor committed state transitions.

### State mutation rule
- Only `STATE_TRANSITION` events may mutate lifecycle state.
- `RECORD_INSERT` creates identity only.

---

## 5) FSM Authority

Allowed lifecycle states:
- INGESTED
- NORMALIZED
- VERIFIED
- CORRELATED
- ARCHIVED
- CONTESTED

Allowed transitions:
- INGESTED -> NORMALIZED
- NORMALIZED -> VERIFIED
- VERIFIED -> CORRELATED
- CORRELATED -> ARCHIVED
- ANY -> CONTESTED

Illegal transitions:
- Must be rejected.
- Must emit failure audit event.
- May require counterexample generation.

---

## 6) Identity & Security

### Actor identity
- Cryptographic identity required for authoritative operations.
- Request attribution must include:
  - request_id
  - operator_id
  - actor_key_id
  - service principal (where applicable)

### Transport/security
- mTLS for service boundaries.
- Signature verification for proof-bearing artifacts.
- Key version must be explicit in signed outputs.

---

## 7) Idempotency Rules

Critical write endpoints must support strict idempotency:
- `idempotency_key = SHA256(checksum + source_origin + ingestion_namespace)`

Retry behavior:
- Same key + same payload => return existing result.
- No duplicate CRN/event creation for idempotent retries.

---

## 8) Replay & Verification

### Replay function contract
State reconstruction must be pure and deterministic:
- no external mutable dependencies
- no network-time variance
- no nondeterministic ordering fallback in normal operation

### Invariant checks (minimum)
- Replay parity
- Audit completeness
- Snapshot determinism
- Ordering integrity
- Lineage consistency

Failure of any critical invariant:
- Trigger write freeze.
- Emit counterexample artifact.

---

## 9) Counterexample Requirements

Every critical failure must produce a canonical counterexample object containing:
- violated invariant
- divergence index
- minimal reproducer slice
- expected vs actual hashes
- version bundle context
- replay capsule reference

Counterexamples are:
- deterministic
- hash-linked
- append-only lineage artifacts

---

## 10) Certificate Lifecycle Governance

Certificate statuses:
- ACTIVE
- SUPERSEDED
- REVOKED
- EXPIRED
- UNDER_REVIEW

Rules:
- SUPERSEDED != REVOKED
- Decision systems must resolve latest status before reliance.
- Revalidation is mandatory within policy-defined window after supersession/revocation.

---

## 11) Developer Workflow for Agents

1. Inspect relevant files and constraints.
2. Identify state/event/lineage impact.
3. Propose minimal patch.
4. Apply changes with deterministic semantics.
5. Verify no illegal transitions or hidden mutations introduced.
6. Update tests/checks.
7. Summarize with explicit impact and assumptions.

---

## 12) Commit Message Convention

Use structured commit messages:

`<scope>: <deterministic change summary>`

Body should include:
- state/FSM impact
- event/audit impact
- replay/verification impact
- breaking-change status (if any)

Example:
`ingest: enforce STATE_TRANSITION-only lifecycle mutation`

---

## 13) Pull Request Checklist (Required)

- [ ] Change is minimal and scoped.
- [ ] No append-only violations introduced.
- [ ] FSM transitions remain legal and enforced.
- [ ] Determinism preserved under identical inputs.
- [ ] Version bundle compatibility maintained.
- [ ] Replay/verification impact documented.
- [ ] Counterexample path preserved for failure cases.
- [ ] Security/identity boundaries respected.

---

## 14) Escalation Rules

If integrity is uncertain:
1. Freeze writes (or recommend freeze if no runtime control).
2. Preserve all variants.
3. Mark affected artifacts CONTESTED.
4. Generate evidence/counterexample package.
5. Request human governance review.

No destructive repair permitted.
