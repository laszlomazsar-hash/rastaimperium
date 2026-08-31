# Audit findings

## Visual regression workflow

The Visual Regression workflow failed before screenshot comparison because `non-kernel/frontend/scripts/visual-regression.mjs` still expected 40 routes while the committed static export contained 41 routes. After rebuilding the current frontend, the correct inventory is 42 routes: the existing `/blueprint/` route plus the new `/thanks-and-praise/` route.

The first post-count local run reported 71 failures across 82 captures because the committed static export and approved PNG baselines were out of sync. The local export did not yet contain `/thanks-and-praise/`, and `/blueprint/` had no approved baseline. Representative desktop and mobile diffs showed broad duplicated and shifted shared content across many routes, which is consistent with stale baseline/export state rather than a page-specific layout regression.

The current export was rebuilt with `NODE_ENV=production`, copied into `backend/static`, and approved baselines were regenerated for 42 routes at the documented desktop and mobile viewports. The suite then passed all 84 captures.

## Thanks & Praise route

The deployed page was inspected at `https://rastaimperium.com/thanks-and-praise/`. It returned the expected page content and navigation. A desktop DOM check found no horizontal overflow: document width and body width were both 1274px in a 1280px viewport. The desktop capture shows the hero, dedication panel, and opening section aligned within the Rasta Royal composition. The mobile capture shows readable heading wrapping and a contained dedication card within the 390px viewport. No route-specific layout defect was confirmed.

## Resolution

- Updated the visual runner route contract to 42 routes.
- Updated the visual-regression documentation to 42 routes and 84 captures.
- Rebuilt and synchronized the current static export.
- Regenerated the approved baseline set after visual inspection.
- Added production and investigation notes for future release audits.
- Diagnosed and removed conflict-marker contamination from generated static HTML introduced during concurrent rebase resolution; 84 affected generated files were cleaned.
- Re-ran the local suite successfully: 84 captures passed across 42 routes and 2 viewports, including `/thanks-and-praise/` at desktop and mobile widths.
- Diagnosed the reported mobile exception: `backend/static/governance/codex/index.html` referenced `/_next/static/chunks/app/governance/codex/page-7f29154db142c5a2.js`, but that client chunk was absent from the published export, causing hydration to fail. A clean production export restored the Governance/Codex chunks and retained all 42 routes.
- The rebuilt export now passes the local visual suite across all 84 captures, including `/governance/codex/` and `/thanks-and-praise/` on mobile.
- The five remaining remote baseline differences were resolved by regenerating approved baselines inside the GitHub Ubuntu/Chromium environment used by the regression job. The refresh completed successfully in run [33398960393](https://github.com/laszlomazsar-hash/rastaimperium/actions/runs/33398960393), and the subsequent normal comparison passed all 84 captures in run [33399233891](https://github.com/laszlomazsar-hash/rastaimperium/actions/runs/33399233891).
