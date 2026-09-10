# External evaluator briefing

**Audience:** Independent technical evaluators and design-partner due diligence  
**Authority for public status:** [`EVIDENCE_MANIFEST.json`](./EVIDENCE_MANIFEST.json)  
**Site:** https://rastaimperium.com · **Repository:** https://github.com/laszlomazsar-hash/rastaimperium

This is not a certification, security audit product, or LIVE operational assurance claim.

---

## Objective

Determine whether the current **public** evidence can be independently inspected and reproduced offline, without trusting the website UI.

---

## Current VERIFIED baseline (frozen)

| ID | What it covers |
|----|----------------|
| `ART-L7-REPLAY-001` | Deterministic valid-path replay; sealed state / ledger / receipt hashes |
| `ART-L7-REJECT-001` | Illegal lifecycle edge rejection (`ILLEGAL_TRANSITION`); `state_mutated: false` |
| `ART-L7-PARITY-001` | Exact hash agreement of pure Node and Python verifiers on the two capsules above |

Public JSON:

- https://rastaimperium.com/evidence/artifacts/ART-L7-REPLAY-001.json
- https://rastaimperium.com/evidence/artifacts/ART-L7-REJECT-001.json
- https://rastaimperium.com/evidence/artifacts/ART-L7-PARITY-001.json

**Historical / not current VERIFIED:** `ART-L7-PARITY-002` is **not** part of the Living Evidence Manifest VERIFIED set.

---

## Reproduction (exact commands tested by CI)

From a clean clone of the repository root. **No network required after checkout.**

```bash
node non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs
python3 non-kernel/frontend/scripts/verify_art_l7_replay_001.py

node non-kernel/frontend/scripts/verify-art-l7-reject-001.mjs
python3 non-kernel/frontend/scripts/verify_art_l7_reject_001.py

node non-kernel/frontend/scripts/parity-art-l7.mjs
```

Exit code **0** and `"pass": true` indicate recomputed values match sealed `expected.*` fields.

These same commands are executed by `npm run verify:reproducibility` in CI.

Further reading: [`REPRODUCE_OFFLINE.md`](./REPRODUCE_OFFLINE.md) · [`PURE_VERIFIER_README.md`](./PURE_VERIFIER_README.md) · [`AUDITOR_INVITATION_L7.md`](./AUDITOR_INVITATION_L7.md)

---

## Expected results (illustrative)

- **REPLAY:** matching `state_hash`, `ledger_head_hash`, `receipt_hash`
- **REJECT:** `rejection_code: ILLEGAL_TRANSITION`, `state_mutated: false`, matching sealed receipt hashes
- **PARITY:** Node and Python computed hashes identical for both capsules

Compare against the sealed `expected` objects inside each capsule JSON — do not trust this briefing as a substitute for the capsule.

---

## What this evidence does **not** establish

- Full EVO-V kernel verification or production runtime health
- LIVE operational telemetry or performance benchmarks
- Court-ready / certification claims
- Independent organisational attestation of the project as a whole
- That `ART-L7-PARITY-002` is current public VERIFIED evidence

See https://rastaimperium.com/limitations/

---

## Challenge

Please report:

- reproducibility failures (environment, commands, computed vs expected hashes)
- semantic ambiguity in claims or status labels
- evidence gaps relative to public statements
- undocumented assumptions in pure verifiers
- verifier inconsistencies between Node and Python
- provenance weaknesses

Agreement and disagreement are both valuable.

---

## Next step

Inspect evidence → challenge offline → if warranted, discuss a **bounded** institutional pilot:

- https://rastaimperium.com/institutional-pilots/
- https://rastaimperium.com/contact/?intent=design-partner
- https://rastaimperium.com/contact/?intent=audit
