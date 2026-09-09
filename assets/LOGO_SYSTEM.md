# Rasta Imperium — Canonical Logo System

**Status:** Production (2026-09)
**Principle:** One coherent identity. Do not introduce unrelated marks.
**Rule:** Visual identity must reinforce verification, provenance, constitutional order, and institutional seriousness. Never generic AI SaaS, cyberpunk, crypto, or neon theatre.

---

## Hierarchy (mandatory)

| Rank | Role | Implementation | Primary use |
|------|------|----------------|-------------|
| **A** | Primary wordmark | Text “RASTA IMPERIUM” (Cinzel) | Header titles, hero H1, footer brand |
| **B** | LM / Imperium monogram | `RISeal.tsx` (SVG) | Header brand, mobile, compact UI, favicon geometry |
| **C** | Constitutional seal | Same `RISeal` (gold / bone / ink) | Verify, Proof, Trust, Audit, evidence surfaces |
| **D** | 3D hero mark | `logo-lm-3d.jpg` + `RIHeroMark.tsx` | Homepage hero only |
| **E** | Monochrome / white | `logo-rasta-imperium-white.jpg` + seal variants | Dark grounds, OG, print, reserve |

Do not invent a second primary mark.

---

## Canonical production assets

### Raster (photographic / 3-D)

| File | Format | Size | Role |
|------|--------|------|------|
| `non-kernel/frontend/public/images/logo-lm-3d.jpg` | JPEG (real) | 1500×1500 | 3-D ornate LM seal — hero |
| `backend/static/images/logo-lm-3d.jpg` | JPEG (identical bytes) | same | Static-export mirror |
| `non-kernel/frontend/public/images/logo-rasta-imperium-white.jpg` | JPEG (real) | 1500×750 | White wordmark on black |
| `backend/static/images/logo-rasta-imperium-white.jpg` | JPEG (identical bytes) | same | Static-export mirror |

**Production URLs**
- https://rastaimperium.com/images/logo-lm-3d.jpg
- https://rastaimperium.com/images/logo-rasta-imperium-white.jpg

### Vector / component

| Asset | Location | Notes |
|-------|----------|-------|
| `RISeal.tsx` | `non-kernel/frontend/components/RISeal.tsx` | Hexagonal enclosure + LM + central star (witness). Variants: gold, bone, ink. |
| `RIHeroMark.tsx` | `non-kernel/frontend/components/RIHeroMark.tsx` | Hero treatment: raster + restrained CSS perspective hover. |
| `favicon.svg` | `non-kernel/frontend/public/favicon.svg` (+ mirrored in static) | Matches RISeal geometry |
| `icon.png` | `non-kernel/frontend/public/icon.png` | 192×192 |
| `og-image.png` | `non-kernel/frontend/public/og-image.png` | Open Graph |

### Source reference (non-production)

- `assets/logo-lm.svg` — older exploratory SVG. **Not** the live header/favicon mark. Do not re-introduce as primary.

---

## Asset integrity rules (non-negotiable)

1. **Filename extension must match actual magic bytes**
   - `.jpg` / `.jpeg` → starts with `FF D8 FF`
   - `.png` → PNG signature
   - `.svg` → valid `<svg` … `</svg>`
2. **No zero-byte or ≤2-byte placeholders**
3. **No `.b64` placeholder assets**
4. **No PNG content stored under `.jpg`**
5. **Dual-location mirror required for the two canonical logos**
   - Source of truth for export: `non-kernel/frontend/public/images/`
   - Must be byte-identical in `backend/static/images/` after `rsync --delete`
6. **CI enforces the above**
   - `npm run verify:assets` (runs `scripts/verify-asset-integrity.mjs`)
   - Build workflow post-rsync tests both logos exist and size > 2 bytes

Previous failure mode that is now prevented:
> valid binary → wrong frontend/static location → rsync/export removes it → production falls back to older logo

---

## 3-D / motion policy

- **Only** the homepage hero receives depth treatment.
- Implementation: static JPEG + CSS `perspective` / hover transform under `motion-safe`.
- **No** WebGL, continuous spin, particles, or large 3-D dependencies.
- `prefers-reduced-motion: reduce` must yield a beautiful static identity, not a broken one.
- Animation must never carry information required for evidence interfaces.

---

## Usage by surface

| Surface | Treatment |
|---------|-----------|
| Homepage hero | `RIHeroMark` (3-D JPEG + CSS depth) |
| Global header | `RISeal` + wordmark text |
| Mobile header | Compact `RISeal` |
| Verify / Proof / Trust / Audit | Restrained `RISeal` only |
| Footer | Text wordmark (Cinzel) |
| Favicon / tab | `favicon.svg` / `icon.png` |
| Open Graph | `og-image.png` |

---

## Design language (preserve)

- Dignified + ceremonial + evidence-led
- Deep earth / obsidian, Rasta green, Rasta gold (`#F2D675` / `#D4AF37` / `#B88718`), Rasta red accents where justified
- Cinzel for display, Raleway (or system UI) for body, Courier / mono for evidence and hash surfaces
- Sacred / ceremonial geometry (hexagon, star/witness)

---

## Change control

- Any new logo asset must be real binary (correct magic bytes) and mirrored into both `public/images/` and `backend/static/images/`.
- Do not modify EVO-V kernel / verifier / constitutional logic for visual work.
- Prefer documentation and integrity enforcement over new visual variants.

---

*Last formalised: 2026-09-10. Derived from live production inspection and repository audit on main.*
