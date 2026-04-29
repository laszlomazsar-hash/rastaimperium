# CI Path Routing Policy

This repository routes checks by changed paths to keep CI focused on relevant areas.

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

## Contributor quick check

Use this command to list changed files before pushing:

```bash
git diff --name-only origin/main...HEAD
```

Map each changed file to the table above to predict which checks will run.
