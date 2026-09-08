# New Rasta Imperium Logos (2026-09-08)

High-fidelity brand assets + live seal updates.

## Files on Google Drive
- **3D ornate LM icon** (hexagonal gold frame + white LM + star):  
  https://drive.google.com/file/d/19ufZd7o4RCIBW1HVbdNvtDi6hU9snWjp/view
- **Clean white logo** (black field + gold/white LM hexagon + wordmark):  
  https://drive.google.com/file/d/1u9VIHgNlm8xX8rkrJ60k426_0DRgCZoZ/view

## Already integrated (this session)
- `non-kernel/frontend/components/RISeal.tsx` → new LM monogram + central star geometry
- `non-kernel/frontend/public/favicon.svg` → matching new seal
- `backend/static/favicon.svg` → matching new seal

## Remaining (drop the JPGs in)
1. Download both JPGs from Drive.
2. Place them via GitHub web UI or local commit into:
   - `backend/static/images/logo-lm-3d.jpg`
   - `backend/static/images/logo-rasta-imperium-white.jpg`
   - (optional) `non-kernel/frontend/public/images/`
3. Railway will pick up the next push / redeploy.

## Notes
- Existing `assets/logo-lm.svg` already closely matches the clean white version.
- The 3D icon is ideal for hero sections, OG images, and app icons.
- Favicon and header seal are now live with the new geometry.
