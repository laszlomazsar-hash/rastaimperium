# Contributing

## PR checks and workflow context

GitHub evaluates pull request checks using workflow files from the pull request/base commit context (not only the latest default-branch workflow file). If a branch protection rule still requires a legacy workflow check name, unrelated PRs can be blocked even when the new CI passes.

### Troubleshooting stuck required checks

- Confirm which required check is blocking under **PR → Checks** or **Branch protection required status checks**.
- If the required check maps to an old workflow/job name, update branch protection to require the canonical replacement workflow/check instead.
- Re-run checks after updating required statuses; older pending checks may remain visible but no longer gate merge once required checks are aligned.

Canonical replacement workflow: [`CI` (`.github/workflows/ci.yml`)](.github/workflows/ci.yml).
