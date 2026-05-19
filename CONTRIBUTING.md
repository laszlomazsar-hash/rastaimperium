# Contributing

## PR checks and workflow context

GitHub evaluates pull request checks using workflow files from the pull request/base commit context (not only the latest default-branch workflow file). If a branch protection rule still requires a legacy workflow check name, unrelated PRs can be blocked even when the new CI passes.

### Troubleshooting stuck required checks

- Confirm which required check is blocking under **PR → Checks** or **Branch protection required status checks**.
- If the required check maps to an old workflow/job name, update branch protection to require the canonical replacement workflow/check instead.
- Re-run checks after updating required statuses; older pending checks may remain visible but no longer gate merge once required checks are aligned.

Canonical replacement workflow: [`CI` (`.github/workflows/ci.yml`)](.github/workflows/ci.yml).

## Branch Base Requirements

Feature branches must be created from `main` and periodically rebased onto `main` while the PR is open. This preserves merge ancestry, keeps diff calculations stable, and avoids CI ambiguity.

### Troubleshooting `no merge base`

If CI or local tooling reports `no merge base`, run:

- `git fetch origin main`
- `git rebase origin/main`

Then push your rebased branch and re-run checks.

When ancestry is unavailable, CI may switch to a full-scan fallback. This mode is slower, but it is safe and intentionally conservative.
