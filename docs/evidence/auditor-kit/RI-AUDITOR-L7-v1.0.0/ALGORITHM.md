# ALGORITHM.md — public L7 capsule verification

## Canonicalization (`json-canonical-sorted-keys-1`)

- Objects: keys sorted lexicographically; recursive
- Arrays: order preserved
- Primitives: standard JSON encoding (no spaces)

## Hash

`SHA-256` over UTF-8 bytes of the canonical string, hex digest lowercase.

## Lifecycle matrix

```
INGESTED    → NORMALIZED
NORMALIZED  → VERIFIED
VERIFIED    → CORRELATED
CORRELATED  → ARCHIVED
ANY         → CONTESTED   (allowed as explicit target in this public matrix)
```

Illegal edges **throw** and must not mutate state.

## Event types

- `RECORD_INSERT` `{ record_id, payload }`
- `STATE_TRANSITION` `{ to_state }`
- `COMMIT_FINALIZED`

## ART-L7-REPLAY-001 receipt payload fields (ordered by canonical key sort)

`commit_finalized`, `event_count`, `ledger_head_hash`, `state_hash`, `terminal_lifecycle`, `version_bundle`

Ledger link: `head_0 = "GENESIS"`; `head_{i+1} = SHA-256(head_i + "|" + canonicalize(event_i))`

## ART-L7-REJECT-001 rejection receipt payload fields

`attempted_ledger_head`, `event_count`, `from_state`, `rejection_code`, `rejection_index`, `rejection_message`, `state_before_hash`, `state_mutated`, `to_state`, `version_bundle`

## Scope

These algorithms apply only to the published public capsules. They are not a claim of full EVO-V kernel equivalence.
