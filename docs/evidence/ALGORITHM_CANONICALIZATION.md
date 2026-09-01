# Canonicalization profile — `json-canonical-sorted-keys-1`

**Status:** Normative for sealed public L7 capsules  
**Discovered via:** Independent Implementation C (Go) during Phase 10 Level 3

## Requirements

1. **Objects:** keys sorted lexicographically (Unicode code point order / UTF-8 byte order for ASCII keys used in capsules); recursive.
2. **Arrays:** element order preserved.
3. **Numbers:** integers without fractional part encoded as decimal integers (no trailing `.0`).
4. **Booleans / null:** `true` / `false` / `null`.
5. **Strings:** RFC 8259 JSON string encoding with **minimal escaping**:
   - Escape: `"`, `\\`, and control characters (`\b` `\f` `\n` `\r` `\t`, and `\uXXXX` for other controls).
   - **Do not** HTML-escape `<` or `>` (e.g. do **not** emit `\u003e` for `>`).
   - This matches common `JSON.stringify` behaviour in JavaScript and the sealed capsule hashes.

## Interoperability note (Go)

Go’s standard `encoding/json` **defaults to HTML-escaping** `<>&` in strings. Implementations using Go must disable that behaviour (custom encoder or explicit string writer) to conform to this profile.

## Hash

`SHA-256` over the UTF-8 bytes of the canonical string; digest as lowercase hex.

## Frozen evidence

This clarification documents the algorithm already implied by the sealed hashes. It does **not** modify:

- `ART-L7-REPLAY-001`
- `ART-L7-REJECT-001`
- `ART-L7-PARITY-001`
- `ART-L7-PARITY-002`
- `RI-AUDITOR-L7-v1.0.0`
