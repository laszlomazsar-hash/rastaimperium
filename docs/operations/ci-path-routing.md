# CI Path Routing Policy

This repository uses changed-path routing in `infra/.github/workflows/python-package-conda.yml` to keep checks fast and predictable.

## Path groups

### 1) Frontend pages files
- Matchers:
  - `frontend/app/**/page.tsx`
  - `frontend/app/page.tsx`
- Required checks:
  - `frontend-pages-check`
- Not required by default:
  - backend flake8/pytest matrix

### 2) Backend Python files
- Matchers:
  - `backend/**/*.py`
- Required checks:
  - `backend-python-checks` (dependency install, flake8, pytest)

### 3) Shared infra/workflow files
- Matchers:
  - `infra/.github/workflows/**`
  - `infra/scripts/**`
  - `infra/Dockerfile*`
  - `.github/workflows/**`
- Required checks:
  - full matrix for this workflow: `frontend-pages-check` and `backend-python-checks`
  - shared-impact-only validation step: architecture artifact version validation

## Decision rules

- If only **frontend pages** are changed, run only `frontend-pages-check`.
- If only **backend python** is changed, run only `backend-python-checks`.
- If any **shared infra/workflow** file changes, run the full matrix for this workflow.
- If multiple groups match, the union of required jobs runs automatically.

## Contributor guidance

Before pushing, check touched files against the three path groups above to predict required checks.

Quick self-check command:

```bash
git diff --name-only origin/main...HEAD
```

Then compare output paths against the matcher lists in this document.
