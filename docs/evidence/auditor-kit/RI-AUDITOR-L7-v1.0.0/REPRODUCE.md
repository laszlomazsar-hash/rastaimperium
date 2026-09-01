# REPRODUCE.md — external auditor package (RI-AUDITOR-L7-v1.0.0)

**Do not trust the website.** Use this package offline.

## Requirements

- Node.js ≥ 18
- Python 3 ≥ 3.9

## Steps

### 1. Valid path (INV-001)

```bash
node verify-art-l7-replay-001.mjs ./ART-L7-REPLAY-001.json
python3 verify_art_l7_replay_001.py ./ART-L7-REPLAY-001.json
```

Both must exit **0**. Computed `state_hash`, `receipt_hash`, `ledger_head_hash` must match the sealed `expected` fields and each other.

### 2. Illegal path (INV-002 family)

```bash
node verify-art-l7-reject-001.mjs ./ART-L7-REJECT-001.json
python3 verify_art_l7_reject_001.py ./ART-L7-REJECT-001.json
```

Both must exit **0**. Rejection with `state_mutated: false` and sealed receipt hashes.

### 3. Cross-implementation parity

```bash
node run-parity.mjs
```

Exit **0** only if Node and Python both pass both capsules **and** computed hashes agree exactly.

### 4. Compare to frozen parity report

Open `ART-L7-PARITY-001.json` and confirm the agreed hashes match your independent run.

### 5. Optional integrity

```bash
sha256sum -c CHECKSUMS
```

## What success means

You have independently confirmed the sealed public L7 capsules.

## What success does **not** mean

- Full EVO-V kernel parity
- LIVE production telemetry
- Homepage benchmark claims
- Cryptographic key infrastructure

## Freeze policy

Artifacts in this kit are **immutable**. Algorithm or fixture changes require new artifact IDs (`…-002+`) and a new kit version.
