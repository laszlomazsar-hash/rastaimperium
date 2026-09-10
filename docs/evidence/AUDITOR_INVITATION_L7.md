# Public auditor invitation — L7 frozen evidence

**Status:** Open invitation  
**Phase:** 10.2  
**Level 2 external human review:** remains OPEN until an independent party actually reports

This is **not** a certification programme, security audit product, bug bounty, or LIVE assurance claim.

---

## What we publish

A **frozen** public evidence package for a narrow claim:

1. Deterministic **valid-path** replay under sealed capsule `ART-L7-REPLAY-001`
2. Deterministic **illegal-transition** rejection under sealed capsule `ART-L7-REJECT-001`
3. Exact hash agreement across **Node.js** and **Python 3** pure verifiers (`ART-L7-PARITY-001`)
4. Offline reproduction without using the website UI

**Authoritative public status:** [`EVIDENCE_MANIFEST.json`](./EVIDENCE_MANIFEST.json) — currently VERIFIED: `ART-L7-REPLAY-001`, `ART-L7-REJECT-001`, `ART-L7-PARITY-001` only.

**Historical note:** `ART-L7-PARITY-002` is historical and is not part of the current Living Evidence Manifest VERIFIED set. Do not treat it as current public VERIFIED evidence.

**Not claimed:** production EVO-V operation, LIVE telemetry, full-kernel parity, complete attack coverage, or external certification.

---

## How to reproduce

1. Obtain the frozen capsules and verifiers (repository paths):
   - `non-kernel/frontend/data/evidence/artifacts/ART-L7-REPLAY-001.json`
   - `non-kernel/frontend/data/evidence/artifacts/ART-L7-REJECT-001.json`
   - `non-kernel/frontend/public/evidence/artifacts/` (same sealed public capsules)
   - `non-kernel/frontend/scripts/verify-art-l7-*.mjs`
   - `non-kernel/frontend/scripts/verify_art_l7_*.py`
2. Read:
   - `docs/evidence/REPRODUCE_OFFLINE.md`
   - `docs/evidence/PURE_VERIFIER_README.md`
   - `docs/evidence/ALGORITHM_CANONICALIZATION.md`
3. Run Node and Python independently against both capsules (from repository root):

```bash
node non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs
python3 non-kernel/frontend/scripts/verify_art_l7_replay_001.py

node non-kernel/frontend/scripts/verify-art-l7-reject-001.mjs
python3 non-kernel/frontend/scripts/verify_art_l7_reject_001.py

# Cross-implementation agreement (Node + Python)
node non-kernel/frontend/scripts/parity-art-l7.mjs
```

Exit code **0** = recomputed values match sealed `expected.*` fields.

4. Optionally run adversarial probes (not certification):
   - `challenge-art-l7.mjs`
   - `mutation-art-l7.mjs`
   - `canon-edge-art-l7.mjs`
5. Compare your hashes to the sealed `expected` fields in the capsules and to the public report `ART-L7-PARITY-001`.

---

## What to report

Either is valuable:

| Result | Meaning |
|--------|--------|
| **Reproduction** | Your independent run matches the sealed hashes |
| **Disagreement** | Your independent run does **not** match — include environment, commands, computed hashes, and which step diverged |

Please **do not** treat silence or agreement as a formal security audit of EVO-V.

---

## Honesty constraints

- Frozen artifacts must not be silently rewritten; improvements use new artifact IDs.
- A self-review is labeled `PASS — internally reproduced`, not external verification.
- Level 2 stays **OPEN** until a reviewer outside the construction loop reports under the protocol.

## Governing rules

No VERIFIED without artifact.  
No artifact without reproducibility.  
No parity without independent agreement.  
No LIVE without live evidence.
