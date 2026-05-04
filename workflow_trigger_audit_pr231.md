# Workflow trigger audit for PR #231

Date: 2026-05-04 (UTC)

## 1) Workflow files and `on:` triggers/path filters

- `.github/workflows/python-package-conda.yml`
  - `push` on branches `main|master` with paths:
    - `backend/**`
    - `evo-v-core/**`
    - `tests/**`
    - `scripts/**`
    - `requirements*.txt`
    - `.github/workflows/python-package-conda.yml`
  - `pull_request` on branches `main|master` with same paths.
  - `workflow_dispatch`.

- `.github/workflows/ci.yml`
  - `pull_request` with paths:
    - `backend/src/**`
    - `backend/requirements*.txt`
    - `evo-v-core/**`
    - `frontend/**`
    - `tests/**`
    - `.github/workflows/ci.yml`

- `.github/workflows/build-linux.yml`
  - `push` (no branch/path filter)
  - `pull_request` (no branch/path filter)

- `.github/workflows/deploy-pages.yml`
  - `push` on branch `main` with paths:
    - `frontend/app/**/page.tsx`
    - `infra/**`
    - `infra/.github/workflows/deploy-pages.yml`
    - `.github/workflows/deploy-pages.yml`
  - `workflow_dispatch`.

## 2) Workflows with no path filters (can run for frontend-only changes)

- `.github/workflows/build-linux.yml` runs on every `push` and every `pull_request`, regardless of changed files.

## 3) PR #231 changed files vs `python-package-conda.yml` filters

I could not directly retrieve PR #231 changed-file metadata in this environment because:

- `gh` CLI is not installed.
- local git clone has no configured remote to query/fetch PR refs.

Given current workflow config, `python-package-conda.yml` should only run for PRs targeting `main|master` where at least one changed file matches:

- `backend/**`, `evo-v-core/**`, `tests/**`, `scripts/**`, `requirements*.txt`, or `.github/workflows/python-package-conda.yml`.

If PR #231 only changed frontend paths, then it should *not* trigger `python-package-conda.yml` from its own `pull_request` trigger.

## 4) Branch protection / required checks that may run unconditionally

I could not inspect GitHub branch protection settings from this local environment (no remote and no authenticated GitHub API tooling).

Still, one unconditionally-triggered check source is present in-repo:

- `.github/workflows/build-linux.yml` defines unconditional `pull_request` and `push` triggers and includes Python setup/tests, so Python jobs/checks can appear on any PR including frontend-only changes.

## 5) Likely exact trigger source for Python jobs on PR #231

From repository configuration alone, the most likely source of Python jobs on a frontend-only PR is:

- `.github/workflows/build-linux.yml` `on: pull_request` with no path filters.

Secondary possibilities (not confirmable here without PR metadata + repo settings):

- PR #231 actually included files matching `python-package-conda.yml` paths.
- A required status check tied to a different workflow that runs unconditionally.
