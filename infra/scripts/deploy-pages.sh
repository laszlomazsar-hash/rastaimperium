#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
STATIC_EXPORT="$REPO_ROOT/backend/static"

if [[ ! -f "$STATIC_EXPORT/index.html" ]]; then
  echo "Canonical static export is missing: $STATIC_EXPORT/index.html" >&2
  exit 1
fi

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

if git clone --quiet --branch gh-pages --single-branch . "$TMP_DIR" 2>/dev/null; then
  :
else
  git clone --quiet . "$TMP_DIR"
  (
    cd "$TMP_DIR"
    git checkout --orphan gh-pages
    git rm -rf . >/dev/null 2>&1 || true
  )
fi

(
  cd "$TMP_DIR"
  git rm -rf . >/dev/null 2>&1 || true
  # Pages publishes the exact export served by the production ASGI app.
  cp -R "$STATIC_EXPORT/." "$TMP_DIR/"
  touch .nojekyll
  git add -A

  if git diff --cached --quiet; then
    echo "No changes to publish."
    exit 0
  fi

  git commit -m "Deploy static site"
  git push origin gh-pages
)
