#!/usr/bin/env bash
set -euo pipefail

: "${NEXT_PUBLIC_API_URL:?NEXT_PUBLIC_API_URL is required}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$REPO_ROOT"
npm run build

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
  cp -R "$REPO_ROOT/out/." "$TMP_DIR/"
  touch .nojekyll
  git add -A

  if git diff --cached --quiet; then
    echo "No changes to publish."
    exit 0
  fi

  git commit -m "Deploy static site"
  git push origin gh-pages
)
