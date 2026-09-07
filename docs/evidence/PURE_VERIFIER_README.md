# Pure Verifier — Offline Reproduction Guide

**Status:** Documentation only  
**Scope:** Sealed public L7 capsules (ART-L7-REPLAY-001, ART-L7-REJECT-001, ART-L7-PARITY-001)  
**Does not modify:** any evidence capsule, hash, kernel semantics, or claim status

This document is the single entry point for independent offline verification.

---

## 1. What the pure verifier verifies

The pure verifiers recompute, from the sealed capsule alone:

- Deterministic state reduction over an ordered event stream
- SHA-256 of canonical JSON of the terminal state (`state_hash`)
- Hash-linked ledger head (`ledger_head_hash`)
- Receipt hash over a fixed payload shape
- Illegal lifecycle edge rejection (no state mutation + sealed rejection receipt)

They prove only that **the sealed public capsule independently reproduces its published hashes** under the documented algorithm.

They do **not** prove production EVO-V health, LIVE telemetry, full-kernel parity, performance, or any claim outside the capsule boundary.

---

## 2. Status vocabulary (consistent with Living Evidence Manifest)

| Label | Meaning |
|-------|--------|
| **VERIFIED** | Sealed public capsule + independent pure verifiers (Node + Python) that match the published hashes. Capsule-scoped only. |
| **DEMONSTRATION** | Design, documentation, or synthetic surface. Not production evidence. |
| **UNAVAILABLE** | No sealed public artifact exists. The claim is not made on this surface. |

See [`EVIDENCE_MANIFEST.json`](./EVIDENCE_MANIFEST.json) and [`EVIDENCE_MANIFEST.md`](./EVIDENCE_MANIFEST.md).

---

## 3. Input / output contract

**Input**
- One frozen JSON capsule (`ART-L7-*.json`)
- No network calls
- No website UI
- No external configuration beyond the capsule itself

**Output**
- Exit code `0` = all computed hashes match the sealed `expected.*` values
- Exit code `1` = mismatch, missing fields, or read error
- Console report of computed vs expected hashes

**Determinism requirement**
Identical capsule + identical algorithm → identical hashes on every run and every pure implementation.

---

## 4. Canonicalization rules (`json-canonical-sorted-keys-1`)

Normative for all sealed L7 capsules. Full detail: [`ALGORITHM_CANONICALIZATION.md`](./ALGORITHM_CANONICALIZATION.md).

Summary:
- Objects: keys sorted lexicographically, recursive
- Arrays: order preserved
- Numbers: integers without fractional part as decimal integers
- Strings: RFC 8259 with minimal escaping (do **not** HTML-escape `<>&`)
- Hash: SHA-256 over UTF-8 bytes of the canonical string → lowercase hex

---

## 5. How to run offline

### Prerequisites
- Node.js ≥ 18 **or** Python 3.10+
- Repository clone (or the three sealed JSON artifacts + the scripts)

### Node (recommended one-liners)

From repository root:

```bash
# Replay parity (INV-001)
node non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs

# Illegal transition rejection (INV-002)
node non-kernel/frontend/scripts/verify-art-l7-reject-001.mjs

# Cross-implementation parity gate
node non-kernel/frontend/scripts/parity-art-l7.mjs
```

Against a downloaded copy:

```bash
node non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs ./ART-L7-REPLAY-001.json
```

### Python

```bash
python non-kernel/frontend/scripts/verify_art_l7_replay_001.py
python non-kernel/frontend/scripts/verify_art_l7_reject_001.py
```

### Expected deterministic result

Exit code **0** and exact hash match against the sealed values published in each capsule and in the per-artifact reproduction guides.

---

## 6. Implementations present

| Language | Location | Notes |
|----------|----------|-------|
| Node.js  | `non-kernel/frontend/scripts/verify-art-l7-*.mjs` | Primary pure verifier |
| Python   | `non-kernel/frontend/scripts/verify_art_l7_*.py`   | Independent pure verifier |
| Go (C)   | Documented via Independent Implementation C | Used for canonicalization discovery; see `INDEPENDENT_IMPLEMENTATION_C.md` |

All pure verifiers must agree on the sealed hashes for a capsule to remain VERIFIED.

---

## 7. Frozen L7 evidence capsules (current)

| Artifact | Invariant | Status | Reproduction guide |
|----------|-----------|--------|--------------------|
| ART-L7-REPLAY-001 | INV-001 replay_parity | VERIFIED | [INDEPENDENT_REPRODUCTION_ART-L7-REPLAY-001.md](./INDEPENDENT_REPRODUCTION_ART-L7-REPLAY-001.md) |
| ART-L7-REJECT-001 | INV-002 illegal_transition_rejection | VERIFIED | [INDEPENDENT_REPRODUCTION_ART-L7-REJECT-001.md](./INDEPENDENT_REPRODUCTION_ART-L7-REJECT-001.md) |
| ART-L7-PARITY-001 | cross_implementation_parity | VERIFIED | See parity script + CROSS_IMPLEMENTATION_PARITY_L7.md |

Public artifact URLs:
- `https://rastaimperium.com/evidence/artifacts/ART-L7-REPLAY-001.json`
- `https://rastaimperium.com/evidence/artifacts/ART-L7-REJECT-001.json`
- `https://rastaimperium.com/evidence/artifacts/ART-L7-PARITY-001.json`

---

## 8. What this does **not** prove

- Production EVO-V deployment health
- LIVE operational telemetry
- Full-kernel or fleet parity
- Performance / benchmark numbers
- Court-ready or hardware-enforced certification beyond the sealed capsules

These remain **UNAVAILABLE** on the public surface. See the Living Evidence Manifest and [Limitations](https://rastaimperium.com/limitations/).

---

## 9. Freeze policy

Each `ART-L7-*-001` object is **immutable**.

- Do not edit events, expected hashes, or algorithm fields in place.
- Any change requires a new numbered artifact (`-002`, `-003`, …).
- Historical capsules remain valid evidence objects under their original hashes.

---

## 10. Quick auditor path

1. Read this file.
2. Download the three sealed JSON artifacts (or clone the repo).
3. Run the Node (or Python) pure verifiers.
4. Confirm exit code 0 and hash match.
5. Read the Living Evidence Manifest and Limitations page for the exact claim boundary.

**Claim → frozen evidence → independent verifier → offline reproduction → limitation**

That is the complete public verification loop for the current L7 surface.
