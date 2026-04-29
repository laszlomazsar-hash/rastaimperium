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
