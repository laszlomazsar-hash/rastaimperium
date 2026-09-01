# Reject-path scope — ART-L7-REJECT-001

Addresses SELF-REVIEW-L7-001 weakness #6.

## What the artifact proves

1. **Deterministic validation/rejection semantics** for the pure public reducer: `VERIFIED → INGESTED` is illegal.
2. **State is not mutated** on rejection in the pure function.
3. **Rejection receipt fields** (message, indices, hashes) are reproducible under the sealed algorithm across Node / Python / Go.

## What the artifact does **not** prove

| Layer | Status |
|-------|--------|
| Production ledger recorded the attempt | **UNAVAILABLE** |
| Operational deployment emitted an audit event | **UNAVAILABLE** |
| LIVE systems enforce the same matrix | **UNAVAILABLE** |
| Full EVO-V kernel rejection path | **UNAVAILABLE** |

## Distinction

```text
pure rejection semantics  ≠  production ledger recording
receipt generation (capsule) ≠ operational receipt issuance
```

ART-L7-REJECT-001 remains **FROZEN**. No upgrade of claim scope without a new artifact that includes production ledger evidence.
