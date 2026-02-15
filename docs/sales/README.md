# Sales Assets Module

This directory is the source-of-truth for acquisition and enterprise sales collateral.

## Versioning convention

Use semantic versions for collateral packs:

- `MAJOR`: positioning shift, pricing model reset, or package restructuring.
- `MINOR`: narrative, proof-point, or deck-section additions that do not break core positioning.
- `PATCH`: copy edits, formatting cleanup, typo fixes, and updated metric snapshots.

Suggested tag format:

- `sales-v<major>.<minor>.<patch>` (example: `sales-v1.3.2`)
- Optional dated release note: `sales-v1.3.2+2026-02-15`

## Update cadence

- **Monthly**: refresh telemetry figures and reference metrics.
- **Quarterly**: review pricing tiers, package names, and objection responses.
- **Per release milestone**: update deck and one-pager to reflect architecture/deployment blueprint changes.

## Canonical files

- `pitch-narrative-outline.md`
- `one-pager.md`
- `pricing-matrix.md`
- `objection-handling-notes.md`
- `deck-sections.md`

## Build step for binary exports

Run from repository root:

```bash
bash docs/sales/build-exports.sh
```

The script will:

1. Sync markdown source files to `public/sales-assets/source/`.
2. Build `PDF` and `PPTX` exports into `public/sales-assets/exports/` via `pandoc` (if installed).

> If `pandoc` is unavailable, markdown sources remain usable and can still be shared directly.
