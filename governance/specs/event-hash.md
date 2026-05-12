# Event Hash Canonicalization and Ordering Rules (v1)

This specification defines deterministic event ordering and canonical hash computation for governance events conforming to `governance/schemas/event.v1.json`.

## 1) Ordering Rules

1. `global_sequence` is the primary and authoritative ordering field.
2. Events MUST be append-only and strictly increasing by `global_sequence`.
3. `prev_event_hash` MUST equal the `event_hash` of the immediately preceding event (`global_sequence - 1`).
4. For `global_sequence = 0` (genesis), `prev_event_hash` MUST be explicit `null`.
5. If two events are observed out of order, verification systems MUST reorder by `global_sequence` before replay/hash-link validation and MUST fail verification if any sequence index is missing.

## 2) Canonicalization Requirements

Before hash computation, serialize event material using these normalization rules:

1. **UTF-8 NFC normalization**: All string values MUST be normalized to Unicode NFC and encoded as UTF-8.
2. **Explicit nulls**: Optional/missing semantic fields MUST be represented as explicit `null` where defined by schema (for example `service_principal`, `cert_profile`, `prev_event_hash` for genesis).
3. **Lexicographic key ordering**: All JSON object keys MUST be sorted in ascending lexicographic order recursively.
4. **Fixed numeric representation**:
   - Integers: base-10 without sign for non-negative values (e.g. `0`, `42`).
   - No exponent notation.
   - No trailing decimal point or fractional zeros for integer-typed fields.
5. **Timestamp format**: `timestamp_utc` MUST remain UTC ISO-8601 with millisecond precision (for example `2026-05-12T00:00:00.000Z`).
6. **No insignificant whitespace**: Canonical JSON text MUST omit insignificant whitespace.

## 3) Event Hash Computation

1. Build a canonical hash input object from the full event object **excluding** the `event_hash` field.
2. Canonicalize the object using Section 2 rules.
3. Serialize to canonical JSON bytes (UTF-8).
4. Compute `SHA-256` over the serialized bytes.
5. Encode digest as lowercase hexadecimal (64 chars) and store as `event_hash`.

Pseudo-definition:

`event_hash = HEX_LOWER(SHA256(CANONICAL_JSON(event_without_event_hash)))`

## 4) Verification Procedure

For each event in `global_sequence` order:

1. Validate schema compliance.
2. Recompute expected `event_hash` per Section 3 and compare to stored value.
3. Validate hash-link integrity:
   - `global_sequence = 0` => `prev_event_hash == null`
   - `global_sequence > 0` => `prev_event_hash == prior.event_hash`
4. Fail fast on first mismatch and emit a deterministic counterexample artifact.

## 5) Determinism Constraints

Given identical input events and identical version bundle values, hash outputs and replay outcomes MUST be identical across runs.
