# Visual regression suite

Evidence-first UI checks using Playwright Chromium + Pixelmatch.

## Prerequisites

1. Static export present at `backend/static` (CI/deploy pipeline output).
2. Chromium for Playwright:

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

## After design system / commercial upgrades

When routes or major layout change (homepage conversion, royal panels, new pages):

1. Deploy or build static export into `backend/static`.
2. Confirm route count (script prints error if inventory drifts).
3. Run `npm run test:visual:update`.
4. Commit `tests/visual-baselines/**` with a message that references the design change.
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
