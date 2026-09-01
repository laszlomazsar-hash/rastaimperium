# Independent Implementation C (Go) — Phase 10 Level 3

**Constraint:** Built from the public algorithm + frozen capsule fields only.  
**Not** a line-port of the Node or Python verifiers.

## Runtime

- Language: Go
- Entry (replay): `non-kernel/frontend/scripts/impl-c/verify_art_l7_replay_001.go`
- Entry (reject): `non-kernel/frontend/scripts/impl-c/verify_art_l7_reject_001.go`

## Build & run

```bash
cd non-kernel/frontend/scripts/impl-c
go build -o verify_replay verify_art_l7_replay_001.go
go build -o verify_reject verify_art_l7_reject_001.go

./verify_replay path/to/ART-L7-REPLAY-001.json
./verify_reject path/to/ART-L7-REJECT-001.json
```

Exit **0** + matching `computed.*` hashes required.

## Algorithm note discovered during Level 3

Go’s `encoding/json` **HTML-escapes** `>` as `\u003e` by default.  
Public capsule canonicalization requires **RFC 8259 minimal string escaping without HTML escape**, matching Node `JSON.stringify` / the sealed hashes.

Implementation C therefore uses an explicit `jsonString` helper — this is an algorithm-spec clarification, not a change to frozen capsules.

## Three-way agreement (earned offline)

| Capsule | Node | Python | Go |
|---------|------|--------|-----|
| ART-L7-REPLAY-001 | pass | pass | pass |
| ART-L7-REJECT-001 | pass | pass | pass |

Exact hash agreement across all three for both capsules.

**ART-L7-PARITY-001** remains frozen (Node+Python only).  
Three-way result is recorded as **ART-L7-PARITY-002** (new historical object).

## Scope

Public pure capsule verifiers only. Not full EVO-V kernel parity. Not LIVE.
