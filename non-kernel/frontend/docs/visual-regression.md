# Visual regression suite

Evidence-first UI checks using Playwright Chromium + Pixelmatch.

## Prerequisites

1. Static export present at `backend/static` (CI/deploy pipeline output).
2. Chromium for Playwright (CI installs Playwright Chromium if system Chrome is missing):

```bash
cd non-kernel/frontend
npx playwright install chromium
```

## Commands

```bash
# Compare against approved baselines
npm run test:visual

# Rebuild baselines after intentional visual changes
npm run test:visual:update
```

Optional:

```bash
VISUAL_EXPECTED_ROUTES=54 npm run test:visual
VISUAL_CHROMIUM_EXECUTABLE=/path/to/chrome npm run test:visual
```

## GitHub Actions — baseline refresh

After a large design wave (royal mesh, header/footer chrome, homepage conversion):

1. Confirm **Build Static Site** has finished on `main` and `backend/static` is current.
2. Open **Actions → Visual Regression → Run workflow**.
3. Set **update_baselines = true**.
4. After green run, bot commits `tests/visual-baselines/**` with `test: refresh visual regression baselines`.
5. Re-run the same workflow with **update_baselines = false** to confirm a clean pass.

Do not auto-update baselines on every push — that would mask regressions.

## Deploy lag diagnosis (2026-09-06)

**Symptom:** Live homepage briefly still showed `Claim home-trust-pillars not found in evidence manifest` after `fix(home)` landed on `main`.

**Findings:**

| Surface | `home-trust-pillars` |
|---------|----------------------|
| Source `app/page.tsx` | Removed (`841dab3`) |
| Repo `backend/static/index.html` | Absent (export current) |
| Live `rastaimperium.com` | Absent (same Next build id as GitHub static) |

**Conclusion:** Static export pipeline is healthy. Perceived lag was Railway eventual deploy delay and/or intermediate CDN/cache during the push storm — not a failed `build-static-site` export. Tech subpages (e.g. `/technology/evo-v/`) were already live while homepage HTML caught up.

**If live diverges from `backend/static` again:**

1. Check latest **Build Static Site** run (export job + optional Railway CLI job).
2. Diff `curl -sL https://rastaimperium.com/` vs `backend/static/index.html` build comment IDs.
3. Set `RAILWAY_TOKEN` + `RAILWAY_SERVICE` for CLI force-redeploy, or redeploy from the Railway dashboard.

## After design system / commercial upgrades

When routes or major layout change:

1. Deploy or build static export into `backend/static`.
2. Confirm route count (script prints error if inventory drifts; default `expectedRouteCount` is **54**).
3. Run baseline update via Actions (above) or locally `npm run test:visual:update`.
4. Commit baselines only when diffs match expected design changes.
5. Run `npm run test:visual` to confirm a clean pass.

## Thresholds

- Max changed pixel ratio: **0.2%** (`maxDiffPixelRatio = 0.002`)
- Viewports: desktop 1440×1000, mobile 390×844
- Animations/transitions disabled via injected overlay; PRNG/Date fixed for stability

## Artifacts

Failures write under `visual-regression/artifacts/{desktop,mobile}/`:

- `*.actual.png`
- `*.diff.png`

Do not commit artifact diffs; only approve baselines under `tests/visual-baselines/`.
