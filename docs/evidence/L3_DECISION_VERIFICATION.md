# L3 Decision Verification — ART-L3-DECISION-001

**Status vocabulary on this surface**

- **VERIFIED** — Sealed public capsule with independent pure verifiers (Node + Python) that reproduce the claimed digests offline.
- **DEMONSTRATION** — Design or synthetic surface. Not production evidence.
- **UNAVAILABLE** — No sealed public artifact.

**Artifact:** `ART-L3-DECISION-001`  
**Invariant:** `INV-L3-001` — Deterministic Operational Transition Decision  
**Layer:** L3 (Operational Systems)  
**Production authority:** `false` / NOT ESTABLISHED  

---

## 1. What L3 means here

L3 on this evidence surface is **capsule-scoped deterministic operational transition decision** evidence.

It demonstrates that a frozen transition matrix and a deterministic decision function:

- evaluate fixed request cases to ALLOW or DENY
- assign stable reason codes
- produce a canonical result whose SHA-256 matches a sealed digest

under independent Node and Python pure verifiers.

It does **not** mean production enforcement of the EVO-V runtime, universal governance, agent containment, certification, or regulatory conformity.

**Public UI note:** Deployed `/proof/`, `/verify/`, `/blueprint/` L3 labels remain **DEMONSTRATION** until Phase 25 Step 3 integration, PR, merge, build, deploy, and deployed-tree verification.

---

## 2. INV-L3-001

Given a frozen transition matrix `M` and request `(from_state, event, to_state)`:

- **ALLOW** / `TRANSITION_PERMITTED` iff the tuple is in `M.legalTransitions`
- otherwise **DENY** with a stable reason

**Decision precedence (deterministic):**

1. malformed request → `INVALID_REQUEST`
2. unknown `from_state` → `UNKNOWN_STATE`
3. unknown `to_state` → `UNKNOWN_STATE`
4. unknown `event` → `UNKNOWN_EVENT`
5. legal tuple → `ALLOW` / `TRANSITION_PERMITTED`
6. otherwise → `DENY` / `ILLEGAL_TRANSITION`

---

## 3. Capsule identity

Path: `docs/evidence/artifacts/ART-L3-DECISION-001.json`

| Field | Value |
|-------|--------|
| artifactId | ART-L3-DECISION-001 |
| invariantId | INV-L3-001 |
| schemaVersion | ri-l3-decision-1.0.0 |
| fixtureVersion | 1.0.0 |
| productionAuthority | false |
| status | SEALED |
| expectedDigest | 88db345296504fa85c62d108ba24b9e64a772a764043bd85419c47ad51ad8577 |

The capsule embeds its own **frozen policy snapshot**. Verifiers must not read live policy files, environment variables, or network resources.

---

## 4. Cases

| caseId | Expected decision | Expected reason |
|--------|-------------------|-----------------|
| L3-LEGAL-001 | ALLOW | TRANSITION_PERMITTED |
| L3-ILLEGAL-001 | DENY | ILLEGAL_TRANSITION |
| L3-UNKNOWN-STATE-001 | DENY | UNKNOWN_STATE |
| L3-UNKNOWN-EVENT-001 | DENY | UNKNOWN_EVENT |
| L3-MALFORMED-001 | DENY | INVALID_REQUEST |

---

## 5. Canonicalisation

Algorithm: `json-canonical-sorted-keys-1`

- UTF-8
- object keys sorted recursively
- arrays retain semantic order
- no insignificant whitespace
- deterministic primitive representation
- reject NaN / ±Inf
- SHA-256 over canonical UTF-8 bytes

---

## 6. Commands

```bash
# Node pure verifier
node non-kernel/frontend/scripts/verify-art-l3-decision-001.mjs

# Python pure verifier (independent implementation)
python3 scripts/verify_art_l3_decision_001.py

# Parity (Node == Python == sealed digest)
node non-kernel/frontend/scripts/parity-art-l3-decision-001.mjs

# Mutation suite (temporary copies only; original must stay byte-identical)
node non-kernel/frontend/scripts/mutation-art-l3-decision-001.mjs
```

**Expected exit codes:** 0 = success; non-zero = failure.

---

## 7. Production-authority limitation

`productionAuthority: false`. This capsule does **not** establish production enforcement.

## 8. Relationship to L7

L7 VERIFIED capsules remain identity/trust/replay evidence. L3 is operational **decision** evidence under a frozen matrix. They must not be conflated.

## 9. Explicit non-claims

Does **not** establish: production enforcement; full EVO-V runtime verification; L4/L5/L6/L8 evidence; certification; universal governance; agent containment.

---

*UI is not the authority. Inspect the sealed artifact and pure verifiers.*

*Provenance: Phase 25 Step 2 reconstructed implementation (Step 2 was absent from GitHub main; this is a new sealed package, not historical recovery).*
