# `/public/images/`

Source of truth for raster images copied into the Next.js static export
(`out/` → `backend/static/images/` via `rsync --delete`).

Canonical vector identity lives in `RISeal` (`non-kernel/frontend/components/RISeal.tsx`),
not in this directory. Logo hierarchy and integrity rules:
[`assets/LOGO_SYSTEM.md`](../../../../assets/LOGO_SYSTEM.md).

## Canonical active assets (keep at these paths)

| File | Role | Referenced by |
|------|------|----------------|
| `logo-lm-3d.jpg` | 3-D LM hero mark (1500×1500) | Homepage `RIHeroMark`; required CI mirror |
| `logo-rasta-imperium-white.jpg` | White wordmark on black (1500×750) | Rank E reserve / print / OG fallback; required CI mirror at this exact path |
| `blueprint-9layer.jpg` | 9-layer sovereign stack | Live `/blueprint/` route |

Do not rename or relocate these files without updating:

- `components/RIHeroMark.tsx`
- `app/blueprint/page.tsx`
- `scripts/verify-asset-integrity.mjs`
- `.github/workflows/build-static-site.yml`
- `assets/LOGO_SYSTEM.md`

## Archived legacy assets

`archive/` holds promotional / historical rasters with **no current source or
static-HTML references**. Filenames are preserved. They remain in git so the
decision is reversible. Do not re-promote them onto live routes without a
new design decision.

| File | Why archived |
|------|----------------|
| `archive/architecture-stack.jpg` | 9-layer title poster; unused. Live stack image is `blueprint-9layer.jpg`. |
| `archive/evolution-v.jpg` | Evolution-V book/promotional poster; unused. |
| `archive/founder.jpg` | Founder portrait; unused on current routes. |

The next static export will publish these under `/images/archive/…`.

## Naming and integrity

- kebab-case filenames
- extension must match magic bytes (JPEG starts `FF D8 FF`)
- no placeholders, zero-byte files, or encoded stand-in blobs
- unused assets must be **audited before removal**; prefer archive over delete

Phase 33 (2026-09): inventory, reference audit, and archive of unreferenced
promotional rasters. No RISeal, OG, kernel, verifier, or route changes.
