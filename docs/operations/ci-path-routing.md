# CI Path Routing Policy

This repository routes checks by changed paths to keep CI focused on relevant areas and to prevent cross-domain Python import bleed.

> Maintainer note: when updating Python path globs, lint/test targets, or deployment/import entrypoints in CI, update this file **and** `infra/.github/workflows/python-package-conda.yml` in the same PR.

## Canonical Python domain ownership

| Python domain root | CI trigger glob(s) | Lint target(s) | Test target(s) | Deployment / import entrypoints |
| --- | --- | --- | --- | --- |
| `backend/src` | `backend/**/*.py` | `backend/src` | `backend/tests` via `pytest tests` (run from `backend/`) | Import root: `PYTHONPATH=backend/src` (repo root jobs) and `PYTHONPATH=src` (backend job cwd). |
| `evo-v-core` | `evo-v-core/**/*.py`, `evo-v-core/requirements*.txt` | `evo-v-core/app` | `evo-v-core/tests` via `pytest evo-v-core/tests` | Import root: `PYTHONPATH=evo-v-core`; package entry domain is `evo-v-core/app`. |
| Shared Python tooling (`infra/scripts`, `tools`, top-level requirements/workflow paths) | `infra/**`, `infra/.github/workflows/**`, `pyproject.toml`, `requirements*.txt` | `infra/scripts`, `tools` (in backend lane) | N/A directly; triggers full matrix for safety | Deployment/control entrypoints: `infra/.github/workflows/python-package-conda.yml`, `infra/scripts/validate_architecture_version.py`, `tools/check_codex_package_roots.py`. |

## Path groups and checks

| Path group | Matchers | Checks that run |
| --- | --- | --- |
| `frontend/pages` | `frontend/app/**/page.tsx` | `frontend-pages-check` |
| `backend/python` | `backend/**/*.py` | `backend-python-checks` |
| `evo-v/evo-v-core` | `evo-v-core/**` | `evo-v-core-checks` |
| `shared infra` | `infra/**`, `infra/.github/workflows/**`, `pyproject.toml`, `requirements*.txt` | Full matrix: `frontend-pages-check`, `backend-python-checks`, `evo-v-core-checks` |

## Decision rules

- If changes match only one non-shared group, only that group's check job runs.
- If changes include `shared infra`, the full matrix runs.
- If multiple non-shared groups match, CI runs the union of those group jobs.

### Cross-root `tests/` mapping convention

Because repository-level `tests/` includes both backend-leaning and core-leaning checks, CI classifies changed test filenames into a domain before choosing pytest scope:

- **Core tests (`core_tests=true`)**: filenames starting with `test_evo_v_` or with prefixes tied to core runtime concepts (`reasoning_agent`, `topology`, `governance`, `replay`, `proof`, `lyapunov`, `belief`, `epistemic`, etc.).
- **Backend tests (`backend_tests=true`)**: filenames starting with backend/API/safety prefixes (`backend`, `health`, `deployment`, `policy_update`, `compliance`, `canonical_json`, `measure_runtime_bridge`, `snapshot_freeze`, etc.).
- **Ambiguous mapping (`test_scope_ambiguous=true`)**: unknown filename pattern, or a mixed backend+core test change in the same diff.

Routing behavior:

- If only backend tests changed and mapping is unambiguous, backend job runs targeted pytest for those changed files.
- If only core tests changed and mapping is unambiguous, evo-v-core job runs targeted pytest for those changed files.
- If mapping is ambiguous (or both domains are touched), both jobs fall back to full test suites for safety.

### Examples

- `tests/test_backend_stability.py` changed alone:
  - `backend_tests=true`, `core_tests=false`, `test_scope_ambiguous=false`
  - Backend lane runs targeted `pytest ../tests/test_backend_stability.py`.
- `tests/test_evo_v_self_healing.py` changed alone:
  - `backend_tests=false`, `core_tests=true`, `test_scope_ambiguous=false`
  - Evo-v-core lane runs targeted `pytest tests/test_evo_v_self_healing.py`.
- `tests/test_backend_stability.py` + `tests/test_evo_v_self_healing.py`:
  - both domain outputs true, ambiguous true
  - both lanes run full pytest scopes.
- `tests/test_new_experiment.py` (unknown prefix):
  - ambiguous true
  - both lanes keep full-suite fallback until naming is made explicit.

## Explicit anti-patterns (unsafe routing)

- `app/**` as a trigger glob:
  - Unsafe because both domains may have `app/` folders with different import roots and dependency sets.
  - This can under-trigger (missing backend checks) or over-trigger (running unrelated lane jobs).
- `src/**` as a trigger glob:
  - Unsafe because `backend/src` is a scoped domain, while other `src` directories can exist with unrelated ownership.
  - It removes ownership clarity and makes CI routing ambiguous.
- `flake8 .` at repository root:
  - Unsafe because it merges independent Python domains into one lint scope.
  - This can mask cross-domain import mistakes, force incorrect `PYTHONPATH`, and create flaky outcomes from unrelated files.
- Repository-root `pytest` across all trees:
  - Unsafe as a default in this monorepo because archived/experimental trees can fail independently of active domains.
  - It obscures ownership and introduces noisy failures unrelated to the changed paths.

## Temporary mitigation status (effective April 29, 2026)

To stabilize the legacy Python workflow while domain ownership is being tightened:

- CI uses targeted `python -m compileall` on active domains (`backend/src`, `evo-v-core`, and `tests`) instead of root-recursive `flake8 .` and repository-root `pytest`.
- This still catches syntax regressions in active code paths while eliminating false-negative signal from archived/experimental trees not covered by current ownership boundaries.
- Domain-scoped quality gates remain in place via `ruff` for active backend/core sources.

### Follow-up issue

- **#908 — Reintroduce scoped lint/test by domain in legacy Python workflow**
  - Re-enable per-domain lint/test execution (including pytest scopes) once archived/experimental directories are fully isolated from active CI ownership.

## PR reviewer checklist

- [ ] Changed Python path routing?
- [ ] Changed import roots (`PYTHONPATH` / package root assumptions)?
- [ ] Changed deployment or CI entrypoints?
- [ ] If any box above is checked, were both this document and the workflow updated together?

## Contributor quick check

Use this command to list changed files before pushing:

```bash
git diff --name-only origin/main...HEAD
```

Map each changed file to the tables above to predict which checks will run.
