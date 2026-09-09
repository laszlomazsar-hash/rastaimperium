# New Rasta Imperium Logos (2026-09-09)

## Status
- **Source integration complete**: RISeal component + both favicons updated to LM monogram + star geometry.
- **Binary JPGs committed on `main`** as real JPEG blobs (not placeholders).
- **Mirrored into Next.js `public/images/`** so the static export (`rsync --delete` to `backend/static/`) cannot drop them.

## Canonical files
- `backend/static/images/logo-lm-3d.jpg` — 3D ornate LM seal (JPEG, 1500×1500)
- `backend/static/images/logo-rasta-imperium-white.jpg` — wordmark on black (JPEG, 1500×750)
- `non-kernel/frontend/public/images/logo-lm-3d.jpg` — same bytes, export source
- `non-kernel/frontend/public/images/logo-rasta-imperium-white.jpg` — same bytes, export source

Production URLs:
- https://rastaimperium.com/images/logo-lm-3d.jpg
- https://rastaimperium.com/images/logo-rasta-imperium-white.jpg

## Already live on main
- `non-kernel/frontend/components/RISeal.tsx`
- `non-kernel/frontend/public/favicon.svg`
- `backend/static/favicon.svg`
