# Reproduce Offline

**Direct entry point for independent verification.**

Do not trust the website UI. Reproduce the sealed hashes yourself.

---

## One-command path (Node.js ≥ 18)

From a clone of this repository:

```bash
# Replay parity
node non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs

# Illegal transition rejection
node non-kernel/frontend/scripts/verify-art-l7-reject-001.mjs

# Parity gate (Node + Python agreement)
node non-kernel/frontend/scripts/parity-art-l7.mjs
```

Exit code **0** = independent match against sealed hashes.

---

## Full guide

See the consolidated Pure Verifier README:

→ [`PURE_VERIFIER_README.md`](./PURE_VERIFIER_README.md)

It covers:
- what is verified
- input/output contract
- canonicalization rules
- Node / Python / Go implementations
- expected deterministic results
- explicit non-claims (UNAVAILABLE items)
- freeze policy

---

## Per-capsule guides

- [ART-L7-REPLAY-001](./INDEPENDENT_REPRODUCTION_ART-L7-REPLAY-001.md)
- [ART-L7-REJECT-001](./INDEPENDENT_REPRODUCTION_ART-L7-REJECT-001.md)

---

## Living Evidence Manifest

Machine-readable status of every public claim:

→ [`EVIDENCE_MANIFEST.json`](./EVIDENCE_MANIFEST.json)  
→ [`EVIDENCE_MANIFEST.md`](./EVIDENCE_MANIFEST.md)

---

**Boundary reminder**  
All VERIFIED labels are **capsule-scoped only**.  
Performance, LIVE telemetry, full-kernel parity, and production certification remain **UNAVAILABLE**.
