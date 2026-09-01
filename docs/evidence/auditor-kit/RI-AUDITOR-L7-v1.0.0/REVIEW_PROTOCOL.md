# REVIEW_PROTOCOL.md — Independent Review Protocol

**Kit:** RI-AUDITOR-L7-v1.0.0  
**Purpose:** Separate construction from verification/challenge.  
**Honesty rule:** A self-run of this protocol is **not** an external review.

## Roles (must stay separate in documentation)

| Role | Meaning |
|------|--------|
| Construction | How artifacts and verifiers were authored |
| Verification | Reproduce sealed hashes from frozen capsules |
| Challenge | Attempt to perturb and detect failure |

## Procedure

1. Obtain frozen capsules only (no website trust required).
2. Read public algorithm / canonicalization docs only for rules.
3. Run **Node**, **Python**, and **Go** verifiers independently on both capsules.
4. Confirm exit 0 and exact hash agreement across implementations.
5. Verify published SHA-256 of kit/capsule files (where CHECKSUMS provided).
6. Run adversarial suite C1–C7; confirm each expected detection.
7. Confirm mutations fail for the expected class of reason (order, illegal edge, duplicate, etc.).
8. Compare documentation claims against what the verifiers actually check.
9. Confirm verifiers do not import each other or the website UI.
10. Confirm frozen artifact bytes are unchanged vs freeze record.
11. Record results under a review ID with an honest outcome label.

## Allowed outcome labels

| Label | Meaning |
|-------|--------|
| `PASS — internally reproduced` | Self-administered; construction loop may overlap |
| `PASS — external review` | Independent human outside construction loop |
| `FAIL` | Any required check failed |
| `INCONCLUSIVE` | Environment or procedure incomplete |

**Forbidden:** upgrading a self-review to “externally verified” without a real external reviewer.
