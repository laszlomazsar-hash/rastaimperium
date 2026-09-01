# Evidence boundary — L7 public surface

Addresses SELF-REVIEW-L7-001 weakness #5 (co-location).

## What is frozen

Byte-immutable historical objects (do not rewrite):

- ART-L7-REPLAY-001, ART-L7-REJECT-001
- ART-L7-PARITY-001, ART-L7-PARITY-002
- RI-AUDITOR-L7-v1.0.0 identity
- SELF-REVIEW-L7-001 (historical record)

## What is generated

- Static website export from CI
- Manifest TypeScript that *references* artifacts (claims may evolve; artifacts must not silently change)
- Self-review documents (new IDs only)

## What Rasta Imperium claims (capsule scope)

- Deterministic replay and illegal-transition rejection for the sealed public capsules
- Node/Python/Go agreement on those capsules
- Explicit non-claims: LIVE, production ledger, full kernel parity, benchmarks

## What an auditor can verify without the website

1. Download capsule JSON + verifiers from git (or any mirror of the same bytes).
2. Run Node / Python / Go offline.
3. Run mutation + challenge suites offline.
4. Compare hashes to sealed `expected` fields and parity reports.

No website UI is required for the above.

## What still depends on repository integrity

- Believing that git history / GitHub hosting has not been rewritten
- Believing the published SHA-256 list matches what you downloaded
- Absence of a separate third-party archive (IPFS, independent git mirror, signed release tarball) **as of this document**

## What would strengthen the boundary (not implemented here)

- Independent external archive of the frozen kit with third-party timestamping
- Detached signatures over capsule bytes
- Publication outside the primary product monorepo

Until then: **offline verification works; supply-chain trust in the source of the bytes remains.**
