# Cross-implementation parity — L7 frozen capsules

**Scope:** Public sealed capsules only (`ART-L7-REPLAY-001`, `ART-L7-REJECT-001`).  
**Not claimed:** Full EVO-V kernel parity · LIVE production · benchmarks.

## Implementations

| Impl | Language | Entry |
|------|----------|--------|
| A | Node.js | `non-kernel/frontend/scripts/verify-art-l7-*.mjs` |
| B | Python 3 | `non-kernel/frontend/scripts/verify_art_l7_*.py` |

Both consume the **same frozen JSON capsules**. Neither trusts the website UI.

## Gate

```bash
node non-kernel/frontend/scripts/parity-art-l7.mjs
```

Exit **0** only if:

1. Node passes both capsules  
2. Python passes both capsules  
3. Computed hash fields **exactly match** across implementations  

On mismatch: public status remains **UNAVAILABLE / MISMATCH DETECTED** — do not force VERIFIED.

## Compared fields

### ART-L7-REPLAY-001
`state_hash` · `receipt_hash` · `ledger_head_hash`

### ART-L7-REJECT-001
`state_before_hash` · `attempted_ledger_head` · `receipt_hash`

## Independence notes

- Separate source files (JS vs Python)
- Separate runtimes (V8 vs CPython)
- Shared only: sealed capsule JSON + documented algorithm (sorted-key canonical JSON + SHA-256)
- Not a second copy of the same script

## Promotion rule (historical) and sealed status

**Promotion gate (historical):** parity was promoted to public VERIFIED only after this gate passed and a sealed parity report was published. Prior working name in process notes: `PROOF-PARITY-001`.

**Current sealed status:** **`ART-L7-PARITY-001`** (`cross_implementation_parity`) is **VERIFIED** — capsule-scoped only (independent Node + Python agreement on the sealed public L7 capsules). See the Living Evidence Manifest.

**Still not established / UNAVAILABLE:** production authority, LIVE telemetry, benchmarks, full EVO-V kernel parity, and certification/compliance claims.
