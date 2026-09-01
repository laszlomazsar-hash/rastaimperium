# Independent reproduction — ART-L7-REJECT-001

**Status:** FROZEN historical evidence object  
**Invariant:** INV-002 family (illegal lifecycle transition rejection)  
**Complements:** ART-L7-REPLAY-001 (valid deterministic path)

This capsule proves a **rejection** path: `VERIFIED → INGESTED` is illegal; state must not mutate; a sealed rejection receipt is reproducible.

---

## 1. Obtain the artifact

| Source | Path |
|--------|------|
| Repo | `non-kernel/frontend/data/evidence/artifacts/ART-L7-REJECT-001.json` |
| Public | `https://rastaimperium.com/evidence/artifacts/ART-L7-REJECT-001.json` |

---

## 2. Procedure

1. Start from `initial_state` (`lifecycle_state: VERIFIED`).
2. Apply `events` in order using the same lifecycle matrix as ART-L7-REPLAY-001.
3. On illegal edge: throw / reject — **do not** mutate state.
4. Compute:
   - `state_before_hash` = SHA-256(canonicalize(state before reject))
   - `attempted_ledger_head` = hash-chain of attempted events from `GENESIS`
   - `receipt_hash` = SHA-256(canonicalize(rejection_receipt_payload))
5. Compare to `expected.*`.

### Rejection receipt payload fields

`version_bundle`, `event_count`, `rejection_index`, `rejection_code`, `rejection_message`, `from_state`, `to_state`, `state_before_hash`, `attempted_ledger_head`, `state_mutated` (must be `false`).

---

## 3. One-command verification

```bash
node non-kernel/frontend/scripts/verify-art-l7-reject-001.mjs
```

Exit **0** = independent match.

---

## 4. Sealed expected values

| Field | Value |
|-------|--------|
| `rejection_code` | `ILLEGAL_TRANSITION` |
| `rejection_message` | `illegal transition VERIFIED->INGESTED` |
| `state_before_hash` | `b2cd722b466d447a73441a52d5c3525c69e15aacb39d3d4d191ebe3786c134ac` |
| `attempted_ledger_head` | `8da03a6e21c8335dbf1b4f4a9423fb0d5757965b866f0474511e75e941fecd7d` |
| `receipt_hash` | `4e208e48227cb5387b8d745f2cb5e35db3ec80c2f1844ce4b3b185c0c6a21f5a` |
| `state_mutated` | `false` |

---

## 5. Freeze policy

Immutable. Changes require **ART-L7-REJECT-002+**.

## 6. Not claimed

Production EVO-V · LIVE telemetry · cross-implementation parity · benchmarks.
