# CI Path Routing Policy

This repository uses changed-path routing in `infra/.github/workflows/python-package-conda.yml` to keep checks fast and predictable.

## Domain lanes

### 1) Frontend lane
- Matchers:
  - `frontend/**`
- Required check:
  - `frontend-lane-check`

### 2) Backend lane
- Matchers:
  - `backend/**`
- Required check:
  - `backend-lane-checks` (dependency install, flake8, pytest)

### 3) Evo-v-core lane
- Matchers:
  - `evo-v-core/**`
- Required check:
  - `evo-v-core-lane-check`

### 4) Infra lane
- Matchers:
  - `infra/**`
- Required check:
  - `infra-lane-check`

### 5) Docs lane
- Matchers:
  - `docs/**`
- Required check:
  - `docs-lane-check`

## Shared-impact routing

Shared-impact changes reserve the full lane matrix (all lane jobs run together).

- Shared-impact matchers:
  - `.github/workflows/**`
  - `infra/.github/workflows/**`
  - `infra/scripts/**`
  - `infra/Dockerfile*`
  - `pyproject.toml`
  - `requirements*.txt`
  - `backend/requirements*.txt`
  - `backend/pytest.ini`
  - `backend/.flake8`

## Decision rules

- If only one domain lane matches, run only that lane’s required check.
- If multiple domain lanes match, run the union of those lanes.
- If any shared-impact matcher changes, run the full matrix across all lanes.

## Contributor guidance

Before pushing, check touched files against the lane matchers above to predict required checks.

Quick self-check command:

```bash
git diff --name-only origin/main...HEAD
```
