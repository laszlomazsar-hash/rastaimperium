# Independent implementation audit — Node / Python / Go

**Date context:** Phase 10.1  
**Capsules:** ART-L7-REPLAY-001, ART-L7-REJECT-001 (frozen)

## Import / dependency audit

| Impl | Imports | Cross-impl import | Website UI |
|------|---------|-------------------|------------|
| Node (`verify-art-l7-*.mjs`) | `crypto`, `fs`, `path`, `url` | None | None |
| Python (`verify_art_l7_*.py`) | `hashlib`, `json`, `sys`, `copy`, `pathlib` | None | None |
| Go (`impl-c/verify_art_l7_*.go`) | stdlib only | None | None |

## Computation independence

Each implementation:

- reads the same frozen JSON capsule path from disk;
- computes state / ledger / receipt hashes locally;
- does not call another verifier’s process or parse another verifier’s stdout as authority;
- does not read website status pages.

Shared knowledge is limited to the **documented algorithm** (lifecycle matrix, sorted-key canonicalization, SHA-256, receipt field sets).

Go uses an explicit `jsonString` helper to avoid `encoding/json` HTML-escaping — algorithm conformance, not shared Node source.

## Result

**PASS** — no hidden cross-implementation or UI dependency found in the public verifiers.

## Residual note

All three verifiers live in the same repository as institutional claims (see EVIDENCE_BOUNDARY_L7.md). That is a **distribution** trust concern, not a code-import dependency.
