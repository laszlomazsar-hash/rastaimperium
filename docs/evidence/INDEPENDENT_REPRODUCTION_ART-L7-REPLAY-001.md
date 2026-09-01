# Independent reproduction — ART-L7-REPLAY-001

**Status:** FROZEN historical evidence object  
**Invariant:** INV-001 (replay parity)  
**Scope:** Public sealed capsule only — **not** a production EVO-V runtime measurement

This guide lets a technical reviewer reproduce the sealed hashes **without** trusting the Rasta Imperium website UI.

---

## 1. Obtain the artifact

Any one of:

| Source | Path / URL |
|--------|------------|
| Repository | `non-kernel/frontend/data/evidence/artifacts/ART-L7-REPLAY-001.json` |
| Public static | `https://rastaimperium.com/evidence/artifacts/ART-L7-REPLAY-001.json` |
| Repo public | `non-kernel/frontend/public/evidence/artifacts/ART-L7-REPLAY-001.json` |

Do **not** edit the file. If verification fails because you changed it, that is expected.

---

## 2. What you must compute yourself

From the capsule fields only:

1. **Reducer** — apply `events` in order to `initial_state` (twice, for parity).
2. **State hash** — SHA-256 of canonical JSON of terminal state.
3. **Ledger head** — start at `GENESIS`; for each event `head = SHA-256(head + "|" + canonicalize(event))`.
4. **Receipt hash** — SHA-256 of canonical JSON of:

```json
{
  "version_bundle": <from capsule>,
  "event_count": <events.length>,
  "state_hash": <computed>,
  "ledger_head_hash": <computed>,
  "terminal_lifecycle": <terminal.lifecycle_state>,
  "commit_finalized": <terminal.commit_finalized>
}
```

5. **Compare** computed values to `expected.*` in the capsule.

### Canonicalization (`json-canonical-sorted-keys-1`)

- Objects: keys sorted lexicographically; recursive.
- Arrays: order preserved.
- Primitives: standard JSON encoding.

### Lifecycle matrix (illegal edges throw)

```
INGESTED → NORMALIZED
NORMALIZED → VERIFIED
VERIFIED → CORRELATED
CORRELATED → ARCHIVED
ANY → CONTESTED (allowed as explicit target in this public matrix)
```

Event types: `RECORD_INSERT`, `STATE_TRANSITION`, `COMMIT_FINALIZED`.

---

## 3. One-command verification (recommended)

From the repository root, with Node.js ≥ 18:

```bash
node non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs
```

Or against a downloaded copy:

```bash
node non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs ./ART-L7-REPLAY-001.json
```

**Exit code 0** = independent reproduction matches sealed hashes.  
**Exit code 1** = mismatch or read error.

The script embeds the same pure algorithm; it does **not** call the website.

---

## 4. Sealed expected values (for offline comparison)

| Field | Value |
|-------|--------|
| `state_hash` | `5d04d74e0731853e2f2760a1047c7a8547dc860ce9d99525bf2ea715740bc31d` |
| `ledger_head_hash` | `404e19c065afec5e11dac36db6838a5829d25244742d4eaee5c2ad3e6ff2a6de` |
| `receipt_hash` | `3f1705c85e156b965908f9b604c432461ff105333f27481df800b3b37940dc9f` |
| `terminal_lifecycle` | `VERIFIED` |
| `commit_finalized` | `true` |

---

## 5. Negative check

Permute event order (e.g. swap the two `STATE_TRANSITION` events). Independent state hash **must not** equal the sealed `state_hash`.

---

## 6. Freeze policy

`ART-L7-REPLAY-001` is **immutable**.

- Do not change events, expected hashes, or algorithm fields in place.
- Engine or fixture evolution → publish **`ART-L7-REPLAY-002`** (or later).
- Lineage: `001` remains a historical evidence object.

---

## 7. What this does *not* prove

- Production EVO-V deployment health  
- LIVE operational telemetry  
- Cross-implementation parity (still UNAVAILABLE)  
- Benchmark claims (still UNAVAILABLE)  

It proves only: **this sealed public capsule independently reproduces its sealed INV-001 hashes under the documented pure algorithm.**
