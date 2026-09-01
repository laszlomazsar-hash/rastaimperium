# MUTATION_TESTING.md — deterministic mutation framework

**Script:** `non-kernel/frontend/scripts/mutation-art-l7.mjs`  
**Rule:** Mutations apply to **copies** only. Frozen capsules remain byte-identical.

## Run

```bash
node non-kernel/frontend/scripts/mutation-art-l7.mjs \
  path/to/ART-L7-REPLAY-001.json \
  path/to/ART-L7-REJECT-001.json
```

Exit **0** only if every mutation’s observed outcome equals its documented expected outcome **and** original file hashes are unchanged.

## Mutation catalog (v1)

| ID | Expected |
|----|----------|
| M01 EVENT-INSERT | VERIFY_FAIL |
| M02 EVENT-DELETE | VERIFY_FAIL |
| M03 EVENT-DUPLICATE | THROW |
| M04 EVENT-PERMUTATION | THROW |
| M05 STATE-MUTATION | THROW |
| M06 STATE-KEY-REORDER | VERIFY_PASS |
| M07 EXPECTED state_hash | VERIFY_FAIL |
| M08 EXPECTED receipt_hash | VERIFY_FAIL |
| M09 EXPECTED ledger_head | VERIFY_FAIL |
| M10 VERSION-BUNDLE | VERIFY_FAIL |
| M11 LIFECYCLE illegal | THROW |
| M12 CANON payload reorder | VERIFY_PASS |
| M13 REJECT make-legal | VERIFY_FAIL |
| M14 REJECT expected receipt | VERIFY_FAIL |
| M15 REJECT control | VERIFY_PASS |
| M16 REPLAY control | VERIFY_PASS |

Not exhaustive security testing. Additive to C1–C7.
