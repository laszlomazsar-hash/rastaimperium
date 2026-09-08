# New Rasta Imperium Logos (2026-09-08)

High-fidelity brand assets added for the site.

## Files (Google Drive)
- **3D ornate LM icon** (hexagonal gold frame + white LM + star):  
  https://drive.google.com/file/d/19ufZd7o4RCIBW1HVbdNvtDi6hU9snWjp/view
- **Clean white logo** (black field + gold/white LM hexagon + wordmark):  
  https://drive.google.com/file/d/1u9VIHgNlm8xX8rkrJ60k426_0DRgCZoZ/view

## Integration steps
1. Download both JPGs.
2. Place them in:
   - `backend/static/images/logo-lm-3d.jpg`
   - `backend/static/images/logo-rasta-imperium-white.jpg`
   (or `non-kernel/frontend/public/` for Next.js public assets)
3. The institutional seal component (`non-kernel/frontend/components/RISeal.tsx`) has already been updated to the new LM + star geometry.
4. Rebuild / redeploy (Railway will pick up the commit).

## Notes
- Existing `assets/logo-lm.svg` and `backend/static/images/logo-lm.jpg` remain as fallbacks.
- The new 3D icon is ideal for hero / og-image / app icon use.
- The clean white version matches the current wordmark treatment on the homepage.
