# RI-AUDITOR-L7-v1.0.0

External auditor reproduction package for the frozen L7 public evidence chain.

**Phase 9 is paused at this milestone.** No UI required.

## Contents of this directory

| File | Role |
|------|------|
| `VERSION` | Kit identity and scope |
| `REPRODUCE.md` | Offline verification procedure |
| `ALGORITHM.md` | Canonicalization + matrix + hash rules |
| `CHECKSUMS` | SHA-256 of kit files |
| `run-parity.mjs` | Node+Python parity gate (flat layout) |
| Capsules | See paths below |
| Verifiers | See paths below |

## Obtaining sealed capsules

**Preferred (same content):**

- `non-kernel/frontend/data/evidence/artifacts/ART-L7-REPLAY-001.json`
- `non-kernel/frontend/data/evidence/artifacts/ART-L7-REJECT-001.json`
- `non-kernel/frontend/data/evidence/artifacts/ART-L7-PARITY-001.json`

**Public URLs (after deploy):**

- `/evidence/artifacts/ART-L7-REPLAY-001.json`
- `/evidence/artifacts/ART-L7-REJECT-001.json`
- `/evidence/artifacts/ART-L7-PARITY-001.json`

Copy them into this directory as:

`ART-L7-REPLAY-001.json` · `ART-L7-REJECT-001.json` · `ART-L7-PARITY-001.json`

## Obtaining verifiers

From the repository:

```text
non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs
non-kernel/frontend/scripts/verify-art-l7-reject-001.mjs
non-kernel/frontend/scripts/verify_art_l7_replay_001.py
non-kernel/frontend/scripts/verify_art_l7_reject_001.py
```

Copy into this directory (flat layout) **or** invoke with explicit paths:

```bash
node non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs path/to/ART-L7-REPLAY-001.json
python3 non-kernel/frontend/scripts/verify_art_l7_replay_001.py path/to/ART-L7-REPLAY-001.json
```

## One-shot parity (after flat layout assembled)

```bash
node run-parity.mjs   # EXIT 0 required
sha256sum -c CHECKSUMS
```

## Governing rules

1. No VERIFIED without artifact  
2. No artifact without reproducibility  
3. No parity without independent agreement  
4. No LIVE without live evidence  

Unavailable claims (benchmarks, full EVO-V kernel parity, production telemetry) remain **UNAVAILABLE** on purpose.
