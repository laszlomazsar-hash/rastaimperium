#!/usr/bin/env bash
set -euo pipefail

# Fast-fail guard: legacy top-level runtime trees are deprecated.
# Runtime changes belong in backend/src only.

base_ref=""
if [[ -n "${GITHUB_BASE_REF:-}" ]]; then
  base_ref="origin/${GITHUB_BASE_REF}"
  git fetch --no-tags --depth=1 origin "${GITHUB_BASE_REF}" >/dev/null 2>&1 || true
elif git rev-parse --verify HEAD~1 >/dev/null 2>&1; then
  base_ref="HEAD~1"
fi

if [[ -n "$base_ref" ]]; then
  diff_range="$base_ref...HEAD"
  changed_files="$(git diff --name-only "$diff_range")"
else
  changed_files="$(git diff --name-only HEAD~1...HEAD 2>/dev/null || true)"
fi

if echo "$changed_files" | rg -q '^evo-v/.+\.py$'; then
  echo "ERROR: Runtime Python changes under deprecated legacy tree evo-v/ are blocked."
  echo "Use backend/src for runtime changes."
  echo "$changed_files" | rg '^evo-v/.+\.py$' || true
  exit 1
fi

echo "Legacy runtime guard passed."
