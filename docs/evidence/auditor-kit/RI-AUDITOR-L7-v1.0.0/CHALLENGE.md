# CHALLENGE.md — Independent adversarial checks (Phase 10 Level 4)

**Scope:** Frozen public L7 capsules only. Does not claim production EVO-V security.

**Rule:** Challenges must not mutate sealed artifacts. They operate on copies / derived inputs.

## How to run

```bash
# From repo root (after capsules + this script are available):
node non-kernel/frontend/scripts/challenge-art-l7.mjs \
  path/to/ART-L7-REPLAY-001.json \
  path/to/ART-L7-REJECT-001.json
```

Or with defaults pointing at repo artifact paths:

```bash
node non-kernel/frontend/scripts/challenge-art-l7.mjs
```

Exit **0** = all adversarial checks behaved as designed.

## Challenge catalog

| ID | Attack / probe | Expected |
|----|----------------|----------|
| C1-ORDER-PERMUTATION | Swap ordered events | Terminal hash ≠ sealed |
| C2-TAMPERED-EXPECTED | Mutate sealed expected hash | Computed still matches true seal; ≠ tampered |
| C3-ILLEGAL-EDGE | VERIFIED→INGESTED | Reject / throw; no silent accept |
| C4-CANON-KEY-ORDER | Object key insertion order | Canonical string identical |
| C5-CANON-STABLE | Reordered state keys | Hash still matches sealed |
| C6-EMPTY-STREAM | Empty event list | Hash ≠ sealed terminal |
| C7-DUPLICATE-INSERT | Duplicate record_id | Reject / throw |

## What PASS means

The frozen capsule algorithm resists these specific probes under the documented pure reducer.

## What PASS does not mean

- Production EVO-V is secure
- All possible attacks are covered
- LIVE systems were tested
- Full-kernel parity

## Relation to auditor kit

Level 1 offline reproduction is satisfied by `REPRODUCE.md` + verifiers.  
This document is **Level 4** — adversarial challenge of the same frozen evidence.
