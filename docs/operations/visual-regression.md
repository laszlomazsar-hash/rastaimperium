# Visual Regression Testing

The repository includes an automated visual regression gate for the **published static website**. It discovers every `index.html` page under `backend/static`, asserts that the published inventory contains **40 routes**, and captures each route at two fixed responsive viewports.

| Viewport | Dimensions | Purpose |
| --- | ---: | --- |
| Desktop | 1440 × 1000 | Detects desktop navigation, grid, hero, and panel-layout regressions. |
| Mobile | 390 × 844 | Detects narrow-layout reflow, overflow, touch-target, and mobile-header regressions. |

The runner compares each capture against a committed approved PNG baseline. A route fails when more than **0.2%** of its viewport pixels differ. This tolerance absorbs anti-aliasing noise while retaining sensitivity to meaningful layout changes.

## Running the check

Run the check from `non-kernel/frontend` after the static output has been refreshed into `backend/static`.

```bash
VISUAL_CHROMIUM_EXECUTABLE="$(command -v google-chrome || command -v chromium)" npm run test:visual
```

On failure, the runner exits non-zero and writes the current and diff images beneath `non-kernel/frontend/visual-regression/artifacts/`. These artifacts are ignored by Git so only intentional baselines enter review.

## Updating an approved layout

Do **not** regenerate snapshots merely to make an unexpected failure disappear. First inspect the affected route and diff image. When the visual change is intentional and approved, run the baseline refresh from the repository’s **Visual Regression** workflow using the `update_baselines` input. That workflow regenerates all 80 screenshots and commits the revised baseline set as a dedicated change.

> The validation workflow runs on pull requests and pushes that modify the served static site, the frontend, or the visual-testing workflow itself. A baseline refresh is manual and explicit so a regression cannot silently approve itself.

## What is covered

The suite tests the rendered static site that users receive, rather than only the route source. This includes shared navigation, headers, primary content panels, hero layouts, card grids, forms, dashboards, and footer structures across every published route and both viewports.
