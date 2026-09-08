# New Rasta Imperium Logos (2026-09-08)

## Status
- **Source integration complete**: RISeal component + both favicons updated to LM monogram + star geometry.
- **Binary JPGs**: Available on Google Drive (connector has payload limits for large binaries).

## Google Drive downloads
- 3D ornate LM icon: https://drive.google.com/file/d/19ufZd7o4RCIBW1HVbdNvtDi6hU9snWjp/view
- Clean white logo: https://drive.google.com/file/d/1u9VIHgNlm8xX8rkrJ60k426_0DRgCZoZ/view

## How to finish (30 seconds)
1. Download the two JPGs from Drive.
2. Go to https://github.com/laszlomazsar-hash/rastaimperium/tree/main/backend/static/images
3. Click “Add file” → “Upload files”.
4. Drop them in as:
   - `logo-lm-3d.jpg`
   - `logo-rasta-imperium-white.jpg`
5. Commit. Railway will redeploy automatically.

Placeholders currently live at:
- `backend/static/images/logo-lm-3d.jpg.b64`
- `backend/static/images/logo-rasta-imperium-white.jpg.b64`

## Already live on main
- `non-kernel/frontend/components/RISeal.tsx`
- `non-kernel/frontend/public/favicon.svg`
- `backend/static/favicon.svg`
